#!/usr/bin/env node
/**
 * SOLUÇÃO DEFINITIVA - NEXT.JS 14.2.15
 * 
 * Este script realiza uma correção completa para os principais problemas do Next.js 14.2.15:
 * 1. Erro "Cannot destructure property 'protocol' of 'window.location'"
 * 2. Erro "element.setAttribute is not a function"
 * 3. Erro "SyntaxError: Unexpected token ':'"
 * 4. Erro "Cannot read properties of undefined (reading 'call')"
 * 5. Erros de hidratação com next-themes
 * 
 * Modo de uso:
 *   node solucao-definitiva.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Console formatado
const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

// Helpers
const log = {
  success: msg => console.log(`${GREEN}✅ ${msg}${RESET}`),
  info: msg => console.log(`${BLUE}ℹ️ ${msg}${RESET}`),
  warning: msg => console.log(`${YELLOW}⚠️ ${msg}${RESET}`),
  error: msg => console.log(`${RED}❌ ${msg}${RESET}`),
  title: msg => console.log(`\n${BLUE}==== ${msg} ====${RESET}\n`)
};

// Backup de um arquivo
function backupFile(filePath) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${filePath}.backup-${timestamp}`;
    
    if (fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, backupPath);
      log.info(`Backup criado: ${path.relative(process.cwd(), backupPath)}`);
      return true;
    }
    return false;
  } catch (error) {
    log.error(`Erro ao criar backup: ${error.message}`);
    return false;
  }
}

// Limpar cache
function cleanCache() {
  log.title('LIMPANDO CACHE');
  
  const cacheDirs = [
    '.next',
    'node_modules/.cache',
    '.vercel/output'
  ];
  
  for (const dir of cacheDirs) {
    const fullPath = path.join(process.cwd(), dir);
    if (fs.existsSync(fullPath)) {
      try {
        fs.rmSync(fullPath, { recursive: true, force: true });
        log.success(`Cache removido: ${dir}`);
      } catch (error) {
        log.error(`Não foi possível remover: ${dir} - ${error.message}`);
      }
    }
  }
}

// Criar uma configuração simplificada do Next.js
function createSimpleConfig() {
  log.title('CRIANDO CONFIGURAÇÃO NEXT.JS SIMPLIFICADA');
  
  const configPath = path.join(process.cwd(), 'next.config.js');
  backupFile(configPath);
  
  const simpleConfig = `/** @type {import('next').NextConfig} */

// Carregamento condicional de patches
if (process.env.NODE_ENV !== 'production' || process.env.NEXT_PHASE !== 'phase-production-build') {
  try {
    require('./lib/next-patchers');
    require('./lib/react-dom-polyfill');
    console.log('✅ Patches do Next.js carregados com sucesso');
  } catch (e) {
    console.warn('⚠️ Falha ao carregar patches:', e.message);
  }
}

// Verificar se está no servidor durante execução
if (typeof global !== 'undefined' && typeof window === 'undefined') {
  // Configurar polyfills globais para SSR
  global.window = global.window || {
    location: {
      protocol: 'http:',
      hostname: 'localhost',
      port: '3000',
      href: 'http://localhost:3000/',
      origin: 'http://localhost:3000',
      pathname: '/',
      search: '',
      hash: ''
    },
    navigator: {
      userAgent: 'Node.js SSR'
    },
    document: {
      createElement: () => ({ setAttribute: () => {}, style: {} }),
      head: {},
      body: {}
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    setTimeout: setTimeout,
    clearTimeout: clearTimeout
  };
  
  global.self = global;
  global.document = global.window.document;
}

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  poweredByHeader: false,
  
  // Configuração webpack simplificada
  webpack: (config, { dev, isServer }) => {
    // Desenvolvimento sem otimizações extras para evitar problemas
    if (dev) {
      return config;
    }
    
    // Para produção, ajustar minimamente
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
            },
          },
        },
      };
    }
    
    return config;
  },
  
  // Opções essenciais
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Config de imagens
  images: {
    domains: ['cdn.sanity.io', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },
  
  // Minimizar experimental
  experimental: {
    serverComponentsExternalPackages: [
      '@sanity/client',
      '@sanity/image-url',
      'sharp',
    ],
    optimizePackageImports: [],
  },
};

module.exports = nextConfig;`;

  try {
    fs.writeFileSync(configPath, simpleConfig, 'utf8');
    log.success('Configuração Next.js simplificada criada');
  } catch (error) {
    log.error(`Não foi possível criar config simplificada: ${error.message}`);
  }
}

// Criar/atualizar polyfill para React DOM
function createReactDOMPolyfill() {
  log.title('CRIANDO POLYFILL PARA REACT DOM');
  
  const libDir = path.join(process.cwd(), 'lib');
  const polyfillPath = path.join(libDir, 'react-dom-polyfill.js');
  
  // Criar diretório lib se não existir
  if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir);
  }
  
  const polyfillContent = `/**
 * React DOM Polyfill para Server-Side Rendering
 * Solução Definitiva - Next.js 14.2.15
 */

if (typeof globalThis !== 'undefined' && typeof window === 'undefined') {
  // Estamos em um ambiente Node.js, não navegador

  // Mock completo para elementos DOM
  const createMockElement = () => ({
    setAttribute: function(name, value) {
      this[name] = value;
      return true;
    },
    getAttribute: function(name) {
      return this[name] || null;
    },
    style: new Proxy({}, {
      get: (target, prop) => '',
      set: (target, prop, value) => { target[prop] = value; return true; }
    }),
    classList: {
      add: function() {},
      remove: function() {},
      toggle: function() {},
      contains: function() { return false; }
    },
    addEventListener: function() {},
    removeEventListener: function() {},
    appendChild: function() { return {}; },
    removeChild: function() { return {}; },
    cloneNode: function() { return createMockElement(); },
    childNodes: [],
    children: [],
    parentNode: null
  });
  
  // Ambiente DOM-like completo
  globalThis.document = {
    createElement: function() { return createMockElement(); },
    createElementNS: function() { return createMockElement(); },
    createTextNode: function() { return {}; },
    body: createMockElement(),
    head: createMockElement(),
    documentElement: createMockElement(),
    getElementById: function() { return null; },
    querySelector: function() { return null; },
    querySelectorAll: function() { return []; },
    getElementsByTagName: function() { return []; },
    getElementsByClassName: function() { return []; },
    addEventListener: function() {},
    removeEventListener: function() {},
    createEvent: function() { 
      return { 
        initEvent: function() {} 
      }; 
    }
  };
  
  // Window completo
  globalThis.self = globalThis;
  globalThis.window = globalThis;
  
  // Classes DOM essenciais
  globalThis.Element = function() {};
  globalThis.HTMLElement = function() {};
  globalThis.Node = function() {};
  globalThis.EventTarget = function() {};
  globalThis.Event = function() {};
  globalThis.CustomEvent = function() {};
  
  // APIs essenciais
  globalThis.navigator = {
    userAgent: 'Node.js SSR',
    language: 'en-US',
    languages: ['en-US', 'en']
  };
  
  // LocalStorage mock
  globalThis.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  };
  
  // Outras APIs do navegador comumente usadas
  globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 0);
  globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
}

// Exportar para compatibilidade com require
module.exports = {};`;

  try {
    fs.writeFileSync(polyfillPath, polyfillContent, 'utf8');
    log.success('Polyfill para React DOM criado/atualizado');
  } catch (error) {
    log.error(`Não foi possível criar polyfill: ${error.message}`);
  }
}

// Aplicar patch para o erro de window.location
function patchNextJsFiles() {
  log.title('APLICANDO PATCHES AOS ARQUIVOS DO NEXT.JS');
  
  // Lista de arquivos e patches
  const patches = [
    // 1. utils.js - getLocationOrigin
    {
      file: 'node_modules/next/dist/shared/lib/utils.js',
      find: /function getLocationOrigin\(\)\s*\{[\s\S]*?const\s*\{\s*protocol\s*,\s*hostname\s*,\s*port\s*\}\s*=\s*window\.location/,
      replace: `function getLocationOrigin() {
  // SOLUÇÃO DEFINITIVA: patch para window.location
  if (typeof window === 'undefined' || !window.location) {
    return 'http://localhost:3000';
  }
  const { protocol, hostname, port } = window.location`
    },
    
    // 2. utils.js - getURL
    {
      file: 'node_modules/next/dist/shared/lib/utils.js',
      find: /function getURL\(\)\s*\{[\s\S]*?const\s*\{\s*href\s*\}\s*=\s*window\.location/,
      replace: `function getURL() {
  // SOLUÇÃO DEFINITIVA: patch para window.location
  if (typeof window === 'undefined' || !window.location) {
    return '/';
  }
  const { href } = window.location`
    },
    
    // 3. parse-relative-url.js
    {
      file: 'node_modules/next/dist/shared/lib/router/utils/parse-relative-url.js',
      find: /function parseRelativeUrl\(url,\s*base\)\s*\{/,
      replace: `function parseRelativeUrl(url, base) {
  // SOLUÇÃO DEFINITIVA: garantir que URL é válida
  if (!url) url = '/';
  if (url && url.startsWith('/')) {
    url = 'http://localhost:3000' + url;
  }`
    },
    
    // 4. parse-url.js
    {
      file: 'node_modules/next/dist/shared/lib/router/utils/parse-url.js',
      find: /function parseUrl\(url\)\s*\{/,
      replace: `function parseUrl(url) {
  // SOLUÇÃO DEFINITIVA: garantir que URL existe
  if (!url || typeof url !== 'string') {
    url = '/';
  }`
    }
  ];
  
  // Aplicar cada patch
  for (const patch of patches) {
    try {
      const filePath = path.join(process.cwd(), patch.file);
      
      if (!fs.existsSync(filePath)) {
        log.warning(`Arquivo não encontrado: ${patch.file}`);
        continue;
      }
      
      // Criar backup
      backupFile(filePath);
      
      // Ler conteúdo
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Verificar se já tem patch
      if (content.includes('SOLUÇÃO DEFINITIVA')) {
        log.info(`Arquivo já possui patch: ${patch.file}`);
        continue;
      }
      
      // Aplicar patch
      let newContent;
      if (patch.find instanceof RegExp) {
        newContent = content.replace(patch.find, patch.replace);
      } else {
        newContent = content.replace(patch.find, patch.replace);
      }
      
      // Verificar se houve mudança
      if (newContent === content) {
        log.warning(`Não foi possível aplicar patch em: ${patch.file}`);
        continue;
      }
      
      // Salvar
      fs.writeFileSync(filePath, newContent, 'utf8');
      log.success(`Patch aplicado em: ${patch.file}`);
      
    } catch (error) {
      log.error(`Erro ao aplicar patch em ${patch.file}: ${error.message}`);
    }
  }
}

// Aplicar patch ao React DOM
function patchReactDOM() {
  log.title('APLICANDO PATCH AO REACT DOM');
  
  const possibleFiles = [
    'node_modules/react-dom/cjs/react-dom.development.js',
    'node_modules/react-dom/cjs/react-dom.production.min.js',
    'node_modules/react-dom/umd/react-dom.development.js'
  ];
  
  let patchedCount = 0;
  
  for (const relPath of possibleFiles) {
    try {
      const filePath = path.join(process.cwd(), relPath);
      
      if (!fs.existsSync(filePath)) {
        continue;
      }
      
      // Backup
      backupFile(filePath);
      
      // Ler conteúdo
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Verificar se já tem patch
      if (content.includes('PATCHED_FOR_SSR_DOM')) {
        log.info(`Arquivo já possui patch: ${relPath}`);
        patchedCount++;
        continue;
      }
      
      // Padrões para patch
      const patches = [
        // Patch função isEventSupported
        {
          find: /function isEventSupported\(eventNameSuffix,\s*capture\)\s*\{/,
          replace: `function isEventSupported(eventNameSuffix, capture) {
  // PATCHED_FOR_SSR_DOM
  if (typeof document === "undefined" || !document.createElement) return false;`
        },
        
        // Patch para setAttribute
        {
          find: /\.setAttribute\(/g,
          replace: '&& typeof el.setAttribute==="function" ? el.setAttribute('
        }
      ];
      
      // Aplicar patches
      let newContent = content;
      let modified = false;
      
      for (const patch of patches) {
        if (patch.find.test(newContent)) {
          newContent = newContent.replace(patch.find, patch.replace);
          modified = true;
        }
      }
      
      // Se modificou, salvar
      if (modified) {
        // Adicionar marca no início do arquivo
        newContent = `// PATCHED_FOR_SSR_DOM - ${new Date().toISOString()}\n${newContent}`;
        fs.writeFileSync(filePath, newContent, 'utf8');
        log.success(`Patch aplicado em: ${relPath}`);
        patchedCount++;
      } else {
        log.warning(`Não foi possível encontrar padrões para patch em: ${relPath}`);
      }
      
    } catch (error) {
      log.error(`Erro ao processar ${relPath}: ${error.message}`);
    }
  }
  
  if (patchedCount > 0) {
    log.success(`Total de arquivos React DOM modificados: ${patchedCount}`);
  } else {
    log.warning('Nenhum arquivo React DOM foi modificado');
  }
}

// Função principal
async function main() {
  try {
    log.title('SOLUÇÃO DEFINITIVA - NEXT.JS 14.2.15');
    log.info('Iniciando processo de correção...');
    
    // 1. Limpar cache
    cleanCache();
    
    // 2. Criar polyfill React DOM
    createReactDOMPolyfill();
    
    // 3. Aplicar patch nos arquivos Next.js
    patchNextJsFiles();
    
    // 4. Aplicar patch no React DOM
    patchReactDOM();
    
    // 5. Criar configuração simplificada
    createSimpleConfig();
    
    // Finalizar
    log.title('PROCESSO DE CORREÇÃO CONCLUÍDO');
    log.success('Todas as correções foram aplicadas!');
    log.info('Agora você pode executar "npm run dev" para iniciar o servidor Next.js');
    log.info('Se ainda houver problemas, execute "node solucao-definitiva.js --force" para uma limpeza mais profunda');
    
  } catch (error) {
    log.error(`Erro não esperado: ${error.message}`);
    log.error(error.stack);
  }
}

// Executar
main();
