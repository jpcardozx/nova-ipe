/**
 * Ultimate Fix for Next.js - Resolução FINAL para o erro window.location
 * 
 * Este script modifica diretamente o código do Next.js para eliminar o 
 * erro "Cannot destructure property 'protocol' of 'window.location'"
 */

const fs = require('fs');
const path = require('path');

// Formatação para logs
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

// Helper
const log = {
  error: (msg) => console.log(`${RED}❌ ${msg}${RESET}`),
  success: (msg) => console.log(`${GREEN}✅ ${msg}${RESET}`),
  warning: (msg) => console.log(`${YELLOW}⚠️ ${msg}${RESET}`),
  info: (msg) => console.log(`${BLUE}📝 ${msg}${RESET}`),
  title: (msg) => console.log(`\n${BLUE}=== ${msg} ===${RESET}\n`)
};

// Substitui conteúdo em um arquivo
async function fixFile(filePath, pattern, replacement) {
  try {
    // Caminho completo
    const fullPath = path.resolve(process.cwd(), filePath);
    
    // Verificar existência
    if (!fs.existsSync(fullPath)) {
      log.warning(`Arquivo não encontrado: ${filePath}`);
      return false;
    }
    
    // Backup
    const backupFile = `${fullPath}.ultimate-backup`;
    if (!fs.existsSync(backupFile)) {
      fs.copyFileSync(fullPath, backupFile);
      log.info(`Backup criado: ${path.basename(backupFile)}`);
    }
    
    // Ler conteúdo
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Verificar se já tem o patch
    if (content.includes('// ULTIMATE NEXT.JS FIX')) {
      log.info(`Arquivo já possui o fix: ${filePath}`);
      return true;
    }
      // Aplicar patch
    if (typeof pattern === 'string') {
      if (content.includes(pattern)) {
        content = content.replace(pattern, replacement);
      } else {
        log.warning(`Padrão não encontrado em ${filePath}`);
        
        // Imprimir primeiros 500 caracteres do conteúdo para debug
        console.log(`Conteúdo parcial de ${filePath} (primeiros 500 chars):\n${content.substring(0, 500)}`);
        return false;
      }
    } else if (pattern instanceof RegExp) {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
      } else {
        log.warning(`Padrão regex não encontrado em ${filePath}`);
        
        // Tentar encontrar partes similares para debug
        const contentLines = content.split('\n');
        const relevantLines = contentLines.filter(line => 
          line.includes('getLocationOrigin') || 
          line.includes('window.location') ||
          line.includes('parseRelativeUrl') ||
          line.includes('parseUrl')
        ).slice(0, 10);
        
        if (relevantLines.length > 0) {
          console.log(`Linhas relevantes encontradas em ${filePath}:`);
          relevantLines.forEach((line, i) => console.log(`${i+1}. ${line.trim()}`));
        }
        
        return false;
      }
    }
    
    // Salvar
    fs.writeFileSync(fullPath, content, 'utf8');
    log.success(`Arquivo corrigido: ${filePath}`);
    return true;
  } catch (error) {
    log.error(`Falha ao processar ${filePath}: ${error.message}`);
    return false;
  }
}

// Função principal
async function main() {
  log.title('ULTIMATE NEXT.JS WINDOW.LOCATION FIX');
  
  // Lista de correções (arquivo, regex/string para encontrar, substituição)
  const fixes = [
    // 1. getLocationOrigin em utils.js
    {
      file: 'node_modules/next/dist/shared/lib/utils.js',
      pattern: /function getLocationOrigin\(\) \{[\s\S]*?const \{[^}]+\} = window\.location;/,
      replacement: `function getLocationOrigin() {
  // ULTIMATE NEXT.JS FIX para window.location
  if (typeof window === 'undefined' || !window.location) {
    return 'http://localhost:3000';
  }
  const { protocol, hostname, port } = window.location;`
    },
    
    // 2. getURL em utils.js
    {
      file: 'node_modules/next/dist/shared/lib/utils.js',
      pattern: /function getURL\(\) \{[\s\S]*?const \{[^}]+\} = window\.location;/,
      replacement: `function getURL() {
  // ULTIMATE NEXT.JS FIX para window.location
  if (typeof window === 'undefined' || !window.location) {
    return '/';
  }
  const { href } = window.location;`
    },
    
    // 3. Parse relative URL
    {
      file: 'node_modules/next/dist/shared/lib/router/utils/parse-relative-url.js',
      pattern: /function parseRelativeUrl\(url, base\) \{/,
      replacement: `function parseRelativeUrl(url, base) {
  // ULTIMATE NEXT.JS FIX para URLs relativas
  if (!url) url = '/';
  if (url.startsWith('/')) {
    url = 'http://localhost:3000' + url;
  }`
    },
    
    // 4. parseUrl
    {
      file: 'node_modules/next/dist/shared/lib/router/utils/parse-url.js',
      pattern: /function parseUrl\(url\) \{/,
      replacement: `function parseUrl(url) {
  // ULTIMATE NEXT.JS FIX para parse URL
  if (!url || typeof url !== 'string') {
    url = '/';
  }`
    },
    
    // 5. Base Server handleRequest
    {
      file: 'node_modules/next/dist/server/base-server.js',
      pattern: /async handleRequest\([^)]+\) \{/,
      replacement: `async handleRequest() {
    // ULTIMATE NEXT.JS FIX para handleRequest
    try {
      const args = Array.from(arguments);
      // Verificar e garantir que req.url existe
      if (args[0] && !args[0].url) {
        args[0].url = '/';
      }`
    },
    
    // 6. Monkey patch geral
    {
      file: 'node_modules/next/dist/server/next-server.js',
      pattern: /constructor\(options\) \{/,
      replacement: `constructor(options) {
        // ULTIMATE NEXT.JS FIX - Global monkey patch
        if (typeof global !== 'undefined' && !global.window) {
          global.window = {
            location: {
              protocol: 'http:',
              hostname: 'localhost',
              port: '3000',
              href: 'http://localhost:3000/'
            }
          };
        }`
    }
  ];
  
  // Aplicar todos os fixes
  let successCount = 0;
  
  for (const fix of fixes) {
    log.info(`Processando ${fix.file}...`);
    if (await fixFile(fix.file, fix.pattern, fix.replacement)) {
      successCount++;
    }
  }
  
  log.title(`RESULTADO: ${successCount}/${fixes.length} FIXES APLICADOS`);
  
  if (successCount === fixes.length) {
    log.success('Todos os arquivos foram corrigidos com sucesso!');
    log.info('Agora inicie o Next.js com: npm run dev');
  } else {
    log.warning(`${successCount} de ${fixes.length} arquivos foram corrigidos.`);
    log.info('Você pode tentar iniciar o Next.js, mas alguns erros podem persistir.');
  }
}

// Executar
main().catch(err => {
  log.error(`Erro não tratado: ${err.message}`);
});
