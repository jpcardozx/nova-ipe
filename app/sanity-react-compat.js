// React compatibility layer for Sanity Studio
// This file ensures compatibility between different React versions

if (typeof window !== 'undefined') {
  // Browser compatibility shims
  window.React = require('react');
  window.ReactDOM = require('react-dom');
}

// Export empty object to satisfy imports
module.exports = {};