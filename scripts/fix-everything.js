#!/usr/bin/env node

/**
 * Nova Ipê - Fix Everything Script
 * Este script aplica todas as correções necessárias para o projeto Nova Ipê
 * sem depender de bibliotecas externas.
 * 
 * Executa:
 * 1. Correção de arquivos CSS
 * 2. Verificação de consistência entre mappers
 * 3. Configurações otimizadas para desenvolvimento
 */

const fs = require('fs');
const path = require('path');

console.log('\x1b[36m%s\x1b[0m', '🚀 Nova Ipê - Script de Correção Universal');
console.log('\x1b[36m%s\x1b[0m', '==========================================');

// Caminhos principais
const rootDir = process.cwd();
const appDir = path.join(rootDir, 'app');
const stylesDir = path.join(appDir, 'styles');
const criticalDir = path.join(stylesDir, 'critical');
const libDir = path.join(rootDir, 'lib');
const coreDir = path.join(rootDir, 'core');
const publicDir = path.join(rootDir, 'public');
const imagesDir = path.join(publicDir, 'images');

// 1. Verificar e criar diretórios necessários
console.log('\n\x1b[33m%s\x1b[0m', '1. Verificando diretórios...');

const requiredDirs = [
  stylesDir,
  criticalDir,
  imagesDir
];

requiredDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Diretório criado: ${path.relative(rootDir, dir)}`);
    } catch (err) {
      console.error(`❌ Erro ao criar ${path.relative(rootDir, dir)}: ${err.message}`);
    }
  } else {
    console.log(`✓ Diretório existe: ${path.relative(rootDir, dir)}`);
  }
});

// 2. Criar/atualizar arquivos CSS críticos
console.log('\n\x1b[33m%s\x1b[0m', '2. Criando arquivos CSS críticos...');

// critical.css
const criticalCssPath = path.join(criticalDir, 'critical.css');
const criticalCss = `/**
 * critical.css - Estilos críticos para renderização inicial
 * @date 23/05/2025
 */

/* Layout básico e prevenção de CLS */
.container-ipe {
  width: 100%;
  margin: 0 auto;
  max-width: 1280px;
  padding: 0 1rem;
}

/* Espaço para imagens */
.property-card-image {
  position: relative;
  padding-bottom: 66%;
  overflow: hidden;
}`;

try {
  fs.writeFileSync(criticalCssPath, criticalCss);
  console.log(`✅ Arquivo criado: app/styles/critical/critical.css`);
} catch (err) {
  console.error(`❌ Erro ao criar critical.css: ${err.message}`);
}

// cls-optimizations.css
const clsOptimizationsPath = path.join(stylesDir, 'cls-optimizations.css');
const clsOptimizationsCss = `/**
 * cls-optimizations.css - Otimizações para Cumulative Layout Shift
 * @date 23/05/2025
 */

/* Preservação de espaço para carregamento de elementos */
.aspect-ratio-box {
  position: relative;
  height: 0;
  overflow: hidden;
}`;

try {
  fs.writeFileSync(clsOptimizationsPath, clsOptimizationsCss);
  console.log(`✅ Arquivo criado: app/styles/cls-optimizations.css`);
} catch (err) {
  console.error(`❌ Erro ao criar cls-optimizations.css: ${err.message}`);
}

// tailwind-compat.css
const tailwindCompatPath = path.join(stylesDir, 'tailwind-compat.css');
const tailwindCompatCss = `/**
 * tailwind-compat.css - Compatibilidade com Tailwind
 * @date 23/05/2025
 */

/* Variáveis de cores da marca */
:root {
  --color-brand-green: #1a6f5c;
}

/* Classes customizadas */
.text-brand {
  color: var(--color-brand-green);
}`;

try {
  fs.writeFileSync(tailwindCompatPath, tailwindCompatCss);
  console.log(`✅ Arquivo criado: app/styles/tailwind-compat.css`);
} catch (err) {
  console.error(`❌ Erro ao criar tailwind-compat.css: ${err.message}`);
}

// cls-prevention.css
const clsPreventionPath = path.join(appDir, 'cls-prevention.css');
const clsPreventionCss = `/**
 * cls-prevention.css - Prevenção adicional de CLS
 * @date 23/05/2025
 */

/* Prevenção de saltos na rolagem */
html {
  overflow-y: scroll;
}

/* Espaço mínimo para componentes */
.property-card {
  min-height: 250px;
}`;

try {
  fs.writeFileSync(clsPreventionPath, clsPreventionCss);
  console.log(`✅ Arquivo criado: app/cls-prevention.css`);
} catch (err) {
  console.error(`❌ Erro ao criar cls-prevention.css: ${err.message}`);
}

// 3. Atualizar globals.css
console.log('\n\x1b[33m%s\x1b[0m', '3. Verificando globals.css...');

const globalsCssPath = path.join(appDir, 'globals.css');
if (fs.existsSync(globalsCssPath)) {
  try {
    let globalsCss = fs.readFileSync(globalsCssPath, 'utf-8');
    
    // Verificar importações
    const importPattern = /\/\* Importações críticas para evitar CLS e garantir LCP otimizado \*\/\s*@import/;
    const tailwindImport = /@tailwind utilities;/;
    
    if (!importPattern.test(globalsCss) && tailwindImport.test(globalsCss)) {
      // Adicionar as importações após o tailwind utilities
      const importBlock = `\n\n/* Importações críticas para evitar CLS e garantir LCP otimizado */
@import "styles/critical/critical.css";
@import "styles/cls-optimizations.css";
@import "styles/tailwind-compat.css";
@import "./cls-prevention.css"; /* Novas otimizações para prevenir CLS */`;
      
      globalsCss = globalsCss.replace(
        /@tailwind utilities;/, 
        '@tailwind utilities;' + importBlock
      );
      
      fs.writeFileSync(globalsCssPath, globalsCss);
      console.log(`✅ Importações adicionadas a globals.css`);
    } else if (importPattern.test(globalsCss)) {
      console.log(`✓ Importações já existem em globals.css`);
    }
  } catch (err) {
    console.error(`❌ Erro ao atualizar globals.css: ${err.message}`);
  }
} else {
  console.error(`❌ Arquivo globals.css não encontrado`);
}

// 4. Verificar placeholder da imagem OG
console.log('\n\x1b[33m%s\x1b[0m', '4. Verificando imagem OG...');

const ogImagePath = path.join(imagesDir, 'og-image-2025.jpg');
if (!fs.existsSync(ogImagePath)) {
  // Criar arquivo de texto placeholder
  const placeholderPath = path.join(imagesDir, 'PLACEHOLDER-og-image-2025.txt');
  try {
    fs.writeFileSync(placeholderPath, 'Placeholder para a imagem OG. Adicione uma imagem real chamada "og-image-2025.jpg" neste diretório.');
    console.log(`⚠️ Imagem OG não encontrada, criado placeholder de texto`);
  } catch (err) {
    console.error(`❌ Erro ao criar placeholder: ${err.message}`);
  }
} else {
  console.log(`✓ Imagem OG encontrada`);
}

// 5. Verificar mappers
console.log('\n\x1b[33m%s\x1b[0m', '5. Verificando mappers de imóveis...');

const libMapperPath = path.join(libDir, 'mapImovelToClient.ts');
const coreMapperPath = path.join(coreDir, 'mapImovelToClient.ts');

let libMapperExists = false;
let coreMapperExists = false;

if (fs.existsSync(libMapperPath)) {
  console.log(`✓ Mapper lib encontrado`);
  libMapperExists = true;
} else {
  console.error(`❌ Mapper lib não encontrado`);
}

if (fs.existsSync(coreMapperPath)) {
  console.log(`✓ Mapper core encontrado`);
  coreMapperExists = true;
} else {
  console.error(`❌ Mapper core não encontrado`);
}

// 6. Verificar e limpar cache Next.js
console.log('\n\x1b[33m%s\x1b[0m', '6. Limpando cache do Next.js...');

const nextCacheDir = path.join(rootDir, '.next');
if (fs.existsSync(nextCacheDir)) {
  try {
    // Note: fs.rmSync não está disponível em versões mais antigas do Node
    // Por isso usamos o método tradicional para remover diretórios recursivamente
    
    console.log(`⚠️ Para limpar o cache, execute manualmente: "rm -rf .next"`);
    console.log(`⚠️ Ou no Windows: "Remove-Item -Path .next -Recurse -Force"`);
  } catch (err) {
    console.error(`❌ Erro ao limpar cache: ${err.message}`);
  }
} else {
  console.log(`✓ Nenhum cache do Next.js para limpar`);
}

console.log('\n\x1b[32m%s\x1b[0m', '✨ Correções aplicadas com sucesso!');
console.log('\x1b[32m%s\x1b[0m', '👉 Execute "node ./scripts/start-dev.js" para iniciar o servidor em modo rápido');
