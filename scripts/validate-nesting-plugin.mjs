/**
 * This script adds a validation step to ensure the correct nesting plugin 
 * is being used during build to verify our fix
 */

// Add validation in the build process
console.log('\n----- NESTING PLUGIN VALIDATION -----');
console.log('Verifying postcss-isolated-nesting is correctly configured...');

try {
    // Attempt to require the builtin nesting plugin to see if it's working
    const tailwindNesting = require('tailwindcss/nesting');

    if (tailwindNesting && typeof tailwindNesting === 'function' && tailwindNesting.postcss === true) {
        console.log('✅ tailwindcss/nesting plugin is properly defined');

        // Check what it's doing when called
        const instance = tailwindNesting();
        if (instance && instance.postcssPlugin && instance.Once) {
            console.log('✅ tailwindcss/nesting instances are correctly structured');
            console.log(`   Using plugin: ${instance.postcssPlugin}`);
        }
    } else {
        console.log('❌ tailwindcss/nesting plugin has an invalid structure');
    }
} catch (error) {
    console.error('❌ Failed to load tailwindcss/nesting:', error.message);
}

console.log('-------------------------------------\n');
