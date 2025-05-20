/**
 * Next.js Configuration - Otimizada para Deploy
 * Configura��o profissional para Next.js 15 com Tailwind CSS v3
 *
 * @version 2.2.0
 * @date 19/05/2025 (Atualizado)
 * @type {import('next').NextConfig}
 */

// Importa��o da configura��o auxiliar para source maps
const { applySourceMapIgnore } = require('./webpack.sourcemap.config');

// Verificar se estamos em ambiente de produ��o/Vercel
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Configura��o de imagem otimizada
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
  },

  // Configura��es experimentais compat�veis com Next.js 15
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
    // ppr: true, // Removido pois requer vers�o canary do Next.js
    taint: true,
    optimizeFonts: true, // Ativa otimiza��o autom�tica de fontes
  },    // Configura��o do webpack otimizada
  webpack: (config, { dev, isServer }) => {
    // Aplica configura��o de source map da configura��o auxiliar
    config = applySourceMapIgnore(config);

    // Resolve o problema do EventSource para o Sanity
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        eventsource: false,
        module: false,
        perf_hooks: false,
        v8: false,
      };

      // Configura��o para evitar ChunkLoadError
      config.output.chunkLoadTimeout = 60000; // Aumenta o timeout de carregamento de chunks para 60s
      config.output.crossOriginLoading = 'anonymous'; // Garante carregamento correto cross-origin
    }

    // Otimiza��es para produ��o
    if (!dev) {
      // Medida de seguran�a para ambiente de produ��o: evita problemas com source maps
      if (isProduction || isVercel) {
        // Ignora completamente os source maps em produ��o
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
            // Agrupamento de depend�ncias comuns
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

  // Transpila��o para m�dulos espec�ficos
  transpilePackages: ['@sanity', 'next-sanity', 'embla-carousel-react'],

  // Vari�veis de ambiente como strings (formato exigido pela Vercel)
  env: {
    NEXT_PUBLIC_SANITY_USE_CDN: "true",
    NEXT_PUBLIC_SANITY_USE_STEGA: "false",
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Link',
            value: '</Montserrat-Bold.ttf>; rel=preload; as=font; type=font/ttf; crossorigin=anonymous, </Montserrat-Medium.ttf>; rel=preload; as=font; type=font/ttf; crossorigin=anonymous',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
