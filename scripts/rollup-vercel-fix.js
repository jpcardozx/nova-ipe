/**
 * Script para resolver problema específico da dependência do Rollup na Vercel
 * Este script deve ser executado antes do build no ambiente da Vercel
 * 
 * Problema: Error: Cannot find module @rollup/rollup-linux-x64-gnu
 * Causa: Bug do npm com dependências opcionais (https://github.com/npm/cli/issues/4828)
 * Solução: Criar um arquivo de mock para a dependência nativa
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Rollup Fix: Iniciando correção para bug do Rollup na Vercel...');

function fixRollupNativeModule() {
    const rollupNativePath = path.join(process.cwd(), 'node_modules', 'rollup', 'dist', 'native.js');

    // Verificar se o arquivo existe
    if (!fs.existsSync(rollupNativePath)) {
        console.log('⚠️ Rollup Fix: O arquivo native.js não foi encontrado. Pulando correção.');
        return false;
    }

    try {
        // Ler o arquivo original
        const content = fs.readFileSync(rollupNativePath, 'utf8');

        // Backup do arquivo original
        fs.writeFileSync(`${rollupNativePath}.bak`, content, 'utf8');
        console.log('✅ Rollup Fix: Backup do arquivo original criado');

        // Criar versão modificada sem a dependência que causa erro
        const modifiedContent = content
            .replace(
                /try\s*{\s*nativePromise\s*=\s*Promise\.resolve\(\s*require\(modulePath\)\s*\)/g,
                'try { nativePromise = Promise.resolve(null)'
            )
            .replace(
                /requireWithFriendlyError\s*\(\s*modulePath\s*\)/g,
                'null /* Bypassed by rollup-vercel-fix.js */'
            );

        // Salvar versão modificada
        fs.writeFileSync(rollupNativePath, modifiedContent, 'utf8');
        console.log('✅ Rollup Fix: Arquivo patched para evitar erro na Vercel');

        return true;
    } catch (err) {
        console.error('❌ Rollup Fix: Erro ao aplicar patch:', err);
        return false;
    }
}

function createMockModules() {
    // Lista de módulos nativos que precisam de mock
    const modulesToMock = [
        '@rollup/rollup-linux-x64-gnu',
        '@rollup/rollup-linux-x64-musl'
    ];

    for (const moduleName of modulesToMock) {
        try {
            const moduleDir = path.join(process.cwd(), 'node_modules', moduleName);

            // Criar diretório se não existir
            if (!fs.existsSync(moduleDir)) {
                fs.mkdirSync(moduleDir, { recursive: true });
                console.log(`✅ Rollup Fix: Diretório criado para ${moduleName}`);
            }

            // Criar arquivo index.js de mock
            const indexPath = path.join(moduleDir, 'index.js');
            fs.writeFileSync(indexPath, `
// Mock module para ${moduleName}
// Criado automaticamente para resolver o bug do npm com dependências opcionais
// https://github.com/npm/cli/issues/4828
module.exports = null;
`, 'utf8');
            console.log(`✅ Rollup Fix: Mock criado para ${moduleName}`);

            // Criar package.json de mock
            const packagePath = path.join(moduleDir, 'package.json');
            fs.writeFileSync(packagePath, JSON.stringify({
                name: moduleName,
                version: '4.14.0',
                description: 'Mock package to fix Vercel build issues',
                main: 'index.js'
            }, null, 2), 'utf8');

        } catch (err) {
            console.error(`❌ Rollup Fix: Erro ao criar mock para ${moduleName}:`, err);
        }
    }
}

// Executar funções para resolver o problema
fixRollupNativeModule();
createMockModules();

console.log('✅ Rollup Fix: Correção concluída!');
