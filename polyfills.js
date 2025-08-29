// Global polyfills for server-side rendering compatibility

// Fix for 'self is not defined' error in server-side code
if (typeof global !== 'undefined' && typeof global.self === 'undefined') {
  global.self = global;
}

// Additional polyfills for common browser APIs that might be used by libraries
if (typeof global !== 'undefined') {
  // Window object polyfill
  if (typeof global.window === 'undefined') {
    global.window = global;
  }
  
  // Document polyfill (basic)
  if (typeof global.document === 'undefined') {
    global.document = {
      createElement: () => ({}),
      createElementNS: () => ({}),
      addEventListener: () => {},
      removeEventListener: () => {},
    };
  }
  
  // Navigator polyfill
  if (typeof global.navigator === 'undefined') {
    global.navigator = {
      userAgent: 'node.js',
    };
  }
  
  // Location polyfill
  if (typeof global.location === 'undefined') {
    global.location = {
      href: '',
      origin: '',
      pathname: '',
      search: '',
      hash: '',
    };
  }
}

module.exports = {};