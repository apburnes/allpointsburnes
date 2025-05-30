import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

let adapter;

if (process.env.NODE_ENV === "test") {
  adapter = node({ mode: "standalone" });
} else {
  adapter = cloudflare();
}

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter,
  site: "https://allpointsburnes.com",
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
