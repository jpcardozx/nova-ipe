/**
 * image-performance-optimizer.ts
 * 
 * Utilitários para otimização de desempenho de imagem
 * Foca em melhorar LCP e CLS para imagens
 *
 * @version 1.0.0
 * @date 18/05/2025
 */
type IntersectionObserverEntry = {
    isIntersecting: boolean;
    target: Element;
};

/**
 * Calcula dimensões otimizadas para imagens com base no viewport
 * Importante para reduzir o CLS
 */
export function getOptimalImageDimensions(viewport: number): {
    hero: { width: number; height: number };
    card: { width: number; height: number };
} {
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
export function generateLowQualityPlaceholder(width: number, height: number, color = "rgba(231, 229, 228, 0.5)"): string {
    // Cria SVG simples que serve como placeholder até a imagem carregar
    // Usa URL encoding para uma solução mais robusta que funciona em todos os ambientes
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3C/svg%3E`;
}

/**
 * Calcula srcset ideal para diferentes breakpoints
 */
export function calculateOptimalSrcSet(baseUrl: string, widths = [640, 750, 828, 1080, 1200, 1920]): string {
    // Gera um srcset otimizado para diferentes tamanhos de tela
    return widths
        .map(w => `${baseUrl}?w=${w} ${w}w`)
        .join(', ');
}

/**
 * Define prioridade de carregamento com base na visibilidade
 */
export function prioritizeVisibleImages(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
        return;
    }    // Configura observador de interseção
    const imageObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
            if (entry.isIntersecting) {
                const img = entry.target as HTMLImageElement;

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
    });    // Observa todas as imagens com atributo data-optimize
    document.querySelectorAll('img[data-optimize]').forEach((img: Element) => {
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
