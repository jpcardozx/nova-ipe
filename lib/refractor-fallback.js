/**
 * Refractor Fallback for Sanity Studio
 * 
 * This file provides fallbacks for refractor language modules that Sanity Studio
 * tries to import but may not be available in the build.
 */

// Create mock language modules that return empty objects
const createMockLanguage = (name) => ({
  displayName: name,
  aliases: [],
  default: {
    displayName: name,
    aliases: [],
  }
});

// Export mock modules for each language Sanity tries to import
module.exports = {
  bash: createMockLanguage('bash'),
  javascript: createMockLanguage('javascript'),
  json: createMockLanguage('json'),
  jsx: createMockLanguage('jsx'),
  typescript: createMockLanguage('typescript'),
};

// Also provide a default export
module.exports.default = module.exports.javascript;
