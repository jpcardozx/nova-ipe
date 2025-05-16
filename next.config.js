/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cdn.sanity.io'],
    formats: ['image/avif', 'image/webp'],
  },
  // Keep Vercel analytics if already set up
  analyticsId: process.env.NEXT_PUBLIC_ANALYTICS_ID,
};

module.exports = nextConfig;