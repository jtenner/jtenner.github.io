# Stitch-style Astro Blog

This project converts the HTML files from `stitch/*/code.html` into an Astro blog baseline using a shared layout.

- Home: `src/pages/index.astro`
- Category: `src/pages/category.astro`
- Article: `src/pages/article.astro`

Run locally:

```bash
npm install
npm run dev
```

Styles are compiled locally via Astro + Tailwind (no external CDN required at runtime).

Then visit `http://localhost:3000`.
