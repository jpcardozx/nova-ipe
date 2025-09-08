'use client'

import { motion } from 'framer-motion'
import {
    TrendingUp,
    TrendingDown,
    Target,
    Clock,
    Phone,
    Users,
    Building2,
    DollarSign,
    Calendar,
    Star,
    Zap,
    Activity
} from 'lucide-react'

interface MetricCardProps {
    title: string
    value: string | number
    subtitle?: string
    trend?: {
        direction: 'up' | 'down' | 'stable'
        value: number
        label?: string
    }
    icon: React.ComponentType<{ className?: string }>
    color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo'
    progress?: number
    onClick?: () => void
}

const colorClasses = {
    blue: {
        bg: 'from-blue-500 to-blue-600',
        light: 'from-blue-50 to-blue-100',
        text: 'text-blue-600',
        icon: 'text-blue-500'
    },
    green: {
        bg: 'from-green-500 to-green-600',
        light: 'from-green-50 to-green-100',
        text: 'text-green-600',
        icon: 'text-green-500'
    },
    purple: {
        bg: 'from-purple-500 to-purple-600',
        light: 'from-purple-50 to-purple-100',
        text: 'text-purple-600',
        icon: 'text-purple-500'
    },
    orange: {
        bg: 'from-orange-500 to-orange-600',
        light: 'from-orange-50 to-orange-100',
        text: 'text-orange-600',
        icon: 'text-orange-500'
    },
    red: {
        bg: 'from-red-500 to-red-600',
        light: 'from-red-50 to-red-100',
        text: 'text-red-600',
        icon: 'text-red-500'
    },
    indigo: {
        bg: 'from-indigo-500 to-indigo-600',
        light: 'from-indigo-50 to-indigo-100',
        text: 'text-indigo-600',
        icon: 'text-indigo-500'
    }
}

export function MetricCard({
    title,
    value,
    subtitle,
    trend,
    icon: Icon,
    color,
    progress,
    onClick
}: MetricCardProps) {
    const colors = colorClasses[color]

    return (
        <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`
        bg-gradient-to-br ${colors.light} 
        rounded-xl p-6 border border-gray-200 
        hover:shadow-lg transition-all duration-200
        ${onClick ? 'cursor-pointer' : ''}
      `}
            onClick={onClick}
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${colors.bg}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>

                {trend && (
                    <div className={`flex items-center gap-1 ${trend.direction === 'up' ? 'text-green-600' :
                            trend.direction === 'down' ? 'text-red-600' :
                                'text-gray-600'
                        }`}>
                        {trend.direction === 'up' && <TrendingUp className="h-4 w-4" />}
                        {trend.direction === 'down' && <TrendingDown className="h-4 w-4" />}
                        <span className="text-sm font-medium">
                            {trend.direction !== 'stable' && `${trend.value.toFixed(1)}%`}
                        </span>
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-600">{title}</h3>
                <div className={`text-2xl font-bold ${colors.text}`}>
                    {typeof value === 'number' && value > 999
                        ? new Intl.NumberFormat('pt-BR', {
                            notation: 'compact',
                            compactDisplay: 'short'
                        }).format(value)
                        : value
                    }
                </div>

                {subtitle && (
                    <p className="text-sm text-gray-500">{subtitle}</p>
                )}

                {progress !== undefined && (
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Progresso</span>
                            <span>{progress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full bg-gradient-to-r ${colors.bg} transition-all duration-500`}
                                style={{ width: `${Math.min(100, progress)}%` }}
                            />
                        </div>
                    </div>
                )}

                {trend?.label && (
                    <p className="text-xs text-gray-500">{trend.label}</p>
                )}
            </div>
        </motion.div>
    )
}

interface PerformanceIndicatorsProps {
    metrics: any
    onMetricClick?: (metric: string) => void
}

export function PerformanceIndicators({ metrics, onMetricClick }: PerformanceIndicatorsProps) {
    if (!metrics) return null

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value)
    }

    const indicators = [
        {
            id: 'sales-goal',
            title: 'Meta Mensal',
            value: `${metrics.salesGoalProgress.toFixed(1)}%`,
            subtitle: `${formatCurrency(metrics.monthlyRevenue)} de ${formatCurrency(metrics.salesGoal)}`,
            icon: Target,
            color: 'green' as const,
            progress: metrics.salesGoalProgress,
            trend: {
                direction: (metrics.salesGoalProgress >= 90 ? 'up' : 'stable') as 'up' | 'down' | 'stable',
                value: metrics.salesGoalProgress >= 90 ? 5.2 : 0,
                label: metrics.salesGoalProgress >= 90 ? 'Excelente!' : 'Falta pouco!'
            }
        },
        {
            id: 'hot-leads',
            title: 'Leads Quentes',
            value: metrics.hotLeads,
            subtitle: `${metrics.totalLeads} leads totais`,
            icon: Zap,
            color: 'red' as const,
            trend: {
                direction: 'up' as const,
                value: 12.5,
                label: 'Concentre-se neles!'
            }
        },
        {
            id: 'appointments',
            title: 'Agendamentos Hoje',
            value: metrics.appointmentsToday,
            subtitle: `${metrics.appointmentsWeek} esta semana`,
            icon: Calendar,
            color: 'purple' as const,
            trend: {
                direction: 'stable' as const,
                value: 0,
                label: 'Organize bem seu tempo'
            }
        },
        {
            id: 'response-time',
            title: 'Tempo Resposta',
            value: `${metrics.responseTime}min`,
            subtitle: 'Média de retorno',
            icon: Clock,
            color: 'orange' as const,
            trend: {
                direction: (metrics.responseTime <= 15 ? 'up' : 'down') as 'up' | 'down' | 'stable',
                value: metrics.responseTime <= 15 ? 8.3 : -5.2,
                label: metrics.responseTime <= 15 ? 'Muito bom!' : 'Tente ser mais rápido'
            }
        },
        {
            id: 'conversion',
            title: 'Taxa Conversão',
            value: `${metrics.conversionRate.toFixed(1)}%`,
            subtitle: 'Leads para vendas',
            icon: Activity,
            color: 'indigo' as const,
            trend: {
                direction: 'up' as const,
                value: 3.1,
                label: 'Melhorando!'
            }
        },
        {
            id: 'rating',
            title: 'Avaliação',
            value: `${metrics.avgRating}/5.0`,
            subtitle: `${metrics.totalReviews} avaliações`,
            icon: Star,
            color: 'blue' as const,
            progress: (metrics.avgRating / 5) * 100,
            trend: {
                direction: 'up' as const,
                value: 2.1,
                label: 'Clientes satisfeitos!'
            }
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {indicators.map((indicator, index) => (
                <motion.div
                    key={indicator.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <MetricCard
                        {...indicator}
                        onClick={() => onMetricClick?.(indicator.id)}
                    />
                </motion.div>
            ))}
        </div>
    )
}
