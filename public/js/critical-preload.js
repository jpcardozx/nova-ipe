// Este script deve ser executado o mais cedo possível para garantir carregamento rápido
// Evita travamentos mesmo em conexões lentas

(function () {
    // Função auxiliar para detectar o tipo de dispositivo/navegador
    function detectEnvironment() {
        return {
            isMobile: /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            isWhatsApp: /WhatsApp/.test(navigator.userAgent) || document.referrer.includes('whatsapp'),
            isSlowConnection: 'connection' in navigator &&
                (navigator.connection.saveData ||
                    ['slow-2g', '2g', '3g'].includes(navigator.connection.effectiveType)),
            supportsIntersectionObserver: 'IntersectionObserver' in window
        };
    }

    // Detecta ambiente de execução
    const env = detectEnvironment();

    // Define atributos HTML baseados no ambiente
    if (env.isMobile) document.documentElement.setAttribute('data-mobile', 'true');
    if (env.isWhatsApp) document.documentElement.setAttribute('data-whatsapp', 'true');
    if (env.isSlowConnection) document.documentElement.setAttribute('data-slow-connection', 'true');

    // Função para garantir visibilidade mesmo em casos de falha
    function ensureVisibility() {
        // Remove estado de loading
        document.documentElement.removeAttribute('data-loading-state');
        document.documentElement.setAttribute('data-loaded', 'true');

        // Força visibilidade do body
        if (document.body) {
            document.body.style.visibility = 'visible';
            document.body.style.opacity = '1';

            // Adiciona classe específica
            if (env.isWhatsApp) document.body.classList.add('from-whatsapp');
            if (env.isSlowConnection) document.body.classList.add('slow-connection');
        }
    }

    // Implementa sistema de fallbacks para garantir que a página seja visível
    // mesmo que ocorram problemas de carregamento

    // 1. Executa imediatamente se documento já estiver interativo
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        ensureVisibility();
    }
    // 2. Adiciona listener para quando o DOM estiver pronto
    else {
        document.addEventListener('DOMContentLoaded', ensureVisibility);
    }

    // 3. Fallback: garante visibilidade após um tempo em qualquer situação
    // Tempo mais curto para WhatsApp ou conexões lentas
    const timeout = env.isWhatsApp || env.isSlowConnection ? 1000 : 3000;
    setTimeout(ensureVisibility, timeout);

    // 4. Último recurso: se após 5s ainda estiver carregando, força visibilidade
    setTimeout(function () {
        ensureVisibility();

        // Tenta buscar e exibir conteúdo principal diretamente
        const mainContent = document.querySelector('main');
        if (mainContent && !mainContent.innerHTML.trim()) {
            mainContent.innerHTML = '<div class="p-4 text-center"><p>Carregando conteúdo...</p></div>';
        }

        // Remove qualquer indicador de carregamento persistente
        document.querySelectorAll('.loading-indicator').forEach(function (el) {
            el.style.display = 'none';
        });
    }, 5000);

    // Pré-carrega recursos críticos para melhorar LCP
    function preloadCriticalResources() {
        // Apenas pré-carrega se não for conexão lenta
        if (env.isSlowConnection) return;

        const criticalResources = [
            '/images/logo.png',
            '/images/hero-image.jpg'
        ];

        criticalResources.forEach(function (url) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = url.endsWith('.css') ? 'style' : url.endsWith('.js') ? 'script' : 'image';
            link.href = url;
            document.head.appendChild(link);
        });
    }

    // Inicia pré-carregamento após um pequeno delay para não interferir com recursos críticos
    setTimeout(preloadCriticalResources, 200);
})();
