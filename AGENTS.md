# AGENTS

## Project layout

- `/` (repo root): `README.md`, `package.json`, `bun.lock`, `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`
- `src/`
  - `content/` (post content)
  - `content/posts/` (markdown posts)
  - `content/projects/` (project pages)
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

## Build artifacts

- All generated build artifacts must remain untracked in git when discovered.
- `dist/`, `.astro/`, and dependency install folders like `node_modules/` are not source files and should be ignored rather than committed.

## Writing style

Use simple technical English. Follow ASD-STE100 principles in spirit, not as a strict vocabulary checker.

- Use short sentences when possible.
- Put one main idea in each sentence.
- Prefer active voice.
- Use concrete verbs.
- Define uncommon technical terms the first time they appear.
- Keep established technical names, code identifiers, and specification terms exact.
- Avoid filler, idioms, hype, rhetorical exaggeration, and unnecessary analogies.
- Avoid long lists of clauses joined with commas or conjunctions.
- Split complex procedures into ordered steps.
- State project status and limitations directly.
- Prefer a short explanation before a dense technical list.
- Preserve technical accuracy when simplifying text.

The goal is not to remove technical detail. The goal is to make each technical detail easy to understand.

## Post categories

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

## New post required frontmatter

- Required metadata:
  - `title`: non-empty string
  - `description`: non-empty string
  - `pubDate`: string (`yyyy-mm-dd`, e.g., `2026-03-20`)
  - `author`: non-empty string such as `Joshua Tenner`
  - `authorEmail`: valid email string such as `tenner.joshua@gmail.com`
  - `categories`: array of category strings (one or more)
  - `image`: url string (leave blank unless provided)

- Feed requirement:
  - `title`, `description`, and `pubDate` are required for RSS generation and must remain valid on every post.
