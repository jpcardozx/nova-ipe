'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import {
    TrendingUp,
    Users,
    Building2,
    Calendar,
    Target,
    DollarSign,
    Star,
    Clock,
    ArrowRight,
    Bell,
    Activity
} from 'lucide-react'

interface DashboardStats {
    properties: number
    clients: number
    appointments_today: number
    leads_this_week: number
    revenue_this_month: number
    pending_tasks: number
    avg_rating: number
    active_campaigns: number
}

interface RecentActivity {
    id: string
    type: 'appointment' | 'lead' | 'sale' | 'review'
    title: string
    description: string
    time: string
    icon: any
    color: string
}

export default function DashboardWelcome() {
    const { user } = useCurrentUser()
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadDashboardData()
    }, [])

    const loadDashboardData = async () => {
        try {
            // Simulate loading dashboard data
            await new Promise(resolve => setTimeout(resolve, 1000))

            setStats({
                properties: 156,
                clients: 89,
                appointments_today: 5,
                leads_this_week: 23,
                revenue_this_month: 45800,
                pending_tasks: 8,
                avg_rating: 4.8,
                active_campaigns: 3
            })

            setRecentActivity([
                {
                    id: '1',
                    type: 'appointment',
                    title: 'Visita agendada',
                    description: 'Maria Santos - Apartamento Itaim',
                    time: '15:00 hoje',
                    icon: Calendar,
                    color: 'text-blue-600'
                },
                {
                    id: '2',
                    type: 'lead',
                    title: 'Novo lead',
                    description: 'João Silva interessado em casa',
                    time: '2h atrás',
                    icon: Users,
                    color: 'text-green-600'
                },
                {
                    id: '3',
                    type: 'sale',
                    title: 'Venda finalizada',
                    description: 'Cobertura Moema - R$ 850k',
                    time: '1 dia',
                    icon: Building2,
                    color: 'text-purple-600'
                },
                {
                    id: '4',
                    type: 'review',
                    title: 'Nova avaliação',
                    description: 'Ana Costa - 5 estrelas',
                    time: '2 dias',
                    icon: Star,
                    color: 'text-yellow-600'
                }
            ])
        } catch (error) {
            console.error('Error loading dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Bom dia'
        if (hour < 18) return 'Boa tarde'
        return 'Boa noite'
    }

    const getUserName = () => {
        return user?.full_name?.split(' ')[0] ||
            user?.email?.split('@')[0] ||
            'Corretor'
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value)
    }

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-xl mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                {/* Welcome Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-8 mb-8 text-white"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">
                                {getGreeting()}, {getUserName()}! 👋
                            </h1>
                            <p className="text-amber-100 mb-4">
                                Aqui está um resumo do seu dia e negócios
                            </p>
                            <div className="flex items-center gap-6 text-amber-100">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {new Date().toLocaleDateString('pt-BR', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    {new Date().toLocaleTimeString('pt-BR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:block">
                            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <Activity className="h-12 w-12 text-white" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <Building2 className="h-8 w-8 text-blue-600" />
                            <span className="text-xs text-blue-600 font-medium">Total</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {stats?.properties}
                        </div>
                        <div className="text-sm text-gray-600">Imóveis</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <Calendar className="h-8 w-8 text-orange-600" />
                            <span className="text-xs text-orange-600 font-medium">Hoje</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {stats?.appointments_today}
                        </div>
                        <div className="text-sm text-gray-600">Agendamentos</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <Target className="h-8 w-8 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">Esta semana</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {stats?.leads_this_week}
                        </div>
                        <div className="text-sm text-gray-600">Novos leads</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <DollarSign className="h-8 w-8 text-purple-600" />
                            <span className="text-xs text-purple-600 font-medium">Este mês</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {formatCurrency(stats?.revenue_this_month || 0)}
                        </div>
                        <div className="text-sm text-gray-600">Receita</div>
                    </motion.div>
                </div>

                {/* Recent Activity & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-xl border border-gray-200 shadow-sm"
                    >
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Atividade Recente
                                </h3>
                                <Bell className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                {recentActivity.map((activity, index) => (
                                    <motion.div
                                        key={activity.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + index * 0.1 }}
                                        className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        <div className={`p-2 rounded-lg bg-gray-100 ${activity.color}`}>
                                            <activity.icon className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 text-sm">
                                                {activity.title}
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                                {activity.description}
                                            </p>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {activity.time}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <button className="flex items-center gap-2 text-amber-600 hover:text-amber-700 text-sm font-medium">
                                    Ver todas as atividades
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-xl border border-gray-200 shadow-sm"
                    >
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Ações Rápidas
                            </h3>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: Building2, label: 'Novo Imóvel', href: '/dashboard/properties?action=create', color: 'bg-blue-500' },
                                    { icon: Users, label: 'Novo Cliente', href: '/dashboard/clients?action=create', color: 'bg-purple-500' },
                                    { icon: Calendar, label: 'Agendar Visita', href: '/dashboard/appointments?action=create', color: 'bg-orange-500' },
                                    { icon: Target, label: 'Nova Campanha', href: '/dashboard/campaigns?action=create', color: 'bg-green-500' }
                                ].map((action, index) => (
                                    <motion.a
                                        key={action.label}
                                        href={action.href}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 + index * 0.1 }}
                                        className={`flex flex-col items-center gap-3 p-4 ${action.color} text-white rounded-lg hover:opacity-90 transition-opacity`}
                                    >
                                        <action.icon className="h-6 w-6" />
                                        <span className="text-sm font-medium text-center">
                                            {action.label}
                                        </span>
                                    </motion.a>
                                ))}
                            </div>

                            {stats?.pending_tasks && stats.pending_tasks > 0 && (
                                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Bell className="h-5 w-5 text-yellow-600" />
                                        <div>
                                            <p className="font-medium text-yellow-800">
                                                Você tem {stats.pending_tasks} tarefas pendentes
                                            </p>
                                            <p className="text-yellow-700 text-sm">
                                                Não esqueça de revisar seus documentos e agendamentos
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
