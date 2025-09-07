'use client'

import { motion } from 'framer-motion'
import { Clock, Sparkles, TrendingUp } from 'lucide-react'

interface UserProfile {
    email: string
    full_name?: string
    department?: string
    role?: string
    created_at?: string
}

interface WelcomeSectionProps {
    user: UserProfile | null
}

export function WelcomeSection({ user }: WelcomeSectionProps) {
    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Bom dia'
        if (hour < 18) return 'Boa tarde'
        return 'Boa noite'
    }

    const getMotivationalMessage = () => {
        const messages = [
            'Vamos fazer acontecer hoje! 🚀',
            'Seu sucesso começa aqui! ⭐',
            'Pronto para conquistar novos clientes? 💪',
            'Hoje é um ótimo dia para fechar negócios! 🎯',
            'Vamos transformar sonhos em realidade! 🏠'
        ]
        return messages[Math.floor(Math.random() * messages.length)]
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-8 text-white">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16"></div>
                    <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-full -translate-x-12 -translate-y-12"></div>
                </div>

                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center space-x-2 mb-2"
                        >
                            <Sparkles className="h-6 w-6 text-yellow-300" />
                            <span className="text-lg font-medium opacity-90">
                                {getGreeting()}, {user?.full_name?.split(' ')[0] || 'Usuário'}!
                            </span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl md:text-4xl font-bold mb-3"
                        >
                            {getMotivationalMessage()}
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg opacity-90 max-w-2xl"
                        >
                            Aqui está um resumo das suas atividades e métricas do sistema.
                            Continue o excelente trabalho!
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex items-center space-x-4 mt-4"
                        >
                            <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                                <TrendingUp className="h-4 w-4" />
                                <span className="text-sm font-medium">Performance em alta</span>
                            </div>

                            <div className="flex items-center space-x-2 text-sm opacity-75">
                                <Clock className="h-4 w-4" />
                                <span>Última atualização: {new Date().toLocaleTimeString('pt-BR')}</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Decorative Elements */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="hidden lg:block"
                    >
                        <div className="relative">
                            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                                <div className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center">
                                    <Sparkles className="h-10 w-10 text-yellow-300" />
                                </div>
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-pulse"></div>
                            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-orange-300 rounded-full animate-bounce"></div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}