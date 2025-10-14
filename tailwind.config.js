/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx,mdx}",
    "./studio/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core brand colors - AMBER palette (matching Footer design)
        primary: {
          DEFAULT: '#FFAD43', // Amber 500 - Main brand color
          light: '#FFB85F',
          dark: '#e89c36',
        },
        secondary: {
          DEFAULT: '#0D1F2D', // Dark navy background
          light: '#1e3042',
        },
        accent: {
          DEFAULT: '#F7D7A3', // Light cream text
          dark: '#e6c58f',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair-display)', 'Georgia', 'serif'],
        lexend: ['var(--font-lexend)', 'system-ui', 'sans-serif'],
      },
      animation: {
        shimmer: 'shimmer 1.5s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [
    // @tailwindcss/typography removed for dependency optimization
  ],
};