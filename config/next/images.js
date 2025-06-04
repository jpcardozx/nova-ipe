// @ts-check

/**
 * Configuration for Next.js Image Optimization.
 * @type {import('next').NextConfig}
 **/
const imagesConfig = {
  images: {
    // Remote patterns for images from external sources (e.g., CMS, CDNs)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        // port: '', // Optional
        // pathname: '/images/your-project-id/production/**', // Be specific if possible
      },
      // Add other remote patterns as needed
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      // },
    ],

    // Allowed image domains (alternative to remotePatterns for simpler cases)
    // domains: ['cdn.sanity.io', 'example.com'],

    // Device sizes for generating different image versions
    // deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Image sizes for specific image instances (used with `sizes` prop in <Image>)
    // imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Path prefix for optimized images
    // path: '/_next/image',

    // Loader to use for image optimization
    // loader: 'default', // 'default' | 'imgix' | 'cloudinary' | 'akamai' | 'custom'

    // Custom loader path (if loader is 'custom')
    // loaderFile: './lib/my-custom-loader.js',

    // Disable static imports of images (not recommended generally)
    // disableStaticImages: false,

    // Minimum cache TTL for optimized images (in seconds)
    // minimumCacheTTL: 60,

    // Formats to use for optimized images
    formats: ['image/avif', 'image/webp'],

    // Dangerously allow SVGs to be optimized (can have security implications)
    // dangerouslyAllowSVG: false,
    // contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // If dangerouslyAllowSVG is true

    // Unoptimized images (useful for specific cases, e.g. SVGs that should not be optimized)
    unoptimized: false, // Set to true to disable image optimization globally (not recommended)
  },
};

module.exports = imagesConfig;
