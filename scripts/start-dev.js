#!/usr/bin/env node

/**
 * Nova Ipê - Start Development Server
 * Este script inicia o servidor de desenvolvimento com configurações otimizadas
 * para melhor performance durante o desenvolvimento.
 */

const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

// Determinar o comando correto com base no SO
const isWindows = os.platform() === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('\x1b[36m%s\x1b[0m', '🚀 Nova Ipê - Inicializando servidor de desenvolvimento rápido');
console.log('\x1b[36m%s\x1b[0m', '==========================================================');

// Configurar variáveis de ambiente para melhorar performance
process.env.FAST_DEV = 'true';
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.NEXT_DISABLE_SOURCEMAPS = 'true';
process.env.NODE_OPTIONS = '--max-old-space-size=4096 --no-warnings';

console.log('\n\x1b[33m%s\x1b[0m', '⚙️ Configurações de desenvolvimento rápido ativadas:');
console.log('  • Otimizações de produção desativadas');
console.log('  • Sourcemaps desativados para carregamento mais rápido');
console.log('  • Telemetria desativada');
console.log('  • Alocação de memória aumentada');

console.log('\n\x1b[32m%s\x1b[0m', '🌱 Iniciando servidor de desenvolvimento...\n');

// Iniciar o servidor Next.js
const dev = spawn(npmCmd, ['run', 'dev'], {
  env: { ...process.env },
  stdio: 'inherit'
});

// Manipulação de eventos do processo
dev.on('error', (err) => {
  console.error('\x1b[31m%s\x1b[0m', `❌ Erro ao iniciar servidor: ${err.message}`);
  process.exit(1);
});

dev.on('close', (code) => {
  if (code !== 0) {
    console.log('\x1b[31m%s\x1b[0m', `❌ O servidor encerrou com código ${code}`);
  } else {
    console.log('\x1b[32m%s\x1b[0m', '✅ Servidor encerrado com sucesso');
  }
});

// Manipulação de sinais para encerramento limpo
['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, () => {
    console.log('\n\x1b[33m%s\x1b[0m', '🛑 Encerrando servidor...');
    dev.kill(signal);
  });
});

console.log('\x1b[33m%s\x1b[0m', '⏳ Aguardando inicialização do servidor...');
