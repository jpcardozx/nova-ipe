/**
 * Refractor TypeScript Language Module
 * @description Fallback TypeScript language definition for refractor
 */

const typescript = {
  name: 'typescript',
  patterns: {
    keyword: {
      pattern: /\b(?:abstract|any|as|asserts|async|await|boolean|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|infer|instanceof|interface|is|keyof|let|module|namespace|never|new|null|number|object|of|package|private|protected|public|readonly|require|return|set|static|string|super|switch|symbol|this|throw|true|try|type|typeof|undefined|unique|unknown|var|void|while|with|yield)\b/
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
    boolean: /\b(?:true|false)\b/,
    function: /\w+(?=\()/,
    'type-definition': {
      pattern: /(\b(?:type|interface)\s+)\w+/,
      lookbehind: true,
      alias: 'class-name'
    },
    punctuation: /[{}[\];(),.:]/
  }
};

module.exports = typescript;
module.exports.default = typescript;
