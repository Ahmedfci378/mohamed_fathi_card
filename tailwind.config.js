/** @type {import('tailwindcss').Config} */
const rgb = (n) => `rgb(var(--${n}-rgb) / <alpha-value>)`;

module.exports = {
  future: { hoverOnlyWhenSupported: true },
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      // All driven by the card's `theme` config (see lib/theme.js)
      colors: {
        ink: rgb("ink"), surface: rgb("surface"), mist: rgb("mist"),
        accent: rgb("accent"), accent2: rgb("accent2"), "accent-deep": rgb("accent-deep"),
        "on-accent": rgb("on-accent"),
      },
      borderRadius: { card: "var(--radius-card)", control: "var(--radius-control)", tile: "var(--radius-tile)" },
      fontFamily: { sans: ["var(--font-sans)", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
