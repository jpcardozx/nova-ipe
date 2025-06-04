/**
 * Self polyfill module for webpack ProvidePlugin
 * This module provides 'self' for server-side rendering
 */

if (typeof self !== 'undefined') {
  module.exports = self;
} else if (typeof global !== 'undefined') {
  module.exports = global;
} else if (typeof window !== 'undefined') {
  module.exports = window;
} else {
  module.exports = this;
}
