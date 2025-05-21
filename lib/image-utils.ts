/**
 * Utilitário para otimização e gerenciamento de imagens
 */

import type { ImageProps } from "../types/next-image";

/**
 * Tipo para imagem com tratamento de fallback
 */
export interface SafeImageSource {
    url: string;
    alt: string;
    width?: number;
    height?: number;
    blurDataUrl?: string;
}

/**
 * Gera props de imagem seguras para evitar conflitos entre 'fill' e 'width/height'
 * @param source Fonte da imagem
 * @param useFill Se deve usar fill ou dimensões explícitas
 */
export function getSafeImageProps(
    source: SafeImageSource,
    useFill: boolean = false
): Partial<import('../types/next-image').ImageProps> {
    // Props básicas comuns a todas as imagens
    const commonProps: Partial<import('../types/next-image').ImageProps> = {
        src: source.url,
        alt: source.alt,
        loading: "lazy",
    };

    // Se tiver blur data, use-o
    if (source.blurDataUrl) {
        commonProps.placeholder = "blur";
        commonProps.blurDataURL = source.blurDataUrl;
    }

    // Decida entre fill ou dimensões explícitas
    if (useFill) {
        return {
            ...commonProps,
            fill: true,
        };
    } else {
        // Use dimensões padrão se não forem fornecidas
        return {
            ...commonProps,
            width: source.width || 800,
            height: source.height || 600,
        };
    }
}

/**
 * Função para gerar propriedades de uma imagem placeholder
 * quando a imagem original falha
 */
export function getPlaceholderImageProps(
    alt: string = "Imagem temporariamente indisponível",
    useFill: boolean = false
): Partial<import('../types/next-image').ImageProps> {
    return getSafeImageProps(
        {
            url: "/images/property-placeholder.jpg",
            alt,
            width: 800,
            height: 600,
        },
        useFill
    );
}

/**
 * Gera uma URL para uma versão de baixa qualidade de uma imagem
 * para pré-visualização durante o carregamento
 * 
 * @param src URL da imagem original
 * @param quality Qualidade da imagem (0-100)
 * @param width Largura desejada da prévia
 * @param blurHash Hash de blur opcional para gerar placeholders
 * @returns URL da imagem de baixa qualidade
 */
export function generateBlurPreview(src: string, quality = 20, width = 100, blurHash?: string): string {
    console.log("generateBlurPreview called with:", { src, quality, width, blurHash });

    if (!src) {
        console.warn("generateBlurPreview: No source URL provided");
        return '';
    }

    // Se temos um blurHash, poderíamos decodificá-lo aqui
    if (blurHash) {
        // Futura implementação para decodificar blurHash
        // Por enquanto, continua com a implementação baseada em URL
        console.log("BlurHash provided but not implemented yet");
    }

    // Se for uma URL remota do Sanity
    if (src.includes('cdn.sanity.io')) {
        const result = `${src}?w=${width}&q=${quality}&blur=50&fit=max`;
        console.log("Generated Sanity blur URL:", result);
        return result;
    }

    // Se for uma URL local
    if (src.startsWith('/')) {
        const result = `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
        console.log("Generated local blur URL:", result);
        return result;
    }

    console.log("Using original URL:", src);
    return src;
}

/**
 * Gera tamanhos responsivos para o atributo srcSet de imagens
 * 
 * @param src URL da imagem
 * @param sizes Array de larguras ou mapa de breakpoints para larguras
 * @returns Array de URLs ou mapa de URLs para diferentes tamanhos
 */
export function generateResponsiveImageUrls(
    src: string,
    sizes?: number[] | { [key: string]: number }
): string[] | { [key: string]: string } {
    console.log("generateResponsiveImageUrls called with:", { src, sizes });

    if (!src) {
        console.warn("generateResponsiveImageUrls: No source URL provided");
        return Array.isArray(sizes) ? [] : {};
    }    // Caso receba um array de tamanhos
    if (Array.isArray(sizes) || !sizes) {
        const defaultSizes: number[] = Array.isArray(sizes) ? sizes : [640, 750, 828, 1080, 1200, 1920, 2048];
        console.log("Using array sizes:", defaultSizes);

        // Para imagens do Sanity
        if (src.includes('cdn.sanity.io')) {
            const result = defaultSizes.map((size: number) => `${src}?w=${size}&fit=max&auto=format`);
            console.log("Generated Sanity responsive URLs (first few):", result.slice(0, 2));
            return result;
        }

        // Para imagens locais
        if (src.startsWith('/')) {
            const result = defaultSizes.map((size: number) => `/_next/image?url=${encodeURIComponent(src)}&w=${size}&q=75`);
            console.log("Generated local responsive URLs (first few):", result.slice(0, 2));
            return result;
        }

        console.log("Using original URL in array:", [src]);
        return [src];
    }
    // Caso receba um mapa de breakpoints
    else {
        console.log("Using breakpoint map:", sizes);
        const result: { [key: string]: string } = {};

        // Para cada breakpoint, gera a URL correspondente
        for (const [breakpoint, width] of Object.entries(sizes)) {
            if (src.includes('cdn.sanity.io')) {
                result[breakpoint] = `${src}?w=${width}&fit=max&auto=format`;
            } else if (src.startsWith('/')) {
                result[breakpoint] = `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
            } else {
                result[breakpoint] = src;
            }
        }

        console.log("Generated breakpoint URLs:", result);
        return result;
    }
}

/**
 * Determina a relação de aspecto de uma imagem a partir de dimensões
 * 
 * @param width Largura da imagem
 * @param height Altura da imagem
 * @returns String com a relação de aspecto (ex: "16:9")
 */
export function calculateAspectRatio(width: number, height: number): string {
    console.log("calculateAspectRatio called with:", { width, height });

    if (!width || !height) {
        console.warn("calculateAspectRatio: Invalid dimensions", { width, height });
        return "1:1"; // Default aspect ratio
    }

    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(width, height);

    const result = `${width / divisor}:${height / divisor}`;
    console.log("Calculated aspect ratio:", result);
    return result;
}

/**
 * Formata informações de tamanho de imagem para exibição
 * 
 * @param sizeInBytes Tamanho da imagem em bytes
 * @returns String formatada (ex: "1.5 MB")
 */
export function formatImageSize(sizeInBytes: number): string {
    console.log("formatImageSize called with:", { sizeInBytes });

    if (isNaN(sizeInBytes) || sizeInBytes < 0) {
        console.warn("formatImageSize: Invalid size", { sizeInBytes });
        return "Tamanho desconhecido";
    }

    let result = "";
    if (sizeInBytes < 1024) {
        result = `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
        result = `${(sizeInBytes / 1024).toFixed(1)} KB`;
    } else {
        result = `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    console.log("Formatted size:", result);
    return result;
}

/**
 * Verifica se um arquivo é uma imagem com base na extensão
 * 
 * @param filename Nome do arquivo para verificar
 * @returns Verdadeiro se for uma imagem
 */
export function isImageFile(filename: string): boolean {
    console.log("isImageFile called with:", { filename });

    if (!filename) {
        console.warn("isImageFile: No filename provided");
        return false;
    }

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];
    const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();

    const result = imageExtensions.includes(ext);
    console.log("Is image file:", result, "extension:", ext);
    return result;
}

/**
 * Extrai informações de cor dominante de uma imagem (simulado)
 * Em um caso real, isso exigiria processamento do lado do servidor
 * 
 * @param src URL da imagem
 * @returns Objeto com cor dominante e paleta
 */
export function extractImageColors(src: string): { dominant: string; palette: string[] } {
    console.log("extractImageColors called with:", { src });

    // Skipping most of the implementation logs for brevity

    // Este é um placeholder - em um sistema real, você usaria
    // uma biblioteca como node-vibrant ou uma API de processamento de imagens

    // Para demo, gera cores aleatórias baseadas no hash da URL
    const generateRandomColor = (seed: number) => {
        const rand = Math.sin(seed) * 10000;
        const h = Math.floor((rand - Math.floor(rand)) * 360);
        return `hsl(${h}, 70%, 60%)`;
    };

    const hashCode = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    };

    const hash = hashCode(src);
    const dominant = generateRandomColor(hash);
    const palette = Array.from({ length: 5 }, (_, i) => generateRandomColor(hash + i * 100));

    console.log("Generated colors:", { dominant, palette });
    return { dominant, palette };
}
