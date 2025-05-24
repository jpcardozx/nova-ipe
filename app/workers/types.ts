interface ServiceWorkerConfig {
    name: string;
    maxEntries?: number;
    maxAge?: number;
}

type CacheConfig = ServiceWorkerConfig | null;
