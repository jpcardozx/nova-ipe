// Script to generate OpenGraph images for the site
// Run with: npm run generate-og-images

const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const { registerFont } = require('canvas');

// Register fonts
registerFont(path.join(__dirname, '../node_modules/@fontsource/montserrat/files/montserrat-latin-400-normal.woff'), {
    family: 'Montserrat',
    weight: '400'
});

registerFont(path.join(__dirname, '../node_modules/@fontsource/montserrat/files/montserrat-latin-700-normal.woff'), {
    family: 'Montserrat',
    weight: '700'
});

// Create directory if it doesn't exist
const outputDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Generate main OG image
async function generateMainOGImage() {
    // Create canvas with OG image dimensions
    const width = 1200;
    const height = 630;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Draw background
    ctx.fillStyle = '#0D1F2D';
    ctx.fillRect(0, 0, width, height);

    try {        // Use a solid color instead of background image since we don't have guararema-background.jpg
        // Draw a subtle pattern or texture
        ctx.fillStyle = '#0D1F2D';
        ctx.fillRect(0, 0, width, height);

        // Add subtle pattern (using existing texture if available)
        try {
            const patternImage = await loadImage(path.join(__dirname, '../public/texture-elegant.png'));
            const pattern = ctx.createPattern(patternImage, 'repeat');
            ctx.globalAlpha = 0.1; // Very subtle
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, width, height);
            ctx.globalAlpha = 1.0;
        } catch (err) {
            console.log('No texture image found, continuing without pattern');
        }

        // Add overlay gradient
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, 'rgba(13, 31, 45, 0.7)');
        gradient.addColorStop(1, 'rgba(13, 31, 45, 0.9)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);        // Load and draw logo (using ipeLogo.png instead of logo.png)
        const logo = await loadImage(path.join(__dirname, '../public/images/ipeLogo.png'));
        const logoWidth = 200;
        const logoHeight = 200;
        ctx.drawImage(logo, 50, 50, logoWidth, logoHeight);

        // Add title text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 64px Montserrat';
        ctx.fillText('Imóveis Premium em', 50, 280);
        ctx.fillText('Guararema', 50, 360);

        // Add subtitle
        ctx.font = '32px Montserrat';
        ctx.fillText('Propriedades exclusivas para compra e aluguel', 50, 420);
        ctx.fillText('com atendimento personalizado', 50, 470);

        // Add decorative elements
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(50, 400);
        ctx.lineTo(550, 400);
        ctx.stroke();

        // Add border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.strokeRect(20, 20, width - 40, height - 40);

        // Save the image
        const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
        fs.writeFileSync(path.join(outputDir, 'og-image-2025.jpg'), buffer);
        console.log('Main OG image generated successfully!');

        // Generate square version for different platforms
        generateSquareVersion(buffer);

        // Generate WhatsApp optimized version
        generateWhatsAppVersion(buffer);

    } catch (error) {
        console.error('Error generating OG image:', error);
    }
}

// Generate square format (1080x1080) for Instagram and other platforms
async function generateSquareVersion(mainImageBuffer) {
    const size = 1080;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Draw background
    ctx.fillStyle = '#0D1F2D';
    ctx.fillRect(0, 0, size, size);

    try {
        // Load and draw background image
        const bgImage = await loadImage(path.join(__dirname, '../public/images/guararema-aerial.jpg'));
        ctx.globalAlpha = 0.3;

        // Calculate dimensions to cover the square while maintaining aspect ratio
        const bgAspectRatio = bgImage.width / bgImage.height;
        let drawWidth, drawHeight, offsetX = 0, offsetY = 0;

        if (bgAspectRatio > 1) { // Wider than tall
            drawHeight = size;
            drawWidth = drawHeight * bgAspectRatio;
            offsetX = (size - drawWidth) / 2;
        } else { // Taller than wide
            drawWidth = size;
            drawHeight = drawWidth / bgAspectRatio;
            offsetY = (size - drawHeight) / 2;
        }

        ctx.drawImage(bgImage, offsetX, offsetY, drawWidth, drawHeight);
        ctx.globalAlpha = 1.0;

        // Add overlay
        const gradient = ctx.createLinearGradient(0, 0, size, size);
        gradient.addColorStop(0, 'rgba(13, 31, 45, 0.7)');
        gradient.addColorStop(1, 'rgba(13, 31, 45, 0.9)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);

        // Load and draw logo
        const logo = await loadImage(path.join(__dirname, '../public/images/logo.png'));
        ctx.drawImage(logo, (size - 300) / 2, 100, 300, 120);

        // Add title text
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.font = 'bold 64px Montserrat';
        ctx.fillText('Imóveis Premium', size / 2, 400);
        ctx.fillText('em Guararema', size / 2, 480);

        // Add subtitle
        ctx.font = '32px Montserrat';
        ctx.fillText('Compra · Venda · Locação', size / 2, 560);

        // Add decorative elements
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(size / 2 - 200, 510);
        ctx.lineTo(size / 2 + 200, 510);
        ctx.stroke();

        // Add border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.strokeRect(20, 20, size - 40, size - 40);

        // Save the image
        const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
        fs.writeFileSync(path.join(outputDir, 'og-image-square.jpg'), buffer);
        console.log('Square OG image generated successfully!');

    } catch (error) {
        console.error('Error generating square OG image:', error);
    }
}

// Generate WhatsApp optimized version (400x400)
async function generateWhatsAppVersion() {
    const size = 400;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Draw background with WhatsApp-friendly color
    ctx.fillStyle = '#0D1F2D';
    ctx.fillRect(0, 0, size, size);

    try {
        // Simplified version optimized for small previews
        // Load and draw logo
        const logo = await loadImage(path.join(__dirname, '../public/images/logo.png'));
        ctx.drawImage(logo, (size - 200) / 2, 50, 200, 80);

        // Add text
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.font = 'bold 32px Montserrat';
        ctx.fillText('Nova Ipê', size / 2, 180);

        ctx.font = '24px Montserrat';
        ctx.fillText('Imobiliária', size / 2, 220);

        ctx.font = 'bold 20px Montserrat';
        ctx.fillText('Guararema · SP', size / 2, 260);

        // Add decorative element
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(size / 2 - 80, 320);
        ctx.lineTo(size / 2 + 80, 320);
        ctx.stroke();

        // Add call to action
        ctx.fillStyle = '#F59E0B';
        ctx.font = '18px Montserrat';
        ctx.fillText('Imóveis Premium', size / 2, 350);

        // Add border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.strokeRect(10, 10, size - 20, size - 20);

        // Save the image
        const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
        fs.writeFileSync(path.join(outputDir, 'og-image-whatsapp.jpg'), buffer);
        console.log('WhatsApp OG image generated successfully!');

    } catch (error) {
        console.error('Error generating WhatsApp OG image:', error);
    }
}

// Run all generators
generateMainOGImage();
