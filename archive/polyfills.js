// Polyfills para resolver problemas de SSR
// Este arquivo deve ser carregado antes de qualquer outro código no servidor

// Verificar se estamos no servidor (Node.js)
const isServer = typeof window === 'undefined';

if (isServer) {
  // Definir self como global no servidor para evitar erros
  if (typeof global !== 'undefined' && typeof global.self === 'undefined') {
    global.self = global;
  }
  
  // Definir outras variáveis do browser como undefined/mock no servidor
  if (typeof global.window === 'undefined') {
    global.window = undefined;
  }
  
  if (typeof global.document === 'undefined') {
    global.document = undefined;
  }
  
  if (typeof global.navigator === 'undefined') {
    global.navigator = undefined;
  }
  
  if (typeof global.location === 'undefined') {
    global.location = undefined;
  }
  
  // Mock para XMLHttpRequest se necessário
  if (typeof global.XMLHttpRequest === 'undefined') {
    global.XMLHttpRequest = class XMLHttpRequest {};
  }
  
  // Mock para fetch se não estiver disponível
  if (typeof global.fetch === 'undefined') {
    global.fetch = async () => {
      throw new Error('fetch is not available in SSR environment');
    };
  }
}

// Polyfill para globalThis
if (typeof globalThis === 'undefined') {
  if (typeof global !== 'undefined') {
    global.globalThis = global;
  } else if (typeof window !== 'undefined') {
    window.globalThis = window;
  } else if (typeof self !== 'undefined') {
    self.globalThis = self;
  } else {
    // Fallback para ambientes muito antigos
    (function() {
      Object.defineProperty(this, 'globalThis', {
        value: this,
        writable: false,
        enumerable: false,
        configurable: false
      });
    })();
  }
}

// Polyfill para window e document (especialmente para styled-jsx)
if (typeof window === 'undefined' && typeof global !== 'undefined') {
  // Mock mais completo do document para styled-jsx
  const mockDocument = {
    createElement: function(tagName) { 
      return {
        tagName: tagName.toUpperCase(),
        setAttribute: function() {},
        getAttribute: function() { return null; },
        style: {},
        appendChild: function() {},
        removeChild: function() {},
        innerHTML: '',
        textContent: ''
      }; 
    },
    createTextNode: function(text) { 
      return { textContent: text }; 
    },
    addEventListener: function() {},
    removeEventListener: function() {},
    querySelector: function() { return null; },
    querySelectorAll: function() { return []; },
    getElementById: function() { return null; },
    getElementsByTagName: function() { return []; },
    getElementsByClassName: function() { return []; },
    body: {
      appendChild: function() {},
      removeChild: function() {},
      querySelector: function() { return null; },
      querySelectorAll: function() { return []; },
      style: {}
    },
    head: {
      appendChild: function() {},
      removeChild: function() {},
      querySelector: function() { return null; },
      querySelectorAll: function() { return []; }
    },
    documentElement: {
      style: {},
      querySelector: function() { return null; },
      querySelectorAll: function() { return []; }
    }
  };

  global.window = {
    addEventListener: function() {},
    removeEventListener: function() {},
    dispatchEvent: function() { return true; },
    location: { 
      href: '', 
      pathname: '/', 
      search: '', 
      hash: '' 
    },
    navigator: { 
      userAgent: 'Node.js' 
    },
    document: mockDocument,
    innerWidth: 1024,
    innerHeight: 768,
    screen: {
      width: 1024,
      height: 768
    }
  };

  // Definir document globalmente também para styled-jsx
  global.document = mockDocument;
}

// Polyfill para requestAnimationFrame e cancelAnimationFrame
if (typeof requestAnimationFrame === 'undefined') {
  global.requestAnimationFrame = function(callback) {
    return setTimeout(callback, 16);
  };
}

if (typeof cancelAnimationFrame === 'undefined') {
  global.cancelAnimationFrame = function(id) {
    clearTimeout(id);
  };
}

// Polyfill para performance.now
if (typeof performance === 'undefined') {
  global.performance = {
    now: function() {
      return Date.now();
    }
  };
}
