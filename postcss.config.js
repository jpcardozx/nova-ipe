
// postcss.config.js
// Versão simplificada para compatibilidade com Vercel e NextJS 15+
module.exports = {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
    ...(process.env.NODE_ENV === 'production' ? { 'cssnano': {} } : {})
  }
};
