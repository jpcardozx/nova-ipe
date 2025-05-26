// next.config.studio.js - Special config for studio route
const isStudioRoute = process.env.NEXT_PUBLIC_STUDIO_MODE === 'true';

const studioConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  experimental: {
    optimizeCss: true,
  },

  // Exclude Sentry from studio builds
  webpack: (config, { isServer, dev }) => {
    if (isStudioRoute || config.name === 'studio') {
      // Replace Sentry imports with empty modules for studio
      config.resolve = config.resolve || {};
      config.resolve.alias = {
        ...config.resolve.alias,
        '@sentry/nextjs': false,
        '@sentry/react': false,
        '@sentry/browser': false,
        '@sentry/core': false,
        '@sentry-internal/replay': false,
      };
    }

    return config;
  },

  // Disable Sentry instrumentation for studio
  sentry: {
    disableServerWebpackPlugin: true,
    disableClientWebpackPlugin: true,
  },
};

module.exports = studioConfig;
