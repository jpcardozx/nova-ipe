/**
 * Sanity Health Check API Route
 */

import { NextResponse } from 'next/server'
// import { checkSanityHealth } from '@/lib/sanity/health-check' // Temporarily commented out due to missing module

export async function GET() {
    try {
        // Temporarily commented out due to missing function.
        // The functionality for Sanity health check needs to be re-implemented or located.
        /*
        const health = await checkSanityHealth()

        return NextResponse.json({
            ...health,
            timestamp: new Date().toISOString(),
            status: health.isHealthy ? 'healthy' : 'unhealthy'
        })
        */
        return NextResponse.json({
            isHealthy: false,
            error: 'Sanity health check functionality is currently unavailable.',
            timestamp: new Date().toISOString(),
            status: 'unimplemented'
        }, { status: 501 }); // 501 Not Implemented
    } catch (error) {
        return NextResponse.json({
            isHealthy: false,
            error: 'Health check failed',
            timestamp: new Date().toISOString(),
            status: 'error'
        }, { status: 500 })
    }
}

export async function POST() {
    // Force a health check
    return GET()
}