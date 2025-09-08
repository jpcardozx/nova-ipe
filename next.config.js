/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
  
  // Configurações Turbopack (nova sintaxe)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // Compressão
  compress: true,
  
  // Configurações de desenvolvimento
  devIndicators: {
    position: 'bottom-right',
  },
  
  // Configurações de TypeScript
  typescript: {
    // Não falha o build em erros de TypeScript durante desenvolvimento
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  
  // Configurações ESLint
  eslint: {
    // Não falha o build em erros de ESLint durante desenvolvimento
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
};

module.exports = nextConfig;