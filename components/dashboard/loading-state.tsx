'use client'

import { motion } from 'framer-motion'

export function DashboardLoadingState() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                <div className="relative mb-8">
                    {/* Main spinner */}
                    <div className="animate-spin rounded-full h-20 w-20 border-4 border-amber-200 border-t-amber-600 mx-auto"></div>

                    {/* Pulse ring */}
                    <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-transparent border-t-orange-400 animate-ping mx-auto opacity-20"></div>

                    {/* Inner glow */}
                    <div className="absolute inset-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 opacity-20 animate-pulse"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-amber-800 bg-clip-text text-transparent mb-3">
                        Carregando Dashboard
                    </h3>
                    <p className="text-gray-600 text-lg mb-4">
                        Preparando sua experiência personalizada...
                    </p>

                    {/* Loading steps */}
                    <div className="space-y-2 max-w-xs mx-auto">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 2, ease: 'easeInOut' }}
                            className="h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Autenticando...</span>
                            <span>Carregando dados...</span>
                        </div>
                    </div>
                </motion.div>

                {/* Floating elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <motion.div
                        animate={{
                            y: [-10, 10, -10],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                        className="absolute top-1/4 left-1/4 w-3 h-3 bg-amber-400 rounded-full opacity-60"
                    />
                    <motion.div
                        animate={{
                            y: [10, -10, 10],
                            rotate: [0, -5, 5, 0]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 1
                        }}
                        className="absolute top-1/3 right-1/4 w-2 h-2 bg-orange-500 rounded-full opacity-40"
                    />
                    <motion.div
                        animate={{
                            y: [-5, 15, -5],
                            x: [-5, 5, -5]
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 2
                        }}
                        className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-yellow-400 rounded-full opacity-30"
                    />
                </div>
            </motion.div>
        </div>
    )
}