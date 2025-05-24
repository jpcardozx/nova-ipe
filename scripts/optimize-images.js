// Script para otimizar imagens grandes do projeto
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuração
const CONFIG = {
    imagesDir: path.join(__dirname, '../public/images'),
    outputFormats: ['webp', 'avif'],
    compressionLevel: 80, // Qualidade de compressão (0-100)
    resizeDimensions: [
        { width: 1920, suffix: 'large' },
        { width: 1280, suffix: 'medium' },
        { width: 640, suffix: 'small' }
    ]
};

// Lista de imagens para otimizar
const IMAGES_TO_OPTIMIZE = [
    'hero-bg.png',
    'hero.png'
];

async function optimizeImage(imagePath, outputPath, format, width) {
    // Criar diretório se não existir
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    try {
        // Processamento com o sharp
        let processor = sharp(imagePath);

        // Redimensionar se uma largura for especificada
        if (width) {
            processor = processor.resize(width, null, {
                withoutEnlargement: true,
                fit: 'inside'
            });
        }

        // Converter e comprimir baseado no formato
        if (format === 'webp') {
            processor = processor.webp({ quality: CONFIG.compressionLevel });
        } else if (format === 'avif') {
            processor = processor.avif({ quality: CONFIG.compressionLevel });
        }

        // Salvar o arquivo
        await processor.toFile(outputPath);
        console.log(`✓ Otimizado: ${path.basename(outputPath)}`);
    } catch (error) {
        console.error(`✗ Erro ao otimizar ${path.basename(imagePath)}:`, error.message);
    }
}

async function optimizeAllImages() {
    console.log('Iniciando otimização de imagens...');

    for (const imageName of IMAGES_TO_OPTIMIZE) {
        const imagePath = path.join(CONFIG.imagesDir, imageName);

        // Verificar se a imagem existe
        if (!fs.existsSync(imagePath)) {
            console.warn(`Imagem não encontrada: ${imagePath}`);
            continue;
        }

        const fileNameWithoutExt = path.parse(imageName).name;

        // Criar versões em cada formato e tamanho
        for (const format of CONFIG.outputFormats) {
            // Versão completa
            const outputPathFull = path.join(
                CONFIG.imagesDir,
                'optimized',
                `${fileNameWithoutExt}.${format}`
            );
            await optimizeImage(imagePath, outputPathFull, format);

            // Versões redimensionadas
            for (const size of CONFIG.resizeDimensions) {
                const outputPathSized = path.join(
                    CONFIG.imagesDir,
                    'optimized',
                    `${fileNameWithoutExt}-${size.suffix}.${format}`
                );
                await optimizeImage(imagePath, outputPathSized, format, size.width);
            }
        }
    }

    console.log('Otimização de imagens concluída!');
}

optimizeAllImages();
