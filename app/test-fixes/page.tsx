'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { useSSRSafeLayoutEffect } from '@/lib/use-ssr-safe-layout-effect';

export default function TestMinimalFixesPage() {
    const router = useRouter();
    const [metrics, setMetrics] = React.useState<{ [key: string]: boolean }>({
        headWorks: false,
        layoutEffectWorks: false,
        nextApiWorks: false,
        navigatorWorks: false,
    });

    // Test useLayoutEffect without warnings (using our safe version)
    useSSRSafeLayoutEffect(() => {
        setMetrics(prev => ({
            ...prev,
            layoutEffectWorks: true
        }));

        if (typeof navigator !== 'undefined' && navigator.userAgent) {
            setMetrics(prev => ({
                ...prev,
                navigatorWorks: true
            }));
        }

        // Check if Next.js internals are working
        if (typeof window !== 'undefined' && (window as any).next) {
            setMetrics(prev => ({
                ...prev,
                nextApiWorks: true
            }));
        }
    }, []);

    // Test Head component with useLayoutEffect
    React.useEffect(() => {
        // Indicate Head worked if we made it here without errors
        setMetrics(prev => ({
            ...prev,
            headWorks: true
        }));
    }, []);

    return (
        <>
            <Head>
                <title>Next.js Fixes Test</title>
            </Head>
            <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-100">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
                    <h1 className="text-2xl font-bold text-center mb-6">Next.js 14 Fixes Test</h1>

                    <p className="mb-4 text-gray-600">
                        Testing if our fixes for Next.js 14 development errors are working.
                    </p>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg mb-6">
                        <h2 className="font-medium text-slate-700 mb-3">Diagnostic Results</h2>
                        <ul className="space-y-2">
                            {Object.entries(metrics).map(([key, value]) => (
                                <li key={key} className="flex items-center text-sm">
                                    {value ? (
                                        <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    <span className={value ? "text-green-700" : "text-red-700"}>
                                        {key}: {value ? "Working" : "Failed"}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            onClick={() => router.refresh()}
                            className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                        >
                            Test Refresh
                        </button>

                        <button
                            onClick={() => router.push('/')}
                            className="flex-1 py-2 px-4 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg"
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
