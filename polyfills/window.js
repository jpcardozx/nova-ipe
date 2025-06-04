// Polyfill for window object on server side
if (typeof window === 'undefined') {
  global.window = {
    location: {
      protocol: 'http:',
      hostname: 'localhost',
      port: '3001',
      pathname: '/',
      search: '',
      hash: '',
      origin: 'http://localhost:3001',
      href: 'http://localhost:3001/'
    },
    navigator: {
      userAgent: 'Node.js'
    },
    document: {
      createElement: () => ({}),
      addEventListener: () => {},
      removeEventListener: () => {},
      body: {},
      head: {}
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    getComputedStyle: () => ({}),
    matchMedia: () => ({
      matches: false,
      addListener: () => {},
      removeListener: () => {}
    })
  };
}
