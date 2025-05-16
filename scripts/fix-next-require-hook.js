/**
 * Monkey patch para o problema de __non_webpack_require__ no Node.js v22
 * Este script corrige o problema que aparece nos logs do Vercel:
 * "ReferenceError: __non_webpack_require__ is not defined"
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Aplicando patch para o problema de __non_webpack_require__ no Next.js...');

// Caminho para o arquivo require-hook.js no Next.js
const requireHookPath = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'server', 'require-hook.js');

if (!fs.existsSync(requireHookPath)) {
    console.log('❌ Arquivo require-hook.js não encontrado');
    process.exit(1);
}

// Criar backup do arquivo original
fs.copyFileSync(requireHookPath, `${requireHookPath}.bak`);
console.log('✅ Backup do require-hook.js criado');

// Ler o conteúdo do arquivo
let content = fs.readFileSync(requireHookPath, 'utf8');

// Verificar se contém o código problemático
if (content.includes('__non_webpack_require__')) {
    // Substituir o código problemático
    const patchedContent = content.replace(
        /let resolve = process\.env\.NEXT_MINIMAL \? __non_webpack_require__\.resolve : require\.resolve;/,
        'let resolve = require.resolve;'
    );

    // Escrever o arquivo modificado
    fs.writeFileSync(requireHookPath, patchedContent);
    console.log('✅ Patch aplicado com sucesso para resolver o problema de __non_webpack_require__');
} else {
    console.log('✅ Arquivo não contém o código problemático, nenhuma alteração necessária');
}

console.log('🎉 Patch concluído!');
