import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { BLOG_IDENTITY } from "../lib/structuredData";

const FEED_DESCRIPTION =
  "Notes on compilers, WebAssembly, testing infrastructure, and practical systems work.";

export async function GET(context: APIContext) {
  const posts = await getCollection("posts");
  const items = [...posts]
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/posts/${post.slug}/`,
    }));

  return rss({
    title: BLOG_IDENTITY.siteName,
    description: FEED_DESCRIPTION,
    site: context.site,
    items,
    customData: "<language>en-us</language>",
  });
}
