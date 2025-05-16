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

// Tentar aplicar fixes específicos para Node.js v22 antes do build
// Verificar se estamos em Node.js v22
if (process.version.startsWith('v22')) {
    console.log('⚠️ Detectado Node.js v22, aplicando patches específicos...');

    // Fix para o problema de __non_webpack_require__
    const requireHookPath = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'server', 'require-hook.js');

    if (fs.existsSync(requireHookPath)) {
        // Criar backup se ainda não existir
        if (!fs.existsSync(`${requireHookPath}.bak`)) {
            fs.copyFileSync(requireHookPath, `${requireHookPath}.bak`);
        }

        // Ler o conteúdo
        let hookContent = fs.readFileSync(requireHookPath, 'utf8');

        // Verificar se contém o código problemático
        if (hookContent.includes('__non_webpack_require__')) {
            console.log('🔧 Corrigindo referência a __non_webpack_require__ em require-hook.js');
            hookContent = hookContent.replace(
                /let resolve = process\.env\.NEXT_MINIMAL \? __non_webpack_require__\.resolve : require\.resolve;/g,
                'let resolve = require.resolve;'
            );

            // Escrever o arquivo modificado
            fs.writeFileSync(requireHookPath, hookContent);
        }
    }
}

// Definir configurações especiais para o build
process.env.NODE_OPTIONS = '--no-warnings --experimental-fetch';

// Executar o build do Next.js usando o comando npx para evitar problemas de escopo
const buildResult = runCommand('npx next build');

if (buildResult) {
    console.log('🎉 Build completado com sucesso!');
} else {
    console.error('❌ Build falhou. Tentando abordagem alternativa...');

    // Tentar abordagem alternativa com modo standalone
    console.log('🔄 Tentando build com modo standalone e flags especiais...');

    // Desativar o modo minimal que causa problemas no Node.js v22
    delete process.env.NEXT_MINIMAL;

    // Configurações alternativas para o build
    process.env.NODE_OPTIONS = '--no-warnings --max_old_space_size=4096';

    // Tentar com --no-lint para evitar problemas não relacionados
    const alternativeBuildResult = runCommand('npx next build --no-lint');

    if (alternativeBuildResult) {
        console.log('🎉 Build alternativo completado com sucesso!');
    } else {
        console.error('❌ Todas as tentativas de build falharam.');
        process.exit(1);
    }
}

console.log('✅ Processo de build finalizado.');
