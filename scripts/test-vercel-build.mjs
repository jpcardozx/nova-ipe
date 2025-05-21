#!/usr/bin/env node

/**
 * Script para simular o build no ambiente do Vercel
 * Verifica se as correções aplicadas funcionam corretamente
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Cores para o console
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

console.log(`${colors.cyan}Simulando ambiente do Vercel para testar build${colors.reset}\n`);

// Simular ambiente Vercel 
process.env.VERCEL = '1';
process.env.NODE_ENV = 'production';

/**
 * Limpa a pasta .next se existir
 */
const cleanNextFolder = () => {
    const nextFolder = path.join(__dirname, '.next');
    if (fs.existsSync(nextFolder)) {
        console.log(`${colors.yellow}Limpando pasta .next...${colors.reset}`);
        try {
            fs.rmSync(nextFolder, { recursive: true, force: true });
            console.log(`${colors.green}Pasta .next removida com sucesso.${colors.reset}\n`);
        } catch (err) {
            console.error(`${colors.red}Erro ao remover pasta .next:${colors.reset}`, err);
        }
    }
};

/**
 * Executa um comando e retorna se foi bem-sucedido
 */
const runCommand = (command, label) => {
    console.log(`${colors.cyan}Executando: ${label}...${colors.reset}`);
    try {
        execSync(command, { stdio: 'inherit' });
        console.log(`${colors.green}✓ ${label} completado com sucesso!${colors.reset}\n`);
        return true;
    } catch (err) {
        console.error(`${colors.red}✗ Erro ao executar ${label}:${colors.reset}`, err.message);
        return false;
    }
};

// Principais etapas do processo de build
const steps = [
    {
        command: 'node -e "console.log(\'Verificando ambiente Node.js:\', process.version)"',
        label: 'Verificação do ambiente Node.js'
    },
    {
        command: 'npm run generate-og-images',
        label: 'Geração de imagens OG de fallback'
    },
    {
        command: 'npm run build:production',
        label: 'Build de produção'
    }
];

// Limpa ambiente antes de começar
cleanNextFolder();

// Executa os passos do build sequencialmente
let allSuccessful = true;
for (const step of steps) {
    const success = runCommand(step.command, step.label);
    if (!success) {
        allSuccessful = false;
        break;
    }
}

// Resultado final
if (allSuccessful) {
    console.log(`${colors.green}✓ Build simulado concluído com sucesso!${colors.reset}`);
    console.log(`${colors.cyan}O projeto deve ser compatível com o ambiente Vercel.${colors.reset}`);
} else {
    console.log(`${colors.red}✗ O build falhou. Corrija os erros antes de fazer deploy.${colors.reset}`);
}
