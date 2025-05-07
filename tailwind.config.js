/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./App.{js,jsx,ts,tsx}", // Include App.js (outside src)
    "./src/**/*.{js,jsx,ts,tsx}", // Include all files in src and its subdirectories
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Roboto-Bold", "sans-serif"],
        body: ["OpenSans-Regular", "sans-serif"],
      },
      colors: {
        primary: "#9B0E10",
        primary: {
          50: "#FFF1F1",
          100: "#FFDFDF",
          200: "#FFC5C6",
          300: "#FF9D9E",
          400: "#FF6466",
          500: "#FF3437",
          600: "#ED1518",
          700: "#C80D10",
          800: "#9B0E10", // Primary
          900: "#881416",
          950: "#4B0405",
        },
      },
      fontSize: {
        h1: 28,
        h2: 24,
        body: 16,
        button: 18,
      },
    },
  },
  plugins: [],
};

// "./src/**/*.{js,jsx,ts,tsx}", // Include all files in src and its subdirectories
