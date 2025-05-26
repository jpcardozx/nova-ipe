/**
 * Next.js Configuration - Stable Consolidated Version
 * @version 9.0.0 - Stable Build
 * @date 25/05/2025
 */

const isProduction = process.env.NODE_ENV === "production";
const isDev = !isProduction;

const createWebpackConfig = require('./webpack.config.master');

const nextConfig = {
  reactStrictMode: true, // Reativado: Identifica side effects no código
  poweredByHeader: false,  compress: true, // GZip para maior performance
  
  experimental: {
    // Ativar apenas features maduras
    scrollRestoration: true,
    optimizeCss: true,
    optimizePackageImports: [],
  },

  serverExternalPackages: [
    '@sanity/client',
    '@sanity/image-url',
    '@sanity/visual-editing',
    'get-it',
    'get-it/middleware',
  ],

  compiler: {
    removeConsole: isProduction, // Limpa console.log em produção
    reactRemoveProperties: isProduction,
  },

  typescript: {
    ignoreBuildErrors: false, // Volta a validar erros em build
  },

  eslint: {
    ignoreDuringBuilds: false, // Volta a validar eslint em build
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [360, 640, 1080, 1920],
    imageSizes: [16, 32, 64, 128],
    minimumCacheTTL: 86400, // 1 dia
    dangerouslyAllowSVG: false,
    disableStaticImages: false,
    loader: 'default',
    path: '/_next/image',
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },

  onDemandEntries: {
    maxInactiveAge: 90 * 1000,
    pagesBufferLength: 5,
  },
  webpack: (config, { isServer, dev, buildId }) => {
    console.log(`🛠 Webpack Override | Build: ${buildId} | Server: ${isServer} | Dev: ${dev}`);

    // Exclude Sentry from studio pages to prevent conflicts
    if (config.resolve && config.resolve.alias) {
      // For studio routes, replace Sentry with empty modules
      if (config.name === 'client' || !isServer) {
        config.resolve.alias = {
          ...config.resolve.alias,
          // Prevent Sentry conflicts in studio pages
          '@sentry/nextjs': false,
          '@sentry/react': false,
          '@sentry/browser': false,
          '@sentry-internal/replay': false,
        };
      }
    }

    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'get-it': 'commonjs get-it',
        '@sanity/client': 'commonjs @sanity/client',
        '@sanity/visual-editing': 'commonjs @sanity/visual-editing',
      });
    }

    return createWebpackConfig(config, { isServer, dev, buildId });
  },
};

module.exports = nextConfig;
