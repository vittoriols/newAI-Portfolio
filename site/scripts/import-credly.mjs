// Imports every public badge from Credly into content/credly/badges.json
// and downloads the images of the badges shown on the site.
//
//   npm run import:credly
//
// If Credly does not answer, the committed snapshot stays as it is and the
// build continues: the site never depends on Credly being up.

import { mkdir, readFile, writeFile, access, readdir, unlink } from 'node:fs/promises';
import sharp from 'sharp';
import path from 'node:path';
import { loadProfile, ROOT } from '../src/lib/content.mjs';
import { selectFeatured } from '../src/lib/badges.mjs';

const SNAPSHOT = path.join(ROOT, 'content/credly/badges.json');
const IMAGE_DIR = path.join(ROOT, 'public/badges');
const UA = 'vls-portfolio-import (+https://github.com/vittoriols/newAI-Portfolio)';

async function fetchJson(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

async function fetchAllBadges(username) {
  const all = [];
  let page = 1;
  let totalPages = 1;
  do {
    const data = await fetchJson(`https://www.credly.com/users/${username}/badges.json?page=${page}`);
    all.push(...data.data);
    totalPages = data.metadata?.total_pages ?? 1;
    page += 1;
  } while (page <= totalPages);
  return all;
}

function normalize(b) {
  const t = b.badge_template ?? {};
  const issuers = (b.issuer?.entities ?? []).map((e) => e.entity?.name).filter(Boolean);
  return {
    id: b.id,
    name: t.name?.trim(),
    issuer: issuers.join(' / '),
    issuedOn: b.issued_at_date ?? null,
    expiresOn: b.expires_at_date ?? null,
    type: t.type_category ?? null,
    level: t.level ?? null,
    url: `https://www.credly.com/badges/${b.id}`,
    image: b.image_url ?? t.image_url ?? null,
    skills: (t.skills ?? []).map((s) => s.name).slice(0, 8),
  };
}

// Credly serves resized variants under /size/WxH/ on the same path.
function sizedImageUrl(url, size = 220) {
  return url.replace('https://images.credly.com/images/', `https://images.credly.com/size/${size}x${size}/images/`);
}

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

// Keeps public/badges in sync with the badges shown: downloads the missing
// images as small WebP files and removes the ones no longer used.
async function syncImages(badges) {
  await mkdir(IMAGE_DIR, { recursive: true });
  const wanted = new Set(badges.map((b) => `${b.id}.webp`));
  let downloaded = 0;
  for (const b of badges) {
    if (!b.image) continue;
    const file = path.join(IMAGE_DIR, `${b.id}.webp`);
    if (await exists(file)) continue;
    const res = await fetch(sizedImageUrl(b.image, 340), { headers: { 'User-Agent': UA } });
    if (!res.ok) {
      console.warn(`  image not downloaded for "${b.name}" (${res.status})`);
      continue;
    }
    const input = Buffer.from(await res.arrayBuffer());
    await sharp(input).resize(160, 160, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 82 }).toFile(file);
    downloaded += 1;
  }
  let removed = 0;
  for (const f of await readdir(IMAGE_DIR)) {
    if (!wanted.has(f)) { await unlink(path.join(IMAGE_DIR, f)); removed += 1; }
  }
  return { downloaded, removed };
}

async function main() {
  const profile = await loadProfile();
  const username = profile.credly;
  if (!username) throw new Error('Add "credly: <username>" to content/profile.yaml');

  let previous = [];
  try { previous = JSON.parse(await readFile(SNAPSHOT, 'utf8')).badges; } catch { /* first run */ }

  let raw;
  try {
    raw = await fetchAllBadges(username);
  } catch (err) {
    if (previous.length) {
      console.warn(`Credly did not answer (${err.message}). Keeping the snapshot with ${previous.length} badges.`);
      return;
    }
    throw err;
  }

  const badges = raw.map(normalize).sort((a, b) => (b.issuedOn ?? '').localeCompare(a.issuedOn ?? ''));
  const before = new Set(previous.map((b) => b.id));
  const added = badges.filter((b) => !before.has(b.id));

  await mkdir(path.dirname(SNAPSHOT), { recursive: true });
  await writeFile(SNAPSHOT, JSON.stringify({ username, syncedOn: new Date().toISOString().slice(0, 10), badges }, null, 2) + '\n');

  const featured = await selectFeatured(badges);
  const { downloaded, removed } = await syncImages(featured);

  console.log(`Credly: ${badges.length} badges, ${added.length} new since the last import, ${featured.length} shown on the site.`);
  if (previous.length) for (const b of added) console.log(`  + ${b.issuedOn}  ${b.issuer}  ${b.name}`);
  if (downloaded || removed) console.log(`  public/badges: ${downloaded} images added, ${removed} removed`);
}

main().catch((err) => {
  console.error(`import:credly failed: ${err.message}`);
  process.exit(1);
});
