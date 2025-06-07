/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Desativado temporariamente para evitar problemas durante debugging
  swcMinify: false, // Desativado temporariamente para obter erros mais claros
  
  // Desativa exportação estática temporariamente
  output: undefined,

  images: {
    unoptimized: true, // Desativa otimização temporariamente para evitar problemas
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },

  webpack: (config, { isServer }) => {
    // Ignora módulos Node.js que causam problemas no browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      util: false,
      url: false,
      querystring: false,
    };

    // Substitui chunks problemáticos do Sanity
    config.resolve.alias = {
      ...config.resolve.alias,
      '@sanity/ui/dist/_chunks-cjs/_visual-editing.js$': false,
    };

    // Adiciona regra para ignorar arquivos problemáticos
    config.module.rules.push({
      test: /_visual-editing\.js$/,
      use: 'null-loader',
    });

    return config;
  },

  // Configuração experimental mínima
  experimental: {},
};

module.exports = nextConfig;
