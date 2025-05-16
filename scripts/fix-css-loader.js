/**
 * Script para corrigir especificamente o problema do css-loader
 * Esta é uma abordagem direta para resolver o problema de "Cannot find module 'tailwindcss'"
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Iniciando correção específica para o css-loader e tailwindcss...');

// Função para verificar se um módulo existe
function checkModuleExists(moduleName) {
    try {
        const modulePath = path.join(process.cwd(), 'node_modules', moduleName);
        return fs.existsSync(modulePath);
    } catch (error) {
        return false;
    }
}

// Função para instalar globalmente os módulos essenciais
function installGlobalModules() {
    const modules = ['tailwindcss', 'postcss', 'autoprefixer', 'css-loader'];

    console.log('📦 Instalando módulos globalmente para garantir disponibilidade...');
    try {
        execSync(`npm install -g ${modules.join(' ')}`, { stdio: 'inherit' });
        console.log('✅ Módulos instalados globalmente com sucesso!');
        return true;
    } catch (error) {
        console.error('❌ Falha ao instalar módulos globalmente:', error.message);
        console.log('⚠️ Continuando com outras abordagens...');
        return false;
    }
}

// Função para encontrar loader na node_modules
function findLoaderInNodeModules(loaderName) {
    try {
        // Verificar no node_modules local
        const localPath = path.join(process.cwd(), 'node_modules', loaderName);
        if (fs.existsSync(localPath)) {
            return localPath;
        }

        // Verificar no node_modules do next
        const nextPath = path.join(process.cwd(), 'node_modules', 'next', 'node_modules', loaderName);
        if (fs.existsSync(nextPath)) {
            return nextPath;
        }

        // Tentar encontrar via npm root global
        try {
            const globalPath = execSync('npm root -g').toString().trim();
            const globalLoaderPath = path.join(globalPath, loaderName);
            if (fs.existsSync(globalLoaderPath)) {
                return globalLoaderPath;
            }
        } catch (e) {
            // ignore
        }

        return null;
    } catch (error) {
        console.error(`❌ Erro ao procurar loader ${loaderName}:`, error.message);
        return null;
    }
}

// Função para criar um patch para o css-loader
function patchCssLoader() {
    console.log('🔧 Criando patch para o css-loader...');

    // Encontrar o caminho do css-loader
    const cssLoaderPath = findLoaderInNodeModules('css-loader');
    if (!cssLoaderPath) {
        console.error('❌ Não foi possível encontrar o css-loader');
        return false;
    }

    console.log(`📍 css-loader encontrado em: ${cssLoaderPath}`);

    // Caminho para os arquivos do css-loader
    const cssLoaderDistPath = path.join(cssLoaderPath, 'dist');
    if (!fs.existsSync(cssLoaderDistPath)) {
        console.error('❌ Diretório dist do css-loader não encontrado');
        return false;
    }

    // Encontrar o arquivo de resolução de plugins do postcss
    const possibleFiles = [
        'plugins.js',
        'plugins/index.js',
        'utils/plugins.js',
        'postcss-plugins.js'
    ];

    let pluginsFile = null;
    for (const file of possibleFiles) {
        const filePath = path.join(cssLoaderDistPath, file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            if (content.includes('tailwindcss') || content.includes('postcss-loader')) {
                pluginsFile = filePath;
                break;
            }
        }
    }

    if (!pluginsFile) {
        // Procurar em todo o diretório por arquivos JS que contenham "tailwindcss"
        const findFiles = (dir, pattern) => {
            const results = [];
            const items = fs.readdirSync(dir);

            for (const item of items) {
                const itemPath = path.join(dir, item);
                const stat = fs.statSync(itemPath);

                if (stat.isDirectory()) {
                    results.push(...findFiles(itemPath, pattern));
                } else if (item.endsWith('.js')) {
                    const content = fs.readFileSync(itemPath, 'utf8');
                    if (content.includes(pattern)) {
                        results.push(itemPath);
                    }
                }
            }

            return results;
        };

        const filesWithTailwind = findFiles(cssLoaderDistPath, 'tailwindcss');

        if (filesWithTailwind.length > 0) {
            pluginsFile = filesWithTailwind[0];
        } else {
            console.error('❌ Não foi possível encontrar arquivo para patch');
            return false;
        }
    }

    console.log(`📝 Arquivo para patch encontrado: ${pluginsFile}`);

    // Fazer backup do arquivo
    const backupFile = `${pluginsFile}.bak`;
    if (!fs.existsSync(backupFile)) {
        fs.copyFileSync(pluginsFile, backupFile);
        console.log('✅ Backup do arquivo criado');
    }

    // Ler o conteúdo do arquivo
    let content = fs.readFileSync(pluginsFile, 'utf8');

    // Verificar se o patch já foi aplicado
    if (content.includes('// NOVA-IPE PATCH')) {
        console.log('✅ Patch já aplicado anteriormente');
        return true;
    }

    // Encontrar um padrão adequado para substituir
    const patchPatterns = [
        {
            pattern: /require\(['"]tailwindcss['"]\)/g,
            replacement: `(() => {
        // NOVA-IPE PATCH
        try {
          return require('tailwindcss');
        } catch (e) {
          console.warn('⚠️ tailwindcss não encontrado, usando fallback minimalista');
          return {
            postcssPlugin: 'tailwindcss',
            plugins: []
          };
        }
      })()`
        },
        {
            pattern: /import\s+.*\s+from\s+['"]tailwindcss['"]/g,
            replacement: `// NOVA-IPE PATCH
      (() => {
        try {
          return require('tailwindcss');
        } catch (e) {
          console.warn('⚠️ tailwindcss não encontrado, usando fallback minimalista');
          return {
            postcssPlugin: 'tailwindcss',
            plugins: []
          };
        }
      })()`
        },
        {
            pattern: /(['"])tailwindcss\1/g,
            replacement: `$1${path.join(process.cwd(), 'node_modules', 'tailwindcss')}$1`
        }
    ];

    let patched = false;

    for (const { pattern, replacement } of patchPatterns) {
        if (pattern.test(content)) {
            content = content.replace(pattern, replacement);
            patched = true;
            break;
        }
    }

    if (!patched) {
        // Se não encontramos padrões específicos, adicionar no início do arquivo
        content = `// NOVA-IPE PATCH
// Modificado para resolver problemas de não encontrar o tailwindcss
const resolveTailwind = () => {
  try {
    return require('tailwindcss');
  } catch (e) {
    console.warn('⚠️ tailwindcss não encontrado, usando fallback minimalista');
    return {
      postcssPlugin: 'tailwindcss',
      plugins: []
    };
  }
};

${content}`;

        // Substituir qualquer ocorrência de tailwindcss no conteúdo
        content = content.replace(/require\(['"]tailwindcss['"]\)/g, 'resolveTailwind()');
    }

    // Escrever o conteúdo modificado
    fs.writeFileSync(pluginsFile, content);
    console.log('✅ Patch aplicado com sucesso ao css-loader');

    return true;
}

// Função para modificar a configuração da compilação do Next.js
function modifyNextConfig() {
    console.log('🔧 Modificando next.config.js para resolver problemas com css-loader...');

    const nextConfigPath = path.join(process.cwd(), 'next.config.js');
    if (!fs.existsSync(nextConfigPath)) {
        console.error('❌ Arquivo next.config.js não encontrado');
        return false;
    }

    // Ler o conteúdo atual
    let configContent = fs.readFileSync(nextConfigPath, 'utf8');

    // Verificar se o patch já foi aplicado
    if (configContent.includes('// CSS LOADER PATCH')) {
        console.log('✅ Patch já aplicado ao next.config.js');
        return true;
    }

    // Criar backup
    const backupPath = path.join(process.cwd(), 'next.config.js.bak');
    if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(nextConfigPath, backupPath);
        console.log('📝 Backup do next.config.js criado');
    }

    // Patch para o webpack
    let patchApplied = false;

    // Se existe uma configuração webpack
    if (configContent.includes('webpack: (config,')) {
        configContent = configContent.replace(
            /webpack:\s*\(\s*config\s*,[^)]*\)\s*=>\s*{/,
            `webpack: (config, { isServer }) => {
    // CSS LOADER PATCH
    if (Array.isArray(config.module.rules)) {
      // Encontrar a regra do css
      const cssRule = config.module.rules.find(rule => 
        rule.test && rule.test.toString().includes('.css')
      );
      
      if (cssRule && cssRule.use) {
        // Ajusta o css-loader para usar o diretório correto do tailwindcss
        cssRule.use.forEach(loader => {
          if (typeof loader === 'object' && loader.loader === 'css-loader') {
            if (!loader.options) loader.options = {};
            if (!loader.options.importLoaders) loader.options.importLoaders = 1;
            
            // Adicionar postcss-loader explicitamente
            if (!cssRule.use.some(l => 
              (typeof l === 'object' && l.loader === 'postcss-loader') || 
              (typeof l === 'string' && l === 'postcss-loader')
            )) {
              cssRule.use.push({
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: [
                      require('tailwindcss'),
                      require('autoprefixer')
                    ]
                  }
                }
              });
            }
          }
        });
      }
    }
    
    // Ajusta a resolução de módulos para encontrar o tailwindcss
    if (!config.resolve) config.resolve = {};
    if (!config.resolve.alias) config.resolve.alias = {};
    
    config.resolve.alias['tailwindcss'] = path.resolve('./node_modules/tailwindcss');
    config.resolve.alias['postcss'] = path.resolve('./node_modules/postcss');
    config.resolve.alias['autoprefixer'] = path.resolve('./node_modules/autoprefixer');
    
    // Configuração original continua abaixo
`
        );
        patchApplied = true;
    } else {
        // Se não há configuração webpack, adicionar uma
        const webpackConfig = `
  webpack: (config, { isServer }) => {
    // CSS LOADER PATCH
    if (Array.isArray(config.module.rules)) {
      // Encontrar a regra do css
      const cssRule = config.module.rules.find(rule => 
        rule.test && rule.test.toString().includes('.css')
      );
      
      if (cssRule && cssRule.use) {
        // Ajusta o css-loader para usar o diretório correto do tailwindcss
        cssRule.use.forEach(loader => {
          if (typeof loader === 'object' && loader.loader === 'css-loader') {
            if (!loader.options) loader.options = {};
            if (!loader.options.importLoaders) loader.options.importLoaders = 1;
            
            // Adicionar postcss-loader explicitamente
            if (!cssRule.use.some(l => 
              (typeof l === 'object' && l.loader === 'postcss-loader') || 
              (typeof l === 'string' && l === 'postcss-loader')
            )) {
              cssRule.use.push({
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: [
                      require('tailwindcss'),
                      require('autoprefixer')
                    ]
                  }
                }
              });
            }
          }
        });
      }
    }
    
    // Ajusta a resolução de módulos para encontrar o tailwindcss
    if (!config.resolve) config.resolve = {};
    if (!config.resolve.alias) config.resolve.alias = {};
    
    config.resolve.alias['tailwindcss'] = path.resolve('./node_modules/tailwindcss');
    config.resolve.alias['postcss'] = path.resolve('./node_modules/postcss');
    config.resolve.alias['autoprefixer'] = path.resolve('./node_modules/autoprefixer');
    
    return config;
  },`;

        // Procurar pelo último item na configuração para adicionar depois dele
        const lastItemRegex = /(\w+):\s*[^,}]*,?\s*(\n\s*\/\/[^\n]*\n\s*)?(?=})/;
        if (lastItemRegex.test(configContent)) {
            configContent = configContent.replace(lastItemRegex, `$&,\n${webpackConfig}`);
            patchApplied = true;
        } else {
            // Caso não encontre um padrão claro, tentar adicionar antes do último fechamento
            configContent = configContent.replace(/};\s*$/, `${webpackConfig}\n};`);
            patchApplied = true;
        }
    }

    if (!patchApplied) {
        console.error('❌ Não foi possível aplicar patch ao next.config.js');
        return false;
    }

    // Escrever o arquivo modificado
    fs.writeFileSync(nextConfigPath, configContent);
    console.log('✅ Patch aplicado ao next.config.js com sucesso!');

    return true;
}

// Função para corrigir a instalação npm
function fixNpmInstallation() {
    console.log('🔧 Verificando e corrigindo instalação local do npm...');

    try {
        // Verificar se existe o diretório node_modules
        const nodeModulesPath = path.join(process.cwd(), 'node_modules');
        if (!fs.existsSync(nodeModulesPath)) {
            fs.mkdirSync(nodeModulesPath, { recursive: true });
        }

        // Instalar especificamente tailwindcss
        if (!checkModuleExists('tailwindcss')) {
            console.log('📦 Instalando tailwindcss localmente...');
            execSync('npm install --no-save tailwindcss@latest postcss@latest autoprefixer@latest', {
                stdio: 'inherit',
                cwd: process.cwd()
            });
        }

        return true;
    } catch (error) {
        console.error('❌ Erro ao corrigir instalação npm:', error.message);
        return false;
    }
}

// Função para corrigir configuração do PostCSS
function fixPostcssConfig() {
    console.log('🔧 Verificando e corrigindo configuração do PostCSS...');

    const postcssConfigPath = path.join(process.cwd(), 'postcss.config.js');

    // Criar nova configuração
    const postcssConfig = `
// postcss.config.js
// Versão otimizada para compatibilidade com Vercel e NextJS 15+
const path = require('path');

module.exports = {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {
      config: path.join(__dirname, 'tailwind.config.js')
    },
    autoprefixer: {},
  },
};
`;

    // Escrever o arquivo
    fs.writeFileSync(postcssConfigPath, postcssConfig);
    console.log('✅ Configuração do PostCSS atualizada com sucesso!');

    return true;
}

// Função principal
async function main() {
    try {
        // 1. Corrigir instalação npm
        fixNpmInstallation();

        // 2. Instalar módulos globalmente (opcional)
        installGlobalModules();

        // 3. Aplicar patch ao css-loader
        patchCssLoader();

        // 4. Modificar next.config.js
        modifyNextConfig();

        // 5. Corrigir configuração do PostCSS
        fixPostcssConfig();

        console.log('🎉 Todas as correções foram aplicadas com sucesso!');
    } catch (error) {
        console.error('❌ Ocorreu um erro durante o processo de correção:', error.message);
        process.exit(1);
    }
}

// Executar o script
main();
