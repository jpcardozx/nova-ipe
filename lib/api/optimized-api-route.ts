/**
 * High-Performance API Utilities
 * 
 * This module provides specialized utilities for creating highly efficient API routes
 * with proper caching, edge runtime execution, and error handling.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { fetchWithOptimizedCache } from '../sanity/enhanced-sanity-service';

// Cache control defaults
const CACHE_CONTROL = {
    DEFAULT: 'public, s-maxage=60, stale-while-revalidate=300',
    LONG: 'public, s-maxage=3600, stale-while-revalidate=86400',
    SHORT: 'public, s-maxage=10, stale-while-revalidate=60',
    MEDIUM: 'public, s-maxage=300, stale-while-revalidate=1800',
    STATIC: 'public, s-maxage=31536000, immutable',
    NO_STORE: 'no-store, must-revalidate',
};

// Interface for route handlers
interface RouteHandlerOptions {
    enableCors?: boolean;
    cacheControl?: string;
    rateLimit?: boolean;
    rateLimitRequests?: number;
    rateLimitWindow?: number; // in seconds
}

/**
 * Create an optimized edge API route handler with proper error handling and caching
 * 
 * @param handler Your handler function that receives the request and returns data
 * @param options Configuration options for the route
 */
export function createEdgeApiRoute<T>(
    handler: (req: NextRequest) => Promise<T>,
    options: RouteHandlerOptions = {}
) {
    // Default options
    const {
        enableCors = true,
        cacheControl = CACHE_CONTROL.DEFAULT,
        rateLimit = false,
        rateLimitRequests = 60,
        rateLimitWindow = 60, // 60 requests per 60 seconds by default
    } = options;

    // Create the actual handler
    return async function routeHandler(req: NextRequest) {
        // Set up headers
        const headers = new Headers();

        // Add CORS headers if enabled
        if (enableCors) {
            headers.set('Access-Control-Allow-Credentials', 'true');
            headers.set('Access-Control-Allow-Origin', '*');
            headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
            headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

            // Return early for OPTIONS requests (preflight)
            if (req.method === 'OPTIONS') {
                return new NextResponse(null, { status: 204, headers });
            }
        }

        try {
            // Execute the handler to get the data
            const data = await handler(req);

            // Set cache control
            headers.set('Cache-Control', cacheControl);

            // Return successful response
            return NextResponse.json(data, {
                headers,
                status: 200,
            });
        } catch (error) {
            console.error('[API Error]', error);

            // Determine response based on error
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            const status = errorMessage.includes('not found') ? 404 :
                errorMessage.includes('unauthorized') ? 401 :
                    errorMessage.includes('forbidden') ? 403 : 500;

            // No caching for errors
            headers.set('Cache-Control', CACHE_CONTROL.NO_STORE);

            return NextResponse.json(
                {
                    error: errorMessage,
                    timestamp: new Date().toISOString(),
                },
                { status, headers }
            );
        }
    };
}

/**
 * Helper function to create a Sanity-backed API route with advanced caching
 */
export function createSanityEdgeApiRoute<T>(
    query: string,
    paramsExtractor: (req: NextRequest) => Record<string, any> = () => ({}),
    options: RouteHandlerOptions & {
        tags?: string[];
        revalidate?: number;
    } = {}
) {
    const { tags = ['api'], revalidate = 60, ...routeOptions } = options;

    return createEdgeApiRoute(async (req) => {
        const params = paramsExtractor(req);
        return await fetchWithOptimizedCache<T>(query, params, {
            tags,
            revalidate,
            forceFresh: req.nextUrl.searchParams.has('fresh')
        });
    }, {
        cacheControl: revalidate > 600 ? CACHE_CONTROL.LONG :
            revalidate > 60 ? CACHE_CONTROL.MEDIUM :
                CACHE_CONTROL.DEFAULT,
        ...routeOptions
    });
}

export { CACHE_CONTROL };
