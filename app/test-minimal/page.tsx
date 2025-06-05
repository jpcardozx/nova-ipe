'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function TestMinimalPage() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-100">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
                <h1 className="text-2xl font-bold text-center mb-6">Next.js 14 Test Page</h1>

                <p className="mb-4 text-gray-600">
                    This is a minimal test page to verify that our fixes for Next.js 14 development errors are working.
                </p>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                    <h2 className="font-medium text-green-700">Status Check</h2>
                    <ul className="mt-2 space-y-1">
                        <li className="flex items-center text-sm text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Page loaded successfully
                        </li>
                        <li className="flex items-center text-sm text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Client-side navigation works
                        </li>
                    </ul>
                </div>

                <button
                    onClick={() => router.refresh()}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                >
                    Test Router Refresh
                </button>
            </div>
        </div>
    );
}
