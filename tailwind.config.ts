import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        primary: "rgb(var(--primary-rgb) / <alpha-value>)",
        secondary: "rgb(var(--secondary-rgb) / <alpha-value>)",
        accent: "rgb(var(--accent-rgb) / <alpha-value>)",
        "accent-2": "rgb(var(--accent-2-rgb) / <alpha-value>)",
        "accent-3": "rgb(var(--accent-3-rgb) / <alpha-value>)",
        "brand-from": "var(--brand-from)",
        "brand-to": "var(--brand-to)",
        "brand-orange": "var(--brand-orange)",
        "brand-blue": "var(--brand-blue)",
        "brand-purple": "var(--brand-purple)",
        "brand-orange-dark": "var(--brand-orange-dark)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [
    typography,
    forms({ strategy: 'class' }),
  ],
} satisfies Config;
