/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Minimal experimental config for Vercel compatibility
  experimental: {
    // Remove optimizeCss to prevent critters issues
    turbo: {
      rules: {
        '*.svg': ['@svgr/webpack'],
      },
    },
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
