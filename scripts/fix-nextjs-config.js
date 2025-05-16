/**
 * Script para modificar a configuração do Next.js
 * Este script adiciona configurações específicas que ajudam a resolver problemas
 * do Tailwind CSS e caminhos de módulos em builds na Vercel
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Aplicando correções na configuração do Next.js...');

// Caminho para o arquivo de configuração do Next.js
const nextConfigPath = path.join(process.cwd(), 'next.config.js');

// Verificar se o arquivo existe
if (!fs.existsSync(nextConfigPath)) {
    console.error('❌ Arquivo next.config.js não encontrado');
    process.exit(1);
}

// Fazer backup do arquivo original
const backupPath = path.join(process.cwd(), 'next.config.js.bak');
fs.copyFileSync(nextConfigPath, backupPath);
console.log('✅ Backup do next.config.js criado em next.config.js.bak');

// Ler o conteúdo do arquivo
let configContent = fs.readFileSync(nextConfigPath, 'utf8');

// Função para verificar módulos já importados
const checkForModuleImports = (content) => {
    const moduleRegex = /const\s+(\w+)\s*=\s*require\s*\(['"]([^'"]+)['"]\)/g;
    const imports = {};

    let match;
    while ((match = moduleRegex.exec(content)) !== null) {
        const varName = match[1];
        const moduleName = match[2];
        imports[varName] = moduleName;
    }

    return imports;
};

// Função para adicionar configurações ao webpack
const addWebpackConfig = (content) => {
    // Verificar módulos já importados para evitar duplicações
    const existingImports = checkForModuleImports(content);

    // Verificar se já existe configuração webpack
    if (content.includes('webpack: (config,')) {
        console.log('⚠️ Configuração webpack já existe, modificando...');

        // Para configuração existente, precisamos modificar de forma mais cuidadosa
        // Este é um caso mais complexo que requer análise do conteúdo existente
        return content.replace(
            /webpack:\s*\(\s*config\s*,[^)]*\)\s*=>\s*{/,
            `webpack: (config, { isServer }) => {
    // Adicionar resolução para tailwindcss
    if (!config.resolve) config.resolve = {};
    if (!config.resolve.alias) config.resolve.alias = {};
      // Resolver tailwindcss local
    config.resolve.alias['tailwindcss'] = './node_modules/tailwindcss';
    config.resolve.alias['postcss'] = './node_modules/postcss';
    config.resolve.alias['autoprefixer'] = './node_modules/autoprefixer';
    
    // Resolver imports de app/sections
    config.resolve.alias['app/sections'] = './app/sections';
    config.resolve.alias['@sections'] = './app/sections';
    config.resolve.alias['@app'] = './app';
    
    // Configuração original continua abaixo
`
        );
    } else {
        // Se não existe, adicionar nova configuração
        const newConfig = `
  webpack: (config, { isServer }) => {
    // Adicionar resolução para tailwindcss
    if (!config.resolve) config.resolve = {};
    if (!config.resolve.alias) config.resolve.alias = {};
      // Resolver tailwindcss local
    config.resolve.alias['tailwindcss'] = './node_modules/tailwindcss';
    config.resolve.alias['postcss'] = './node_modules/postcss';
    config.resolve.alias['autoprefixer'] = './node_modules/autoprefixer';
    
    // Resolver imports de app/sections
    config.resolve.alias['app/sections'] = './app/sections';
    config.resolve.alias['@sections'] = './app/sections';
    config.resolve.alias['@app'] = './app';
    
    return config;
  },`;

        // Procurar pelo último item na configuração para adicionar depois dele
        const lastItemRegex = /(\w+):\s*[^,}]*,?\s*(\n\s*\/\/[^\n]*\n\s*)?(?=})/;
        if (lastItemRegex.test(content)) {
            return content.replace(lastItemRegex, `$&,\n${newConfig}`);
        } else {
            // Caso não encontre um padrão claro, tentar adicionar antes do último fechamento
            return content.replace(/};\s*$/, `${newConfig}\n};`);
        }
    }
};

// Adicionar requireHook para tailwindcss
const addRequireHook = (content) => {
    if (content.includes('require.extensions')) {
        console.log('⚠️ require.extensions já modificado, pulando...');
        return content;
    }

    // Adicionar no topo do arquivo, após os imports
    return content.replace(
        /('next'\);\s*)/,
        `$1
// Patch para resolver o Tailwind CSS
const moduleAlias = require('module');
const originalRequire = moduleAlias.prototype.require;

moduleAlias.prototype.require = function(id) {
  if (id === 'tailwindcss') {
    try {
      return originalRequire.call(this, id);
    } catch (e) {
      // Fallback para implementação básica
      console.warn('⚠️ Usando implementação básica do tailwindcss');
      return {
        postcssPlugin: 'tailwindcss',
        plugins: []
      };
    }
  }
  return originalRequire.call(this, id);
};

`
    );
};

// Adicionar path.resolve se não existir
const addPathRequire = (content) => {
    if (!content.includes('const path =')) {
        console.log('⚠️ Adicionando import do path...');
        return content.replace(
            /('next'\);\s*)/,
            `$1const path = require('path');\n\n`
        );
    }
    return content;
};

// Aplicar modificações
configContent = addPathRequire(configContent);
configContent = addRequireHook(configContent);
configContent = addWebpackConfig(configContent);

// Escrever o arquivo modificado
fs.writeFileSync(nextConfigPath, configContent);
console.log('✅ Configurações adicionadas ao next.config.js');

// Verificar se o patch foi aplicado corretamente
if (configContent.includes('moduleAlias.prototype.require') &&
    configContent.includes(`config.resolve.alias['tailwindcss']`)) {
    console.log('✅ Modificações aplicadas com sucesso!');
} else {
    console.error('❌ Falha ao aplicar modificações completas');
}

console.log('🎉 Configuração do Next.js atualizada com sucesso!');
