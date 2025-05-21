/**
 * Script de busca e criação dinâmica de stubs
 * Este script analisa o código-fonte para encontrar componentes ausentes
 * e cria automaticamente stubs para eles
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Iniciando busca por imports não resolvidos...');

// Diretórios que devem ser escaneados
const dirsToScan = [
    'app',
    'components',
    'sections',
    'lib',
    'src'
];

// Expressões regulares para encontrar imports
const importRegexes = [
    // Import padrão ES6
    /import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g,
    // Import nomeado ES6
    /import\s+{\s*([^}]+)\s*}\s+from\s+['"]([^'"]+)['"]/g,
    // Import dinâmico
    /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g
];

// Mapear prefixos de import para diretórios
const prefixToDir = {
    '@/': './',
    '@app/': './app/',
    '@components/': './components/',
    '@sections/': './sections/',
    '@core/': './lib/core/',
    '@lib/': './lib/'
};

// Extensões de arquivos a serem escaneadas
const fileExtensions = ['.js', '.jsx', '.ts', '.tsx'];

// Arquivos encontrados com suas importações
const filesWithImports = [];
const missingModules = new Set();
const pathMappings = {};

// Função para escanear um diretório recursivamente
function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            // Pular node_modules e .next
            if (entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== '.git') {
                scanDir(fullPath);
            }
        } else if (entry.isFile() && fileExtensions.includes(path.extname(entry.name))) {
            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                const imports = findImports(content);

                if (imports.length > 0) {
                    filesWithImports.push({
                        file: fullPath,
                        imports
                    });
                }
            } catch (err) {
                console.error(`❌ Erro ao ler ${fullPath}: ${err.message}`);
            }
        }
    }
}

// Função para encontrar importações no conteúdo do arquivo
function findImports(content) {
    const imports = [];

    // Para cada expressão regular
    importRegexes.forEach((regex, index) => {
        let match;

        // Reiniciar a busca a cada vez
        regex.lastIndex = 0;

        while ((match = regex.exec(content)) !== null) {
            if (index === 0) { // Import padrão
                imports.push({
                    name: match[1],
                    path: match[2]
                });
            } else if (index === 1) { // Import nomeado
                const names = match[1].split(',').map(n => n.trim());
                names.forEach(name => {
                    imports.push({
                        name: name.replace(/\s+as\s+\w+$/, ''), // Remover alias
                        path: match[2]
                    });
                });
            } else if (index === 2) { // Import dinâmico
                imports.push({
                    name: null, // Nome desconhecido
                    path: match[1]
                });
            }
        }
    });

    return imports;
}

// Função para verificar se um módulo existe
function checkModuleExists(importPath) {
    // Mapear caminhos com prefixos
    for (const [prefix, dir] of Object.entries(prefixToDir)) {
        if (importPath.startsWith(prefix)) {
            const mappedPath = importPath.replace(prefix, dir);
            pathMappings[importPath] = mappedPath;

            // Verificar várias extensões possíveis
            for (const ext of [...fileExtensions, '']) {
                const fullPath = path.resolve(process.cwd(), `${mappedPath}${ext}`);
                if (fs.existsSync(fullPath)) {
                    if (ext === '') {
                        // Verificar se é um diretório com um index
                        for (const indexExt of fileExtensions) {
                            if (fs.existsSync(path.join(fullPath, `index${indexExt}`))) {
                                return true;
                            }
                        }
                    } else {
                        return true;
                    }
                }
            }

            // Não encontrado, marcar como ausente
            missingModules.add(importPath);
            return false;
        }
    }

    // Se não começa com prefixo conhecido, verificar se é um módulo npm
    try {
        require.resolve(importPath, { paths: [process.cwd()] });
        return true;
    } catch (e) {
        if (!importPath.startsWith('.')) {
            missingModules.add(importPath);
        }
        return false;
    }
}

// Função para criar stubs para módulos ausentes
function createStubs() {
    console.log(`🔧 Criando stubs para ${missingModules.size} módulos ausentes...`);

    missingModules.forEach(modulePath => {
        // Apenas criar stubs para módulos que começam com @ ou .
        if (!/^[@.]/.test(modulePath)) {
            console.log(`⚠️ Pulando módulo npm: ${modulePath}`);
            return;
        }

        let mappedPath = modulePath;

        // Mapear caminhos com prefixos
        for (const [prefix, dir] of Object.entries(prefixToDir)) {
            if (modulePath.startsWith(prefix)) {
                mappedPath = modulePath.replace(prefix, dir);
                break;
            }
        }

        // Remover ./ do início se existir
        if (mappedPath.startsWith('./')) {
            mappedPath = mappedPath.substring(2);
        }

        // Caminho completo para o arquivo
        const fullPath = path.resolve(process.cwd(), mappedPath);
        const fileDir = path.dirname(fullPath);

        // Criar diretório se não existir
        if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir, { recursive: true });
            console.log(`📁 Diretório criado: ${fileDir}`);
        }

        // Determinar o tipo de arquivo e nome do componente
        let extension = '.js';
        const fileName = path.basename(mappedPath);

        // Se parece ser um componente React, usar .tsx
        if (/^[A-Z]/.test(fileName)) {
            extension = '.tsx';
        } else if (modulePath.includes('/components/') || modulePath.includes('/sections/')) {
            extension = '.tsx';
        } else if (fileName.includes('.')) {
            // Se já tem extensão, não adicionar outra
            extension = '';
        }

        // Nome do componente
        let componentName = path.basename(mappedPath, path.extname(mappedPath));
        componentName = componentName.charAt(0).toUpperCase() + componentName.slice(1);

        // Criar o arquivo stub
        const filePath = `${fullPath}${extension}`;

        // Verificar se já existe
        if (fs.existsSync(filePath)) {
            console.log(`✅ Arquivo já existe: ${filePath}`);
            return;
        }

        // Criar conteúdo do stub com base no tipo
        let stubContent = '';

        if (extension === '.tsx') {
            stubContent = `import React from 'react';

/**
 * Componente stub criado automaticamente para ${modulePath}
 * Este componente é uma implementação minimalista para permitir o build
 */
export default function ${componentName}({ children, ...props }) {
  return (
    <div className="stub-component ${componentName.toLowerCase()}" {...props}>
      {children || <div>Stub para ${componentName}</div>}
    </div>
  );
}
`;
        } else {
            stubContent = `/**
 * Módulo stub criado automaticamente para ${modulePath}
 * Este módulo é uma implementação minimalista para permitir o build
 */
export default function ${componentName}(props) {
  return {
    ...props,
    _isStub: true
  };
}
`;
        }

        fs.writeFileSync(filePath, stubContent);
        console.log(`✅ Stub criado: ${filePath}`);

        // Se não há arquivo index, criar um
        const dirPath = path.dirname(filePath);
        const indexPath = path.join(dirPath, `index${extension}`);

        if (!fs.existsSync(indexPath)) {
            const indexContent = `/**
 * Index gerado automaticamente para ${path.basename(dirPath)}
 */
export { default } from './${path.basename(filePath, extension)}';
`;
            fs.writeFileSync(indexPath, indexContent);
            console.log(`✅ Index criado: ${indexPath}`);
        }
    });
}

// Função principal
function main() {
    // Escanear diretórios
    dirsToScan.forEach(dir => {
        const fullDir = path.join(process.cwd(), dir);
        if (fs.existsSync(fullDir)) {
            console.log(`🔍 Escaneando ${fullDir}...`);
            scanDir(fullDir);
        }
    });

    console.log(`🔍 Encontrados ${filesWithImports.length} arquivos com imports`);

    // Verificar módulos
    filesWithImports.forEach(file => {
        file.imports.forEach(imp => {
            checkModuleExists(imp.path);
        });
    });

    console.log(`❌ Encontrados ${missingModules.size} módulos ausentes`);

    // Criar stubs
    if (missingModules.size > 0) {
        console.log('Módulos ausentes:');
        missingModules.forEach(mod => console.log(`- ${mod}`));

        createStubs();
    }

    console.log('🎉 Processo concluído!');
}

// Executar função principal
main();
