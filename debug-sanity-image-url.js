// Script para testar e depurar URL de imagens Sanity
// Rode com: node debug-sanity-image-url.js

// Configuração do ambiente
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '0nks58lj';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

/**
 * Extrai URL de imagem a partir de uma referência Sanity
 * @param {string} ref Referência no formato image-abc123-800x600-jpg
 * @returns {string|null} URL da imagem ou null se inválido
 */
function extractSanityImageUrl(ref) {
    if (!ref) return null;

    console.log(`Analisando referência: ${ref}`);

    const refParts = ref.split('-');
    console.log(`Partes da referência: ${JSON.stringify(refParts)}`);

    if (refParts.length >= 4 && refParts[0] === 'image') {
        const id = refParts[1];
        const dimensions = refParts[2];
        let extension = refParts[3];

        // Limpa parâmetros da extensão se houver
        if (extension.includes('?')) {
            extension = extension.split('?')[0];
        }

        const url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${extension}`;
        console.log(`URL gerada: ${url}`);
        return url;
    }

    console.error('Formato de referência inválido');
    return null;
}

/**
 * Extrai URL de imagem de qualquer formato do Sanity
 * @param {*} image Objeto de imagem do Sanity
 * @returns {string|null} URL da imagem ou null se não encontrada
 */
function extractImageUrlFromAnyFormat(image) {
    if (!image) {
        console.log('Imagem não fornecida');
        return null;
    }

    if (typeof image === 'string') {
        console.log('Imagem é uma string, usando diretamente');
        return image;
    }

    console.log('Estrutura de imagem recebida:', JSON.stringify(image, null, 2));

    // Verifica diferentes formatos
    if (image.url) {
        console.log('Encontrado image.url');
        return image.url;
    }

    if (image.imagemUrl) {
        console.log('Encontrado image.imagemUrl');
        return image.imagemUrl;
    }

    if (image.asset?.url) {
        console.log('Encontrado image.asset.url');
        return image.asset.url;
    }

    if (image.asset?._ref) {
        console.log('Encontrado image.asset._ref');
        return extractSanityImageUrl(image.asset._ref);
    }

    console.log('Nenhum formato de imagem reconhecido');
    return null;
}

// Exemplos para teste
const testCases = [
    {
        desc: 'Referência direta',
        data: 'image-abc123-800x600-jpg'
    },
    {
        desc: 'Objeto com URL',
        data: { url: 'https://exemplo.com/imagem.jpg' }
    },
    {
        desc: 'Objeto no formato Sanity',
        data: {
            asset: {
                _ref: 'image-abc123-800x600-jpg'
            }
        }
    },
    {
        desc: 'Objeto com asset e URL',
        data: {
            asset: {
                url: 'https://cdn.sanity.io/images/projeto/dataset/abc123-800x600.jpg'
            }
        }
    },
    {
        desc: 'Objeto Sanity completo',
        data: {
            _type: 'image',
            asset: {
                _ref: 'image-abc123-800x600-jpg',
                _type: 'reference'
            },
            hotspot: {
                x: 0.5,
                y: 0.5
            }
        }
    }
];

console.log('=== Teste de Extração de URL de Imagens do Sanity ===');
console.log(`Usando projectId: ${projectId}, dataset: ${dataset}\n`);

// Testar cada caso
testCases.forEach((test, index) => {
    console.log(`\n[Teste ${index + 1}]: ${test.desc}`);

    if (typeof test.data === 'string') {
        console.log(`URL extraída: ${extractSanityImageUrl(test.data)}`);
    } else {
        console.log(`URL extraída: ${extractImageUrlFromAnyFormat(test.data)}`);
    }

    console.log('-----------------------------------');
});

console.log('\n=== Fim dos Testes ===');
