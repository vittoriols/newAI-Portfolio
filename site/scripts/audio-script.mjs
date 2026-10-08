// Step 1 of the audio overview: writes a two-host dialogue from the AskMe
// context into content/askme/audio-script.md, for you to review.
//
//   GROQ_API_KEY=... npm run audio:script
//
// The file is saved with "approved: false". Read it, fix anything wrong, set
// "approved: true", then run "npm run audio:voice".

import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { ROOT, loadAll } from '../src/lib/content.mjs';
import { buildContextFromContent } from '../src/lib/askme.mjs';
import { completionOptions, DEFAULT_MODEL } from '../src/lib/askme-prompt.mjs';

const MODEL = process.env.AUDIO_SCRIPT_MODEL ?? DEFAULT_MODEL;
const OUT = path.join(ROOT, 'content/askme/audio-script.md');
const HOSTS = ['Alex', 'Sam'];

const instructions = `Write the script of a 4-minute audio overview, in English, about the professional profile below.
Two hosts, ${HOSTS[0]} and ${HOSTS[1]}, talk about the person in the third person, like a short podcast episode.
- About 550 words. Every line starts with "${HOSTS[0]}:" or "${HOSTS[1]}:". No stage directions, no sound effects.
- Use only facts from the profile. Do not round dates, do not add numbers, do not invent anecdotes.
- Never name clients: describe them by industry.
- Open with what the person does today, end with how to get in touch through the website.`;

async function main() {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error('Set GROQ_API_KEY in the environment.');
  const context = await buildContextFromContent(await loadAll());
  const profileText = context.text.replace(/\[\[[a-z0-9-]+\]\]/g, '');

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...completionOptions(MODEL, { maxTokens: 1500, temperature: 0.6 }),
      messages: [{ role: 'system', content: instructions }, { role: 'user', content: profileText }],
    }),
  });
  if (!res.ok) throw new Error(`Groq ${res.status}: ${await res.text()}`);
  const script = (await res.json()).choices[0].message.content.trim();

  const lines = script.split('\n').filter((l) => HOSTS.some((h) => l.startsWith(`${h}:`)));
  if (lines.length < 10) throw new Error('The model did not return a dialogue. Run the command again.');

  const date = new Date().toISOString().slice(0, 10);
  await writeFile(OUT, `---\ngenerated: ${date}\nmodel: ${MODEL}\nhosts: [${HOSTS.join(', ')}]\n# Set to true after reading and correcting the script.\napproved: false\n---\n\n${lines.join('\n\n')}\n`);
  console.log(`Script written to content/askme/audio-script.md (${lines.length} lines, ~${script.split(/\s+/).length} words).`);
  console.log('Review it, set "approved: true", then run: npm run audio:voice');
}

main().catch((err) => {
  console.error(`audio:script failed: ${err.message}`);
  process.exit(1);
});
