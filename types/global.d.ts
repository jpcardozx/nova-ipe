// Global type definitions for the project

// Web API extensions for Navigator interface
interface Navigator {
    // Web Share API
    share?: (data: { title?: string; text?: string; url?: string }) => Promise<void>;
    // Beacon API
    sendBeacon(url: string, data?: string | Blob | ArrayBufferView | ArrayBuffer | FormData | URLSearchParams): boolean;
}

// Add sendBeacon to WorkerNavigator
interface WorkerNavigator {
    sendBeacon(url: string, data?: string | Blob | ArrayBufferView | ArrayBuffer | FormData | URLSearchParams): boolean;
}

// Ensure IntersectionObserver types are available
interface IntersectionObserverEntry {
    boundingClientRect: DOMRectReadOnly;
    intersectionRatio: number;
    intersectionRect: DOMRectReadOnly;
    isIntersecting: boolean;
    rootBounds: DOMRectReadOnly | null;
    target: Element;
    time: number;
}

interface IntersectionObserverInit {
    root?: Element | null;
    rootMargin?: string;
    threshold?: number | number[];
}

interface IntersectionObserver {
    new(callback: IntersectionObserverCallback, options?: IntersectionObserverInit): IntersectionObserver;
    disconnect(): void;
    observe(target: Element): void;
    takeRecords(): IntersectionObserverEntry[];
    unobserve(target: Element): void;
    root: Element | null;
    rootMargin: string;
    thresholds: ReadonlyArray<number>;
}

type IntersectionObserverCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void;

// styled-jsx declarations
declare namespace JSX {
    interface IntrinsicElements {
        'style': React.DetailedHTMLProps<React.StyleHTMLAttributes<HTMLStyleElement> & {
            jsx?: boolean;
            global?: boolean;
        }, HTMLStyleElement>;
    }
}
