// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      screens: {
        xs: "375px",
      },
      keyframes: {
        progress: {
          "0%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(150%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        progress: "progress 2s ease-in-out infinite",
      },
    },
  },
  content: [
    "./src/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  plugins: [],
};

export default config;
