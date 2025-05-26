#!/usr/bin/env node

/**
 * Análise Profissional e Completa de Dependências
 * Esta abordagem analisa TODAS as dependências necessárias SEM fazer builds repetidos
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 ANÁLISE PROFISSIONAL DE DEPENDÊNCIAS - SEM TRIAL AND ERROR\n');

// 1. Analisar o package.json do Sanity para ver TODAS as suas dependências
function analyzeSanityDependencies() {
  console.log('📦 Analisando dependências completas do Sanity...');
  
  const sanityPath = path.join(process.cwd(), 'node_modules', 'sanity', 'package.json');
  const nextSanityPath = path.join(process.cwd(), 'node_modules', 'next-sanity', 'package.json');
  
  const allRequiredDeps = new Set();
  
  // Analisar Sanity
  if (fs.existsSync(sanityPath)) {
    const sanityPkg = JSON.parse(fs.readFileSync(sanityPath, 'utf8'));
    
    // Adicionar dependencies
    if (sanityPkg.dependencies) {
      Object.keys(sanityPkg.dependencies).forEach(dep => allRequiredDeps.add(dep));
    }
    
    // Adicionar peerDependencies
    if (sanityPkg.peerDependencies) {
      Object.keys(sanityPkg.peerDependencies).forEach(dep => allRequiredDeps.add(dep));
    }
    
    console.log(`  ✓ Sanity: ${Object.keys(sanityPkg.dependencies || {}).length} deps + ${Object.keys(sanityPkg.peerDependencies || {}).length} peers`);
  }
  
  // Analisar Next-Sanity
  if (fs.existsSync(nextSanityPath)) {
    const nextSanityPkg = JSON.parse(fs.readFileSync(nextSanityPath, 'utf8'));
    
    if (nextSanityPkg.dependencies) {
      Object.keys(nextSanityPkg.dependencies).forEach(dep => allRequiredDeps.add(dep));
    }
    
    if (nextSanityPkg.peerDependencies) {
      Object.keys(nextSanityPkg.peerDependencies).forEach(dep => allRequiredDeps.add(dep));
    }
    
    console.log(`  ✓ Next-Sanity: ${Object.keys(nextSanityPkg.dependencies || {}).length} deps + ${Object.keys(nextSanityPkg.peerDependencies || {}).length} peers`);
  }
  
  return allRequiredDeps;
}

// 2. Verificar quais dependências já estão instaladas
function getInstalledDependencies() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  const installed = new Set();
  
  // Dependências do package.json
  if (packageJson.dependencies) {
    Object.keys(packageJson.dependencies).forEach(dep => installed.add(dep));
  }
  
  if (packageJson.devDependencies) {
    Object.keys(packageJson.devDependencies).forEach(dep => installed.add(dep));
  }
  
  // Verificar node_modules fisicamente
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    const nodeModulesList = fs.readdirSync(nodeModulesPath);
    nodeModulesList.forEach(dir => {
      if (dir.startsWith('@')) {
        // Scoped packages
        const scopedPath = path.join(nodeModulesPath, dir);
        if (fs.statSync(scopedPath).isDirectory()) {
          const subDirs = fs.readdirSync(scopedPath);
          subDirs.forEach(subDir => {
            installed.add(`${dir}/${subDir}`);
          });
        }
      } else {
        installed.add(dir);
      }
    });
  }
  
  return installed;
}

// 3. Analisar dependências específicas baseadas nos erros conhecidos
function getKnownMissingDependencies() {
  return new Set([
    // Do último build error
    'observable-callback',
    '@sanity/telemetry',
    'shallow-equals',
    'groq-js',
    
    // Dependências comuns do Sanity que sempre faltam
    '@sanity/uuid',
    '@sanity/util',
    'react-i18next',
    'global',
    
    // CodeMirror (para Vision se reinstalarmos)
    '@codemirror/autocomplete',
    '@codemirror/commands', 
    '@codemirror/lang-javascript',
    '@codemirror/language',
    '@codemirror/search',
    '@lezer/common',
    
    // Utilitários comuns
    'debounce',
    'md5-o-matic', 
    'speakingurl',
    'history',
    'get-random-values',
    'camelcase-css',
    'is-number',
    'doc-path',
    'deeks',
    'postcss-js',
    'ts-interface-checker',
    '@jridgewell/gen-mapping',
    'lines-and-columns',
    'jiti',
    'sucrase',
    'object-hash',
    '@alloc/quick-lru'
  ]);
}

// 4. Executar análise completa
console.log('🚀 EXECUTANDO ANÁLISE COMPLETA...\n');

const sanityDeps = analyzeSanityDependencies();
const installedDeps = getInstalledDependencies();
const knownMissing = getKnownMissingDependencies();

console.log(`\n📊 RESULTADOS:`);
console.log(`  • Dependências do Sanity encontradas: ${sanityDeps.size}`);
console.log(`  • Dependências já instaladas: ${installedDeps.size}`);
console.log(`  • Dependências conhecidas faltantes: ${knownMissing.size}`);

// 5. Calcular o que realmente está faltando
const missingFromSanity = new Set([...sanityDeps].filter(dep => !installedDeps.has(dep)));
const allMissing = new Set([...missingFromSanity, ...knownMissing]);
const finalMissing = new Set([...allMissing].filter(dep => !installedDeps.has(dep)));

console.log(`\n🎯 DEPENDÊNCIAS FALTANTES (${finalMissing.size}):`);
[...finalMissing].sort().forEach(dep => {
  console.log(`  • ${dep}`);
});

// 6. Gerar comando de instalação
const installCommand = `pnpm add ${[...finalMissing].join(' ')}`;

console.log(`\n🚀 COMANDO COMPLETO PARA INSTALAR TUDO:`);
console.log(`\n${installCommand}\n`);

// 7. Salvar relatório
const report = {
  timestamp: new Date().toISOString(),
  analysis: {
    sanityDependencies: [...sanityDeps].sort(),
    installedDependencies: [...installedDeps].sort(),
    knownMissingDependencies: [...knownMissing].sort(),
    finalMissingDependencies: [...finalMissing].sort()
  },
  installCommand,
  summary: {
    totalSanityDeps: sanityDeps.size,
    totalInstalled: installedDeps.size,
    totalMissing: finalMissing.size
  }
};

fs.writeFileSync('comprehensive-dependency-report.json', JSON.stringify(report, null, 2));
console.log('📋 Relatório completo salvo em: comprehensive-dependency-report.json');

console.log('\n✅ ANÁLISE CONCLUÍDA - EXECUTE O COMANDO ACIMA PARA RESOLVER TUDO DE UMA VEZ!');
