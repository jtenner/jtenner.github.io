import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  server: {
    host: "0.0.0.0",
    allowedHosts: ["notwindows"]
  },
  integrations: [
    sitemap({
      filter: (page) =>
        page !== 'https://jtenner.github.io/article/' &&
        page !== 'https://jtenner.github.io/category/'
    }),
    tailwind()
  ],
  site: 'https://jtenner.github.io'
});
