// next.config.js
const { withSentryConfig } = require('@sentry/nextjs');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {  // Performance optimizations
  poweredByHeader: false, // Remove X-Powered-By header
  compress: true,         // Enable gzip compression
  reactStrictMode: true,
  // Note: swcMinify is now enabled by default in Next.js 13+

  // Additional performance optimizations
  experimental: {
    largePageDataBytes: 512 * 1000, // 512kb
    // Enable optimizations for improved hydration
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'lucide-react', '@headlessui/react'],
    scrollRestoration: true,
  },

  // Otimização de imagens
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
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    // Otimização de carregamento de imagens
    formats: ['image/webp'],
    domains: [
      'images.unsplash.com',
      'market-assets.fra1.cdn.digitaloceanspaces.com',
      'cdn.sanity.io'
    ],
  },

  // Configuração de rotas
  async rewrites() {
    return [
      {
        source: '/studio/:path*',
        destination: '/studio/index.html',
      },
    ];
  },
  // Performance optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  // Otimizações de compilação
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },  // Otimização para arquivos estáticos
  compress: true,

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Otimização para Three.js e WebGL
  webpack: (config) => {
    // Regra para arquivos .glb, .gltf
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource',
    });

    return config;
  },
  // Aumentar o limite de tamanho para assets estáticos
  experimental: {
    largePageDataBytes: 512 * 1000, // 512kb
    // Enable optimizations for improved hydration
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'lucide-react', '@headlessui/react'],
  },
};

// Configurações do Sentry - apenas em produção para evitar overhead em desenvolvimento
const sentryWebpackPluginOptions = {
  silent: true,
  dryRun: process.env.NODE_ENV !== 'production',
};

// Aplicar configurações com bundle analyzer
const moduleExports = withBundleAnalyzer(nextConfig);

// Verifique se estamos em ambiente de produção antes de aplicar o Sentry
const isSentryEnabled = process.env.NODE_ENV === 'production';

// Exporte a configuração final
module.exports = isSentryEnabled
  ? withSentryConfig(moduleExports, sentryWebpackPluginOptions)
  : moduleExports;