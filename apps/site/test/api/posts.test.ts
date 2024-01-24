import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { dev } from "astro";
import type { BlogContent } from "../../src/types";
import {
  deleteBlogContent,
  generateRandomFileName,
  writeBlogContent,
} from "../helpers/contentGenerator";

describe("/api/posts", () => {
  let devServer: any;

  const fileName1 = generateRandomFileName();
  const fileName2 = generateRandomFileName();
  const fileName3 = generateRandomFileName();

  const title1 = "Test Blog 1";
  const title2 = "Test Blog 2";
  const title3 = "Test Blog 3";

  beforeAll(async () => {
    await Promise.all([
      writeBlogContent(
        fileName1,
        {
          title: title1,
          description: "Test blog 1 description",
          pubDate: "2021-01-01",
        },
        "Test blog 1 content"
      ),
      writeBlogContent(
        fileName2,
        {
          title: title2,
          description: "Test blog 2 description",
          pubDate: "2021-01-02",
          tags: ["test", "blog", "integration"],
        },
        "Test blog 2 content"
      ),
      writeBlogContent(
        fileName3,
        {
          title: title3,
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

  it("should return a list of blog posts with tag `blog`", async () => {
    const res = await fetch("http://localhost:4321/api/posts?tag=blog");

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toHaveLength(2);
    json.map((item: BlogContent) => {
      expect(item.tags).toContain("blog");
      expect([title2, title3]).toContain(item.title);
    });
  });

  it("should return an empty list if tag does not exist", async () => {
    const res = await fetch("http://localhost:4321/api/posts?tag=not-a-tag");

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toHaveLength(0);
  });

  it("should return 404 if method does not exist in route", async () => {
    const methods = ["DELETE", "PUT", "PATCH", "HEAD"];

    await Promise.all(
      methods.map(async (method) => {
        const res = await fetch("http://localhost:4321/api/posts", { method });

        expect(res.status).toBe(404);
      })
    );
  });

  it("should return a 500 if there is an error processing the request", async () => {
    const errorMessage = "Mock error";
    vi.spyOn(URLSearchParams.prototype, "get").mockImplementation(() => {
      throw new Error(errorMessage);
    });

    const res = await fetch("http://localhost:4321/api/posts?tag=blog");

    const json = await res.json();
    expect(res.status).toBe(500);
    expect(json.error).toBe(errorMessage);
    vi.restoreAllMocks();
  });
});
