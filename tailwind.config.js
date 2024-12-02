/** @type {import('tailwindcss').Config} */

const COLORS = [
  "coral",
  "sunshine",
  "saffron",
  "leaf",
  "breeze",
  "ocean",
  "royal",
  "lilac",
  "rose",
  "sand",
];

const colorSafelist = COLORS.reduce((acc, color) => {
  acc.push(`hc-bg-${color}`);
  acc.push(`hc-${color}`);
  acc.push(`hc-bd-${color}`);
  return acc;
}, []);

module.exports = {
  content: [
    "index.html",
    "./src/**/*.{html,ts,tsx}",
    "node_modules/daisyui/dist/**/*.js",
    "node_modules/react-daisyui/dist/**/*.js",
  ],

  safelist: colorSafelist,
  plugins: [require("daisyui")],
  theme: {
    extend: {},
  },
};
