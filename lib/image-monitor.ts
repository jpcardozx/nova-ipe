/**
 * Utilitário para monitoramento e correção de imagens
 */

import { fixSanityImageReferences } from './image-fix';

/**
 * Cache de imagens já validadas para evitar reprocessamento
 */
const validatedImageCache = new Map<string, boolean>();

/**
 * Verifica se um objeto de imagem está completo e utilizável
 * 
 * @param image Objeto de imagem para verificar
 * @returns true se a imagem parece válida e completa
 */
export function isValidImageObject(image: any): boolean {
    if (!image || typeof image !== 'object') return false;

    // Gera uma chave de cache baseada nas propriedades da imagem
    const cacheKey = getCacheKey(image);

    // Se já verificamos esta imagem antes, retorna o resultado em cache
    if (validatedImageCache.has(cacheKey)) {
        return validatedImageCache.get(cacheKey) || false;
    }

    // Verifica se é uma imagem válida
    const isValid = Boolean(
        // Caso 1: Tem URL direta
        image.url || image.imagemUrl ||
        // Caso 2: Tem asset com URL
        image.asset?.url ||
        // Caso 3: Tem asset com referência
        image.asset?._ref
    );

    // Armazena o resultado em cache
    validatedImageCache.set(cacheKey, isValid);

    return isValid;
}

/**
 * Corrige um objeto de imagem, garantindo que ele esteja completo
 * 
 * @param image Objeto de imagem para corrigir
 * @returns Objeto de imagem corrigido
 */
export function ensureValidImage(image: any): any {
    if (!image) return null;

    // Se a imagem já é válida, retorna sem modificações
    if (isValidImageObject(image)) return image;

    // Tenta corrigir a imagem usando fixSanityImageReferences
    const fixedImage = fixSanityImageReferences(image);

    // Verifica se a correção funcionou
    if (isValidImageObject(fixedImage)) return fixedImage;

    // Se ainda não é válida, registrar para diagnóstico
    if (process.env.NODE_ENV === 'development') {
        console.warn('Image Monitor: Falha ao corrigir imagem inválida', {
            originalImage: image,
            afterFix: fixedImage
        });
    }

    return fixedImage;
}

/**
 * Registra o uso da imagem para fins de monitoramento
 * 
 * @param component Nome do componente usando a imagem
 * @param image Objeto da imagem
 * @param status Status do carregamento
 */
export function trackImageUsage(component: string, image: any, status: 'loading' | 'success' | 'error'): void {
    // Apenas registra em desenvolvimento
    if (process.env.NODE_ENV !== 'development') return;

    // Rastreamento básico
    console.log(`[ImageMonitor:${component}] Status: ${status}`, {
        hasImage: !!image,
        imageProps: image ? Object.keys(image) : [],
        hasAsset: !!image?.asset,
        hasRef: !!image?.asset?._ref,
        hasUrl: !!(image?.url || image?.imagemUrl || image?.asset?.url)
    });

    // Registra erros para diagnóstico
    if (status === 'error') {
        console.error(`[ImageMonitor:${component}] Erro ao carregar imagem`, {
            image,
            validationResult: isValidImageObject(image)
        });
    }
}

/**
 * Gera uma chave de cache baseada nas propriedades do objeto de imagem
 */
function getCacheKey(image: any): string {
    if (!image) return 'null';

    // Extrai as propriedades mais significativas para gerar a chave
    const props = {
        url: image.url || '',
        imagemUrl: image.imagemUrl || '',
        assetRef: image.asset?._ref || '',
        assetUrl: image.asset?.url || ''
    };

    return JSON.stringify(props);
}
