// Step 2 of the audio overview: turns the approved script into
// public/audio/overview.mp3 with Gemini text-to-speech (two voices), then
// updates the audio entry in content/profile.yaml.
//
//   GEMINI_API_KEY=... npm run audio:voice
//
// Also: "npm run audio:voice -- --compress <file.mp3>" only compresses an
// existing recording (for example one made by hand with NotebookLM).

import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import os from 'node:os';
import path from 'node:path';
import ffmpeg from 'ffmpeg-static';
import YAML from 'yaml';
import { ROOT } from '../src/lib/content.mjs';

const run = promisify(execFile);
const MODEL = process.env.GEMINI_TTS_MODEL ?? 'gemini-2.5-flash-preview-tts';
const VOICES = { Alex: process.env.VOICE_A ?? 'Kore', Sam: process.env.VOICE_B ?? 'Puck' };
const SCRIPT = path.join(ROOT, 'content/askme/audio-script.md');
const OUT = path.join(ROOT, 'public/audio/overview.mp3');
const SAMPLE_RATE = 24000;

function readScript(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) throw new Error('audio-script.md has no front matter. Run "npm run audio:script" first.');
  const meta = YAML.parse(m[1]);
  const lines = m[2].split('\n').map((l) => l.trim()).filter(Boolean);
  return { meta, lines };
}

// Gemini returns 16-bit mono PCM; chunks keep each request well within its limits.
function chunk(lines, max = 1800) {
  const out = [];
  let cur = [];
  for (const l of lines) {
    if (cur.join('\n').length + l.length > max && cur.length) { out.push(cur); cur = []; }
    cur.push(l);
  }
  if (cur.length) out.push(cur);
  return out;
}

async function speak(lines, key) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `Read this conversation between Alex and Sam in a warm, natural podcast tone:\n${lines.join('\n')}` }] }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: Object.entries(VOICES).map(([speaker, voiceName]) => ({
              speaker, voiceConfig: { prebuiltVoiceConfig: { voiceName } },
            })),
          },
        },
      },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  const data = (await res.json()).candidates?.[0]?.content?.parts?.find((p) => p.inlineData)?.inlineData?.data;
  if (!data) throw new Error('Gemini returned no audio.');
  return Buffer.from(data, 'base64');
}

function wav(pcm) {
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVE', 8);
  h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(SAMPLE_RATE, 24); h.writeUInt32LE(SAMPLE_RATE * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write('data', 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}

async function toMp3(input, output) {
  await run(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-i', input, '-ac', '1', '-b:a', '64k', '-ar', '44100', output]);
  const { stderr } = await run(ffmpeg, ['-hide_banner', '-i', output]).catch((e) => e);
  const d = stderr.match(/Duration: (\d+):(\d+):(\d+)/);
  return d ? `${Number(d[1]) * 60 + Number(d[2])}:${d[3]}` : null;
}

async function updateProfile(duration, madeWith) {
  const file = path.join(ROOT, 'content/profile.yaml');
  const doc = YAML.parseDocument(await readFile(file, 'utf8'));
  doc.setIn(['audio', 'duration'], duration);
  doc.setIn(['audio', 'recorded'], new Date().toISOString().slice(0, 7));
  doc.setIn(['audio', 'madeWith'], madeWith);
  await writeFile(file, doc.toString());
}

async function main() {
  const args = process.argv.slice(2);
  const tmp = await mkdtemp(path.join(os.tmpdir(), 'audio-'));
  try {
    if (args[0] === '--compress') {
      if (!args[1]) throw new Error('Pass the file to compress: npm run audio:voice -- --compress overview.mp3');
      const duration = await toMp3(path.resolve(args[1]), OUT);
      await updateProfile(duration, args[2] ?? 'NotebookLM');
      console.log(`public/audio/overview.mp3 updated (${duration}).`);
      return;
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error('Set GEMINI_API_KEY in the environment.');
    const { meta, lines } = readScript(await readFile(SCRIPT, 'utf8'));
    if (meta.approved !== true) throw new Error('The script is not approved yet. Review content/askme/audio-script.md and set "approved: true".');

    const parts = [];
    for (const [i, c] of chunk(lines).entries()) {
      console.log(`Generating part ${i + 1}...`);
      parts.push(await speak(c, key));
    }
    const wavFile = path.join(tmp, 'overview.wav');
    await writeFile(wavFile, wav(Buffer.concat(parts)));
    const duration = await toMp3(wavFile, OUT);
    await updateProfile(duration, 'Gemini text-to-speech, from a reviewed script');
    console.log(`public/audio/overview.mp3 updated (${duration}). The script is shown as the transcript under the player.`);
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error(`audio:voice failed: ${err.message}`);
  process.exit(1);
});
