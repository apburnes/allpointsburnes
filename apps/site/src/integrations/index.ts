import type { AstroIntegration } from "astro";

export const htmx = function createIntegrationHTMX(): AstroIntegration {
  return {
    name: "htmx",
    hooks: {
      "astro:config:setup": ({ injectScript }) => {
        injectScript(
          "page",
          `
            import * as htmx from "htmx.org";
            document.addEventListener('astro:after-swap', () => {
              htmx.process(document.body)
            })
        `
        );
      },
    },
  };
}
