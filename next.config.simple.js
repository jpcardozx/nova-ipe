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
  
  // Remove experimental features
  experimental: {
    serverComponentsExternalPackages: ['sanity'],
  },
};

module.exports = nextConfig;
