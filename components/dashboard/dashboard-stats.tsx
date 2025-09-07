'use client'

import { motion } from 'framer-motion'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, CheckCircle, Eye, Target, TrendingUp, Activity, Star } from 'lucide-react'

interface DashboardStats {
    totalProperties: number
    activeListings: number
    pendingRequests: number
    recentActivity: number
    monthlyViews: number
    conversionRate: number
    avgResponseTime: string
    customerSatisfaction: number
}

interface DashboardStatsProps {
    stats: DashboardStats
}

export function DashboardStatsGrid({ stats }: DashboardStatsProps) {
    const statsCards = [
        {
            title: 'Total de Imóveis',
            value: stats.totalProperties,
            icon: Building2,
            color: 'blue',
            trend: '+12% este mês',
            trendIcon: TrendingUp
        },
        {
            title: 'Anúncios Ativos',
            value: stats.activeListings,
            icon: CheckCircle,
            color: 'green',
            trend: `${Math.round((stats.activeListings / stats.totalProperties) * 100)}% do total`,
            trendIcon: Activity
        },
        {
            title: 'Visualizações',
            value: stats.monthlyViews.toLocaleString(),
            icon: Eye,
            color: 'orange',
            trend: 'Este mês',
            trendIcon: TrendingUp
        },
        {
            title: 'Taxa de Conversão',
            value: `${stats.conversionRate}%`,
            icon: Target,
            color: 'purple',
            trend: 'Acima da média',
            trendIcon: Star
        }
    ]

    const getColorClasses = (color: string) => {
        const colorMap = {
            blue: {
                bg: 'from-blue-50 to-blue-100',
                border: 'border-blue-200',
                text: 'text-blue-800',
                icon: 'text-blue-600',
                value: 'text-blue-900',
                trend: 'text-blue-600',
                accent: 'bg-blue-500/10'
            },
            green: {
                bg: 'from-green-50 to-green-100',
                border: 'border-green-200',
                text: 'text-green-800',
                icon: 'text-green-600',
                value: 'text-green-900',
                trend: 'text-green-600',
                accent: 'bg-green-500/10'
            },
            orange: {
                bg: 'from-orange-50 to-orange-100',
                border: 'border-orange-200',
                text: 'text-orange-800',
                icon: 'text-orange-600',
                value: 'text-orange-900',
                trend: 'text-orange-600',
                accent: 'bg-orange-500/10'
            },
            purple: {
                bg: 'from-purple-50 to-purple-100',
                border: 'border-purple-200',
                text: 'text-purple-800',
                icon: 'text-purple-600',
                value: 'text-purple-900',
                trend: 'text-purple-600',
                accent: 'bg-purple-500/10'
            }
        }
        return colorMap[color as keyof typeof colorMap]
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
            {statsCards.map((stat, index) => {
                const colors = getColorClasses(stat.color)
                const IconComponent = stat.icon
                const TrendIconComponent = stat.trendIcon

                return (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.1 }}
                    >
                        <Card className={`relative overflow-hidden bg-gradient-to-br ${colors.bg} ${colors.border} hover:shadow-lg transition-all duration-300 group`}>
                            <div className={`absolute top-0 right-0 w-20 h-20 ${colors.accent} rounded-full -mr-10 -mt-10`}></div>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className={`text-sm font-medium ${colors.text}`}>
                                    {stat.title}
                                </CardTitle>
                                <IconComponent className={`h-5 w-5 ${colors.icon} group-hover:scale-110 transition-transform`} />
                            </CardHeader>
                            <CardContent>
                                <div className={`text-3xl font-bold ${colors.value} mb-1`}>
                                    {stat.value}
                                </div>
                                <p className={`text-xs ${colors.trend} flex items-center`}>
                                    <TrendIconComponent className="h-3 w-3 mr-1" />
                                    {stat.trend}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )
            })}
        </motion.div>
    )
}