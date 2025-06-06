/**
 * LIMPEZA DE ARQUIVOS DE CORREÇÃO
 * Este script remove arquivos de correção duplicados ou obsoletos,
 * mantendo apenas os arquivos essenciais para a solução.
 */

const fs = require('fs');
const path = require('path');

// Formatação para console
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

console.log(`\n${BLUE}==== LIMPEZA DE ARQUIVOS DE CORREÇÃO ====${RESET}\n`);

// Arquivos a manter (essenciais para a solução)
const essentialFiles = [
  'server-side-polyfills.js',
  'global-polyfills.js',
  'webpack-factory-fix-enhanced.js',
  'minimal-ssr-plugin.js',
  'solucao-definitiva.js',
  'verify-fixes.js',
  'start-clean.ps1',
  'start-dev.ps1'
];

// Arquivos candidatos para remoção
const filePatterns = [
  'webpack-',
  'ssr-',
  'verify-',
  'ultra-simple-'
];

// Encontrar arquivos candidatos
let filesToRemove = [];
let filesToKeep = [];

// Procurar na raiz
fs.readdirSync(process.cwd()).forEach(file => {
  // Verificar se é um arquivo de correção
  const isFixFile = filePatterns.some(pattern => file.includes(pattern));
  
  if (isFixFile) {
    // Verificar se é essencial
    const isEssential = essentialFiles.some(essential => file.includes(essential));
    
    if (isEssential) {
      filesToKeep.push(file);
    } else {
      filesToRemove.push(file);
    }
  }
});

// Procurar na pasta lib
const libPath = path.join(process.cwd(), 'lib');
if (fs.existsSync(libPath)) {
  fs.readdirSync(libPath).forEach(file => {
    // Verificar se é um arquivo de polyfill não essencial
    if (file.includes('-polyfill') && !essentialFiles.includes(file)) {
      filesToRemove.push(path.join('lib', file));
    }
  });
}

// Perguntar ao usuário
console.log(`${YELLOW}Arquivos essenciais a manter:${RESET}`);
filesToKeep.forEach(file => console.log(`  ${GREEN}✅ ${file}${RESET}`));

console.log(`\n${YELLOW}Arquivos candidatos para remoção:${RESET}`);
filesToRemove.forEach(file => console.log(`  ${RED}❌ ${file}${RESET}`));

console.log(`\n${BLUE}Este script não remove automaticamente os arquivos.${RESET}`);
console.log(`${BLUE}Para remover, execute os comandos abaixo manualmente:${RESET}\n`);

// Gerar comandos para remoção
filesToRemove.forEach(file => {
  console.log(`rm "${file}"`);
});

console.log(`\n${YELLOW}Após a limpeza, recomendamos executar:${RESET}`);
console.log(`${GREEN}npm run dev:clean${RESET}\n`);
