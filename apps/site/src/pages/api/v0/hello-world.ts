export const prerender = false;

import { type APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
  const cookies = request.headers.get("Cookie");
  // q: get request cookies by name
  const cookie = cookies?.split(";").find((cookie) => cookie === "name=astro");
  const now = Date.now();

  if (request.headers.get("Content-Type") !== "application/json") {
    return new Response(
      JSON.stringify({
        message: "Hello, world!",
        now,
        authenticated: !!cookie,
      }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      }
    );
  }

  return new Response(null, { status: 400 });
};

export const POST: APIRoute = async () => {
  return new Response(JSON.stringify({ message: "Hello, world!" }), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "Set-Cookie": "name=astro",
    },
  });
};
