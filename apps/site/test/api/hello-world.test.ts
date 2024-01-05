import { describe, expect, it } from "vitest";
import { GET, POST } from "../../src/pages/api/v0/hello-world.ts";

describe("API: /api/v0/hello-world", () => {
  describe("GET", () => {
    it("should return a 200", async () => {
      const res = await GET({
        // @ts-ignore
        request: {
          headers: new Headers(),
        },
      });
      expect(res.status).toEqual(200);
    });

    it("should return a json response", async () => {
      // @ts-ignore
      const res = await GET({ request: { headers: new Headers() } });
      expect(res.headers.get("content-type")).toEqual("application/json");
    });

    it("should return a json response with the correct message", async () => {
      // @ts-ignore
      const res = await GET({ request: { headers: new Headers() } });
      const json = await res.json();
      expect(json.message).toEqual("Hello, world!");
    });
    it("should return a json response with the unauthenticated value", async () => {
      // @ts-ignore
      const res = await GET({ request: { headers: new Headers() } });
      const json = await res.json();
      expect(json.authenticated).toEqual(false);
    });

    it("should return a json response with the authenticated value", async () => {
      const headers = new Headers();
      headers.append("Cookie", "name=astro");
      // @ts-ignore
      const res = await GET({ request: { headers } });
      const json = await res.json();
      expect(json.authenticated).toEqual(true);
    });
  });

  describe("POST", () => {
    it("should return a 200", async () => {
      // @ts-ignore
      const res = await POST({ request: { headers: new Headers() } });
      expect(res.status).toEqual(200);
    });

    it("should return a json response", async () => {
      // @ts-ignore
      const res = await POST({ request: { headers: new Headers() } });
      const cookie = res.headers.getSetCookie().find((c) => c === "name=astro");
      const json = await res.json();
      expect(cookie).toEqual("name=astro");
      expect(res.headers.get("content-type")).toEqual("application/json");
      expect(json.message).toEqual("Hello, world!");
    });
  });
});
