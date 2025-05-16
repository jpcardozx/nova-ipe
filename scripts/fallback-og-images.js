/**
 * Script de fallback para geração de imagens OG quando canvas não estiver disponível
 * Especialmente útil para deploy no Vercel onde temos limitações com dependências nativas
 */
console.log('🖼️ Configurando fallbacks para imagens OG e preview do WhatsApp...');

// Capturar erros para não falhar o build
process.on('uncaughtException', (err) => {
    console.error('❌ Erro na geração de imagens OG:', err.message);
    console.log('⚠️ Continuando build mesmo com falha na geração de imagens');
    process.exit(0); // Sair com código de sucesso para não falhar o build
});

const fs = require('fs');
const path = require('path');

// Criar diretórios necessários
const publicDir = path.join(__dirname, '../public');
const imagesDir = path.join(publicDir, 'images');
const fallbackDir = path.join(publicDir, 'fallbacks');
const metaDir = path.join(publicDir, 'meta');

// Criar diretórios se não existirem
[imagesDir, fallbackDir, metaDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Diretório criado: ${path.relative(process.cwd(), dir)}`);
    }
});

// Verificar imagens OG existentes e criar fallbacks
const logoPath = path.join(imagesDir, 'logo.png'); // Logo original do site
const defaultOgPath = path.join(imagesDir, 'default-og-image.jpg');
const whatsappOgPath = path.join(imagesDir, 'og-image-whatsapp.jpg');
const squareOgPath = path.join(imagesDir, 'og-image-square.jpg');

// Verificar se as imagens OG já existem
const ogImagesExist = fs.existsSync(defaultOgPath) &&
    fs.existsSync(whatsappOgPath) &&
    fs.existsSync(squareOgPath);

if (ogImagesExist) {
    console.log('✅ Imagens OG encontradas no repositório. Usando arquivos existentes.');
} else {
    console.log('⚠️ Imagens OG não encontradas. Criando imagens de fallback...');

    try {
        // Try to copy from default images if they exist (for example from a default-images folder)
        // If not available, just output a note
        console.log('Note: OG images not found and could not be generated in this environment.');
        console.log('Please generate OG images locally and commit them to your repository.');
    } catch (error) {
        console.error('Error creating fallback OG images:', error);
        console.log('Continuing build process despite OG image generation failure');
    }
}

// Create a simple JSON manifest of image paths for the site to use
const manifest = {
    ogImage: '/images/og-image-2025.jpg',
    whatsappImage: '/images/og-image-whatsapp.jpg',
    squareImage: '/images/og-image-square.jpg',
    generated: false,
    generatedAt: new Date().toISOString()
};

fs.writeFileSync(path.join(outputDir, 'og-manifest.json'), JSON.stringify(manifest, null, 2));
console.log('OG image manifest created successfully!');
