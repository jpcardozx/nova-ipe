/**
 * Next.js Configuration - EMERGENCY RUNTIME REPAIR
 * @version 8.0.0 - CRITICAL FIX
 * @date 25/05/2025
 */

const isProduction = process.env.NODE_ENV === "production";
const isDev = !isProduction;

// Import the emergency webpack configuration
const createWebpackConfig = require('./webpack.config.master');

const nextConfig = {
  reactStrictMode: false, // Disabled temporarily to prevent runtime conflicts
  poweredByHeader: false,
  compress: false, // Disabled in emergency mode

  // EMERGENCY: Minimal configuration to prevent runtime corruption
  experimental: {
    // Disable all experimental features that might cause instability
    webpackBuildWorker: false,
    optimizeServerReact: false,
    scrollRestoration: false,
    optimizePackageImports: false,
    optimizeCss: false,
    taint: false
  },

  // EMERGENCY: Ultra-conservative compiler settings
  compiler: {
    removeConsole: false, // Keep all console logs for debugging
    reactRemoveProperties: false // Keep all React properties
  },

  // EMERGENCY: Disable optimizations that might corrupt webpack
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 2
  },

  // EMERGENCY: Conservative TypeScript and ESLint settings
  typescript: {
    ignoreBuildErrors: isDev, // Allow builds to continue with TS errors in dev
  },

  eslint: {
    ignoreDuringBuilds: isDev, // Skip ESLint in dev for speed
  },

  // EMERGENCY: Ultra-conservative image settings
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**'
      }
    ],
    formats: ['image/webp'], // Simplified formats
    deviceSizes: [640, 1080, 1920],
    imageSizes: [16, 32, 64, 128],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false, // Disabled for safety
    disableStaticImages: false,
    loader: 'default',
    path: '/_next/image',
  },

  // EMERGENCY: Minimal headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Cache-Control', value: 'no-store, must-revalidate' }
        ]
      }
    ];
  },

  // EMERGENCY: Critical webpack override
  webpack: (config, { isServer, dev, buildId }) => {
    console.log('🚨 EMERGENCY WEBPACK CONFIG APPLIED');
    return createWebpackConfig(config, { isServer, dev, buildId });
  },
};

module.exports = nextConfig;
