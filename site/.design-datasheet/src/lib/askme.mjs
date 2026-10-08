// Builds the AskMe context from the site content, and the prompt that goes
// with it. Shared by the site build (askme/context.json), the Worker and the
// test script, so the three always agree.

import { formatPeriod, formatMonth } from './content.mjs';
import { selectFeatured, isExpired } from './badges.mjs';

// Every fact carries the id of the place on the page where it is shown, so
// the assistant can cite it and the visitor can check it.
export function buildContext(all, { featured } = {}) {
  const { profile, experience, engagements, publications, projects, recognition, skills, extra, credly, notes } = all;
  const sources = {};
  const add = (id, title, anchor) => { sources[id] = { title, anchor }; return id; };
  const lines = [];

  add('about', 'About', '#about');
  lines.push(`# ${profile.name}`, `[[about]]`,
    `Role: ${profile.role}, ${profile.organization}. Based in ${profile.location}.`,
    `In one sentence: ${profile.thesis}`, '', ...profile.summary, '');
  lines.push('Education: ' + profile.education.map((e) => `${e.degree}, ${e.school} (${e.start}–${e.end})`).join('; ') + '.');
  lines.push('Languages: ' + profile.languages.map((l) => `${l.name} (${l.level})`).join(', ') + '.', '');

  lines.push('## Roles at IBM, most recent first', 'Several roles ran in parallel.');
  for (const r of experience) {
    const id = add(`role-${r.id}`, r.title, `#role-${r.id}`);
    lines.push(`- [[${id}]] ${r.title}, ${r.company}, ${formatPeriod(r.start, r.end)}${r.end ? '' : ' (current)'}. ${r.summary?.trim() ?? ''}`
      + (r.highlights?.length ? ` Highlights: ${r.highlights.join('; ')}.` : ''));
  }
  lines.push('');

  add('engagements', 'Client engagements', '#engagements');
  lines.push('## Client engagements [[engagements]]', 'Clients are confidential and must never be named; refer to them by industry.');
  for (const e of engagements) lines.push(`- ${e.industry}, ${formatPeriod(e.start, e.end)}: ${e.scope.trim()}`);
  lines.push('');

  featured ??= [];
  const extras = extra.filter((c) => !isExpired(c));
  add('credentials', 'Credentials', '#credentials');
  lines.push('## Certifications and badges [[credentials]]',
    `${credly.badges.length} badges on Credly in total (${profile.links.credly}). The most relevant:`);
  for (const b of [...featured, ...extras]) {
    lines.push(`- ${b.name}, ${b.issuer}, ${formatMonth(b.issuedOn?.slice(0, 7))}${b.expiresOn ? `, valid until ${formatMonth(b.expiresOn.slice(0, 7))}` : ''}`);
  }
  lines.push('');

  lines.push('## Publications');
  for (const p of publications) {
    const id = add(`pub-${p.id}`, p.title, `#pub-${p.id}`);
    lines.push(`- [[${id}]] ${p.type}: "${p.title}", ${p.publisher}, ${formatMonth(p.date)}. ${p.summary.trim()}${p.confidential ? ' Confidential beyond this description.' : ''}`);
  }
  lines.push('');

  add('projects', 'Projects', '#projects');
  lines.push('## Side projects [[projects]]');
  for (const p of projects) lines.push(`- ${p.title} (${p.stack.join(', ')}): ${p.summary.trim()} Code: ${p.url}`);
  lines.push('');

  add('recognition', 'Recognition and teaching', '#recognition');
  lines.push('## Recognition, teaching, community [[recognition]]');
  for (const a of recognition.awards) lines.push(`- ${a.title} (${a.date}): ${a.note}`);
  for (const t of [...recognition.teaching, ...recognition.community]) lines.push(`- ${t.title} (${t.period}): ${t.note}`);
  lines.push('');

  add('skills', 'Skills', '#skills');
  lines.push('## Skills [[skills]]');
  for (const g of skills) lines.push(`- ${g.group}: ${g.items.join(', ')}`);
  lines.push('');

  add('contact', 'Contact', '#contact');
  lines.push('## Contact [[contact]]',
    `Email ${profile.links.email}, LinkedIn ${profile.links.linkedin}, or the contact form on the site. No phone number is shared.`, '');

  lines.push('## Notes from Vittorio', notes.replace(/<!--[\s\S]*?-->/g, '').trim());

  return { generatedAt: new Date().toISOString(), name: profile.name, sources, text: lines.join('\n') };
}

export async function buildContextFromContent(all) {
  const featured = await selectFeatured(all.credly.badges);
  return buildContext(all, { featured });
}

export { systemPrompt, sanitizeMessages, LIMITS } from './askme-prompt.mjs';
