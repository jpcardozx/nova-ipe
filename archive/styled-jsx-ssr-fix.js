// Fix específico para styled-jsx SSR
// Este arquivo resolve o erro "Cannot read properties of undefined (reading 'querySelector')"

if (typeof window === 'undefined') {
  // Mock completo do DOM para styled-jsx no servidor
  const createMockElement = (tagName = 'div') => ({
    tagName: tagName.toUpperCase(),
    style: {},
    innerHTML: '',
    textContent: '',
    className: '',
    id: '',
    attributes: new Map(),
    children: [],
    parentNode: null,
    
    setAttribute(name, value) {
      this.attributes.set(name, value);
    },
    
    getAttribute(name) {
      return this.attributes.get(name) || null;
    },
    
    appendChild(child) {
      this.children.push(child);
      child.parentNode = this;
      return child;
    },
    
    removeChild(child) {
      const index = this.children.indexOf(child);
      if (index > -1) {
        this.children.splice(index, 1);
        child.parentNode = null;
      }
      return child;
    },
    
    querySelector() { return null; },
    querySelectorAll() { return []; },
    getElementsByTagName() { return []; },
    getElementsByClassName() { return []; },
    addEventListener() {},
    removeEventListener() {},
    
    get firstChild() { return this.children[0] || null; },
    get lastChild() { return this.children[this.children.length - 1] || null; }
  });

  const mockDocument = {
    createElement(tagName) {
      return createMockElement(tagName);
    },
    
    createTextNode(text) {
      return {
        nodeType: 3,
        textContent: text,
        parentNode: null
      };
    },
    
    querySelector() { return null; },
    querySelectorAll() { return []; },
    getElementById() { return null; },
    getElementsByTagName() { return []; },
    getElementsByClassName() { return []; },
    
    addEventListener() {},
    removeEventListener() {},
    
    body: createMockElement('body'),
    head: createMockElement('head'),
    documentElement: createMockElement('html')
  };

  // Definir globalmente
  if (typeof global !== 'undefined') {
    global.document = mockDocument;
    
    if (!global.window) {
      global.window = {
        document: mockDocument,
        addEventListener() {},
        removeEventListener() {},
        location: { href: '' },
        navigator: { userAgent: 'Node.js' }
      };
    } else {
      global.window.document = mockDocument;
    }
  }
}
