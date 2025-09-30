#!/usr/bin/env node

/**
 * 🛡️ PACKAGE MANAGER CHECK
 * Verifica se o comando correto (pnpm) está sendo usado
 * Bloqueia npm/yarn e força uso do pnpm
 */

const userAgent = process.env.npm_config_user_agent || '';
const currentManager = userAgent.split(' ')[0] || 'unknown';

// Cores para output (fallback caso chalk não esteja disponível)
const colors = {
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
  gray: (text) => `\x1b[90m${text}\x1b[0m`
};

function showError() {
  console.clear();
  console.log(colors.red('━'.repeat(70)));
  console.log(colors.red(colors.bold('🚫 GERENCIADOR DE PACOTES INCORRETO DETECTADO!')));
  console.log(colors.red('━'.repeat(70)));
  
  console.log(colors.yellow(`\n⚠️  Detectado: ${colors.bold(currentManager)}`));
  console.log(colors.green(`✅ Esperado: ${colors.bold('pnpm')}\n`));
  
  console.log(colors.cyan('🎯 Este projeto foi configurado para usar PNPM exclusivamente.\n'));
  
  console.log(colors.bold('Benefícios do PNPM:'));
  console.log(colors.gray('• ⚡ Performance superior (até 2x mais rápido)'));
  console.log(colors.gray('• 💾 Economia de espaço (compartilhamento inteligente)'));
  console.log(colors.gray('• 🔒 Resolução de dependências mais segura'));
  console.log(colors.gray('• 🎯 Evita problemas de hoisting do npm\n'));
  
  console.log(colors.green(colors.bold('📦 INSTALAR PNPM:')));
  console.log(colors.cyan('npm install -g pnpm'));
  console.log(colors.gray('# ou usando curl:'));
  console.log(colors.cyan('curl -fsSL https://get.pnpm.io/install.sh | sh\n'));
  
  console.log(colors.green(colors.bold('🔧 COMANDOS CORRETOS PARA ESTE PROJETO:')));
  console.log(colors.white(`${colors.red('❌ npm install')} → ${colors.green('✅ pnpm install')}`));
  console.log(colors.white(`${colors.red('❌ npm run dev')} → ${colors.green('✅ pnpm dev')}`));
  console.log(colors.white(`${colors.red('❌ npm run build')} → ${colors.green('✅ pnpm build')}`));
  console.log(colors.white(`${colors.red('❌ npm add package')} → ${colors.green('✅ pnpm add package')}\n`));
  
  console.log(colors.red('━'.repeat(70)));
  console.log(colors.red(colors.bold('INSTALAÇÃO CANCELADA - USE PNPM!')));
  console.log(colors.red('━'.repeat(70)));
}

// Permitir apenas pnpm
if (!currentManager.startsWith('pnpm')) {
  // Se for npm especificamente, mostrar erro mais detalhado
  if (currentManager.startsWith('npm')) {
    showError();
    console.log(colors.yellow('\n💡 DICA: Se você digitou "npm" por hábito, apenas substitua por "pnpm"'));
    process.exit(1);
  }
  
  // Para yarn ou outros gerenciadores
  if (currentManager.startsWith('yarn')) {
    showError();
    console.log(colors.yellow('\n💡 YARN não é compatível com este projeto. Use PNPM para melhor performance.'));
    process.exit(1);
  }
  
  // Para gerenciadores desconhecidos
  if (currentManager !== 'unknown') {
    showError();
    process.exit(1);
  }
}

// Se chegou até aqui, é pnpm ou execução direta
console.log(colors.green('✅ Gerenciador de pacotes correto detectado: PNPM'));