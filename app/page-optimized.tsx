/**
 * Ultra-Optimized Homepage - Performance Critical Version
 * Target: Sub-1000ms FCP, Sub-3000ms Load Time
 */

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Critical Above-Fold Components (loaded immediately)
const NavBar = dynamic(() => import('./sections/NavBar'), {
    loading: () => <div className="h-20 bg-white shadow-sm" />,
    ssr: true
});

const Hero = dynamic(() => import('./sections/Hero'), {
    loading: () => <div className="h-96 bg-gray-100" />,
    ssr: true
});

// Non-critical components (lazy loaded)
const Destaques = dynamic(() => import('./sections/Destaques'), {
    loading: () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-64 bg-gray-100 animate-pulse rounded" />
            ))}
        </div>
    ),
    ssr: false
});

const Valor = dynamic(() => import('./sections/Valor'), {
    loading: () => <div className="h-40 bg-gray-50" />,
    ssr: false
});

const Footer = dynamic(() => import('./sections/Footer'), {
    loading: () => <div className="h-40 bg-gray-900" />,
    ssr: false
});

// Main page component - server-side rendered for better SEO and performance
export default async function OptimizedHomePage() {
    // Critical data fetching (minimal, above-fold only)
    // Move heavy data fetching to client components or API routes

    return (
        <main className="min-h-screen bg-white">
            {/* Critical Above-Fold Content - Renders Immediately */}
            <NavBar />
            <Hero />

            {/* Non-Critical Content - Lazy Loaded */}
            <Suspense fallback={<div className="h-20 bg-gray-50 animate-pulse" />}>
                <Destaques />
            </Suspense>

            <Suspense fallback={<div className="h-20 bg-gray-50 animate-pulse" />}>
                <Valor />
            </Suspense>

            <Suspense fallback={<div className="h-40 bg-gray-900 animate-pulse" />}>
                <Footer />
            </Suspense>
        </main>
    );
}

// Static generation for better performance
export const revalidate = 3600; // Revalidate every hour
