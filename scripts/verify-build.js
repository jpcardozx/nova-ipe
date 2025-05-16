/**
 * Simple script to verify the build configuration
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Verifying build configuration...\n');

// Dumps content of a file for inspection
function dumpFileContents(filePath) {
    console.log(`\n--- Contents of ${path.basename(filePath)} ---`);
    console.log(fs.readFileSync(filePath, 'utf8'));
    console.log(`--- End of ${path.basename(filePath)} ---\n`);
}

// Check PostCSS config
const postcssConfigPath = path.join(process.cwd(), 'postcss.config.js');
if (fs.existsSync(postcssConfigPath)) {
    console.log('✅ PostCSS config exists');
    dumpFileContents(postcssConfigPath);

    try {
        const postcssConfig = require(postcssConfigPath);
        if (postcssConfig && postcssConfig.plugins) {
            console.log('✅ PostCSS plugins configured:', Object.keys(postcssConfig.plugins));
        } else {
            console.error('❌ PostCSS config is missing plugins property or has incorrect format');
            console.log('PostCSS config content:', JSON.stringify(postcssConfig, null, 2));
        }
    } catch (error) {
        console.error('❌ Error loading PostCSS config:', error.message);
    }
} else {
    console.error('❌ PostCSS config file missing');
}

// Check Tailwind config
const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.js');
if (fs.existsSync(tailwindConfigPath)) {
    console.log('✅ Tailwind config exists');

    try {
        const tailwindConfig = require(tailwindConfigPath);
        if (tailwindConfig && tailwindConfig.content) {
            console.log('✅ Tailwind content paths configured:', tailwindConfig.content);
        } else {
            console.error('❌ Tailwind config is missing content property');
        }
    } catch (error) {
        console.error('❌ Error loading Tailwind config:', error.message);
    }
}

// Check Next.js config
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
if (fs.existsSync(nextConfigPath)) {
    console.log('✅ Next.js config exists');
    dumpFileContents(nextConfigPath);
} else {
    console.error('❌ Next.js config is missing');
}

// Check package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
    console.log('✅ package.json exists');
    try {
        const packageJson = require(packageJsonPath);
        console.log('📦 Dependencies:', Object.keys(packageJson.dependencies || {}).length);
        console.log('📦 Scripts:', Object.keys(packageJson.scripts || {}).length);
    } catch (error) {
        console.error('❌ Error loading package.json:', error.message);
    }
}

console.log('\n✅ Verification complete!\n');
