/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  
  // Disable static export for now
  output: undefined,
  
  // Simplified image config
  images: {
    unoptimized: true,
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
  
  // Webpack configuration to fix Sanity UI issues
  webpack: (config, { isServer }) => {
    // Ignore specific problematic modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    // Replace problematic Sanity UI chunks with empty module
    config.resolve.alias = {
      ...config.resolve.alias,
      '@sanity/ui/dist/_chunks-cjs/_visual-editing.js$': false,
    };
    
    // Add module replacement rule
    config.module.rules.push({
      test: /_visual-editing\.js$/,
      use: 'null-loader'
    });
    
    return config;
  },
  
  // Remove experimental features
  experimental: {
    serverComponentsExternalPackages: ['sanity'],
  },
};

module.exports = nextConfig;
