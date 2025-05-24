#!/usr/bin/env node

// create-critical-css.js - Script simples para criar arquivos CSS críticos

const fs = require('fs');
const path = require('path');

console.log('🎨 Criando arquivos CSS críticos...');

const rootDir = process.cwd();
const criticalCssPath = path.join(rootDir, 'app', 'styles', 'critical', 'critical.css');
const criticalDir = path.dirname(criticalCssPath);

// Garantir que o diretório existe
if (!fs.existsSync(criticalDir)) {
  fs.mkdirSync(criticalDir, { recursive: true });
  console.log('✅ Diretório criado: app/styles/critical');
}

// Arquivo critical.css
const criticalCss = `/**
 * critical.css - Estilos críticos para renderização inicial
 * 
 * Contém estilos essenciais para o carregamento inicial da página,
 * otimizações de CLS e configurações de performance.
 * 
 * @version 2.0.0
 * @date 23/05/2025
 */

/* Configurações de carregamento para fontes */
html {
  font-display: optional;
}

/* Espaço reservado para imagens enquanto carregam */
img:not([src]), img[src=""] {
  visibility: hidden;
  min-height: 1px; /* Impede colapso */
}

/* Estilos de layout críticos */
.property-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  background-color: white;
  height: 100%;
}

.image-container {
  position: relative;
  width: 100%;
  padding-bottom: 66.666667%;
  overflow: hidden;
}`;

// Criar ou atualizar o arquivo critical.css
fs.writeFileSync(criticalCssPath, criticalCss);
console.log('✅ Arquivo critical.css criado/atualizado');

// Arquivo cls-optimizations.css
const clsOptimizationsPath = path.join(rootDir, 'app', 'styles', 'cls-optimizations.css');
const clsOptimizationsDir = path.dirname(clsOptimizationsPath);

// Garantir que o diretório existe
if (!fs.existsSync(clsOptimizationsDir)) {
  fs.mkdirSync(clsOptimizationsDir, { recursive: true });
  console.log('✅ Diretório criado: app/styles');
}

const clsOptimizations = `/**
 * cls-optimizations.css - Otimizações para Cumulative Layout Shift
 * 
 * @version 2.0.0
 * @date 23/05/2025
 */

/* Preservação de espaço para imagens */
.aspect-ratio-box {
  position: relative;
  height: 0;
  overflow: hidden;
}

.aspect-ratio-box-16-9 {
  padding-top: 56.25%; /* 16:9 */
}

.aspect-ratio-box-4-3 {
  padding-top: 75%; /* 4:3 */
}

.aspect-ratio-box > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}`;

// Criar ou atualizar o arquivo cls-optimizations.css
fs.writeFileSync(clsOptimizationsPath, clsOptimizations);
console.log('✅ Arquivo cls-optimizations.css criado/atualizado');

// Arquivo tailwind-compat.css
const tailwindCompatPath = path.join(rootDir, 'app', 'styles', 'tailwind-compat.css');
const tailwindCompatCss = `/**
 * tailwind-compat.css - Compatibilidade com Tailwind
 * 
 * @version 2.0.0
 * @date 23/05/2025
 */

/* Variáveis de cores consistentes com a marca */
:root {
  --color-brand-green: #1a6f5c;
  --color-brand-dark: #0D1F2D;
  --color-brand-light: #f8f4e3;
}

/* Classes customizadas compatíveis com Tailwind */
.text-brand-green {
  color: var(--color-brand-green);
}

.bg-brand-green {
  background-color: var(--color-brand-green);
}`;

// Criar ou atualizar o arquivo tailwind-compat.css
fs.writeFileSync(tailwindCompatPath, tailwindCompatCss);
console.log('✅ Arquivo tailwind-compat.css criado/atualizado');

// Arquivo cls-prevention.css
const clsPreventionPath = path.join(rootDir, 'app', 'cls-prevention.css');
const clsPreventionCss = `/**
 * cls-prevention.css - Prevenção de CLS
 * 
 * @version 2.0.0
 * @date 23/05/2025
 */

/* Espaço reservado para imagens enquanto carregam */
img {
  transition: opacity 0.2s;
}

img.loading {
  opacity: 0;
}

/* Prevenir saltos quando a scrollbar aparece/desaparece */
html {
  overflow-y: scroll;
}

/* Espaço mínimo para cards de propriedades */
.property-card {
  min-height: 300px;
}`;

// Criar ou atualizar o arquivo cls-prevention.css
fs.writeFileSync(clsPreventionPath, clsPreventionCss);
console.log('✅ Arquivo cls-prevention.css criado/atualizado');

// Verificar o globals.css para garantir que as importações existam
const globalsCssPath = path.join(rootDir, 'app', 'globals.css');
if (fs.existsSync(globalsCssPath)) {
  let globalsCss = fs.readFileSync(globalsCssPath, 'utf-8');
  
  // Verificar se precisa adicionar as importações
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
    
    // Salvar o arquivo atualizado
    fs.writeFileSync(globalsCssPath, globalsCss);
    console.log('✅ Importações adicionadas ao globals.css');
  } else if (importPattern.test(globalsCss)) {
    console.log('ℹ️ Importações já existem no globals.css');
  }
}

console.log('✨ Todos os arquivos CSS críticos foram criados/atualizados!');
