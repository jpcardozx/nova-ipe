// Este script é automaticamente injetado nas páginas
// para otimizar a visualização quando links são compartilhados no WhatsApp

(function () {
    // Detecta se o acesso vem do WhatsApp
    function isFromWhatsApp() {
        return /WhatsApp/.test(navigator.userAgent) ||
            document.referrer.includes('whatsapp') ||
            window.location.href.includes('utm_source=whatsapp');
    }

    // Função principal para otimização
    function optimizeForWhatsApp() {
        if (isFromWhatsApp()) {
            // Adiciona classe ao corpo para estilos específicos
            document.body.classList.add('from-whatsapp');

            // Força carregamento de imagens prioritárias
            const ogImages = document.querySelectorAll('meta[property="og:image"]');
            if (ogImages.length > 0) {
                ogImages.forEach(meta => {
                    const img = new Image();
                    img.src = meta.getAttribute('content');
                    img.style.display = 'none';
                    document.body.appendChild(img);
                });
            }

            // Remove atributo de carregamento para garantir visualização rápida
            document.documentElement.removeAttribute('data-loading-state');
            document.documentElement.setAttribute('data-loaded', 'true');
        }
    }

    // Executa imediatamente
    optimizeForWhatsApp();

    // Adiciona também ao evento de carregamento da página
    window.addEventListener('load', optimizeForWhatsApp);
})();
