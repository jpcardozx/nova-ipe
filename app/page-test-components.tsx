'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// === FALLBACK COMPONENTS ===
import { HeroLoadingFallback, PropertyLoadingFallback, ErrorFallback } from './components/ErrorBoundaryComponents';

// Start with just the most essential components to isolate the issue
const OptimizationProvider = dynamic(() => import('./components/OptimizationProvider'), {
    ssr: false,
    loading: () => <div>Loading...</div>
});

const ClientOnlyNavbar = dynamic(() => import('./components/ClientOnlyNavbar'), {
    ssr: false,
    loading: () => <div>Loading navigation...</div>
});

// Test ClientProgressSteps specifically since we've been working on it
const ClientProgressSteps = dynamic(() => import('./components/ClientProgressSteps').then(mod => mod.default), {
    ssr: false,
    loading: () => <div>Loading progress steps...</div>
});

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col">
            <OptimizationProvider>
                <ClientOnlyNavbar />

                <div className="p-8">
                    <h1 className="text-3xl font-bold mb-4">Testing Individual Components</h1>
                    <p className="mb-8">This page loads components one by one to isolate hydration issues.</p>
                </div>

                {/* Test ClientProgressSteps */}
                <Suspense fallback={<div>Loading ClientProgressSteps...</div>}>
                    <ClientProgressSteps />
                </Suspense>

                <div className="p-8">
                    <p>If you see this text, ClientProgressSteps loaded successfully!</p>
                </div>
            </OptimizationProvider>
        </main>
    )
}
