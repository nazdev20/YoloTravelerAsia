/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    darkMode: "class",
    extend: {
       backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors:{
      primary: "#ffde59",
      secondary: "#59f5ad",
      third:"#a78cdd",
      fourth:"#ff5757",
      dark: "#111111"
    },},
    container:{
      center:true,
      padding:{
        default: "1rem",
        sm: "3rem",
      }
    }
    
  },
  plugins: [flowbite.plugin(),],
  
}
