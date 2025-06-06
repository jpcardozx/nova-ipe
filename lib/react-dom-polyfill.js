/**
 * React DOM Polyfill for server-side rendering
 * This file provides polyfills for DOM APIs used by React DOM during SSR
 */

if (typeof globalThis !== 'undefined' && typeof window === 'undefined') {
  // We're in a Node.js environment, not a browser

  // Create a proper mock for document.createElement
  const mockElement = {
    setAttribute: function(name, value) {
      this[name] = value;
    },
    style: {},
    addEventListener: function() {},
    removeEventListener: function() {},
    appendChild: function() {},
    removeChild: function() {},
    classList: {
      add: function() {},
      remove: function() {},
      toggle: function() {},
      contains: function() { return false; }
    }
  };
  
  // Set up a minimal DOM-like environment
  globalThis.document = {
    createElement: function() {
      return { ...mockElement };
    },
    createElementNS: function() {
      return { ...mockElement };
    },
    body: { ...mockElement },
    head: { ...mockElement },
    documentElement: { ...mockElement },
    createTextNode: function() { return {}; },
    getElementById: function() { return null; },
    querySelector: function() { return null; },
    querySelectorAll: function() { return []; },
    addEventListener: function() {},
    removeEventListener: function() {}
  };
  
  // A better self/window polyfill
  globalThis.self = globalThis;
  globalThis.window = globalThis;
  globalThis.self.self = globalThis.self;
  
  // Add critical browser APIs
  globalThis.Element = function() {};
  globalThis.HTMLElement = function() {};
  globalThis.Event = function() {};
  globalThis.CustomEvent = function() {};
    // Navigator - Safe assignment to avoid SSR readonly property error
  if (typeof globalThis.navigator === 'undefined') {
    try {
      Object.defineProperty(globalThis, 'navigator', {
        value: {
          userAgent: 'Mozilla/5.0 (compatible; Node.js SSR)',
          platform: 'Node.js',
          language: 'en-US',
          languages: ['en-US', 'en']
        },
        writable: false,
        configurable: true
      });
    } catch (e) {
      // Fallback if defineProperty fails - don't set navigator at all
      console.warn('Could not define navigator in SSR context:', e.message);
    }
  }
}

// Early intercept for React DOM imports in SSR
try {
  const Module = require('module');
  const originalLoad = Module._load;
  Module._load = function(request, parent, isMain) {
    if (typeof request === 'string' && request === 'react-dom' || request.startsWith('react-dom/')) {
      return originalLoad.call(this, 'react-dom/server', parent, isMain);
    }
    return originalLoad.call(this, request, parent, isMain);
  };
  console.log('✅ react-dom require-hook applied in polyfill');
} catch (e) {
  console.warn('⚠️ Failed to apply react-dom require-hook:', e.message);
}

module.exports = {};
