/**
 * Refractor Language Fallback Module
 * @description Comprehensive fallback for refractor language modules
 * @version 2.0.0
 * @date 26/05/2025
 */

// Basic language definition structure for refractor
const createBasicLanguage = (name, patterns = {}) => ({
  name,
  patterns: {
    keyword: {
      pattern: /\b(?:function|var|let|const|if|else|for|while|return|class|import|export)\b/,
      greedy: true
    },
    string: {
      pattern: /(["'`])(?:\\[\s\S]|(?!\1)[^\\])*\1/,
      greedy: true
    },
    comment: {
      pattern: /\/\*[\s\S]*?\*\/|\/\/.*/,
      greedy: true
    },
    number: {
      pattern: /\b\d+(?:\.\d+)?\b/
    },
    punctuation: /[{}[\];(),.:]/,
    ...patterns
  }
});

// Create fallback language definitions
const javascript = createBasicLanguage('javascript', {
  keyword: {
    pattern: /\b(?:async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|function|if|implements|import|in|instanceof|interface|let|new|null|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/
  },
  boolean: /\b(?:true|false)\b/,
  function: /\w+(?=\()/,
  'class-name': {
    pattern: /(\b(?:class|interface|extends|implements|instanceof|new)\s+)\w+/i,
    lookbehind: true
  }
});

// Language exports
const languages = {
  javascript,
  typescript: javascript,
  jsx: javascript,
  tsx: javascript,
  json: javascript,
  css: javascript,
  bash: javascript,
  markdown: javascript,
  html: javascript,
  python: javascript
};

// Default export (for refractor/lang/lang.js)
module.exports = javascript;

// Named exports for specific languages
Object.keys(languages).forEach(lang => {
  module.exports[lang] = languages[lang];
});

// Add a register function for compatibility
module.exports.register = function(refractor) {
  Object.keys(languages).forEach(lang => {
    if (refractor && typeof refractor.register === 'function') {
      try {
        refractor.register(languages[lang]);
      } catch (e) {
        // Silently ignore registration errors
      }
    }
  });
};

// Compatibility with different import patterns
module.exports.default = javascript;
module.exports.lang = languages;
