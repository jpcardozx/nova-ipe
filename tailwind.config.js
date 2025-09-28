/** @type {import('tailwindcss').Config} */
module.exports = {
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
        // Core brand colors for real estate business
        primary: {
          DEFAULT: '#1a6f5c',
          light: '#3a8f7c',
          dark: '#145a49',
        },
        secondary: {
          DEFAULT: '#0d1f2d',
          light: '#1e3042',
        },
        accent: {
          DEFAULT: '#ffcc00',
          dark: '#e6b800',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair-display)', 'Georgia', 'serif'],
        lexend: ['var(--font-lexend)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    // @tailwindcss/typography removed for dependency optimization
  ],
};