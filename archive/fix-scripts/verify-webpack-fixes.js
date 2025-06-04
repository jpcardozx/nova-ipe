/**
 * Verificador de Correções de Webpack e Hydration
 * 
 * Este script verifica se todas as correções necessárias foram aplicadas aos
 * arquivos de configuração do webpack e Next.js.
 */

const fs = require('fs');
const path = require('path');

// Funções utilitárias
function logSuccess(message) {
  console.log('\x1b[32m✓\x1b[0m', message);
}

function logError(message) {
  console.log('\x1b[31m✗\x1b[0m', message);
  return false;
}

function logInfo(message) {
  console.log('\x1b[36mi\x1b[0m', message);
}

// Verificações
function checkNextConfig() {
  logInfo('Verificando next.config.js...');
  
  try {
    const configPath = path.join(process.cwd(), 'next.config.js');
    const content = fs.readFileSync(configPath, 'utf8');
    
    let allPassed = true;
    
    // Verificar se serverActions foi removido
    if (content.includes('serverActions: true')) {
      allPassed = logError('next.config.js ainda contém "serverActions: true" (deve ser removido pois é default no Next.js 14+)');
    } else {
      logSuccess('Option serverActions foi corretamente removida/comentada');
    }
    
    // Verificar se framer-motion não está em serverComponentsExternalPackages
    const serverComponentsMatch = content.match(/serverComponentsExternalPackages\s*:\s*\[(.*?)\]/s);
    if (serverComponentsMatch && serverComponentsMatch[1].includes('framer-motion')) {
      allPassed = logError('framer-motion ainda está presente em serverComponentsExternalPackages');
    } else {
      logSuccess('framer-motion não está em serverComponentsExternalPackages');
    }
    
    return allPassed;
  } catch (error) {
    return logError(`Erro ao verificar next.config.js: ${error.message}`);
  }
}

function checkWebpackDefinitiveFix() {
  logInfo('Verificando webpack-definitive-fix.js...');
  
  try {
    const fixPath = path.join(process.cwd(), 'webpack-definitive-fix.js');
    const content = fs.readFileSync(fixPath, 'utf8');
    
    let allPassed = true;
    
    // Verificar se path module está importado
    if (!content.includes('const path = require(\'path\')')) {
      allPassed = logError('Módulo path não está importado em webpack-definitive-fix.js');
    } else {
      logSuccess('Módulo path está corretamente importado');
    }
    
    // Verificar formato correto da função externals
    if (content.includes('(context, request, callback)')) {
      allPassed = logError('Formato antigo de parâmetros na função externals (deve ser ({context, request}, cb))');
    } else if (content.includes('({context, request}, cb)')) {
      logSuccess('Formato correto de parâmetros na função externals');
    }
    
    return allPassed;
  } catch (error) {
    return logError(`Erro ao verificar webpack-definitive-fix.js: ${error.message}`);
  }
}

// Executar verificações
console.log('=== Verificação de Correções de Webpack e Hydration ===');
const nextConfigOk = checkNextConfig();
const webpackFixOk = checkWebpackDefinitiveFix();

console.log('\n=== Resultado Final ===');
if (nextConfigOk && webpackFixOk) {
  console.log('\x1b[32m✓ Todas as correções foram aplicadas com sucesso!\x1b[0m');
  console.log('\nVocê pode iniciar o servidor de desenvolvimento com:');
  console.log('\x1b[36mnpm run dev\x1b[0m');
} else {
  console.log('\x1b[31m✗ Ainda há problemas que precisam ser corrigidos.\x1b[0m');
  console.log('\nRevise os erros acima e aplique as correções necessárias.');
}
