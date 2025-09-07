import { NextRequest, NextResponse } from 'next/server';
// Use the path alias defined in tsconfig.json
// import { testAllQueries, testSanityQuery } from '@lib/sanity/diagnostics'; // Temporarily commented out due to missing module

// This API route is for debugging Sanity connection issues
// It should be protected or disabled in production
export async function GET(request: NextRequest) {
    // Check for development environment or admin secret
    const isDevEnvironment = process.env.NODE_ENV === 'development';
    const adminSecret = request.nextUrl.searchParams.get('secret');
    const isAuthorized = isDevEnvironment || adminSecret === process.env.SANITY_DIAGNOSTIC_SECRET;

    if (!isAuthorized) {
        return NextResponse.json(
            { error: 'Unauthorized access' },
            { status: 401 }
        );
    }

    try {
        // Temporarily commented out due to missing functions.
        // The functionality for Sanity diagnostics needs to be re-implemented or located.
        /*
        // Get specific query from URL if provided
        const query = request.nextUrl.searchParams.get('query');        // If specific query provided, test just that one
        if (query) {
            // Properly type the params object to accept string keys
            const params: Record<string, string> = {};
            // Parse any params from URL - use Array.from to avoid iterator issues in older TS targets
            Array.from(request.nextUrl.searchParams.entries()).forEach(([key, value]) => {
                if (key !== 'query' && key !== 'secret') {
                    params[key] = value;
                }
            });

            const result = await testSanityQuery(query, params);
            return NextResponse.json(result);
        }

        // Otherwise run all diagnostic tests
        const diagnostics = await testAllQueries();
        return NextResponse.json(diagnostics);
        */
        return NextResponse.json({
            error: 'Sanity diagnostic functionality is currently unavailable.',
            message: 'The functions for running Sanity diagnostics are missing or not implemented.'
        }, { status: 501 }); // 501 Not Implemented
    } catch (error) {
        return NextResponse.json(
            {
                error: 'Failed to run diagnostics',
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : null
            },
            { status: 500 }
        );
    }
}
