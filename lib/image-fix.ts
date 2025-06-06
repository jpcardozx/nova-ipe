/**
 * Utilitários para consertar problemas de imagens
 */

import { sanityClient } from './sanity';
import { extractImageUrl } from './image-sanity';

/**
 * Profundamente verifica e conserta objetos de imagem, garantindo que as referências
 * do asset são preservadas durante a serialização servidor-cliente
 */
export function fixSanityImageReferences(obj: any): any {
    // Caso base: objeto é nulo ou não é um objeto
    if (!obj || typeof obj !== 'object') {
        return obj;
    }

    // Caso para arrays
    if (Array.isArray(obj)) {
        return obj.map(item => fixSanityImageReferences(item));
    }

    // Caso específico para objetos de imagem Sanity
    // Identifica se é um objeto de imagem por ter propriedades características
    const isImageObject =
        obj._type === 'image' || // Verifica se tem tipo 'image'
        obj.asset || // Tem referência de asset
        (obj.alt && (obj.url || obj.imagemUrl)); // Tem alt e uma URL

    if (isImageObject) {
        // Define a interface para o objeto de imagem corrigido
        interface FixedImageObject {
            _type: string;
            alt: string;
            url: string;
            hotspot?: {
                x: number;
                y: number;
            };
            asset?: {
                _type: string;
                _ref: string;
                url?: string;
            };
        }

        // Cria uma cópia limpa que funcionará na serialização
        const fixedImage: FixedImageObject = {
            _type: obj._type || 'image', // Garante que tem o tipo
            alt: obj.alt || '',
            url: obj.url || obj.imagemUrl || '',
        };

        // Preserva hotspot se existir
        if (obj.hotspot) {
            fixedImage.hotspot = { ...obj.hotspot };
        }

        // Conserta especificamente o asset para garantir serialização correta
        if (obj.asset) {
            fixedImage.asset = {
                _type: obj.asset._type || 'sanity.imageAsset',
                _ref: obj.asset._ref || '',
            };

            // Se o asset tiver URL, preserva
            if (obj.asset.url) {
                fixedImage.asset.url = obj.asset.url;
            }

            // Se não tiver URL definida mas tiver ref, extrai a URL
            if (!fixedImage.url && fixedImage.asset._ref) {
                try {
                    const extractedUrl = extractImageUrl({
                        asset: { _ref: fixedImage.asset._ref }
                    });

                    if (extractedUrl) {
                        fixedImage.url = extractedUrl;
                    }
                } catch (error) {
                    console.error('Erro ao extrair URL da imagem:', error);
                }
            }
        }

        return fixedImage;
    }    // Para objetos normais, processa recursivamente todas as propriedades
    const result = { ...obj };
    for (const key of Object.keys(result)) {
        result[key] = fixSanityImageReferences(result[key]);
    }

    return result;
}

/**
 * Garante que objetos de imagens tenham URLs válidas reconstruindo-as se necessário
 * @param images Array de objetos de imagem que possam estar com problemas
 */
export async function hydrateImageAssets(images: any[]) {
    if (!images || !Array.isArray(images) || images.length === 0) return [];

    // Extrai todas as referências de assets
    const assetRefs = images
        .filter(img => img?.asset?._ref)
        .map(img => img.asset._ref);

    if (assetRefs.length === 0) return images;

    try {
        // Busca todos os assets de uma vez para melhor performance
        const assetsQuery = `*[_id in [${assetRefs.map(ref => `"${ref}"`).join(',')}]]{
      _id,
      url
    }`;

        const assets = await sanityClient.fetch(assetsQuery);

        // Cria um mapa para rápido acesso
        const assetMap = new Map();
        assets.forEach((asset: any) => {
            if (asset._id && asset.url) {
                assetMap.set(asset._id, asset.url);
            }
        });

        // Hidrata os objetos de imagem com as URLs corretas
        return images.map(img => {
            if (img?.asset?._ref) {
                const assetUrl = assetMap.get(img.asset._ref);
                if (assetUrl) {
                    return {
                        ...img,
                        url: assetUrl,
                        asset: {
                            ...img.asset,
                            url: assetUrl
                        }
                    };
                }
            }
            return img;
        });
    } catch (error) {
        console.error('Erro ao hidratar assets de imagens:', error);
        return images;
    }
}
