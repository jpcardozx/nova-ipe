/**
 * Utilidades para integração com Sanity CMS
 */
import type { ClientImage } from '../app/components/SanityImage';
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
    console.log("normalizeImage called with:", {
        imageType: image ? typeof image : 'null/undefined',
        imageHasUrl: image?.url ? true : false,
        imageHasImagemUrl: image?.imagemUrl ? true : false,
        imageHasAsset: image?.asset ? true : false,
        defaultAlt
    });

    if (!image) {
        console.warn("normalizeImage: No image provided, returning fallback");
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
        console.log("normalizeImage: Image already has url or imagemUrl");
        normalizedImage.url = image.url || image.imagemUrl;
        normalizedImage.imagemUrl = image.imagemUrl || image.url;
    } else if (image.asset?._ref) {
        console.log("normalizeImage: Image has Sanity asset reference", image.asset._ref);
        const imageUrl = extractImageUrl(image);

        if (!imageUrl) {
            console.error("Failed to extract image URL using specialized function, falling back");
            try {
                normalizedImage.url = '';
            } catch (error) {
                console.error("Error during fallback", error);
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
    console.log("normalizeDocument called with:", {
        docType: doc ? typeof doc : 'null/undefined',
        docId: doc?._id,
        hasImage: doc?.imagem ? true : false,
        hasOgImage: doc?.imagemOpenGraph ? true : false,
        hasSlug: doc?.slug ? true : false
    });

    if (!doc) {
        console.warn("normalizeDocument: No document provided");
        return null;
    }

    // Copia básica
    const normalizedDoc = { ...doc };

    // Normaliza imagens
    if (doc.imagem) {
        console.log("normalizeDocument: Normalizing main image");
        normalizedDoc.imagem = normalizeImage(doc.imagem, doc.titulo || 'Imagem');
    }

    if (doc.imagemOpenGraph) {
        console.log("normalizeDocument: Normalizing OG image");
        normalizedDoc.imagemOpenGraph = normalizeImage(doc.imagemOpenGraph, 'Open Graph');
    }

    // Normaliza o slug
    if (doc.slug?.current && typeof doc.slug !== 'string') {
        console.log("normalizeDocument: Normalizing slug from object to string");
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
    console.log("normalizeDocuments called with:", {
        isArray: Array.isArray(docs),
        length: Array.isArray(docs) ? docs.length : 0
    });

    if (!Array.isArray(docs)) {
        console.warn("normalizeDocuments: Input is not an array");
        return [];
    }

    const result = docs.map(doc => normalizeDocument(doc)) as T[];
    console.log("normalizeDocuments: Processed", result.length, "documents");
    return result;
}

/**
 * Gera query GROQ para buscar documentos com imagens projetadas
 * 
 * @param baseQuery Query GROQ base
 * @returns Query com projeção de imagens
 */
export function buildImageProjectionQuery(baseQuery: string): string {
    console.log("buildImageProjectionQuery called with:", { baseQuery });

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

    console.log("buildImageProjectionQuery: Generated query (truncated):",
        result.substring(0, 50) + "..." + result.substring(result.length - 20));

    return result;
}