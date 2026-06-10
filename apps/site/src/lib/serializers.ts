import type { BlogContent } from "../../src/types";

export function serializedBlogContent({
  data: { title, description, pubDate, tags },
  collection,
  id,
}: {
  data: BlogContent;
  collection: string;
  id: string;
}) {
  const url = `/${collection}/${id}`;
  return {
    collection,
    slug: id,
    url,
    title,
    description,
    pubDate,
    tags,
  };
}
