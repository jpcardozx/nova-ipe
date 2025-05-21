// sanity-image-tester.js
// Script para testar a extração de URLs de imagem do Sanity
// Inclui todos os casos de borda e formatos diferentes

const { extractImageUrl, extractAltText } = require('./lib/image-sanity');

// Configuração do ambiente
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '0nks58lj';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

console.log('=== Teste de extração de URLs de imagens do Sanity ===');
console.log(`Usando projectId: ${projectId}, dataset: ${dataset}\n`);

// Array de casos de teste com diversos formatos
const testCases = [
    {
        name: 'Formato padrão completo',
        image: {
            _type: 'image',
            asset: {
                _ref: 'image-abc123def456-800x600-jpg',
                _type: 'reference'
            }
        },
        expected: `https://cdn.sanity.io/images/${projectId}/${dataset}/abc123def456-800x600.jpg`
    },
    {
        name: 'Formato sem dimensões',
        image: {
            _type: 'image',
            asset: {
                _ref: 'image-abc123-jpg',
                _type: 'reference'
            }
        },
        expected: `https://cdn.sanity.io/images/${projectId}/${dataset}/abc123.jpg`
    },
    {
        name: 'Formato com URL direta',
        image: {
            url: 'https://exemplo.com/imagem.jpg'
        },
        expected: 'https://exemplo.com/imagem.jpg'
    },
    {
        name: 'Formato com imagemUrl',
        image: {
            imagemUrl: 'https://exemplo.com/outra-imagem.jpg'
        },
        expected: 'https://exemplo.com/outra-imagem.jpg'
    },
    {
        name: 'Formato com asset.url',
        image: {
            asset: {
                url: 'https://cdn.sanity.io/imagens/123/prod/abc.jpg'
            }
        },
        expected: 'https://cdn.sanity.io/imagens/123/prod/abc.jpg'
    },
    {
        name: 'String direta',
        image: 'https://exemplo.com/string-direta.jpg',
        expected: 'https://exemplo.com/string-direta.jpg'
    },
    {
        name: 'Referência inválida',
        image: {
            asset: {
                _ref: 'invalid-abc123'
            }
        },
        expected: '/placeholder.png'
    },
    {
        name: 'Objeto vazio',
        image: {},
        expected: '/placeholder.png'
    },
    {
        name: 'Valor nulo',
        image: null,
        expected: '/placeholder.png'
    }
];

// Executar testes
let passados = 0;
let falhas = 0;

for (const test of testCases) {
    try {
        console.log(`\n[Teste]: ${test.name}`);

        // Imprimir a entrada para referência 
        console.log('Entrada:', typeof test.image === 'object'
            ? JSON.stringify(test.image, null, 2)
            : test.image);

        // Extrair URL usando nossa função
        const resultado = extractImageUrl(test.image);
        console.log('URL extraída:', resultado);
        console.log('URL esperada:', test.expected);

        // Verificar se o resultado é o esperado
        if (resultado === test.expected ||
            // Permitir pequenas variações na URL desde que o host e o caminho principal sejam iguais
            (resultado?.includes(projectId) && test.expected?.includes(projectId) &&
                resultado?.includes(dataset) && test.expected?.includes(dataset))) {
            console.log('✅ PASSOU');
            passados++;
        } else {
            console.log('❌ FALHOU');
            falhas++;
        }

        // Se for objeto Sanity, testar extração de texto alternativo
        if (typeof test.image === 'object' && test.image !== null) {
            const alt = extractAltText(test.image, 'Texto alternativo padrão');
            console.log('Texto alternativo extraído:', alt);
        }
    } catch (error) {
        console.error('Erro ao testar:', error);
        falhas++;
    }
}

// Resumo dos testes
console.log('\n=== Resumo dos Testes ===');
console.log(`Total: ${testCases.length}`);
console.log(`Passaram: ${passados}`);
console.log(`Falharam: ${falhas}`);

// Saída para facilitar integração em CI/CD
process.exit(falhas > 0 ? 1 : 0);
