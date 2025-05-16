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

    // Configurar .npmrc para dependências nativas
    const npmrcContent = `
legacy-peer-deps=true
force=true
canvas_skip_installation=true
canvas_binary_host_mirror=https://github.com/Automattic/node-canvas/releases/download/
update-binary=false
sharp_binary_host=https://github.com/lovell/sharp/releases/download
sharp_libvips_binary_host=https://github.com/lovell/sharp-libvips/releases/download
ignore-optional=true
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
    process.exit(1);
}
