import type { APIRoute } from "astro";

const manifest = {
  name: "Assembling Me",
  short_name: "Assembling Me",
  description:
    "Compiler and runtime engineering notes about WebAssembly, programming languages, optimization, fuzzing, and developer tools.",
  start_url: "/",
  display: "standalone",
  background_color: "#151b26",
  theme_color: "#151b26",
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
