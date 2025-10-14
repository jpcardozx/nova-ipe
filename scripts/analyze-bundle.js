#!/usr/bin/env node

/**
 * Script para analisar o bundle e identificar os arquivos mais pesados
 * Usa o Next.js bundle analyzer
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function analyzeBundleSize() {
  console.log('🔍 Analisando tamanho do bundle...\n');
  
  try {
    // Build com análise
    console.log('📦 Fazendo build com análise...');
    const { stdout, stderr } = await execAsync('ANALYZE=true pnpm build', {
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });
    
    if (stderr) {
      console.error('Avisos:', stderr);
    }
    
    console.log('\n✅ Análise completa! Verifique os arquivos HTML gerados.');
    console.log('\nArquivos gerados:');
    console.log('- .next/analyze/client.html');
    console.log('- .next/analyze/server.html');
    
  } catch (error) {
    console.error('❌ Erro ao analisar:', error.message);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  analyzeBundleSize();
}

module.exports = { analyzeBundleSize };
