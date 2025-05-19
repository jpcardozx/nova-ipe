'use client';

/**
 * Web Worker manager for property data processing
 * This utility helps offload heavy data processing tasks to a worker thread,
 * preventing main thread blocking which was causing significant performance issues
 */

let workerInstance: Worker | null = null;

// Store pending promises for resolution when worker responds
const pendingPromises: Map<string, {
    resolve: (value: any) => void;
    reject: (reason?: any) => void
}> = new Map();

// Generate unique task IDs
let taskIdCounter = 0;

// Initialize worker on demand
function getWorker() {
    if (typeof window === 'undefined') return null;

    if (!workerInstance) {
        try {
            workerInstance = new Worker(new URL('../workers/property-data-worker.ts', import.meta.url));

            // Set up message handler
            workerInstance.onmessage = (event) => {
                const { type, taskId, result, features, filtered, error } = event.data;

                const pendingPromise = pendingPromises.get(taskId);
                if (!pendingPromise) return;

                switch (type) {
                    case 'processed-properties':
                        pendingPromise.resolve(result);
                        break;
                    case 'extracted-features':
                        pendingPromise.resolve(features);
                        break;
                    case 'filtered-properties':
                        pendingPromise.resolve(filtered);
                        break;
                    case 'error':
                        pendingPromise.reject(new Error(error));
                        break;
                    default:
                        pendingPromise.reject(new Error('Unknown response type from worker'));
                }

                // Clean up
                pendingPromises.delete(taskId);
            };

            workerInstance.onerror = (error) => {
                console.error('Worker error:', error);
                // Reject all pending promises on catastrophic error
                pendingPromises.forEach(promise => {
                    promise.reject(error);
                });
                pendingPromises.clear();
                workerInstance = null;
            };
        } catch (err) {
            console.error('Failed to initialize property data worker:', err);
            return null;
        }
    }

    return workerInstance;
}

// Process properties in worker thread
export async function processPropertiesInWorker(properties: any[], options: any) {
    const worker = getWorker();

    if (!worker) {
        // Fallback to main thread processing if worker isn't available
        console.warn('Worker not available, processing on main thread');
        return processOnMainThread(properties, options);
    }

    const taskId = `process-${++taskIdCounter}`;

    return new Promise((resolve, reject) => {
        pendingPromises.set(taskId, { resolve, reject });

        worker.postMessage({
            taskId,
            task: 'process-properties',
            data: properties,
            options
        });

        // Set timeout to avoid hanging promises
        setTimeout(() => {
            if (pendingPromises.has(taskId)) {
                pendingPromises.delete(taskId);
                reject(new Error('Worker processing timeout'));
            }
        }, 5000);
    });
}

// Extract features in worker thread
export async function extractFeaturesInWorker(properties: any[]) {
    const worker = getWorker();

    if (!worker) {
        // Fallback to main thread
        console.warn('Worker not available, extracting features on main thread');
        return extractFeaturesOnMainThread(properties);
    }

    const taskId = `extract-${++taskIdCounter}`;

    return new Promise((resolve, reject) => {
        pendingPromises.set(taskId, { resolve, reject });

        worker.postMessage({
            taskId,
            task: 'extract-features',
            data: properties
        });

        // Set timeout to avoid hanging promises
        setTimeout(() => {
            if (pendingPromises.has(taskId)) {
                pendingPromises.delete(taskId);
                reject(new Error('Worker processing timeout'));
            }
        }, 5000);
    });
}

// Fallback function for main thread processing
function processOnMainThread(properties: any[], options: any) {
    // This should match the worker implementation
    let filtered = [...properties];

    if (options.filterByType) {
        filtered = filtered.filter(p => p.finalidade === options.filterByType);
    }

    // Simplified version for fallback
    const sorted = [...filtered].sort((a, b) => {
        if (options.sortBy === 'price') {
            return options.sortDirection === 'asc'
                ? (a.preco || 0) - (b.preco || 0)
                : (b.preco || 0) - (a.preco || 0);
        }
        return 0;
    });

    const result = options.limit ? sorted.slice(0, options.limit) : sorted;

    return {
        properties: result,
        meta: {
            totalCount: properties.length,
            filteredCount: filtered.length,
            returnedCount: result.length
        }
    };
}

// Fallback function for feature extraction on main thread
function extractFeaturesOnMainThread(properties: any[]) {
    if (!properties || properties.length === 0) {
        return {
            minPrice: 0,
            maxPrice: 0,
            minArea: 0,
            maxArea: 0,
            bedroomCounts: [],
            bathroomCounts: [],
            cities: [],
            neighborhoods: []
        };
    }

    // Simplified version
    const prices = properties.map(p => p.preco || 0).filter(p => p > 0);

    return {
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices),
        minArea: 0,
        maxArea: 0,
        bedroomCounts: [],
        bathroomCounts: [],
        cities: [],
        neighborhoods: []
    };
}

// Clean up worker on page navigation
export function terminateWorker() {
    if (workerInstance) {
        workerInstance.terminate();
        workerInstance = null;
    }
}
