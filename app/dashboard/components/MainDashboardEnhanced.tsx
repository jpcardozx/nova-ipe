'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    TrendingUp,
    Users,
    Building2,
    Calendar,
    Phone,
    MessageSquare,
    Plus,
    ArrowUpRight,
    Clock,
    Target,
    MapPin,
    Star,
    Activity,
    Eye,
    Rocket,
    Zap,
    Globe,
    Briefcase,
    BarChart3,
    Settings,
    CheckCircle2,
    AlertCircle,
    User,
    Home
} from 'lucide-react'

// Import modais
import { TaskModal } from '@/components/dashboard/TaskModal'
import LeadModal from './LeadModal'
import ClientModal from './ClientModal'

// Import services
import { TasksService } from '@/lib/supabase/tasks-service'
import { LeadsService } from '@/lib/supabase/leads-service'
import { ClientsService } from '@/lib/supabase/clients-service'

interface DashboardMetrics {
    totalProperties: number
    totalClients: number
    totalLeads: number
    totalTasks: number
    monthlyRevenue: number
    conversionRate: number
    activeListings: number
    scheduledVisits: number
}

export default function MainDashboardEnhanced() {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [metrics, setMetrics] = useState<DashboardMetrics>({
        totalProperties: 45,
        totalClients: 128,
        totalLeads: 23,
        totalTasks: 12,
        monthlyRevenue: 145000,
        conversionRate: 24.5,
        activeListings: 18,
        scheduledVisits: 8
    })

    // Modal states
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)
    const [isClientModalOpen, setIsClientModalOpen] = useState(false)

    // Update current time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 60000)

        return () => clearInterval(timer)
    }, [])

    // Load real metrics from services
    useEffect(() => {
        const loadMetrics = async () => {
            try {
                const [tasksResult, leadsResult, clientsResult] = await Promise.all([
                    TasksService.getTaskStats(),
                    LeadsService.getLeadStats(),
                    ClientsService.getClientStats()
                ])

                if (tasksResult && leadsResult.stats && clientsResult.stats) {
                    setMetrics(prev => ({
                        ...prev,
                        totalTasks: tasksResult.total || 0,
                        totalLeads: leadsResult.stats.total || 0,
                        totalClients: clientsResult.stats.total || 0,
                        conversionRate: leadsResult.stats.conversionRate || 0
                    }))
                }
            } catch (error) {
                console.error('Error loading metrics:', error)
            }
        }

        loadMetrics()
    }, [])

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    const formatDateTime = (date: Date) => {
        return {
            time: date.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            date: date.toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        }
    }

    const { time, date } = formatDateTime(currentTime)

    const metricCards = [
        {
            title: 'Imóveis Ativos',
            value: metrics.totalProperties,
            icon: Building2,
            trend: '+12%',
            trendUp: true,
            color: 'from-blue-500 to-blue-600'
        },
        {
            title: 'Clientes Totais',
            value: metrics.totalClients,
            icon: Users,
            trend: '+8%',
            trendUp: true,
            color: 'from-emerald-500 to-emerald-600'
        },
        {
            title: 'Leads Ativos',
            value: metrics.totalLeads,
            icon: Target,
            trend: '+15%',
            trendUp: true,
            color: 'from-purple-500 to-purple-600'
        },
        {
            title: 'Tarefas Pendentes',
            value: metrics.totalTasks,
            icon: CheckCircle2,
            trend: '-5%',
            trendUp: false,
            color: 'from-amber-500 to-amber-600'
        },
        {
            title: 'Receita Mensal',
            value: formatCurrency(metrics.monthlyRevenue),
            icon: TrendingUp,
            trend: '+22%',
            trendUp: true,
            color: 'from-indigo-500 to-indigo-600',
            isRevenue: true
        },
        {
            title: 'Taxa de Conversão',
            value: `${metrics.conversionRate.toFixed(1)}%`,
            icon: BarChart3,
            trend: '+3.2%',
            trendUp: true,
            color: 'from-pink-500 to-pink-600'
        }
    ]

    const quickActions = [
        {
            title: 'Nova Tarefa',
            description: 'Criar uma nova tarefa ou lembrete',
            icon: Plus,
            color: 'from-blue-500 to-blue-600',
            onClick: () => setIsTaskModalOpen(true)
        },
        {
            title: 'Novo Lead',
            description: 'Cadastrar um novo lead qualificado',
            icon: User,
            color: 'from-purple-500 to-purple-600',
            onClick: () => setIsLeadModalOpen(true)
        },
        {
            title: 'Novo Cliente',
            description: 'Adicionar cliente ao sistema',
            icon: Users,
            color: 'from-emerald-500 to-emerald-600',
            onClick: () => setIsClientModalOpen(true)
        },
        {
            title: 'Novo Imóvel',
            description: 'Cadastrar nova propriedade',
            icon: Home,
            color: 'from-indigo-500 to-indigo-600',
            onClick: () => console.log('Redirect to properties')
        }
    ]

    return (
        <div className="space-y-8 px-6 rounded-2xl shadow-2xl">
            {/* Header Section */}
            <motion.div
                className="relative overflow-hidden rounded-3xl p-8"
                style={{
                    background: `
                        linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%),
                        linear-gradient(45deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)
                    `,
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    boxShadow: `
                        0 20px 40px -12px rgba(0, 0, 0, 0.1),
                        0 8px 24px -8px rgba(0, 0, 0, 0.05),
                        inset 0 1px 0 rgba(255, 255, 255, 0.9)
                    `,
                    backdropFilter: 'blur(16px)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <motion.h1
                            className="text-4xl font-bold text-slate-800 mb-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            Bem-vindo de volta! 👋
                        </motion.h1>
                        <motion.p
                            className="text-lg text-slate-600 capitalize"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            {date}
                        </motion.p>
                    </div>
                    <motion.div
                        className="text-right"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        <div className="text-3xl font-bold text-slate-800 font-mono">
                            {time}
                        </div>
                        <div className="text-sm text-slate-500 mt-1">
                            Horário atual
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Metrics Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
            >
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Métricas Principais</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {metricCards.map((metric, index) => (
                        <motion.div
                            key={metric.title}
                            className="relative overflow-hidden rounded-2xl"
                            style={{
                                background: `
                                    linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)
                                `,
                                border: '1px solid rgba(148, 163, 184, 0.2)',
                                boxShadow: `
                                    0 10px 20px -8px rgba(0, 0, 0, 0.1),
                                    0 4px 12px -4px rgba(0, 0, 0, 0.05),
                                    inset 0 1px 0 rgba(255, 255, 255, 0.9)
                                `,
                                backdropFilter: 'blur(16px)'
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index, duration: 0.6 }}
                            whileHover={{
                                y: -4,
                                transition: { duration: 0.2 }
                            }}
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-600 mb-2">
                                            {metric.title}
                                        </p>
                                        <p className="text-2xl font-bold text-slate-800 mb-3">
                                            {metric.isRevenue ? metric.value : typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${metric.trendUp
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-red-100 text-red-700'
                                                }`}>
                                                <ArrowUpRight className={`w-3 h-3 ${metric.trendUp ? '' : 'rotate-180'}`} />
                                                {metric.trend}
                                            </div>
                                            <span className="text-xs text-slate-500">vs mês anterior</span>
                                        </div>
                                    </div>
                                    <div
                                        className="p-3 rounded-xl"
                                        style={{
                                            background: `linear-gradient(135deg, ${metric.color.split(' ')[1]} 0%, ${metric.color.split(' ')[3]} 100%)`,
                                            boxShadow: '0 4px 12px -4px rgba(0, 0, 0, 0.2)'
                                        }}
                                    >
                                        <metric.icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
            >
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Ações Rápidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {quickActions.map((action, index) => (
                        <motion.button
                            key={action.title}
                            onClick={action.onClick}
                            className="relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 group"
                            style={{
                                background: `
                                    linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)
                                `,
                                border: '1px solid rgba(148, 163, 184, 0.2)',
                                boxShadow: `
                                    0 10px 20px -8px rgba(0, 0, 0, 0.1),
                                    0 4px 12px -4px rgba(0, 0, 0, 0.05)
                                `
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index, duration: 0.6 }}
                            whileHover={{
                                y: -4,
                                boxShadow: `
                                    0 20px 40px -12px rgba(0, 0, 0, 0.15),
                                    0 8px 24px -8px rgba(0, 0, 0, 0.1)
                                `,
                                transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className="p-3 rounded-xl group-hover:scale-110 transition-transform duration-300"
                                    style={{
                                        background: `linear-gradient(135deg, ${action.color.split(' ')[1]} 0%, ${action.color.split(' ')[3]} 100%)`,
                                        boxShadow: '0 4px 12px -4px rgba(0, 0, 0, 0.2)'
                                    }}
                                >
                                    <action.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-slate-900 transition-colors">
                                        {action.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors">
                                        {action.description}
                                    </p>
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Performance Summary */}
            <motion.div
                className="relative overflow-hidden rounded-2xl p-6"
                style={{
                    background: `
                        linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)
                    `,
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    boxShadow: `
                        0 10px 20px -8px rgba(0, 0, 0, 0.1),
                        0 4px 12px -4px rgba(0, 0, 0, 0.05),
                        inset 0 1px 0 rgba(255, 255, 255, 0.9)
                    `,
                    backdropFilter: 'blur(16px)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
            >
                <h3 className="text-xl font-bold text-slate-800 mb-4">Resumo de Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">{metrics.activeListings}</div>
                        <div className="text-sm text-slate-600">Anúncios Ativos</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600 mb-1">{metrics.scheduledVisits}</div>
                        <div className="text-sm text-slate-600">Visitas Agendadas</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-1">{metrics.conversionRate.toFixed(1)}%</div>
                        <div className="text-sm text-slate-600">Taxa de Conversão</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-amber-600 mb-1">{formatCurrency(metrics.monthlyRevenue / metrics.totalClients)}</div>
                        <div className="text-sm text-slate-600">Ticket Médio</div>
                    </div>
                </div>
            </motion.div>

            {/* Modals */}
            <TaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onSave={() => {
                    setIsTaskModalOpen(false)
                    // Reload metrics after creating task
                    window.location.reload()
                }}
                categories={[]} // TODO: Buscar categorias reais do TasksService
            />

            <LeadModal
                isOpen={isLeadModalOpen}
                onClose={() => setIsLeadModalOpen(false)}
                onSave={() => {
                    setIsLeadModalOpen(false)
                    // Reload metrics after creating lead
                    window.location.reload()
                }}
            />

            <ClientModal
                isOpen={isClientModalOpen}
                onClose={() => setIsClientModalOpen(false)}
                onSave={() => {
                    setIsClientModalOpen(false)
                    // Reload metrics after creating client
                    window.location.reload()
                }}
            />
        </div>
    )
}