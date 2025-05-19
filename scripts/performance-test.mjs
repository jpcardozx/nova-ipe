// performance-test.mjs
/**
 * Script para testar e validar as melhorias de performance
 * 
 * Este script executa testes de performance automatizados para verificar
 * se as otimizações implementadas estão de fato melhorando as métricas críticas.
 */

import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';

const BASE_URL = 'http://localhost:3000';
const PAGES = [
    { path: '/alugar', name: 'Alugar Page' },
    { path: '/comprar', name: 'Comprar Page' },
    { path: '/', name: 'Home Page' },
];

// Métricas originais para comparação
const ORIGINAL_METRICS = {
    lcp: 78056,
    tbt: 57778,
    resourceAlugar: 6860,
    resourceComprar: 6860
};

// Função para formatar os números
function formatNumber(num) {
    return num.toLocaleString('pt-BR');
}

// Função para calcular melhoria
function calculateImprovement(current, original) {
    const diff = original - current;
    const percentage = (diff / original) * 100;
    return {
        value: diff,
        percentage: percentage.toFixed(2)
    };
}

// Função principal para executar os testes
async function runPerformanceTests() {
    console.log('🚀 Iniciando testes de performance para Nova IPE...\n');

    const results = {
        timestamp: new Date().toISOString(),
        pages: [],
        summary: {
            lcpImprovement: 0,
            tbtImprovement: 0,
            avgLoadTimeImprovement: 0
        }
    };

    // Iniciar o navegador
    const browser = await puppeteer.launch({
        headless: 'new', // Use o novo modo headless
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    for (const page of PAGES) {
        console.log(`📝 Testando ${page.name} (${page.path})...`);

        const pageMetrics = {
            name: page.name,
            path: page.path,
            metrics: {}
        };

        try {
            // Criar nova página
            const tab = await browser.newPage();

            // Habilitar métricas de performance
            await tab.evaluateOnNewDocument(() => {
                window.performanceMetrics = {
                    lcp: 0,
                    fcp: 0,
                    ttfb: 0,
                    cls: 0,
                    resources: {},
                    longTasks: []
                };

                // Observer para LCP
                new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    if (lastEntry) {
                        window.performanceMetrics.lcp = lastEntry.startTime;
                    }
                }).observe({ type: 'largest-contentful-paint', buffered: true });

                // Observer para FCP
                new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    if (entries.length > 0) {
                        window.performanceMetrics.fcp = entries[0].startTime;
                    }
                }).observe({ type: 'paint', buffered: true });

                // Observer para recursos
                new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        const url = entry.name;
                        if (url.includes(window.location.origin)) {
                            const path = url.replace(window.location.origin, '');
                            window.performanceMetrics.resources[path] = entry.duration;
                        }
                    });
                }).observe({ type: 'resource', buffered: true });

                // Observer para long tasks
                new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    window.performanceMetrics.longTasks = entries.map(entry => ({
                        duration: entry.duration,
                        startTime: entry.startTime
                    }));
                }).observe({ type: 'longtask', buffered: true });

                // Performance timing
                window.addEventListener('load', () => {
                    const timing = performance.getEntriesByType('navigation')[0];
                    if (timing) {
                        window.performanceMetrics.ttfb = timing.responseStart - timing.requestStart;
                    }
                });
            });

            // Navegar para a página
            const start = Date.now();
            await tab.goto(`${BASE_URL}${page.path}?debug-performance=true`, {
                waitUntil: 'networkidle2',
                timeout: 60000
            });
            const loadTime = Date.now() - start;

            // Aguardar para capturar métricas
            await new Promise(r => setTimeout(r, 3000));

            // Coletar métricas
            const metrics = await tab.evaluate(() => {
                return window.performanceMetrics;
            });

            // Calcular TBT (Total Blocking Time)
            let tbt = 0;
            if (metrics.longTasks && metrics.longTasks.length > 0) {
                tbt = metrics.longTasks.reduce((total, task) => {
                    return total + (task.duration > 50 ? task.duration - 50 : 0);
                }, 0);
            }

            // Salvar métricas
            pageMetrics.metrics = {
                lcp: metrics.lcp,
                fcp: metrics.fcp,
                ttfb: metrics.ttfb,
                totalLoadTime: loadTime,
                tbt,
                resourceCount: Object.keys(metrics.resources).length,
                longTasksCount: metrics.longTasks?.length || 0
            };

            // Calcular melhorias
            const improvement = {
                lcp: calculateImprovement(metrics.lcp, ORIGINAL_METRICS.lcp),
                tbt: calculateImprovement(tbt, ORIGINAL_METRICS.tbt),
                loading: calculateImprovement(
                    loadTime,
                    page.path.includes('alugar')
                        ? ORIGINAL_METRICS.resourceAlugar
                        : page.path.includes('comprar')
                            ? ORIGINAL_METRICS.resourceComprar
                            : 10000
                )
            };

            // Adicionar melhorias às métricas
            pageMetrics.improvement = improvement;

            // Adicionar à lista de páginas testadas
            results.pages.push(pageMetrics);

            // Log dos resultados
            console.log(`  ✅ LCP: ${formatNumber(metrics.lcp)}ms (${improvement.lcp.percentage}% melhor)`);
            console.log(`  ✅ TBT: ${formatNumber(tbt)}ms (${improvement.tbt.percentage}% melhor)`);
            console.log(`  ✅ Tempo de carregamento: ${formatNumber(loadTime)}ms (${improvement.loading.percentage}% melhor)`);
            console.log(`  ✅ Tarefas longas: ${metrics.longTasks?.length || 0}`);
            console.log('');

            // Fechar a página
            await tab.close();
        } catch (error) {
            console.error(`  ❌ Erro ao testar ${page.name}:`, error);
            pageMetrics.error = error.message;
            results.pages.push(pageMetrics);
        }
    }

    // Calcular métricas médias
    if (results.pages.length > 0) {
        let totalLcpImprovement = 0;
        let totalTbtImprovement = 0;
        let totalLoadTimeImprovement = 0;
        let validPages = 0;

        for (const page of results.pages) {
            if (page.improvement) {
                totalLcpImprovement += parseFloat(page.improvement.lcp.percentage);
                totalTbtImprovement += parseFloat(page.improvement.tbt.percentage);
                totalLoadTimeImprovement += parseFloat(page.improvement.loading.percentage);
                validPages++;
            }
        }

        if (validPages > 0) {
            results.summary = {
                lcpImprovement: (totalLcpImprovement / validPages).toFixed(2),
                tbtImprovement: (totalTbtImprovement / validPages).toFixed(2),
                avgLoadTimeImprovement: (totalLoadTimeImprovement / validPages).toFixed(2)
            };
        }
    }

    // Fechar o navegador
    await browser.close();

    // Salvar resultados
    const reportPath = './performance-test-results.json';
    writeFileSync(reportPath, JSON.stringify(results, null, 2));

    // Exibir resumo dos testes
    console.log('📊 Resumo das Melhorias:');
    console.log(`  • LCP: ${results.summary.lcpImprovement}% melhor`);
    console.log(`  • Thread Blocking: ${results.summary.tbtImprovement}% melhor`);
    console.log(`  • Tempo de carregamento: ${results.summary.avgLoadTimeImprovement}% melhor`);
    console.log(`\n📋 Relatório completo salvo em: ${reportPath}`);
}

// Executar os testes
runPerformanceTests().catch(error => {
    console.error('❌ Erro ao executar os testes de performance:', error);
    process.exit(1);
});
