---
title: Testing dynamic astro endpoints
description: A look at how you can test dynamic API routes in a server rendered Astro application.
pubDate: "Jan 23 2024"
heroImage: "/integration-tests.png"
tags:
  - astro
  - testing
---

[Astro](https://astro.build/) is a web framework that has it's roots in static site generation but now provides server rendered, dynamic capabilities as the framework has matured. This site is built with Astro and servers both pre-rendered and dynamic endpoints served from [Cloudflare Pages](https://pages.cloudflare.com/). To enhance the functionality of this site, I want to explore the use of a dynamic API route to search my site's blog post content and return all the posts. I want to take this opportunity to build an API route, test that API route, and serve it dynamically.

## The background

We will use [Vitest](https://docs.astro.build/en/guides/testing/#vitest) test runner and [Astro's advanced experimental APIs](https://docs.astro.build/en/reference/cli-reference/#advanced-apis-experimental) to serve and test the API endpoint to filter content by tag.

Since the content is static, the test will do the following:

- Generate some test blog content files
- Serve the site
- Request the post endpoint to get the content
- Test the content is what we expect
- Tear down the served site
- Delete the test blog conent files

The endpoint will only allow `GET` requests at `/api/posts` and will return an array of blog post content.

## Write the tests

Add [Vitest](https://docs.astro.build/en/guides/testing/#vitest) to your `devDependencies` with your package manager of choice (ie `npm i -D vitest`) and add `test: vitest` to your `package.json` scripts. Create your test directory (ie `./test`) and add your API test file (ie `./test/api.posts.test.js`).

To encapsulate the test, we'll use the `beforeAll` and `afterAll` hooks in the test file to create and clean up our test environment. Before we run the tests, we will generate the test blog content, write the test blog content to the filesystem into Astro's `content` directory, and then start Astro's dev server to serve the API endpoint we will be testing.

First, we need to generate some test blog content using the `node:fs` and `node:path` Node standard library modules. We generate a string that will format our test content as [frontmatter](https://docs.astro.build/en/guides/cms/frontmatter-cms/) and then write that to the `src/content/blog/` directory so Astro can serve the content.

```js
// Create a function to generate the frontmatter string
// Pass function arguments so we can test the content later
function generateBlogContent(
  { title, description, pubDate, tags = [] }: BlogContent,
  content: string
) {
  const tagList = tags.map((tag) => `"${tag}"`).join(", ");
  const blog = `
  ---
  title: ${title}
  description: ${description}
  pubDate: ${pubDate}
  tags: [${tagList}]
  ---
  ${content}
  `;

  return blog;
}

// Create a function to write the content to Astro's
// content/blog directory as markdown
function writeBlogContent(
  fileName: string,
  { title, description, pubDate, tags },
  content: string
) {
  const blogContentDirectory = path.join(
    process.cwd(), "src/content/blog"
  );
  const file = `${fileName}.md`;
  const blog = generateBlogContent(
    { title, description, pubDate, tags },
    content
  );
  const filePath = path.join(blogContentDirectory, file);

  const output = await writeFile(
    filePath,
    blog,
    { encoding: "utf-8" }
  );

  return output;
}
```

Next, we want to import and start the Astro dev server before we run the tests against the API endpoint.

```js
import import { dev } from "astro";

// Note the "root" is set to  ".".
// This means you are
// running your tests from the root
// of the Astro project
devServer = await dev({
  root: ".",
});
```

Finally, we put it all together in the `beforeAll` hook:

```js
// We assign the dev server variable outside of
// the beforeAll hook so we can call the stop
// function in the afterAll hook to shut down
// the server
let devServer;

// Declare the test file names outside of the beforeAll
// hook so the can be used in both the afterAll hook
// and the tests
const fileName1 = "test-file-1";

beforeAll(async () => {
  // Create some test content
  await Promise.all([
    writeBlogContent(
      fileName1,
      {
        title: "Test Title",
        description: "Test blog 1 description",
        pubDate: "2021-01-01",
      },
      "Test blog 1 content"
    ),
  ]);

  // Start the server
  devServer = await dev({
    root: ".",
  });
});
```

Now we will use the `afterAll` hook to clean up our test environment after are tests run. We will need to delete the test content and stop the dev server.

```js
export async function deleteBlogContent(fileName) {
  const blogContentDirectory = path.join(
    process.cwd(),
    "src/content/blog"
  );
  const file = `${fileName}.md`;
  const filePath = path.join(blogContentDirectory, file);

  const output = await rm(filePath);

  return output;
}
```

Finally, we put it all together in the `afterAll` hook.

```js
// Delete the test content files
afterAll(async () => {
  await Promise.all([deleteBlogContent(fileName1)]);

  // Stop the dev servier
  await devServer.stop();
});
```

With are test setup and teardown running in the hooks, we are now ready to test our API endpoint. To write the integration tests, we will make an HTTP request to our API endpoint being servered by the dev server and then verify the response and data is what we expect.

The test should return a success with a JSON response of blog content.

```js
// The following example test expects to return one blog content item
it("Returns a 200 with the expected blog posts", async () => {
  const res = await fetch("http://localhost:4321/api/posts");
  const items = await res.json();
  const { data } = items[0];

  expect(res.status).toBe(200);
  expect(items).toHaveLength(1);
  expect(data).toEqual({
    title: "Test Title",
    description: "Test blog 1 description",
    pubDate: "2021-01-01",
  });
});
```

We've just put together the fundamentals for writing integration tests against Astro's [server endpoints for API routes](https://docs.astro.build/en/core-concepts/endpoints/#server-endpoints-api-routes). Now we just need to write the endpoint.

## Write the API

Let's write our API endpoint we will be testing. We will serve the endpoint from `localhost:4321/api/posts` so we will create the file `src/pages/api/posts.js` in our Astro project. This endpoint will use Asto's `getCollection` function to query all of the blog content data and return an array of JSON.

```js
// Use the getCollection function to query our blog content
import { getCollection } from "astro:content";

export const GET = async () => {
  // Grab the blog posts and sort by pubDate descending
  const posts = (await getCollection("blog")).sort(
    (a, b) =>
      b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  // Return the JSON object in the response
  // with a 200 success HTTP status
  return new Response(posts, { status: 200 });
};
```

That's it. We've now got an API enpoint that serves our post content and we are testing it to validate our expectations. It's fairly straight forward and we now have the base to test and add more complex interactions. You can reference the [API source code](https://github.com/apburnes/allpointsburnes/blob/main/apps/site/src/pages/api/posts.ts) for a more indepth look at my API endpoint that let's you query posts by tag and the [test source code](https://github.com/apburnes/allpointsburnes/blob/main/apps/site/src/test/api/posts.test.ts) for that endpoint. You can also test the live enpoint yourself by hitting `/api/posts`.
