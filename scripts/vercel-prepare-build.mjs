/**
 * Script unificado para preparação de build na Vercel
 * Este script executa todas as correções necessárias em um único processo
 * para resolver o problema do limite de caracteres no buildCommand
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('ðŸš€ Iniciando processo de preparaÃ§Ã£o para build na Vercel...');
console.log('ðŸ“… Data de execuÃ§Ã£o:', new Date().toLocaleString());

// Lista de scripts de correÃ§Ã£o para executar em sequÃªncia
const fixScripts = [
    'setup-ts-config.js',
    'verify-next-config.js',
    'diagnose-and-fix-paths.js',
    'fix-module-imports.js',
    'create-missing-stubs.js',
    'fix-optimized-carousel.js',
    'fix-tailwind-preflight.js',
    'create-tailwind-stubs.js'
];

// Executar cada script em sequÃªncia
let allSuccessful = true;
for (const scriptName of fixScripts) {
    const scriptPath = path.join(process.cwd(), 'scripts', scriptName);

    // Verificar se o script existe
    if (!fs.existsSync(scriptPath)) {
        console.log(`âš ï¸ Script ${scriptName} nÃ£o encontrado, pulando...`);
        continue;
    }

    console.log(`\nðŸ“Œ Executando script: ${scriptName}...`); try {
        // Executar o script como um processo separado para capturar saÃ­da e erros
        // Usando execSync com aspas ao redor do caminho para lidar com espaÃ§os
        console.log(`Executando: node "${scriptPath}"`);
        execSync(`node "${scriptPath}"`, {
            stdio: 'inherit',
            shell: true
        });

        console.log(`âœ… ${scriptName} concluÃ­do com sucesso`);
    } catch (error) {
        console.error(`âŒ Erro ao executar ${scriptName}:`, error);
        allSuccessful = false;
    }
}

// RelatÃ³rio final
console.log('\nðŸ“Š RelatÃ³rio de execuÃ§Ã£o:');
if (allSuccessful) {
    console.log('âœ… Todos os scripts de preparaÃ§Ã£o foram executados com sucesso!');
    console.log('ðŸš€ Pronto para executar o build do Next.js');
    process.exit(0);
} else {
    console.error('âš ï¸ Alguns scripts encontraram erros. O build pode falhar.');
    process.exit(1);
}

