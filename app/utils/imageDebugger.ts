/**
 * Funções de depuração para problemas com imagens
 */

/**
 * Registra informações de debug para diagnosticar problemas com 
 * diferentes formatos de objetos de imagem
 * 
 * @param image O objeto de imagem a ser diagnosticado
 * @param source Origem da chamada para contexto no log
 */
export function debugImageObject(image: any, source: string = 'debugImageObject') {
    try {
        console.group(`[ImageDebug] ${source}`);

        // Verifica se é null/undefined
        if (!image) {
            console.warn('Imagem é null ou undefined');
            console.groupEnd();
            return;
        }

        // Verifica tipo básico
        console.log(`Tipo: ${typeof image}`);

        // Se for string
        if (typeof image === 'string') {
            console.log('Formato: URL string direta');
            console.log(`URL: ${image}`);
            console.groupEnd();
            return;
        }

        // Se for objeto
        if (typeof image === 'object') {
            console.log('Formato: Objeto');
            console.log('Propriedades:', Object.keys(image));

            // Verificar propriedades comuns
            if ('url' in image) console.log(`image.url: ${image.url}`);
            if ('src' in image) console.log(`image.src: ${image.src}`);
            if ('alt' in image) console.log(`image.alt: ${image.alt}`);

            // Verificar formato Sanity
            if ('asset' in image) {
                console.log('Formato: Parece ser objeto Sanity');
                console.log('asset:', image.asset);

                if (image.asset && typeof image.asset === 'object') {
                    if ('_ref' in image.asset) console.log(`image.asset._ref: ${image.asset._ref}`);
                    if ('url' in image.asset) console.log(`image.asset.url: ${image.asset.url}`);
                }
            }

            // Verificar hotspot
            if ('hotspot' in image) {
                console.log('Hotspot encontrado:', image.hotspot);
            }
        }

        console.groupEnd();
    } catch (error) {
        console.error('[ImageDebug] Erro ao debugar objeto de imagem:', error);
    }
}
