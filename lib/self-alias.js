// Simple self polyfill module
if (typeof global !== 'undefined') {
  module.exports = global;
} else if (typeof globalThis !== 'undefined') {
  module.exports = globalThis;
} else {
  module.exports = {};
}

// Ensure webpackChunk_N_E exists
if (typeof module.exports.webpackChunk_N_E === 'undefined') {
  module.exports.webpackChunk_N_E = [];
}
