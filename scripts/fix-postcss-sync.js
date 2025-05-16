/**
 * Script para garantir compatibilidade do PostCSS e Tailwind CSS no build de produção do Vercel
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Verificando e corrigindo instalações do PostCSS e Tailwind CSS...');

// Versões específicas a serem instaladas
const POSTCSS_VERSION = '8.4.35';
const TAILWIND_VERSION = '3.3.5';
const AUTOPREFIXER_VERSION = '10.4.16';

// Execute o script de correção do nesting plugin antes de continuar
require('./fix-tailwind-nesting.js');

// Função para verificar e instalar pacotes nas versões exatas
function ensurePackageInstalled(packageName, version) {
    try {
        const packagePath = path.join(process.cwd(), 'node_modules', packageName);
        let needsInstall = false;

        // Verifica se o módulo existe
        if (!fs.existsSync(packagePath)) {
            console.log(`📦 Módulo ${packageName} não encontrado. Instalando...`);
            needsInstall = true;
        } else {
            // Verifica a versão instalada
            try {
                const packageJsonPath = path.join(packagePath, 'package.json');
                const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
                if (packageData.version !== version) {
                    console.log(`📦 Versão instalada de ${packageName}: ${packageData.version}, atualizando para ${version}...`);
                    needsInstall = true;
                } else {
                    console.log(`✅ ${packageName}@${version} já está instalado corretamente.`);
                }
            } catch (readError) {
                console.log(`⚠️ Não foi possível verificar a versão de ${packageName}, reinstalando...`);
                needsInstall = true;
            }
        }

        // Instala o pacote se necessário
        if (needsInstall) {
            execSync(`npm install ${packageName}@${version} --save-exact --no-save`, { stdio: 'inherit' });
            console.log(`✅ ${packageName}@${version} instalado com sucesso!`);
        }

        return true;
    } catch (error) {
        console.error(`❌ Erro ao instalar ${packageName}@${version}:`, error.message);
        return false;
    }
}

// Garantir que os pacotes estejam instalados nas versões corretas
ensurePackageInstalled('postcss', POSTCSS_VERSION);
ensurePackageInstalled('tailwindcss', TAILWIND_VERSION);
ensurePackageInstalled('autoprefixer', AUTOPREFIXER_VERSION);

// Verificar se existem links para os módulos no diretório do Next.js para resolver problemas de resolução
function createModuleSymlink(moduleName) {
    const sourceDir = path.join(process.cwd(), 'node_modules', moduleName);
    const targetDir = path.join(process.cwd(), 'node_modules', 'next', 'node_modules', moduleName);

    if (!fs.existsSync(sourceDir)) {
        console.log(`⚠️ Módulo fonte ${moduleName} não encontrado, pulando link simbólico.`);
        return;
    }

    // Criar diretório pai se necessário
    const nextModulesDir = path.join(process.cwd(), 'node_modules', 'next', 'node_modules');
    if (!fs.existsSync(nextModulesDir)) {
        try {
            fs.mkdirSync(nextModulesDir, { recursive: true });
        } catch (err) {
            console.log(`⚠️ Não foi possível criar ${nextModulesDir}, pulando link simbólico.`);
            return;
        }
    }

    // Remover qualquer versão existente no destino
    if (fs.existsSync(targetDir)) {
        try {
            fs.rmSync(targetDir, { recursive: true, force: true });
        } catch (err) {
            console.log(`⚠️ Não foi possível remover ${targetDir}, pulando link simbólico.`);
            return;
        }
    }

    try {
        // Copiar a pasta em vez de usar symlink (mais compatível com o Vercel)
        fs.cpSync(sourceDir, targetDir, { recursive: true });
        console.log(`✅ ${moduleName} copiado para next/node_modules com sucesso.`);
    } catch (err) {
        console.log(`⚠️ Erro ao criar link para ${moduleName}:`, err.message);
    }
}

// Criar links para os módulos principais
createModuleSymlink('postcss');
createModuleSymlink('tailwindcss');
createModuleSymlink('autoprefixer');

// Adicionar patch para o bug do sync no PostCSS
function patchPostCssSync() {
    const postcssPath = path.join(process.cwd(), 'node_modules', 'postcss', 'lib', 'postcss.js');

    if (!fs.existsSync(postcssPath)) {
        console.log('⚠️ Arquivo PostCSS principal não encontrado, não é possível aplicar o patch do sync.');
        return;
    }

    try {
        let content = fs.readFileSync(postcssPath, 'utf8');

        // Verificar se o método sync já existe
        if (!content.includes('process.sync = function sync')) {
            // Adicionar método sync ao objeto process
            const processFunction = 'process: function process(css, opts) {';
            const syncFunction = `process: function process(css, opts) {
    if (!opts) opts = {};
    
    process.sync = function sync(css, opts) {
      if (!opts) opts = {};
      const processor = this;
      let result = processor.process(css, opts);
      if (result && typeof result.then === 'function') {
        let resultCss = '';
        let resultMap = null;
        let resultWarnings = [];
        
        result.then(r => {
          resultCss = r.css;
          resultMap = r.map;
          resultWarnings = r.warnings();
        });
        
        return {
          css: resultCss,
          map: resultMap,
          warnings: function() { return resultWarnings; }
        };
      }
      return result;
    };`;

            content = content.replace(processFunction, syncFunction);

            fs.writeFileSync(postcssPath, content, 'utf8');
            console.log('✅ Patch do método sync aplicado ao PostCSS com sucesso!');
        } else {
            console.log('✅ O método sync já existe no PostCSS, nenhum patch necessário.');
        }
    } catch (error) {
        console.error('❌ Erro ao aplicar patch no PostCSS:', error.message);
    }
}

patchPostCssSync();

console.log('🎉 Correção do PostCSS e Tailwind CSS concluída!');
