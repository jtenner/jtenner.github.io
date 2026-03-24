# RSS Feed Implementation Todo

## RSS-001 Add RSS Dependency And Endpoint
- Deliverable: add `@astrojs/rss` with `bun add @astrojs/rss` so the project uses the Astro-supported feed helper instead of hand-rolling XML.
- Deliverable: create `src/pages/rss.xml.ts` so Astro emits the feed at `/rss.xml` during `astro build`.
- Deliverable: implement `GET(context)` with `rss()` and pass `site: context.site`, since `astro.config.mjs` already defines `site: 'https://jtenner.github.io'`.
- Deliverable: set feed-level metadata from the existing site identity, using `Assembling Me` as the feed title and a short site description that matches the blog’s positioning.
- Deliverable: include `customData: \`<language>en-us</language>\`` for explicit feed language metadata.

## RSS-002 Generate Items From The Posts Collection
- Deliverable: source feed entries from `getCollection("posts")` in `src/content/config.ts`, because blog posts already live in `src/content/posts/` and render from `src/pages/posts/[slug].astro`.
- Deliverable: sort posts by descending `pubDate` before mapping them into RSS items so the newest article is first in the XML.
- Deliverable: map each entry to `title`, `description`, `pubDate`, and `link`.
- Deliverable: build each item link as `/posts/${post.slug}/` to match the current static output shape in `dist/posts/.../index.html`.
- Deliverable: keep the first iteration summary-based only and do not include full rendered HTML `content` yet; the current posts include images and Markdown, and Astro’s docs note that full-content feeds need extra sanitization and URL-handling work.

## RSS-003 Preserve The Existing Content Schema
- Deliverable: keep the current `posts` schema in `src/content/config.ts` instead of replacing it with `rssSchema`, because this repo already relies on custom fields such as `authorEmail` and the current `image` validation.
- Deliverable: confirm the existing schema already satisfies the minimum RSS item contract through `title`, `description`, and `pubDate`.
- Deliverable: document that every new post must continue to provide valid frontmatter for those fields or the feed generation will become incomplete or invalid.

## RSS-004 Add RSS Auto-Discovery In The Shared Layout
- Deliverable: add the standard RSS autodiscovery tag to the `<head>` in `src/layouts/EditorialLayout.astro`.
- Deliverable: use `<link rel="alternate" type="application/rss+xml" title="Assembling Me RSS" href={new URL("rss.xml", Astro.site)} />` so feed readers can discover the feed from the site root, matching the Astro recipe.
- Deliverable: keep this in the shared layout so both the homepage and post pages advertise the same feed URL.

## RSS-005 Verify Build Output And Feed Behavior
- Deliverable: run `bun run build` and confirm Astro writes `dist/rss.xml`.
- Deliverable: inspect the generated XML and verify it contains all current posts from `src/content/posts/`.
- Deliverable: manually confirm item URLs resolve to the existing `/posts/<slug>/` pages.
- Deliverable: check the feed in local dev or preview mode to confirm the endpoint responds and the XML is well-formed.
- Deliverable: verify trailing-slash behavior stays default, because this repo does not currently set `trailingSlash: "never"` in `astro.config.mjs`; no `trailingSlash: false` override should be added unless routing policy changes.

## RSS-006 Ensure Published RSS Updates On Every Deployment
- Deliverable: verify the deployment pipeline rebuilds the site after each content change, because Astro regenerates `rss.xml` as part of `astro build`.
- Deliverable: align branch triggers between `.github/workflows/ci.yml` and `.github/workflows/deploy.yml`; CI currently runs on pushes to `main`, while Pages deploy currently runs on pushes to `master`.
- Deliverable: update the deploy workflow to watch the branch that actually publishes the site so new posts trigger a fresh build and a fresh `rss.xml`.
- Deliverable: confirm the GitHub Pages artifact includes `dist/rss.xml` after deployment.
- Deliverable: treat branch-trigger alignment as required for “RSS XML is updated,” not as an optional cleanup, because the feed can be correct locally and still fail to update in production if deploy never runs.
