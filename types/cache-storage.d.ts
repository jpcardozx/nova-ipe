// cache-storage.d.ts
interface CacheStorage {
    open(cacheName: string): Promise<Cache>;
    has(cacheName: string): Promise<boolean>;
    delete(cacheName: string): Promise<boolean>;
    keys(): Promise<string[]>;
    match(request: Request, options?: CacheQueryOptions): Promise<Response | undefined>;
}

interface Cache {
    add(request: RequestInfo): Promise<void>;
    addAll(requests: RequestInfo[]): Promise<void>;
    delete(request: RequestInfo, options?: CacheQueryOptions): Promise<boolean>;
    keys(request?: RequestInfo, options?: CacheQueryOptions): Promise<ReadonlyArray<Request>>;
    match(request: RequestInfo, options?: CacheQueryOptions): Promise<Response | undefined>;
    matchAll(request?: RequestInfo, options?: CacheQueryOptions): Promise<ReadonlyArray<Response>>;
    put(request: RequestInfo, response: Response): Promise<void>;
}

interface CacheQueryOptions {
    ignoreSearch?: boolean;
    ignoreMethod?: boolean;
    ignoreVary?: boolean;
}

declare var caches: CacheStorage;
