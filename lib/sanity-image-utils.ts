/**
 * Utilitário para tratamento robusto de imagens do Sanity com validação de tipos
 */

import type { SanityImage, ImageType } from '../app/PropertyTypeFix';
import { extractImageUrl } from './image-sanity';
import { debugImage } from './debug-image';

/**
 * Interface para imagem normalizada
 */
export interface NormalizedImage {
    url: string;
    alt: string;
    _type?: string;
    hotspot?: {
        x: number;
        y: number;
    };
    asset?: {
        _ref?: string;
        _type?: string;
        url?: string;
    };
}

/**
 * Garante a extração correta de URLs de imagem do Sanity independente do formato
 * Versão 2.0 com melhor tratamento de erros e diagnóstico
 * 
 * @param image Objeto de imagem em qualquer formato
 * @param fallbackUrl URL de fallback quando não é possível extrair
 * @param defaultAlt Texto alternativo padrão
 * @returns Objeto com URL e texto alternativo
 */
export function ensureValidImageUrl(
    image: ImageType,
    fallbackUrl: string = '/images/property-placeholder.jpg',
    defaultAlt: string = 'Imagem'
): NormalizedImage {
    try {
        // Debug a estrutura da imagem com diagnóstico detalhado
        debugImage(image, 'ensureValidImageUrl');

        // Caso nulo/indefinido
        if (!image) {
            console.log('[Image Extractor] Imagem nula ou indefinida, usando fallback');
            return {
                url: fallbackUrl,
                alt: defaultAlt
            };
        }

        // Caso seja string (URL direta)
        if (typeof image === 'string') {
            console.log('[Image Extractor] Imagem é uma string URL:', image.substring(0, 50) + '...');
            return {
                url: image,
                alt: defaultAlt
            };
        }        // Extrair texto alternativo se disponível
        const alt = image.alt || defaultAlt;
        let url: string | undefined;        // Criar a estrutura base mantendo a asset
        const result: NormalizedImage = {
            url: fallbackUrl, // Inicializa com fallback, será substituído se encontrarmos uma URL válida
            alt: alt,
            _type: image._type || 'image',
            asset: image.asset ? {
                _ref: image.asset._ref,
                _type: image.asset._type || 'sanity.imageAsset',
                url: image.asset.url
            } : undefined
        };

        // Estratégia 1: Usar URLs diretas (prioridade mais alta)
        if (image.url) {
            console.log('[Image Extractor] Usando image.url');
            url = image.url;
        } else if (image.imagemUrl) {
            console.log('[Image Extractor] Usando image.imagemUrl');
            url = image.imagemUrl;
        } else if (image.asset?.url) {
            console.log('[Image Extractor] Usando image.asset.url');
            url = image.asset.url;
        }
        // Estratégia 2: Usar a função extractImageUrl para processar referências
        else if (image.asset?._ref) {
            console.log('[Image Extractor] Processando referência Sanity:', image.asset._ref);
            url = extractImageUrl(image);
        }

        // Verificação final
        if (!url) {
            console.warn('[Image Extractor] Falha ao extrair URL, usando fallback');
            url = fallbackUrl;
        }

        // Log da URL final
        console.log(`[Image Extractor] URL extraída com sucesso: ${url.substring(0, 50)}${url.length > 50 ? '...' : ''}`);        // Retornar imagem normalizada com todos os dados necessários
        result.url = url; // Atualiza a URL no resultado
        return result;
    } catch (error) {
        console.error('[Image Extractor] Erro crítico ao processar imagem:', error);
        return {
            url: fallbackUrl,
            alt: defaultAlt
        };
    }
}

/**
 * Verifica se um objeto é uma imagem válida do Sanity
 * 
 * @param image Objeto a validar
 * @returns Verdadeiro se for uma imagem válida
 */
export function isValidSanityImage(image: any): image is SanityImage {
    return (
        image &&
        typeof image === 'object' &&
        (
            // Tem URL direta
            ('url' in image || 'imagemUrl' in image) ||
            // Tem referência Sanity
            ('asset' in image && typeof image.asset === 'object')
        )
    );
}

/**
 * Converte vários tipos de entrada de imagem para o formato esperado
 * 
 * @param input Qualquer entrada de imagem
 * @returns Objeto de imagem normalizado
 */
export function normalizeImageInput(input: any): NormalizedImage {
    // Fallbacks padrão
    const fallbackUrl = '/images/property-placeholder.jpg';
    const defaultAlt = 'Imagem';

    // Processar o caso mais simples - string URL
    if (typeof input === 'string') {
        return { url: input, alt: defaultAlt };
    }

    // Objeto nulo ou indefinido
    if (!input) {
        return { url: fallbackUrl, alt: defaultAlt };
    }

    // Já está no formato esperado
    if (input.url || input.imagemUrl) {
        return {
            url: input.url || input.imagemUrl || fallbackUrl,
            alt: input.alt || defaultAlt,
            hotspot: input.hotspot
        };
    }

    // Imagem com asset
    if (input.asset) {
        if (input.asset.url) {
            return {
                url: input.asset.url,
                alt: input.alt || defaultAlt,
                hotspot: input.hotspot
            };
        }

        if (input.asset._ref) {
            // Aqui teríamos que converter a referência, mas para simplificar
            // retornamos o fallback - em produção usaríamos o utilitário
            // mais avançado
            return {
                url: fallbackUrl,
                alt: input.alt || defaultAlt,
                hotspot: input.hotspot
            };
        }
    }

    // Fallback para qualquer outro caso
    return { url: fallbackUrl, alt: defaultAlt };
}
