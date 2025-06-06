// @ts-check

/**
 * Configuration related to Sanity.io integration.
 * @type {import('next').NextConfig}
 **/
const sanityConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
  },

  // External packages for server components
  experimental: {
    serverComponentsExternalPackages: [
      '@sanity/client',
      '@sanity/image-url',
      '@sanity/vision',
      '@sanity/visual-editing',
      'sharp',
    ],
  },

  // Sanity specific environment variables (already handled by process.env, but good for documentation)
  // env: {
  //   NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  //   NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
  //   NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  //   // SANITY_API_READ_TOKEN: process.env.SANITY_API_READ_TOKEN, // Server-side only
  // },

  // If you are using next-sanity, much of the configuration might be handled by it.
  // This file can hold additional Next.js specific settings related to Sanity,
  // or be a place to centralize Sanity-related logic for next.config.js.

  // Example: If you had specific webpack modifications for Sanity parts, they could go here
  // and be merged in the main next.config.js.
  // webpack: (config, { isServer }) => {
  //   // Modify config for Sanity if needed
  //   return config;
  // }
};

module.exports = sanityConfig;
