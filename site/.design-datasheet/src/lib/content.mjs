// Single entry point to the site content. Everything the pages, AskMe and
// the import scripts know comes from the files in /content.

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';

// The site folder. npm scripts and the Astro build both run from there.
export const ROOT = process.env.SITE_ROOT ?? process.cwd();
const CONTENT = path.join(ROOT, 'content');

async function readYaml(file) {
  return YAML.parse(await readFile(path.join(CONTENT, file), 'utf8'));
}

function check(cond, message) {
  if (!cond) throw new Error(`content: ${message}`);
}

// "2024-05" -> { y: 2024, m: 5 }
export function parseMonth(value) {
  if (value == null) return null;
  const [y, m = '1'] = String(value).split('-');
  return { y: Number(y), m: Number(m) };
}

export function monthIndex(value) {
  const p = parseMonth(value);
  return p ? p.y * 12 + (p.m - 1) : null;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function formatMonth(value) {
  const p = parseMonth(value);
  if (!p) return 'present';
  return String(value).includes('-') ? `${MONTHS[p.m - 1]} ${p.y}` : String(p.y);
}

export function formatPeriod(start, end) {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : 'present'}`;
}

export async function loadProfile() {
  const p = await readYaml('profile.yaml');
  check(p.name && p.role && p.thesis, 'profile.yaml needs name, role and thesis');
  return p;
}

export async function loadExperience() {
  const roles = await readYaml('experience.yaml');
  for (const r of roles) {
    check(r.id && r.title && r.start, `every role needs id, title and start (${JSON.stringify(r).slice(0, 60)})`);
    if (!r.summary?.trim()) console.warn(`[content] The role "${r.title}" has no summary yet (content/experience.yaml).`);
  }
  // Most recent first.
  return roles.sort((a, b) => monthIndex(b.start) - monthIndex(a.start));
}

export async function loadEngagements() {
  const list = await readYaml('engagements.yaml');
  for (const e of list) check(e.id && e.industry && e.start, `engagement ${e.id ?? '?'} needs id, industry and start`);
  return list.sort((a, b) => monthIndex(b.start) - monthIndex(a.start));
}

export const loadPublications = () => readYaml('publications.yaml');
export const loadProjects = () => readYaml('projects.yaml');
export const loadRecognition = () => readYaml('recognition.yaml');
export const loadSkills = () => readYaml('skills.yaml');
export const loadExtraCertifications = () => readYaml('certifications-extra.yaml');
export const loadBadgeRules = () => readYaml('badges.overrides.yaml');

export async function loadCredly() {
  try {
    return JSON.parse(await readFile(path.join(CONTENT, 'credly/badges.json'), 'utf8'));
  } catch {
    return { username: null, badges: [] };
  }
}

export async function loadAskMeNotes() {
  return readFile(path.join(CONTENT, 'askme/notes.md'), 'utf8');
}

// The audio transcript: only once the script has been approved.
export async function loadAudioTranscript() {
  try {
    const text = await readFile(path.join(CONTENT, 'askme/audio-script.md'), 'utf8');
    const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!m || YAML.parse(m[1]).approved !== true) return null;
    return m[2].split(/\r?\n/).map((l) => l.trim()).filter(Boolean).map((l) => {
      const [speaker, ...rest] = l.split(':');
      return { speaker: speaker.trim(), text: rest.join(':').trim() };
    });
  } catch {
    return null;
  }
}

export async function loadAskMeChecks() {
  return readYaml('askme/checks.yaml');
}

export async function loadAll() {
  const [profile, experience, engagements, publications, projects, recognition, skills, extra, credly, notes] =
    await Promise.all([
      loadProfile(), loadExperience(), loadEngagements(), loadPublications(), loadProjects(),
      loadRecognition(), loadSkills(), loadExtraCertifications(), loadCredly(), loadAskMeNotes(),
    ]);
  return { profile, experience, engagements, publications, projects, recognition, skills, extra, credly, notes };
}
