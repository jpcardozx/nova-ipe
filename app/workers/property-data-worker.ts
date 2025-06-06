// Web Worker to handle heavy data processing without blocking the main thread
// This helps reduce the 57778ms main thread blocking issue

/**
 * Data processing web worker for property processing and filtering
 * Handles heavy operations off the main thread:
 * - Property sorting
 * - Filtering
 * - Feature extraction
 */

// Message event listener
self.addEventListener('message', async (event: MessageEvent) => {
    const { task, data, options } = event.data;

    switch (task) {
        case 'process-properties':
            // Process properties off the main thread
            const result = processProperties(data, options);
            self.postMessage({ type: 'processed-properties', result });
            break;

        case 'extract-features':
            // Extract features from properties
            const features = extractFeatures(data);
            self.postMessage({ type: 'extracted-features', features });
            break;

        case 'filter-properties':
            // Filter properties based on criteria
            const filtered = filterProperties(data, options);
            self.postMessage({ type: 'filtered-properties', filtered });
            break;

        default:
            console.error('Unknown task type:', task);
    }
});

/**
 * Process properties based on options
 */
function processProperties(properties: any[], options: any) {
    // Track processing start time
    const startTime = performance.now();

    // Filter properties if needed
    let filtered = [...properties];

    if (options.filterByType) {
        filtered = filtered.filter(p => p.finalidade === options.filterByType);
    }

    if (options.filterByFeature && options.filterByFeature.length > 0) {
        filtered = filtered.filter(p => {
            return options.filterByFeature?.some((feature: string) =>
                p.features?.includes(feature) ||
                (feature === 'garden' && p.possuiJardim) ||
                (feature === 'pool' && p.possuiPiscina) ||
                (feature === 'garage' && p.vagas && p.vagas > 0)
            );
        });
    }

    // Sort properties
    const sorted = [...filtered].sort((a, b) => {
        if (options.sortBy === 'price') {
            return options.sortDirection === 'asc'
                ? (a.preco || 0) - (b.preco || 0)
                : (b.preco || 0) - (a.preco || 0);
        }

        if (options.sortBy === 'date') {
            const dateA = a.dataPublicacao ? new Date(a.dataPublicacao).getTime() : 0;
            const dateB = b.dataPublicacao ? new Date(b.dataPublicacao).getTime() : 0;
            return options.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        }

        // Default sort by relevance (featured/highlight items first)
        return a.destaque && !b.destaque ? -1 : b.destaque && !a.destaque ? 1 : 0;
    });

    // Apply limit
    const result = options.limit ? sorted.slice(0, options.limit) : sorted;

    // Track processing time
    const processingTime = performance.now() - startTime;

    return {
        properties: result,
        meta: {
            totalCount: properties.length,
            filteredCount: filtered.length,
            returnedCount: result.length,
            processingTime
        }
    };
}

/**
 * Extract features from properties
 */
function extractFeatures(properties: any[]) {
    // Skip if no properties
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
    const areas = properties.map(p => p.areaUtil || 0).filter(a => a > 0);    // Get unique bedroom and bathroom counts
    const bedrooms = Array.from(new Set(properties
        .map(p => p.dormitorios)
        .filter(Boolean)))
        .sort((a, b) => a - b);

    const bathrooms = Array.from(new Set(properties
        .map(p => p.banheiros)
        .filter(Boolean)))
        .sort((a, b) => a - b);

    // Get unique cities and neighborhoods
    const cities = Array.from(new Set(properties
        .map(p => p.cidade)
        .filter(Boolean)));

    const neighborhoods = Array.from(new Set(properties
        .map(p => p.bairro)
        .filter(Boolean)));

    return {
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices),
        minArea: Math.min(...areas),
        maxArea: Math.max(...areas),
        bedroomCounts: bedrooms,
        bathroomCounts: bathrooms,
        cities,
        neighborhoods
    };
}

/**
 * Filter properties based on criteria
 */
function filterProperties(properties: any[], filters: any) {
    return properties.filter(property => {
        // Apply price filter
        if (filters.minPrice && property.preco < filters.minPrice) return false;
        if (filters.maxPrice && property.preco > filters.maxPrice) return false;

        // Apply area filter
        if (filters.minArea && property.areaUtil < filters.minArea) return false;
        if (filters.maxArea && property.areaUtil > filters.maxArea) return false;

        // Apply bedroom filter
        if (filters.bedrooms && property.dormitorios !== filters.bedrooms) return false;

        // Apply bathroom filter
        if (filters.bathrooms && property.banheiros !== filters.bathrooms) return false;

        // Apply city filter
        if (filters.city && property.cidade !== filters.city) return false;

        // Apply neighborhood filter
        if (filters.neighborhood && property.bairro !== filters.neighborhood) return false;

        return true;
    });
}
