/// <reference lib="WebWorker" />
/// <reference lib="ES2015" />

declare module 'service-worker' {
    interface CustomServiceWorkerGlobalScope extends ServiceWorkerGlobalScope {
        __WB_MANIFEST: any;
    }
}

export { };
