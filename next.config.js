/**
 * Next.js Configuration - Performance optimized
 * @version 5.0.0
 * @date 23/05/2025
 */

const isProduction = process.env.NODE_ENV === "production";
const isVercel = process.env.VERCEL === "1";
const isDev = !isProduction;
const isFastDev = process.env.FAST_DEV === "true";

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Cache optimization - critical for performance
  onDemandEntries: {
    maxInactiveAge: isDev ? (isFastDev ? 60 * 1000 : 15 * 1000) : 60 * 1000,
    pagesBufferLength: isDev ? (isFastDev ? 4 : 2) : 4,
  },

  // Critical: Compiler optimizations
  compiler: {
    // Enable SWC minification for better performance
    removeConsole: isProduction ? { exclude: ['error'] } : false,
    // Remove React development overhead in production
    reactRemoveProperties: isProduction,
  },


  // Output optimization
  // output: 'standalone', // REMOVIDO para dev mais rápido

  // Improved development performance
  devIndicators: {
    position: 'bottom-right',
  },

  // Memory and startup optimization
  typescript: {
    // Speeds up development by checking types only in production builds
    // or when explicitly running type checking with pnpm run typecheck
    ignoreBuildErrors: isDev && isFastDev,
    tsconfigPath: isDev && isFastDev ? './tsconfig.dev.json' : './tsconfig.json',
  },

  eslint: {
    // Speeds up development by disabling eslint during development when in fast mode
    ignoreDuringBuilds: isDev && isFastDev,
  },

  // Note: serverComponentsExternalPackages is deprecated in Next.js 15+
  // Prisma client is now automatically externalized

  experimental: {
    // Performance optimizations - reduced for dev mode
    optimizePackageImports: isProduction ? [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-toast',
      'framer-motion',
      'react-icons',
      '@sanity/client',
      '@chakra-ui/react'
    ] : [],
    webpackBuildWorker: isProduction,
    optimizeCss: isProduction,
    // Improved memory usage and rendering performance - disabled in dev for speed
    optimizeServerReact: isProduction,
    // Server features
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: isDev ? ['localhost:3000'] : ['nova-ipe.vercel.app']
    },
    // Improved image loading experience
    scrollRestoration: true,
    taint: isProduction
  },

  // Enhanced image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048], // Added 2048 for high-res displays
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: isDev ? 60 : 3600 * 24 * 7, // Cache for a week in production
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Removed: quality, allowFutureImage
    disableStaticImages: false, // Enable static image optimization
    loader: 'default',
    path: '/_next/image',
  },

  // Headers for security and caching
  async headers() {
    return [
      {
        // Configuração geral para todos os paths
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Server', value: 'Next.js' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self';" }
        ]
      },
      {
        // Configuração específica para HTML
        source: '/((?!_next|api).*)',
        headers: [
          { key: 'Content-Type', value: 'text/html; charset=utf-8' },
          { key: 'Cache-Control', value: isDev ? 'no-store, must-revalidate' : 'public, max-age=3600' }
        ]
      },
      {
        // Configuração específica para arquivos estáticos JavaScript
        source: '/_next/static/(.*)\\.js$',
        headers: [
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      },
      {
        // Configuração para módulos JavaScript
        source: '/_next/static/(.*)\\.mjs$',
        headers: [
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      },
      {
        // Configuração específica para arquivos estáticos CSS
        source: '/_next/static/(.*)\\.css$',
        headers: [
          { key: 'Content-Type', value: 'text/css; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      },
      {
        // Configuração para manifest
        source: '/manifest\\.webmanifest',
        headers: [
          { key: 'Content-Type', value: 'application/manifest+json' },
          { key: 'Cache-Control', value: 'public, max-age=86400' }
        ]
      },
      {
        // Configuração para favicon
        source: '/favicon\\.ico',
        headers: [
          { key: 'Content-Type', value: 'image/x-icon' },
          { key: 'Cache-Control', value: 'public, max-age=31536000' }
        ]
      },
      {
        // Configuração específica para imagens PNG
        source: '/icons/(.*)\\.png$',
        headers: [
          { key: 'Content-Type', value: 'image/png' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      },
      {
        // Configuração específica para imagens SVG
        source: '/icons/(.*)\\.svg$',
        headers: [
          { key: 'Content-Type', value: 'image/svg+xml' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      }
    ];
  },

  // Enhanced webpack optimization for performance
  webpack: (config, { isServer, dev }) => {
    // Aplicar patches para corrigir problemas do webpack
    const applyWebpackFixes = require('./webpack-patch');
    config = applyWebpackFixes(config);

    // Polyfill 'self' para ambiente do servidor
    if (isServer) {
      config.plugins = config.plugins || [];
      config.plugins.push(
        new (require('webpack')).DefinePlugin({
          'self': 'globalThis'
        })
      );
    }

    // Configure optimization only in production or when not in fast-dev mode
    if (isProduction || (!isFastDev && !dev)) {
      // Alias optimization to avoid loading unused icon sets
      config.resolve.alias = {
        ...config.resolve.alias,
        'react-icons/fa': false,
        'react-icons/md': false,
        'react-icons/hi': false,
      };

      // Production-specific optimizations
      if (isProduction && config.optimization) {
        // Enhanced code splitting for production only
        if (config.optimization.splitChunks) {
          config.optimization.splitChunks = {
            chunks: 'all',
            cacheGroups: {
              commons: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all'
              }
            }
          };
        }
      }
    } else {
      // Development optimizations for faster builds
      if (config.optimization) {
        // Turn off name mangling in development for better debugging
        if (config.optimization.minimizer) {
          config.optimization.minimize = false;
        }
      }
    }

    return config;
  },
};

// Development-specific configurations
// Removed unsupported webpackDevMiddleware for Next.js 15+

module.exports = nextConfig;
