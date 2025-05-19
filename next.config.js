/**
 * Next.js Configuration - Otimizada para Deploy
 * Configuração profissional para Next.js 15 com Tailwind CSS v3
 *
 * @version 2.2.0
 * @date 19/05/2025 (Atualizado)
 * @type {import('next').NextConfig}
 */

// Importação da configuração auxiliar para source maps
const { applySourceMapIgnore } = require('./webpack.sourcemap.config');

// Verificar se estamos em ambiente de produção/Vercel
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Configuração de imagem otimizada
  images: {
    domains: ['cdn.sanity.io'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '**',
      },
    ],
  },  // Configurações experimentais compatíveis com Next.js 15
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    optimizePackageImports: ['lucide-react'],
    serverMinification: true,
    webVitalsAttribution: ['CLS', 'LCP', 'FCP'],
    workerThreads: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // ppr: true, // Removido pois requer versão canary do Next.js
    taint: true,
  },  // Configuração do webpack otimizada
  webpack: (config, { dev, isServer }) => {
    // Aplica configuração de source map da configuração auxiliar
    config = applySourceMapIgnore(config);

    // Resolve o problema do EventSource para o Sanity
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        eventsource: false,
      };
    }    // Otimizações para produção
    if (!dev) {
      // Medida de segurança para ambiente de produção: evita problemas com source maps
      if (isProduction || isVercel) {
        // Ignora completamente os source maps em produção
        config.devtool = false;
      }

      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: {
          name: 'runtime',
        },
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Chunk separado para lucide-react (problema performance principal)
            lucide: {
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              name: 'vendor-lucide',
              priority: 40,
              enforce: true,
              chunks: 'all',
            },
            // Chunk separado para sanity
            sanity: {
              test: /[\\/]node_modules[\\/]@sanity|sanity|next-sanity[\\/]/,
              name: 'vendor-sanity',
              priority: 30,
              enforce: true,
              chunks: 'all',
            },
            // Chunk separado para React
            react: {
              test: /[\\/]node_modules[\\/]react|react-dom|scheduler[\\/]/,
              name: 'vendor-react',
              priority: 20,
              enforce: true,
              chunks: 'all',
            },
            // Agrupamento de dependências comuns
            commons: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor-commons',
              chunks: 'all',
              priority: 10,
              minChunks: 2,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    return config;
  },

  // Transpilação para módulos específicos
  transpilePackages: ['@sanity', 'next-sanity', 'embla-carousel-react'],

  // Variáveis de ambiente como strings (formato exigido pela Vercel)
  env: {
    NEXT_PUBLIC_SANITY_USE_CDN: "true",
    NEXT_PUBLIC_SANITY_USE_STEGA: "false",
  },
};

module.exports = nextConfig;