/**
 * Next.js Configuration
 * Configuração otimizada para Next.js 15 com Tailwind CSS v3
 *
 * Este arquivo configura o Next.js para integração profissional com
 * o ecossistema de ferramentas e otimizações de performance.
 *
 * @version 2.1.0
 * @date 18/05/2025
 * @type {import('next').NextConfig}
 */

const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  compress: true,

  // Habilitar instrumentation para métricas de performance
  experimental: {
    optimizeCss: true, // Ativa a otimização de CSS
    optimizePackageImports: ['lucide-react'], // Otimiza importações de pacotes grandes
    serverMinification: true, // Minimiza o código do servidor
    serverSourceMaps: false, // Desabilita source maps no servidor em produção
    webVitalsAttribution: ['CLS', 'LCP', 'FCP'], // Melhora atribuição de Web Vitals
  },

  // Configuração de imagem otimizada para CDN e formatos modernos
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
  // Configuração do webpack otimizada para Tailwind v3 e Sanity
  webpack: (config, { dev, isServer }) => {
    // Resolve o problema do EventSource para o Sanity
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        eventsource: false,
      };
    }

    // Otimizações para melhorar o LCP e First Input Delay
    if (!dev) {
      // Ativa otimizações avançadas em produção
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: {
          name: 'runtime',
        },
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Separa o lucide-react em um chunk próprio para reduzir o tamanho do bundle principal
            lucide: {
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              name: 'vendor-lucide',
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
            },
          },
        },
      };
    }

    // Configuração aprimorada para processamento CSS
    const cssRule = config.module.rules.find(
      (rule) => rule.test && rule.test instanceof RegExp && rule.test.toString().includes('css')
    );

    if (cssRule && Array.isArray(cssRule.use)) {
      // Garantir que o CSS seja processado corretamente com PostCSS
      cssRule.use = cssRule.use.map(loader => {
        if (
          typeof loader === 'object' &&
          loader.loader &&
          loader.loader.includes('css-loader')
        ) {
          return {
            ...loader,
            options: {
              ...loader.options,
              importLoaders: 3,
            },
          };
        }
        return loader;
      });
    }

    // Otimização para pacotes grandes
    config.optimization.moduleIds = 'deterministic';

    // Aprimorar as configurações de produção
    if (!dev) {
      // Minimizar seletivamente em produção
      config.optimization.minimize = true;
    }

    return config;
  },

  // Configurações de transpilação para módulos específicos
  transpilePackages: [
    '@sanity',
    'next-sanity',
    'embla-carousel-react',
    'react-intersection-observer',
  ],

  // Configurações experimentais seguras para compatibilidade
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    legacyBrowsers: false,
    browserSourceMap: !process.env.NODE_ENV.includes('production'),
  },

  env: {
    // Configuração para evitar problemas com refresh no Sanity
    NEXT_PUBLIC_SANITY_USE_CDN: true,
    NEXT_PUBLIC_SANITY_USE_STEGA: false,
  },
};

module.exports = nextConfig;