// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';


// Static site — deploys to GitHub Pages.
// EASIEST (recommended): create a repo named `<username>.github.io`. It serves at
//   the domain root, so keep `base: '/'` and everything works unchanged.
// PROJECT REPO (any other name, served at /<repo>/): set `base: '/<repo>'` AND tell
//   me — internal asset/link paths need BASE_URL prefixing for that to work.
const SITE = 'https://clyckverse.github.io';
const BASE = '/';


export default defineConfig({
 site: SITE,
 base: BASE,
 output: 'static',
 integrations: [react()],
 build: { inlineStylesheets: 'auto' },
 vite: {
   plugins: [tailwindcss()],
   build: { assetsInlineLimit: 0 },
 },
});



