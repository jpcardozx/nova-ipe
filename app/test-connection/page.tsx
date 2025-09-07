'use client'

import { useEffect, useState } from 'react'
import { sanityClient, testSanityConnection } from '../../lib/sanity/index'

export default function TestConnectionPage() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [data, setData] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function testConnection() {
            try {
                console.log('🔍 Testing Sanity connection...')

                // Test connection first
                const isConnected = await testSanityConnection()
                if (!isConnected) {
                    throw new Error('Connection test failed')
                }

                // Simple test query
                const result = await sanityClient.fetch('*[_type == "imovel"][0...3]{ _id, titulo }')

                console.log('✅ Connection successful:', result)
                setData(result)
                setStatus('success')
            } catch (err) {
                console.error('❌ Connection failed:', err)
                setError(err instanceof Error ? err.message : 'Unknown error')
                setStatus('error')
            }
        }

        testConnection()
    }, [])

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Sanity Connection Test</h1>

            <div className="space-y-4">
                <div className="p-4 rounded-lg border">
                    <h2 className="font-semibold mb-2">Status</h2>
                    <div className={`px-3 py-1 rounded text-sm inline-block ${status === 'loading' ? 'bg-yellow-100 text-yellow-800' :
                        status === 'success' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {status === 'loading' && '🔄 Testing connection...'}
                        {status === 'success' && '✅ Connected successfully'}
                        {status === 'error' && '❌ Connection failed'}
                    </div>
                </div>

                {error && (
                    <div className="p-4 rounded-lg border border-red-200 bg-red-50">
                        <h2 className="font-semibold mb-2 text-red-800">Error</h2>
                        <pre className="text-sm text-red-700">{error}</pre>
                    </div>
                )}

                {data && (
                    <div className="p-4 rounded-lg border border-green-200 bg-green-50">
                        <h2 className="font-semibold mb-2 text-green-800">Data Retrieved</h2>
                        <pre className="text-sm text-green-700 overflow-auto">
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </div>
                )}

                <div className="p-4 rounded-lg border bg-gray-50">
                    <h2 className="font-semibold mb-2">Configuration</h2>
                    <div className="text-sm space-y-1">
                        <div>Project ID: 0nks58lj</div>
                        <div>Dataset: production</div>
                        <div>API Version: 2023-05-03</div>
                        <div>Has Token: {process.env.SANITY_API_TOKEN ? 'Yes' : 'No'}</div>
                        <div>Environment: {process.env.NODE_ENV}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}