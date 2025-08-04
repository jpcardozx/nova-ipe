/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // output: 'standalone', // Commented out for troubleshooting Sanity Studio loading issues
  
  // Optimized experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      '@heroicons/react',
      'date-fns',
      'sanity'
    ],
    ...(process.env.NODE_ENV === 'development' && {
      turbo: {
        rules: {
          '*.svg': ['@svgr/webpack'],
        },
      },
    }),
  },

  // Compiler config moved to conditional application below
  
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

  webpack: (config, { isServer, dev }) => {
    // Optimize chunks for production
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            chunks: 'all'
          },
          common: {
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true
          }
        }
      };
    }

    // Basic fallbacks for client-side only
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

    // Handle Sanity chunks
    config.resolve.alias = {
      ...config.resolve.alias,
      '@sanity/ui/dist/_chunks-cjs/_visual-editing.js$': false,
    };

    config.module.rules.push({
      test: /_visual-editing\.js$/,
      use: 'null-loader',
    });

    return config;
  },
};

// Apply removeConsole only in production
if (process.env.NODE_ENV === 'production') {
  nextConfig.compiler = {
    removeConsole: true,
  };
}

module.exports = nextConfig;
