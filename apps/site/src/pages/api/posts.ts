import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { serializedBlogContent } from "../../lib/serializers";

export const GET: APIRoute = async ({ request }) => {
  try {
    const requestUrl = new URL(request.url);
    const searchParams = new URLSearchParams(requestUrl.searchParams);
    const tag = searchParams.get("tag");

    const posts = (await getCollection("blog"))
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .filter((post) => {
        if (!tag) return true;

        if (!post.data.tags) {
          return false;
        }

        const tags = post.data.tags.join(" ");
        return tags.includes(tag);
      })
      .map(serializedBlogContent);

    return new Response(JSON.stringify(posts, null, 2), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
