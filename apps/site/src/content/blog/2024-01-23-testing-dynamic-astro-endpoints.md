---
title: Testing dynamic astro endpoints
description: A look at how you can test dynamic API routes in a server rendered Astro application.
pubDate: "Jan 23 2024"
heroImage: "/shared-vehicles.png"
---

[Astro](https://astro.build/) is a web framework that has it's roots in static site generation but now provides server rendered, dynamic capabilities as the framework has matured. This site is built with Astro and servers both pre-rendered and dynamic endpoints server from [Cloudflare Pages](https://pages.cloudflare.com/). To enhance the functionality of this site, I want to explore the use of a dynamic API route to search my site's content by tag and return all the related content containing the queried tag. There are other stragies to filter static content by tag but I want to take this opportunity to build an API route, test the API route, and serve it dynamically.

## The background

We will use [Vitest](https://docs.astro.build/en/guides/testing/#vitest) test runner and [Astro's advanced experimental APIs](https://docs.astro.build/en/reference/cli-reference/#advanced-apis-experimental) to serve and test the API endpoint to filter content by tag.

Since the content is static, the test will do the following:
- Generate some test blog content with some tags
- Build the site
- Serve the site
- Request the tag endpoints to get the content
- Request the tag endpoints with a query to get a subset of the content
- Tear down the served site
- Clean up the test blog conent

The endpoint will only allow `GET` requests at `/api/tags` and it will query the content using `?tag=<query>` querstring.

## Setup the tests



## Writing the tests
