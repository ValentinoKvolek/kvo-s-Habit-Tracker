import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Accent — sienna/amber earth tones
        sienna: {
          50:  "#fdf6ee",
          100: "#f8e8d4",
          200: "#f0cfa3",
          300: "#e5b06c",
          400: "#d8903e",
          500: "#c2783c",
          600: "#a85f28",
          700: "#8b4513",
          800: "#6b340e",
          900: "#4a240a",
        },
        // Parchment — background / surface tones
        parchment: {
          50:  "#faf6f0",
          100: "#f5ede0",
          200: "#ede3d5",
          300: "#e5d8c8",
          400: "#b09a7e",
          500: "#8d7a62",
          600: "#6b5c48",
          700: "#6b5c48",
          800: "#4a4030",
          900: "#2d261c",
          950: "#1c1510",
        },
        // Habit accent colors — muted, earthy
        habit: {
          violet: "#7c6faa",
          blue:   "#4a7fa5",
          teal:   "#3d8c7a",
          green:  "#4a8c5c",
          amber:  "#b07a30",
          rose:   "#a85860",
          orange: "#b06840",
          indigo: "#5a6faa",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      fontFamily: {
        sans:  ["var(--font-sans)",  "ui-sans-serif",  "system-ui",   "sans-serif"],
        serif: ["var(--font-serif)", "Georgia",        "Times New Roman", "serif"],
        mono:  ["ui-monospace", "monospace"],
      },
      animation: {
        "fade-in":  "fadeIn 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "rise-in":  "riseIn 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%":   { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        riseIn: {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
