/**
 * Utilidades para integração com Sanity CMS
 */
import type { ClientImage } from '@/app/components/SanityImage';
import { processImage } from './sanity-image-helper';
import { extractImageUrl } from './image-sanity';

/**
 * Converte uma referência de imagem do Sanity para um formato padronizado
 * Compatível com diferentes formatos retornados pelo Sanity
 * 
 * @param image Imagem do Sanity em qualquer formato
 * @param defaultAlt Texto alternativo padrão
 * @returns Objeto de imagem padronizado
 */
export function normalizeImage(image: any, defaultAlt: string = ''): ClientImage {
    if (!image) {
        return { alt: defaultAlt };
    }

    // Create a base image object that preserves the asset reference
    const normalizedImage: ClientImage = {
        _type: image._type || 'image',
        alt: image.alt || defaultAlt,
        hotspot: image.hotspot,
        // Preserve the original asset reference
        asset: image.asset ? {
            _type: image.asset._type || 'sanity.imageAsset',
            _ref: image.asset._ref,
            url: image.asset.url
        } : undefined
    };

    if (image.imagemUrl || image.url) {
        normalizedImage.url = image.url || image.imagemUrl;
        normalizedImage.imagemUrl = image.imagemUrl || image.url;
    } else if (image.asset?._ref) {
        const imageUrl = extractImageUrl(image);

        if (!imageUrl) {
            try {
                normalizedImage.url = '';
            } catch (error) {
                // Ignorar erro
            }
        } else {
            normalizedImage.url = imageUrl;
        }
    }

    return normalizedImage;
}

/**
 * Converte um documento do Sanity para o formato esperado pelo cliente
 * Normaliza campos importantes e converte referências de imagens
 * 
 * @param doc Documento do Sanity
 * @returns Documento normalizado
 */
export function normalizeDocument(doc: any): any {
    if (!doc) {
        return null;
    }

    // Copia básica
    const normalizedDoc = { ...doc };

    // Normaliza imagens
    if (doc.imagem) {
        normalizedDoc.imagem = normalizeImage(doc.imagem, doc.titulo || 'Imagem');
    }

    if (doc.imagemOpenGraph) {
        normalizedDoc.imagemOpenGraph = normalizeImage(doc.imagemOpenGraph, 'Open Graph');
    }

    // Normaliza o slug
    if (doc.slug?.current && typeof doc.slug !== 'string') {
        normalizedDoc.slug = doc.slug.current;
    }

    // Outros ajustes específicos
    // Pode ser expandido conforme necessário

    return normalizedDoc;
}

/**
 * Converte um array de documentos do Sanity
 * 
 * @param docs Array de documentos do Sanity
 * @returns Array de documentos normalizados
 */
export function normalizeDocuments<T = any>(docs: any[]): T[] {
    if (!Array.isArray(docs)) {
        return [];
    }

    const result = docs.map(doc => normalizeDocument(doc)) as T[];
    return result;
}

/**
 * Gera query GROQ para buscar documentos com imagens projetadas
 * 
 * @param baseQuery Query GROQ base
 * @returns Query com projeção de imagens
 */
export function buildImageProjectionQuery(baseQuery: string): string {
    const result = `${baseQuery} {
        ...,
        "imagem": {
            "url": imagem.asset->url,
            "alt": imagem.alt,
            "hotspot": imagem.hotspot,
            "asset": {
                "_ref": imagem.asset._ref,
                "url": imagem.asset->url
            }
        },
        "mainImage": {
            "url": mainImage.asset->url,
            "alt": mainImage.alt,
            "hotspot": mainImage.hotspot,
            "asset": {
                "_ref": mainImage.asset._ref,
                "url": mainImage.asset->url
            }
        },
        "imagemOpenGraph": {
            "url": imagemOpenGraph.asset->url,
            "alt": imagemOpenGraph.alt,
            "hotspot": imagemOpenGraph.hotspot,
            "asset": {
                "_ref": imagemOpenGraph.asset._ref,
                "url": imagemOpenGraph.asset->url
            }
        }
    }`;

    return result;
}