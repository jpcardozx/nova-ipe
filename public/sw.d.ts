/// <reference no-default-lib="true"/>
/// <reference lib="es2020" />
/// <reference lib="webworker" />

// Extend the WorkerGlobalScope for service workers
declare interface WorkerGlobalScope {
    skipWaiting(): Promise<void>;
    clients: {
        claim(): Promise<void>;
        get(id: string): Promise<any>;
        matchAll(options?: any): Promise<any[]>;
        openWindow(url: string): Promise<any>;
    };
}

// Make TypeScript recognize 'self' as WorkerGlobalScope in service worker files
declare var self: WorkerGlobalScope;
