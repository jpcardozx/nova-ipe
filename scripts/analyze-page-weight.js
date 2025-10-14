#!/usr/bin/env node

/**
 * Analisa o peso de imports e dependências por página
 */

const fs = require('fs');
const path = require('path');

const PAGES = {
  login: 'app/login/page.tsx',
  home: 'app/page.tsx',
  catalogo: 'app/catalogo/page.tsx',
  dashboard: 'app/dashboard/page.tsx',
  signup: 'app/signup/page.tsx',
};

// Bibliotecas pesadas conhecidas
const HEAVY_LIBS = {
  'framer-motion': { size: '~150KB', gzip: '~45KB', description: 'Animações' },
  '@tanstack/react-query': { size: '~45KB', gzip: '~13KB', description: 'Data fetching' },
  'react-hook-form': { size: '~40KB', gzip: '~12KB', description: 'Formulários' },
  'zod': { size: '~60KB', gzip: '~15KB', description: 'Validação de schema' },
  '@radix-ui': { size: '~200KB+', gzip: '~60KB+', description: 'Componentes UI' },
  'lucide-react': { size: '~600KB', gzip: '~90KB', description: 'Ícones (importação completa)' },
  'date-fns': { size: '~70KB', gzip: '~20KB', description: 'Manipulação de datas' },
  'recharts': { size: '~400KB', gzip: '~120KB', description: 'Gráficos' },
  'react-big-calendar': { size: '~250KB', gzip: '~75KB', description: 'Calendário' },
  'sanity': { size: '~300KB+', gzip: '~90KB+', description: 'CMS Client' },
};

function analyzeFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    return { error: 'Arquivo não encontrado', imports: [], heavyLibs: [] };
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  
  const imports = [];
  const heavyLibs = [];
  let isClientComponent = false;
  
  for (const line of lines) {
    // Detecta 'use client'
    if (line.trim() === "'use client'" || line.trim() === '"use client"') {
      isClientComponent = true;
    }
    
    // Analisa imports
    const importMatch = line.match(/import\s+.*?\s+from\s+['"](.+?)['"]/);
    if (importMatch) {
      const importPath = importMatch[1];
      imports.push(importPath);
      
      // Verifica se é uma lib pesada
      for (const [lib, info] of Object.entries(HEAVY_LIBS)) {
        if (importPath.includes(lib)) {
          heavyLibs.push({ lib, ...info, importPath });
        }
      }
    }
  }
  
  return {
    isClientComponent,
    totalImports: imports.length,
    imports,
    heavyLibs,
    fileSize: content.length,
    lines: lines.length,
  };
}

function formatBytes(bytes) {
  return (bytes / 1024).toFixed(2) + ' KB';
}

console.log('📊 ANÁLISE DE PESO DAS PÁGINAS\n');
console.log('═══════════════════════════════════════════════════════════\n');

const results = {};

for (const [pageName, pagePath] of Object.entries(PAGES)) {
  console.log(`\n🔍 Analisando: ${pageName.toUpperCase()} (${pagePath})`);
  console.log('───────────────────────────────────────────────────────────');
  
  const analysis = analyzeFile(pagePath);
  results[pageName] = analysis;
  
  if (analysis.error) {
    console.log(`❌ ${analysis.error}`);
    continue;
  }
  
  console.log(`📦 Tipo: ${analysis.isClientComponent ? 'Client Component' : 'Server Component'}`);
  console.log(`📄 Tamanho do arquivo: ${formatBytes(analysis.fileSize)}`);
  console.log(`📝 Linhas: ${analysis.lines}`);
  console.log(`📥 Total de imports: ${analysis.totalImports}`);
  
  if (analysis.heavyLibs.length > 0) {
    console.log(`\n⚠️  Bibliotecas pesadas detectadas (${analysis.heavyLibs.length}):`);
    analysis.heavyLibs.forEach((lib, index) => {
      console.log(`   ${index + 1}. ${lib.lib}`);
      console.log(`      📦 Tamanho: ${lib.size} (gzip: ${lib.gzip})`);
      console.log(`      📝 Uso: ${lib.description}`);
      console.log(`      📍 Import: ${lib.importPath}`);
    });
    
    // Calcula peso estimado total
    const estimatedTotal = analysis.heavyLibs.reduce((sum, lib) => {
      const sizeMatch = lib.size.match(/~?(\d+)/);
      return sum + (sizeMatch ? parseInt(sizeMatch[1]) : 0);
    }, 0);
    
    console.log(`\n   💾 Peso estimado total das libs: ~${estimatedTotal}KB`);
  } else {
    console.log('✅ Nenhuma biblioteca pesada detectada');
  }
}

// Resumo geral
console.log('\n\n═══════════════════════════════════════════════════════════');
console.log('📊 RESUMO GERAL');
console.log('═══════════════════════════════════════════════════════════\n');

const pagesByWeight = Object.entries(results)
  .filter(([_, data]) => !data.error)
  .sort((a, b) => b[1].heavyLibs.length - a[1].heavyLibs.length);

console.log('🏆 Páginas ordenadas por número de libs pesadas:\n');
pagesByWeight.forEach(([page, data], index) => {
  const status = data.heavyLibs.length === 0 ? '✅' : 
                 data.heavyLibs.length <= 2 ? '⚠️ ' : '🔴';
  console.log(`   ${index + 1}. ${status} ${page.padEnd(12)} - ${data.heavyLibs.length} libs pesadas - ${data.isClientComponent ? 'Client' : 'Server'}`);
});

// Recomendações
console.log('\n\n💡 RECOMENDAÇÕES:');
console.log('───────────────────────────────────────────────────────────\n');

const recommendations = [];

// Verifica Framer Motion
const pagesWithFramer = pagesByWeight.filter(([_, data]) => 
  data.heavyLibs.some(lib => lib.lib === 'framer-motion')
);
if (pagesWithFramer.length > 0) {
  recommendations.push({
    priority: 'ALTA',
    lib: 'Framer Motion',
    impact: '150KB',
    solution: 'Considere usar CSS animations ou lazy load'
  });
}

// Verifica Lucide Icons
const pagesWithLucide = pagesByWeight.filter(([_, data]) => 
  data.imports.some(imp => imp === 'lucide-react' && !imp.includes('lucide-react/'))
);
if (pagesWithLucide.length > 0) {
  recommendations.push({
    priority: 'CRÍTICA',
    lib: 'Lucide Icons',
    impact: '600KB → 5KB',
    solution: 'Usar imports específicos: lucide-react/dist/esm/icons/[icon-name]'
  });
}

// Verifica Client Components desnecessários
const heavyClientPages = pagesByWeight.filter(([_, data]) => 
  data.isClientComponent && data.heavyLibs.length >= 3
);
if (heavyClientPages.length > 0) {
  recommendations.push({
    priority: 'ALTA',
    lib: 'Client Components',
    impact: 'Varia',
    solution: 'Converter para Server Components quando possível'
  });
}

recommendations.forEach((rec, index) => {
  console.log(`${index + 1}. [${rec.priority}] ${rec.lib}`);
  console.log(`   📉 Impacto: ${rec.impact}`);
  console.log(`   💡 Solução: ${rec.solution}\n`);
});

console.log('\n📝 Para análise detalhada do bundle, execute:');
console.log('   pnpm build:analyze\n');
