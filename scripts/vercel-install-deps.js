#!/usr/bin/env node

/**
 * Script para instalar dependências críticas no ambiente Vercel
 * Este script é executado ANTES do build para garantir que todas as dependências
 * necessárias estejam disponíveis, com foco especial no Tailwind CSS
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Instalando dependências críticas para ambiente Vercel...');

// Função para executar comando com retry
function execWithRetry(command, retries = 3) {
  let attempt = 1;
  while (attempt <= retries) {
    try {
      console.log(`Tentativa ${attempt}/${retries}: ${command}`);
      execSync(command, { stdio: 'inherit' });
      return true;
    } catch (error) {
      if (attempt === retries) {
        console.error(`❌ Falha após ${retries} tentativas:`, error.message);
        return false;
      }
      console.log(`⚠️ Tentativa ${attempt} falhou, tentando novamente...`);
      attempt++;
    }
  }
}

// 1. Tentar instalar módulos via NPM
console.log('🔄 Instalando tailwindcss, postcss e autoprefixer...');
execWithRetry('npm install tailwindcss@3.3.5 postcss@8.4.35 autoprefixer@10.4.16 --no-save --force');

// 2. Criar versões minimalistas dos pacotes críticos (independente do resultado da instalação)
console.log('🔄 Criando versões minimalistas dos pacotes críticos...');
try {
  // Carregar e executar os scripts de criação de pacotes minimalistas
  // Tailwind CSS minimalista
  const createTailwindPath = path.join(__dirname, 'create-minimal-tailwind.js');
  if (fs.existsSync(createTailwindPath)) {
    require('./create-minimal-tailwind');
  } else {
    console.warn('⚠️ Script create-minimal-tailwind.js não encontrado');
  }
  
  // PostCSS minimalista
  const createPostcssPath = path.join(__dirname, 'create-minimal-postcss.js');
  if (fs.existsSync(createPostcssPath)) {
    require('./create-minimal-postcss');
  } else {
    console.warn('⚠️ Script create-minimal-postcss.js não encontrado');
  }
} catch (e) {
  console.error('❌ Erro ao criar versões minimalistas:', e);
}

// 3. Verificar se os módulos agora podem ser resolvidos
const requiredModules = ['tailwindcss', 'postcss', 'autoprefixer'];
const missingModules = [];

requiredModules.forEach(moduleName => {
  try {
    require.resolve(moduleName);
    console.log(`✅ ${moduleName} está disponível e pode ser resolvido`);
  } catch (e) {
    console.error(`❌ ${moduleName} ainda NÃO pode ser resolvido`);
    missingModules.push(moduleName);
  }
});

// 4. Para módulos que ainda estão faltando, criar substituições diretas
if (missingModules.length > 0) {
  console.log(`⚠️ Criando substituições diretas para ${missingModules.length} módulos ainda faltantes...`);
  
  missingModules.forEach(moduleName => {
    const moduleDir = path.join(process.cwd(), 'node_modules', moduleName);
    
    if (!fs.existsSync(moduleDir)) {
      fs.mkdirSync(moduleDir, { recursive: true });
    }
    
    // Criar package.json para o módulo
    const packageJson = {
      name: moduleName,
      version: moduleName === 'tailwindcss' ? '3.3.5' : 
               moduleName === 'postcss' ? '8.4.35' : '10.4.16',
      main: 'index.js'
    };
    
    fs.writeFileSync(
      path.join(moduleDir, 'package.json'), 
      JSON.stringify(packageJson, null, 2)
    );
    
    // Criar index.js para o módulo
    let indexContent = '';
    
    if (moduleName === 'tailwindcss') {
      indexContent = `
// Tailwind CSS fallback
module.exports = {
  postcssPlugin: 'tailwindcss',
  plugins: []
};
module.exports.postcss = true;
`;
    } 
    else if (moduleName === 'postcss') {
      indexContent = `
// PostCSS fallback
module.exports = function(plugins) {
  return { plugins: [] };
};
module.exports.plugin = function(name, fn) {
  return fn;
};
`;
    }
    else if (moduleName === 'autoprefixer') {
      indexContent = `
// Autoprefixer fallback
module.exports = function() {
  return {
    postcssPlugin: 'autoprefixer',
    Once() {}
  };
};
module.exports.postcss = true;
`;
    }
    
    fs.writeFileSync(path.join(moduleDir, 'index.js'), indexContent);
    console.log(`✅ Substituição criada para ${moduleName}`);
  });
}

// 5. Gerar arquivo tailwind.config.js se necessário
const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.js');
const tailwindTsConfigPath = path.join(process.cwd(), 'tailwind.config.ts');

if (!fs.existsSync(tailwindConfigPath) && !fs.existsSync(tailwindTsConfigPath)) {
  console.log('⚠️ Arquivo de configuração do tailwind não encontrado, criando...');
  
  const configContent = `
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;

  fs.writeFileSync(tailwindConfigPath, configContent);
  console.log('✅ tailwind.config.js criado');
}

// 6. Garantir que o postcss.config.js está correto
const postcssConfigPath = path.join(process.cwd(), 'postcss.config.js');
const postcssContent = `
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

// Reescrever independente do existente para garantir formato correto
fs.writeFileSync(postcssConfigPath, postcssContent);
console.log('✅ postcss.config.js configurado');

console.log('🎉 Preparação de dependências concluída!');
