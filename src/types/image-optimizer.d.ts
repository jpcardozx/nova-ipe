declare module '@/lib/image-performance-optimizer' {
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
     * Calcula srcset ideal para diferentes breakpoints
     */
    export function calculateOptimalSrcSet(
        baseUrl: string,
        widths?: number[]
    ): string;

    /**
     * Define prioridade de carregamento com base na visibilidade
     */
    export function prioritizeVisibleImages(): void;

    const imageOptimizer: {
        getOptimalImageDimensions: typeof getOptimalImageDimensions;
        generateLowQualityPlaceholder: typeof generateLowQualityPlaceholder;
        calculateOptimalSrcSet: typeof calculateOptimalSrcSet;
        prioritizeVisibleImages: typeof prioritizeVisibleImages;
    };

    export default imageOptimizer;
}
