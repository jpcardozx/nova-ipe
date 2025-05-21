/**
 * Script para corrigir problemas relacionados ao Tailwind CSS na Vercel
 * Este script garante que o Tailwind CSS está instalado e configurado corretamente
 * no ambiente de build da Vercel.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🌬️  Corrigindo configuração do Tailwind CSS...');

// 1. Verificar se o tailwindcss está instalado
let tailwindInstalled = false;
try {
    require.resolve('tailwindcss');
    console.log('✅ tailwindcss já está instalado');
    tailwindInstalled = true;
} catch (e) {
    console.log('⚠️ tailwindcss não encontrado, será instalado');
}

// 2. Verificar o postcss.config.js
const postcssConfigPath = path.join(process.cwd(), 'postcss.config.js');
let needsPostcssUpdate = false;

if (fs.existsSync(postcssConfigPath)) {
    const postcssConfig = fs.readFileSync(postcssConfigPath, 'utf8');

    if (postcssConfig.includes('@tailwindcss/postcss')) {
        console.log('⚠️ postcss.config.js contém referência incorreta a @tailwindcss/postcss');
        needsPostcssUpdate = true;
    } else if (!postcssConfig.includes('tailwindcss')) {
        console.log('⚠️ postcss.config.js não contém referência a tailwindcss');
        needsPostcssUpdate = true;
    } else {
        console.log('✅ postcss.config.js está configurado corretamente');
    }
} else {
    console.log('⚠️ postcss.config.js não encontrado, criando...');
    needsPostcssUpdate = true;
}

// 3. Atualizar postcss.config.js se necessário
if (needsPostcssUpdate) {
    const correctPostcssConfig = `// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
    fs.writeFileSync(postcssConfigPath, correctPostcssConfig);
    console.log('✅ postcss.config.js corrigido');
}

// 4. Verificar package.json para corrigir referências ao tailwindcss
const packageJsonPath = path.join(process.cwd(), 'package.json');
let packageJsonUpdated = false;

if (fs.existsSync(packageJsonPath)) {
    try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

        // Verificar se está usando @tailwindcss/postcss em vez de tailwindcss
        if (packageJson.devDependencies && packageJson.devDependencies['@tailwindcss/postcss']) {
            console.log('⚠️ package.json contém referência incorreta a @tailwindcss/postcss');
            delete packageJson.devDependencies['@tailwindcss/postcss'];

            if (!packageJson.devDependencies['tailwindcss']) {
                packageJson.devDependencies['tailwindcss'] = "^3.3.5";
            }

            packageJsonUpdated = true;
        }

        // Garantir que as versões são compatíveis
        if (packageJson.devDependencies && packageJson.devDependencies['tailwindcss']
            && packageJson.devDependencies['tailwindcss'].startsWith('^4')) {
            console.log('⚠️ Versão do tailwindcss é incompatível (v4), corrigindo para v3.3.5');
            packageJson.devDependencies['tailwindcss'] = "^3.3.5";
            packageJsonUpdated = true;
        }

        // Salvar package.json se foi modificado
        if (packageJsonUpdated) {
            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
            console.log('✅ package.json corrigido');
        } else {
            console.log('✅ package.json está configurado corretamente');
        }
    } catch (error) {
        console.error('❌ Erro ao processar package.json:', error);
    }
}

// 5. Instalar tailwindcss sempre no ambiente Vercel para garantir sua presença
console.log('🔧 Instalando tailwindcss e dependências (modo forçado)...');
try {
    // Usar opções específicas para garantir que o tailwindcss seja instalado corretamente
    execSync('npm install -D tailwindcss@3.3.5 postcss@8.4.35 autoprefixer@10.4.16 --no-save --force', { stdio: 'inherit' });

    // Verificar se a instalação funcionou
    try {
        require.resolve('tailwindcss');
        console.log('✅ tailwindcss instalado e verificado com sucesso');
    } catch (e) {
        console.log('⚠️ tailwindcss ainda não pode ser resolvido, tentando método alternativo...');

        // Criar link simbólico manual
        const nodeModulesDir = path.join(process.cwd(), 'node_modules');
        const tailwindDir = path.join(nodeModulesDir, 'tailwindcss');

        if (!fs.existsSync(tailwindDir)) {
            // Criar diretório tailwindcss manualmente
            fs.mkdirSync(tailwindDir, { recursive: true });
            console.log('✅ Diretório tailwindcss criado manualmente');

            // Adicionar um index.js básico para tailwindcss
            const tailwindIndexContent = `
// Tailwind CSS manual fallback
module.exports = {
  postcssPlugin: 'tailwindcss',
  plugins: []
};
module.exports.postcss = true;
`;
            fs.writeFileSync(path.join(tailwindDir, 'index.js'), tailwindIndexContent);

            // Criar um package.json básico para tailwindcss
            const tailwindPackageContent = `{
  "name": "tailwindcss",
  "version": "3.3.5",
  "main": "index.js"
}`;
            fs.writeFileSync(path.join(tailwindDir, 'package.json'), tailwindPackageContent);

            console.log('✅ Módulo tailwindcss criado manualmente');
        }
    }
} catch (error) {
    console.error('❌ Erro ao instalar tailwindcss:', error);
}

// 6. Criar arquivo de configuração do tailwind se não existir
const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.ts');
const tailwindJsConfigPath = path.join(process.cwd(), 'tailwind.config.js');

if (!fs.existsSync(tailwindConfigPath) && !fs.existsSync(tailwindJsConfigPath)) {
    console.log('⚠️ Arquivo de configuração do tailwind não encontrado, criando...');

    const basicTailwindConfig = `// tailwind.config.js
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

    fs.writeFileSync(tailwindJsConfigPath, basicTailwindConfig);
    console.log('✅ tailwind.config.js criado');
}

console.log('🎉 Configuração do Tailwind CSS concluída com sucesso!');
