/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores do sistema de design Ipê
        primary: {
          DEFAULT: '#1a6f5c',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#0E1F2D',
          foreground: '#ffffff',
        },
        background: '#ffffff',
        foreground: '#333333',
        border: '#e5e5e5',
        input: '#f0f0f0',
        ring: 'rgba(26, 111, 92, 0.3)',
        // Cores específicas do Ipê
        brand: {
          green: '#1a6f5c',
          'green-dark': '#145a49',
          'green-light': '#3a8f7c',
          dark: '#0d1f2d',
          'dark-light': '#1e3042',
          light: '#f8f4e3',
        },
        accent: {
          yellow: '#ffcc00',
          'yellow-dark': '#e6b800',
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
      // Adicionando transformações explícitas para v4
      transform: {
        'lift': 'translateY(-0.25rem)',
        'scale-sm': 'scale(1.05)',
        'none': 'none',
      },
    },
  },
  plugins: [],
};