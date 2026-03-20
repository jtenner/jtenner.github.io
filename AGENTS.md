# AGENTS

## Project layout

- `/` (repo root): `README.md`, `package.json`, `bun.lock`, `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`
- `src/`
  - `content/` (post content)
  - `content/posts/` (markdown posts)
  - `layouts/` (Astro layout components)
  - `pages/` (routes)
  - `pages/posts/` (post route files)
  - `styles/` (global/site styles)
- `stitch/` (design/stitch variants)
  - `article_view_redesigned/`
  - `category_listing/`
  - `homepage_redesigned/`
  - `syntax_slate/`
- `.astro/` (Astro internal/config files)
- `node_modules/` (installed dependencies)

## Post Categories

- WASM
- Coding
- Music
- Web
- Tech
- Social Media
- AI
- Security
- Tutorials
- Productivity
- DevOps
- Open Source

## New Post Required Frontmatter

- Required metadata:
  - `title`: string
  - `description`: string
  - `pubDate`: string (`yyyy-mm-dd`, e.g., `2026-03-20`)
  - `author`: `Joshua Tenner <tenner.joshua@gmail.com>` (or post-specific author, with mailto link)
  - `categories`: array of category strings (one or more)
  - `image`: url string (leave blank unless provided)

