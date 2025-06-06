/**
 * Utilitários de debugging para imagens do Sanity
 */

/**
 * Analisa e retorna informações detalhadas sobre a estrutura de uma imagem
 * Útil para debugging e diagnóstico de problemas
 * 
 * @param image A imagem para analisar
 * @returns Objeto com informações de diagnóstico
 */
export function analyzeImageStructure(image: any): Record<string, any> {
    const result: Record<string, any> = {
        type: typeof image,
        isNull: image === null,
        isUndefined: image === undefined,
    };

    if (image) {
        if (typeof image === 'string') {
            result.isString = true;
            result.value = image;
            result.length = image.length;
            result.isUrl = image.startsWith('http') || image.startsWith('/');
        } else if (typeof image === 'object') {
            result.keys = Object.keys(image);
            result.hasUrl = 'url' in image;
            result.hasImagemUrl = 'imagemUrl' in image;
            result.hasAsset = 'asset' in image;

            if (image.url) result.url = image.url;
            if (image.imagemUrl) result.imagemUrl = image.imagemUrl;

            if (image.asset) {
                result.assetType = typeof image.asset;
                result.assetKeys = Object.keys(image.asset);
                result.assetHasRef = '_ref' in image.asset;
                result.assetHasUrl = 'url' in image.asset;

                if (image.asset._ref) {
                    result.assetRef = image.asset._ref;
                    // Parse Sanity reference format
                    const refParts = image.asset._ref.split('-');
                    result.refParts = refParts;
                    result.refType = refParts[0];
                    result.refId = refParts[1];
                    result.refFormat = refParts.length > 2 ? refParts.slice(2).join('-') : null;
                    result.refFormat = refParts.length > 2 ? refParts.slice(2).join('-') : null;
                }
            }
        }
    }

    // Check for hotspot and crop
    if (image.hotspot) result.hasHotspot = true;
    if (image.crop) result.hasCrop = true;

    return result;
}


/**
 * Registra detalhes de diagnóstico de uma imagem no console
 * 
 * @param image A imagem para diagnosticar
 * @param label Rótulo opcional para identificar a imagem nos logs
 */
export function debugImage(image: any, label: string = 'Imagem') {
    try {
        const analysis = analyzeImageStructure(image);
        console.log(`[DEBUG IMAGE] ${label}:`, analysis);        // Sugerir solução baseada na análise
        const suggestions: string[] = [];

        if (!image) {
            suggestions.push('Imagem é nula ou indefinida. Verifique se o campo está sendo preenchido corretamente no Sanity.');
        } else if (typeof image === 'string') {
            if (!image.startsWith('http') && !image.startsWith('/')) {
                suggestions.push('String de imagem não parece ser uma URL válida.');
            }
        } else if (image.asset && image.asset._ref) {
            const refParts = image.asset._ref.split('-');
            if (refParts.length < 3 || refParts[0] !== 'image') {
                suggestions.push('Formato de referência do Sanity parece inválido.');
            }
        } else if (!image.url && !image.imagemUrl && (!image.asset || !image.asset.url)) {
            suggestions.push('Objeto de imagem não contém URL ou referência válida.');
        }

        if (suggestions.length > 0) {
            console.log(`[DEBUG IMAGE] Sugestões para ${label}:`, suggestions);
        }

        return analysis;
    } catch (error) {
        console.error(`[DEBUG IMAGE] Erro ao analisar a imagem ${label}:`, error);
        return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
