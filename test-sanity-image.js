// Testes de extração de URL de imagem do Sanity
// Este script pode ser executado diretamente com Node.js para testar a robustez
// das funções de extração de URL de imagens

// Implementação simplificada da função getImageUrl para teste
function getImageUrl(image, fallbackUrl = '/images/property-placeholder.jpg') {
    try {
        // Caso 1: Imagem não definida
        if (!image) {
            return fallbackUrl;
        }

        // Caso 2: String direta (URL)
        if (typeof image === 'string') {
            return image;
        }

        // Caso 3: Objeto com URL direta
        if ('url' in image && image.url) {
            return image.url;
        }

        // Caso 4: Objeto com imagemUrl (comum em nosso projeto)
        if ('imagemUrl' in image && image.imagemUrl) {
            return image.imagemUrl;
        }

        // Caso 5: Tem um asset com URL
        if (image.asset?.url) {
            return image.asset.url;
        }

        // Caso 6: Tem referência do Sanity para construção de URL
        if (image.asset?._ref) {
            const refString = image.asset._ref;

            // Validar referência
            if (!refString || typeof refString !== 'string') {
                return fallbackUrl;
            }

            // Construir URL do Sanity baseada na referência
            const refParts = refString.split('-');

            // Validar formato básico (deve começar com 'image')
            if (refParts[0] !== 'image' || refParts.length < 2) {
                return fallbackUrl;
            }

            // Extrair componentes da referência
            const projectId = '0nks58lj';
            const dataset = 'production';
            const id = refParts[1];

            // Identificar formato da referência
            if (refParts.length >= 4) {
                // Formato padrão: image-abc123-800x600-jpg
                const dimensions = refParts[2];
                const extension = refParts[3].split('?')[0];
                return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${extension}`;
            }
            else if (refParts.length === 3) {
                // Formato simplificado: image-abc123-jpg
                const extension = refParts[2].split('?')[0];
                return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}.${extension}`;
            }
            // Handle specific formats like "image-1854e7dd5423c8cbe4ae42eb038cd95a0aa0db9a-3456x5184-jpg"
            else if (refParts.length > 4 && refParts[2].includes('x') && refParts[0] === 'image') {
                // This is likely a hash-based format with dimensions
                const dimensions = refParts[2];
                const extension = refParts[3].split('?')[0];
                return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${extension}`;
            }
            else {
                // Fallback para formato simples com extensão jpg
                return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}.jpg`;
            }
        }

        // Nenhum formato reconhecido
        return fallbackUrl;
    } catch (error) {
        console.error('[getImageUrl] Erro ao processar imagem:', error);
        return fallbackUrl;
    }
}

// Dados de teste que simulam diferentes formatos de imagem que podem vir do Sanity
const testImages = [
    // Caso 1: String simples
    "https://exemplo.com/imagem.jpg",

    // Caso 2: Objeto com URL direta
    {
        url: "https://exemplo.com/imagem2.jpg",
        alt: "Descrição da imagem"
    },

    // Caso 3: Objeto com imagemUrl
    {
        imagemUrl: "https://exemplo.com/imagem3.jpg",
        alt: "Outra imagem"
    },

    // Caso 4: Objeto com asset contendo url
    {
        asset: {
            url: "https://exemplo.com/imagem4.jpg"
        },
        alt: "Imagem com asset"
    },

    // Caso 5: Formato comum do Sanity com _ref
    {
        _type: "image",
        asset: {
            _ref: "image-abc123-800x600-jpg",
            _type: "reference"
        }
    },

    // Caso 6: Formato alternativo sem dimensões
    {
        asset: {
            _ref: "image-def456-jpg"
        }
    },

    // Caso 7: Formato complexo com referência longa
    {
        asset: {
            _ref: "image-1854e7dd5423c8cbe4ae42eb038cd95a0aa0db9a-3456x5184-jpg"
        }
    },

    // Caso 8: Caso problemático - null
    null,

    // Caso 9: Caso problemático - objeto vazio
    {},

    // Caso 10: Caso problemático - referência inválida
    {
        asset: {
            _ref: "invalid-reference"
        }
    }
];

// Função principal de teste
function runTests() {
    console.log("=== TESTES DE EXTRAÇÃO DE IMAGENS SANITY ===\n");

    testImages.forEach((image, index) => {
        console.log(`\n[TESTE ${index + 1}]`);
        console.log("Imagem original:", JSON.stringify(image, null, 2));

        try {
            const url = getImageUrl(image);
            console.log("URL extraída:", url);
            console.log("Resultado:", url ? "SUCESSO" : "FALHA");
        } catch (error) {
            console.error("ERRO:", error.message);
            console.log("Resultado: FALHA CRÍTICA");
        }

        console.log("-".repeat(40));
    });

    console.log("\n=== FIM DOS TESTES ===");
}

// Executar os testes
runTests();
