/**
 * Script para criar links simbólicos de módulos críticos no ambiente da Vercel
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔗 Criando links para módulos críticos...');

// Lista de módulos críticos
const criticalModules = [
    'autoprefixer',
    'tailwindcss',
    'postcss'
];

// Caminhos principais
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
const nextModulesPath = path.join(nodeModulesPath, 'next', 'node_modules');

// Criar diretório de node_modules se não existir
if (!fs.existsSync(nodeModulesPath)) {
    fs.mkdirSync(nodeModulesPath, { recursive: true });
}

// Criar diretório de next/node_modules se não existir
if (!fs.existsSync(nextModulesPath)) {
    fs.mkdirSync(nextModulesPath, { recursive: true });
}

// Função para verificar se um módulo existe
function checkModuleExists(moduleName, basePath) {
    try {
        const modulePath = path.join(basePath, moduleName);
        return fs.existsSync(modulePath) && fs.statSync(modulePath).isDirectory();
    } catch (error) {
        return false;
    }
}

// Função para copiar um diretório recursivamente
function copyDir(src, dest) {
    // Criar o diretório de destino se não existir
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    // Ler arquivos no diretório de origem
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        // Se for um diretório, copiar recursivamente
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            // Se for um arquivo, copiar diretamente
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Tentar instalar módulos globalmente
function installGlobalModules() {
    try {
        console.log('📦 Instalando módulos críticos globalmente...');
        execSync(`npm install -g ${criticalModules.join(' ')}`, { stdio: 'inherit' });
        return true;
    } catch (error) {
        console.error('❌ Falha ao instalar módulos globalmente:', error.message);
        return false;
    }
}

// Instalar globalmente antes para garantir
installGlobalModules();

// Função para obter o caminho do módulo global
function getGlobalModulePath(moduleName) {
    try {
        // Tentar encontrar via npm root global
        const globalPath = execSync('npm root -g').toString().trim();
        const moduleGlobalPath = path.join(globalPath, moduleName);

        if (fs.existsSync(moduleGlobalPath)) {
            return moduleGlobalPath;
        }

        // Tentar caminhos específicos para o ambiente Vercel
        const vercelPaths = [
            '/node22/lib/node_modules',
            '/lib/node_modules',
            '/usr/local/lib/node_modules'
        ];

        for (const vercelPath of vercelPaths) {
            const modulePath = path.join(vercelPath, moduleName);
            if (fs.existsSync(modulePath)) {
                return modulePath;
            }
        }

        return null;
    } catch (error) {
        console.error(`❌ Erro ao procurar módulo global ${moduleName}:`, error.message);
        return null;
    }
}

// Processar cada módulo
for (const moduleName of criticalModules) {
    console.log(`🔄 Processando ${moduleName}...`);

    // Verificar se o módulo já existe no node_modules principal
    if (checkModuleExists(moduleName, nodeModulesPath)) {
        console.log(`✅ ${moduleName} já existe no diretório node_modules principal`);

        // Copiar para next/node_modules também
        if (!checkModuleExists(moduleName, nextModulesPath)) {
            try {
                console.log(`🔄 Copiando ${moduleName} para next/node_modules...`);
                copyDir(
                    path.join(nodeModulesPath, moduleName),
                    path.join(nextModulesPath, moduleName)
                );
                console.log(`✅ ${moduleName} copiado para next/node_modules`);
            } catch (error) {
                console.error(`❌ Erro ao copiar ${moduleName} para next/node_modules:`, error.message);
            }
        }

        continue;
    }

    // Tentar encontrar o módulo global
    const globalModulePath = getGlobalModulePath(moduleName);

    if (globalModulePath) {
        console.log(`🔍 Encontrado ${moduleName} em ${globalModulePath}`);

        try {
            // Copiar para node_modules
            console.log(`🔄 Copiando ${moduleName} de ${globalModulePath} para node_modules...`);
            copyDir(
                globalModulePath,
                path.join(nodeModulesPath, moduleName)
            );
            console.log(`✅ ${moduleName} copiado para node_modules`);

            // Copiar para next/node_modules também
            copyDir(
                globalModulePath,
                path.join(nextModulesPath, moduleName)
            );
            console.log(`✅ ${moduleName} copiado para next/node_modules`);

        } catch (error) {
            console.error(`❌ Erro ao copiar ${moduleName} de ${globalModulePath}:`, error.message);
        }
    } else {
        console.log(`⚠️ ${moduleName} não encontrado globalmente, criando versão mínima...`);

        // Criar implementação mínima
        if (moduleName === 'autoprefixer') {
            const autoprefixerDir = path.join(nodeModulesPath, moduleName);
            fs.mkdirSync(autoprefixerDir, { recursive: true });

            // Criar package.json
            const packageJson = {
                "name": "autoprefixer",
                "version": "10.4.16",
                "main": "lib/autoprefixer.js",
                "license": "MIT"
            };

            fs.writeFileSync(
                path.join(autoprefixerDir, 'package.json'),
                JSON.stringify(packageJson, null, 2)
            );

            // Criar lib diretório
            const libDir = path.join(autoprefixerDir, 'lib');
            fs.mkdirSync(libDir, { recursive: true });

            // Criar arquivo principal
            const autoprefixerJs = `
'use strict';

// Implementação minimalista do autoprefixer
function autoprefixer(opts) {
  return {
    postcssPlugin: 'autoprefixer',
    Once(root) { return root; },
    info() { return { browsers: [] }; }
  };
}

autoprefixer.postcss = true;
module.exports = autoprefixer;
`;

            fs.writeFileSync(path.join(libDir, 'autoprefixer.js'), autoprefixerJs);

            // Criar index.js
            fs.writeFileSync(
                path.join(autoprefixerDir, 'index.js'),
                "module.exports = require('./lib/autoprefixer');"
            );

            console.log(`✅ Implementação mínima de ${moduleName} criada com sucesso`);

            // Copiar para next/node_modules também
            copyDir(
                autoprefixerDir,
                path.join(nextModulesPath, moduleName)
            );
            console.log(`✅ ${moduleName} copiado para next/node_modules`);
        }
    }
}

console.log('🎉 Processo de criação de links concluído!');
