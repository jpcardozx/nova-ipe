#!/usr/bin/env node

/**
 * Script para facilitar implantação na Vercel
 * Este script automatiza o processo de deploy na Vercel
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Cores para console
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

console.log(`\n${colors.cyan}=== DEPLOY AUTOMATIZADO NOVA IPÊ PARA VERCEL ===${colors.reset}\n`);

// Verifica diretório
if (!fs.existsSync('./vercel.json')) {
    console.error(`${colors.red}Erro: Execute na raiz do projeto${colors.reset}`);
    process.exit(1);
}

// Executa comandos com tratamento de erro
function execCommand(command, description) {
    console.log(`\n${colors.yellow}> ${description}...${colors.reset}`);
    try {
        const output = execSync(command, { encoding: 'utf8' });
        console.log(`${colors.green}✓ Sucesso!${colors.reset}`);
        return { success: true, output };
    } catch (error) {
        console.error(`${colors.red}✗ Falha: ${error.message}${colors.reset}`);
        return { success: false, error };
    }
}

// 1. Preparação
execCommand('npm install --force', 'Instalando dependências');
execCommand('node scripts/fallback-og-images.js', 'Criando imagens OG de fallback');

// 2. Build local para testar
const buildResult = execCommand('npm run build', 'Testando build localmente');
if (!buildResult.success) {
    console.error(`${colors.red}Erro no build local. Corrigindo problemas...${colors.reset}`);
    execCommand('npm install --no-optional', 'Instalando sem dependências opcionais');
    execCommand('npm run build', 'Tentando build novamente');
}

// 3. Login e deploy
console.log(`\n${colors.yellow}> Verificando acesso à Vercel...${colors.reset}`);
execCommand('vercel whoami || vercel login', 'Verificando login na Vercel');

// 4. Deploy para produção
console.log(`\n${colors.cyan}=== INICIANDO DEPLOY NA VERCEL ===${colors.reset}`);
console.log(`${colors.yellow}Este processo pode levar alguns minutos...${colors.reset}\n`);

const deployResult = execCommand('vercel --prod', 'Realizando deploy na Vercel');

// 5. Resultado
if (deployResult.success) {
    console.log(`\n${colors.green}==============================================${colors.reset}`);
    console.log(`${colors.green}✓ Deploy realizado com sucesso!${colors.reset}`);
    console.log(`${colors.green}==============================================${colors.reset}\n`);
    console.log(`${colors.cyan}Acesse o painel: https://vercel.com/dashboard${colors.reset}\n`);
} else {
    console.log(`\n${colors.red}==============================================${colors.reset}`);
    console.log(`${colors.red}✗ Falha no deploy. Veja os erros acima.${colors.reset}`);
    console.log(`${colors.red}==============================================${colors.reset}\n`);
}
