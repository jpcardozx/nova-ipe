// Media query type definitions
/// <reference lib="dom" />

declare global {
  interface MediaQueryListEvent extends Event {
    matches: boolean;
    media: string;
  }

  interface MediaQueryList extends EventTarget {
    readonly matches: boolean;
    readonly media: string;
    onchange: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null;
    /** @deprecated */
    addListener(listener: ((this: MediaQueryList, ev: MediaQueryListEvent) => any)): void;
    /** @deprecated */
    removeListener(listener: ((this: MediaQueryList, ev: MediaQueryListEvent) => any)): void;
    addEventListener(type: 'change', listener: (this: MediaQueryList, ev: MediaQueryListEvent) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener(type: 'change', listener: (this: MediaQueryList, ev: MediaQueryListEvent) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
  }
}
