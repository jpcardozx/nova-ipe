'use client';

import React, { useState, useEffect } from 'react';
import { enhancedSanityFetch, testSanityConnection } from '@/lib/sanity/enhanced-client';

export default function CORSTestPage() {
    const [testResults, setTestResults] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [directTest, setDirectTest] = useState<any>(null);
    const [proxyTest, setProxyTest] = useState<any>(null);

    const runConnectionTest = async () => {
        setLoading(true);
        try {
            const results = await testSanityConnection();
            setTestResults(results);
        } catch (error) {
            setTestResults({
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        } finally {
            setLoading(false);
        }
    };

    const testDirectFetch = async () => {
        setLoading(true);
        try {
            const data = await enhancedSanityFetch('*[_type == "imovel"][0...3]{ _id, titulo, preco }', {}, {
                useProxy: false
            });
            setDirectTest({ success: true, data });
        } catch (error) {
            setDirectTest({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        } finally {
            setLoading(false);
        }
    };

    const testProxyFetch = async () => {
        setLoading(true);
        try {
            const data = await enhancedSanityFetch('*[_type == "imovel"][0...3]{ _id, titulo, preco }', {}, {
                useProxy: true
            });
            setProxyTest({ success: true, data });
        } catch (error) {
            setProxyTest({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        runConnectionTest();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">
                        CORS & Sanity Connection Test
                    </h1>

                    {/* Connection Status */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
                        <div className="bg-gray-100 rounded-lg p-4">
                            {loading && <p>Testing connections...</p>}
                            {testResults && (
                                <div>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className={`p-3 rounded ${testResults.directAccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            <strong>Direct Access:</strong> {testResults.directAccess ? '✅ Working' : '❌ Failed'}
                                        </div>
                                        <div className={`p-3 rounded ${testResults.proxyAccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            <strong>Proxy Access:</strong> {testResults.proxyAccess ? '✅ Working' : '❌ Failed'}
                                        </div>
                                    </div>

                                    {testResults.errors.length > 0 && (
                                        <div className="mb-4">
                                            <h3 className="font-semibold text-red-700">Errors:</h3>
                                            <ul className="list-disc list-inside text-red-600">
                                                {testResults.errors.map((error: string, index: number) => (
                                                    <li key={index}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {testResults.recommendations.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold text-blue-700">Recommendations:</h3>
                                            <ul className="list-disc list-inside text-blue-600">
                                                {testResults.recommendations.map((rec: string, index: number) => (
                                                    <li key={index}>{rec}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Test Buttons */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Manual Tests</h2>
                        <div className="flex gap-4 mb-4">
                            <button
                                onClick={runConnectionTest}
                                disabled={loading}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                            >
                                Retest Connection
                            </button>
                            <button
                                onClick={testDirectFetch}
                                disabled={loading}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                            >
                                Test Direct Fetch
                            </button>
                            <button
                                onClick={testProxyFetch}
                                disabled={loading}
                                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
                            >
                                Test Proxy Fetch
                            </button>
                        </div>
                    </div>

                    {/* Test Results */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Direct Test Results */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Direct Fetch Results</h3>
                            <div className="bg-gray-100 rounded-lg p-4 max-h-60 overflow-y-auto">
                                {directTest ? (
                                    <pre className="text-sm">
                                        {JSON.stringify(directTest, null, 2)}
                                    </pre>
                                ) : (
                                    <p className="text-gray-500">No test run yet</p>
                                )}
                            </div>
                        </div>

                        {/* Proxy Test Results */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Proxy Fetch Results</h3>
                            <div className="bg-gray-100 rounded-lg p-4 max-h-60 overflow-y-auto">
                                {proxyTest ? (
                                    <pre className="text-sm">
                                        {JSON.stringify(proxyTest, null, 2)}
                                    </pre>
                                ) : (
                                    <p className="text-gray-500">No test run yet</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Configuration Info */}
                    <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Configuration</h3>
                        <div className="text-sm space-y-1">
                            <p><strong>Project ID:</strong> {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}</p>
                            <p><strong>Dataset:</strong> {process.env.NEXT_PUBLIC_SANITY_DATASET}</p>
                            <p><strong>API Version:</strong> {process.env.NEXT_PUBLIC_SANITY_API_VERSION}</p>
                            <p><strong>Current Origin:</strong> {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</p>
                        </div>
                    </div>

                    {/* CORS Setup Instructions */}
                    <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">CORS Setup Instructions</h3>
                        <ol className="list-decimal list-inside text-sm space-y-1">
                            <li>Visit <a href="https://www.sanity.io/manage" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Sanity Management Dashboard</a></li>
                            <li>Select project <code className="bg-gray-200 px-1 rounded">0nks58lj</code></li>
                            <li>Go to API → CORS Origins</li>
                            <li>Add <code className="bg-gray-200 px-1 rounded">{typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001'}</code></li>
                            <li>Save and test the connection again</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}
