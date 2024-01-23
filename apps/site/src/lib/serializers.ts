import type { BlogContent } from "../../src/types";

export function serializedBlogContent({
  data: { title, description, pubDate, tags },
  collection,
  slug,
}: {
  data: BlogContent;
  collection: string;
  slug: string;
}) {
  const url = `/${collection}/${slug}`;
  return {
    collection,
    slug,
    url,
    title,
    description,
    pubDate,
    tags,
  };
}
