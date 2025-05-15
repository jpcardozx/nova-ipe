// Script para depurar geração de URLs de imagens do Sanity
// Versão melhorada: Maio 2025 - Suporte a vários formatos do Sanity

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '0nks58lj';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

/**
 * Função robusta de extração de URL para imagens do Sanity
 * Compatível com vários formatos de referência
 */
function extractImageUrl(ref) {
    if (!ref) return { url: null, error: 'Referência nula' };

    try {
        const refParts = ref.split('-');

        // Validação básica
        if (refParts[0] !== 'image' || refParts.length < 2) {
            return {
                url: null,
                error: `Formato inválido: ${ref}`,
                info: 'Deve começar com "image" e ter múltiplas partes'
            };
        }

        let id, dimensions, extension;

        // Caso especial: formato mais longo (hash extenso)
        if (refParts.length > 4) {
            // Identificar a parte que contém dimensões (formato: NxM)
            const dimIndex = refParts.findIndex(part => /^\d+x\d+$/.test(part));
            if (dimIndex > 1) {
                id = refParts.slice(1, dimIndex).join('-');
                dimensions = refParts[dimIndex];
                extension = refParts[dimIndex + 1].split('?')[0];
            } else {
                // Formato não reconhecido, usar primeiras partes
                id = refParts[1];
                dimensions = '';
                extension = 'jpg';
            }
        }
        // Formato padrão: image-abc123-800x600-jpg
        else if (refParts.length >= 4 && refParts[2].includes('x')) {
            id = refParts[1];
            dimensions = refParts[2];
            extension = refParts[3].split('?')[0];
        }
        // Formato simplificado: image-abc123-jpg
        else if (refParts.length === 3) {
            id = refParts[1];
            dimensions = '';
            extension = refParts[2].split('?')[0];
        }
        // Fallback para formato mínimo
        else {
            id = refParts[1];
            dimensions = '';
            extension = 'jpg';
        }

        // Construir URL final com base no formato detectado
        const url = dimensions
            ? `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${extension}`
            : `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}.${extension}`;

        return {
            url,
            id,
            dimensions,
            extension,
            format: dimensions ? 'com-dimensoes' : 'simples'
        };
    } catch (err) {
        return { url: null, error: `Erro ao processar: ${err.message}` };
    }
}

// Testa casos mais complexos incluindo formatos complicados
const testCases = [
    { desc: 'Referência básica', ref: 'image-abc123-800x600-jpg' },
    { desc: 'Referência com extensão PNG', ref: 'image-def456-1024x768-png' },
    { desc: 'Referência com formato WebP', ref: 'image-ghi789-400x300-webp' },
    { desc: 'Referência longa', ref: 'image-1854e7dd5423c8cbe4ae42eb038cd95a0aa0db9a-3456x5184-jpg' },
    { desc: 'Referência simples', ref: 'image-abc123-jpg' },
    { desc: 'Referência com parâmetros', ref: 'image-abc123-800x600-jpg?w=800&h=600&fit=crop' },
    { desc: 'Referência inválida', ref: 'invalidformat' }
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
