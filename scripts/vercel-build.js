#!/usr/bin/env node

/**
 * Script para build otimizado para Vercel
 * Executa o build com configurações otimizadas para o ambiente Vercel
 * Resolve problemas de dependências nativas e carregamento
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🌳 Nova Ipê - Build otimizado para Vercel');

// Detectar ambiente
const isVercelEnv = !!process.env.VERCEL;
const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
console.log(`Executando em ambiente ${isVercelEnv ? 'Vercel' : 'local'} (${isProduction ? 'Produção' : 'Preview'})`);

// Otimizar configurações para Vercel
if (isVercelEnv) {
    console.log('Aplicando configurações específicas para ambiente Vercel...');    // ETAPA 1: Verificar e instalar dependências críticas diretamente
    console.log('🔄 Instalando tailwindcss e dependências críticas diretamente...');
    try {
        execSync('npm install -D tailwindcss@3.3.5 postcss@8.4.35 autoprefixer@10.4.16 --force', { stdio: 'inherit' });
        console.log('✅ Dependências críticas instaladas com sucesso');
    } catch (installError) {
        console.warn('⚠️ Erro ao instalar dependências, mas continuando:', installError.message);
    }
    
    // ETAPA 2: Executar script para corrigir o Tailwind CSS
    console.log('🔄 Executando script para corrigir problemas do Tailwind CSS...');
    try {
        // Garantir que o script existe
        const fixTailwindPath = path.join(__dirname, 'fix-tailwind.js');
        if (fs.existsSync(fixTailwindPath)) {
            require('./fix-tailwind');
        } else {
            throw new Error('Script fix-tailwind.js não encontrado');
        }
    } catch (e) {
        console.error('❌ Erro ao executar script de correção do Tailwind CSS:', e.message);
        
        // ETAPA 3: Fallback - criar implementação mínima do tailwindcss
        console.log('🔄 Implementando solução de emergência para tailwindcss...');
        try {
            const nodeModulesDir = path.join(process.cwd(), 'node_modules');
            const tailwindDir = path.join(nodeModulesDir, 'tailwindcss');
            
            // Garantir diretório node_modules/tailwindcss
            if (!fs.existsSync(tailwindDir)) {
                fs.mkdirSync(tailwindDir, { recursive: true });
            }
            
            // Criar estrutura mínima para o tailwindcss
            const indexContent = `
// Tailwind CSS emergency fallback
module.exports = {
  postcssPlugin: 'tailwindcss',
  plugins: []
};
module.exports.postcss = true;
`;
            fs.writeFileSync(path.join(tailwindDir, 'index.js'), indexContent);
            
            const packageContent = `{
  "name": "tailwindcss",
  "version": "3.3.5",
  "main": "index.js"
}`;
            fs.writeFileSync(path.join(tailwindDir, 'package.json'), packageContent);
            
            console.log('✅ Solução de emergência para tailwindcss implementada');
        } catch (emergencyError) {
            console.error('❌ Falha na solução de emergência:', emergencyError.message);
        }
    }

    // Executar script de correção de importações
    console.log('Executando script para correção de importações...');
    try {
        require('./fix-imports');
    } catch (e) {
        console.error('❌ Erro ao executar script de correção de importações:', e);
    }

    // Resolver problemas com dependências do Rollup
    console.log('Resolvendo problemas com dependências do Rollup...');
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    let packageJson;

    try {
        packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

        // Garantir que temos as dependências opcionais corretas para Linux
        if (!packageJson.optionalDependencies) {
            packageJson.optionalDependencies = {};
        }

        // Adicionar ambas as variantes do Rollup para Linux
        packageJson.optionalDependencies['@rollup/rollup-linux-x64-gnu'] = '4.14.0';
        packageJson.optionalDependencies['@rollup/rollup-linux-x64-musl'] = '4.14.0';

        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
        console.log('✅ package.json atualizado com dependências opcionais do Rollup');

        // Forçar reinstalação das dependências do Rollup
        try {
            console.log('Instalando dependências específicas do Rollup para Linux...');
            execSync('npm install @rollup/rollup-linux-x64-gnu@4.14.0 @rollup/rollup-linux-x64-musl@4.14.0 --no-save',
                { stdio: 'inherit' });
        } catch (error) {
            console.log('⚠️ Aviso: Não foi possível reinstalar dependências do Rollup:', error.message);
        }
    } catch (error) {
        console.error('⚠️ Erro ao modificar package.json:', error.message);
    }

    // Corrigir problemas de importação para o build
    try {
        console.log('Executando correção de imports...');
        require('./fix-imports');
    } catch (err) {
        console.error('Erro ao corrigir imports:', err);
    }

    // Configurar .npmrc para dependências nativas
    const npmrcContent = `
legacy-peer-deps=true
force=true
canvas_skip_installation=true
canvas_binary_host_mirror=https://github.com/Automattic/node-canvas/releases/download/
update-binary=false
sharp_binary_host=https://github.com/lovell/sharp/releases/download
sharp_libvips_binary_host=https://github.com/lovell/sharp-libvips/releases/download
unsafe-perm=true
`;

    fs.writeFileSync('.npmrc', npmrcContent, 'utf8');
    console.log('Arquivo .npmrc configurado para o ambiente Vercel');
}

// Verifica imagens OG
console.log('Verificando imagens OG...');
const ogImagePath = path.join(__dirname, '../public/images/og-image-2025.jpg');

if (!fs.existsSync(ogImagePath)) {
    console.log('Gerando imagens OG de fallback...');
    try {
        execSync('node scripts/fallback-og-images.js', { stdio: 'inherit' });
        console.log('✅ Imagens OG geradas com sucesso');
    } catch (error) {
        console.log('⚠️ Erro ao gerar imagens OG, usando fallback básico');
    }
} else {
    console.log('✅ Imagens OG já existem');
}

// Executar build do Next.js
console.log('\n🏗️ Iniciando build do Next.js...\n');
try {
    execSync('next build', { stdio: 'inherit' });
    console.log('\n✅ Build concluído com sucesso!');
} catch (error) {
    console.error('\n❌ Erro durante o build:', error.message);

    // Verificar se é o erro específico do Rollup
    if (error.message.includes('@rollup/rollup-linux')) {
        console.log('\n⚠️ Detectado erro conhecido do Rollup. Tentando solução alternativa...');

        try {
            // Criar um patch temporário para o módulo Rollup
            const rollupPatchDir = path.join(process.cwd(), 'node_modules', '@rollup');
            const rollupNativePath = path.join(process.cwd(), 'node_modules', 'rollup', 'dist', 'native.js');

            if (fs.existsSync(rollupNativePath)) {
                console.log('🔧 Aplicando patch no módulo Rollup...');

                // Ler o conteúdo do arquivo
                let rollupNativeContent = fs.readFileSync(rollupNativePath, 'utf8');

                // Modificar o código para evitar a falha na dependência nativa
                rollupNativeContent = rollupNativeContent.replace(
                    /try\s*{\s*nativePromise\s*=\s*Promise\.resolve\(\s*require\(modulePath\)/g,
                    'try { nativePromise = Promise.resolve(null)'
                );

                // Salvar o arquivo modificado
                fs.writeFileSync(rollupNativePath, rollupNativeContent, 'utf8');
                console.log('✅ Patch aplicado. Tentando build novamente...');

                // Tentar o build novamente
                execSync('next build', { stdio: 'inherit' });
                console.log('\n✅ Build concluído com sucesso após aplicar patch!');
            } else {
                console.error('❌ Não foi possível encontrar o arquivo do Rollup para aplicar o patch');
                process.exit(1);
            }
        } catch (patchError) {
            console.error('\n❌ Falha ao aplicar solução alternativa:', patchError.message);
            process.exit(1);
        }
    } else {
        process.exit(1);
    }
}
