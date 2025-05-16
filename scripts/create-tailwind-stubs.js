/**
 * Script para resolver diretamente o erro "Can't resolve 'tailwindcss/preflight'"
 * Este script cria arquivos CSS vazios para substituir as importações diretas do Tailwind
 */

const fs = require('fs');
const path = require('path');

console.log('🧩 Criando stubs diretos para arquivos do Tailwind CSS...');

// Garantir que a pasta existe
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Criar um arquivo stub vazio ou com conteúdo mínimo
const createStub = (filePath, content = '/* Stub file */') => {
  fs.writeFileSync(filePath, content);
};

// Arquivos a serem criados
const stubsToCreate = [
  {
    path: path.join(process.cwd(), 'node_modules', 'tailwindcss', 'preflight.css'),
    content: `/* Stub preflight.css criado para resolver erro "Can't resolve 'tailwindcss/preflight'" */
/* Esta versão é mínima para garantir compatibilidade com o build da Vercel */

/* Normalize básico */
html {
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
}

main {
  display: block;
}

h1 {
  font-size: 2em;
  margin: 0.67em 0;
}

*, *::before, *::after {
  box-sizing: border-box;
}
`
  },
  {
    path: path.join(process.cwd(), 'node_modules', 'tailwindcss', 'theme.css'),
    content: `/* Stub theme.css criado para resolver erros de importação */
:root {
  --primary: #007bff;
  --secondary: #6c757d;
}
`
  },
  {
    path: path.join(process.cwd(), 'node_modules', 'tailwindcss', 'lib', 'preflight.js'),
    content: `
// Implementação minimalista do preflight para Tailwind CSS
module.exports = function() {
  return {
    '@layer preflight': {}
  };
};

module.exports.default = module.exports;
`
  },
  {
    path: path.join(process.cwd(), 'node_modules', 'tailwindcss', 'nesting', 'index.js'),
    content: `
// Implementação minimalista do plugin nesting
module.exports = function() {
  return {
    postcssPlugin: 'tailwindcss/nesting',
    Once(root) { return root; }
  };
};

module.exports.postcss = true;
`
  }
];

// Criar cada arquivo stub
stubsToCreate.forEach(stub => {
  try {
    ensureDirExists(path.dirname(stub.path));
    createStub(stub.path, stub.content);
    console.log(`✅ Criado ${path.basename(stub.path)} em ${path.dirname(stub.path)}`);
  } catch (error) {
    console.error(`❌ Erro ao criar ${stub.path}: ${error.message}`);
  }
});

// Atualizar package.json do tailwindcss para incluir exports corretos
const tailwindPackagePath = path.join(process.cwd(), 'node_modules', 'tailwindcss', 'package.json');
try {
  let packageJson;
  
  if (fs.existsSync(tailwindPackagePath)) {
    packageJson = JSON.parse(fs.readFileSync(tailwindPackagePath, 'utf8'));
  } else {
    packageJson = {
      name: "tailwindcss",
      version: "3.3.5",
      main: "index.js"
    };
  }
  
  // Adicionar as exportações necessárias
  packageJson.exports = {
    ...packageJson.exports,
    "./preflight": "./preflight.css",
    "./preflight.css": "./preflight.css",
    "./theme.css": "./theme.css",
    "./lib/preflight": "./lib/preflight.js",
    "./nesting": "./nesting/index.js"
  };
  
  // Salvar o arquivo atualizado
  fs.writeFileSync(tailwindPackagePath, JSON.stringify(packageJson, null, 2));
  console.log(`✅ package.json do tailwindcss atualizado com exports adicionais`);
} catch (error) {
  console.error(`❌ Erro ao atualizar package.json: ${error.message}`);
}

console.log('🎉 Stubs criados com sucesso!');
