import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundColor: {
        putihGaPutih: "rgb(247, 247, 247)",
        hitamGaHitam: "rgb(41,48,58)",
        oren: "#F09E39",
        slateBg: "#F5F7FB",
        orenHover: "#F09E39",
      },
      textColor: {
        hitamGaHitam: "rgb(41,48,58)",
        orenHover: "#F09E39",
        putihGaPutih: "rgb(247, 247, 247)",
        itemCoklat: "#5A5A5A",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
        Jakarta_Sans: ["var(--font-Jakarta_Sans)", "sans-serif"],
        Darumadrop_One: ["var(--font-Darumadrop-One)", "sans-serif"],
        tangerine: "var(--font-tangerine)",
        italiana: "var(--font-italiana)",
        italianno: "var(--font-italianno)",
        monaSans :"var(--font-monaSans)",
      },
      borderColor: {
        hitamGaHitam: "rgb(41,48,58)",
      },
    },
  },
  plugins: [],
} satisfies Config;
