/** @type {import('next').NextConfig} */
const nextConfig = {
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
  experimental: {
    optimizeCss: true,
    largePageDataBytes: 512 * 1000,
  },
  // Configuração dos módulos de resolução de caminho
  webpack: (config, { isServer }) => {
    // Configuração adicional para resolver imports absolutos
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
  // Remove console logs em produção
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
}

// Apenas adiciona Sentry em produção
if (process.env.NODE_ENV === 'production') {
  const { withSentryConfig } = require('@sentry/nextjs')
  module.exports = withSentryConfig(nextConfig, {
    silent: true,
    dryRun: false,
  })
} else {
  module.exports = nextConfig
}