import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  server: {
    host: "0.0.0.0",
    allowedHosts: ["notwindows"]
  },
  integrations: [
    sitemap(),
    tailwind()
  ],
  site: 'https://jtenner.github.io'
});
