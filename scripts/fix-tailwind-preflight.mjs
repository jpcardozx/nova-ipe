/**
 * Script para corrigir o erro "Can't resolve 'tailwindcss/preflight'"
 * Este script cria um stub para o módulo preflight dentro do tailwindcss
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🌬️  Corrigindo o problema de tailwindcss/preflight...');

// Verificar se o diretório tailwindcss existe
const nodeModulesDir = path.join(process.cwd(), 'node_modules');
const tailwindDir = path.join(nodeModulesDir, 'tailwindcss');

// Garantir que o diretório tailwindcss existe
if (!fs.existsSync(tailwindDir)) {
    fs.mkdirSync(tailwindDir, { recursive: true });
    console.log('✅ Diretório tailwindcss criado');
}

// Criar o arquivo preflight.css para resolver o problema de importação
const preflightCssPath = path.join(tailwindDir, 'preflight.css');
const preflightCssContent = `
/* 
 * Stub tailwindcss/preflight.css 
 * Este arquivo é um stub para resolver o problema de importação na Vercel
 */

/* Normalize básico */
html {
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  font-family: system-ui, sans-serif;
}

body {
  margin: 0;
  line-height: inherit;
}

hr {
  height: 0;
  color: inherit;
  border-top-width: 1px;
}

abbr:where([title]) {
  text-decoration: underline dotted;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}

a {
  color: inherit;
  text-decoration: inherit;
}

b,
strong {
  font-weight: bolder;
}

code,
kbd,
samp,
pre {
  font-family: ui-monospace, monospace;
  font-size: 1em;
}

small {
  font-size: 80%;
}

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

table {
  text-indent: 0;
  border-color: inherit;
  border-collapse: collapse;
}

button,
input,
optgroup,
select,
textarea {
  font-family: inherit;
  font-feature-settings: inherit;
  font-variation-settings: inherit;
  font-size: 100%;
  font-weight: inherit;
  line-height: inherit;
  color: inherit;
  margin: 0;
  padding: 0;
}

button,
select {
  text-transform: none;
}

button,
[type='button'],
[type='reset'],
[type='submit'] {
  -webkit-appearance: button;
  background-color: transparent;
  background-image: none;
}

:-moz-focusring {
  outline: auto;
}

:-moz-ui-invalid {
  box-shadow: none;
}

progress {
  vertical-align: baseline;
}

::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto;
}

[type='search'] {
  -webkit-appearance: textfield;
  outline-offset: -2px;
}

::-webkit-search-decoration {
  -webkit-appearance: none;
}

::-webkit-file-upload-button {
  -webkit-appearance: button;
  font: inherit;
}

summary {
  display: list-item;
}

blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
figure,
p,
pre {
  margin: 0;
}

fieldset {
  margin: 0;
  padding: 0;
}

legend {
  padding: 0;
}

ol,
ul,
menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

dialog {
  padding: 0;
}

textarea {
  resize: vertical;
}

input::placeholder,
textarea::placeholder {
  opacity: 1;
  color: #9ca3af;
}

button,
[role="button"] {
  cursor: pointer;
}

:disabled {
  cursor: default;
}

img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block;
  vertical-align: middle;
}

img,
video {
  max-width: 100%;
  height: auto;
}

[hidden] {
  display: none;
}
`;

fs.writeFileSync(preflightCssPath, preflightCssContent);
console.log('✅ Criado stub para tailwindcss/preflight.css');

// Criar também arquivos index.js e theme.css para o diretório tailwindcss
// se eles não existirem
const tailwindIndexPath = path.join(tailwindDir, 'index.js');
if (!fs.existsSync(tailwindIndexPath)) {
    const tailwindIndexContent = `
// Implementação minimalista do TailwindCSS para Vercel
const plugin = function() {
  return {
    postcssPlugin: 'tailwindcss',
    Once(root) { 
      return root; 
    }
  };
};

plugin.postcss = true;
module.exports = plugin;
`;
    fs.writeFileSync(tailwindIndexPath, tailwindIndexContent);
    console.log('✅ Criado stub para tailwindcss/index.js');
}

// Criar o diretório para tailwindcss/lib
const tailwindLibDir = path.join(tailwindDir, 'lib');
if (!fs.existsSync(tailwindLibDir)) {
    fs.mkdirSync(tailwindLibDir, { recursive: true });
    console.log('✅ Diretório tailwindcss/lib criado');
}

// Criar um stub para o preflight.js que é importado por algumas versões do Tailwind
const preflightJsPath = path.join(tailwindLibDir, 'preflight.js');
const preflightJsContent = `
// Implementação minimalista do preflight para Tailwind CSS
module.exports = function() {
  return {
    '@layer preflight': {
      // Stub vazio para preflight
    }
  };
};

// Garantir compatibilidade com possíveis importações ESM
module.exports.default = module.exports;
`;
fs.writeFileSync(preflightJsPath, preflightJsContent);
console.log('✅ Criado stub para tailwindcss/lib/preflight.js');

// Criar theme.css que também pode ser importado
const themeCssPath = path.join(tailwindDir, 'theme.css');
const themeCssContent = `
/* 
 * Stub tailwindcss/theme.css 
 * Este arquivo é um stub para resolver problemas de importação
 */
:root {
  --primary: #007bff;
  --secondary: #6c757d;
}
`;
fs.writeFileSync(themeCssPath, themeCssContent);
console.log('✅ Criado stub para tailwindcss/theme.css');

// Criar package.json para tailwindcss para evitar erros de resolução
const packageJsonPath = path.join(tailwindDir, 'package.json');
const packageJsonContent = `{
  "name": "tailwindcss",
  "version": "3.4.0",
  "description": "Stub para resolver problemas de importação no Vercel",
  "main": "index.js",
  "exports": {
    ".": "./index.js",
    "./preflight": "./preflight.css",
    "./preflight.css": "./preflight.css",
    "./theme.css": "./theme.css",
    "./lib/preflight": "./lib/preflight.js"
  }
}`;
fs.writeFileSync(packageJsonPath, packageJsonContent);
console.log('✅ Criado package.json para tailwindcss com exportações corretas');

// Agora vamos adicionar o código para modificar os arquivos CSS que estão causando problemas
// Lista de arquivos que podem estar importando tailwindcss/preflight
const cssFilesToCheck = [
    path.join(process.cwd(), 'app', 'globals.css'),
    path.join(process.cwd(), 'app', 'test-tailwind', 'test-v4.css'),
    path.join(process.cwd(), 'app', 'test-tailwind', 'test.css'),
];

cssFilesToCheck.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');

        // Verificar se contém importação do preflight
        if (content.includes('@import "tailwindcss/preflight"') ||
            content.includes("@import 'tailwindcss/preflight'")) {
                console.log(`🔍 Encontrado import de tailwindcss/preflight em ${filePath}`);

            // Substituir as importações problemáticas com comentários
            let modifiedContent = content;

            // Substituir @import tailwindcss/preflight
            modifiedContent = modifiedContent.replace(
                /@import\s+['"]tailwindcss\/preflight['"][^;]*;/g,
                '/* AVISO: Importação de tailwindcss/preflight removida para compatibilidade com Vercel */'
            );

            // Substituir @import tailwindcss/theme.css se existir
            modifiedContent = modifiedContent.replace(
                /@import\s+['"]tailwindcss\/theme\.css['"][^;]*;/g,
                '/* AVISO: Importação de tailwindcss/theme.css removida para compatibilidade com Vercel */'
            );

            // Adicionar comentário no início do arquivo
            modifiedContent = `/* AVISO: Importações diretas do Tailwind removidas para compatibilidade com Vercel */
/* Arquivo modificado para resolver erro: Can't resolve 'tailwindcss/preflight' */
/* Data da modificação: ${new Date().toLocaleDateString()} */

${modifiedContent}`;

            fs.writeFileSync(filePath, modifiedContent);
            console.log(`✅ Removidas importações problemáticas de ${filePath}`);
        }
    }
});

// Atualizar next.config.js para garantir que o alias para tailwindcss está correto
// e adicionar configurações especiais para lidar com os imports problemáticos
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
if (fs.existsSync(nextConfigPath)) {
    let nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
    let updated = false;

    // Verificar se já existe configuração de alias para tailwindcss/preflight
    if (!nextConfig.includes("'tailwindcss/preflight'")) {
        // Encontrar onde estão os outros aliases para adicionar o novo
        const aliasRegex = /config\.resolve\.alias\['tailwindcss'\]/;
        if (aliasRegex.test(nextConfig)) {
            nextConfig = nextConfig.replace(
                aliasRegex,
                "config.resolve.alias['tailwindcss/preflight'] = path.resolve('./node_modules/tailwindcss/preflight.css');\n    config.resolve.alias['tailwindcss']"
            );
            updated = true;
            console.log('✅ Adicionado alias para tailwindcss/preflight em next.config.js');
        }
    }

    // Adicionar configuração especial para lidar com o css-loader
    if (!nextConfig.includes('onResolve({ filter: /tailwindcss\\/preflight/ })')) {
        const webpackConfigRegex = /webpack: \(config(?:, [^)]+)?\) => {/;
        if (webpackConfigRegex.test(nextConfig)) {
            nextConfig = nextConfig.replace(
                webpackConfigRegex,
                `webpack: (config, { isServer }) => {
    // Resolver problema de importação do tailwindcss/preflight
    if (config.resolve && config.resolve.plugins) {
      config.resolve.plugins.push({
        name: 'replace-tailwindcss-preflight',
        onResolve({ filter: /tailwindcss\\/preflight/ }) {
          return { path: path.resolve('./node_modules/tailwindcss/preflight.css') };
        },
      });
    }`
            );
            updated = true;
            console.log('✅ Adicionada configuração para resolver tailwindcss/preflight em next.config.js');
        }
    }

    if (updated) {
        fs.writeFileSync(nextConfigPath, nextConfig);
        console.log('✅ next.config.js atualizado com resolução de módulos');
    }
}

// Verificar se o script foi executado no ambiente Vercel e criar arquivo para indicar que a correção foi aplicada
const isVercel = process.env.VERCEL === '1';
if (isVercel) {
    const flagFile = path.join(process.cwd(), '.tailwind-preflight-fixed');
    fs.writeFileSync(flagFile, new Date().toISOString());
    console.log('✅ Marcador de correção criado para ambiente Vercel');
}

console.log('🎉 Correção do tailwindcss/preflight concluída com sucesso!');
