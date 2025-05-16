
// postcss.config.js
// Versão otimizada para compatibilidade com Vercel e NextJS 15+
// Usando caminhos absolutos para garantir compatibilidade
const path = require('path');

module.exports = {
  plugins: [
    require(path.resolve('./node_modules/tailwindcss')),
    require(path.resolve('./node_modules/autoprefixer'))
  ]
};
