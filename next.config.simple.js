/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  
  experimental: {
    serverComponentsExternalPackages: [
      '@sanity/client',
      '@sanity/image-url',
      'sharp',
    ],
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },

  webpack: (config, { isServer }) => {
    // Ignorar source maps problemáticos
    config.module.rules.push({
      test: /\.map$/,
      use: 'ignore-loader'
    });

    // Externals para server-side
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@sanity/client': 'commonjs @sanity/client',
        'sharp': 'commonjs sharp',
      });
    }

    return config;
  },
};

module.exports = nextConfig;
