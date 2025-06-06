// app/api/sanity-proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { serverClient } from '@/lib/sanity/sanity.server';

/**
 * This API route acts as a proxy for Sanity queries
 * to avoid CORS errors during local development
 */

// Add CORS headers for all requests
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
};

export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: corsHeaders,
    });
}

export async function POST(request: NextRequest) {
    try {
        // Parse the request body containing the query and params
        const body = await request.json().catch(() => ({}));
        const { query, params = {} } = body;

        if (!query) {
            return NextResponse.json(
                { error: 'No query provided' }, 
                { 
                    status: 400,
                    headers: corsHeaders 
                }
            );
        }

        // Execute the Sanity query server-side
        const data = await serverClient.fetch(query, params);

        return NextResponse.json({
            success: true,
            data
        }, {
            headers: corsHeaders
        });
    } catch (error) {
        console.error('Error in Sanity proxy:', error);

        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            errorDetails: process.env.NODE_ENV === 'development' ? error : null
        }, {
            status: 500,
            headers: corsHeaders
        });
    }
}
