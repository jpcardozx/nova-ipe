// Polyfill SSR para APIs do browser
if (typeof window === 'undefined') {
    const mockFunction = () => {};
    const mockElement = {
      addEventListener: mockFunction,
      removeEventListener: mockFunction,
      dispatchEvent: mockFunction,
      getAttribute: () => null,
      setAttribute: mockFunction,
      style: {},
      classList: { add: mockFunction, remove: mockFunction, contains: () => false },
      getBoundingClientRect: () => ({ top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 }),
    };
  
    global.window = {
      addEventListener: mockFunction,
      removeEventListener: mockFunction,
      dispatchEvent: mockFunction,
      location: { href: 'http://localhost:3000' },
      getComputedStyle: () => ({}),
      matchMedia: () => ({ matches: false, addListener: mockFunction, removeListener: mockFunction }),
      innerWidth: 1024,
      innerHeight: 768,
    };
  
    global.document = {
      addEventListener: mockFunction,
      removeEventListener: mockFunction,
      createElement: () => mockElement,
      getElementById: () => mockElement,
      querySelector: () => mockElement,
      body: mockElement,
      documentElement: mockElement,
    };
  
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  
    global.HTMLElement = class {
      constructor() {
        Object.assign(this, mockElement);
      }
    };
  }