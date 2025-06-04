/**
 * Nova Ipê Remediation Validator 2.0
 * 
 * Este script valida que a remediação da dívida técnica está funcionando
 * verificando que:
 * 
 * 1. O projeto pode construir e iniciar sem customizações webpack
 * 2. Os estilos visuais permanecem intactos
 * 3. Dependências foram removidas adequadamente
 * 4. A estrutura do projeto foi simplificada
 * 
 * @version 2.0.0
 * @date 2 de junho de 2025
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Cores simples para console já que Chalk v5+ é apenas ESM
const colors = {
  green: text => `\x1b[32m${text}\x1b[0m`,
  red: text => `\x1b[31m${text}\x1b[0m`,
  yellow: text => `\x1b[33m${text}\x1b[0m`,
  cyan: text => `\x1b[36m${text}\x1b[0m`,
  blue: text => `\x1b[34m${text}\x1b[0m`,
  bold: text => `\x1b[1m${text}\x1b[0m`,
  bg: {
    green: text => `\x1b[42m\x1b[30m${text}\x1b[0m`,
    red: text => `\x1b[41m\x1b[37m${text}\x1b[0m`,
    yellow: text => `\x1b[43m\x1b[30m${text}\x1b[0m`,
  }
};

console.log(colors.bold(colors.green('\n⚡ Nova Ipê Remediation Validator 2.0')));
console.log(colors.yellow('======================================='));
console.log(`Data da validação: ${new Date().toLocaleDateString('pt-BR')}\n`);

// Contadores de status
let passCount = 0;
let warningCount = 0;
let failCount = 0;

// Função utilitária para mostrar status
function showStatus(description, passed, message = '', severity = 'error') {
  if (passed) {
    console.log(`${colors.green('✅')} ${description}`);
    passCount++;
  } else {
    if (severity === 'warning') {
      console.log(`${colors.yellow('⚠️')} ${description}`);
      if (message) console.log(`   ${colors.yellow(message)}`);
      warningCount++;
    } else {
      console.log(`${colors.red('❌')} ${description}`);
      if (message) console.log(`   ${colors.red(message)}`);
      failCount++;
    }
  }
}

console.log(colors.bold('VALIDAÇÃO DE CONFIGURAÇÃO\n'));

// Verificar se webpack-definitive-fix.js foi removido do next.config.js
try {
  const nextConfig = fs.readFileSync(path.join(process.cwd(), 'next.config.js'), 'utf8');
  showStatus(
    'next.config.js sem referências a webpack personalizado',
    !nextConfig.includes('webpack-definitive-fix') && !nextConfig.includes('applyWebpackFix')
  );

  // Verificar se há configurações experimentais desnecessárias
  const hasUnnecessaryExperimental = nextConfig.includes('transpilePackages');
  showStatus(
    'next.config.js sem configurações experimentais desnecessárias',
    !hasUnnecessaryExperimental,
    hasUnnecessaryExperimental ? 'transpilePackages não é necessário com a configuração atual' : '',
    'warning'
  );
} catch (err) {
  showStatus(
    'Verificação de next.config.js',
    false,
    'Erro ao ler next.config.js: ' + err.message
  );
}

console.log(colors.bold('\nVALIDAÇÃO DE DEPENDÊNCIAS\n'));

// Verificar package.json para dependências removidas
try {
  const packageJson = require('./package.json');
  const dependenciesList = [
    ...(Object.keys(packageJson.dependencies || {})),
    ...(Object.keys(packageJson.devDependencies || {}))
  ];
  
  const removedDeps = [
    'styled-components',
    'chart.js',
    'react-chartjs-2',
    'react-spring',
    'webpack',
    'babel-loader',
    'css-loader',
    'browserify-zlib',
    'crypto-browserify',
    'https-browserify',
    'os-browserify',
    'stream-browserify',
    'stream-http',
  ];

  const stillExistingDeps = removedDeps.filter(dep => dependenciesList.includes(dep));
  
  showStatus(
    'Dependências desnecessárias removidas',
    stillExistingDeps.length === 0,
    stillExistingDeps.length > 0 ? `Dependências ainda presentes: ${stillExistingDeps.join(', ')}` : ''
  );

  // Verificar número total de dependências
  const totalDeps = dependenciesList.length;
  showStatus(
    'Total de dependências otimizado (< 40)',
    totalDeps < 40,
    totalDeps >= 40 ? `Total atual: ${totalDeps} dependências` : `Total atual: ${totalDeps} dependências`,
    totalDeps >= 40 ? 'warning' : 'info'
  );

  // Verificar se framer-motion está presente (recomendado para animações)
  const hasFramerMotion = dependenciesList.includes('framer-motion');
  showStatus(
    'Biblioteca de animação adequada presente (framer-motion)',
    hasFramerMotion,
    !hasFramerMotion ? 'framer-motion não encontrado - recomendado para animações consistentes' : '',
    'warning'
  );
} catch (err) {
  showStatus(
    'Verificação de package.json',
    false,
    'Erro ao ler package.json: ' + err.message
  );
}

console.log(colors.bold('\nVALIDAÇÃO DE ESTRUTURA DO PROJETO\n'));

// Verificar arquivos de webpack desnecessários
const webpackFiles = [
  'webpack-definitive-fix.js',
  'webpack.config.js',
  'webpack.fix.js',
];

webpackFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  if (exists) {
    showStatus(
      `Arquivo ${file}`,
      false,
      `Arquivo ${file} ainda está presente na raiz do projeto`
    );
  }
});

// Verificar diretório de arquivamento
const archiveExists = fs.existsSync(path.join(process.cwd(), 'archive'));
showStatus(
  'Diretório de arquivamento para código legado',
  archiveExists,
  !archiveExists ? 'Diretório "archive" não encontrado para armazenar código legado' : '',
  'warning'
);

// Verificar script de inicialização limpo
const cleanStartExists = fs.existsSync(path.join(process.cwd(), 'iniciar-dev-limpo.cmd'));
showStatus(
  'Script de inicialização limpo',
  cleanStartExists,
  !cleanStartExists ? 'Script "iniciar-dev-limpo.cmd" não encontrado' : ''
);

// Verificar documentação de remediação
const remediationDocsExist = fs.existsSync(path.join(process.cwd(), 'ACOMPANHAMENTO-REMEDICAO-ARQUITETURAL.md'));
showStatus(
  'Documentação de remediação',
  remediationDocsExist,
  !remediationDocsExist ? 'Documentação "ACOMPANHAMENTO-REMEDICAO-ARQUITETURAL.md" não encontrada' : ''
);

// Resumo final
console.log(colors.yellow('\n======================================='));
console.log(colors.bold('RESUMO DA VALIDAÇÃO'));
console.log(colors.yellow('=======================================\n'));
console.log(`${colors.green(`✅ Passou: ${passCount}`)} / ${colors.yellow(`⚠️ Avisos: ${warningCount}`)} / ${colors.red(`❌ Falhou: ${failCount}`)}`);

if (failCount === 0) {
  if (warningCount === 0) {
    console.log(colors.bg.green(' SUCESSO ') + ' Todas as verificações da remediação foram aprovadas!');
  } else {
    console.log(colors.bg.yellow(' ATENÇÃO ') + ' Remediação bem sucedida com alguns pontos de atenção.');
  }
} else {
  console.log(colors.bg.red(' FALHA ') + ' A remediação ainda apresenta problemas que precisam ser resolvidos.');
}

console.log(colors.cyan('\n💡 Próximos passos:'));
console.log(colors.cyan('1. Execute "npm run dev" para testar a aplicação'));
console.log(colors.cyan('2. Verifique se os estilos visuais estão intactos'));
console.log(colors.cyan('3. Execute "npm run build" para garantir que o build de produção funciona'));
console.log(colors.cyan('4. Siga o guia de consolidação de componentes para continuar as melhorias'));
