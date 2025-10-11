'use client'

import { useState, useEffect } from 'react'
import {
    Activity,
    TrendingUp,
    TrendingDown,
    BarChart3,
    Users,
    Building2,
    DollarSign,
    Calendar,
    Target,
    Eye,
    Phone,
    Mail
} from 'lucide-react'

interface PerformanceMetrics {
    totalViews: number
    totalLeads: number
    totalSales: number
    conversionRate: number
    avgResponseTime: number
    satisfaction: number
}

interface ChartData {
    month: string
    views: number
    leads: number
    sales: number
}

export default function AnalyticsPage() {
    const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
    const [chartData, setChartData] = useState<ChartData[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

    useEffect(() => {
        loadAnalytics()
    }, [selectedPeriod])

    const loadAnalytics = async () => {
        setLoading(true)
        try {
            // Simulate loading
            await new Promise(resolve => setTimeout(resolve, 1000))

            setMetrics({
                totalViews: 12458,
                totalLeads: 234,
                totalSales: 18,
                conversionRate: 7.69,
                avgResponseTime: 2.4,
                satisfaction: 4.7
            })

            setChartData([
                { month: 'Jan', views: 1200, leads: 45, sales: 3 },
                { month: 'Fev', views: 1850, leads: 52, sales: 4 },
                { month: 'Mar', views: 2100, leads: 68, sales: 5 },
                { month: 'Abr', views: 1650, leads: 41, sales: 2 },
                { month: 'Mai', views: 2400, leads: 78, sales: 6 },
                { month: 'Jun', views: 2850, leads: 89, sales: 8 }
            ])
        } catch (error) {
            console.error('Error loading analytics:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Carregando analytics...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <Activity className="h-7 w-7 text-amber-600" />
                            Performance & Analytics
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Acompanhe o desempenho e métricas do seu negócio
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value as any)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        >
                            <option value="7d">Últimos 7 dias</option>
                            <option value="30d">Últimos 30 dias</option>
                            <option value="90d">Últimos 90 dias</option>
                            <option value="1y">Último ano</option>
                        </select>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <Eye className="h-8 w-8 text-blue-600" />
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {metrics?.totalViews.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Total de Visualizações</div>
                        <div className="text-xs text-green-600 mt-2">+12.5% vs período anterior</div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <Users className="h-8 w-8 text-purple-600" />
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {metrics?.totalLeads}
                        </div>
                        <div className="text-sm text-gray-600">Leads Gerados</div>
                        <div className="text-xs text-green-600 mt-2">+8.3% vs período anterior</div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <DollarSign className="h-8 w-8 text-green-600" />
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {metrics?.totalSales}
                        </div>
                        <div className="text-sm text-gray-600">Vendas Fechadas</div>
                        <div className="text-xs text-green-600 mt-2">+15.2% vs período anterior</div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <Target className="h-8 w-8 text-orange-600" />
                            <TrendingDown className="h-4 w-4 text-red-500" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {metrics?.conversionRate}%
                        </div>
                        <div className="text-sm text-gray-600">Taxa de Conversão</div>
                        <div className="text-xs text-red-600 mt-2">-2.1% vs período anterior</div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <Phone className="h-8 w-8 text-blue-600" />
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {metrics?.avgResponseTime}h
                        </div>
                        <div className="text-sm text-gray-600">Tempo Médio Resposta</div>
                        <div className="text-xs text-green-600 mt-2">-18% vs período anterior</div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <Activity className="h-8 w-8 text-yellow-600" />
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {metrics?.satisfaction}/5
                        </div>
                        <div className="text-sm text-gray-600">Satisfação Média</div>
                        <div className="text-xs text-green-600 mt-2">+0.3 vs período anterior</div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Leads & Sales Chart */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-amber-600" />
                            Leads vs Vendas
                        </h3>

                        <div className="space-y-4">
                            {chartData.map((data, index) => (
                                <div key={data.month} className="flex items-center gap-4">
                                    <div className="w-12 text-sm text-gray-600 font-medium">
                                        {data.month}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span className="text-xs text-gray-600">Leads: {data.leads}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full"
                                                style={{ width: `${(data.leads / 100) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span className="text-xs text-gray-600">Vendas: {data.sales}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-green-500 h-2 rounded-full"
                                                style={{ width: `${(data.sales / 10) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Sources */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <Target className="h-5 w-5 text-amber-600" />
                            Principais Fontes de Lead
                        </h3>

                        <div className="space-y-4">
                            {[
                                { source: 'Site - Catálogo', leads: 89, percentage: 38 },
                                { source: 'WhatsApp', leads: 67, percentage: 29 },
                                { source: 'Instagram', leads: 45, percentage: 19 },
                                { source: 'Indicação', leads: 33, percentage: 14 }
                            ].map((item) => (
                                <div key={item.source} className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-900">
                                                {item.source}
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                {item.leads} leads
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-amber-600 h-2 rounded-full"
                                                style={{ width: `${item.percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Performance Insights */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-amber-600" />
                        Insights de Performance
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="h-4 w-4 text-green-600" />
                                <span className="font-medium text-green-900">Excelente</span>
                            </div>
                            <p className="text-sm text-green-800">
                                Taxa de conversão de WhatsApp está 23% acima da média do setor
                            </p>
                        </div>

                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="h-4 w-4 text-yellow-600" />
                                <span className="font-medium text-yellow-900">Atenção</span>
                            </div>
                            <p className="text-sm text-yellow-800">
                                Tempo de resposta aos leads pode ser melhorado
                            </p>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                                <Building2 className="h-4 w-4 text-blue-600" />
                                <span className="font-medium text-blue-900">Oportunidade</span>
                            </div>
                            <p className="text-sm text-blue-800">
                                Imóveis de alto padrão têm maior taxa de conversão
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
