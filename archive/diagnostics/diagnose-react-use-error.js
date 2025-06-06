/**
 * Diagnóstico de Erro React.use() - Nova Ipê
 * 
 * Este script identifica onde está o problema com React.use() function
 */

const fs = require('fs');
const path = require('path');

function scanForReactUseErrors(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory() && 
        !entry.name.startsWith('.') && 
        entry.name !== 'node_modules' && 
        entry.name !== 'archive') {
      scanForReactUseErrors(fullPath, results);
    } 
    else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Procurar por uso incorreto de React.use()
        const problematicPatterns = [
          /React\.use\s*\(/g,
          /import\s*\{[^}]*use[^}]*\}\s*from\s*['"]react['"]/g,
          /use\s*\([^)]*\)/g
        ];
        
        for (const pattern of problematicPatterns) {
          const matches = content.match(pattern);
          if (matches) {
            results.push({
              file: fullPath.replace(process.cwd(), ''),
              matches: matches,
              lineNumbers: getLineNumbers(content, pattern)
            });
          }
        }
        
        // Verificar se há imports suspeitos
        if (content.includes('import') && content.includes('use') && content.includes('react')) {
          const lines = content.split('\n');
          lines.forEach((line, index) => {
            if (line.includes('import') && line.includes('use') && line.includes('react')) {
              results.push({
                file: fullPath.replace(process.cwd(), ''),
                suspiciousImport: line.trim(),
                lineNumber: index + 1
              });
            }
          });
        }
        
      } catch (error) {
        // Ignorar erros de leitura
      }
    }
  }
  
  return results;
}

function getLineNumbers(content, pattern) {
  const lines = content.split('\n');
  const lineNumbers = [];
  
  lines.forEach((line, index) => {
    if (pattern.test(line)) {
      lineNumbers.push(index + 1);
    }
  });
  
  return lineNumbers;
}

console.log('🔍 Iniciando diagnóstico de erros React.use()...\n');

const projectRoot = process.cwd();
const results = scanForReactUseErrors(projectRoot);

console.log('📊 Resultado do Diagnóstico:\n');

if (results.length === 0) {
  console.log('✅ Nenhum uso direto de React.use() encontrado nos arquivos do projeto.');
  console.log('\nO erro pode estar relacionado a:');
  console.log('1. Código gerado internamente pelo Next.js');
  console.log('2. Dependências externas');
  console.log('3. Configuração do webpack/babel');
} else {
  console.log('⚠️  Possíveis problemas encontrados:\n');
  
  results.forEach((result, index) => {
    console.log(`${index + 1}. Arquivo: ${result.file}`);
    if (result.matches) {
      console.log(`   Padrões encontrados: ${result.matches.join(', ')}`);
      console.log(`   Linhas: ${result.lineNumbers.join(', ')}`);
    }
    if (result.suspiciousImport) {
      console.log(`   Import suspeito (linha ${result.lineNumber}): ${result.suspiciousImport}`);
    }
    console.log('');
  });
}

// Verificar versões do React
console.log('📦 Verificando versões do React...\n');

try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
  
  console.log(`React: ${packageJson.dependencies?.react || 'não encontrado'}`);
  console.log(`React-DOM: ${packageJson.dependencies?.['react-dom'] || 'não encontrado'}`);
  console.log(`Next.js: ${packageJson.dependencies?.next || 'não encontrado'}`);
  
  // Verificar se as versões são compatíveis com React.use()
  const reactVersion = packageJson.dependencies?.react;
  if (reactVersion) {
    const majorVersion = parseInt(reactVersion.replace(/[^\d]/g, ''));
    if (majorVersion >= 18) {
      console.log('✅ Versão do React compatível com React.use()');
    } else {
      console.log('❌ Versão do React incompatível com React.use()');
    }
  }
  
} catch (error) {
  console.log('❌ Erro ao ler package.json:', error.message);
}

// Sugestões de correção
console.log('\n🔧 Sugestões de Correção:\n');

console.log('1. Verificar se há componentes usando React.use() incorretamente');
console.log('2. Garantir que todos os imports do React estão corretos');
console.log('3. Verificar se há conflitos de versão entre React e Next.js');
console.log('4. Limpar cache do Next.js: rm -rf .next');
console.log('5. Reinstalar dependências: npm install');

console.log('\n💡 Solução Temporária:');
console.log('A página foi substituída por uma versão simplificada em app/page-simple-fix.tsx');
console.log('Isso deve resolver o erro imediato de hidratação.');

console.log('\n📝 Para restaurar a página original:');
console.log('Copy-Item "app\\page.backup-react-use-error.tsx" "app\\page.tsx" -Force');
