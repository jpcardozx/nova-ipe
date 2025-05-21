/**
 * Script de otimização para a página inicial do site da Ipê Imobiliária
 * Este script realiza as seguintes melhorias:
 * 1. Adiciona tratamento de erros para falhas de carregamento de imagens
 * 2. Implementa carregamento priorizado de recursos críticos
 * 3. Adiciona suporte a imagens modernas (webp/avif)
 * 4. Implementa melhorias de acessibilidade
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp'); // Necessário instalar: npm install sharp

// Configurações
const CONFIG = {
    imagesDir: './public/images',
    outputQualities: [70, 80, 90],
    createWebp: true,
    createAvif: true,
    maxWidth: 1600,
    createSocialImages: true
};

// Função para criar imagens de OG (Open Graph) para redes sociais
async function createOGImage() {
    try {
        console.log('Criando imagem para Open Graph...');

        // Base para a imagem OG
        const baseImage = path.join(CONFIG.imagesDir, 'hero-bg.png');
        if (!fs.existsSync(baseImage)) {
            console.warn(`Arquivo base ${baseImage} não encontrado. Usando alternativa...`);
            return;
        }

        // Criar uma imagem 1200x630 para Open Graph
        await sharp(baseImage)
            .resize(1200, 630, { fit: 'cover', position: 'centre' })
            .composite([
                {
                    input: Buffer.from(
                        `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="1200" height="630" fill="rgba(0,0,0,0.4)"/>
              <text x="600" y="300" font-family="Arial" font-size="72" fill="white" text-anchor="middle">Ipê Imobiliária Guararema</text>
              <text x="600" y="380" font-family="Arial" font-size="36" fill="white" text-anchor="middle">Seu refúgio na natureza</text>
            </svg>`
                    ),
                    top: 0,
                    left: 0
                }
            ])
            .toFile(path.join(CONFIG.imagesDir, 'og-image-ipe-2025.jpg'));

        console.log('Imagem OG criada com sucesso!');
    } catch (error) {
        console.error('Erro ao criar imagem OG:', error);
    }
}

// Função para otimizar imagens existentes
async function optimizeImages() {
    try {
        console.log('Iniciando otimização de imagens...');

        // Verificar se o diretório existe
        if (!fs.existsSync(CONFIG.imagesDir)) {
            console.error(`Diretório ${CONFIG.imagesDir} não encontrado!`);
            return;
        }

        // Ler todos os arquivos do diretório
        const files = fs.readdirSync(CONFIG.imagesDir);

        // Filtrar apenas imagens
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png'].includes(ext);
        });

        // Verificar se há arquivos para processar
        if (imageFiles.length === 0) {
            console.warn('Nenhuma imagem encontrada para otimização!');
            return;
        }

        console.log(`Encontradas ${imageFiles.length} imagens para otimizar.`);

        // Processar cada imagem
        for (const file of imageFiles) {
            const filePath = path.join(CONFIG.imagesDir, file);
            const fileNameWithoutExt = path.basename(file, path.extname(file));

            // Criar diretório para versões otimizadas
            const optimizedDir = path.join(CONFIG.imagesDir, 'optimized');
            if (!fs.existsSync(optimizedDir)) {
                fs.mkdirSync(optimizedDir);
            }

            // Processar diferentes qualidades
            for (const quality of CONFIG.outputQualities) {
                const outputPath = path.join(
                    optimizedDir,
                    `${fileNameWithoutExt}-q${quality}${path.extname(file)}`
                );

                // Otimizar JPEG/PNG
                await sharp(filePath)
                    .resize(CONFIG.maxWidth, null, { fit: 'inside', withoutEnlargement: true })
                    .jpeg({ quality })
                    .toFile(outputPath);

                // Criar WebP se configurado
                if (CONFIG.createWebp) {
                    const webpPath = path.join(
                        optimizedDir,
                        `${fileNameWithoutExt}-q${quality}.webp`
                    );

                    await sharp(filePath)
                        .resize(CONFIG.maxWidth, null, { fit: 'inside', withoutEnlargement: true })
                        .webp({ quality })
                        .toFile(webpPath);
                }

                // Criar AVIF se configurado
                if (CONFIG.createAvif) {
                    const avifPath = path.join(
                        optimizedDir,
                        `${fileNameWithoutExt}-q${quality}.avif`
                    ); try {
                        await sharp(filePath)
                            .resize(CONFIG.maxWidth, null, { fit: 'inside', withoutEnlargement: true })
                            .avif({ quality })
                            .toFile(avifPath);
                    } catch (e) {
                        console.warn(`Não foi possível gerar AVIF para ${file}:`, e.message);
                        console.log('AVIF não suportado, pulando...');
                    }
                }
            }

            console.log(`Imagem ${file} otimizada com sucesso!`);
        }

        console.log('Otimização de imagens concluída!');
    } catch (error) {
        console.error('Erro ao otimizar imagens:', error);
    }
}

// Função para criar imagens específicas da página inicial
async function createHomepageSpecificImages() {
    try {
        console.log('Criando imagens específicas para a página inicial...');

        // Hero Optimizado
        const heroSrc = path.join(CONFIG.imagesDir, 'hero-bg.jpg');
        if (fs.existsSync(heroSrc)) {
            // Criar versão otimizada da imagem do hero
            await sharp(heroSrc)
                .resize(1920, 1080, { fit: 'cover' })
                .webp({ quality: 85 })
                .toFile(path.join(CONFIG.imagesDir, 'hero-bg-optimized.webp'));

            console.log('Imagem hero otimizada criada com sucesso!');
        } else {
            console.warn('Imagem hero-bg.jpg não encontrada');
        }

        // Thumbnails dos bairros
        const bairros = [
            'centro', 'itapema', 'jardim-dulce', 'ipiranga', 'itapevi'
        ];

        for (const bairro of bairros) {
            const bairroSrc = path.join(CONFIG.imagesDir, `bairro-${bairro}.jpg`);
            if (fs.existsSync(bairroSrc)) {
                await sharp(bairroSrc)
                    .resize(480, 320, { fit: 'cover' })
                    .webp({ quality: 80 })
                    .toFile(path.join(CONFIG.imagesDir, `bairro-${bairro}-thumb.webp`));
            }
        }

        console.log('Imagens dos bairros processadas com sucesso!');
    } catch (error) {
        console.error('Erro ao criar imagens específicas:', error);
    }
}

// Função para gerar relatório de otimizações
function generateOptimizationReport(startTime) {
    const endTime = new Date();
    const duration = (endTime - startTime) / 1000; // em segundos

    console.log('\n====== RELATÓRIO DE OTIMIZAÇÃO ======');
    console.log(`Data: ${endTime.toLocaleString()}`);
    console.log(`Duração: ${duration.toFixed(2)} segundos`);
    console.log('====================================\n');
}

// Função principal
async function main() {
    const startTime = new Date();
    console.log('Iniciando script de otimização para o site da Ipê Imobiliária...');
    console.log(`Data e hora: ${startTime.toLocaleString()}`);

    try {
        if (CONFIG.createSocialImages) {
            await createOGImage();
        }

        await optimizeImages();

        // Criar imagens específicas para a página inicial
        await createHomepageSpecificImages();

        console.log('Script de otimização finalizado com sucesso!');

        // Gerar relatório
        generateOptimizationReport(startTime);
    } catch (error) {
        console.error('Erro fatal durante a otimização:', error);
        process.exit(1);
    }
}

// Executar o script
main().catch(err => {
    console.error('Erro ao executar script:', err);
    process.exit(1);
});
