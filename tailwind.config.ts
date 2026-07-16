import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        paper: "#f8fafc",
        brass: "#facc15",
        fern: "#10b981",
        clay: "#f97316",
        mist: "#f1f5f9",
        night: "#020617",
        brand: "#29aeee",
      },
      boxShadow: {
        premium: "0 34px 110px rgba(15, 23, 42, 0.22)",
        lift: "0 20px 60px rgba(15, 23, 42, 0.1)"
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
        outfit: ["Arial", "Helvetica", "sans-serif"],
      }
    }
  },
  plugins: []
};

export default config;
