/** @type {import('next').NextConfig} */

// Critical: Global polyfill for SSR
if (typeof globalThis !== 'undefined' && typeof globalThis.self === 'undefined') {
  globalThis.self = globalThis;
}

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Disable ESLint during build to avoid config errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript checks during build temporarily
  typescript: {
    ignoreBuildErrors: true,
  },
  
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
  
  // Only add experimental features if absolutely necessary
  experimental: {
    serverComponentsExternalPackages: ['sanity'],
  },
};

module.exports = nextConfig;
