'use client';

import { useEffect } from 'react';

/**
 * Componente específico para otimizar o carregamento da página inicial
 * Aplica técnicas avançadas para garantir que a página não fique "presa" carregando
 */
export default function HomepageLoadingOptimizer() {
    useEffect(() => {
        // Identificar se estamos na página inicial
        const isHomepage = window.location.pathname === '/' ||
            window.location.pathname.endsWith('/home');

        if (isHomepage) {
            // 1. Força visibilidade imediata para a página inicial
            const forceVisibility = () => {
                document.documentElement.removeAttribute('data-loading-state');
                document.documentElement.setAttribute('data-loaded', 'true');
                document.body.style.opacity = '1';
                document.body.style.visibility = 'visible';
            };

            // Executar imediatamente
            forceVisibility();

            // 2. Carregamento progressivo de imagens
            const loadImagesProgressively = () => {
                // Seletor para imagens que não são críticas para o LCP
                const nonCriticalImages = document.querySelectorAll('img:not([loading="eager"])');

                let delay = 100;
                nonCriticalImages.forEach(img => {
                    setTimeout(() => {
                        // Garantir que a imagem seja carregada com prioridade baixa
                        img.setAttribute('loading', 'lazy');                        // Se originalmente tinha opacity 0, revela gradualmente
                        if (getComputedStyle(img).opacity === '0') {
                            (img as HTMLImageElement).style.transition = 'opacity 0.3s ease-in';
                            (img as HTMLImageElement).style.opacity = '1';
                        }
                    }, delay);

                    delay += 50; // Incrementa delay para carregamento progressivo
                });
            };

            // 3. Otimização para detecção de problemas de carregamento
            const detectLoadingIssues = () => {
                // Se após 5 segundos ainda estiver com indicador de carregamento, forçar remoção
                const timeout = setTimeout(() => {
                    if (document.documentElement.hasAttribute('data-loading-state')) {
                        console.warn('Detectado problema de carregamento - forçando visibilidade');

                        // Força visibilidade
                        forceVisibility();

                        // Adiciona mensagem para o usuário se necessário
                        const mainContent = document.querySelector('main');
                        if (mainContent && mainContent.children.length === 0) {
                            const message = document.createElement('div');
                            message.style.padding = '20px';
                            message.style.textAlign = 'center';
                            message.innerHTML = `
                <h2>Carregando conteúdo...</h2>
                <p>O site está sendo carregado. Por favor, aguarde um momento.</p>
              `;
                            mainContent.appendChild(message);
                        }

                        // Tenta recarregar recursos críticos
                        document.querySelectorAll('img[loading="eager"]').forEach(img => {
                            const src = img.getAttribute('src');
                            if (src) {
                                img.setAttribute('src', src + '?reload=' + Date.now());
                            }
                        });
                    }
                }, 5000);

                return () => clearTimeout(timeout);
            };

            // Executa otimizações com prioridades diferentes
            window.requestAnimationFrame(loadImagesProgressively);
            const cleanup = detectLoadingIssues();

            return () => {
                cleanup();
            };
        }
    }, []);

    // Não renderiza nada visualmente
    return null;
}
