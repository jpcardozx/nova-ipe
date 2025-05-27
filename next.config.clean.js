/**
 * Next.js Configuration - Clean Version
 * @version 10.2.0 - Fixed Webpack + Sanity Issues
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
    console.log(`🛠 Webpack Override | Build: ${buildId} | Server: ${isServer} | Dev: ${dev}`);
    
    // Always configure refractor language resolution for Sanity
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    
    // Safe refractor language mapping
    try {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Fix react-refractor default export issue
        'react-refractor$': path.join(__dirname, 'lib', 'react-refractor-wrapper.js'),
        'refractor/lang/bash': require.resolve('refractor/lang/bash.js'),
        'refractor/lang/javascript': require.resolve('refractor/lang/javascript.js'),
        'refractor/lang/json': require.resolve('refractor/lang/json.js'),
        'refractor/lang/jsx': require.resolve('refractor/lang/jsx.js'),
        'refractor/lang/typescript': require.resolve('refractor/lang/typescript.js'),
      };
      console.log('✅ Refractor language aliases configured successfully');
    } catch (error) {
      console.warn('⚠️ Could not configure refractor paths:', error.message);
      // Fallback to direct path resolution
      config.resolve.alias = {
        ...config.resolve.alias,
        'react-refractor$': path.join(__dirname, 'lib', 'react-refractor-wrapper.js'),
        'refractor/lang/bash': path.join(__dirname, 'node_modules', 'refractor', 'lang', 'bash.js'),
        'refractor/lang/javascript': path.join(__dirname, 'node_modules', 'refractor', 'lang', 'javascript.js'),
        'refractor/lang/json': path.join(__dirname, 'node_modules', 'refractor', 'lang', 'json.js'),
        'refractor/lang/jsx': path.join(__dirname, 'node_modules', 'refractor', 'lang', 'jsx.js'),
        'refractor/lang/typescript': path.join(__dirname, 'node_modules', 'refractor', 'lang', 'typescript.js'),
      };
    }

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
