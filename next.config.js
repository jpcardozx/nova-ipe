const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // ❗️A API 'images.domains' está **obsoleta** — use 'remotePatterns' em vez disso
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
  rewrites: async () => [
    {
      source: '/studio/:path*',
      destination: '/studio/index.html', // usado para SPA estática do Sanity
    },
  ],

};

const sentryWebpackPluginOptions = {
  silent: true, // evita logs no terminal do Sentry
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
