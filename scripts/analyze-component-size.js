/**
 * analyze-component-size.js
 * 
 * Este script analisa o tamanho dos componentes React no projeto,
 * identificando aqueles que podem estar impactando o tempo de build.
 * 
 * Uso:
 * node scripts/analyze-component-size.js
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

// Diretórios a serem verificados (relativo à raiz do projeto)
const DIRS_TO_CHECK = [
    './app',
    './app/components',
    './app/sections',
    './components',
    './sections'
];

// Extensões a serem verificadas
const COMPONENT_EXTENSIONS = ['.tsx', '.jsx'];

// Diretórios a ignorar
const IGNORE_DIRS = ['node_modules', '.next', '.git'];

// Função para verificar se um caminho deve ser ignorado
const shouldIgnore = (filePath) => {
    return IGNORE_DIRS.some(dir => filePath.includes(dir));
};

// Função para encontrar todos os arquivos de componentes
async function findComponentFiles(dir) {
    try {
        const files = await readdir(dir);
        let componentFiles = [];

        for (const file of files) {
            const filePath = path.join(dir, file);
            if (shouldIgnore(filePath)) continue;

            const fileStat = await stat(filePath);

            if (fileStat.isDirectory()) {
                const subDirComponents = await findComponentFiles(filePath);
                componentFiles = [...componentFiles, ...subDirComponents];
            } else {
                const ext = path.extname(file);
                if (COMPONENT_EXTENSIONS.includes(ext)) {
                    componentFiles.push({
                        path: filePath,
                        size: fileStat.size,
                        name: path.basename(file, ext)
                    });
                }
            }
        }

        return componentFiles;
    } catch (error) {
        console.error(`Erro ao verificar diretório ${dir}:`, error.message);
        return [];
    }
}

// Função para analisar o conteúdo de um componente
async function analyzeComponent(componentFile) {
    try {
        const content = await readFile(componentFile.path, 'utf8');
        const lines = content.split('\n');

        // Contagem de elementos
        const jsxElements = (content.match(/<[A-Z][^>]*>/g) || []).length;
        const stateHooks = (content.match(/useState\(/g) || []).length;
        const effectHooks = (content.match(/useEffect\(/g) || []).length;
        const memoHooks = (content.match(/useMemo\(/g) || []).length;
        const callbackHooks = (content.match(/useCallback\(/g) || []).length;

        return {
            ...componentFile,
            relativePath: path.relative(process.cwd(), componentFile.path),
            lineCount: lines.length,
            jsxElements,
            hooks: {
                state: stateHooks,
                effect: effectHooks,
                memo: memoHooks,
                callback: callbackHooks,
                total: stateHooks + effectHooks + memoHooks + callbackHooks
            }
        };
    } catch (error) {
        console.error(`Erro ao analisar ${componentFile.path}:`, error.message);
        return null;
    }
}

// Função para formatar tamanho em KB
function formatSize(bytes) {
    return (bytes / 1024).toFixed(2) + ' KB';
}

// Função principal
async function main() {
    console.log('Analisando tamanho dos componentes React...');

    try {
        const startTime = Date.now();
        let allComponentFiles = [];

        for (const dir of DIRS_TO_CHECK) {
            try {
                const componentFiles = await findComponentFiles(dir);
                allComponentFiles = [...allComponentFiles, ...componentFiles];
            } catch (error) {
                // Ignorar diretórios que não existem
                if (error.code !== 'ENOENT') {
                    console.error(`Erro ao processar diretório ${dir}:`, error);
                }
            }
        }

        console.log(`Encontrados ${allComponentFiles.length} componentes para analisar.`);

        // Remover duplicatas (por caminho)
        const uniquePaths = new Set();
        allComponentFiles = allComponentFiles.filter(file => {
            if (uniquePaths.has(file.path)) return false;
            uniquePaths.add(file.path);
            return true;
        });

        // Analisar cada componente
        const analyzedComponents = [];
        for (const componentFile of allComponentFiles) {
            const analysis = await analyzeComponent(componentFile);
            if (analysis) {
                analyzedComponents.push(analysis);
            }
        }

        // Ordenar por tamanho (decrescente)
        analyzedComponents.sort((a, b) => b.size - a.size);

        console.log('\n============ RESULTADOS DA ANÁLISE ============');
        console.log(`Total de componentes analisados: ${analyzedComponents.length}`);

        // Top componentes por tamanho
        console.log('\nTop 15 componentes por tamanho:');
        analyzedComponents.slice(0, 15).forEach((component, index) => {
            console.log(`${index + 1}. ${component.relativePath}`);
            console.log(`   Tamanho: ${formatSize(component.size)} | Linhas: ${component.lineCount} | Elementos JSX: ${component.jsxElements} | Hooks: ${component.hooks.total}`);
        });

        // Top componentes por número de hooks
        const byHooks = [...analyzedComponents].sort((a, b) => b.hooks.total - a.hooks.total);
        console.log('\nTop 10 componentes por número de hooks:');
        byHooks.slice(0, 10).forEach((component, index) => {
            console.log(`${index + 1}. ${component.relativePath}`);
            console.log(`   Total de hooks: ${component.hooks.total} (useState: ${component.hooks.state}, useEffect: ${component.hooks.effect}, useMemo: ${component.hooks.memo}, useCallback: ${component.hooks.callback})`);
        });

        // Top componentes por elementos JSX
        const byJSX = [...analyzedComponents].sort((a, b) => b.jsxElements - a.jsxElements);
        console.log('\nTop 10 componentes por elementos JSX:');
        byJSX.slice(0, 10).forEach((component, index) => {
            console.log(`${index + 1}. ${component.relativePath}`);
            console.log(`   Elementos JSX: ${component.jsxElements} | Tamanho: ${formatSize(component.size)} | Linhas: ${component.lineCount}`);
        });

        // Estatísticas gerais
        const totalSize = analyzedComponents.reduce((sum, c) => sum + c.size, 0);
        const averageSize = totalSize / analyzedComponents.length;
        const averageLines = analyzedComponents.reduce((sum, c) => sum + c.lineCount, 0) / analyzedComponents.length;

        console.log('\n============ ESTATÍSTICAS GERAIS ============');
        console.log(`Tamanho médio dos componentes: ${formatSize(averageSize)}`);
        console.log(`Média de linhas por componente: ${averageLines.toFixed(1)}`);
        console.log(`Tamanho total de todos os componentes: ${formatSize(totalSize)}`);

        // Componentes grandes que podem ser divididos
        const largeComponents = analyzedComponents.filter(c => c.lineCount > 300 || c.jsxElements > 50);

        if (largeComponents.length > 0) {
            console.log('\n============ CANDIDATOS PARA DIVISÃO ============');
            console.log('Os seguintes componentes são muito grandes e podem ser divididos:');
            largeComponents.forEach((component, index) => {
                console.log(`${index + 1}. ${component.relativePath}`);
                console.log(`   Linhas: ${component.lineCount} | Elementos JSX: ${component.jsxElements} | Tamanho: ${formatSize(component.size)}`);
            });
        }

        // Salvar relatório completo em JSON
        const report = {
            summary: {
                totalComponents: analyzedComponents.length,
                totalSize: totalSize,
                averageSize: averageSize,
                averageLines: averageLines,
            },
            largeComponentCount: largeComponents.length,
            components: analyzedComponents.map(c => ({
                name: c.name,
                path: c.relativePath,
                size: c.size,
                sizeFormatted: formatSize(c.size),
                lineCount: c.lineCount,
                jsxElements: c.jsxElements,
                hooks: c.hooks
            }))
        };

        fs.writeFileSync('component-size-report.json', JSON.stringify(report, null, 2));
        console.log('\nRelatório completo salvo em "component-size-report.json"');

        const elapsedTime = (Date.now() - startTime) / 1000;
        console.log(`\nAnálise concluída em ${elapsedTime.toFixed(2)} segundos.`);
    } catch (error) {
        console.error('Erro na análise:', error);
    }
}

main();
