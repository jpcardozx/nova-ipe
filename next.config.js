/**
 * Next.js Configuration - Next 14 Compatible Version
 * @version 10.0.0 - Next 14.2.15 Compatible
 * @date 26/05/2025
 * CORRIGIDO: serverExternalPackages movido para experimental
 */

const isProduction = process.env.NODE_ENV === "production";
const isDev = !isProduction;

const createWebpackConfig = require('./webpack.config.master');

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  experimental: {
    // Features compatíveis com Next 14
    scrollRestoration: true,
    optimizeCss: true,
    optimizePackageImports: ['lodash', 'date-fns'],
    
    // CORRIGIDO: serverExternalPackages foi movido para experimental
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

    // ESTRATÉGIA CONSERVADORA: Apenas excluir no cliente em produção
    if (!dev && !isServer) {
      console.log('🎯 Aplicando exclusões conservadoras para build de produção...');
      
      config.resolve = config.resolve || {};
      config.resolve.alias = {
        ...config.resolve.alias,
        
        // Excluir apenas dependências críticas que quebram o build
        '@sentry/nextjs': false,
        '@sentry/react': false,
        '@sentry/browser': false,
        
        // Studio-only packages (não necessários no cliente)
        '@sanity/vision': false, // Apenas para desenvolvimento
        '@sanity/telemetry': false, // Telemetria desnecessária no cliente
        
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