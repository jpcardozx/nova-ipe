/**
 * Refractor Language Preloader
 * 
 * This module is imported early to ensure all required syntax highlighting
 * languages are available before Sanity tries to use them
 */

// Import the refractor package
import refractor from 'refractor';

// Core refractor languages needed by Sanity
import bash from 'refractor/lang/bash.js';
import javascript from 'refractor/lang/javascript.js';
import json from 'refractor/lang/json.js';
import jsx from 'refractor/lang/jsx.js';
import typescript from 'refractor/lang/typescript.js';

// Additional languages that might be useful
import tsx from 'refractor/lang/tsx.js';
import css from 'refractor/lang/css.js';
import markdown from 'refractor/lang/markdown.js';

// Register all languages with refractor
refractor.register(bash);
refractor.register(javascript);
refractor.register(json);
refractor.register(jsx);
refractor.register(typescript);
refractor.register(tsx);
refractor.register(css);
refractor.register(markdown);

// Console confirmation
console.log('✅ Refractor language modules registered successfully');

// Export for possible reuse
export { refractor };
