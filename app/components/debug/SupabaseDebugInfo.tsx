'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function SupabaseDebugInfo() {
    const [info, setInfo] = useState<any>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const checkInfo = async () => {
            try {
                const url = process.env.NEXT_PUBLIC_SUPABASE_URL
                const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

                setInfo({
                    url,
                    keyPreview: key ? key.substring(0, 20) + '...' : 'Não definido',
                    nodeEnv: process.env.NODE_ENV,
                    isClient: typeof window !== 'undefined',
                    timestamp: new Date().toISOString()
                })
            } catch (error) {
                console.error('Erro ao coletar informações de debug:', error)
            }
        }

        checkInfo()
    }, [])

    // Só mostra em desenvolvimento ou quando explicitamente solicitado
    if (process.env.NODE_ENV === 'production') {
        return null
    }

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                className="fixed bottom-4 left-4 bg-blue-600 text-white p-2 rounded-full text-xs z-50"
            >
                🔍
            </button>
        )
    }

    return (
        <div className="fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border max-w-md z-50">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm">Supabase Debug Info</h3>
                <button
                    onClick={() => setIsVisible(false)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
            </div>

            {info && (
                <div className="space-y-2 text-xs">
                    <div>
                        <strong>URL:</strong>
                        <code className="ml-2 bg-gray-100 px-1 rounded">{info.url}</code>
                    </div>
                    <div>
                        <strong>Key:</strong>
                        <code className="ml-2 bg-gray-100 px-1 rounded">{info.keyPreview}</code>
                    </div>
                    <div>
                        <strong>Environment:</strong>
                        <code className="ml-2 bg-gray-100 px-1 rounded">{info.nodeEnv}</code>
                    </div>
                    <div>
                        <strong>Client Side:</strong>
                        <code className="ml-2 bg-gray-100 px-1 rounded">{info.isClient ? 'Yes' : 'No'}</code>
                    </div>
                    <div>
                        <strong>Timestamp:</strong>
                        <code className="ml-2 bg-gray-100 px-1 rounded">{info.timestamp}</code>
                    </div>
                </div>
            )}

            <div className="mt-3 pt-2 border-t">
                <button
                    onClick={async () => {
                        try {
                            const { data, error } = await supabase.from('profiles').select('count').limit(1)
                            alert(error ? `Erro: ${error.message}` : 'Conexão OK!')
                        } catch (err) {
                            alert(`Erro de rede: ${err}`)
                        }
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                >
                    Testar Conexão
                </button>
            </div>
        </div>
    )
}
