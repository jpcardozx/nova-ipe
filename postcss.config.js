
// postcss.config.js
// Versão otimizada para compatibilidade com Vercel e NextJS 15+
const path = require('path');

module.exports = {
  plugins: [
    require('tailwindcss')({
      config: path.join(__dirname, 'tailwind.config.js')
    }),
    require('autoprefixer')
  ]
};
