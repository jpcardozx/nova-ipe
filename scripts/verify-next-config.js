/**
 * Script para verificar e corrigir erros comuns no next.config.js
 * Especialmente focado em resolver o problema do Identifier 'path' has already been declared
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando next.config.js para resolver erros comuns...');

// Caminho para o arquivo
const nextConfigPath = path.join(process.cwd(), 'next.config.js');

// Verificar se o arquivo existe
if (!fs.existsSync(nextConfigPath)) {
    console.error('❌ Arquivo next.config.js não encontrado');
    process.exit(1);
}

// Ler o conteúdo do arquivo
let content = fs.readFileSync(nextConfigPath, 'utf8');

// 1. Verificar e corrigir duplicações do require do módulo path
const pathRequireCount = (content.match(/const path\s*=\s*require\(['"]path['"]\)/g) || []).length;

if (pathRequireCount > 1) {
    console.log('⚠️ Detectadas múltiplas declarações do módulo path');

    // Encontrar a primeira ocorrência e todas as outras
    const firstPathRequire = content.indexOf("const path = require('path')");

    if (firstPathRequire !== -1) {
        // Fazer backup do arquivo
        fs.writeFileSync(`${nextConfigPath}.bak`, content);
        console.log('✅ Backup criado em next.config.js.bak');

        // Modificar o conteúdo para manter apenas a primeira declaração
        const modifiedContent = content.replace(/const path\s*=\s*require\(['"]path['"]\)/g, (match, offset) => {
            return offset === firstPathRequire ? match : '// path já declarado acima';
        });

        fs.writeFileSync(nextConfigPath, modifiedContent);
        console.log('✅ Duplicações do módulo path corrigidas');

        // Atualizar conteúdo para as próximas verificações
        content = modifiedContent;
    }
}

// 2. Verificar se há variáveis duplicadas específicas
const checkDuplicateVar = (varName) => {
    const pattern = new RegExp(`const\\s+${varName}\\s*=`, 'g');
    const matches = content.match(pattern) || [];

    if (matches.length > 1) {
        console.log(`⚠️ Detectadas múltiplas declarações da variável ${varName}`);

        // Encontrar a primeira ocorrência
        const firstOccurrence = content.indexOf(`const ${varName} =`);

        if (firstOccurrence !== -1) {
            // Fazer backup se ainda não foi feito
            if (!fs.existsSync(`${nextConfigPath}.bak`)) {
                fs.writeFileSync(`${nextConfigPath}.bak`, fs.readFileSync(nextConfigPath));
                console.log('✅ Backup criado em next.config.js.bak');
            }

            // Modificar o conteúdo
            const modifiedContent = content.replace(new RegExp(`const\\s+${varName}\\s*=`, 'g'), (match, offset) => {
                return offset === firstOccurrence ? match : `// const ${varName} já declarado acima\nlet ${varName}Temp =`;
            });

            fs.writeFileSync(nextConfigPath, modifiedContent);
            console.log(`✅ Duplicações da variável ${varName} corrigidas`);

            // Atualizar conteúdo
            content = modifiedContent;
        }
    }
};

// Verificar algumas variáveis comuns
['nextConfig', 'webpack', 'config'].forEach(checkDuplicateVar);

// 3. Verificar se há sintaxe JavaScript inválida
try {
    require('vm').runInNewContext(content, {});
    console.log('✅ Sintaxe JavaScript válida');
} catch (error) {
    console.log(`⚠️ Possível erro de sintaxe detectado: ${error.message}`);

    // Tentar corrigir alguns erros comuns de sintaxe
    if (error.message.includes('Identifier') && error.message.includes('has already been declared')) {
        const identifier = error.message.match(/Identifier '([^']+)'/)?.[1];

        if (identifier) {
            console.log(`🔧 Tentando corrigir duplicação da variável ${identifier}...`);
            checkDuplicateVar(identifier);
        }
    }
}

// 4. Verificar e corrigir padrões específicos de resolução de caminho
if (content.includes('path.resolve')) {
    // Substituir path.resolve por strings relativas em aliases
    const aliasPattern = /config\.resolve\.alias\[['"]([^'"]+)['"]\]\s*=\s*path\.resolve\(['"]([^'"]+)['"]\)/g;

    const modifiedContent = content.replace(aliasPattern, (match, alias, resolvePath) => {
        return `config.resolve.alias['${alias}'] = '${resolvePath}'`;
    });

    if (content !== modifiedContent) {
        // Fazer backup se ainda não foi feito
        if (!fs.existsSync(`${nextConfigPath}.bak`)) {
            fs.writeFileSync(`${nextConfigPath}.bak`, fs.readFileSync(nextConfigPath));
            console.log('✅ Backup criado em next.config.js.bak');
        }

        fs.writeFileSync(nextConfigPath, modifiedContent);
        console.log('✅ Uso de path.resolve simplificado para caminhos relativos');

        // Atualizar conteúdo
        content = modifiedContent;
    }
}

console.log('🎉 Verificação e correção de next.config.js concluída!');
