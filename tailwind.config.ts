import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nervura: {
          verde: "#1A4D2E",
          "verde-medio": "#2C6B42",
          creme: "#F5EFD6",
          "creme-escuro": "#EDE5C4",
          ouro: "#C9A84C",
          "texto-principal": "#111A14",
          "texto-secundario": "#3A5244",
          "texto-muted": "#7A9186",
          borda: "#D4CCAF",
          "branco-quente": "#FAF7EE",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
