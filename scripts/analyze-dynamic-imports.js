/**
 * analyze-dynamic-imports.js
 * 
 * Este script analisa todos os arquivos .tsx e .ts do projeto para identificar
 * imports dinâmicos que podem estar prejudicando o tempo de build.
 * 
 * Uso:
 * node scripts/analyze-dynamic-imports.js
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

// Expressões regulares para encontrar imports dinâmicos
const DYNAMIC_IMPORT_PATTERNS = [
    /dynamic\s*\(\s*\(\)\s*=>\s*import\(['"]([^'"]+)['"]\)/g,   // dynamic(() => import('...'))
    /dynamic\s*\(\s*import\(['"]([^'"]+)['"]\)/g,               // dynamic(import('...'))
    /import\(['"]([^'"]+)['"]\)/g                               // import('...')
];

// Extensões a serem verificadas
const EXTENSIONS_TO_CHECK = ['.ts', '.tsx', '.js', '.jsx'];

// Diretórios a ignorar
const IGNORE_DIRS = ['node_modules', '.next', '.git', 'public'];

// Função para verificar se um caminho deve ser ignorado
const shouldIgnore = (filePath) => {
    return IGNORE_DIRS.some(dir => filePath.includes(dir));
};

// Função para encontrar todos os arquivos recursivamente
async function findFiles(dir, fileList = []) {
    const files = await readdir(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        if (shouldIgnore(filePath)) continue;

        const fileStat = await stat(filePath);

        if (fileStat.isDirectory()) {
            fileList = await findFiles(filePath, fileList);
        } else {
            const ext = path.extname(filePath);
            if (EXTENSIONS_TO_CHECK.includes(ext)) {
                fileList.push(filePath);
            }
        }
    }

    return fileList;
}

// Função para analisar o conteúdo de um arquivo
async function analyzeFile(filePath) {
    try {
        const content = await readFile(filePath, 'utf8');
        const findings = [];

        DYNAMIC_IMPORT_PATTERNS.forEach(pattern => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                findings.push({
                    importPath: match[1],
                    pattern: match[0].substring(0, 30) + (match[0].length > 30 ? '...' : ''),
                    line: content.substring(0, match.index).split('\n').length
                });
            }
        });

        if (findings.length > 0) {
            return {
                filePath: path.relative(process.cwd(), filePath),
                findings
            };
        }

        return null;
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
        return null;
    }
}

// Função principal
async function main() {
    console.log('Analisando imports dinâmicos no projeto...');

    try {
        const startTime = Date.now();
        const files = await findFiles(process.cwd());
        console.log(`Encontrados ${files.length} arquivos para analisar.`);

        const results = [];
        let totalImports = 0;

        for (const file of files) {
            const result = await analyzeFile(file);
            if (result) {
                results.push(result);
                totalImports += result.findings.length;
            }
        }

        // Ordenar resultados pelo número de imports dinâmicos (decrescente)
        results.sort((a, b) => b.findings.length - a.findings.length);

        console.log('\n============ RESULTADOS DA ANÁLISE ============');
        console.log(`Total de imports dinâmicos encontrados: ${totalImports}`);
        console.log(`Arquivos com imports dinâmicos: ${results.length}`);
        console.log('');

        if (results.length > 0) {
            console.log('Top 10 arquivos com mais imports dinâmicos:');
            results.slice(0, 10).forEach(result => {
                console.log(`\n${result.filePath} (${result.findings.length} imports):`);
                result.findings.forEach(finding => {
                    console.log(`  - Linha ${finding.line}: ${finding.importPath}`);
                });
            });

            // Análise por tipo de componente
            const iconImports = results.flatMap(r =>
                r.findings.filter(f => f.importPath.includes('icon') || f.importPath.includes('lucide'))
            );

            const uiImports = results.flatMap(r =>
                r.findings.filter(f => f.importPath.includes('ui/') || f.importPath.includes('components/'))
            );

            console.log('\n============ ANÁLISE POR CATEGORIAS ============');
            console.log(`Imports de ícones: ${iconImports.length}`);
            console.log(`Imports de componentes UI: ${uiImports.length}`);

            // Criar relatório detalhado em arquivo
            const report = {
                summary: {
                    totalFiles: files.length,
                    filesWithDynamicImports: results.length,
                    totalDynamicImports: totalImports,
                },
                categories: {
                    icons: iconImports.length,
                    uiComponents: uiImports.length,
                    other: totalImports - iconImports.length - uiImports.length
                },
                results
            };

            fs.writeFileSync('dynamic-imports-report.json', JSON.stringify(report, null, 2));
            console.log('\nRelatório completo salvo em "dynamic-imports-report.json"');
        } else {
            console.log('Não foram encontrados imports dinâmicos no projeto.');
        }

        const elapsedTime = (Date.now() - startTime) / 1000;
        console.log(`\nAnálise concluída em ${elapsedTime.toFixed(2)} segundos.`);
    } catch (error) {
        console.error('Erro na análise:', error);
    }
}

main();
