// simple-image-test.js
// Script simplificado para teste de extração de URLs de imagem

// Configurar variáveis de ambiente para simulação
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = '0nks58lj';
process.env.NEXT_PUBLIC_SANITY_DATASET = 'production';

// Função de teste de extração de URL
function extractSanityImageUrl(ref) {
    if (!ref) return null;

    console.log(`Analisando referência: ${ref}`);

    const refParts = ref.split('-');
    console.log(`Partes da referência: ${JSON.stringify(refParts)}`);

    if (refParts.length >= 4 && refParts[0] === 'image') {
        const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
        const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
        const id = refParts[1];
        const dimensions = refParts[2];
        const extension = refParts[3];

        const url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${extension}`;
        console.log(`URL gerada: ${url}`);
        return url;
    } else if (refParts.length === 3 && refParts[0] === 'image') {
        const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
        const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
        const id = refParts[1];
        const extension = refParts[2];

        const url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}.${extension}`;
        console.log(`URL simples gerada: ${url}`);
        return url;
    }

    console.log(`Formato não reconhecido`);
    return null;
}

// Função principal para testar vários cenários
function runTests() {
    console.log('=== Teste de Extração de URL de Imagens do Sanity ===');
    console.log(`Usando projectId: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}, dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`);

    // Teste 1: Referência direta
    console.log('\n[Teste 1]: Referência direta');
    const ref = 'image-abc123-8000x600-jpg';
    const url = extractSanityImageUrl(ref);
    console.log('URL extraída:', url);
    console.log('-----------------------------------');

    // Teste 2: Objeto com URL
    console.log('\n[Teste 2]: Objeto com URL');
    const imgObj = { url: 'https://exemplo.com/imagem.jpg' };
    console.log('Estrutura de imagem recebida:', JSON.stringify(imgObj, null, 2));

    if (imgObj.url) {
        console.log('Encontrado image.url');
        console.log('URL extraída:', imgObj.url);
    } else {
        console.log('URL não encontrada');
    }
    console.log('-----------------------------------');

    // Teste 3: Objeto no formato Sanity
    console.log('\n[Teste 3]: Objeto no formato Sanity');
    const sanityObj = {
        asset: {
            _ref: 'image-abc123-800x600-jpg'
        }
    };
    console.log('Estrutura de imagem recebida:', JSON.stringify(sanityObj, null, 2));

    if (sanityObj.asset && sanityObj.asset._ref) {
        console.log('Encontrado image.asset._ref');
        const sanityUrl = extractSanityImageUrl(sanityObj.asset._ref);
        console.log('URL extraída:', sanityUrl);
    } else {
        console.log('Referência Sanity não encontrada');
    }
    console.log('-----------------------------------');

    // Teste 4: Objeto com asset e URL
    console.log('\n[Teste 4]: Objeto com asset e URL');
    const assetUrlObj = {
        asset: {
            url: 'https://cdn.sanity.io/images/projeto/dataset/abc123-800x600.jpg'
        }
    };
    console.log('Estrutura de imagem recebida:', JSON.stringify(assetUrlObj, null, 2));

    if (assetUrlObj.asset && assetUrlObj.asset.url) {
        console.log('Encontrado image.asset.url');
        console.log('URL extraída:', assetUrlObj.asset.url);
    } else {
        console.log('URL não encontrada no asset');
    }
    console.log('-----------------------------------');

    // Teste 5: Objeto Sanity completo
    console.log('\n[Teste 5]: Objeto Sanity completo');
    const fullSanityObj = {
        '_type': 'image',
        'asset': {
            '_ref': 'image-abc123-800x600-jpg',
            '_type': 'reference'
        },
        'hotspot': {
            'x': 0.5,
            'y': 0.5
        }
    };
    console.log('Estrutura de imagem recebida:', JSON.stringify(fullSanityObj, null, 2));

    if (fullSanityObj.asset && fullSanityObj.asset._ref) {
        console.log('Encontrado image.asset._ref');
        const fullSanityUrl = extractSanityImageUrl(fullSanityObj.asset._ref);
        console.log('URL extraída:', fullSanityUrl);
    } else {
        console.log('Referência Sanity não encontrada');
    }
    console.log('-----------------------------------');

    console.log('\n=== Fim dos Testes ===');
}

// Executar os testes
runTests();
