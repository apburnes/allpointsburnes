import { defineConfig } from "astro/config";
import cloudflare from '@astrojs/cloudflare';
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  adapter: cloudflare(),
  site: "https://example.com",
  integrations: [mdx(), sitemap(), tailwind()],
});
