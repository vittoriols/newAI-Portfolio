// Decides which Credly badges appear on the site. The rules live in
// content/badges.overrides.yaml; this file only applies them.

import { loadBadgeRules } from './content.mjs';

const today = () => new Date().toISOString().slice(0, 10);

export function isExpired(badge, on = today()) {
  return Boolean(badge.expiresOn && badge.expiresOn < on);
}

function anyMatch(text, patterns = []) {
  return patterns.some((p) => new RegExp(p, 'i').test(text));
}

function matchesRule(badge, rule) {
  if (rule.issuers && !rule.issuers.includes(badge.issuer)) return false;
  if (rule.excludeIssuers && rule.excludeIssuers.includes(badge.issuer)) return false;
  if (rule.types && !rule.types.includes(badge.type)) return false;
  if (rule.nameMatches && !anyMatch(badge.name, rule.nameMatches)) return false;
  if (rule.levelMatches && !anyMatch(badge.name, rule.levelMatches)) return false;
  return true;
}

// "Professional Certification: Level 1 - Certified Solution Architect" and
// "... Level 2 - Master Certified Solution Architect" share a family; only the
// highest level is kept.
function levelFamily(badge) {
  const m = badge.name.match(/^(.*?)\bLevel\s+(\d+)/i);
  return m ? { key: `${badge.issuer}|${m[1].trim()}`, level: Number(m[2]) } : null;
}

export async function selectFeatured(badges, rules) {
  rules ??= await loadBadgeRules();
  const include = new Set(rules.include ?? []);
  const exclude = new Set(rules.exclude ?? []);

  let shown = badges.filter((b) => {
    if (exclude.has(b.id)) return false;
    if (include.has(b.id)) return true;
    if (rules.hideExpired && isExpired(b)) return false;
    return (rules.show ?? []).some((rule) => matchesRule(b, rule));
  });

  const top = new Map();
  for (const b of shown) {
    const f = levelFamily(b);
    if (f && (top.get(f.key) ?? 0) < f.level) top.set(f.key, f.level);
  }
  shown = shown.filter((b) => {
    const f = levelFamily(b);
    return include.has(b.id) || !f || f.level === top.get(f.key);
  });

  return shown;
}

// Groups for the credentials table, in the order given by the rules.
export function groupByIssuer(badges, order = []) {
  const groups = new Map();
  for (const b of badges) {
    const key = b.issuer || 'Other';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(b);
  }
  const rank = (k) => (order.indexOf(k) === -1 ? order.length : order.indexOf(k));
  return [...groups.entries()]
    .sort((a, b) => rank(a[0]) - rank(b[0]) || b[1].length - a[1].length)
    .map(([issuer, items]) => ({
      issuer,
      items: items.sort((a, b) => (b.issuedOn ?? '').localeCompare(a.issuedOn ?? '')),
    }));
}
