import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { dev, build, preview } from "astro";
import {
  deleteBlogContent,
  generateRandomFileName,
  writeBlogContent,
} from "../helpers/contentGenerator";

describe("/api/posts", () => {
  let devServer: any;
  // Create some content items
  const fileName1 = generateRandomFileName();
  const fileName2 = generateRandomFileName();
  const fileName3 = generateRandomFileName();

  beforeAll(async () => {
    await Promise.all([
      writeBlogContent(
        fileName1,
        {
          title: "Test Blog 1",
          description: "Test blog 1 description",
          pubDate: "2021-01-01",
        },
        "Test blog 1 content"
      ),
      writeBlogContent(
        fileName2,
        {
          title: "Test Blog 2",
          description: "Test blog 2 description",
          pubDate: "2021-01-02",
          tags: ["test", "blog"],
        },
        "Test blog 2 content"
      ),
      writeBlogContent(
        fileName3,
        {
          title: "Test Blog 3",
          description: "Test blog 3 description",
          pubDate: "2021-01-03",
          tags: ["test", "blog"],
        },
        "Test blog 3 content"
      ),
    ]);

    // Set the root to the current working directory
    devServer = await dev({
      root: ".",
    });
  });

  afterAll(async () => {
    await Promise.all([
      deleteBlogContent(fileName1),
      deleteBlogContent(fileName2),
      deleteBlogContent(fileName3),
    ]);

    await devServer.stop();
  });

  it("should return a list of all blog posts", async () => {
    const res = await fetch("http://localhost:4321/api/posts");

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.length).toBeGreaterThan(3);
  });
});
