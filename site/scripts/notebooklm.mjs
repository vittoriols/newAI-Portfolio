// Writes the site content as a single plain-text file for NotebookLM, in the
// Downloads folder: the same context AskMe uses (every file in /content),
// without the citation codes.
//
//   npm run context:notebooklm
//
// Also run by "npm run update". The file is overwritten each time.

import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ROOT, loadAll } from '../src/lib/content.mjs';
import { buildContextFromContent } from '../src/lib/askme.mjs';

const FILE_NAME = 'VLS_Portfolio_context_NotebookLM.txt';

const downloads = path.join(os.homedir(), 'Downloads');
const outDir = existsSync(downloads) ? downloads : path.join(ROOT, 'dist');
const out = path.join(outDir, FILE_NAME);

const context = await buildContextFromContent(await loadAll());
const date = new Date().toISOString().slice(0, 10);
const body = context.text
  .replace(/\s*\[\[[a-z0-9-]+\]\]/gi, '')
  .replace(/^#+\s*/gm, '')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

const text = `PROFESSIONAL CONTEXT: ${context.name.toUpperCase()}
Generated on ${date} from the content of the portfolio website.
Clients are confidential: they are described by industry and must never be named.

${body}
`;

await mkdir(outDir, { recursive: true });
await writeFile(out, text, 'utf8');
console.log(`NotebookLM file written: ${out} (${Math.round(text.length / 1024)} kB)`);
