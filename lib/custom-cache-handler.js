/**
 * Custom Cache Handler for Next.js
 * 
 * Enhanced caching strategy for improved performance in Next.js applications.
 * This handler optimizes caching for static assets and API responses.
 * 
 * @version 1.0.0
 * @date 23/05/2025
 */

module.exports = class CustomCacheHandler {
    constructor(options) {
        this.options = options;
        this.cache = new Map();
        this.hits = 0;
        this.misses = 0;

        // Configure cache TTLs based on content type
        this.ttlConfig = {
            image: 7 * 24 * 60 * 60 * 1000, // 7 days for images
            font: 30 * 24 * 60 * 60 * 1000, // 30 days for fonts
            api: 60 * 60 * 1000,           // 1 hour for API responses
            default: 24 * 60 * 60 * 1000    // 24 hours for everything else
        };

        // Report cache stats periodically in development
        if (process.env.NODE_ENV === 'development') {
            setInterval(() => this.logCacheStats(), 60000);
        }
    }

    /**
     * Get cached value for a key
     */
    async get(key) {
        const cacheItem = this.cache.get(key);

        if (!cacheItem) {
            this.misses++;
            return null;
        }

        // Check if cache item has expired
        if (cacheItem.expiresAt && cacheItem.expiresAt < Date.now()) {
            this.cache.delete(key);
            this.misses++;
            return null;
        }

        this.hits++;
        return cacheItem.value;
    }

    /**
     * Set value in cache with TTL
     */
    async set(key, value, options = {}) {
        const contentType = options.contentType || 'default';
        const ttl = options.ttl || this.ttlConfig[contentType] || this.ttlConfig.default;

        this.cache.set(key, {
            value,
            createdAt: Date.now(),
            expiresAt: ttl > 0 ? Date.now() + ttl : null,
            contentType
        });

        return true;
    }

    /**
     * Log cache statistics
     */
    logCacheStats() {
        const total = this.hits + this.misses;
        const hitRate = total > 0 ? (this.hits / total * 100).toFixed(2) : 0;

        console.log(`[Cache Stats] Size: ${this.cache.size}, Hit rate: ${hitRate}%, Hits: ${this.hits}, Misses: ${this.misses}`);

        // Report content type distribution
        const typeDistribution = {};
        for (const [_, item] of this.cache.entries()) {
            const type = item.contentType || 'default';
            typeDistribution[type] = (typeDistribution[type] || 0) + 1;
        }

        console.log('[Cache Content Types]', typeDistribution);
    }

    /**
     * Explicitly revalidate a cached item
     */
    async revalidateTag(tag) {
        let count = 0;
        for (const [key, item] of this.cache.entries()) {
            if (item.tags && item.tags.includes(tag)) {
                this.cache.delete(key);
                count++;
            }
        }
        return count;
    }
};
