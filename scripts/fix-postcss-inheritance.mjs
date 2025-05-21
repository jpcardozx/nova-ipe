/**
 * This script ensures all PostCSS related modules are correctly setup
 * It focuses on fixing the "Class extends value undefined is not a constructor or null" error
 * by ensuring all plugin inheritance chains are properly established
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking for PostCSS and Tailwind dependency issues...');

// Check for PostCSS
const postcssPath = path.join(process.cwd(), 'node_modules', 'postcss');
const tailwindPath = path.join(process.cwd(), 'node_modules', 'tailwindcss');
const nestingPath = path.join(tailwindPath, 'nesting');
const standaloneNestingPath = path.join(process.cwd(), 'lib', 'plugins', 'postcss-isolated-nesting.js');
const nestedShimPath = path.join(process.cwd(), 'lib', 'plugins', 'postcss-nested-shim.js');

// Ensure our plugins exist
if (!fs.existsSync(standaloneNestingPath)) {
    console.error('❌ Standalone nesting plugin not found at: ' + standaloneNestingPath);
    process.exit(1);
}

if (!fs.existsSync(nestedShimPath)) {
    console.error('❌ Nested shim plugin not found at: ' + nestedShimPath);
    process.exit(1);
}

// Fix tailwindcss/nesting by replacing it with our standalone version
if (fs.existsSync(tailwindPath)) {
    // Make sure the nesting directory exists
    if (!fs.existsSync(nestingPath)) {
        try {
            fs.mkdirSync(nestingPath, { recursive: true });
            console.log('✅ Created nesting directory at: ' + nestingPath);
        } catch (err) {
            console.error('❌ Failed to create nesting directory: ' + err.message);
        }
    }

    // Copy our standalone implementation
    try {
        fs.copyFileSync(standaloneNestingPath, path.join(nestingPath, 'index.js'));
        console.log('✅ Installed standalone nesting plugin to tailwindcss/nesting');
    } catch (err) {
        console.error('❌ Failed to copy standalone nesting plugin: ' + err.message);
    }

    // Create a package.json for the nesting module
    try {
        const nestingPackageJson = {
            name: "tailwindcss-nesting",
            version: "1.0.0",
            main: "index.js"
        };
        fs.writeFileSync(
            path.join(nestingPath, 'package.json'),
            JSON.stringify(nestingPackageJson, null, 2)
        );
        console.log('✅ Created package.json for nesting plugin');
    } catch (err) {
        console.error('❌ Failed to create package.json for nesting: ' + err.message);
    }
}

// Also check for postcss-nested and postcss-nesting to prevent potential conflicts
const nestedPlugins = [
    'postcss-nested',
    'postcss-nesting',
    '@csstools/postcss-nested'
];

nestedPlugins.forEach(pluginName => {
    const pluginPath = path.join(process.cwd(), 'node_modules', pluginName);

    if (fs.existsSync(pluginPath)) {
        console.log(`⚠️ Found potentially conflicting plugin: ${pluginName}`);

        // Create a simple replacement that avoids conflicts
        try {      // Create index.js that exports our nested shim plugin
            fs.writeFileSync(
                path.join(pluginPath, 'index.js'),
                `module.exports = require('${nestedShimPath.replace(/\\/g, '/')}');`
            );
            console.log(`✅ Fixed ${pluginName} to use our nested shim implementation`);
        } catch (err) {
            console.error(`❌ Failed to fix ${pluginName}: ${err.message}`);
        }
    }
});

console.log('✅ PostCSS dependency check complete');
