const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createProperIcons() {
  const iconsDir = path.join(__dirname, 'public', 'icons');
  
  try {
    console.log('Creating proper PNG icons...');
    
    // Create a proper 192x192 icon with decent size
    const icon192Buffer = await sharp({
      create: {
        width: 192,
        height: 192,
        channels: 4,
        background: { r: 19, g: 133, b: 78, alpha: 1 }
      }
    })
    .png({
      compressionLevel: 6,
      quality: 95
    })
    .toBuffer();

    // Create a proper 512x512 icon
    const icon512Buffer = await sharp({
      create: {
        width: 512,
        height: 512,  
        channels: 4,
        background: { r: 19, g: 133, b: 78, alpha: 1 }
      }
    })
    .png({
      compressionLevel: 6,
      quality: 95
    })
    .toBuffer();

    console.log('Icon buffers created:', {
      icon192Size: icon192Buffer.length,
      icon512Size: icon512Buffer.length
    });

    // Write the buffers to files
    fs.writeFileSync(path.join(iconsDir, 'icon-192x192.png'), icon192Buffer);
    fs.writeFileSync(path.join(iconsDir, 'icon-512x512.png'), icon512Buffer);
    fs.writeFileSync(path.join(iconsDir, 'icon-maskable-192x192.png'), icon192Buffer);
    fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512x512.png'), icon512Buffer);

    console.log('PNG icons created successfully!');
    
    // Verify file sizes
    const stats = {
      'icon-192x192.png': fs.statSync(path.join(iconsDir, 'icon-192x192.png')).size,
      'icon-512x512.png': fs.statSync(path.join(iconsDir, 'icon-512x512.png')).size,
      'icon-maskable-192x192.png': fs.statSync(path.join(iconsDir, 'icon-maskable-192x192.png')).size,
      'icon-maskable-512x512.png': fs.statSync(path.join(iconsDir, 'icon-maskable-512x512.png')).size
    };
    
    console.log('File sizes:', stats);
    
  } catch (error) {
    console.error('Error creating icons:', error);
  }
}

createProperIcons();
