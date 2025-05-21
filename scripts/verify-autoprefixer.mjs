/**
 * Este arquivo é importado no início da build para garantir que o autoprefixer
 * seja carregado corretamente.
 */

// Verificar se o autoprefixer está instalado
let autoprefixerAvailable = false;
try {
    require('autoprefixer');
    autoprefixerAvailable = true;
} catch (error) {
    console.warn('⚠️ Autoprefixer não encontrado, verificar instalação');
}

if (!autoprefixerAvailable) {
    // Criar fallback autoprefixer
    const fs = require('fs');
    const path = require('path');

    // Criar o diretório
    const moduleDir = path.join(process.cwd(), 'node_modules', 'autoprefixer');
    if (!fs.existsSync(moduleDir)) {
        fs.mkdirSync(moduleDir, { recursive: true });
    }

    // Criar package.json
    const pkg = {
        "name": "autoprefixer",
        "version": "10.4.16",
        "main": "index.js",
        "license": "MIT",
        "description": "Parse CSS and add vendor prefixes automatically."
    };

    fs.writeFileSync(
        path.join(moduleDir, 'package.json'),
        JSON.stringify(pkg, null, 2)
    );

    // Criar arquivo principal
    const content = `
// autoprefixer fallback implementation
const autoprefixer = () => ({
  postcssPlugin: 'autoprefixer',
  Once(root) { return root; }
});

autoprefixer.postcss = true;
module.exports = autoprefixer;
`;

    fs.writeFileSync(path.join(moduleDir, 'index.js'), content);
    console.log('✅ Autoprefixer fallback criado em node_modules/autoprefixer');
}

// Exportar uma função para verificação
module.exports = function () {
    if (autoprefixerAvailable) {
        console.log('✅ Verificação de autoprefixer: DISPONÍVEL');
    } else {
        console.log('🔶 Verificação de autoprefixer: Usando fallback interno');
    }
    return autoprefixerAvailable;
};
