// This hook ensures PostCSS configuration stays valid during build
import fs from 'node:fs';
import path from 'node:path';
const originalRequire = module.constructor.prototype.require;

// Standard valid PostCSS config for Next.js
const validConfig = {
    plugins: {
        'tailwindcss': {},
        'autoprefixer': {}
    }
};

module.constructor.prototype.require = function (id) {
    // Intercept any attempts to load postcss.config.js
    if (id === 'postcss.config.js' || id.endsWith('/postcss.config.js')) {
        console.log('🛡️ PostCSS config protection: Serving standard config');
        return validConfig;
    }

    return originalRequire.apply(this, arguments);
};

console.log('✅ PostCSS configuration protection active');
