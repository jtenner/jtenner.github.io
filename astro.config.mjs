import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { remarkGithubCard } from './src/lib/remarkGithubCard.mjs';
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
    remarkPlugins: [remarkGithubCard],
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
