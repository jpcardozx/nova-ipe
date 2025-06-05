// Server-side polyfills for Next.js SSR
if (typeof global !== 'undefined' && typeof window === 'undefined') {
  // Mock window object
  global.window = {
    location: {
      protocol: 'http:',
      hostname: 'localhost',
      port: '3001',
      pathname: '/',
      search: '',
      hash: '',
      origin: 'http://localhost:3001',
      href: 'http://localhost:3001/',
      host: 'localhost:3001',
      assign: () => {},
      replace: () => {},
      reload: () => {}
    },
    navigator: {
      userAgent: 'Node.js Server',
      platform: 'node',
      language: 'en-US',
      languages: ['en-US'],
      cookieEnabled: true
    },
    document: {
      createElement: () => ({}),
      createElementNS: () => ({}),
      addEventListener: () => {},
      removeEventListener: () => {},
      body: { style: {}, addEventListener: () => {}, removeEventListener: () => {} },
      head: { style: {}, appendChild: () => {}, removeChild: () => {} },
      documentElement: { style: {}, className: '' },
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => [],
      cookie: ''
    },
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      length: 0,
      key: () => null
    },
    sessionStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      length: 0,
      key: () => null
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    getComputedStyle: () => ({}),
    matchMedia: () => ({
      matches: false,
      media: '',
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {}
    }),
    requestAnimationFrame: (cb) => setTimeout(cb, 16),
    cancelAnimationFrame: (id) => clearTimeout(id),
    innerWidth: 1024,
    innerHeight: 768,
    outerWidth: 1024,
    outerHeight: 768,
    screen: {
      width: 1024,
      height: 768,
      availWidth: 1024,
      availHeight: 768
    },
    history: {
      pushState: () => {},
      replaceState: () => {},
      back: () => {},
      forward: () => {},
      go: () => {},
      length: 1,
      state: null
    },
    console: global.console
  };

  // Mock document
  if (!global.document) {
    global.document = global.window.document;
  }
  // Mock navigator - Safe assignment
  if (!global.navigator) {
    try {
      Object.defineProperty(global, 'navigator', {
        value: global.window.navigator,
        writable: false,
        configurable: true
      });
    } catch (e) {
      // Fallback if defineProperty fails - don't set navigator at all
      console.warn('Could not define navigator from window in SSR context:', e.message);
    }
  }

  // Mock localStorage
  if (!global.localStorage) {
    global.localStorage = global.window.localStorage;
  }

  // Mock sessionStorage
  if (!global.sessionStorage) {
    global.sessionStorage = global.window.sessionStorage;
  }

  // Mock self
  global.self = global.window;
}

module.exports = {};
