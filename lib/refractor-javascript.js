/**
 * Refractor JavaScript Language Module
 * @description Fallback JavaScript language definition for refractor
 */

const javascript = {
  name: 'javascript',
  patterns: {
    keyword: {
      pattern: /\b(?:async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|function|if|implements|import|in|instanceof|interface|let|new|null|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/
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
    punctuation: /[{}[\];(),.:]/
  }
};

module.exports = javascript;
module.exports.default = javascript;
