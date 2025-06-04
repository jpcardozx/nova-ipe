/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Enhanced server components configuration
  experimental: {
    // External packages that should be treated as server components
    serverComponentsExternalPackages: ['sanity'],
    // Optimize imports from large packages
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    // More relaxed ESM externals handling
    esmExternals: 'loose',
    // Improve build times
    optimizeServerReact: true,
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
  
  // Simple redirects without problematic patterns
  async redirects() {
    return [];
  },
};

module.exports = nextConfig;
