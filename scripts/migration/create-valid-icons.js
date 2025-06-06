const sharp = require('sharp');
const path = require('path');

async function createValidIcons() {
  const iconsDir = path.join(__dirname, 'public', 'icons');
  
  try {
    // Create a simple colored square as a valid PNG
    const icon192 = await sharp({
      create: {
        width: 192,
        height: 192,
        channels: 4,
        background: { r: 19, g: 133, b: 78, alpha: 1 } // #13854E color
      }
    })
    .png()
    .toBuffer();

    const icon512 = await sharp({
      create: {
        width: 512,
        height: 512,
        channels: 4,
        background: { r: 19, g: 133, b: 78, alpha: 1 }
      }
    })
    .png()
    .toBuffer();

    // Write files
    require('fs').writeFileSync(path.join(iconsDir, 'icon-192x192.png'), icon192);
    require('fs').writeFileSync(path.join(iconsDir, 'icon-512x512.png'), icon512);
    require('fs').writeFileSync(path.join(iconsDir, 'icon-maskable-192x192.png'), icon192);
    require('fs').writeFileSync(path.join(iconsDir, 'icon-maskable-512x512.png'), icon512);

    console.log('Valid PNG icons created successfully!');
  } catch (error) {
    console.error('Error creating icons:', error);
  }
}

createValidIcons();
