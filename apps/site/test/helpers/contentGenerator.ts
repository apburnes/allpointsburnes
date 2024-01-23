import { rm, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import type { BlogContent } from "../../src/types";

const BLOG_CONTENT_PATH = path.join(process.cwd(), "src/content/blog");

export function generateBlogContent(
  { title, description, pubDate, tags = [] }: BlogContent,
  content: string
) {
  const tagList = tags.map((tag) => `"${tag}"`).join(", ");
  const blog = `---
title: ${title}
description: ${description}
pubDate: ${pubDate}
tags: [${tagList}]
---
${content}`;

  return blog;
}

export function generateRandomFileName(prefix = "test") {
  const random = randomUUID();
  return `${prefix}-${random}`;
}

export async function writeBlogContent(
  fileName: string,
  { title, description, pubDate, tags }: BlogContent,
  content: string
) {
  const file = `${fileName}.md`;
  const blog = generateBlogContent(
    { title, description, pubDate, tags },
    content
  );
  const filePath = path.join(BLOG_CONTENT_PATH, file);

  const output = await writeFile(filePath, blog, { encoding: "utf-8" });

  return output;
}

export async function deleteBlogContent(fileName: string) {
  const file = `${fileName}.md`;
  const filePath = path.join(BLOG_CONTENT_PATH, file);

  const output = await rm(filePath);

  return output;
}
