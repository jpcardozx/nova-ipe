/**
 * Type definitions for image-performance-optimizer.js
 */

/**
 * Calcula dimensões otimizadas para imagens com base no viewport
 * @param viewport - A largura atual do viewport em pixels
 */
export function getOptimalImageDimensions(viewport: number): {
    hero: {
        width: number;
        height: number;
    };
    card: {
        width: number;
        height: number;
    };
};

/**
 * Gera um placeholder de baixa qualidade para imagens
 * @param width - Largura do placeholder em pixels
 * @param height - Altura do placeholder em pixels
 * @param color - Cor de fundo do placeholder (padrão: "rgba(231, 229, 228, 0.5)")
 */
export function generateLowQualityPlaceholder(
    width: number,
    height: number,
    color?: string
): string;

/**
 * Obtém o próximo tamanho de imagem otimizado com base na largura atual
 * @param currentWidth - Largura atual da imagem
 * @param breakpoints - Pontos de quebra disponíveis (opcional)
 */
export function getOptimalImageSize(
    currentWidth: number,
    breakpoints?: number[]
): number;

/**
 * Calcula a pontuação CLS estimada para um carregamento de imagem
 * @param originalSize - Tamanho original da imagem em pixels
 * @param displaySize - Tamanho de exibição da imagem em pixels
 */
export function estimateClsScore(
    originalSize: { width: number; height: number },
    displaySize: { width: number; height: number }
): number;

/**
 * Gera uma URL otimizada para a imagem
 * @param url - URL original da imagem
 * @param width - Largura desejada
 * @param quality - Qualidade da imagem (1-100)
 */
export function generateOptimizedImageUrl(url: string, width: number, quality?: number): string;
