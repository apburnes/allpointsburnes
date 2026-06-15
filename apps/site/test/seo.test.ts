import { describe, expect, it } from "vitest";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const CONTENT_ROOT = path.join(process.cwd(), "src/content");
const PUBLIC_ROOT = path.join(process.cwd(), "public");
const DESCRIPTION_MIN = 50;
const DESCRIPTION_MAX = 240;
const execFileAsync = promisify(execFile);

async function contentFiles(collection: "blog" | "work") {
  const dir = path.join(CONTENT_ROOT, collection);
  const files = await readdir(dir);

  return files
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .filter((file) => !file.startsWith("test-"))
    .map((file) => path.join(dir, file));
}

function frontmatter(source: string) {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  expect(match, "content file should include frontmatter").not.toBeNull();

  return match?.[1] ?? "";
}

function frontmatterValue(frontmatterSource: string, key: string) {
  const match = frontmatterSource.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return match?.[1]?.trim().replace(/^['\"]|['\"]$/g, "") ?? "";
}

describe("SEO and AI discovery metadata", () => {
  it("keeps generated llms files up to date", async () => {
    await expect(
      execFileAsync("node", ["./scripts/generate-llms.mjs", "--check"], {
        cwd: process.cwd(),
      })
    ).resolves.toBeTruthy();
  });

  it("publishes robots.txt and llms.txt", async () => {
    const [robots, llms] = await Promise.all([
      readFile(path.join(PUBLIC_ROOT, "robots.txt"), "utf-8"),
      readFile(path.join(PUBLIC_ROOT, "llms.txt"), "utf-8"),
    ]);

    expect(robots).toContain("Sitemap: https://allpointsburnes.com/sitemap-index.xml");
    expect(llms).toContain("https://allpointsburnes.com/work/");
    expect(llms).toContain("## Topics");
  });

  it("keeps blog and work descriptions useful for search snippets", async () => {
    const files = [...(await contentFiles("blog")), ...(await contentFiles("work"))];

    for (const file of files) {
      const source = await readFile(file, "utf-8");
      const meta = frontmatter(source);
      const description = frontmatterValue(meta, "description");

      expect(description, `${file} should have a description`).toBeTruthy();
      expect(description.length, `${file} description should be at least ${DESCRIPTION_MIN} characters`).toBeGreaterThanOrEqual(DESCRIPTION_MIN);
      expect(description.length, `${file} description should be at most ${DESCRIPTION_MAX} characters`).toBeLessThanOrEqual(DESCRIPTION_MAX);
    }
  });

  it("keeps blog and work titles unique", async () => {
    const files = [...(await contentFiles("blog")), ...(await contentFiles("work"))];
    const titles = new Map<string, string>();

    for (const file of files) {
      const source = await readFile(file, "utf-8");
      const title = frontmatterValue(frontmatter(source), "title");

      expect(title, `${file} should have a title`).toBeTruthy();
      expect(titles.has(title), `${file} duplicates title from ${titles.get(title)}`).toBe(false);
      titles.set(title, file);
    }
  });
});
