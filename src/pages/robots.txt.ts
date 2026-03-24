import type { APIRoute } from "astro";

const getRobotsTxt = (sitemapUrl: URL) => `User-agent: *
Allow: /

Sitemap: ${sitemapUrl.href}
`;

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error("robots.txt generation requires Astro `site` to be configured.");
  }

  const sitemapUrl = new URL("/sitemap-index.xml", site);
  return new Response(getRobotsTxt(sitemapUrl), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
