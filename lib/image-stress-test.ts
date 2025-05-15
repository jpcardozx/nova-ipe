/**
 * Ferramentas para teste de robustez do sistema de imagens
 * Este utilitário permite criar casos problemáticos para testar
 * a resiliência da nossa solução de imagens
 */

import { fixSanityImageReferences } from './image-fix';
import { ensureValidImageUrl } from './sanity-image-utils';

/**
 * Cria uma série de variações problemáticas de estrutura de imagem
 * para teste de resistência a falhas nos componentes
 * 
 * @param baseImage Objeto de imagem base, ou null para criar do zero
 * @returns Conjunto de imagens em diferentes estados problemáticos
 */
export function createTestCases(baseImage: any = null) {
    return {
        // Caso 1: Imagem completamente nula
        nullCase: null,

        // Caso 2: Objeto vazio
        emptyObject: {},

        // Caso 3: Apenas alt
        onlyAlt: { alt: 'Apenas texto alternativo' },

        // Caso 4: Apenas URL 
        onlyUrl: { url: 'https://example.com/image.jpg' },

        // Caso 5: Asset vazio
        emptyAsset: { _type: 'image', alt: 'Imagem com asset vazio', asset: {} },

        // Caso 6: Apenas referência de asset sem tipo definido
        onlyRef: { asset: { _ref: 'image-abc123-1200x800-jpg' } },

        // Caso 7: Estrutura completa mas com URLs inválidas
        brokenUrls: {
            _type: 'image',
            alt: 'Imagem com URLs quebradas',
            url: 'https://invalid-url.example/broken.jpg',
            asset: {
                _type: 'sanity.imageAsset',
                _ref: 'image-invalid-ref',
                url: 'https://invalid-url.example/broken-asset.jpg'
            }
        },

        // Caso 8: Formato Sanity incompleto
        incompleteSanity: {
            _type: 'image',
            asset: {
                _ref: 'image-abc123-1200x800-jpg'
            }
        },

        // Caso 9: Objeto mal formatado com propriedades aninhadas incorretamente
        malformedNesting: {
            _type: 'image',
            alt: 'Objeto mal formatado',
            asset: {
                image: {
                    _ref: 'image-abc123-1200x800-jpg'
                }
            }
        },

        // Caso 10: Baseado em uma imagem real (se fornecida)
        basedOnReal: baseImage ? {
            ...baseImage,
            // Remove a URL mas mantém a referência
            url: undefined,
            imagemUrl: undefined,
            // Mantém apenas a referência no asset
            asset: baseImage.asset ? {
                _ref: baseImage.asset._ref,
                _type: baseImage.asset._type
            } : undefined
        } : null
    };
}

/**
 * Executa um conjunto de testes para validar a robustez do sistema de correção
 * 
 * @returns Resultados dos testes
 */
export async function runImageHandlingTests() {
    const testCases = createTestCases();
    const results: Record<string, any> = {};

    // Testa cada caso problemático
    for (const [caseName, testImage] of Object.entries(testCases)) {
        if (testImage === null) {
            results[caseName] = {
                input: null,
                fixResult: null,
                ensureResult: null,
                success: false
            };
            continue;
        }

        try {
            // Tenta corrigir com fixSanityImageReferences
            const fixResult = fixSanityImageReferences(testImage);

            // Tenta extrair URL com ensureValidImageUrl
            const ensureResult = ensureValidImageUrl(testImage);

            // Determina se alguma estratégia funcionou
            const success =
                (fixResult && (fixResult.url || (fixResult.asset && fixResult.asset._ref))) ||
                (ensureResult && ensureResult.url !== '/images/property-placeholder.jpg');

            results[caseName] = {
                input: testImage,
                fixResult,
                ensureResult,
                success
            };
        } catch (error) {
            results[caseName] = {
                input: testImage,
                error: error instanceof Error ? error.message : String(error),
                success: false
            };
        }
    }

    return results;
}

/**
 * Gera relatório de desempenho do sistema de imagens
 */
export async function generateImageHandlingReport() {
    const testResults = await runImageHandlingTests();

    const successCount = Object.values(testResults)
        .filter((result: any) => result.success).length;

    const totalTests = Object.keys(testResults).length;
    const successRate = (successCount / totalTests) * 100;

    return {
        summary: {
            totalTests,
            successCount,
            failureCount: totalTests - successCount,
            successRate: `${successRate.toFixed(2)}%`
        },
        details: testResults
    };
}
