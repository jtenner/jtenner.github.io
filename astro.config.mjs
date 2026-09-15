import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { watLanguage } from './src/lib/watLanguage.mjs';

export default defineConfig({
  server: {
    host: "0.0.0.0",
    allowedHosts: ["notwindows"]
  },
  integrations: [
    sitemap(),
    tailwind()
  ],
  markdown: {
    shikiConfig: {
      langs: [watLanguage],
      langAlias: {
        wast: "wat",
        wasm: "wat"
      }
    }
  },
  site: 'https://jtenner.github.io'
});
