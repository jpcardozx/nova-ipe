// app/api/sanity-proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { serverClient } from '@/lib/sanity/sanity.server';

/**
 * This API route acts as a proxy for Sanity queries
 * to avoid CORS errors during local development
 */
export async function POST(request: NextRequest) {
    try {
        // Parse the request body containing the query and params
        const body = await request.json();
        const { query, params = {} } = body;

        if (!query) {
            return NextResponse.json({ error: 'No query provided' }, { status: 400 });
        }

        // Execute the Sanity query server-side
        const data = await serverClient.fetch(query, params);

        return NextResponse.json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Error in Sanity proxy:', error);

        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            errorDetails: process.env.NODE_ENV === 'development' ? error : null
        }, {
            status: 500
        });
    }
}
