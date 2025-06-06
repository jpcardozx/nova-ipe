/**
 * Enhanced Sanity Development Utilities
 * Provides comprehensive CORS handling and fallback mechanisms
 */

import { NextRequest, NextResponse } from 'next/server';
import { serverClient } from '@/lib/sanity/sanity.server';

// Enhanced CORS headers with more permissive configuration for development
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-File-Name',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
};

// Test queries for validating Sanity connection
const TEST_QUERIES = {
    basic: '*[_type == "imovel"][0...1]{ _id, _type }',
    featured: '*[_type == "imovel" && destaque == true][0...3]{ _id, titulo, preco, destaque }',
    rental: '*[_type == "imovel" && finalidade == "Aluguel"][0...3]{ _id, titulo, preco, finalidade }',
    count: 'count(*[_type == "imovel"])'
};

export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: corsHeaders,
    });
}

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const test = url.searchParams.get('test');
    const query = url.searchParams.get('query');

    try {
        let result;

        if (test === 'connection') {
            // Test basic connection
            result = await serverClient.fetch(TEST_QUERIES.basic);
            return NextResponse.json({
                success: true,
                test: 'connection',
                data: result,
                message: 'Sanity connection successful'
            }, { headers: corsHeaders });
        }        if (test === 'all') {
            // Test all common queries
            const results: Record<string, any> = {};
            for (const [key, testQuery] of Object.entries(TEST_QUERIES)) {
                try {
                    results[key] = await serverClient.fetch(testQuery);
                } catch (error) {
                    results[key] = { error: error instanceof Error ? error.message : 'Unknown error' };
                }
            }
            return NextResponse.json({
                success: true,
                test: 'all',
                results,
                message: 'All tests completed'
            }, { headers: corsHeaders });
        }

        if (query) {
            // Test custom query
            result = await serverClient.fetch(query);
            return NextResponse.json({
                success: true,
                query,
                data: result
            }, { headers: corsHeaders });
        }

        // Default response with available tests
        return NextResponse.json({
            success: true,
            message: 'Enhanced Sanity Proxy API',
            availableTests: [
                'GET /api/sanity-enhanced?test=connection',
                'GET /api/sanity-enhanced?test=all',
                'GET /api/sanity-enhanced?query=*[_type == "imovel"][0]',
                'POST /api/sanity-enhanced (with JSON body)'
            ],
            projectInfo: {
                projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
                dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
                apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION
            }
        }, { headers: corsHeaders });

    } catch (error) {
        console.error('Enhanced Sanity proxy error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : null) : null
        }, {
            status: 500,
            headers: corsHeaders
        });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => ({}));
        const { query, params = {}, options = {} } = body;

        if (!query) {
            return NextResponse.json({
                success: false,
                error: 'No query provided',
                example: {
                    query: '*[_type == "imovel"][0...10]',
                    params: {},
                    options: { timeout: 10000 }
                }
            }, {
                status: 400,
                headers: corsHeaders
            });
        }

        // Add timeout handling
        const timeout = options.timeout || 15000;
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error(`Query timeout after ${timeout}ms`)), timeout);
        });

        // Execute query with timeout
        const data = await Promise.race([
            serverClient.fetch(query, params),
            timeoutPromise
        ]);

        return NextResponse.json({
            success: true,
            data,
            meta: {
                query,
                params,
                timestamp: new Date().toISOString(),
                executionTime: Date.now() // Simplified timing
            }
        }, { headers: corsHeaders });

    } catch (error) {
        console.error('Enhanced Sanity proxy POST error:', error);

        // Detailed error reporting for development
        const errorResponse: Record<string, any> = {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            type: error instanceof Error ? error.constructor.name : 'UnknownError',
            timestamp: new Date().toISOString()
        };

        if (process.env.NODE_ENV === 'development') {
            errorResponse.stack = error instanceof Error ? error.stack : null;
            errorResponse.details = error;
        }

        return NextResponse.json(errorResponse, {
            status: 500,
            headers: corsHeaders
        });
    }
}
