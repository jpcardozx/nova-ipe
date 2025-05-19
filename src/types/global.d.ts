// src/types/global.d.ts
export { };

/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

declare global {
    // Window interface extensions
    interface Window {
        dataLayer?: Array<Record<string, unknown>>;
        __imageIssues?: any[];
        __imageCache?: Record<string, string>;
        performance: Performance;
        innerHeight: number;
        innerWidth: number;
        scrollY: number;
        scrollTo(options: ScrollToOptions): void;
        scrollTo(x: number, y: number): void;
        matchMedia(query: string): MediaQueryList;
        getComputedStyle: typeof getComputedStyle;
        requestIdleCallback(callback: IdleRequestCallback, options?: IdleRequestOptions): number;
        cancelIdleCallback(handle: number): void;
        setTimeout(handler: TimerHandler, timeout?: number): number;
        clearTimeout(handle: number): void;
        localStorage: Storage;
        sessionStorage: Storage;
        requestAnimationFrame(callback: FrameRequestCallback): number;
        cancelAnimationFrame(handle: number): void;
        workbox?: any;
        location: Location;
        document: Document;
        navigator: Navigator; addEventListener<K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        gtag?: (...args: any[]) => void;
        open(url?: string, target?: string, features?: string): WindowProxy | null;
    }

    // Storage interface for localStorage and sessionStorage
    interface Storage {
        getItem(key: string): string | null;
        setItem(key: string, value: string): void;
        removeItem(key: string): void;
        clear(): void;
        key(index: number): string | null;
        length: number;
    }

    // FontFace API declarations
    interface FontFaceDescriptors {
        display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
        style?: string;
        weight?: string;
        stretch?: string;
        unicodeRange?: string;
        variant?: string;
        featureSettings?: string;
        variationSettings?: string;
    }

    interface FontFace {
        family: string;
        style: string;
        weight: string;
        stretch: string;
        unicodeRange: string;
        variant: string;
        featureSettings: string;
        variationSettings: string;
        display: string;
        load(): Promise<FontFace>;
    }    // Global variable declarations
    var localStorage: Storage;
    var sessionStorage: Storage;
    var window: Window & typeof globalThis;
    var document: Document;
    var navigator: Navigator;
    var requestIdleCallback: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
    var cancelIdleCallback: (handle: number) => void;
    var getComputedStyle: (elt: Element, pseudoElt?: string | null) => CSSStyleDeclaration;

    var FontFace: {
        prototype: FontFace;
        new(family: string, source: string, descriptors?: FontFaceDescriptors): FontFace;
    }; interface Document extends Node, EventTarget {
        fonts: {
            add(font: FontFace): void;
            clear(): void;
            delete(font: FontFace): boolean;
            forEach(callback: (font: FontFace, fontFace: FontFace, map: Map<FontFace, FontFace>) => void): void;
            ready: Promise<void>;
        };
        documentElement: HTMLElement;
        body: HTMLElement;
        head: HTMLHeadElement;
        createElement<K extends keyof HTMLElementTagNameMap>(tagName: K): HTMLElementTagNameMap[K];
        createElement(tagName: string): HTMLElement;
        querySelector<E extends Element = Element>(selectors: string): E | null;
        querySelectorAll<E extends Element = Element>(selectors: string): NodeListOf<E>;
        getElementById(id: string): HTMLElement | null;
        getElementsByClassName(classNames: string): HTMLCollectionOf<HTMLElement>;
        getElementsByTagName<K extends keyof HTMLElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<HTMLElementTagNameMap[K]>;
        getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element>;
        activeElement: HTMLElement | null;
        readyState: 'loading' | 'interactive' | 'complete';
        title: string;
        referrer: string;
        visibilityState: 'visible' | 'hidden';
        fullscreenElement: Element | null;
        exitFullscreen(): Promise<void>;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
        createTextNode(data: string): Text;
    }    // Element interface
    interface Element extends Node {
        id: string;
        className: string;
        tagName: string;
        innerHTML: string;
        outerHTML: string;
        children: HTMLCollection;
        getAttribute(name: string): string | null;
        setAttribute(name: string, value: string): void;
        hasAttribute(name: string): boolean;
        removeAttribute(name: string): void;
        appendChild<T extends Node>(node: T): T;
        classList: DOMTokenList;
        style?: CSSStyleDeclaration;
    }

    interface HTMLCollection {
        length: number;
        item(index: number): Element | null;
        [index: number]: Element;
    }

    // DOM Event Types
    interface Event {
        readonly target: EventTarget | null;
        readonly currentTarget: EventTarget | null;
        readonly eventPhase: number;
        readonly bubbles: boolean;
        readonly cancelable: boolean;
        stopPropagation(): void;
        preventDefault(): void;
        stopImmediatePropagation(): void;
        readonly defaultPrevented: boolean;
        readonly composed: boolean;
    }

    interface EventTarget {
        addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean): void;
        removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void;
    }

    interface KeyboardEvent extends Event {
        key: string;
        code: string;
        ctrlKey: boolean;
        shiftKey: boolean;
        altKey: boolean;
        metaKey: boolean;
    }

    // Different event types for form elements
    interface ChangeEvent<T = Element> extends Event {
        readonly target: EventTarget & T;
        readonly currentTarget: EventTarget & T;
    }

    interface FormEvent<T = Element> extends Event {
        readonly target: EventTarget & T;
        readonly currentTarget: EventTarget & T;
    }

    interface MouseEvent extends Event {
        readonly clientX: number;
        readonly clientY: number;
        readonly pageX: number;
        readonly pageY: number;
        readonly screenX: number;
        readonly screenY: number;
        readonly movementX: number;
        readonly movementY: number;
        readonly button: number;
        readonly buttons: number;
        readonly ctrlKey: boolean;
        readonly shiftKey: boolean;
        readonly altKey: boolean;
        readonly metaKey: boolean;
    }// Node interface for DOM tree elements
    interface Node {
        nodeName: string;
        nodeType: number;
        nodeValue: string | null;
        parentNode: Node | null;
        parentElement: HTMLElement | null;
        childNodes: NodeListOf<Node>;
        firstChild: Node | null;
        lastChild: Node | null;
        nextSibling: Node | null;
        previousSibling: Node | null;
        contains(other: Node | null): boolean;
        appendChild<T extends Node>(node: T): T;
        removeChild<T extends Node>(node: T): T;
        insertBefore<T extends Node>(node: T, child: Node | null): T;
        replaceChild<T extends Node>(node: T, child: Node): T;
        cloneNode(deep?: boolean): Node;
    }

    interface HTMLElement extends Node {
        style: CSSStyleDeclaration;
        classList: DOMTokenList;
        getBoundingClientRect(): DOMRect;
        textContent: string;
        innerText: string;
        innerHTML: string;
        dataset: DOMStringMap;
        clientWidth: number;
        clientHeight: number;
        offsetHeight: number;
        offsetWidth: number;
        offsetTop: number;
        offsetLeft: number;
        hasAttribute(name: string): boolean;
        removeAttribute(name: string): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
        setAttribute(name: string, value: string): void;
    }

    interface HTMLImageElement extends HTMLElement {
        src: string;
        srcset: string;
        alt: string;
        width: number;
        height: number;
        loading: 'eager' | 'lazy';
        complete: boolean;
        naturalWidth: number;
        naturalHeight: number;
        decoding: 'auto' | 'sync' | 'async';
        crossOrigin: string | null;
        currentSrc: string;
        sizes: string;
        onload: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onerror: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        setAttribute(name: string, value: string): void;
        getAttribute(name: string): string | null;
    }

    interface HTMLCanvasElement extends HTMLElement {
        width: number;
        height: number;
        getContext(contextId: '2d', options?: any): CanvasRenderingContext2D;
        toDataURL(type?: string, quality?: number): string;
    }    interface HTMLDivElement extends HTMLElement {
        offsetTop: number;
        offsetLeft: number;
        requestFullscreen(): Promise<void>;
    }

    interface HTMLButtonElement extends HTMLElement {
        click(): void;
        type: string;
        disabled: boolean;
        value: string;
        form: HTMLFormElement | null;
        name: string;
        getElementsByClassName(classNames: string): HTMLCollectionOf<Element>;
    }

    // Input element types
    interface HTMLInputElement extends HTMLElement {
        value: string;
        type: string;
        checked: boolean;
        placeholder: string;
        disabled: boolean;
        name: string;
        focus(): void;
        blur(): void;
        select(): void;
    }

    interface HTMLTextAreaElement extends HTMLElement {
        value: string;
        placeholder: string;
        disabled: boolean;
        name: string;
        rows: number;
        cols: number;
        focus(): void;
        blur(): void;
        select(): void;
    }

    interface HTMLSelectElement extends HTMLElement {
        value: string;
        selectedIndex: number;
        options: HTMLCollectionOf<HTMLOptionElement>;
        disabled: boolean;
        name: string;
        focus(): void;
        blur(): void;
    }

    interface HTMLLinkElement extends HTMLElement {
        href: string;
        rel: string;
        type: string;
        media: string;
    }

    interface HTMLHeadElement extends HTMLElement {
        querySelector<E extends Element = Element>(selectors: string): E | null;
        querySelectorAll<E extends Element = Element>(selectors: string): NodeListOf<E>;
    }

    interface HTMLFormElement extends HTMLElement {
        submit(): void;
        reset(): void;
        elements: HTMLFormControlsCollection;
    }    // Navigator interface extensions
    interface Navigator {
        sendBeacon(url: string, data?: any): boolean;
        share?(data: ShareData): Promise<void>;
        clipboard: {
            writeText(text: string): Promise<void>;
            readText(): Promise<string>;
        };
        userAgent: string;
        language: string;
        languages: readonly string[];
        onLine: boolean;
        hardwareConcurrency: number;
        serviceWorker?: any;
    }

    // Performance types
    interface Performance {
        timing: PerformanceTiming;
        getEntriesByType<T extends PerformanceEntry>(type: string): T[];
    }

    interface PerformanceNavigationTiming extends PerformanceEntry {
        responseStart: number;
        requestStart: number;
        domContentLoadedEventEnd: number;
        fetchStart: number;
        loadEventEnd: number;
    }

    // IntersectionObserver
    var IntersectionObserver: {
        prototype: IntersectionObserver;
        new(callback: IntersectionObserverCallback, options?: IntersectionObserverInit): IntersectionObserver;
    };

    interface IntersectionObserverCallback {
        (entries: IntersectionObserverEntry[], observer: IntersectionObserver): void;
    }

    // Image constructor
    var Image: {
        new(width?: number, height?: number): HTMLImageElement;
        prototype: HTMLImageElement;
    };

    // Allow using alert
    function alert(message?: any): void;
}

// Service Worker types
interface WorkerGlobalScope extends EventTarget {
    self: WorkerGlobalScope & typeof globalThis;
    location: WorkerLocation;
    navigator: WorkerNavigator;
    skipWaiting(): Promise<void>;
    clients: Clients;
}

interface Clients {
    claim(): Promise<void>;
    get(id: string): Promise<Client | undefined>;
    matchAll(options?: ClientQueryOptions): Promise<Client[]>;
    openWindow(url: string): Promise<WindowClient | null>;
}

interface Client {
    id: string;
    type: ClientType;
    url: string;
}

type ClientType = 'window' | 'worker' | 'sharedworker';

interface ClientQueryOptions {
    includeUncontrolled?: boolean;
    type?: ClientType;
}

interface WindowClient extends Client {
    focused: boolean;
    visibilityState: DocumentVisibilityState;
    focus(): Promise<WindowClient>;
    navigate(url: string): Promise<WindowClient | null>;
}

interface WorkerNavigator {
    readonly userAgent: string;
    readonly appName: string;
    readonly appVersion: string;
    readonly platform: string;
    readonly product: string;
    readonly hardwareConcurrency: number;
    readonly language: string;
    readonly languages: readonly string[];
    readonly onLine: boolean;
    sendBeacon(url: string, data?: any): boolean;
    share?(data: ShareData): Promise<void>;
    clipboard: {
        writeText(text: string): Promise<void>;
        readText(): Promise<string>;
    };
    serviceWorker?: any;
}

interface ShareData {
    title?: string;
    text?: string;
    url?: string;
}
