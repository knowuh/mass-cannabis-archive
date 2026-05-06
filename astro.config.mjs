import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://knowuh.github.io',

  // Adjust if this is the repo name
  base: '/mass-cannabis-archive',

  integrations: [preact(), sitemap()]
});