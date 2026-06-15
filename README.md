# allpointsburnes

Personal site monorepo for [allpointsburnes.com](https://allpointsburnes.com).

## Project overview

This repository is a `pnpm` workspace managed with Turborepo.

Apps:

- `apps/site` — the Astro site deployed to Cloudflare Pages
- `apps/roundabout-intersections` — supporting analysis project

## Getting started

### Prerequisites

- Node.js 24+
- `pnpm` 10+

This repo is configured with:

- `packageManager: pnpm@10.27.0`
- `engines.node: >=24 <25`
- Turborepo for workspace task orchestration

### Install

From the repository root:

```bash
pnpm install
```

## Development

Start the workspace dev command from the repository root:

```bash
pnpm dev
```

Today, this primarily starts the Astro site in `apps/site`.

Useful root commands:

```bash
pnpm dev
pnpm build
pnpm test
pnpm deploy
pnpm generate:llms
pnpm check:llms
```

## Build

Create a production build for all workspace apps that define a build task:

```bash
pnpm build
```

For the site, this generates AI discovery files, runs Astro checks, and builds the production output.

## AI discovery files

The site publishes two AI/LLM discovery files:

- `apps/site/public/llms.txt`
- `apps/site/public/llms-full.txt`

These files are generated from the current blog and work content in:

- `apps/site/src/content/blog`
- `apps/site/src/content/work`

Do not edit the generated files by hand. Update the source content frontmatter instead, then regenerate from the repository root:

```bash
pnpm generate:llms
```

To verify the generated files are current without modifying them from the repository root:

```bash
pnpm check:llms
```

You can also run the same scripts from `apps/site`:

```bash
cd apps/site
pnpm generate:llms
pnpm check:llms
```

The site build runs the generator automatically, and the SEO test suite fails if the checked-in files are stale.

## Testing

Run workspace tests from the repository root:

```bash
pnpm test
```

## Deployment

Deployment is orchestrated from the repository root:

```bash
pnpm deploy
```

The site deploy step publishes `apps/site/dist` to Cloudflare Pages using Wrangler.

### Required environment variables

Set these before deployment:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

### Deployment notes

- The deploy script targets the Cloudflare Pages project `all-points-burnes-site`
- The site build output is generated under `apps/site/dist`
- The Astro app is configured for Cloudflare in normal builds and uses the Node adapter for tests

## Workspace structure

```text
.
├── apps/
│   ├── site/
│   └── roundabout-intersections/
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Notes

- Run all workspace commands from the repository root
- The `apps/roundabout-intersections` project has its own runtime and workflow beyond the root web workspace commands
