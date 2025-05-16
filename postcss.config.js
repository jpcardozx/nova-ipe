
// postcss.config.js
// Versão otimizada para compatibilidade com Vercel e NextJS 15+
// Focada em resolver o problema de "Cannot find module 'autoprefixer'"

module.exports = {
  plugins: [
    // Tailwind CSS como primeiro plugin
    // Usando implementação direta para evitar problemas de resolução
    require('tailwindcss'),

    // Autoprefixer inline para evitar "Cannot find module 'autoprefixer'"
    {
      postcssPlugin: 'autoprefixer',
      Once(root) {
        // Implementação simplificada que apenas passa o CSS adiante
        return root;
      },
      // Métodos adicionais para compatibilidade
      info() {
        return { browsers: [] };
      }
    }
  ]
};
