/**
 * Utilitário para extrair URLs de imagens do Sanity
 */

import { debugImage } from './debug-image';

/**
 * Extrai a URL de uma imagem do Sanity independente do formato
 * Lida com diferentes estruturas que podem vir do Sanity CMS
 * 
 * @param image Objeto de imagem do Sanity em qualquer formato
 * @returns URL da imagem ou undefined se não encontrada
 */
export function extractImageUrl(image: any): string | undefined {
    try {
        if (!image) return undefined;

        // Caso mais direto: já tem uma URL
        if (typeof image === 'string') {
            return image;
        }

        // Tem uma propriedade url direta
        if (image.url) {
            return image.url;
        }

        // Tem uma propriedade imagemUrl (comum em nosso projeto)
        if (image.imagemUrl) {
            return image.imagemUrl;
        }        // Tem um asset com url
        if (image.asset?.url) {
            return image.asset.url;
        }

        // Sanity asset reference structure
        if (image.asset?._ref) {
            try {
                const refString = image.asset._ref;

                // Tratar referência nula ou vazia
                if (!refString) {
                    return '/placeholder.png';
                }

                const refParts = refString.split('-');                // Formato padrão: image-abc123-800x600-jpg
                // Também suporta: image-abc123-jpg (sem dimensões)
                if (refParts[0] === 'image') {
                    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '0nks58lj'; // Usando o ID do projeto real
                    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
                    const id = refParts[1];

                    if (!id) {
                        return '/placeholder.png';
                    }

                    // Vários formatos possíveis
                    if (refParts.length >= 4) {
                        // Formato completo: image-abc123-800x600-jpg
                        // Capturar as dimensões corretamente
                        const dimensions = refParts[2];

                        // Processar a extensão do arquivo
                        let extension = refParts[3];
                        // Limpar parâmetros da URL se existirem
                        if (extension && extension.includes('?')) {
                            extension = extension.split('?')[0];
                        }

                        // Montando a URL completa usando o formato padrão do Sanity CDN
                        const imageUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${extension}`;
                        return imageUrl;
                    } else if (refParts.length === 3) {
                        // Formato simplificado: image-abc123-jpg
                        let extension = refParts[2];
                        if (extension && extension.includes('?')) {
                            extension = extension.split('?')[0];
                        }
                        const imageUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}.${extension}`;
                        return imageUrl;
                    }
                    // Handle specific formats like "image-1854e7dd5423c8cbe4ae42eb038cd95a0aa0db9a-3456x5184-jpg"
                    else if (refParts.length > 4 && refParts[2].includes('x') && refParts[0] === 'image') {
                        // This is likely a hash-based format with dimensions
                        const dimensions = refParts[2];
                        const extension = refParts[3];
                        const imageUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${extension}`;
                        return imageUrl;
                    }
                    else {
                        // Fallback: tentar construir URL básica apenas com ID
                        // Try to determine extension from the last part
                        let extension = 'jpg'; // Default
                        for (const part of refParts) {
                            if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(part)) {
                                extension = part; break;
                            }
                        }
                        const imageUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}.${extension}`;
                        return imageUrl;
                    }
                }

                // Outros formatos possíveis de Sanity (arquivo, etc)
                console.warn("Unsupported Sanity reference format:", refString);
                return '/placeholder.png';
            } catch (error) {
                console.error("Error parsing Sanity asset reference:", error, image.asset._ref);
                return '/placeholder.png';
            }
        }        // Log mais detalhado do erro
        console.warn("Could not extract URL from image object:");

        // Diagnóstico detalhado
        try {
            if (typeof image === 'object') {
                // Verificar estrutura comum
                console.warn("- Tipo da imagem:", typeof image);
                console.warn("- Chaves do objeto:", Object.keys(image));

                // Verificar propriedades específicas
                if (image.asset) {
                    console.warn("- Tipo do asset:", typeof image.asset);
                    console.warn("- Chaves do asset:", Object.keys(image.asset));

                    if (image.asset._ref) {
                        console.warn("- Valor da referência:", image.asset._ref);
                        console.warn("- Formato da referência:", image.asset._ref.split('-'));
                    }
                }
            }
        } catch (e) {
            console.warn("- Erro ao analisar objeto de imagem:", e);
        }

        // Adicionar sugestões de solução
        console.warn("SUGESTÃO: Verifique se os campos de imagem no Sanity CMS estão configurados corretamente.");
        console.warn("          Formatos válidos: URL direta, objeto com url/imagemUrl, ou objeto Sanity com asset._ref");

        console.log('===== FIM DA EXTRAÇÃO (FALHOU) =====\n');
        return undefined;
    } catch (error) {
        console.error("Error processing image:", error);
        return undefined;
    }
}

/**
 * Extrai texto alternativo de uma imagem do Sanity
 * 
 * @param image Objeto de imagem do Sanity
 * @param defaultAlt Texto alternativo padrão
 * @returns Texto alternativo ou o valor padrão
 */
export function extractAltText(image: any, defaultAlt: string = ''): string {
    if (!image) return defaultAlt;

    // Tem uma propriedade alt direta
    if (image.alt) return image.alt;

    return defaultAlt;
}
