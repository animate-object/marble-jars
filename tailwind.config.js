/** @type {import('tailwindcss').Config} */

const COLORS = [
  "red-500",
  "orange-400",
  "yellow-400",
  "lime-300",
  "green-400",
  "emerald-700",
  "teal-300",
  "cyan-400",
  "indigo-400",
  "violet-700",
  "purple-600",
  "pink-500",
];

const colorSafelist = COLORS.reduce((acc, color) => {
  acc.push(`bg-${color}`);
  acc.push(`text-${color}`);
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
