import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const postsDir = path.join(root, "src", "content", "posts");
const distDir = path.join(root, "dist");
const rssPath = path.join(distDir, "rss.xml");

const decodeXml = (value) =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");

const stripQuotes = (value) => {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
};

const getFrontmatterValue = (frontmatter, key, file) => {
  const line = frontmatter
    .split("\n")
    .find((entry) => entry.trimStart().startsWith(`${key}:`));

  if (!line) {
    throw new Error(`Missing frontmatter key "${key}" in ${file}`);
  }

  return stripQuotes(line.split(":").slice(1).join(":").trim());
};

const parsePostMetadata = async (file) => {
  const source = await readFile(path.join(postsDir, file), "utf8");
  const parts = source.split("---");

  if (parts.length < 3) {
    throw new Error(`Invalid frontmatter in ${file}`);
  }

  const frontmatter = parts[1] ?? "";

  return {
    file,
    title: getFrontmatterValue(frontmatter, "title", file),
    description: getFrontmatterValue(frontmatter, "description", file),
    pubDate: getFrontmatterValue(frontmatter, "pubDate", file),
  };
};

const getTagValue = (input, tag) => {
  const match = input.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  if (!match) {
    throw new Error(`Missing <${tag}> tag in RSS item`);
  }

  return decodeXml(match[1].trim());
};

await access(rssPath);

const rssXml = await readFile(rssPath, "utf8");
const itemMatches = [...rssXml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
const actualItems = itemMatches.map((match) => {
  const item = match[1] ?? "";
  return {
    title: getTagValue(item, "title"),
    description: getTagValue(item, "description"),
    pubDate: getTagValue(item, "pubDate"),
    link: getTagValue(item, "link"),
  };
});

if (!rssXml.includes("<language>en-us</language>")) {
  throw new Error('RSS feed is missing "<language>en-us</language>"');
}

const postFiles = (await readdir(postsDir))
  .filter((file) => file.endsWith(".md"))
  .sort();
const expectedPosts = (await Promise.all(postFiles.map(parsePostMetadata))).sort(
  (a, b) => new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf(),
);

if (actualItems.length !== expectedPosts.length) {
  throw new Error(
    `RSS item count mismatch: expected ${expectedPosts.length}, got ${actualItems.length}`,
  );
}

for (const [index, expected] of expectedPosts.entries()) {
  const actual = actualItems[index];

  if (!actual) {
    throw new Error(`Missing RSS item at position ${index + 1}`);
  }

  if (actual.title !== expected.title) {
    throw new Error(
      `RSS item ${index + 1} title mismatch: expected "${expected.title}", got "${actual.title}"`,
    );
  }

  if (actual.description !== expected.description) {
    throw new Error(
      `RSS item ${index + 1} description mismatch for "${expected.title}"`,
    );
  }

  if (
    new Date(actual.pubDate).toISOString().slice(0, 10) !==
    new Date(expected.pubDate).toISOString().slice(0, 10)
  ) {
    throw new Error(
      `RSS item ${index + 1} pubDate mismatch for "${expected.title}"`,
    );
  }

  const url = new URL(actual.link);
  const outputPath = path.join(
    distDir,
    url.pathname.replace(/^\/+/, ""),
    "index.html",
  );

  if (!url.pathname.startsWith("/posts/") || !url.pathname.endsWith("/")) {
    throw new Error(
      `RSS item ${index + 1} link must point to a trailing-slash blog post path: ${actual.link}`,
    );
  }

  await access(outputPath);
}

console.log(
  `RSS validation passed for ${actualItems.length} post(s) in ${path.relative(root, rssPath)}.`,
);
