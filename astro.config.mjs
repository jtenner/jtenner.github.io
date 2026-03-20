import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  server: {
    host: "0.0.0.0",
    allowedHosts: ["notwindows"]
  },
  integrations: [
    tailwind()
  ],
  site: 'https://jtenner.github.io'
});
