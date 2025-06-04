/**
 * Webpack loader to inject 'self' polyfill into JavaScript files
 * This ensures that 'self' is defined in SSR environment
 */
module.exports = function(source) {
  // Only inject polyfill if 'self' is referenced and not already defined
  if (source.includes('self.') || source.includes('self[')) {
    const polyfill = `
if (typeof self === 'undefined') {
  if (typeof global !== 'undefined') {
    var self = global;
  } else if (typeof window !== 'undefined') {
    var self = window;
  } else {
    var self = this;
  }
}
`;
    return polyfill + source;
  }
  
  return source;
};
