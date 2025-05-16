// Require PostCSS configuration protection
require('./scripts/postcss-config-hook');

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.sanity.io'],
    formats: ['image/avif', 'image/webp'],
  },
  // Note: swcMinify and analyticsId were removed as they are not recognized in Next.js 15.2.4
};

module.exports = nextConfig;