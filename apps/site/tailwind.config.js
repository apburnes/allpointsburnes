import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Josefin Sans Variable", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  daisyui: {
    themes: ["corporate"],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
