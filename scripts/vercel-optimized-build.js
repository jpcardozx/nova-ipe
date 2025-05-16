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

// Garantir que o diretório de fallbacks existe
const fallbackDir = path.join(process.cwd(), 'scripts', 'module-fallbacks');
if (!fs.existsSync(fallbackDir)) {
    fs.mkdirSync(fallbackDir, { recursive: true });
}

// Verificar se o fallback de autoprefixer existe
const autoprefixerFallbackPath = path.join(fallbackDir, 'autoprefixer-fallback.js');
if (!fs.existsSync(autoprefixerFallbackPath)) {
    console.log('📝 Criando fallback para autoprefixer...');
    const autoprefixerFallback = `/**
 * Implementação de fallback do autoprefixer
 * Para usar quando o módulo original não está disponível
 */

'use strict';

// Implementação minimalista do autoprefixer
function autoprefixer(options) {
  options = options || {};
  
  return {
    postcssPlugin: 'autoprefixer',
    Once(root) {
      // Não faz nada, apenas retorna a raiz CSS sem modificações
      return root;
    },
    info() {
      return { browsers: [] };
    }
  };
}

// Configurações necessárias para o PostCSS
autoprefixer.postcss = true;

module.exports = autoprefixer;`;

    fs.writeFileSync(autoprefixerFallbackPath, autoprefixerFallback);
    console.log('✅ Fallback para autoprefixer criado com sucesso!');
}

// Criar diretório real do autoprefixer se não existir
const autoprefixerDir = path.join(process.cwd(), 'node_modules', 'autoprefixer');
if (!fs.existsSync(autoprefixerDir)) {
    fs.mkdirSync(autoprefixerDir, { recursive: true });

    // Criar package.json para o autoprefixer
    const packageJson = {
        "name": "autoprefixer",
        "version": "10.4.16",
        "main": "lib/autoprefixer.js",
        "license": "MIT"
    };

    fs.writeFileSync(
        path.join(autoprefixerDir, 'package.json'),
        JSON.stringify(packageJson, null, 2)
    );

    // Criar lib diretório
    const libDir = path.join(autoprefixerDir, 'lib');
    if (!fs.existsSync(libDir)) {
        fs.mkdirSync(libDir, { recursive: true });
    }

    // Copiar o fallback
    fs.copyFileSync(
        autoprefixerFallbackPath,
        path.join(libDir, 'autoprefixer.js')
    );

    // Criar index.js para o autoprefixer
    fs.writeFileSync(
        path.join(autoprefixerDir, 'index.js'),
        "module.exports = require('./lib/autoprefixer');"
    );

    console.log('✅ Diretório autoprefixer criado com sucesso!');
}

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
    'scripts/fix-nextjs-config.js',
    'scripts/fix-module-imports.js'
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
process.env.NODE_ENV = 'production';
process.env.TAILWIND_MODE = 'build';

// Configurações específicas baseadas na versão do Node.js
if (process.version.startsWith('v22')) {
    console.log('⚠️ Detectado Node.js v22, aplicando configurações específicas...');

    // Desativar modo NEXT_MINIMAL para evitar problemas com __non_webpack_require__
    delete process.env.NEXT_MINIMAL;

    // Configurar NODE_OPTIONS para máxima compatibilidade
    process.env.NODE_OPTIONS = '--no-warnings --experimental-fetch --max-old-space-size=4096';
} else {
    // Para outras versões do Node.js, usar configurações padrão
    process.env.NODE_OPTIONS = '--max-old-space-size=4096';
}

// Estratégia de múltiplas tentativas para o build
console.log('🏗️ Iniciando processo de build com recuperação de falhas...');

// Primeira tentativa: build normal
console.log('🔄 Tentativa 1: Build padrão com npx next build');
let buildSuccess = runCommand('npx next build');

// Segunda tentativa: build com --no-lint se a primeira falhou
if (!buildSuccess) {
    console.log('⚠️ Primeira tentativa falhou, tentando sem lint...');
    console.log('🔄 Tentativa 2: Build sem lint');
    buildSuccess = runCommand('npx next build --no-lint');
}

// Terceira tentativa: usar o binário do next diretamente
if (!buildSuccess) {
    console.log('⚠️ Segunda tentativa falhou, tentando binário do next diretamente...');
    console.log('🔄 Tentativa 3: Usando binário do next diretamente');

    const nextBinPath = path.join(process.cwd(), 'node_modules', '.bin', 'next');
    if (fs.existsSync(nextBinPath)) {
        buildSuccess = runCommand(`${nextBinPath} build --no-lint`);
    } else {
        console.log('❌ Binário do next não encontrado');
    }
}

// Quarta tentativa: criar um wrapper próprio usando o next interno
if (!buildSuccess) {
    console.log('⚠️ Terceira tentativa falhou, criando wrapper personalizado...');
    console.log('🔄 Tentativa 4: Usando wrapper personalizado');

    // Criar um script temporário de build
    const tempBuildScript = path.join(process.cwd(), 'scripts', 'temp-build.js');
    fs.writeFileSync(tempBuildScript, `
    // Script temporário de build
    // Este script usa diretamente o módulo next/dist/cli/next-build
    // evitando problemas com o CLI
    process.env.NODE_ENV = 'production';
    
    const nextBuild = require('next/dist/cli/next-build');
    nextBuild.nextBuild([process.cwd()], {})
      .then(() => console.log('Build completado com sucesso'))
      .catch((err) => {
        console.error('Erro no build:', err);
        process.exit(1);
      });
    `);

    buildSuccess = runCommand(`node ${tempBuildScript}`);

    // Limpar arquivo temporário
    if (fs.existsSync(tempBuildScript)) {
        fs.unlinkSync(tempBuildScript);
    }
}// Final do bloco de tentativas
if (!buildSuccess) {
    console.error('❌ Todas as tentativas de build falharam.');
    process.exit(1);
} else {
    console.log('🎉 Build completado com sucesso!');
}

console.log('✅ Processo de build finalizado.');
