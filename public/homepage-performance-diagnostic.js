/**
 * Homepage Performance Diagnostic Script (client-side)
 * 
 * Este script pode ser colado no console do navegador para diagnosticar o desempenho
 * de carregamento dos elementos críticos na página inicial.
 */

(function () {
    // Observador de carregamento de elementos críticos
    const elementObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            console.log(`Elemento "${entry.element.tagName}${entry.element.id ? '#' + entry.element.id : ''}" renderizado: ${Math.round(entry.startTime)}ms`);
        });
    });

    // Observador de recursos (imagens, scripts, css)
    const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            // Para recursos de URL completa, extrair apenas o nome do arquivo
            const url = entry.name;
            const fileName = url.split('/').pop();

            console.log(
                `Recurso ${fileName} carregado: ${Math.round(entry.startTime)}ms -> ${Math.round(entry.startTime + entry.duration)}ms (${Math.round(entry.duration)}ms)`
            );
        });
    });

    // Inicia a observação de elementos
    try {
        elementObserver.observe({ type: 'element', buffered: true });
        resourceObserver.observe({ type: 'resource', buffered: true });
    } catch (e) {
        console.log('PerformanceObserver não suportado neste navegador');
    }

    // Função para medir o tempo inicial de renderização de elementos críticos
    function measureCriticalElements() {
        const criticalElements = [
            { selector: 'nav.navbar', name: 'Barra de navegação' },
            { selector: '.container h1', name: 'Título principal' },
            { selector: 'img', name: 'Primeira imagem', first: true },
            { selector: '.grid', name: 'Layout de grid' },
            { selector: 'footer', name: 'Rodapé' }
        ];

        console.group('🔎 Diagnóstico de carregamento de elementos críticos:');
        criticalElements.forEach(item => {
            const elements = document.querySelectorAll(item.selector);
            if (elements.length === 0) {
                console.log(`❌ ${item.name} (${item.selector}) não encontrado`);
                return;
            }

            const element = item.first ? elements[0] : elements[elements.length - 1];
            const rect = element.getBoundingClientRect();
            console.log(
                `✅ ${item.name}: visível ${rect.top < window.innerHeight ? 'na viewport' : 'fora da viewport'}, 
        posição top=${Math.round(rect.top)}px`
            );
        });
        console.groupEnd();
    }

    // Aguarda o carregamento da página e realiza a medição
    window.addEventListener('load', () => {
        setTimeout(measureCriticalElements, 500);

        // Informações gerais de performance
        const nav = performance.getEntriesByType('navigation')[0];
        console.group('📊 Métricas de carregamento da página:');
        console.log(`⏱️ DOMContentLoaded: ${Math.round(nav.domContentLoadedEventEnd)}ms`);
        console.log(`⏱️ Load completo: ${Math.round(nav.loadEventEnd)}ms`);
        console.log(`⏱️ Tempo de resposta do servidor: ${Math.round(nav.responseEnd - nav.requestStart)}ms`);
        console.groupEnd();

        // Links para ferramentas de diagnóstico
        console.log('🔗 Acesse o diagnóstico otimizado em: /pwa-diagnostico-optimized');
    });
})();
