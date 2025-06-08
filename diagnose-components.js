const fs = require('fs');
const path = require('path');

/**
 * DIAGNÓSTICO PROFISSIONAL DE ARQUITETURA DE COMPONENTES
 * Identifica problemas sistêmicos em imports/exports
 */

const results = {
    missingExports: [],
    conflictingPaths: [],
    circularDeps: [],
    invalidImports: [],
    duplicateComponents: []
};

// Mapear todos os arquivos de componentes
function scanDirectory(dir, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
    const files = [];
    
    function walkDir(currentPath) {
        if (currentPath.includes('node_modules') || 
            currentPath.includes('.next') || 
            currentPath.includes('archive')) return;
        
        const items = fs.readdirSync(currentPath);
        
        for (const item of items) {
            const fullPath = path.join(currentPath, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                walkDir(fullPath);
            } else if (extensions.some(ext => item.endsWith(ext))) {
                files.push(fullPath);
            }
        }
    }
    
    walkDir(dir);
    return files;
}

// Analisar imports e exports de um arquivo
function analyzeFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const relativePath = path.relative(process.cwd(), filePath);
        
        // Detectar exports
        const exports = {
            default: false,
            named: [],
            hasExportDefault: /export\s+default\s/.test(content),
            hasExportFunction: /export\s+default\s+function/.test(content),
            hasExportConst: /export\s+default\s+\w+/.test(content)
        };
        
        // Detectar imports problemáticos
        const imports = [];
        const importRegex = /import\s+.*?from\s+['"`]([^'"`]+)['"`]/g;
        let match;
        
        while ((match = importRegex.exec(content)) !== null) {
            imports.push({
                source: match[1],
                full: match[0]
            });
        }
        
        // Verificar se é um componente React
        const isReactComponent = content.includes('jsx') || 
                                content.includes('tsx') || 
                                content.includes('React.createElement') ||
                                content.includes('<') && content.includes('>');
        
        return {
            path: relativePath,
            exports,
            imports,
            isReactComponent,
            content: content.slice(0, 500) // Primeiros 500 chars para debug
        };
        
    } catch (error) {
        console.error(`Erro ao analisar ${filePath}:`, error.message);
        return null;
    }
}

// Detectar componentes com problemas de export
function findMissingExports(analyses) {
    for (const analysis of analyses) {
        if (analysis.isReactComponent && !analysis.exports.hasExportDefault) {
            // Verificar se há function ou const que deveria ser exportada
            const functionMatch = analysis.content.match(/(?:function|const)\s+([A-Z]\w+)/);
            if (functionMatch) {
                results.missingExports.push({
                    file: analysis.path,
                    expectedExport: functionMatch[1],
                    issue: 'Componente React sem export default'
                });
            }
        }
    }
}

// Detectar conflitos de paths de importação
function findConflictingPaths(analyses) {
    const pathMap = {};
    
    for (const analysis of analyses) {
        for (const imp of analysis.imports) {
            if (imp.source.startsWith('@/')) {
                const resolved = imp.source.replace('@/', '');
                if (!pathMap[resolved]) {
                    pathMap[resolved] = [];
                }
                pathMap[resolved].push({
                    file: analysis.path,
                    import: imp.full
                });
            }
        }
    }
    
    // Detectar múltiplos paths para mesmo componente
    for (const [component, usages] of Object.entries(pathMap)) {
        if (usages.length > 1) {
            const uniquePaths = [...new Set(usages.map(u => u.import))];
            if (uniquePaths.length > 1) {
                results.conflictingPaths.push({
                    component,
                    conflictingImports: uniquePaths,
                    usedIn: usages.map(u => u.file)
                });
            }
        }
    }
}

// Detectar componentes duplicados
function findDuplicateComponents(analyses) {
    const componentNames = {};
    
    for (const analysis of analyses) {
        const fileName = path.basename(analysis.path, path.extname(analysis.path));
        if (analysis.isReactComponent) {
            if (!componentNames[fileName]) {
                componentNames[fileName] = [];
            }
            componentNames[fileName].push(analysis.path);
        }
    }
    
    for (const [name, paths] of Object.entries(componentNames)) {
        if (paths.length > 1) {
            results.duplicateComponents.push({
                name,
                paths
            });
        }
    }
}

// Executar diagnóstico completo
function runDiagnosis() {
    try {
        console.log('🏗️  DIAGNÓSTICO ARQUITETURAL NOVA IPÊ');
        console.log('=====================================\n');
        
        const projectRoot = process.cwd();
        console.log('📍 Diretório:', projectRoot);
        
        const files = scanDirectory(projectRoot);
        console.log(`📁 Analisando ${files.length} arquivos...\n`);// Executar diagnóstico completo
function runDiagnosis() {
    try {
        console.log('🏗️  DIAGNÓSTICO ARQUITETURAL NOVA IPÊ');
        console.log('=====================================\n');
        
        const projectRoot = process.cwd();
        console.log('📍 Diretório:', projectRoot);
        
        const files = scanDirectory(projectRoot);
        console.log(`📁 Analisando ${files.length} arquivos...\n`);
        
        const analyses = files.map(analyzeFile).filter(Boolean);
        
        findMissingExports(analyses);
        findConflictingPaths(analyses);
        findDuplicateComponents(analyses);
        
        // Relatório
        console.log('🚨 PROBLEMAS CRÍTICOS ENCONTRADOS:');
        console.log('==================================\n');
        
        if (results.missingExports.length > 0) {
            console.log('❌ EXPORTS AUSENTES:');
            results.missingExports.forEach(item => {
                console.log(`   ${item.file} -> ${item.expectedExport}`);
                console.log(`   Issue: ${item.issue}\n`);
            });
        }
        
        if (results.conflictingPaths.length > 0) {
            console.log('⚠️  CONFLITOS DE PATH:');
            results.conflictingPaths.forEach(item => {
                console.log(`   Componente: ${item.component}`);
                console.log(`   Paths conflitantes: ${item.conflictingImports.join(' vs ')}`);
                console.log(`   Usado em: ${item.usedIn.length} arquivos\n`);
            });
        }
        
        if (results.duplicateComponents.length > 0) {
            console.log('🔄 COMPONENTES DUPLICADOS:');
            results.duplicateComponents.forEach(item => {
                console.log(`   ${item.name}:`);
                item.paths.forEach(p => console.log(`     - ${p}`));
                console.log('');
            });
        }
        
        console.log('💡 RECOMENDAÇÕES ARQUITETURAIS:');
        console.log('===============================');
        console.log('1. Consolidar todos os componentes UI em /components/ui/');
        console.log('2. Padronizar imports usando apenas @/components/');
        console.log('3. Remover duplicatas e arquivos obsoletos');
        console.log('4. Implementar barrel exports (index.ts)');
        console.log('5. Validar todos os default exports\n');
        
        // Salvar relatório detalhado
        fs.writeFileSync(
            'component-diagnosis-report.json', 
            JSON.stringify(results, null, 2)
        );
        
        console.log('📄 Relatório detalhado salvo em: component-diagnosis-report.json');
        
        return results;
        
    } catch (error) {
        console.error('❌ Erro no diagnóstico:', error.message);
        console.error(error.stack);
        return null;
    }
}

module.exports = { runDiagnosis };

if (require.main === module) {
    runDiagnosis();
}
