'use client';

import { useEffect } from 'react';

export default function ErrorPage({
    error,
    reset
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to console for debugging
        console.error('Error page caught error:', error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
                <h2 className="mb-4 text-2xl font-bold text-red-600">Something went wrong!</h2>

                <div className="mb-4 rounded-md bg-red-50 p-4">
                    <p className="text-sm font-medium text-red-800">Error: {error.message}</p>
                    {error.digest && (
                        <p className="mt-2 text-xs text-red-700">Digest: {error.digest}</p>
                    )}
                </div>

                <div className="mt-6 flex justify-center gap-4">
                    <button
                        onClick={() => reset()}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        Try again
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
}
