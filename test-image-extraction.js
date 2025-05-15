// test-image-extraction.js
// Script para teste abrangente da extração de URLs de imagem do Sanity
// Execute com: node test-image-extraction.js

// Importar funções necessárias (com require para compatibilidade com Node.js)
const path = require('path');
const fs = require('fs');

// Configurar variáveis de ambiente para simulação
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = '0nks58lj';
process.env.NEXT_PUBLIC_SANITY_DATASET = 'production';

// Importar o módulo de depuração de imagem
const debugImage = require('./lib/debug-image');
const imageUtils = require('./lib/sanity-image-utils');
const imageSanity = require('./lib/image-sanity');

// Coleção de cenários de teste para validar a extração
const testCases = [
    {
        name: "String URL direta",
        image: "https://exemplo.com/imagem.jpg"
    },
    {
        name: "Objeto com URL",
        image: {
            url: "https://exemplo.com/imagem.jpg"
        }
    },
    {
        name: "Objeto com imagemUrl",
        image: {
            imagemUrl: "https://exemplo.com/imagem.jpg"
        }
    },
    {
        name: "Objeto com asset e URL",
        image: {
            asset: {
                url: "https://cdn.sanity.io/images/projeto/dataset/abc123-800x600.jpg"
            }
        }
    },
    {
        name: "Objeto Sanity com referência simples",
        image: {
            asset: {
                _ref: "image-abc123-jpg"
            }
        }
    },
    {
        name: "Objeto Sanity com referência e dimensões",
        image: {
            asset: {
                _ref: "image-abc123-800x600-jpg"
            }
        }
    },
    {
        name: "Objeto Sanity completo",
        image: {
            _type: "image",
            asset: {
                _ref: "image-abc123-800x600-jpg",
                _type: "reference"
            },
            hotspot: {
                x: 0.5,
                y: 0.5
            }
        }
    },
    {
        name: "Objeto Sanity com referência complexa",
        image: {
            _type: "image",
            asset: {
                _ref: "image-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6-2500x1200-jpg",
                _type: "reference"
            }
        }
    },
    {
        name: "Objeto nulo",
        image: null
    },
    {
        name: "Objeto vazio",
        image: {}
    }
];

// Função para executar os testes
async function runTests() {
    console.log("=".repeat(50));
    console.log("TESTE DE EXTRAÇÃO DE IMAGENS DO SANITY");
    console.log("=".repeat(50));
    console.log("Configuração:\n- Project ID: " + process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
    console.log("- Dataset: " + process.env.NEXT_PUBLIC_SANITY_DATASET);
    console.log("-".repeat(50));

    let results = [];

    for (let i = 0; i < testCases.length; i++) {
        const test = testCases[i];
        console.log(`\n[TESTE ${i + 1}/${testCases.length}] ${test.name}`);
        console.log("-".repeat(30));

        // Testar a função de diagnóstico
        console.log("Diagnóstico da imagem:");
        debugImage.debugImage(test.image, `Teste ${i + 1}`);

        // Testar a função de extração direta
        let extractedUrl;
        try {
            console.log("\nTentando extrair URL via extractImageUrl:");
            extractedUrl = imageSanity.extractImageUrl(test.image);
            console.log(`Resultado: ${extractedUrl || 'não extraída'}`);
        } catch (error) {
            console.error(`Erro ao extrair URL: ${error.message}`);
            extractedUrl = null;
        }

        // Testar a função de extração robusta
        let normalizedImage;
        try {
            console.log("\nTentando extrair via ensureValidImageUrl:");
            normalizedImage = imageUtils.ensureValidImageUrl(test.image, '/fallback.jpg', 'Alt Text');
            console.log(`Resultado: `, normalizedImage);
        } catch (error) {
            console.error(`Erro ao normalizar: ${error.message}`);
            normalizedImage = null;
        }

        // Registrar resultados
        results.push({
            testCase: test.name,
            directExtraction: extractedUrl,
            normalizedUrl: normalizedImage?.url,
            success: !!normalizedImage?.url && normalizedImage.url !== '/fallback.jpg'
        });

        console.log("\nResultado: " + (
            (normalizedImage?.url && normalizedImage.url !== '/fallback.jpg')
                ? "✅ SUCESSO"
                : "❌ FALHA"
        ));
        console.log("-".repeat(50));
    }

    // Resumo
    console.log("\n=== RESUMO DOS TESTES ===");
    console.log(`Total de testes: ${testCases.length}`);
    console.log(`Sucessos: ${results.filter(r => r.success).length}`);
    console.log(`Falhas: ${results.filter(r => !r.success).length}`);
    console.log("-".repeat(30));

    // Salvar resultado em arquivo
    const resultLog = {
        timestamp: new Date().toISOString(),
        config: {
            projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
            dataset: process.env.NEXT_PUBLIC_SANITY_DATASET
        },
        results
    };

    fs.writeFileSync(
        'image-extractor-test-results.json',
        JSON.stringify(resultLog, null, 2)
    );
    console.log("Resultados salvos em: image-extractor-test-results.json");
}

// Executar os testes
runTests().catch(console.error);
