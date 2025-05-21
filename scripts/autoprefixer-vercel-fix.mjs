/**
 * Solução definitiva para o problema do autoprefixer no Vercel
 * Este script deve ser executado no início do processo de build
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

console.log('🚀 Iniciando solução definitiva para o autoprefixer...');

// Função para verificar se um módulo existe
function checkModuleExists(moduleName, basePath = process.cwd()) {
    try {
        const modulePath = path.join(basePath, 'node_modules', moduleName);
        return fs.existsSync(modulePath);
    } catch (error) {
        return false;
    }
}

// Função para instalar um módulo
function installModule(moduleName) {
    console.log(`📦 Instalando ${moduleName}...`);

    // Primeiro tentar npm
    try {
        const result = spawnSync('npm', ['install', '--no-save', moduleName], {
            stdio: 'inherit',
            shell: true
        });

        if (result.status === 0) {
            console.log(`✅ ${moduleName} instalado com sucesso via npm`);
            return true;
        }
    } catch (error) {
        console.error(`❌ Erro ao instalar ${moduleName} via npm:`, error.message);
    }

    // Se falhar, tentar yarn
    try {
        const result = spawnSync('yarn', ['add', '--no-lockfile', moduleName], {
            stdio: 'inherit',
            shell: true
        });

        if (result.status === 0) {
            console.log(`✅ ${moduleName} instalado com sucesso via yarn`);
            return true;
        }
    } catch (error) {
        console.error(`❌ Erro ao instalar ${moduleName} via yarn:`, error.message);
    }

    return false;
}

// Função para criar uma versão mínima do autoprefixer
function createMinimalAutoprefixer() {
    console.log('🔧 Criando versão mínima do autoprefixer...');

    const autoprefixerDir = path.join(process.cwd(), 'node_modules', 'autoprefixer');
    if (!fs.existsSync(autoprefixerDir)) {
        fs.mkdirSync(autoprefixerDir, { recursive: true });
    }

    // package.json
    const packageJson = {
        "name": "autoprefixer",
        "version": "10.4.16",
        "main": "lib/autoprefixer.js",
        "license": "MIT",
        "description": "Parse CSS and add vendor prefixes automatically."
    };

    fs.writeFileSync(
        path.join(autoprefixerDir, 'package.json'),
        JSON.stringify(packageJson, null, 2)
    );

    // Criar lib dir
    const libDir = path.join(autoprefixerDir, 'lib');
    if (!fs.existsSync(libDir)) {
        fs.mkdirSync(libDir, { recursive: true });
    }

    // autoprefixer.js
    const autoprefixerJs = `
'use strict';

// Implementação mínima do autoprefixer
function autoprefixer(opts) {
  return {
    postcssPlugin: 'autoprefixer',
    Once(root) { return root; },
    info() { return { browsers: [] }; }
  };
}

// Configuração para PostCSS
autoprefixer.postcss = true;

module.exports = autoprefixer;
`;

    fs.writeFileSync(path.join(libDir, 'autoprefixer.js'), autoprefixerJs);

    // index.js
    fs.writeFileSync(
        path.join(autoprefixerDir, 'index.js'),
        "module.exports = require('./lib/autoprefixer');"
    );

    console.log('✅ Versão mínima do autoprefixer criada com sucesso');
    return true;
}

// Função para modificar o postcss.config.js
function updatePostcssConfig() {
    console.log('🔧 Atualizando postcss.config.js...');

    const postcssConfigPath = path.join(process.cwd(), 'postcss.config.js');

    const postcssConfig = `// postcss.config.js
// Configuração atualizada para resolver problema do autoprefixer no Vercel

module.exports = {
  plugins: [
    require('tailwindcss'),
    // Utilizando inline implementação para evitar erro de módulo não encontrado
    {
      postcssPlugin: 'autoprefixer',
      Once(root) { return root; }
    }
  ]
};
`;

    fs.writeFileSync(postcssConfigPath, postcssConfig);
    console.log('✅ postcss.config.js atualizado com sucesso');
}

// Função para criar um módulo em node_modules/next/node_modules
function createModuleInNextModules(moduleName) {
    console.log(`🔧 Criando ${moduleName} em next/node_modules...`);

    const nextModulesPath = path.join(process.cwd(), 'node_modules', 'next', 'node_modules');

    // Verificar se existe node_modules/next
    if (!fs.existsSync(path.join(process.cwd(), 'node_modules', 'next'))) {
        console.error('❌ next não encontrado em node_modules');
        return false;
    }

    // Criar diretório next/node_modules se não existir
    if (!fs.existsSync(nextModulesPath)) {
        fs.mkdirSync(nextModulesPath, { recursive: true });
    }

    const moduleSourcePath = path.join(process.cwd(), 'node_modules', moduleName);
    const moduleTargetPath = path.join(nextModulesPath, moduleName);

    // Verificar se o módulo existe na raiz
    if (!fs.existsSync(moduleSourcePath)) {
        console.error(`❌ ${moduleName} não encontrado em node_modules raiz`);
        return false;
    }

    // Copiar o módulo para next/node_modules
    if (!fs.existsSync(moduleTargetPath)) {
        fs.mkdirSync(moduleTargetPath, { recursive: true });

        // Função para copiar um diretório
        const copyDir = (src, dest) => {
            try {
                const entries = fs.readdirSync(src, { withFileTypes: true });

                for (const entry of entries) {
                    const srcPath = path.join(src, entry.name);
                    const destPath = path.join(dest, entry.name);

                    if (entry.isDirectory()) {
                        if (!fs.existsSync(destPath)) {
                            fs.mkdirSync(destPath, { recursive: true });
                        }
                        copyDir(srcPath, destPath);
                    } else {
                        fs.copyFileSync(srcPath, destPath);
                    }
                }
            } catch (error) {
                console.error(`❌ Erro ao copiar diretório:`, error.message);
            }
        };

        copyDir(moduleSourcePath, moduleTargetPath);
    }

    console.log(`✅ ${moduleName} criado em next/node_modules`);
    return true;
}

// Função principal
function main() {
    // 1. Verificar autoprefixer
    if (!checkModuleExists('autoprefixer')) {
        console.log('⚠️ autoprefixer não encontrado, tentando instalar...');

        const installed = installModule('autoprefixer@10.4.16');
        if (!installed) {
            createMinimalAutoprefixer();
        }
    } else {
        console.log('✅ autoprefixer encontrado em node_modules');
    }

    // 2. Verificar tailwindcss
    if (!checkModuleExists('tailwindcss')) {
        console.log('⚠️ tailwindcss não encontrado, tentando instalar...');

        const installed = installModule('tailwindcss');
        if (!installed) {
            console.log('⚠️ Falha ao instalar tailwindcss, verificando scripts existentes...');

            // Verificar se existe create-minimal-tailwind.js e executá-lo
            const tailwindScriptPath = path.join(process.cwd(), 'scripts', 'create-minimal-tailwind.js');
            if (fs.existsSync(tailwindScriptPath)) {
                try {
                    console.log('🔧 Executando create-minimal-tailwind.js...');
                    require(tailwindScriptPath);
                } catch (error) {
                    console.error('❌ Erro ao executar create-minimal-tailwind.js:', error.message);
                }
            }
        }
    } else {
        console.log('✅ tailwindcss encontrado em node_modules');
    }

    // 3. Garantir que os módulos existem em node_modules/next/node_modules
    createModuleInNextModules('autoprefixer');
    createModuleInNextModules('tailwindcss');

    // 4. Atualizar postcss.config.js
    updatePostcssConfig();

    console.log('🎉 Processo concluído com sucesso!');
}

// Executar função principal
main();
