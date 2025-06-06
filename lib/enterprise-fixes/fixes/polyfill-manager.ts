'use client';

/**
 * Polyfill Manager
 * 
 * Centralized management for all polyfills needed in the application.
 * - Browser API polyfills for SSR
 * - Global object initialization
 * - Environment detection
 * 
 * @version 3.0.0
 * @date June 4, 2025
 */

declare global {
  var __POLYFILLS_APPLIED__: boolean;
  namespace NodeJS {
    interface Global {
      window: typeof globalThis;
      self: typeof globalThis;
      __POLYFILLS_APPLIED__: boolean;
    }
  }
}

class PolyfillManager {
  private static instance: PolyfillManager;
  private appliedPolyfills: Set<string> = new Set();

  private constructor() {
    this.initializeEnvironment();
  }

  public static getInstance(): PolyfillManager {
    if (!PolyfillManager.instance) {
      PolyfillManager.instance = new PolyfillManager();
    }
    return PolyfillManager.instance;
  }

  private initializeEnvironment() {
    // Apply environment-specific polyfills
    if (typeof window === 'undefined') {
      this.applyServerPolyfills();
    } else {
      this.applyClientPolyfills();
    }
  }

  private applyServerPolyfills() {
    // Apply polyfills only in SSR context
    if (typeof global !== 'undefined') {
      // Only apply once
      if (global.__POLYFILLS_APPLIED__) return;

      // Polyfill window object for SSR
      if (typeof (global as any).window === 'undefined') {
        (global as any).window = global;
      }

      // Polyfill self
      if (typeof (global as any).self === 'undefined') {
        (global as any).self = global;
      }

      // Mark as applied
      global.__POLYFILLS_APPLIED__ = true;
      this.appliedPolyfills.add('server-polyfills');
    }
  }

  private applyClientPolyfills() {
    // Apply polyfills only in browser context
    if (typeof window !== 'undefined') {
      // Only apply once
      if (window['__POLYFILLS_APPLIED__']) return;

      // Make sure navigator.userAgent exists to prevent dev overlay errors
      if (typeof navigator !== 'undefined') {
        if (!navigator.userAgent) {
          Object.defineProperty(navigator, 'userAgent', {
            value: 'Browser (Client)',
            writable: true,
            configurable: true
          });
          this.appliedPolyfills.add('navigator-polyfill');
        }
      }

      // Next.js specific globals
      window.next = window.next || {};
      window.next.router = window.next.router || {
        events: { on: () => {}, off: () => {}, emit: () => {} }
      };
      
      // Mark as applied
      window['__POLYFILLS_APPLIED__'] = true;
      this.appliedPolyfills.add('client-polyfills');
    }
  }

  /**
   * Get list of applied polyfills
   */
  public getAppliedPolyfills(): string[] {
    return Array.from(this.appliedPolyfills);
  }
}

// Initialize polyfill manager
const polyfillManager = PolyfillManager.getInstance();

// Diagnostic info
if (process.env.NODE_ENV === 'development') {
  const applied = polyfillManager.getAppliedPolyfills();
  if (applied.length > 0) {
    console.debug(`✅ Applied polyfills: ${applied.join(', ')}`);
  }
}

export default polyfillManager;
