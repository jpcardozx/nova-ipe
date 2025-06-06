/**
 * Enhanced Image Loader
 * Solução robusta para carregamento de imagens do Sanity com melhor diagnóstico e fallback
 * Versão: 2.0 - Maio 2025
 */

import { ImageType } from '../app/PropertyTypeFix';
import { imageLog } from './image-logger';

// Interface para imagem processada
export interface ProcessedImage {
    url: string;
    alt: string;
    hotspot?: { x: number; y: number };
}

// Interface para metadados de problemas de imagem
interface ImageIssueMetadata {
    id?: string;
    propertyId?: string;
    [key: string]: any;
}

// Interface para dados de diagnóstico de imagem
interface ImageDiagnostics {
    type: string;
    isNull: boolean;
    isUndefined: boolean;
    keys: string[];
    hasUrl: boolean;
    hasImagemUrl: boolean;
    hasAsset: boolean;
    assetKeys?: string[];
    assetRefExists?: boolean;
    assetHasUrl?: boolean;
    referenceValue?: string;
}

/**
 * Cria URL completa para imagem do Sanity a partir da referência
 */
function createSanityImageUrl(reference: string): string {
    try {
        // Validar a referência
        if (!reference || typeof reference !== 'string') {
            return '/images/property-placeholder.jpg';
        }

        // Formato de referência Sanity: image-abc123-800x600-jpg
        const parts = reference.split('-');
        if (parts[0] !== 'image' || !parts[1]) {
            return '/images/property-placeholder.jpg';
        }

        // Configurar os parâmetros do Sanity
        const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '0nks58lj';
        const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
        const imageId = parts[1];

        // Determinar formato e dimensões
        const dimensions = parts[2] || '1200x800';
        let format = parts[3] || 'jpg';

        // Limpar parâmetros extras
        if (format.includes('?')) {
            format = format.split('?')[0];
        }

        // Construir URL CDN
        return `https://cdn.sanity.io/images/${projectId}/${dataset}/${imageId}-${dimensions}.${format}`;
    } catch (error) {
        console.error('Erro ao criar URL Sanity:', error);
        return '/images/property-placeholder.jpg';
    }
}

/**
 * Analisa a estrutura do objeto de imagem
 */
function diagnoseImage(image: any): ImageDiagnostics {
    // Inicializar diagnóstico
    const diagnostics: ImageDiagnostics = {
        type: typeof image,
        isNull: image === null,
        isUndefined: image === undefined,
        keys: image && typeof image === 'object' ? Object.keys(image) : [],
        hasUrl: false,
        hasImagemUrl: false,
        hasAsset: false
    };

    // Verificar tipo de objeto
    if (image && typeof image === 'object') {
        diagnostics.hasUrl = 'url' in image && !!image.url;
        diagnostics.hasImagemUrl = 'imagemUrl' in image && !!image.imagemUrl;
        diagnostics.hasAsset = 'asset' in image && !!image.asset;        // Analisar asset se existir
        if (diagnostics.hasAsset) {
            diagnostics.assetKeys = Object.keys(image.asset || {});
            diagnostics.assetRefExists = '_ref' in (image.asset || {});
            const refValue = image.asset?._ref;
            diagnostics.referenceValue = refValue;
              // Adicionar informações sobre asset.url para melhor diagnóstico
            const assetUrl = image.asset?.url;
            if (assetUrl) {
                diagnostics.assetHasUrl = true;
                // Registrar apenas se necessário para debugging específico
                // Desabilitado para reduzir ruído no console
            } else if (diagnostics.assetRefExists && (!refValue || refValue === '')) {
                console.warn('[Enhanced Image Loader] Asset sem dados válidos - nem _ref nem url:', {
                    refValue,
                    refType: typeof refValue,
                    assetObject: image.asset
                });
            }
        }
    }    // Registrar apenas casos problemáticos para reduzir ruído no console
    if (process.env.NODE_ENV === 'development') {
        // Verificar se há dados de imagem válidos (incluindo asset.url)
        const hasValidData = diagnostics.hasUrl || diagnostics.hasImagemUrl || 
                            (diagnostics.hasAsset && diagnostics.assetRefExists && diagnostics.referenceValue) ||
                            (diagnostics.hasAsset && image.asset?.url); // Adicionar verificação para asset.url
        
        if (!hasValidData) {
            imageLog.warn('Imagem sem dados válidos detectada', {
                details: diagnostics,
                propertyId: image?._id || image?.propertyId || image?.id || 'unknown'
            });
        }
    }

    return diagnostics;
}

// Cache para evitar reprocessamento desnecessário
const imageProcessingCache = new Map<string, ProcessedImage>();

/**
 * Carrega imagem com vários níveis de fallback
 * @version 2.0
 */
export function loadImage(
    image: ImageType | undefined | null,
    fallbackUrl: string = '/images/property-placeholder.jpg',
    defaultAlt: string = 'Imagem do imóvel'
): ProcessedImage {
    // Criar chave única para cache
    const cacheKey = JSON.stringify({ image, fallbackUrl, defaultAlt });
    
    // Verificar cache primeiro
    if (imageProcessingCache.has(cacheKey)) {
        return imageProcessingCache.get(cacheKey)!;
    }
    try {
        // Fornecer diagnóstico completo da imagem
        const diagnostics = diagnoseImage(image);

        // CASO 1: Nulo ou indefinido
        if (!image) {
            imageLog.warn('Imagem nula/indefinida, usando fallback', {
                details: { type: typeof image }
            });
            return { url: fallbackUrl, alt: defaultAlt };
        }

        // CASO 2: URL direta em string
        if (typeof image === 'string') {
            imageLog.info('Usando string direta como URL da imagem');
            return { url: image, alt: defaultAlt };
        }        // CASO 3: Objeto com propriedade URL direta
        if (image.url) {
            const result = {
                url: image.url,
                alt: image.alt || defaultAlt,
                hotspot: image.hotspot
            };
            imageProcessingCache.set(cacheKey, result);
            return result;
        }

        // CASO 4: Objeto com imagemUrl
        if (image.imagemUrl) {
            const result = {
                url: image.imagemUrl,
                alt: image.alt || defaultAlt,
                hotspot: image.hotspot
            };
            imageProcessingCache.set(cacheKey, result);
            return result;
        }        // CASO 5: Asset com URL direta
        if (image.asset?.url) {
            const result = {
                url: image.asset.url,
                alt: image.alt || defaultAlt,
                hotspot: image.hotspot
            };
            imageProcessingCache.set(cacheKey, result);
            return result;
        }

        // CASO 6: Asset com referência Sanity
        if (image.asset?._ref) {
            const sanityUrl = createSanityImageUrl(image.asset._ref);
            const result = {
                url: sanityUrl,
                alt: image.alt || defaultAlt,
                hotspot: image.hotspot
            };
            imageProcessingCache.set(cacheKey, result);
            return result;
        }

        // CASO 6.1: Asset existe mas _ref é undefined (problema específico detectado)
        if (image.asset && diagnostics.hasAsset && !image.asset._ref) {
            imageLog.warn('Asset com _ref undefined detectado - possível inconsistência de dados', {
                propertyId: diagnostics.referenceValue || 'unknown',
                details: {
                    assetKeys: diagnostics.assetKeys,
                    hasAsset: diagnostics.hasAsset,
                    assetRefExists: diagnostics.assetRefExists
                }
            });
            
            const result = { url: fallbackUrl, alt: image.alt || defaultAlt };
            imageProcessingCache.set(cacheKey, result);
            return result;
        }

        // CASO 6B: Asset com URL mas sem protocolo (adicionar protocolo)
        if (image.asset?.url && !image.asset.url.startsWith('http')) {
            const fullUrl = image.asset.url.startsWith('//') 
                ? `https:${image.asset.url}` 
                : `https://${image.asset.url}`;
            const result = {
                url: fullUrl,
                alt: image.alt || defaultAlt,
                hotspot: image.hotspot
            };
            imageProcessingCache.set(cacheKey, result);
            return result;
        }

        // CASO 7: Objeto com alt mas sem URL (comum no problema atual)
        // Aqui está a correção para o problema que estamos enfrentando
        if (image.alt && (diagnostics.keys.includes('alt') && diagnostics.keys.length === 1)) {
            // Estrutura quebrada detectada - gerar URL para buscar do Sanity pelo ID
            const metadata: any = image as any;

            imageLog.warn('Estrutura de imagem quebrada com apenas alt', {
                propertyId: metadata._id || metadata.propertyId || 'unknown',
                details: {
                    keys: diagnostics.keys,
                    alt: image.alt
                }
            });

            // Se tivermos um ID do imóvel, tentar reconstruir
            // Note: Isso requer adaptação ao seu sistema específico
            // Talvez seja necessário um sistema de cache ou busca alternativa
            return {
                url: fallbackUrl, // Por enquanto usamos fallback, mas poderia chamar API para recuperar
                alt: image.alt
            };
        }// ÚLTIMO CASO: Não encontramos nenhuma estrutura válida
        imageLog.warn('Estrutura de imagem não reconhecida, usando fallback', {
            details: diagnostics
        });

        const result = { url: fallbackUrl, alt: defaultAlt };
        imageProcessingCache.set(cacheKey, result);
        return result;

    } catch (error) {
        imageLog.error('Erro ao processar imagem', {
            error,
            details: { imageType: typeof image }
        });

        const fallbackResult = { url: fallbackUrl, alt: defaultAlt };
        imageProcessingCache.set(cacheKey, fallbackResult);
        return fallbackResult;
    }
}

/**
 * Carrega imagem usando método baseado em asset-id, criado para superar limitações
 * do esquema atual do Sanity e resolver o problema do objeto com apenas alt
 */
export function loadImageById(
    imageId: string | undefined,
    fallbackUrl: string = '/images/property-placeholder.jpg',
    alt: string = 'Imagem do imóvel'
): ProcessedImage {
    if (!imageId) return { url: fallbackUrl, alt };

    try {
        const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '0nks58lj';
        const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

        // Construir uma URL que busca a imagem diretamente do Sanity Store
        const url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${imageId}.jpg`;

        return { url, alt };
    } catch (error) {
        console.error('[IMAGE LOADER] 🚨 Erro ao carregar imagem por ID:', error);
        return { url: fallbackUrl, alt };
    }
}
