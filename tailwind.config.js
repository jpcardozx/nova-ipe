/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E6AA2C',
          light: '#F7D660',
          dark: '#B8841C',
        },
        earth: {
          DEFAULT: '#8B4513',
          light: '#A0522D',
          dark: '#654321',
        },
      },
      keyframes: {
        shimmer_cls_opt: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        shimmer: "shimmer_cls_opt 1.5s infinite",
      },
    },
  },
  plugins: [],
};