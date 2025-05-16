// This is a fallback script when canvas is not available (e.g., in cloud environments)
console.log('Canvas dependency not available - using fallback OG image strategy');

// Capture any errors that might occur and handle them gracefully
process.on('uncaughtException', (err) => {
    console.error('Error in OG image generation:', err.message);
    console.log('Continuing build process despite OG image generation failure');
    process.exit(0); // Exit with success code to not fail the build
});

const fs = require('fs');
const path = require('path');

// Create directory if it doesn't exist
const outputDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Check if the OG images already exist, if not copy the default ones
const defaultOgImagePath = path.join(__dirname, '../public/images/default-og-image.jpg');
const ogImagePath = path.join(outputDir, 'og-image-2025.jpg');
const whatsappImagePath = path.join(outputDir, 'og-image-whatsapp.jpg');
const squareImagePath = path.join(outputDir, 'og-image-square.jpg');

// Check if the OG images already exist
if (fs.existsSync(ogImagePath) && fs.existsSync(whatsappImagePath) && fs.existsSync(squareImagePath)) {
    console.log('OG images found in the repository. Using existing files.');
} else {
    console.log('OG images not found. Attempting to create fallback images...');

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
