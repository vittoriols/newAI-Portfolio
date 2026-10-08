import { defineConfig } from 'astro/config';

// The site is served by GitHub Pages under /newAI-Portfolio/. With a custom
// domain, set BASE_PATH=/ and SITE_URL to the domain in the deploy workflow.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://vittoriols.github.io',
  base: process.env.BASE_PATH ?? '/newAI-Portfolio',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
