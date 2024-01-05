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
    themes: [
      // {
      //   mytheme: {
      //     primary: "#a5b4fc",
      //     secondary: "#fde047",
      //     accent: "#4f46e5",
      //     neutral: "#202e2f",
      //     "base-100": "#fffcf2",
      //     info: "#2563eb",
      //     success: "#22c55e",
      //     warning: "#f97316",
      //     error: "#ff4958",
      //   },
      // },
      "corporate",
    ],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
