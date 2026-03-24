import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { BLOG_IDENTITY } from "../lib/structuredData";

const FEED_DESCRIPTION =
  "Notes on compilers, WebAssembly, testing infrastructure, and practical systems work.";

export function GET(context: APIContext) {
  return rss({
    title: BLOG_IDENTITY.siteName,
    description: FEED_DESCRIPTION,
    site: context.site,
    items: [],
    customData: "<language>en-us</language>",
  });
}
