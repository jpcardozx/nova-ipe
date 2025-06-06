'use client'

import { memo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, ArrowUpRight } from 'lucide-react'

interface ErrorStateProps {
    errorMessage?: string
    onRetry?: () => void
}

/**
 * Componente aprimorado de estado de erro com opção de retry
 * Exibe uma mensagem de erro personalizada e oferece opções para tentar novamente
 */
function ErrorState({ errorMessage, onRetry }: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] py-12">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-5"
            >
                <AlertTriangle className="w-8 h-8 text-red-500" />
            </motion.div>

            <motion.h3
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-xl font-medium text-stone-800 mb-2 text-center"
            >
                Não foi possível carregar os imóveis em destaque
            </motion.h3>

            <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-stone-600 text-center max-w-md mb-6"
            >
                {errorMessage || 'Ocorreu um erro ao buscar os dados. Por favor, tente novamente mais tarde.'}
            </motion.p>

            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
            >
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="inline-flex items-center justify-center px-5 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
                        aria-label="Tentar carregar os imóveis novamente"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Tentar novamente
                    </button>
                )}

                <Link
                    href="/imoveis"
                    className="inline-flex items-center justify-center px-5 py-3 bg-white border border-stone-200 text-stone-700 rounded-lg font-medium hover:bg-stone-50 transition-colors"
                >
                    Ver catálogo completo
                    <ArrowUpRight className="w-4 h-4 ml-2" />
                </Link>
            </motion.div>
        </div>
    )
}

export default memo(ErrorState)