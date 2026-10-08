// Asks AskMe the questions in content/askme/checks.yaml and checks the answers.
// Uses the same context and prompt as the Worker, calling Groq directly.
//
//   GROQ_API_KEY=... npm run askme:check
//
// The key is read from the environment and only used here: it never reaches the site.

import { loadAll, loadAskMeChecks } from '../src/lib/content.mjs';
import { buildContextFromContent, systemPrompt } from '../src/lib/askme.mjs';
import { completionOptions, DEFAULT_MODEL } from '../src/lib/askme-prompt.mjs';

const MODEL = process.env.ASKME_MODEL ?? DEFAULT_MODEL;
const key = process.env.GROQ_API_KEY;

async function ask(system, question) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...completionOptions(MODEL, { temperature: 0 }), messages: [{ role: 'system', content: system }, { role: 'user', content: question }] }),
    });
    if (res.status === 429) {
      const wait = Number(res.headers.get('retry-after') ?? 20);
      console.log(`  rate limited, waiting ${wait}s`);
      await new Promise((r) => setTimeout(r, wait * 1000));
      continue;
    }
    if (!res.ok) throw new Error(`Groq ${res.status}: ${await res.text()}`);
    return (await res.json()).choices[0].message.content;
  }
  throw new Error('Groq kept rate limiting the requests');
}

async function main() {
  if (!key) throw new Error('Set GROQ_API_KEY in the environment.');
  const context = await buildContextFromContent(await loadAll());
  const system = systemPrompt(context);
  const checks = await loadAskMeChecks();
  console.log(`AskMe check: ${checks.length} questions, model ${MODEL}, context ~${Math.round(system.length / 4)} tokens\n`);

  let failed = 0;
  for (const c of checks) {
    const answer = await ask(system, c.question);
    const low = answer.toLowerCase();
    const missing = (c.expect ?? []).filter((t) => !low.includes(String(t).toLowerCase()));
    const forbidden = (c.forbid ?? []).filter((t) => low.includes(String(t).toLowerCase()));
    const ok = !missing.length && !forbidden.length;
    if (!ok) failed += 1;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${c.question}`);
    if (missing.length) console.log(`      missing: ${missing.join(', ')}`);
    if (forbidden.length) console.log(`      should not contain: ${forbidden.join(', ')}`);
    if (!ok || process.env.VERBOSE) console.log(`      answer: ${answer.replace(/\s+/g, ' ').slice(0, 400)}`);
  }
  console.log(`\n${checks.length - failed} of ${checks.length} passed.`);
  if (failed) process.exit(1);
}

main().catch((err) => {
  console.error(`askme:check failed: ${err.message}`);
  process.exit(1);
});
