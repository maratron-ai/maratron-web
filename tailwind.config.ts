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
        primary: ({ opacityValue }) =>
          opacityValue !== undefined
            ? `rgb(var(--primary-rgb) / ${opacityValue})`
            : `rgb(var(--primary-rgb))`,
        secondary: ({ opacityValue }) =>
          opacityValue !== undefined
            ? `rgb(var(--secondary-rgb) / ${opacityValue})`
            : `rgb(var(--secondary-rgb))`,
        accent: ({ opacityValue }) =>
          opacityValue !== undefined
            ? `rgb(var(--accent-rgb) / ${opacityValue})`
            : `rgb(var(--accent-rgb))`,
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
  plugins: [typography, forms],
} satisfies Config;
