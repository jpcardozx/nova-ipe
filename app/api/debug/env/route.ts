// app/api/debug/env/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const envDebug = {
            NODE_ENV: process.env.NODE_ENV,
            ADMIN_PASS: process.env.ADMIN_PASS ? '[SET]' : '[NOT SET]',
            NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '[NOT SET]',
            NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET || '[NOT SET]',
            timestamp: new Date().toISOString()
        }

        return NextResponse.json({
            success: true,
            environment: envDebug,
            message: 'Environment variables debug info'
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: 'Failed to get environment debug info',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}