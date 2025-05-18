/**
 * image-performance-optimizer.js
 * 
 * Utilitários para otimização de desempenho de imagem
 * Foca em melhorar LCP e CLS para imagens
 *
 * @version 1.0.0
 * @date 18/05/2025
 */

/**
 * Calcula dimensões otimizadas para imagens com base no viewport
 * Importante para reduzir o CLS
 */
export function getOptimalImageDimensions(viewport) {
    // Definições padrão para diferentes layouts
    const aspectRatio = 16 / 9;

    // Cálculos responsivos
    const baseWidths = {
        mobile: viewport < 768 ? Math.min(viewport - 32, 640) : 640,
        tablet: viewport < 1024 ? Math.min(viewport - 48, 768) : 768,
        desktop: Math.min(viewport - 64, 1200)
    };

    // Tamanhos fixados para evitar CLS
    return {
        hero: {
            width: viewport < 768 ? baseWidths.mobile : (viewport < 1024 ? baseWidths.tablet : baseWidths.desktop),
            height: Math.round((viewport < 768 ? baseWidths.mobile : (viewport < 1024 ? baseWidths.tablet : baseWidths.desktop)) / aspectRatio)
        },
        card: {
            width: viewport < 768 ? baseWidths.mobile / 2 - 16 : (viewport < 1024 ? baseWidths.tablet / 3 - 16 : baseWidths.desktop / 4 - 16),
            height: Math.round((viewport < 768 ? baseWidths.mobile / 2 - 16 : (viewport < 1024 ? baseWidths.tablet / 3 - 16 : baseWidths.desktop / 4 - 16)) / aspectRatio)
        }
    };
}

/**
 * Gera um placeholder de baixa qualidade para imagens
 */
export function generateLowQualityPlaceholder(width, height, color = "rgba(231, 229, 228, 0.5)") {
    // Cria SVG simples que serve como placeholder até a imagem carregar
    const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}" />
    </svg>
  `;

    // Converte para base64 para uso como URI de dados
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Calcula srcset ideal para diferentes breakpoints
 */
export function calculateOptimalSrcSet(baseUrl, widths = [640, 750, 828, 1080, 1200, 1920]) {
    // Gera um srcset otimizado para diferentes tamanhos de tela
    return widths
        .map(w => `${baseUrl}?w=${w} ${w}w`)
        .join(', ');
}

/**
 * Define prioridade de carregamento com base na visibilidade
 */
export function prioritizeVisibleImages() {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
        return;
    }

    // Configura observador de interseção
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;

                // Quando a imagem fica visível, atualiza para versão de alta qualidade
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    delete img.dataset.src;
                }

                // Aplica srcset quando disponível
                if (img.dataset.srcset) {
                    img.srcset = img.dataset.srcset;
                    delete img.dataset.srcset;
                }

                // Marca como carregada para estilização CSS
                img.classList.add('loaded');

                // Para de observar após carregar
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '200px 0px', // Pré-carrega imagens 200px antes de entrarem na viewport
        threshold: 0.01 // Dispara quando pelo menos 1% da imagem fica visível
    });

    // Observa todas as imagens com atributo data-optimize
    document.querySelectorAll('img[data-optimize]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Exporta funções para uso no cliente
export default {
    getOptimalImageDimensions,
    generateLowQualityPlaceholder,
    calculateOptimalSrcSet,
    prioritizeVisibleImages
};
