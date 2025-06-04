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
