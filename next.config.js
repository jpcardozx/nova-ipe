/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Desabilitar temporariamente para evitar erros
  
  images: {
    unoptimized: true, // Bypass image optimization temporariamente
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

  serverExternalPackages: ['sanity'],
  
  // Webpack simplificado para evitar erros
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    // Evitar bundle splitting problemático
    config.optimization = {
      ...config.optimization,
      splitChunks: false,
    };

    return config;
  },
};

module.exports = nextConfig;
