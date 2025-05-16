#!/usr/bin/env node
/**
 * Script unificado para preparação de build na Vercel
 * Este script executa todas as correções necessárias em um único processo
 * para resolver o problema do limite de caracteres no buildCommand do vercel.json
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Iniciando processo de preparação para build na Vercel...');
console.log('📅 Data de execução:', new Date().toLocaleString());

// Lista de scripts de correção para executar em sequência
const fixScripts = [
    'verify-next-config.js',
    'diagnose-and-fix-paths.js',
    'fix-module-imports.js',
    'create-missing-stubs.js',
    'fix-optimized-carousel.js',
    'fix-tailwind-preflight.js'
];

// Executar cada script em sequência
let allSuccessful = true;
for (const scriptName of fixScripts) {
    const scriptPath = path.join(process.cwd(), 'scripts', scriptName);

    // Verificar se o script existe
    if (!fs.existsSync(scriptPath)) {
        console.log(`⚠️ Script ${scriptName} não encontrado, pulando...`);
        continue;
    }

    console.log(`\n📌 Executando script: ${scriptName}...`);    try {
        // Executar o script como um processo separado para capturar saída e erros
        // Usando execSync com aspas ao redor do caminho para lidar com espaços
        console.log(`Executando: node "${scriptPath}"`);
        execSync(`node "${scriptPath}"`, { 
            stdio: 'inherit',
            shell: true
        });
        
        console.log(`✅ ${scriptName} concluído com sucesso`);
    } catch (error) {
        console.error(`❌ Erro ao executar ${scriptName}:`, error);
        allSuccessful = false;
    }
}

// Relatório final
console.log('\n📊 Relatório de execução:');
if (allSuccessful) {
    console.log('✅ Todos os scripts de preparação foram executados com sucesso!');
    console.log('🚀 Pronto para executar o build do Next.js');
    process.exit(0);
} else {
    console.error('⚠️ Alguns scripts encontraram erros. O build pode falhar.');
    process.exit(1);
}
