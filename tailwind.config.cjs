const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#ffde59",
        secondary: "#59f5ad",
        third: "#a78cdd",
        fourth: "#ff5757",
        dark: "#111111",
      },
    },
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "3rem" },
    },
  },
  plugins: [flowbite.plugin()],
};
