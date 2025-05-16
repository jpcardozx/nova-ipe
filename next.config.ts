// TypeScript Next.js configuration for Vercel deployment
import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Basic configuration for module resolution
    if (!config.resolve) config.resolve = {};
    if (!config.resolve.alias) config.resolve.alias = {};
    if (!config.resolve.modules) config.resolve.modules = [];
    
    // Add module paths
    config.resolve.modules.push(
      path.join(process.cwd(), 'node_modules'),
      'node_modules'
    );
    
    // Basic aliases
    config.resolve.alias['@'] = path.join(process.cwd(), './');
    config.resolve.alias['@app'] = path.join(process.cwd(), './app');
    config.resolve.alias['@components'] = path.join(process.cwd(), './app/components');
    config.resolve.alias['@lib'] = path.join(process.cwd(), './lib');
    config.resolve.alias['@sections'] = path.join(process.cwd(), './sections');
    config.resolve.alias['autoprefixer'] = path.join(process.cwd(), 'node_modules/autoprefixer');
    config.resolve.alias['tailwindcss'] = path.join(process.cwd(), 'node_modules/tailwindcss');
    
    return config;
  },
};

export default nextConfig;
