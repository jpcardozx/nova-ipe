/** @type {import('next').NextConfig} */
const nextConfig = {  reactStrictMode: true, // Re-enabled for better performance and debugging
  swcMinify: true, // Re-enabled for better performance
  
  // Performance optimizations (Turbopack compatible)
  experimental: {
    optimizeCss: true,
    turbo: {
      loaders: {
        '.svg': ['@svgr/webpack'],
      },
    },
  },

  images: {
    unoptimized: false, // Re-enabled image optimization for better performance
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
    // Bundle size optimization
    if (!isServer) {
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
    }

    // Optimize chunk loading
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        chunks: 'all',
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            enforce: true,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      },
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
    });    return config;
  },
};

module.exports = nextConfig;
