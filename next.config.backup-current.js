/**
 * Next.js Configuration - Next 14 Compatible Version  
 * @version 10.1.0 - Refractor + Sentry Fixed
 * @date 26/05/2025
 */

const isProduction = process.env.NODE_ENV === "production";
const isDev = !isProduction;
const path = require('path');

const createWebpackConfig = require('./webpack.config.master');

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  // Prevent Next.js from optimizing away refractor modules
  transpilePackages: [
    'refractor', 
    'react-refractor', 
    'hastscript', 
    'hast-util-parse-selector', 
    'property-information',
    'space-separated-tokens',
    'comma-separated-tokens',
    'hast-to-hyperscript',
    'lowlight',
    'fault'
  ],
  
  experimental: {
    // Features compatíveis com Next 14
    scrollRestoration: true,
    optimizeCss: true,
    optimizePackageImports: ['lodash', 'date-fns'],
    
    serverComponentsExternalPackages: [
      '@sanity/client',
      '@sanity/image-url', 
      '@sanity/visual-editing',
      'get-it',
      'sharp',
      'canvas'
    ],
  },

  compiler: {
    removeConsole: isProduction,
    reactRemoveProperties: isProduction,
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  eslint: {
    ignoreDuringBuilds: false,
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
    console.log(`🛠 Webpack Override | Build: ${buildId} | Server: ${isServer} | Dev: ${dev}`);    // Always configure refractor language resolution for Sanity
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
      // Safe refractor language mapping
    try {      config.resolve.alias = {
        ...config.resolve.alias,
        // Fix react-refractor default export issue
        'react-refractor$': require.resolve('react-refractor'),
        'refractor/lang/bash.js': require.resolve('refractor/lang/bash.js'),
        'refractor/lang/javascript.js': require.resolve('refractor/lang/javascript.js'),
        'refractor/lang/json.js': require.resolve('refractor/lang/json.js'),
        'refractor/lang/jsx.js': require.resolve('refractor/lang/jsx.js'),
        'refractor/lang/typescript.js': require.resolve('refractor/lang/typescript.js'),
      };
      console.log('✅ Refractor language aliases configured successfully');
    } catch (error) {
      console.warn('⚠️ Could not configure refractor paths:', error.message);
      // Fallback to direct path resolution
      config.resolve.alias = {
        ...config.resolve.alias,
        'react-refractor$': path.join(__dirname, 'node_modules', 'react-refractor', 'lib', 'index.js'),
        'refractor/lang/bash.js': path.join(__dirname, 'node_modules', 'refractor', 'lang', 'bash.js'),
        'refractor/lang/javascript.js': path.join(__dirname, 'node_modules', 'refractor', 'lang', 'javascript.js'),
        'refractor/lang/json.js': path.join(__dirname, 'node_modules', 'refractor', 'lang', 'json.js'),
        'refractor/lang/jsx.js': path.join(__dirname, 'node_modules', 'refractor', 'lang', 'jsx.js'),
        'refractor/lang/typescript.js': path.join(__dirname, 'node_modules', 'refractor', 'lang', 'typescript.js'),
      };
    }    // Fix react-refractor export issue - it exports named exports, not default
    config.resolve.alias = {
      ...config.resolve.alias,
      // Map react-refractor to its proper export and create a default export wrapper
      'react-refractor$': path.join(__dirname, 'lib', 'react-refractor-wrapper.js'),
    };

    // Client-side production optimizations
    if (!dev && !isServer) {
      console.log('🎯 Aplicando exclusões conservadoras para build de produção...');
      
      // Keep Sentry working but exclude studio-only packages
      config.resolve.alias = {
        ...config.resolve.alias,
        
        // Studio-only packages (não necessários no cliente)
        '@sanity/vision': false,
        '@sanity/telemetry': false,
        
        // CodeMirror (apenas para o studio)
        '@codemirror/autocomplete': false,
        '@codemirror/commands': false,
        '@codemirror/lang-javascript': false,
        '@uiw/react-codemirror': false,
        
        // Dev dependencies que podem vazar
        'json-2-csv': false,
        'doc-path': false,
        'deeks': false,
      };
    }

    // Server-side externals
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'get-it': 'commonjs get-it',
        '@sanity/client': 'commonjs @sanity/client',
        '@sanity/visual-editing': 'commonjs @sanity/visual-editing',
        'sharp': 'commonjs sharp',
        'canvas': 'commonjs canvas',
      });
    }

    return createWebpackConfig(config, { isServer, dev, buildId });
  },
};

module.exports = nextConfig;