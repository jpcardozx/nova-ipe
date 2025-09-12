// Global type declarations for common issues

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

// Performance API
declare global {
  interface Performance {
    now(): number
  }
  
  var performance: Performance
}

// Window extensions
declare global {
  interface Window {
    [key: string]: any
  }
}

export {}