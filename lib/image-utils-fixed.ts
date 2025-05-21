import type { ImageProps } from '../types/next-image';

/**
 * Tipo para fonte de imagem segura
 */
export interface SafeImageSource {
    url: string;
    alt: string;
    width?: number;
    height?: number;
    blurDataUrl?: string;
    lqip?: string;
    aspectRatio?: number;
}

/**
 * Gera propriedades seguras para o componente Image do Next.js
 * 
 * @param source Fonte da imagem (URL, alt, dimensões, etc)
 * @param useFill Se deve usar fill ou dimensões explícitas
 */
export function getSafeImageProps(
    source: SafeImageSource,
    useFill: boolean = false
): Partial<ImageProps> {
    // Props básicas comuns a todas as imagens
    const commonProps: Partial<ImageProps> = {
        src: source.url,
        alt: source.alt,
        loading: "lazy",
    };

    // Se tiver blur data, use-o
    if (source.blurDataUrl) {
        commonProps.placeholder = "blur";
        commonProps.blurDataURL = source.blurDataUrl;
    } else if (source.lqip) {
        commonProps.placeholder = "blur";
        commonProps.blurDataURL = source.lqip;
    }

    // Se deve usar fill
    if (useFill) {
        commonProps.fill = true;
        return commonProps;
    }

    // Caso contrário, use dimensões explícitas
    if (source.width && source.height) {
        commonProps.width = source.width;
        commonProps.height = source.height;
        return commonProps;
    }

    // Fallback para dimensões padrão com aspect ratio
    if (source.aspectRatio) {
        commonProps.width = 800;
        commonProps.height = Math.round(800 / source.aspectRatio);
        return commonProps;
    }

    // Último fallback
    commonProps.width = 800;
    commonProps.height = 600;
    return commonProps;
}
