/**
 * Script de diagnóstico para problemas de imagens Sanity
 * Ferramenta para identificar e reparar problemas de carregamento de imagens
 * Data: Maio 2025
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configurações
const CONFIG = {
    logFile: './image-rendering-implementation.log', // Log de erros de imagem
    reportFile: './sanity-image-diagnostic-report.json', // Relatório gerado
    sampleSize: 50, // Número de registros de erro para analisar
    fixProblems: false // Ativar para tentar corrigir problemas automaticamente
};

// Padrões para identificar problemas específicos
const ERROR_PATTERNS = {
    missingAsset: /asset is (undefined|null)/i,
    emptyReference: /empty.+reference/i,
    malformedStructure: /estrutura de imagem não reconhecida/i,
    nullImage: /imagem nula ou indefinida/i,
    invalidReference: /referência sanity inválida/i
};

// Categorias de problemas
const ISSUE_CATEGORIES = {
    STRUCTURE: 'structural', // Problema na estrutura do objeto
    REFERENCE: 'reference',  // Problema na referência Sanity
    NULL: 'null',           // Valor nulo ou indefinido
    NETWORK: 'network',     // Problema de rede / CDN
    UNKNOWN: 'unknown'      // Não categorizado
};

// Contadores para estatísticas
const statistics = {
    totalIssues: 0,
    categorized: {
        [ISSUE_CATEGORIES.STRUCTURE]: 0,
        [ISSUE_CATEGORIES.REFERENCE]: 0,
        [ISSUE_CATEGORIES.NULL]: 0,
        [ISSUE_CATEGORIES.NETWORK]: 0,
        [ISSUE_CATEGORIES.UNKNOWN]: 0
    },
    propertyIds: new Set(), // IDs únicos de imóveis com problemas
    uniqueErrors: new Set() // Mensagens únicas de erro
};

/**
 * Analisa logs para identificar problemas com imagens
 */
async function analyzeImageLogs() {
    try {
        console.log('Iniciando análise de logs de imagem...');

        // Verificar se o arquivo de log existe
        if (!fs.existsSync(CONFIG.logFile)) {
            console.error(`Arquivo de log não encontrado: ${CONFIG.logFile}`);
            return;
        }

        // Criar interface de leitura de linha
        const fileStream = fs.createReadStream(CONFIG.logFile);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        // Coletar entradas de log relevantes
        const issues = [];
        let lineCount = 0;

        console.log('Processando logs...');

        for await (const line of rl) {
            lineCount++;

            // Procurar por linhas que indicam erros de imagem
            if (line.includes('[Image Extractor]') || line.includes('[IMAGE LOADER]')) {
                // Verificar se é uma linha de erro ou aviso
                if (line.includes('erro') || line.includes('falha') || line.includes('⚠️') || line.includes('🚨')) {
                    statistics.totalIssues++;

                    // Extrair ID do imóvel se possível
                    const propertyIdMatch = line.match(/imóvel[:\s]+([a-z0-9-]+)/i) || line.match(/id[:\s]+([a-z0-9-]+)/i);
                    const propertyId = propertyIdMatch ? propertyIdMatch[1] : 'unknown';

                    if (propertyId !== 'unknown') {
                        statistics.propertyIds.add(propertyId);
                    }

                    // Categorizar o erro
                    let category = ISSUE_CATEGORIES.UNKNOWN;

                    if (ERROR_PATTERNS.missingAsset.test(line) || ERROR_PATTERNS.malformedStructure.test(line)) {
                        category = ISSUE_CATEGORIES.STRUCTURE;
                        statistics.categorized[ISSUE_CATEGORIES.STRUCTURE]++;
                    } else if (ERROR_PATTERNS.emptyReference.test(line) || ERROR_PATTERNS.invalidReference.test(line)) {
                        category = ISSUE_CATEGORIES.REFERENCE;
                        statistics.categorized[ISSUE_CATEGORIES.REFERENCE]++;
                    } else if (ERROR_PATTERNS.nullImage.test(line)) {
                        category = ISSUE_CATEGORIES.NULL;
                        statistics.categorized[ISSUE_CATEGORIES.NULL]++;
                    } else {
                        statistics.categorized[ISSUE_CATEGORIES.UNKNOWN]++;
                    }

                    // Adicionar mensagem de erro única
                    statistics.uniqueErrors.add(line);

                    // Adicionar o problema à lista para análise
                    issues.push({
                        line: lineCount,
                        message: line,
                        propertyId,
                        category
                    });

                    // Limitar número de problemas analisados
                    if (issues.length >= CONFIG.sampleSize) {
                        break;
                    }
                }
            }
        }

        // Gerar relatório com resultados
        generateReport(issues);

    } catch (error) {
        console.error('Erro ao analisar logs:', error);
    }
}

/**
 * Gera relatório com os problemas encontrados
 */
function generateReport(issues) {
    console.log('\n📊 RELATÓRIO DE DIAGNÓSTICO DE IMAGENS 📊');
    console.log('========================================');
    console.log(`Total de problemas encontrados: ${statistics.totalIssues}`);
    console.log(`Imóveis afetados: ${statistics.propertyIds.size}`);
    console.log(`Tipos únicos de erro: ${statistics.uniqueErrors.size}`);
    console.log('\nDistrbuição por categoria:');

    Object.entries(statistics.categorized).forEach(([category, count]) => {
        const percentage = statistics.totalIssues > 0
            ? Math.round((count / statistics.totalIssues) * 100)
            : 0;
        console.log(`- ${category}: ${count} (${percentage}%)`);
    });

    console.log('\nAmostra de problemas:');
    issues.slice(0, 5).forEach((issue, index) => {
        console.log(`\n[${index + 1}] Linha ${issue.line} - Categoria: ${issue.category}`);
        console.log(`    ${issue.message}`);
    });

    // Salvar relatório completo como JSON
    const report = {
        timestamp: new Date().toISOString(),
        statistics: {
            total: statistics.totalIssues,
            affectedProperties: Array.from(statistics.propertyIds),
            categoryCounts: statistics.categorized
        },
        sampleIssues: issues.slice(0, 20) // Limitar a 20 exemplos no relatório
    };

    fs.writeFileSync(CONFIG.reportFile, JSON.stringify(report, null, 2));
    console.log(`\nRelatório completo salvo em: ${CONFIG.reportFile}`);

    // Sugerir soluções
    suggestSolutions();
}

/**
 * Sugere soluções com base nos problemas encontrados
 */
function suggestSolutions() {
    console.log('\n🔧 RECOMENDAÇÕES DE CORREÇÃO 🔧');
    console.log('================================');

    // Problemas estruturais
    if (statistics.categorized[ISSUE_CATEGORIES.STRUCTURE] > 0) {
        console.log('\n1. PROBLEMAS ESTRUTURAIS:');
        console.log('   - Verificar o schema do Sanity para garantir que o campo "imagem" está configurado corretamente');
        console.log('   - Confirmar que o modelo de dados do cliente está mapeando corretamente a estrutura do Sanity');
        console.log('   - Implementar transformação adicional em mapImovelToClient.ts para lidar com diferentes formatos');
    }

    // Problemas de referência
    if (statistics.categorized[ISSUE_CATEGORIES.REFERENCE] > 0) {
        console.log('\n2. PROBLEMAS DE REFERÊNCIA:');
        console.log('   - Verificar se as referências do Sanity estão sendo exportadas corretamente');
        console.log('   - Implementar validação adicional para referências vazias ou malformadas');
        console.log('   - Considerar usar o enhanced-image-loader.ts para todas as imagens do site');
    }

    // Problemas de valores nulos
    if (statistics.categorized[ISSUE_CATEGORIES.NULL] > 0) {
        console.log('\n3. VALORES NULOS:');
        console.log('   - Adicionar validação para garantir que imóveis sem imagens recebam placeholders apropriados');
        console.log('   - Revisar o fluxo de dados para identificar onde os valores nulos estão sendo introduzidos');
    }

    // Próximos passos recomendados
    console.log('\n▶️ PRÓXIMOS PASSOS:');
    console.log('1. Substitua o componente <img> por <PropertyImage> em todos os locais que exibem imagens de imóveis');
    console.log('2. Atualize a função transformPropertyData para usar o loadImage em vez de ensureValidImageUrl');
    console.log('3. Implemente o monitoramento de erros de imagem em produção para diagnóstico contínuo');

    console.log('\n✨ Use o script fix-images.js para tentar corrigir automaticamente problemas detectados ✨');
}

// Executar a análise
analyzeImageLogs()
    .then(() => console.log('\nAnálise concluída.'))
    .catch(err => console.error('Erro durante a análise:', err));
