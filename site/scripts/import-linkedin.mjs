// Compares a LinkedIn data export with content/ and shows what changed.
//
//   npm run import:linkedin -- <path to the export .zip>           (shows the differences)
//   npm run import:linkedin -- <path to the export .zip> --write   (applies them)
//
// Only a fixed list of files and columns is read. Messages, connections,
// phone numbers and the address in Profile.csv are never opened or copied.
// With --write, only roles (new ones, changed dates) are updated in
// experience.yaml; summaries and highlights you wrote stay as they are.

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { unzipSync, strFromU8 } from 'fflate';
import YAML from 'yaml';
import { ROOT, loadExperience, loadProfile, loadExtraCertifications, loadCredly } from '../src/lib/content.mjs';
import { parseCsv } from './lib/csv.mjs';

const FILES = {
  'Positions.csv': ['Company Name', 'Title', 'Location', 'Started On', 'Finished On'],
  'Profile.csv': ['Headline', 'Summary'],
  'Certifications.csv': ['Name', 'Url', 'Authority', 'Started On', 'Finished On'],
  'Publications.csv': ['Name', 'Published On', 'Publisher'],
};

const MONTHS = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
// "Apr 2026" -> "2026-04"
function toMonth(value) {
  const m = String(value ?? '').trim().match(/^([A-Z][a-z]{2})\s+(\d{4})$/);
  return m ? `${m[2]}-${String(MONTHS[m[1]]).padStart(2, '0')}` : null;
}

const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const norm = (s) => slug(s ?? '');

function readExport(zipPath, buffer) {
  const wanted = new Set(Object.keys(FILES));
  const files = unzipSync(buffer, { filter: (f) => wanted.has(path.basename(f.name)) });
  const out = {};
  for (const [name, data] of Object.entries(files)) {
    const rows = parseCsv(strFromU8(data));
    const keep = FILES[path.basename(name)];
    out[path.basename(name)] = rows.map((r) => Object.fromEntries(keep.map((k) => [k, r[k] ?? ''])));
  }
  if (!out['Positions.csv']) throw new Error(`Positions.csv not found in ${zipPath}`);
  return out;
}

async function main() {
  const args = process.argv.slice(2);
  const write = args.includes('--write');
  const zipPath = args.find((a) => !a.startsWith('--'));
  if (!zipPath) throw new Error('Pass the path of the LinkedIn export: npm run import:linkedin -- ~/Downloads/Basic_LinkedInDataExport.zip');

  const data = readExport(zipPath, new Uint8Array(await readFile(zipPath)));
  const roles = await loadExperience();
  // A role can use a cleaner title on the site; linkedinTitle keeps the match.
  const byTitle = new Map(roles.map((r) => [norm(r.linkedinTitle ?? r.title), r]));

  const added = [];
  const changed = [];
  for (const p of data['Positions.csv']) {
    const start = toMonth(p['Started On']);
    const end = toMonth(p['Finished On']);
    const title = p.Title.trim();
    const existing = byTitle.get(norm(title));
    if (!existing) {
      added.push({ id: slug(title), title, company: p['Company Name'].trim(), start, ...(end && { end }), summary: '', highlights: [] });
      continue;
    }
    const diff = {};
    if (existing.start !== start) diff.start = [existing.start, start];
    if ((existing.end ?? null) !== end) diff.end = [existing.end ?? null, end];
    if (Object.keys(diff).length) changed.push({ role: existing, diff });
  }
  const linkedinTitles = new Set(data['Positions.csv'].map((p) => norm(p.Title)));
  const missing = roles.filter((r) => !linkedinTitles.has(norm(r.linkedinTitle ?? r.title)));

  console.log(`LinkedIn: ${data['Positions.csv'].length} positions. Site: ${roles.length} roles.\n`);
  if (!added.length && !changed.length) console.log('Roles: already in line with LinkedIn.');
  for (const a of added) console.log(`+ new role     ${a.title} (${a.start} – ${a.end ?? 'present'})`);
  for (const c of changed) {
    const parts = Object.entries(c.diff).map(([k, [from, to]]) => `${k} ${from ?? 'present'} -> ${to ?? 'present'}`);
    console.log(`~ dates        ${c.role.title}: ${parts.join(', ')}`);
  }
  for (const m of missing) console.log(`? not on LinkedIn  ${m.title} (kept on the site)`);

  const profile = await loadProfile();
  const headline = data['Profile.csv']?.[0]?.Headline;
  if (headline && norm(headline) !== norm(profile.headline)) {
    console.log(`\nHeadline on LinkedIn differs from profile.yaml:\n  LinkedIn: ${headline}\n  Site:     ${profile.headline}`);
  }

  // Certifications that are on LinkedIn but neither on Credly nor in certifications-extra.yaml.
  const known = new Set([...(await loadCredly()).badges.map((b) => norm(b.name)), ...(await loadExtraCertifications()).flatMap((c) => [norm(c.name), norm(c.linkedinName)])]);
  const extra = (data['Certifications.csv'] ?? []).filter((c) => !/credly|youracclaim/.test(c.Url) && !known.has(norm(c.Name)));
  if (extra.length) {
    console.log('\nCertifications on LinkedIn that are not on Credly nor in certifications-extra.yaml:');
    for (const c of extra) console.log(`  ${c['Started On']}  ${c.Authority}  ${c.Name}${c['Finished On'] ? ` (expires ${c['Finished On']})` : ''}`);
  }

  if (!write) {
    if (added.length || changed.length) console.log('\nNothing written. Run again with --write to update content/experience.yaml.');
    return;
  }
  if (!added.length && !changed.length) return;

  const file = path.join(ROOT, 'content/experience.yaml');
  const doc = YAML.parseDocument(await readFile(file, 'utf8'));
  for (const c of changed) {
    const node = doc.contents.items.find((n) => n.get('id') === c.role.id);
    if ('start' in c.diff) node.set('start', c.diff.start[1]);
    if ('end' in c.diff) c.diff.end[1] ? node.set('end', c.diff.end[1]) : node.delete('end');
  }
  for (const a of added) doc.contents.items.unshift(doc.createNode(a));
  await writeFile(file, doc.toString({ lineWidth: 0 }));
  console.log(`\nUpdated content/experience.yaml: ${added.length} roles added, ${changed.length} changed.`);
  if (added.length) console.log('Write a summary and highlights for the new roles before publishing.');
}

main().catch((err) => {
  console.error(`import:linkedin failed: ${err.message}`);
  process.exit(1);
});
