'use client';

import type { Property, PropertyFeatures, PropertyProcessingOptions, ProcessingResult, WorkerMessageType, WorkerResponseType } from '../../types/property-worker';

/**
 * Web Worker manager for property data processing
 * This utility helps offload heavy data processing tasks to a worker thread,
 * preventing main thread blocking which was causing significant performance issues
 */

let workerInstance: Worker | null = null;

// Store separate maps for different promise types
const processingPromises = new Map<string, {
    resolve: (value: ProcessingResult | PromiseLike<ProcessingResult>) => void;
    reject: (error?: any) => void;
}>();

const featurePromises = new Map<string, {
    resolve: (value: PropertyFeatures | PromiseLike<PropertyFeatures>) => void;
    reject: (error?: any) => void;
}>();

// Generate unique task IDs
let taskIdCounter = 0;

// Initialize worker on demand
function getWorker(): Worker | null {
    if (typeof window === 'undefined') return null;

    if (!workerInstance) {
        try {
            workerInstance = new Worker(new URL('../workers/property-data-worker.ts', import.meta.url));

            // Set up message handler
            workerInstance.onmessage = (event: MessageEvent<WorkerResponseType>) => {
                const { taskId } = event.data;
                const processingPromise = processingPromises.get(taskId);
                const featurePromise = featurePromises.get(taskId);

                switch (event.data.type) {
                    case 'processed-properties':
                        if (processingPromise) {
                            processingPromise.resolve(event.data.result);
                            processingPromises.delete(taskId);
                        }
                        break;
                    case 'extracted-features':
                        if (featurePromise) {
                            featurePromise.resolve(event.data.features);
                            featurePromises.delete(taskId);
                        }
                        break;
                    case 'error':
                        const promise = processingPromise || featurePromise;
                        if (promise) {
                            promise.reject(new Error(event.data.error));
                            processingPromises.delete(taskId);
                            featurePromises.delete(taskId);
                        }
                        break;
                }
            };

            workerInstance.onerror = (error) => {
                console.error('Worker error:', error);
                // Reject all pending promises on catastrophic error
                processingPromises.forEach(promise => promise.reject(error));
                featurePromises.forEach(promise => promise.reject(error));
                processingPromises.clear();
                featurePromises.clear();
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
export async function processPropertiesInWorker(
    properties: Property[],
    options: PropertyProcessingOptions
): Promise<ProcessingResult> {
    const worker = getWorker();

    if (!worker) {
        // Fallback to main thread processing
        console.warn('Worker not available, processing on main thread');
        return processOnMainThread(properties, options);
    }

    const taskId = `process-${++taskIdCounter}`;

    return new Promise<ProcessingResult>((resolve, reject) => {
        processingPromises.set(taskId, { resolve, reject });

        const message: WorkerMessageType = {
            taskId,
            task: 'process-properties',
            data: properties,
            options
        };

        worker.postMessage(message);

        // Set timeout to avoid hanging promises
        setTimeout(() => {
            if (processingPromises.has(taskId)) {
                processingPromises.delete(taskId);
                reject(new Error('Worker processing timeout'));
            }
        }, 5000);
    });
}

// Extract features in worker thread
export async function extractFeaturesInWorker(
    properties: Property[]
): Promise<PropertyFeatures> {
    const worker = getWorker();

    if (!worker) {
        console.warn('Worker not available, extracting features on main thread');
        return extractFeaturesOnMainThread(properties);
    }

    const taskId = `extract-${++taskIdCounter}`;

    return new Promise<PropertyFeatures>((resolve, reject) => {
        featurePromises.set(taskId, { resolve, reject });

        const message: WorkerMessageType = {
            taskId,
            task: 'extract-features',
            data: properties
        };

        worker.postMessage(message);

        setTimeout(() => {
            if (featurePromises.has(taskId)) {
                featurePromises.delete(taskId);
                reject(new Error('Worker processing timeout'));
            }
        }, 5000);
    });
}

// Fallback function for main thread processing
function processOnMainThread(
    properties: Property[],
    options: PropertyProcessingOptions
): ProcessingResult {
    let filtered = [...properties];

    if (options.filterByType) {
        filtered = filtered.filter(p => p.finalidade === options.filterByType);
    }

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
function extractFeaturesOnMainThread(properties: Property[]): PropertyFeatures {
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

    const prices = properties.map(p => p.preco || 0).filter(p => p > 0);
    const areas = properties.map(p => p.areaUtil || 0).filter(p => p > 0);
    const bedrooms = [...new Set(properties.map(p => p.dormitorios || 0).filter(p => p > 0))];
    const bathrooms = [...new Set(properties.map(p => p.banheiros || 0).filter(p => p > 0))];
    const cities = [...new Set(properties.map(p => p.cidade || '').filter(Boolean))];
    const neighborhoods = [...new Set(properties.map(p => p.bairro || '').filter(Boolean))];

    return {
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices),
        minArea: Math.min(...areas),
        maxArea: Math.max(...areas),
        bedroomCounts: bedrooms.sort((a, b) => a - b),
        bathroomCounts: bathrooms.sort((a, b) => a - b),
        cities: cities.sort(),
        neighborhoods: neighborhoods.sort()
    };
}

// Clean up worker on page navigation
export function terminateWorker(): void {
    if (workerInstance) {
        workerInstance.terminate();
        workerInstance = null;
    }
}
