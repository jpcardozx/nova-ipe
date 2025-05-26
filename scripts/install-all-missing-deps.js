#!/usr/bin/env node

/**
 * Script para instalar TODAS as dependências faltantes do Sanity de uma vez
 * Baseado na análise do package.json do Sanity
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎯 Instalando TODAS as dependências faltantes do Sanity...\n');

// Dependências que sabemos que estão faltando baseado nos erros de build
const missingDeps = [
  // Do último erro de build
  'typeid-js',
  'debug', 
  'rxjs-exhaustmap-with-trailing',
  '@tanstack/react-table',
  'nano-pubsub',
  
  // Outras dependências comuns do Sanity que podem estar faltando
  'observable-callback',
  'shallow-equals',
  'groq-js',
  'react-i18next',
  '@sanity/uuid',
  '@sanity/util',
  '@sanity/telemetry',
  'speakingurl',
  'history',
  'framer-motion',
  'get-random-values-esm',
  'is-hotkey-esm',
  '@rexxars/react-json-inspector',
  'md5-o-matic',
  'debounce',
  'get-random-values',
  
  // Dependências do CodeMirror que podem estar faltando
  '@codemirror/autocomplete',
  '@codemirror/commands', 
  '@codemirror/lang-javascript',
  '@codemirror/language',
  '@codemirror/search',
  '@lezer/common',
  
  // Outras dependências que podem estar faltando
  '@uiw/react-codemirror',
  '@rexxars/react-split-pane',
  'camelcase-css',
  'is-number',
  'postcss-js',
  'doc-path',
  'deeks',
  'json-2-csv',
  
  // TailwindCSS dependencies
  '@alloc/quick-lru',
  'jiti',
  'sucrase',
  'object-hash',
  'ts-interface-checker',
  '@jridgewell/gen-mapping',
  'lines-and-columns'
];

// Verificar quais já estão instaladas
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const installedDeps = { 
  ...packageJson.dependencies, 
  ...packageJson.devDependencies 
};

const toInstall = missingDeps.filter(dep => !installedDeps[dep]);

console.log(`📦 Dependências que serão instaladas (${toInstall.length}):`);
toInstall.forEach(dep => console.log(`  - ${dep}`));

if (toInstall.length === 0) {
  console.log('✅ Todas as dependências já estão instaladas!');
  process.exit(0);
}

console.log(`\n🚀 Instalando ${toInstall.length} dependências...`);

try {
  const installCommand = `pnpm add ${toInstall.join(' ')}`;
  console.log(`Comando: ${installCommand}\n`);
  
  execSync(installCommand, { 
    cwd: process.cwd(), 
    stdio: 'inherit' 
  });
  
  console.log('\n✅ Todas as dependências foram instaladas com sucesso!');
  console.log('🎯 Tente executar o build novamente.');
  
} catch (error) {
  console.error('\n❌ Erro ao instalar dependências:', error.message);
  process.exit(1);
}
