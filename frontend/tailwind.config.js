/** @type {import('tailwindcss').Config} */
// Light "beach" palette. Token names (brand/violet/teal/sand) are kept from v1 so existing
// components pick up the new theme: brand = sea blue, violet = seafoam green, teal = aqua.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Nunito", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        display: ["Fredoka", "Nunito", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ivory: "#F3FAF7",
        ink: { DEFAULT: "#34545D", soft: "#5F7F87", faint: "#7A979E" },
        line: "#DCEBEA",
        brand: { 50: "#EAF7FB", 100: "#CDEEF6", 500: "#6CC3DC", 600: "#2F7F99", 700: "#27627A" },
        violet: { 50: "#E7F7EC", 500: "#2A7A52" },
        teal: { 50: "#E3F6F3", 500: "#3AAFA3" },
        sand: { 50: "#FFF4DC", 500: "#C9892B" },
        coral: { 50: "#FFE9E3", 500: "#D9715A" },
      },
      boxShadow: {
        card: "0 2px 0 rgba(120,190,200,0.10), 0 10px 28px rgba(108,195,220,0.14)",
      },
    },
  },
  plugins: [],
};
