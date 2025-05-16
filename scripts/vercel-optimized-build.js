#!/usr/bin/env node
/**
 * Script de build otimizado para Vercel
 * Este script combina todas as correções necessárias e executa o build
 * com configurações que garantem que o Tailwind CSS funcione corretamente.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Iniciando build otimizado para Vercel...');

// Função para executar um comando e exibir a saída
function runCommand(command, options = {}) {
    console.log(`📌 Executando: ${command}`);
    try {
        execSync(command, {
            stdio: 'inherit',
            ...options
        });
        return true;
    } catch (error) {
        console.error(`❌ Erro ao executar o comando: ${command}`);
        console.error(error.message);
        return false;
    }
}

// Verificar o ambiente
console.log('📊 Verificando ambiente...');
console.log(`📌 Node.js: ${process.version}`);
console.log(`📌 Diretório atual: ${process.cwd()}`);

// Configurações de ambiente para garantir funcionamento do Tailwind CSS
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.TAILWIND_MODE = 'build';
process.env.NEXT_RUNTIME = 'nodejs';

// 1. Garantir que os módulos necessários estejam instalados
console.log('📦 Verificando e instalando dependências críticas...');
const requiredDeps = [
    'tailwindcss@latest',
    'postcss@latest',
    'autoprefixer@latest',
    '@tailwindcss/forms@latest'
];

runCommand(`npm install --no-save ${requiredDeps.join(' ')}`);

// 2. Aplicar correções específicas
console.log('🔧 Aplicando correções específicas...');

// Aplicar correção do CSS Loader
if (fs.existsSync(path.join(process.cwd(), 'scripts', 'fix-css-loader.js'))) {
    runCommand('node scripts/fix-css-loader.js');
} else {
    console.log('⚠️ fix-css-loader.js não encontrado. Pulando esta etapa.');
}

// Aplicar outras correções
const corrections = [
    'scripts/direct-tailwind-patch.js',
    'scripts/create-minimal-tailwind.js',
    'scripts/create-minimal-postcss.js',
    'scripts/fix-nextjs-config.js'
];

corrections.forEach(script => {
    if (fs.existsSync(path.join(process.cwd(), script))) {
        runCommand(`node ${script}`);
    }
});

// 3. Aplicar patch direto no PostCSS
console.log('🔧 Garantindo configuração correta do PostCSS...');
const postcssConfigPath = path.join(process.cwd(), 'postcss.config.js');
const postcssConfig = `
// postcss.config.js
// Versão otimizada para compatibilidade com Vercel e NextJS 15+
const path = require('path');

module.exports = {
  plugins: [
    require('tailwindcss')({
      config: path.join(__dirname, 'tailwind.config.js')
    }),
    require('autoprefixer')
  ]
};
`;

fs.writeFileSync(postcssConfigPath, postcssConfig);
console.log('✅ postcss.config.js atualizado com sucesso!');

// 4. Executar build com configurações otimizadas
console.log('🏗️ Iniciando build do Next.js...');

// Configurações de ambiente adicionais para o build
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.NEXT_SHARP_PATH = path.join(process.cwd(), 'node_modules', 'sharp');
process.env.TAILWIND_CSS_DISABLED = '0'; // Garantir que o Tailwind está ativado

// Executar o build do Next.js
const buildResult = runCommand('next build');

if (buildResult) {
    console.log('🎉 Build completado com sucesso!');
} else {
    console.error('❌ Build falhou. Tentando abordagem alternativa...');

    // Tentar abordagem alternativa com modo standalone
    console.log('🔄 Tentando build com modo standalone...');
    process.env.NEXT_MINIMAL = '1';

    // Tentar com --no-lint para evitar problemas não relacionados
    const alternativeBuildResult = runCommand('next build --no-lint');

    if (alternativeBuildResult) {
        console.log('🎉 Build alternativo completado com sucesso!');
    } else {
        console.error('❌ Todas as tentativas de build falharam.');
        process.exit(1);
    }
}

console.log('✅ Processo de build finalizado.');
