/**
 * Script de build seguro para Nova Ipê
 * Este script executa a build e captura eventuais erros
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Iniciando build segura do projeto Nova Ipê...');

try {
  // Verificar a existência do webpack-definitive-fix.js
  const webpackFixPath = path.join(process.cwd(), 'webpack-definitive-fix.js');
  if (fs.existsSync(webpackFixPath)) {
    console.log('Verificando webpack-definitive-fix.js...');
    
    // Ler o conteúdo do arquivo
    const webpackFixContent = fs.readFileSync(webpackFixPath, 'utf8');
    
    // Verificar se o arquivo tem as correções necessárias
    const hasPathImport = webpackFixContent.includes('const path = require(\'path\')');
    const hasNullCheck = webpackFixContent.includes('if (!module.context) return');
    
    if (!hasPathImport) {
      console.error('ERRO: webpack-definitive-fix.js não tem a importação do módulo path!');
      process.exit(1);
    }
    
    if (!hasNullCheck) {
      console.error('ERRO: webpack-definitive-fix.js não tem verificação de nulos nos módulos!');
      console.log('Aplicando correção de segurança...');
      
      // Aplicar correção simples para evitar erros de nulo
      let updatedContent = webpackFixContent.replace(
        /const packageName = (module\.context\.match\(.*?\))\[1\]/g,
        'const match = $1;\nconst packageName = match && match[1] ? match[1] : "unknown"'
      );
      
      fs.writeFileSync(webpackFixPath, updatedContent);
      console.log('Correção aplicada com sucesso!');
    }
  }
  
  console.log('Executando build...');
  execSync('next build', { stdio: 'inherit' });
  console.log('Build concluída com sucesso!');
  process.exit(0);
} catch (error) {
  console.error('Erro durante a build:', error.message);
  process.exit(1);
}
