// Script otimizado para acelerar carregamento em compartilhamentos do WhatsApp
// Prioridade: crítica - executado o mais cedo possível

(function () {
    // Executa imediatamente antes de qualquer outra coisa
    const start = performance.now();

    // Detecta acesso via WhatsApp - várias condições para maior precisão
    const isFromWhatsApp = /WhatsApp/.test(navigator.userAgent) ||
        document.referrer.includes('whatsapp') ||
        location.href.includes('utm_source=whatsapp') ||
        location.href.includes('whatsapp.com');

    if (isFromWhatsApp) {
        // Marca o documento para otimização de WhatsApp
        document.documentElement.setAttribute('data-whatsapp-visitor', 'true');
        document.body.classList.add('from-whatsapp');

        // Remove IMEDIATAMENTE qualquer estado de carregamento
        document.documentElement.removeAttribute('data-loading-state');
        document.documentElement.setAttribute('data-loaded', 'true');

        // Força visibilidade instantânea
        document.body.style.visibility = 'visible';
        document.body.style.opacity = '1';

        // Força repintura do DOM para aplicar mudanças imediatamente
        void document.body.offsetHeight;

        // Pré-carrega imagens críticas
        const criticalImages = [
            document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
            document.querySelector('meta[property="whatsapp:image"]')?.getAttribute('content'),
            '/images/logo.png'
        ].filter(Boolean);

        criticalImages.forEach(src => {
            if (src) {
                const img = new Image();
                img.src = src;
            }
        });

        // Registra tempo de otimização em console (para debug)
        const timeToOptimize = performance.now() - start;
        console.log(`WhatsApp optimization applied in ${timeToOptimize.toFixed(2)}ms`);
    }

    // Adiciona também ao evento de carregamento para garantir que as otimizações sejam aplicadas
    window.addEventListener('DOMContentLoaded', function () {
        if (isFromWhatsApp) {
            // Reforça otimizações
            document.documentElement.removeAttribute('data-loading-state');
            document.documentElement.setAttribute('data-loaded', 'true');
        }
    });
})();
