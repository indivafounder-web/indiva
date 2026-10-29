import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: "#faf5f2",
          100: "#f3e6dc",
          200: "#e4c7b3",
          300: "#d0a07e",
          400: "#b8744f",
          500: "#8b4513",
          600: "#6b2c1a",
          700: "#541f14",
          800: "#3d150f",
          900: "#2a0e0a",
        },
        gold: {
          50: "#fbf8ef",
          100: "#f3ead0",
          200: "#e8d5a3",
          300: "#d4b56a",
          400: "#c4a35a",
          500: "#b08a3e",
          600: "#947033",
          700: "#74562a",
        },
        cream: {
          50: "#fffdf9",
          100: "#fbf7f0",
          200: "#f7f1e8",
          300: "#efe4d3",
          400: "#e2d0b5",
        },
        ink: "#1c120c",
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Outfit", "system-ui", "sans-serif"],
        script: ["Cormorant Garamond", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(84, 31, 20, 0.18)",
        lift: "0 18px 50px -16px rgba(28, 18, 12, 0.22)",
      },
    },
  },
  plugins: [],
};

export default config;
