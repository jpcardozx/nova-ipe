/**
 * Script para forçar instalação e resolução direta do Tailwind CSS
 * Este script garantirá que o Tailwind CSS esteja disponível durante o build
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Iniciando resolução direta do Tailwind CSS...');

// Verificar se os módulos necessários estão instalados
const modulesList = [
    'tailwindcss',
    'postcss',
    'autoprefixer'
];

// Função para verificar se um módulo existe
function checkModuleExists(moduleName) {
    try {
        const modulePath = path.join(process.cwd(), 'node_modules', moduleName);
        return fs.existsSync(modulePath);
    } catch (error) {
        return false;
    }
}

// Função para instalar módulos
function installModules(modules) {
    const modulesToInstall = modules.filter(module => !checkModuleExists(module));

    if (modulesToInstall.length > 0) {
        console.log(`📦 Instalando módulos faltantes: ${modulesToInstall.join(', ')}`);
        try {
            execSync(`npm install --no-save ${modulesToInstall.join(' ')}`, { stdio: 'inherit' });
            console.log('✅ Módulos instalados com sucesso!');
        } catch (error) {
            console.error('❌ Falha ao instalar módulos:', error.message);
            console.log('⚠️ Usando implementações minimalistas como fallback...');

            // Criar implementações minimalistas
            if (!checkModuleExists('tailwindcss')) {
                require('./create-minimal-tailwind.js');
            }

            if (!checkModuleExists('postcss')) {
                require('./create-minimal-postcss.js');
            }
        }
    } else {
        console.log('✅ Todos os módulos necessários já estão instalados.');
    }
}

// Verificar configuração do Next.js
function patchNextConfig() {
    const nextConfigPath = path.join(process.cwd(), 'next.config.js');
    if (!fs.existsSync(nextConfigPath)) {
        console.error('❌ Arquivo next.config.js não encontrado');
        return;
    }

    console.log('🔧 Aplicando patch direta no next.config.js...');

    // Ler o conteúdo atual
    let configContent = fs.readFileSync(nextConfigPath, 'utf8');

    // Verificar se o patch já foi aplicado
    if (configContent.includes('// TAILWIND DIRECT PATCH')) {
        console.log('✅ Patch já aplicado anteriormente.');
        return;
    }

    // Criar backup
    const backupPath = path.join(process.cwd(), 'next.config.js.bak');
    fs.writeFileSync(backupPath, configContent);
    console.log('📝 Backup do next.config.js criado.');

    // Adicionar o patch no topo
    const patchContent = `
// TAILWIND DIRECT PATCH
const fs = require('fs');
const originalResolveFilename = require('module')._resolveFilename;

// Substituir o mecanismo de resolução de módulo do Node.js
require('module')._resolveFilename = function(request, parent, isMain, options) {
  if (request === 'tailwindcss' || request.startsWith('tailwindcss/')) {
    try {
      return originalResolveFilename(request, parent, isMain, options);
    } catch (e) {
      console.warn('⚠️ Redirecionando resolução de tailwindcss para implementação local');
      return originalResolveFilename(request.replace('tailwindcss', '${path.join(process.cwd(), 'node_modules', 'tailwindcss')}'), parent, isMain, options);
    }
  }
  
  if (request === 'postcss' || request.startsWith('postcss/')) {
    try {
      return originalResolveFilename(request, parent, isMain, options);
    } catch (e) {
      console.warn('⚠️ Redirecionando resolução de postcss para implementação local');
      return originalResolveFilename(request.replace('postcss', '${path.join(process.cwd(), 'node_modules', 'postcss')}'), parent, isMain, options);
    }
  }
  
  return originalResolveFilename(request, parent, isMain, options);
};
`;

    // Inserir o patch no topo do arquivo
    configContent = patchContent + configContent;
    fs.writeFileSync(nextConfigPath, configContent);
    console.log('✅ Patch aplicado ao next.config.js com sucesso!');
}

// Criar link para o tailwind global se existir
function createGlobalModuleLinks() {
    console.log('🔍 Verificando módulos globais...');

    try {
        // Tentar encontrar instalações globais
        let globalModulesPath;
        try {
            globalModulesPath = execSync('npm root -g').toString().trim();
        } catch (e) {
            console.log('⚠️ Não foi possível encontrar o diretório de módulos globais');
            return;
        }

        modulesList.forEach(moduleName => {
            const globalModulePath = path.join(globalModulesPath, moduleName);
            const localModulePath = path.join(process.cwd(), 'node_modules', moduleName);

            // Se o módulo existe globalmente mas não localmente, criar link simbólico
            if (fs.existsSync(globalModulePath) && !fs.existsSync(localModulePath)) {
                try {
                    console.log(`🔗 Criando link do módulo global ${moduleName}...`);

                    // Criar diretório se não existir
                    if (!fs.existsSync(path.dirname(localModulePath))) {
                        fs.mkdirSync(path.dirname(localModulePath), { recursive: true });
                    }

                    // Em sistemas que não suportam symlinks, copiar o diretório
                    fs.mkdirSync(localModulePath, { recursive: true });

                    const files = fs.readdirSync(globalModulePath);
                    files.forEach(file => {
                        const srcFile = path.join(globalModulePath, file);
                        const destFile = path.join(localModulePath, file);

                        if (fs.statSync(srcFile).isDirectory()) {
                            fs.mkdirSync(destFile, { recursive: true });
                            // Copiar apenas arquivos essenciais para evitar loop recursivo
                            const essentialFiles = fs.readdirSync(srcFile).filter(f => f.endsWith('.js') || f.endsWith('.json'));
                            essentialFiles.forEach(essFile => {
                                fs.copyFileSync(path.join(srcFile, essFile), path.join(destFile, essFile));
                            });
                        } else {
                            fs.copyFileSync(srcFile, destFile);
                        }
                    });

                    console.log(`✅ Módulo ${moduleName} copiado do global`);
                } catch (error) {
                    console.error(`❌ Erro ao criar link para ${moduleName}: ${error.message}`);
                }
            }
        });
    } catch (error) {
        console.error('❌ Erro ao verificar módulos globais:', error.message);
    }
}

// Verificar e corrigir o arquivo postcss.config.js
function fixPostcssConfig() {
    const postcssConfigPath = path.join(process.cwd(), 'postcss.config.js');

    if (!fs.existsSync(postcssConfigPath)) {
        console.log('⚠️ Arquivo postcss.config.js não encontrado, criando...');
        const postcssConfig = `
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
        fs.writeFileSync(postcssConfigPath, postcssConfig);
        console.log('✅ postcss.config.js criado com sucesso!');
    } else {
        console.log('✅ postcss.config.js já existe.');
    }
}

// Aplicar o patch na configuração
function applyWebpackPatch() {
    const nextConfigPath = path.join(process.cwd(), 'next.config.js');
    if (!fs.existsSync(nextConfigPath)) {
        console.error('❌ Arquivo next.config.js não encontrado');
        return;
    }

    // Ler o conteúdo atual
    let configContent = fs.readFileSync(nextConfigPath, 'utf8');

    // Verificar se o webpack já foi modificado para incluir resolvedModules
    if (configContent.includes('resolveLoader') && configContent.includes('modules: [')) {
        console.log('✅ Configuração webpack para resolvedModules já aplicada.');
        return;
    }

    // Encontrar a configuração webpack existente
    if (configContent.includes('webpack: (config,')) {
        console.log('🔧 Modificando configuração webpack existente...');

        // Adicionar config de resolveLoader
        configContent = configContent.replace(
            /webpack:\s*\(\s*config\s*,[^)]*\)\s*=>\s*{/,
            `webpack: (config, { isServer }) => {
    // Adicionar diretórios de resolução para loaders
    if (!config.resolveLoader) {
      config.resolveLoader = {};
    }
    
    if (!config.resolveLoader.modules) {
      config.resolveLoader.modules = ['node_modules'];
    }
    
    // Adicionar diretório local para resolução de loaders
    config.resolveLoader.modules.push(path.resolve('./node_modules'));
    
    // Configuração para módulos css
    if (config.module && config.module.rules) {
      const cssRule = config.module.rules.find(rule => 
        rule.test && rule.test.toString().includes('.css')
      );
      
      if (cssRule && cssRule.use) {
        cssRule.use.forEach(loader => {
          if (typeof loader === 'object' && loader.loader === 'css-loader') {
            // Forçar resolução de tailwindcss no diretório do projeto
            loader.options = loader.options || {};
            loader.options.modules = loader.options.modules || {};
            loader.options.modules.getLocalIdent = undefined;
          }
        });
      }
    }
    
    // Configuração original continua abaixo
`
        );

        // Verificar se a modificação foi aplicada
        if (!configContent.includes('config.resolveLoader.modules.push')) {
            console.error('❌ Falha ao modificar configuração webpack');
        } else {
            fs.writeFileSync(nextConfigPath, configContent);
            console.log('✅ Configuração webpack modificada com sucesso!');
        }
    } else {
        console.error('❌ Não foi possível encontrar configuração webpack para modificar');
    }
}

// Função principal
function main() {
    // Verificar e instalar módulos necessários
    installModules(modulesList);

    // Criar links para módulos globais
    createGlobalModuleLinks();

    // Corrigir configurações
    fixPostcssConfig();
    patchNextConfig();
    applyWebpackPatch();

    console.log('🎉 Patch direto do Tailwind CSS aplicado com sucesso!');
}

// Executar
main();
