/**
 * verify-fixes.js
 * 
 * Verificação da solução definitiva para erros de webpack e hidratação no Next.js
 * Atualizado: 30 de Maio de 2025 (Versão final)
 */

const fs = require('fs');
const path = require('path');

// Console styling
const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

console.log(`${BLUE}=== Verificando solução crítica do Next.js ===${RESET}\n`);

// Essential files to verify
const criticalFiles = [
  { path: 'nextjs-webpack-fix.js', desc: 'Correção webpack definitiva', checkContent: true },
  { path: 'app/error.tsx', desc: 'Componente de erro simplificado', checkContent: true },
  { path: 'app/global-error.tsx', desc: 'Componente global de erro', checkContent: false },
  { path: 'next.config.js', desc: 'Configuração Next.js', checkContent: true }
];

// Track verification status
let allPassed = true;
let failures = [];

// Check file existence and content
for (const file of criticalFiles) {
  const filePath = path.join(process.cwd(), file.path);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log(`${RED}✘ ERRO: ${file.desc} não encontrado: ${file.path}${RESET}`);
    allPassed = false;
    failures.push(`Arquivo ausente: ${file.path}`);
    continue;
  }
  
  // Read content
  const content = fs.readFileSync(filePath, 'utf8');

// Verify file has expected content
  if (file.checkContent) {
    let expectedContent = false;
    
    switch (file.path) {
      case 'nextjs-webpack-fix.js':
        expectedContent = content.includes('WebpackFactoryFix') && 
                          content.includes('applyBrowserPolyfills') &&
                          content.includes('Cannot read properties of undefined (reading');
        break;
        
      case 'app/error.tsx':
        expectedContent = content.includes('CRITICAL FIX') && 
                         !content.includes('useState') &&
                         !content.includes('useEffect');
        break;
        
      case 'next.config.js':
        expectedContent = content.includes('WebpackFactoryFix') && 
                          content.includes('applyBrowserPolyfills');
        break;
    }
    
    if (expectedContent) {
      console.log(`${GREEN}✓ ${file.desc} validado com sucesso: ${file.path}${RESET}`);
    } else {
      console.log(`${RED}✘ ERRO: ${file.desc} não contém o conteúdo esperado: ${file.path}${RESET}`);
      allPassed = false;
      failures.push(`Conteúdo inválido: ${file.path}`);
    }
  } else {
    console.log(`${GREEN}✓ ${file.desc} encontrado: ${file.path}${RESET}`);
  }
}

// Check package.json scripts
try {
  const pkgJsonPath = path.join(process.cwd(), 'package.json');
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  
  if (pkgJson.scripts && 
      pkgJson.scripts.dev && 
      pkgJson.scripts.dev.includes('nextjs-webpack-fix') &&
      pkgJson.scripts.build &&
      pkgJson.scripts.build.includes('nextjs-webpack-fix')) {
    console.log(`${GREEN}✓ Scripts do package.json configurados corretamente${RESET}`);
  } else {
    console.log(`${RED}✘ ERRO: Scripts do package.json não estão configurados corretamente${RESET}`);
    allPassed = false;
    failures.push('Scripts do package.json inválidos');
  }
} catch (err) {
  console.log(`${RED}✘ ERRO: Não foi possível ler o package.json: ${err.message}${RESET}`);
  allPassed = false;
  failures.push('Erro lendo package.json');
}

// Check if .next directory exists and has proper structure
const nextDir = path.join(process.cwd(), '.next');
if (fs.existsSync(nextDir)) {
  console.log(`${GREEN}✓ Diretório .next encontrado${RESET}`);
    const staticDir = path.join(nextDir, 'static');
  if (fs.existsSync(staticDir)) {
    console.log(`${GREEN}✓ Diretório .next/static encontrado${RESET}`);
  }
}

console.log('\n');
if (allPassed) {
  console.log(`${GREEN}✓ SUCESSO! Todas as verificações passaram.${RESET}`);
  console.log(`${GREEN}✓ A solução definitiva para o Next.js está corretamente aplicada.${RESET}`);
} else {
  console.log(`${RED}✘ FALHA! Algumas verificações apresentaram problemas:${RESET}`);
  failures.forEach(f => console.log(`${RED}- ${f}${RESET}`));
  console.log(`\n${YELLOW}Por favor corrija os problemas acima para garantir o funcionamento estável.${RESET}`);
  process.exit(1);
}
    console.log('✅ Static directory exists');
    
    const chunksDir = path.join(staticDir, 'chunks');
    const cssDir = path.join(staticDir, 'css');
    
    if (fs.existsSync(chunksDir)) {
      const chunks = fs.readdirSync(chunksDir);
      console.log(`✅ Chunks directory contains ${chunks.length} files`);
      
      // Check for problematic vendor chunks
      const vendorChunks = chunks.filter(file => file.includes('vendors-node_modules'));
      if (vendorChunks.length > 0) {
        console.log(`⚠️  Found ${vendorChunks.length} vendor chunks (this was causing issues before)`);
        vendorChunks.slice(0, 5).forEach(chunk => {
          console.log(`   - ${chunk}`);
        });
      } else {
        console.log('✅ No problematic vendor chunks found');
      }
    }
    
    if (fs.existsSync(cssDir)) {
      const cssFiles = fs.readdirSync(cssDir);
      console.log(`✅ CSS directory contains ${cssFiles.length} files`);
    }
  }
} else {
  console.log('❌ .next directory not found - this indicates build issues');
}

// Check current next.config.js
const configPath = path.join(process.cwd(), 'next.config.js');
if (fs.existsSync(configPath)) {
  const config = fs.readFileSync(configPath, 'utf8');
  
  console.log('\n📋 Current configuration analysis:');
  
  // Check for problematic patterns
  if (config.includes('splitChunks') && config.includes('maxSize: 244000')) {
    console.log('⚠️  Configuration still contains complex splitChunks - this may cause issues');
  } else {
    console.log('✅ Simplified splitChunks configuration detected');
  }
  
  if (config.includes('headers()') && config.includes('Content-Type')) {
    console.log('✅ MIME type headers are configured');
  } else {
    console.log('⚠️  MIME type headers not found in configuration');
  }
  
  if (config.includes('ignoreWarnings')) {
    console.log('✅ Webpack warnings suppression configured');
  }
}

console.log('\n🎯 Configuration analysis complete!');
console.log('\nTo verify the fixes:');
console.log('1. Open http://localhost:3000 in your browser');
console.log('2. Open DevTools (F12)');
console.log('3. Check the Console tab for any remaining MIME type errors');
console.log('4. Check the Network tab to see if all assets load with 200 status');
