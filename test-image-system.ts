/**
 * Teste automatizado para o sistema de imagens Sanity
 * Este script deve ser executado com o comando:
 * 
 * node -r @swc-node/register test-image-system.ts
 */

import { runImageHandlingTests, generateImageHandlingReport } from './lib/image-stress-test';
import { fixSanityImageReferences } from './lib/image-fix';
import { sanityClient } from './lib/sanity';

/**
 * Executa um teste completo do sistema de imagens
 */
async function runSystemTest() {
    console.log('🔍 Iniciando teste do sistema de imagens Sanity...\n');

    // Parte 1: Teste de robustez com casos sintéticos
    console.log('PARTE 1: Teste de robustez com casos sintéticos');
    console.log('=============================================\n');

    const stressTestResults = await runImageHandlingTests();

    console.log('Resultados do teste de robustez:');

    const successCount = Object.values(stressTestResults)
        .filter((result: any) => result.success).length;

    const totalTests = Object.keys(stressTestResults).length;
    const successRate = (successCount / totalTests) * 100;

    console.log(`✓ Taxa de sucesso: ${successRate.toFixed(2)}% (${successCount}/${totalTests})`);

    if (successCount !== totalTests) {
        console.log('\nCasos com falha:');
        const failedCases = Object.entries(stressTestResults)
            .filter(([_, result]: [string, any]) => !result.success);

        failedCases.forEach(([caseName, result]: [string, any]) => {
            console.log(`  - ${caseName}: ${result.error || 'Falha sem erro específico'}`);
        });
    }

    // Parte 2: Teste com imagens reais do Sanity
    console.log('\nPARTE 2: Teste com imagens reais do Sanity');
    console.log('=========================================\n');

    try {
        // Buscar algumas imagens reais do Sanity
        const query = `*[_type == "imovel"][0...5]{
      _id, 
      titulo,
      "imagem": {
        "asset": imagem.asset->,
        "_type": "image", 
        "alt": imagem.alt,
        "hotspot": imagem.hotspot
      }
    }`;

        console.log('Buscando imagens reais no Sanity...');
        const imoveis = await sanityClient.fetch(query);

        if (!imoveis || imoveis.length === 0) {
            console.log('❌ Não foi possível buscar imagens do Sanity.');
        } else {
            console.log(`✓ Encontrados ${imoveis.length} imóveis com imagens.\n`);

            console.log('Resultados por imagem:');
            let totalImages = 0;
            let successfulFixes = 0;

            for (const imovel of imoveis) {
                if (!imovel.imagem) {
                    console.log(`  - Imóvel ${imovel._id}: Sem imagem`);
                    continue;
                }

                totalImages++;
                const originalKeys = Object.keys(imovel.imagem);
                const originalHasAsset = !!imovel.imagem.asset;
                const originalHasAssetRef = originalHasAsset && !!imovel.imagem.asset._ref;

                // Tentar corrigir a imagem
                const fixedImage = fixSanityImageReferences(imovel.imagem);
                const fixedKeys = Object.keys(fixedImage);
                const fixedHasAsset = !!fixedImage.asset;
                const fixedHasAssetRef = fixedHasAsset && !!fixedImage.asset._ref;
                const hasUrl = !!fixedImage.url;

                // Verificar sucesso da correção
                const isSuccessful = fixedHasAssetRef || hasUrl;
                if (isSuccessful) successfulFixes++;

                console.log(`  - Imóvel ${imovel._id} (${imovel.titulo || 'Sem título'}): ${isSuccessful ? '✓' : '❌'}`);
                console.log(`    Original: ${originalKeys.join(', ')} | Asset: ${originalHasAsset} | Ref: ${originalHasAssetRef}`);
                console.log(`    Corrigido: ${fixedKeys.join(', ')} | Asset: ${fixedHasAsset} | Ref: ${fixedHasAssetRef} | URL: ${hasUrl}`);
            }

            const realWorldSuccessRate = (successfulFixes / totalImages) * 100;
            console.log(`\n✓ Taxa de sucesso com imagens reais: ${realWorldSuccessRate.toFixed(2)}% (${successfulFixes}/${totalImages})`);
        }
    } catch (error) {
        console.error('❌ Erro ao testar com imagens reais:', error);
    }

    console.log('\n✅ Teste do sistema concluído!');
}

// Executar o teste
runSystemTest().catch(error => {
    console.error('Erro fatal durante o teste:', error);
    process.exit(1);
});
