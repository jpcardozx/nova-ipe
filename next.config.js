
// TAILWIND DIRECT PATCH - VERSÃO VERCEL SEGURA
const fs = require('fs');
const path = require('path');
const originalResolveFilename = require('module')._resolveFilename;

// Patches dinâmicos para vários contextos (local e Vercel)
const resolvedModules = {};

// Implementações de fallback para módulos críticos
const fallbackModules = {
  'autoprefixer': {
    postcssPlugin: 'autoprefixer',
    Once(root) { return root; },
    info() { return { browsers: [] }; }
  },
  'tailwindcss': {
    postcssPlugin: 'tailwindcss',
    Once(root) { return root; }
  }
};

// Substituir o mecanismo de resolução de módulo do Node.js
require('module')._resolveFilename = function (request, parent, isMain, options) {
  const criticalModules = ['tailwindcss', 'postcss', 'autoprefixer'];

  // Verificar se é um módulo crítico
  const moduleBase = request.split('/')[0];

  if (criticalModules.includes(moduleBase)) {
    // Tentar usar caminho em cache primeiro
    if (resolvedModules[request]) {
      return resolvedModules[request];
    }

    // Tentar resolver normalmente primeiro
    try {
      const resolved = originalResolveFilename(request, parent, isMain, options);
      resolvedModules[request] = resolved;
      return resolved;
    } catch (e) {
      console.warn(`⚠️ Não foi possível resolver ${request} normalmente, tentando abordagens alternativas`);

      // Tentar caminhos relativos ao projeto
      try {
        let nodeModulesPath = path.join(process.cwd(), 'node_modules');
        let relativePath = request;

        // Para subpaths como tailwindcss/plugin
        const parts = request.split('/');
        if (parts.length > 1) {
          const [base, ...rest] = parts;
          relativePath = path.join(base, ...rest);
        }

        const absolutePath = path.join(nodeModulesPath, relativePath);
        if (fs.existsSync(absolutePath)) {
          resolvedModules[request] = absolutePath;
          return absolutePath;
        }

        // Verificar no pacote Next.js
        const nextPath = path.join(process.cwd(), 'node_modules', 'next', 'node_modules', relativePath);
        if (fs.existsSync(nextPath)) {
          resolvedModules[request] = nextPath;
          return nextPath;
        }

        // Para autoprefixer específicamente, injetar módulo inline
        if (moduleBase === 'autoprefixer') {
          console.warn('⚠️ Usando implementação interna de autoprefixer');
          resolvedModules[request] = require.resolve('./scripts/module-fallbacks/autoprefixer-fallback.js');
          return resolvedModules[request];
        }
      } catch (innerErr) {
        console.error(`Erro ao tentar resolver ${request} de forma alternativa:`, innerErr);
      }

      // Se chegou aqui, continuar com o erro original
      throw e;
    }
  }

  return originalResolveFilename(request, parent, isMain, options);
};
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
  },  // Configuração dos módulos de resolução de caminho
  webpack: (config, { isServer }) => {
    // Inicialização das estruturas de configuração
    if (!config.resolve) config.resolve = {};
    if (!config.resolve.alias) config.resolve.alias = {};
    if (!config.resolveLoader) config.resolveLoader = {};
    if (!config.resolveLoader.modules) config.resolveLoader.modules = ['node_modules'];

    // Adicionar diretório local para resolução de loaders
    config.resolveLoader.modules.push(path.resolve('./node_modules'));

    // Configuração de aliases para resolução de módulos
    config.resolve.alias['tailwindcss'] = './node_modules/tailwindcss';
    config.resolve.alias['postcss'] = './node_modules/postcss';
    config.resolve.alias['autoprefixer'] = './node_modules/autoprefixer';
    config.resolve.alias['app/sections'] = './app/sections';
    config.resolve.alias['@sections'] = './sections';
    config.resolve.alias['@app'] = './app';
    config.resolve.alias['@core'] = './lib/core';

    // Aliases específicos para resolver problemas com o Tailwind CSS
    config.resolve.alias['tailwindcss/preflight'] = path.join(__dirname, 'node_modules/tailwindcss/preflight.css');
    config.resolve.alias['tailwindcss/theme.css'] = path.join(__dirname, 'node_modules/tailwindcss/theme.css');

    // Configuração para módulos CSS
    if (config.module && config.module.rules) {
      const cssRule = config.module.rules.find(rule =>
        rule.test && rule.test.toString().includes('.css')
      );

      if (cssRule && cssRule.use) {
        cssRule.use.forEach(loader => {
          if (typeof loader === 'object' && loader.loader === 'css-loader') {
            // Forçar resolução de tailwindcss no diretório do projeto
            loader.options = loader.options || {};
            loader.options.modules = loader.options.modules || {};
            loader.options.modules.getLocalIdent = undefined;

            // Configurar importLoaders
            if (!loader.options.importLoaders) loader.options.importLoaders = 1;
          }
        });

        // Adicionar postcss-loader explicitamente
        if (!cssRule.use.some(l =>
          (typeof l === 'object' && l.loader === 'postcss-loader') ||
          (typeof l === 'string' && l === 'postcss-loader')
        )) {
          cssRule.use.push({
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('tailwindcss'),
                  require('autoprefixer')
                ]
              }
            }
          });
        }
      }
    }

    // CSS LOADER PATCH para regras adicionais
    if (Array.isArray(config.module.rules)) {
      // Verificar todas as regras CSS no array
      config.module.rules.forEach(rule => {
        if (rule.test && rule.test.toString().includes('.css') && rule.use) {
          const useArray = Array.isArray(rule.use) ? rule.use : [rule.use];

          useArray.forEach(loader => {
            if (typeof loader === 'object' && loader.loader === 'css-loader') {
              if (!loader.options) loader.options = {};
              if (!loader.options.importLoaders) loader.options.importLoaders = 1;
            }
          });
        }
      });
    }

    // Configuração adicional para resolver imports absolutos
    config.resolve.fallback = { fs: false, path: false };

    // Adiciona suporte para path aliases relativos (para resolução de módulos em build)
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, './'),
      '@app': path.join(__dirname, './app'),
      '@components': path.join(__dirname, './app/components'),
      '@lib': path.join(__dirname, './lib'),
      '@src': path.join(__dirname, './src'),
      '@public': path.join(__dirname, './public'),
      // Aliases específicos para resolver problemas com o tailwindcss
      'tailwindcss/preflight': path.join(__dirname, 'node_modules/tailwindcss/preflight.css'),
      'tailwindcss/theme.css': path.join(__dirname, 'node_modules/tailwindcss/theme.css'),
    };

    // Interceptar imports CSS que causam problemas no Vercel
    const cssRules = config.module.rules.filter(rule => rule.test && rule.test.toString().includes('.css'));
    cssRules.forEach(cssRule => {
      if (cssRule.oneOf) {
        cssRule.oneOf.forEach(rule => {
          if (!rule.issuerLayer || rule.issuerLayer === 'app') {
            if (!rule.resolve) rule.resolve = {};
            if (!rule.resolve.alias) rule.resolve.alias = {};

            // Garantir que todos os imports problemáticos do tailwindcss sejam resolvidos
            rule.resolve.alias['tailwindcss/preflight'] = path.join(__dirname, 'node_modules/tailwindcss/preflight.css');
            rule.resolve.alias['tailwindcss/theme.css'] = path.join(__dirname, 'node_modules/tailwindcss/theme.css');
          }
        });
      }
    });

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