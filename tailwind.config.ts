import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A",
        secondary: "#F59E0B",
        customGray: {
          100: "#f5f5f5",
          500: "#a0a0a0",
          900: "#1a1a1a",
        },
      },
    },
  },
  plugins: [],
};
export default config;
