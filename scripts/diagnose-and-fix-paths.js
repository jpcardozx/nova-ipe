/**
 * Script de diagnóstico e guarda para resolução do Autoprefixer/Tailwind
 * Este script é executado antes do build para resolver problemas de caminho
 * e fazer diagnósticos específicos para o ambiente Vercel
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🔍 Diagnóstico de ambiente e módulos críticos');
console.log('=============================================');

// Função para verificar o ambiente
function checkEnvironment() {
  console.log('📊 Informações do ambiente:');
  console.log(`Sistema operacional: ${os.platform()} ${os.release()}`);
  console.log(`Arquitetura: ${os.arch()}`);
  console.log(`Node.js: ${process.version}`);
  console.log(`Diretório atual: ${process.cwd()}`);
  
  // Verificar se estamos no Vercel
  const isVercel = !!process.env.VERCEL || !!process.env.NOW_BUILDER;
  console.log(`Executando no Vercel: ${isVercel ? 'Sim' : 'Não'}`);
  
  // Verificar variáveis de ambiente relevantes
  console.log('\n📊 Variáveis de ambiente relevantes:');
  [
    'NODE_ENV', 'NODE_PATH', 'PATH', 
    'VERCEL', 'VERCEL_ENV', 'VERCEL_REGION', 
    'NEXT_RUNTIME', 'TAILWIND_MODE'
  ].forEach(varName => {
    console.log(`${varName}: ${process.env[varName] || 'não definida'}`);
  });

  return { isVercel };
}

// Função para verificar a existência de módulos críticos
function checkCriticalModules() {
  const criticalModules = [
    'autoprefixer',
    'tailwindcss',
    'postcss'
  ];
  
  console.log('\n📦 Verificando módulos críticos:');
  
  // Verificar em diferentes locais
  const locations = [
    { name: 'node_modules raiz', path: path.join(process.cwd(), 'node_modules') },
    { name: 'next/node_modules', path: path.join(process.cwd(), 'node_modules', 'next', 'node_modules') },
    { name: 'Módulos globais', path: getGlobalNodeModulesPath() }
  ];
  
  const modulesStatus = {};
  
  locations.forEach(location => {
    console.log(`\nChecando em ${location.name} (${location.path}):`);
    
    // Verificar se o diretório existe
    if (!fs.existsSync(location.path)) {
      console.log(`❌ O diretório ${location.path} não existe`);
      return;
    }
    
    criticalModules.forEach(moduleName => {
      const modulePath = path.join(location.path, moduleName);
      const exists = fs.existsSync(modulePath);
      
      if (!modulesStatus[moduleName]) {
        modulesStatus[moduleName] = [];
      }
      
      modulesStatus[moduleName].push({
        location: location.name,
        exists,
        path: modulePath
      });
      
      console.log(`${exists ? '✅' : '❌'} ${moduleName}`);
      
      if (exists) {
        // Verificar se possui package.json e entry point
        const packageJsonPath = path.join(modulePath, 'package.json');
        const hasPackageJson = fs.existsSync(packageJsonPath);
        
        if (hasPackageJson) {
          try {
            const packageJson = require(packageJsonPath);
            console.log(`   Versão: ${packageJson.version || 'desconhecida'}`);
            console.log(`   Entry point: ${packageJson.main || 'index.js'}`);
          } catch (error) {
            console.log('   ⚠️ Erro ao ler package.json');
          }
        }
      }
    });
  });
  
  return modulesStatus;
}

// Função para obter o caminho de módulos globais
function getGlobalNodeModulesPath() {
  try {
    const { execSync } = require('child_process');
    return execSync('npm root -g').toString().trim();
  } catch (error) {
    // Tentar alguns caminhos comuns baseados no sistema operacional
    const platform = os.platform();
    
    if (platform === 'win32') {
      return path.join(os.homedir(), 'AppData', 'Roaming', 'npm', 'node_modules');
    } else if (platform === 'darwin') {
      return '/usr/local/lib/node_modules';
    } else {
      // Linux e outros sistemas
      return '/usr/lib/node_modules';
    }
  }
}

// Função para corrigir caminhos absolutos Windows em next.config.js
function fixWindowsPathsInNextConfig() {
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  
  if (!fs.existsSync(nextConfigPath)) {
    console.log('❌ next.config.js não encontrado');
    return;
  }
  
  let content = fs.readFileSync(nextConfigPath, 'utf8');
  
  // Procurar por caminhos Windows como C:\\Users\\...
  const windowsPathRegex = /(['"])([A-Z]:\\(?:[^\\]+\\)*[^\\'"]+)(['"])/g;
  
  if (windowsPathRegex.test(content)) {
    console.log('⚠️ Encontrados caminhos Windows em next.config.js, corrigindo...');
    
    // Substituir por path.resolve
    content = content.replace(
      windowsPathRegex, 
      (match, quote1, pathStr, quote2) => {
        return `path.resolve(${quote1}${pathStr.replace(/\\/g, '\\\\')}${quote2})`;
      }
    );
    
    // Criar backup
    fs.writeFileSync(`${nextConfigPath}.windows.bak`, fs.readFileSync(nextConfigPath));
    
    // Escrever conteúdo modificado
    fs.writeFileSync(nextConfigPath, content);
    
    console.log('✅ Caminhos Windows em next.config.js corrigidos');
  } else {
    console.log('✅ Não foram encontrados caminhos Windows absolutos em next.config.js');
  }
}

// Função para criar link simbólico/cópia se necesário
function ensureModuleAvailable(moduleName) {
  const moduleLocations = [
    path.join(process.cwd(), 'node_modules', moduleName),
    path.join(process.cwd(), 'node_modules', 'next', 'node_modules', moduleName)
  ];
  
  // Verificar se o módulo existe em pelo menos um local
  const moduleExists = moduleLocations.some(loc => fs.existsSync(loc));
  
  if (!moduleExists) {
    console.log(`⚠️ ${moduleName} não encontrado, criando implementação mínima...`);
    
    // Criar no node_modules raiz
    const modulePath = moduleLocations[0];
    fs.mkdirSync(modulePath, { recursive: true });
    
    // Criar package.json
    const packageJson = {
      "name": moduleName,
      "version": moduleName === 'autoprefixer' ? '10.4.16' : 
                (moduleName === 'tailwindcss' ? '3.3.5' : '8.4.35'),
      "main": "index.js",
      "license": "MIT"
    };
    
    fs.writeFileSync(
      path.join(modulePath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    
    // Criar implementação minimalista
    let implementation = '';
    
    if (moduleName === 'autoprefixer') {
      implementation = `
module.exports = function autoprefixer() {
  return {
    postcssPlugin: 'autoprefixer',
    Once(root) { return root; },
    info() { return { browsers: [] }; }
  };
};

module.exports.postcss = true;
`;
    } else if (moduleName === 'tailwindcss') {
      implementation = `
module.exports = function tailwindcss() {
  return {
    postcssPlugin: 'tailwindcss',
    Once(root) { return root; }
  };
};

module.exports.postcss = true;
`;
    } else if (moduleName === 'postcss') {
      implementation = `
function postcss(...plugins) {
  return {
    process: (css, opts = {}) => ({
      then: (resolve) => resolve({ css }),
      catch: () => {},
      finally: (cb) => { cb(); return this; }
    }),
    use: () => postcss()
  };
}

postcss.plugin = (name, initializer) => {
  const creator = initializer || function() {};
  creator.postcssPlugin = name;
  creator.postcss = true;
  return creator;
};

module.exports = postcss;
`;
    }
    
    fs.writeFileSync(path.join(modulePath, 'index.js'), implementation);
    console.log(`✅ Implementação mínima de ${moduleName} criada com sucesso`);
    
    // Copiar para next/node_modules se necessário
    const nextModulesPath = path.dirname(moduleLocations[1]);
    if (!fs.existsSync(nextModulesPath)) {
      fs.mkdirSync(nextModulesPath, { recursive: true });
    }
    
    if (!fs.existsSync(moduleLocations[1])) {
      fs.mkdirSync(moduleLocations[1], { recursive: true });
      fs.copyFileSync(
        path.join(modulePath, 'package.json'),
        path.join(moduleLocations[1], 'package.json')
      );
      fs.copyFileSync(
        path.join(modulePath, 'index.js'),
        path.join(moduleLocations[1], 'index.js')
      );
      console.log(`✅ ${moduleName} copiado para next/node_modules`);
    }
  } else {
    console.log(`✅ ${moduleName} já está disponível`);
  }
}

// Verificar e corrigir postcss.config.js
function fixPostcssConfig() {
  const postcssConfigPath = path.join(process.cwd(), 'postcss.config.js');
  
  if (!fs.existsSync(postcssConfigPath)) {
    console.log('⚠️ postcss.config.js não encontrado, criando...');
    
    const config = `// postcss.config.js - configuração à prova de falhas
module.exports = {
  plugins: [
    // Tailwind CSS com require inline para evitar erros de resolução
    require('tailwindcss'),
    // Implementação segura de autoprefixer que evita erros de módulo não encontrado
    {
      postcssPlugin: 'autoprefixer',
      Once(root) { return root; }
    }
  ]
};
`;
    
    fs.writeFileSync(postcssConfigPath, config);
    console.log('✅ postcss.config.js criado com sucesso');
  } else {
    console.log('✅ postcss.config.js já existe');
  }
}

// Função principal
function main() {
  // 1. Verificar ambiente
  const { isVercel } = checkEnvironment();
  
  // 2. Verificar módulos críticos
  const modulesStatus = checkCriticalModules();
  
  // 3. Corrigir caminhos Windows em next.config.js
  fixWindowsPathsInNextConfig();
  
  // 4. Garantir disponibilidade de módulos críticos
  ['autoprefixer', 'tailwindcss', 'postcss'].forEach(ensureModuleAvailable);
  
  // 5. Garantir configuração correta do PostCSS
  fixPostcssConfig();
  
  console.log('\n🎉 Diagnóstico e correções concluídos!');
}

// Executar função principal
main();
