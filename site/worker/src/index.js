// AskMe proxy on Cloudflare Workers.
//
// Keeps the Groq key out of the site: the browser sends the conversation here,
// the Worker adds the context published by the site and the secret key, and
// streams Groq's answer back.
//
// Settings (wrangler.toml [vars] and secrets):
//   GROQ_API_KEY     secret, set with "npx wrangler secret put GROQ_API_KEY"
//   CONTEXT_URL      https://<site>/askme/context.json
//   ALLOWED_ORIGINS  comma-separated origins allowed to call the Worker
//   MODEL            Groq model id

import { systemPrompt, sanitizeMessages } from '../../src/lib/askme-prompt.mjs';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const CONTEXT_TTL = 3600;

// Best-effort limit per visitor IP, held in memory by each Worker instance.
// For a hard limit, add a Cloudflare rate limiting rule in front of the Worker.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 20;
const hits = new Map();

function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_REQUESTS;
}

function cors(origin, env) {
  const allowed = (env.ALLOWED_ORIGINS ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!origin || !allowed.includes(origin)) return null;
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(status, body, headers = {}) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } });
}

async function loadContext(env, ctx) {
  const cache = caches.default;
  const key = new Request(env.CONTEXT_URL);
  let res = await cache.match(key);
  if (!res) {
    res = await fetch(env.CONTEXT_URL, { cf: { cacheTtl: CONTEXT_TTL } });
    if (!res.ok) throw new Error(`context ${res.status}`);
    res = new Response(res.body, res);
    res.headers.set('Cache-Control', `max-age=${CONTEXT_TTL}`);
    ctx.waitUntil(cache.put(key, res.clone()));
  }
  return res.json();
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin');
    const headers = cors(origin, env);

    if (request.method === 'OPTIONS') {
      return headers ? new Response(null, { status: 204, headers }) : new Response(null, { status: 403 });
    }
    if (request.method !== 'POST') return json(405, { error: 'Use POST.' });
    if (!headers) return json(403, { error: 'Origin not allowed.' });

    const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
    if (limited(ip)) return json(429, { error: 'Too many questions. Try again in a few minutes.' }, headers);

    let body;
    try { body = await request.json(); } catch { return json(400, { error: 'Invalid JSON.' }, headers); }
    const messages = sanitizeMessages(body?.messages);
    if (!messages.length || messages.at(-1).role !== 'user') {
      return json(400, { error: 'The last message must be a question.' }, headers);
    }

    let context;
    try { context = await loadContext(env, ctx); } catch {
      return json(502, { error: 'Context unavailable.' }, headers);
    }

    const upstream = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: env.MODEL,
        stream: true,
        temperature: 0.3,
        max_tokens: 600,
        messages: [{ role: 'system', content: systemPrompt(context) }, ...messages],
      }),
    });

    if (upstream.status === 429) return json(429, { error: 'The assistant is busy. Try again in a minute.' }, headers);
    if (!upstream.ok || !upstream.body) return json(502, { error: 'The assistant could not answer.' }, headers);

    return new Response(upstream.body, {
      headers: { ...headers, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store' },
    });
  },
};
