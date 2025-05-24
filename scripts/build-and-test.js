/**
 * Script para compilar e testar o projeto com todas as otimizações implementadas
 * 
 * Este script:
 * 1. Limpa o cache do Next.js
 * 2. Compila o projeto com as otimizações
 * 3. Inicia o servidor em modo de produção para testes
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Cores para facilitar visualização
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m'
};

console.log(`${colors.blue}▶ Iniciando compilação otimizada do projeto Nova Ipê${colors.reset}`);
console.log(`${colors.yellow}▶ Limpando caches...${colors.reset}`);

// Limpa caches
try {
    if (fs.existsSync('./.next')) {
        execSync('npx rimraf .next', { stdio: 'inherit' });
    }
    console.log(`${colors.green}✓ Cache limpo com sucesso${colors.reset}`);
} catch (error) {
    console.error(`${colors.red}✗ Erro ao limpar cache: ${error.message}${colors.reset}`);
    process.exit(1);
}

// Garante que a pasta de ícones existe
try {
    const iconsDir = path.join(process.cwd(), 'public', 'icons');
    if (!fs.existsSync(iconsDir)) {
        fs.mkdirSync(iconsDir, { recursive: true });
        console.log(`${colors.yellow}▶ Diretório de ícones criado${colors.reset}`);
    }
} catch (error) {
    console.error(`${colors.red}✗ Erro ao verificar/criar diretório de ícones: ${error.message}${colors.reset}`);
}

console.log(`${colors.yellow}▶ Compilando projeto...${colors.reset}`);

// Compila o projeto
try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log(`${colors.green}✓ Compilação concluída com sucesso${colors.reset}`);
} catch (error) {
    console.error(`${colors.red}✗ Erro na compilação: ${error.message}${colors.reset}`);
    process.exit(1);
}

console.log(`${colors.yellow}▶ Iniciando servidor em modo de produção...${colors.reset}`);
console.log(`${colors.blue}▶ Acesse http://localhost:3000 para testar as otimizações implementadas${colors.reset}`);
console.log(`${colors.blue}▶ Para verificar a PWA, instale-a no navegador e teste o funcionamento offline${colors.reset}`);

// Inicia o servidor para testes
try {
    execSync('npm start', { stdio: 'inherit' });
} catch (error) {
    console.error(`${colors.red}✗ Erro ao iniciar o servidor: ${error.message}${colors.reset}`);
    process.exit(1);
}
