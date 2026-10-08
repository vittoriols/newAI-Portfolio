// Tests the Worker without Cloudflare or Groq: both are replaced by fakes.
//   node --test worker/test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';

const store = new Map();
globalThis.caches = {
  default: {
    match: async (req) => store.get(req.url)?.clone(),
    put: async (req, res) => { store.set(req.url, res); },
  },
};

const calls = [];
globalThis.fetch = async (url, init = {}) => {
  calls.push({ url: String(url), init });
  if (String(url).endsWith('context.json')) {
    return new Response(JSON.stringify({ name: 'Test Person', sources: { about: { title: 'About', anchor: '#about' } }, text: 'Facts.' }));
  }
  const sse = 'data: {"choices":[{"delta":{"content":"Hello [[about]]"}}]}\n\ndata: [DONE]\n\n';
  return new Response(sse, { headers: { 'Content-Type': 'text/event-stream' } });
};

const { default: worker } = await import('./src/index.js');
const env = {
  GROQ_API_KEY: 'secret-key',
  CONTEXT_URL: 'https://example.github.io/site/askme/context.json',
  ALLOWED_ORIGINS: 'https://example.github.io',
  MODEL: 'test-model',
};
const ctx = { waitUntil: () => {} };
const post = (body, origin = 'https://example.github.io', ip = '1.1.1.1') =>
  worker.fetch(new Request('https://askme.test/', {
    method: 'POST',
    headers: { Origin: origin, 'Content-Type': 'application/json', 'CF-Connecting-IP': ip },
    body: JSON.stringify(body),
  }), env, ctx);

test('refuses origins that are not allowed', async () => {
  const res = await post({ messages: [{ role: 'user', content: 'Hi' }] }, 'https://evil.example');
  assert.equal(res.status, 403);
});

test('answers preflight for the allowed origin', async () => {
  const res = await worker.fetch(new Request('https://askme.test/', { method: 'OPTIONS', headers: { Origin: 'https://example.github.io' } }), env, ctx);
  assert.equal(res.status, 204);
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), 'https://example.github.io');
});

test('streams the answer and keeps the key server-side', async () => {
  calls.length = 0;
  const res = await post({ messages: [{ role: 'user', content: 'Who are you?' }] });
  assert.equal(res.status, 200);
  assert.match(await res.text(), /Hello \[\[about\]\]/);
  const groq = calls.find((c) => c.url.includes('groq'));
  assert.equal(groq.init.headers.Authorization, 'Bearer secret-key');
  const sent = JSON.parse(groq.init.body);
  assert.equal(sent.model, 'test-model');
  assert.equal(sent.messages[0].role, 'system');
  assert.match(sent.messages[0].content, /Never name clients/);
});

test('trims long conversations and messages', async () => {
  calls.length = 0;
  const messages = Array.from({ length: 30 }, (_, i) => ({ role: i % 2 ? 'assistant' : 'user', content: 'x'.repeat(5000) }));
  messages.push({ role: 'user', content: 'last' });
  await post({ messages }, undefined, '2.2.2.2');
  const sent = JSON.parse(calls.find((c) => c.url.includes('groq')).init.body).messages;
  assert.ok(sent.length <= 9, `sent ${sent.length} messages`);
  assert.ok(sent.every((m) => m.content.length <= 800));
});

test('rejects a conversation that does not end with a question', async () => {
  const res = await post({ messages: [{ role: 'assistant', content: 'Hi' }] }, undefined, '3.3.3.3');
  assert.equal(res.status, 400);
});

test('limits requests per visitor', async () => {
  let last;
  for (let i = 0; i < 21; i++) last = await post({ messages: [{ role: 'user', content: 'q' }] }, undefined, '9.9.9.9');
  assert.equal(last.status, 429);
});
