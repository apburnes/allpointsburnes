#! /bin/bash

set -euo pipefail
set -x

PAGES_DIST="./dist/pages"

rm -rf "$PAGES_DIST"
mkdir -p "$PAGES_DIST"

# Astro's Cloudflare server build separates static assets and the Worker bundle:
# - dist/client: Pages static publish directory
# - dist/server: Cloudflare Worker entry/chunks for SSR/API routes
# Cloudflare Pages advanced mode expects static files at the publish root and
# a module Worker at _worker.js, so assemble that Pages-compatible shape here.
cp -R ./dist/client/. "$PAGES_DIST/"
cp -R ./dist/server "$PAGES_DIST/server"
cat > "$PAGES_DIST/_worker.js" <<'EOF'
export { default } from "./server/entry.mjs";
EOF

./node_modules/.bin/wrangler pages deploy "$PAGES_DIST" --project-name all-points-burnes-site
