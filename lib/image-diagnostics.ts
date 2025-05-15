/**
 * Utilitário de diagnóstico para problemas com imagens
 * Use este módulo para identificar e corrigir problemas com imagens do Sanity
 */

import { ImageType } from './optimized-sanity-image';

// Armazena estatísticas de diagnóstico
let diagnosticStats = {
    validImages: 0,
    invalidImages: 0,
    missingAssetImages: 0,
    missingUrlImages: 0,
    urlOnlyImages: 0,
    altOnlyImages: 0,
    totalProcessed: 0,
    detailedIssues: [] as Array<{ id: string, issue: string, data: any }>
};

/**
 * Analisa uma imagem e registra quaisquer problemas encontrados
 */
export function diagnoseImageIssues(image: ImageType, contextId: string = 'unknown'): void {
    diagnosticStats.totalProcessed++;

    // Fast path: undefined/null
    if (!image) {
        diagnosticStats.invalidImages++;
        diagnosticStats.detailedIssues.push({
            id: contextId,
            issue: 'Imagem nula ou indefinida',
            data: { imageValue: image }
        });
        return;
    }

    // String direta (URL)
    if (typeof image === 'string') {
        diagnosticStats.urlOnlyImages++;
        // Não registramos como problema, pois uma URL direta é um formato válido
        return;
    }    // Objeto de imagem
    if (typeof image === 'object') {
        const hasAsset = !!image.asset;
        const hasAssetRef = hasAsset && !!image.asset?._ref;
        const hasAssetUrl = hasAsset && !!image.asset?.url;
        const hasUrl = !!image.url || !!image.imagemUrl;
        const hasAlt = !!image.alt;

        // Verificar falta de dados essenciais
        if (!hasAsset && !hasUrl) {
            diagnosticStats.missingUrlImages++;
            diagnosticStats.missingAssetImages++;
            diagnosticStats.invalidImages++;

            if (hasAlt && Object.keys(image).length === 1) {
                diagnosticStats.altOnlyImages++;
                diagnosticStats.detailedIssues.push({
                    id: contextId,
                    issue: 'Imagem contém apenas propriedade alt',
                    data: { image }
                });
            } else {
                diagnosticStats.detailedIssues.push({
                    id: contextId,
                    issue: 'Imagem sem asset e sem URL',
                    data: { image }
                });
            }
            return;
        }

        // Somente URL sem asset
        if (hasUrl && !hasAsset) {
            diagnosticStats.urlOnlyImages++;
            // Menor gravidade, ainda funcional
            return;
        }

        // Asset sem referência e sem URL
        if (hasAsset && !hasAssetRef && !hasAssetUrl) {
            diagnosticStats.invalidImages++;
            diagnosticStats.detailedIssues.push({
                id: contextId,
                issue: 'Asset sem referência e sem URL',
                data: { asset: image.asset }
            });
            return;
        }

        // Imagem válida
        diagnosticStats.validImages++;
    }
}

/**
 * Imprime estatísticas de diagnóstico no console
 */
export function printImageDiagnostics(reset: boolean = false): void {
    console.log('=== DIAGNÓSTICO DE IMAGENS ===');
    console.log(`Total de imagens processadas: ${diagnosticStats.totalProcessed}`);
    console.log(`- Imagens válidas: ${diagnosticStats.validImages}`);
    console.log(`- Imagens inválidas: ${diagnosticStats.invalidImages}`);
    console.log(`- Imagens com apenas 'alt': ${diagnosticStats.altOnlyImages}`);
    console.log(`- Imagens sem asset: ${diagnosticStats.missingAssetImages}`);
    console.log(`- Imagens sem URL: ${diagnosticStats.missingUrlImages}`);
    console.log(`- Imagens apenas com URL: ${diagnosticStats.urlOnlyImages}`);

    if (diagnosticStats.detailedIssues.length > 0) {
        console.log('\nDetalhes dos problemas:');
        diagnosticStats.detailedIssues.slice(0, 10).forEach((issue, index) => {
            console.log(`\nProblema ${index + 1}: ${issue.issue}`);
            console.log(`ID do contexto: ${issue.id}`);
            console.log('Dados:', issue.data);
        });

        if (diagnosticStats.detailedIssues.length > 10) {
            console.log(`\n... e mais ${diagnosticStats.detailedIssues.length - 10} problemas adicionais.`);
        }
    }

    if (reset) {
        diagnosticStats = {
            validImages: 0,
            invalidImages: 0,
            missingAssetImages: 0,
            missingUrlImages: 0,
            urlOnlyImages: 0,
            altOnlyImages: 0,
            totalProcessed: 0,
            detailedIssues: []
        };
    }
}

/**
 * Integra diagnóstico com getImageUrl para identificar problemas
 */
export function wrapGetImageUrl(getImageUrlFn: (image: ImageType) => string) {
    return (image: ImageType, contextId?: string): string => {
        // Registrar a imagem para diagnóstico
        diagnoseImageIssues(image, contextId);

        // Chamar a função original
        return getImageUrlFn(image);
    };
}
