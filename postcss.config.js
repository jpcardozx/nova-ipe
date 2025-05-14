// postcss.config.js - Configuração atualizada para Tailwind CSS v4
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {
      content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './sections/**/*.{js,ts,jsx,tsx}',
        './lib/**/*.{js,ts}',
        './src/**/*.{js,ts,jsx,tsx}',
      ],
    },
    autoprefixer: {},
  },
};
