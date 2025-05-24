'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Error caught by error boundary:', error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-12">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-5"
            >
                <AlertTriangle className="w-8 h-8 text-red-500" />
            </motion.div>

            <motion.h2
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-display-2 text-neutral-900 mb-4 text-center"
            >
                Algo deu errado
            </motion.h2>

            <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-body-1 text-neutral-600 text-center mb-8 max-w-md"
            >
                Sentimos muito pelo inconveniente. Nossa equipe foi notificada e está investigando o problema.
            </motion.p>

            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
            >
                <button
                    onClick={() => reset()}
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg text-body-2 font-medium hover:bg-primary-700 transition-colors"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Tentar novamente
                </button>

                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-3 bg-neutral-100 text-neutral-700 rounded-lg text-body-2 font-medium hover:bg-neutral-200 transition-colors"
                >
                    <Home className="w-4 h-4 mr-2" />
                    Voltar à página inicial
                </Link>
            </motion.div>
        </div>
    )
}