import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string().min(50).max(240),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    summary: z.string().min(50).max(500).optional(),
  }),
});

const work = defineCollection({
  loader: glob({ base: "./src/content/work", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    description: z.string().min(50).max(240),
    date: z.coerce.date(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    summary: z.string().min(50).max(500).optional(),
    role: z.string().optional(),
    impact: z.array(z.string()).optional(),
  }),
});

const resume = defineCollection({
  loader: glob({ base: "./src/content/resume", pattern: "**/*.json" }),
  schema: z.array(
    z.object({
      type: z.enum(["work", "academic"]),
      school: z.string().optional(),
      degree: z.string().optional(),
      position: z.string().optional(),
      employer: z.string().optional(),
      start: z.string(),
      end: z.string(),
      url: z.url(),
    })
  ),
});

export const collections = { blog, work, resume };
