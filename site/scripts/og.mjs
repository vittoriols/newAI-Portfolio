// Generates public/og.png, the preview image shown when the site is shared on
// LinkedIn and elsewhere. Runs before every build, so it follows the content.
import path from 'node:path';
import sharp from 'sharp';
import { ROOT, loadProfile } from '../src/lib/content.mjs';

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// Splits text into lines of at most `max` characters, on word boundaries.
function wrap(text, max) {
  const lines = [];
  let cur = '';
  for (const w of text.split(/\s+/)) {
    if ((cur + ' ' + w).trim().length > max) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  return lines;
}

const profile = await loadProfile();

const [first, ...rest] = profile.name.split(' ');
const thesis = wrap(profile.tagline ?? profile.thesis, 40).slice(0, 3);
const font = "Archivo, 'Helvetica Neue', Arial, 'DejaVu Sans', sans-serif";

// Portrait on the right, faded into the night blue like the hero of the site.
const photo = await sharp(path.join(ROOT, 'src/assets/portrait-office.jpg'))
  .resize(560, 630, { fit: 'cover', position: 'attention' }).toBuffer();
const fade = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="560" height="630">
  <defs><linearGradient id="f" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.45" stop-color="#fff"/></linearGradient></defs>
  <rect width="560" height="630" fill="url(#f)"/></svg>`);
const faded = await sharp(photo).composite([{ input: fade, blend: 'dest-in' }]).png().toBuffer();

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0A1422"/>
  <g font-family="${font}" fill="#EDF1F6">
    <text x="64" y="120" font-size="26" font-weight="600" fill="#FFD08A">${esc(profile.role)}</text>
    <text x="64" y="222" font-size="92" font-weight="800" letter-spacing="-3">${esc(first)}</text>
    <text x="64" y="318" font-size="92" font-weight="800" letter-spacing="-3">${esc(rest.join(' '))}</text>
    ${thesis.map((l, i) => `<text x="64" y="${400 + i * 38}" font-size="28" fill="#C9D4E2">${esc(l)}</text>`).join('')}
    <rect x="64" y="${400 + thesis.length * 38 + 10}" width="300" height="56" rx="28" fill="#F2B45A"/>
    <text x="92" y="${400 + thesis.length * 38 + 46}" font-size="24" font-weight="700" fill="#0A1422">Ask me about my work</text>
  </g>
</svg>`;

await sharp(Buffer.from(svg))
  .composite([{ input: faded, left: 640, top: 0 }])
  .png({ compressionLevel: 9 })
  .toFile(path.join(ROOT, 'public/og.png'));
console.log('public/og.png generated');
