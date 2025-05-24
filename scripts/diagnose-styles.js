// scripts/diagnose-styles.js
/**
 * Este script analisa os problemas de estilo no projeto Nova Ipê
 * e sugere correções para problemas comuns.
 */

const fs = require('fs');
const path = require('path');
// Usando cores nativas do terminal em vez de chalk
const colors = {
    cyan: (text) => `\x1b[36m${text}\x1b[0m`,
    green: (text) => `\x1b[32m${text}\x1b[0m`,
    yellow: (text) => `\x1b[33m${text}\x1b[0m`,
    red: (text) => `\x1b[31m${text}\x1b[0m`,
    blue: (text) => `\x1b[34m${text}\x1b[0m`
};

console.log(colors.cyan('\n📊 DIAGNÓSTICO DE ESTILOS - NOVA IPÊ'));
console.log(colors.cyan('=======================================\n'));

// Verificar arquivos CSS críticos
const cssFiles = [
    'app/styles/critical/critical.css',
    'app/styles/cls-optimizations.css',
    'app/styles/tailwind-compat.css',
    'app/cls-prevention.css',
    'app/globals.css'
];

const rootDir = path.join(__dirname, '..');

// Verificação dos arquivos CSS
console.log(chalk.yellow('📁 Verificando arquivos CSS importantes:'));
let allCssFilesExist = true;
cssFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    const exists = fs.existsSync(filePath);

    if (exists) {
        console.log(chalk.green(`✅ Encontrado: ${file}`));
    } else {
        console.log(chalk.red(`❌ Faltando: ${file}`));
        allCssFilesExist = false;
    }
});

// Verificar importações em globals.css
const globalsPath = path.join(rootDir, 'app/globals.css');
if (fs.existsSync(globalsPath)) {
    const content = fs.readFileSync(globalsPath, 'utf8');
    console.log(chalk.yellow('\n📝 Analisando importações em globals.css:'));

    // Verificar importações
    const importChecks = [
        { pattern: '@import "styles/critical/critical.css"', desc: 'critical.css' },
        { pattern: '@import "styles/cls-optimizations.css"', desc: 'cls-optimizations.css' },
        { pattern: '@import "styles/tailwind-compat.css"', desc: 'tailwind-compat.css' },
        { pattern: '@import "./cls-prevention.css"', desc: 'cls-prevention.css' },
    ];

    importChecks.forEach(check => {
        if (content.includes(check.pattern)) {
            console.log(chalk.green(`✅ Importação encontrada: ${check.desc}`));
        } else {
            console.log(chalk.red(`❌ Importação faltando: ${check.desc}`));
        }
    });
}

// Verificar mapImovelToClient para inconsistências
console.log(chalk.yellow('\n🔄 Verificando mapImovelToClient:'));

const mapperFiles = [
    'lib/mapImovelToClient.ts',
    'core/mapImovelToClient.ts'
];

const mapperContents = {};
mapperFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
        console.log(chalk.green(`✅ Encontrado: ${file}`));
        mapperContents[file] = fs.readFileSync(filePath, 'utf8');
    } else {
        console.log(chalk.red(`❌ Faltando: ${file}`));
    }
});

// Verificar inconsistências
if (Object.keys(mapperContents).length === 2) {
    console.log(chalk.yellow('\n🔍 Analisando consistência entre mappers:'));

    // Análise simples para detectar padrões diferentes
    const file1 = mapperContents[mapperFiles[0]];
    const file2 = mapperContents[mapperFiles[1]];

    // Detectar interface/tipo
    const interfaceMatch1 = file1.match(/interface\s+(\w+)|type\s+(\w+)\s*=/g);
    const interfaceMatch2 = file2.match(/interface\s+(\w+)|type\s+(\w+)\s*=/g);

    if (interfaceMatch1?.join() !== interfaceMatch2?.join()) {
        console.log(chalk.red('❌ Interfaces diferentes detectadas nos mappers'));
    } else {
        console.log(chalk.green('✅ Interfaces parecem consistentes'));
    }

    // Verificar campos de imagem
    const imageFields1 = file1.match(/imagem[^\s{:]+/g) || [];
    const imageFields2 = file2.match(/imagem[^\s{:]+/g) || [];

    const commonFields = imageFields1.filter(f => imageFields2.includes(f));
    console.log(chalk.blue(`ℹ️ Campos de imagem comuns: ${commonFields.length}`));
    console.log(chalk.blue(`ℹ️ Campos de imagem diferentes: ${imageFields1.length + imageFields2.length - 2 * commonFields.length}`));
}

// Resultados finais
console.log(chalk.cyan('\n📊 RESUMO DO DIAGNÓSTICO'));
console.log(chalk.cyan('======================\n'));

if (allCssFilesExist) {
    console.log(chalk.green('✅ Todos os arquivos CSS necessários estão presentes'));
} else {
    console.log(chalk.red('❌ Há arquivos CSS faltando - verifique o relatório acima'));

    console.log(chalk.yellow('\n💡 Sugestão: Execute o comando abaixo para criar os arquivos CSS faltantes:'));
    console.log('node scripts/create-missing-css.js');
}

console.log('\n' + chalk.cyan('📋 Para resolver problemas de mapeamento de imóveis:'));
console.log('1. Verifique se os dois arquivos mapImovelToClient.ts têm interfaces consistentes');
console.log('2. Certifique-se de que o campo "imagem" está tratado da mesma forma em ambos');
console.log('3. Verifique se as URLs de imagens estão sendo extraídas corretamente');

console.log('\n' + chalk.green('✨ Diagnóstico concluído!'));
