// Joins a path to the site base (/newAI-Portfolio on GitHub Pages).
export function withBase(p = '') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${p.replace(/^\//, '')}`;
}
