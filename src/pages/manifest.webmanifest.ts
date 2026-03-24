import type { APIRoute } from "astro";

const manifest = {
  name: "Assembling Me",
  short_name: "Assembling Me",
  description:
    "Notes on compilers, WebAssembly, testing infrastructure, and practical systems work.",
  start_url: "/",
  display: "standalone",
  background_color: "#0b1326",
  theme_color: "#0b1326",
  icons: [
    {
      src: "/favicon.svg",
      sizes: "any",
      type: "image/svg+xml",
      purpose: "any",
    },
  ],
};

export const GET: APIRoute = () =>
  new Response(JSON.stringify(manifest), {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
    },
  });
