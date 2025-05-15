// Script para depurar geração de URLs de imagens do Sanity

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '0nks58lj';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

// Exemplo de referência de asset do Sanity
const sampleRef = 'image-abc123-800x600-jpg';

// Função simplificada de extração de URL
function extractImageUrl(ref) {
    if (!ref) return null;

    const refParts = ref.split('-');
    if (refParts.length >= 4 && refParts[0] === 'image') {
        const id = refParts[1];
        const dimensions = refParts[2];
        const extension = refParts[3];

        return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${extension}`;
    }

    return null;
}

// Testa alguns formatos comuns
const testCases = [
    { desc: 'Referência básica', ref: 'image-abc123-800x600-jpg' },
    { desc: 'Referência com extensão', ref: 'image-def456-1024x768-png' },
    { desc: 'Referência com formato especial', ref: 'image-ghi789-400x300-webp' }
];

console.log('=== Teste de Geração de URLs Sanity ===');
console.log(`ID do Projeto: ${projectId}`);
console.log(`Dataset: ${dataset}`);
console.log('--------------------------------------');

testCases.forEach(test => {
    const url = extractImageUrl(test.ref);
    console.log(`${test.desc}:`);
    console.log(`  Ref: ${test.ref}`);
    console.log(`  URL: ${url}`);
    console.log('--------------------------------------');
});

// Exemplo simulado de um objeto de imagem completo
const sampleImageObject = {
    asset: {
        _ref: 'image-abc123-800x600-jpg'
    },
    alt: 'Exemplo de imagem'
};

console.log('Objeto de imagem completo:');
console.log(JSON.stringify(sampleImageObject, null, 2));
const completeUrl = extractImageUrl(sampleImageObject.asset._ref);
console.log(`URL gerada: ${completeUrl}`);
