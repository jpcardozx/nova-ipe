// next.config.js
const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/studio/:path*',
        destination: '/studio/index.html', // usado para servir SPA estática do Sanity
      },
    ];
  },
};

const sentryWebpackPluginOptions = {
  silent: true, // evita logs desnecessários do Sentry
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);