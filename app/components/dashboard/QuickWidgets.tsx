'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Calendar,
    Phone,
    MessageSquare,
    Calculator,
    TrendingUp,
    Users,
    Building2,
    Target,
    Clock,
    Zap,
    ChevronRight,
    Plus
} from 'lucide-react'

interface QuickStatsProps {
    metrics: any
}

export function QuickStatsWidget({ metrics }: QuickStatsProps) {
    if (!metrics) return null

    const quickStats = [
        {
            label: 'Vendas este mês',
            value: metrics.soldThisMonth,
            target: 5,
            icon: TrendingUp,
            color: 'green',
            action: 'Ver relatório'
        },
        {
            label: 'Leads convertidos',
            value: Math.round(metrics.conversionRate),
            target: 20,
            icon: Users,
            color: 'blue',
            suffix: '%',
            action: 'Otimizar conversão'
        },
        {
            label: 'Dias médios venda',
            value: metrics.avgDaysOnMarket,
            target: 30,
            icon: Clock,
            color: 'orange',
            isLowerBetter: true,
            action: 'Acelerar vendas'
        },
        {
            label: 'Satisfação cliente',
            value: Math.round(metrics.clientSatisfaction),
            target: 90,
            icon: Target,
            color: 'purple',
            suffix: '%',
            action: 'Ver feedback'
        }
    ]

    const getProgressColor = (value: number, target: number, isLowerBetter = false) => {
        const progress = isLowerBetter ? (target / value) * 100 : (value / target) * 100
        if (progress >= 100) return 'bg-green-500'
        if (progress >= 75) return 'bg-yellow-500'
        return 'bg-red-500'
    }

    const getProgress = (value: number, target: number, isLowerBetter = false) => {
        const progress = isLowerBetter ? (target / value) * 100 : (value / target) * 100
        return Math.min(100, Math.max(0, progress))
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Resumo Executivo</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Ver detalhado
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {quickStats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-all cursor-pointer group"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 rounded-lg ${stat.color === 'green' ? 'bg-green-100 text-green-600' :
                                    stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                                        stat.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                                            'bg-purple-100 text-purple-600'
                                }`}>
                                <stat.icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                                <div className="text-lg font-bold text-gray-900">
                                    {stat.value}{stat.suffix || ''}
                                </div>
                                <div className="text-xs text-gray-500">{stat.label}</div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Meta: {stat.target}{stat.suffix || ''}</span>
                                <span>{getProgress(stat.value, stat.target, stat.isLowerBetter).toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                    className={`h-1.5 rounded-full transition-all duration-500 ${getProgressColor(stat.value, stat.target, stat.isLowerBetter)}`}
                                    style={{ width: `${getProgress(stat.value, stat.target, stat.isLowerBetter)}%` }}
                                />
                            </div>
                            <button className="text-xs text-blue-600 hover:text-blue-700 group-hover:opacity-100 opacity-0 transition-opacity">
                                {stat.action} →
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export function QuickActionsWidget() {
    const [selectedAction, setSelectedAction] = useState<string | null>(null)

    const actions = [
        {
            id: 'new-lead',
            label: 'Novo Lead',
            icon: Plus,
            color: 'blue',
            description: 'Cadastrar novo prospect'
        },
        {
            id: 'call-lead',
            label: 'Ligar',
            icon: Phone,
            color: 'green',
            description: 'Contatar lead ativo'
        },
        {
            id: 'schedule',
            label: 'Agendar',
            icon: Calendar,
            color: 'purple',
            description: 'Nova visita ou reunião'
        },
        {
            id: 'calculate',
            label: 'Simular',
            icon: Calculator,
            color: 'orange',
            description: 'Financiamento ou valor'
        }
    ]

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Ações Rápidas</h3>
                <Zap className="h-5 w-5 text-yellow-500" />
            </div>

            <div className="grid grid-cols-2 gap-3">
                {actions.map((action, index) => (
                    <motion.button
                        key={action.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedAction(action.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${selectedAction === action.id
                                ? `border-${action.color}-300 bg-${action.color}-50`
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg ${action.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                                    action.color === 'green' ? 'bg-green-100 text-green-600' :
                                        action.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                                            'bg-orange-100 text-orange-600'
                                }`}>
                                <action.icon className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">{action.label}</div>
                                <div className="text-xs text-gray-500">{action.description}</div>
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>

            {selectedAction && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-3 bg-gray-50 rounded-lg"
                >
                    <p className="text-sm text-gray-600">
                        Ação selecionada: <span className="font-medium">{actions.find(a => a.id === selectedAction)?.label}</span>
                    </p>
                    <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Executar ação →
                    </button>
                </motion.div>
            )}
        </div>
    )
}

export function TodayAgendaWidget() {
    const todayTasks = [
        {
            time: '14:30',
            title: 'Ligação Maria Silva',
            type: 'call',
            priority: 'high'
        },
        {
            time: '16:00',
            title: 'Visita João Carlos',
            type: 'visit',
            priority: 'high'
        },
        {
            time: '18:00',
            title: 'Assinatura contrato',
            type: 'meeting',
            priority: 'medium'
        }
    ]

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'call': return 'text-green-600 bg-green-100'
            case 'visit': return 'text-blue-600 bg-blue-100'
            case 'meeting': return 'text-purple-600 bg-purple-100'
            default: return 'text-gray-600 bg-gray-100'
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'call': return Phone
            case 'visit': return Building2
            case 'meeting': return Users
            default: return Calendar
        }
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Agenda Hoje</h3>
                <span className="text-sm text-gray-500">
                    {todayTasks.length} compromissos
                </span>
            </div>

            <div className="space-y-3">
                {todayTasks.map((task, index) => {
                    const Icon = getTypeIcon(task.type)
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-all cursor-pointer group"
                        >
                            <div className="text-sm font-mono text-gray-500 w-12">
                                {task.time}
                            </div>
                            <div className={`p-2 rounded-lg ${getTypeColor(task.type)}`}>
                                <Icon className="h-3 w-3" />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">{task.title}</div>
                                <div className={`text-xs ${task.priority === 'high' ? 'text-red-500' :
                                        task.priority === 'medium' ? 'text-yellow-500' :
                                            'text-gray-500'
                                    }`}>
                                    {task.priority === 'high' ? 'Alta prioridade' :
                                        task.priority === 'medium' ? 'Média prioridade' :
                                            'Baixa prioridade'}
                                </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </motion.div>
                    )
                })}
            </div>

            <button className="w-full mt-4 p-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                Ver agenda completa
            </button>
        </div>
    )
}
