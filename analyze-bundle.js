#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Nova IPE - Análise Crítica de Performance');
console.log('==========================================');

// Ensure analyze directory exists
const analyzeDir = path.join(process.cwd(), 'analyze');
if (!fs.existsSync(analyzeDir)) {
  fs.mkdirSync(analyzeDir, { recursive: true });
}

try {
  // Set environment for production analysis
  process.env.ANALYZE = 'true';
  process.env.NODE_ENV = 'production';
  
  console.log('⚡ Executando build de produção com análise...');
  execSync('npm run build', { 
    stdio: 'inherit',
    env: { ...process.env, ANALYZE: 'true' }
  });
  
  console.log('\n✅ Análise completa!');
  console.log(`📊 Relatório disponível em: ${path.join(analyzeDir, 'client.html')}`);
  console.log('🔗 Abra o arquivo HTML no navegador para visualizar');
  
} catch (error) {
  console.error('❌ Erro na análise:', error.message);
  process.exit(1);
}
