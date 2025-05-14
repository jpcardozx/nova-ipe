'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Global error caught:', error)
    }, [error])

    return (
        <html lang="pt-BR">
            <body>
                <div className="flex flex-col items-center justify-center min-h-screen py-12">
                    <div
                        className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-5"
                    >
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>

                    <h2
                        className="text-2xl font-medium text-stone-800 mb-2 text-center"
                    >
                        Erro crítico!
                    </h2>

                    <p
                        className="text-stone-600 text-center max-w-md mb-6"
                    >
                        Ocorreu um erro crítico na aplicação. Nossa equipe foi notificada.
                    </p>

                    <div
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <button
                            onClick={() => reset()}
                            className="inline-flex items-center justify-center px-5 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
                            aria-label="Tentar recarregar a aplicação"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Tentar novamente
                        </button>

                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-5 py-3 bg-white border border-stone-200 text-stone-700 rounded-lg font-medium hover:bg-stone-50 transition-colors"
                        >
                            <Home className="w-4 h-4 mr-2" />
                            Ir para a página inicial
                        </Link>
                    </div>
                </div>
            </body>
        </html>
    )
} 