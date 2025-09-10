// app/dashboard/components/modules/analytics/QuickStats.tsx
'use client'

import { TrendingUp, TrendingDown, Users, Building2, DollarSign, Target } from 'lucide-react'

interface Stat {
    label: string
    value: string | number
    change?: number
    trend?: 'up' | 'down' | 'neutral'
    icon: React.ReactNode
    color: string
}

interface QuickStatsProps {
    stats: {
        totalClients: number
        newLeadsThisMonth: number
        activeProperties: number
        conversionRate: number
        averageTicket: number
        monthlyRevenue: number
    }
}

export function QuickStats({ stats }: QuickStatsProps) {
    const statsData: Stat[] = [
        {
            label: 'Total de Clientes',
            value: stats.totalClients,
            icon: <Users className="w-6 h-6" />,
            color: 'bg-blue-500',
            trend: 'up',
            change: 12
        },
        {
            label: 'Novos Leads (Mês)',
            value: stats.newLeadsThisMonth,
            icon: <Target className="w-6 h-6" />,
            color: 'bg-green-500',
            trend: 'up',
            change: 8
        },
        {
            label: 'Imóveis Ativos',
            value: stats.activeProperties,
            icon: <Building2 className="w-6 h-6" />,
            color: 'bg-orange-500',
            trend: 'neutral'
        },
        {
            label: 'Taxa de Conversão',
            value: `${stats.conversionRate}%`,
            icon: <TrendingUp className="w-6 h-6" />,
            color: 'bg-purple-500',
            trend: 'up',
            change: 3.2
        },
        {
            label: 'Ticket Médio',
            value: `R$ ${stats.averageTicket.toLocaleString()}`,
            icon: <DollarSign className="w-6 h-6" />,
            color: 'bg-emerald-500',
            trend: 'up',
            change: 15
        },
        {
            label: 'Receita Mensal',
            value: `R$ ${stats.monthlyRevenue.toLocaleString()}`,
            icon: <DollarSign className="w-6 h-6" />,
            color: 'bg-indigo-500',
            trend: 'up',
            change: 22
        }
    ]

    const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
        switch (trend) {
            case 'up':
                return <TrendingUp className="w-4 h-4 text-green-500" />
            case 'down':
                return <TrendingDown className="w-4 h-4 text-red-500" />
            default:
                return null
        }
    }

    const getTrendColor = (trend?: 'up' | 'down' | 'neutral') => {
        switch (trend) {
            case 'up':
                return 'text-green-600 bg-green-50'
            case 'down':
                return 'text-red-600 bg-red-50'
            default:
                return 'text-gray-600 bg-gray-50'
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statsData.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`p-2 rounded-lg ${stat.color} text-white`}>
                                    {stat.icon}
                                </div>
                                <h3 className="text-sm font-medium text-gray-600">{stat.label}</h3>
                            </div>

                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                                {stat.change && stat.trend && (
                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(stat.trend)}`}>
                                        {getTrendIcon(stat.trend)}
                                        <span>{stat.change > 0 ? '+' : ''}{stat.change}%</span>
                                    </div>
                                )}
                            </div>

                            {stat.change && (
                                <p className="text-xs text-gray-500 mt-1">
                                    {stat.trend === 'up' ? 'Aumento' : stat.trend === 'down' ? 'Diminuição' : 'Estável'} em relação ao mês anterior
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
