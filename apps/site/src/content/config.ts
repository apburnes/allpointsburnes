import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const resume = defineCollection({
  type: "data",
  schema: z.array(
    z.object({
      type: z.enum(["work", "academic"]),
      school: z.string().optional(),
      degree: z.string().optional(),
      position: z.string().optional(),
      employer: z.string().optional(),
      start: z.string(),
      end: z.string(),
      url: z.string(),
    })
  ),
});

export const collections = { blog, resume };
