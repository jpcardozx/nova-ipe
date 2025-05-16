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
    console.log('Aplicando configurações específicas para ambiente Vercel...');

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
