// Disable automatic inclusion of lib.dom.d.ts
/// <reference no-default-lib="true"/>
/// <reference lib="ES2020"/>
/// <reference lib="WebWorker"/>

// Service Worker specific Event interfaces
interface ExtendableEvent extends Event {
    waitUntil(f: Promise<any>): void;
}

interface FetchEvent extends Event {
    readonly clientId: string;
    readonly request: Request;
    readonly resultingClientId: string;
    respondWith(r: Promise<Response>): void;
}

interface Clients {
    claim(): Promise<void>;
    get(id: string): Promise<any>;
    matchAll(options?: { includeUncontrolled?: boolean; type?: string }): Promise<any>;
}

interface ServiceWorkerRegistration {
    readonly active: ServiceWorker | null;
    readonly installing: ServiceWorker | null;
    readonly waiting: ServiceWorker | null;
}

interface ServiceWorkerGlobalScope extends WorkerGlobalScope {
    readonly clients: Clients;
    readonly registration: ServiceWorkerRegistration;
    skipWaiting(): Promise<void>;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
}

declare var clients: Clients;
declare var caches: CacheStorage;
declare var registration: ServiceWorkerRegistration;
declare var self: ServiceWorkerGlobalScope;

interface CacheConfig {
    name: string;
    maxAge: number;
    maxEntries: number;
    priority?: 'high' | 'low';
}

interface CacheConfigs {
    chunks: CacheConfig;
    image: CacheConfig;
    static: CacheConfig;
    api: CacheConfig;
}

interface ServiceWorkerPatterns {
    chunks: RegExp;
    static: RegExp;
    image: RegExp;
    api: RegExp;
    sanity: RegExp;
    fonts: RegExp;
}
