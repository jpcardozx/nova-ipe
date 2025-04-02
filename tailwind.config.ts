import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './sections/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#003366',
        'accent-yellow': '#ffcc00',
        'gray-light': '#f8f8f8',
        'brand-green': '#1a6f5c',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
        italiana: ['var(--font-italiana)', 'serif'],
        libre: ['var(--font-libre)', 'serif'],
        cormorant: ['var(--font-cormorant)', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
