import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0B0F",
        surface: "#111318",
        "surface-2": "#1A1D26",
        border: "#252830",
        "border-active": "#353A47",
        primary: "#6C8EF5",
        secondary: "#9B6CF5",
        warning: "#F5A623",
        "warning-bg": "#1F1A0A",
        success: "#22C55E",
        "success-bg": "#0F2218",
        error: "#EF4444",
        "error-bg": "#1F0A0A",
        "text-primary": "#F0F2F7",
        "text-secondary": "#8B92A5",
        "text-muted": "#50566A",
      },
      fontFamily: {
        cairo: ["var(--font-cairo)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "primary-gradient": "linear-gradient(135deg, #6C8EF5 0%, #9B6CF5 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
