'use client'

import { useState, useEffect } from 'react'
import { supabase, testSupabaseConnection } from '@/lib/supabase'

interface ConnectionStatusProps {
    showInProduction?: boolean
}

export default function ConnectionStatus({ showInProduction = false }: ConnectionStatusProps) {
    const [isConnected, setIsConnected] = useState<boolean | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isVisible, setIsVisible] = useState(true)

    // Só mostra em desenvolvimento, a menos que explicitamente solicitado
    const shouldShow = process.env.NODE_ENV === 'development' || showInProduction

    useEffect(() => {
        if (!shouldShow) return

        const checkConnection = async () => {
            try {
                const connected = await testSupabaseConnection()
                setIsConnected(connected)
                setError(null)
            } catch (err) {
                setIsConnected(false)
                setError(err instanceof Error ? err.message : 'Erro desconhecido')
            }
        }

        // Verifica imediatamente
        checkConnection()

        // Verifica a cada 30 segundos
        const interval = setInterval(checkConnection, 30000)

        return () => clearInterval(interval)
    }, [shouldShow])

    if (!shouldShow || !isVisible) return null

    return (
        <div className="fixed top-4 right-4 z-50">
            <div className={`px-3 py-2 rounded-lg text-sm font-medium shadow-lg ${isConnected === null
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                    : isConnected
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                }`}>
                <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${isConnected === null
                                ? 'bg-yellow-500'
                                : isConnected
                                    ? 'bg-green-500 animate-pulse'
                                    : 'bg-red-500'
                            }`} />
                        <span>
                            {isConnected === null
                                ? 'Verificando...'
                                : isConnected
                                    ? 'Supabase OK'
                                    : 'Supabase Offline'
                            }
                        </span>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>
                {error && (
                    <div className="text-xs mt-1 opacity-75">
                        {error}
                    </div>
                )}
            </div>
        </div>
    )
}
