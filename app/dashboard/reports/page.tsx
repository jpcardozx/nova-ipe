'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Building2,
    Users,
    Calendar,
    Download,
    Filter,
    RefreshCw,
    Eye,
    FileText,
    PieChart,
    Activity
} from 'lucide-react'

interface ReportData {
    period: string
    sales_count: number
    sales_value: number
    rentals_count: number
    rentals_value: number
    new_clients: number
    appointments: number
    conversion_rate: number
    average_deal_size: number
}

export default function ReportsPage() {
    const { user } = useCurrentUser()
    const [reportData, setReportData] = useState<ReportData[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month')

    useEffect(() => {
        loadReportData()
    }, [selectedPeriod])

    const loadReportData = async () => {
        try {
            // Simulando dados de relatório
            const mockData: ReportData[] = [
                {
                    period: '2025-01',
                    sales_count: 12,
                    sales_value: 18500000,
                    rentals_count: 8,
                    rentals_value: 45000,
                    new_clients: 23,
                    appointments: 45,
                    conversion_rate: 26.7,
                    average_deal_size: 1541667
                },
                {
                    period: '2024-12',
                    sales_count: 15,
                    sales_value: 22300000,
                    rentals_count: 12,
                    rentals_value: 58000,
                    new_clients: 31,
                    appointments: 52,
                    conversion_rate: 28.8,
                    average_deal_size: 1486667
                },
                {
                    period: '2024-11',
                    sales_count: 10,
                    sales_value: 14200000,
                    rentals_count: 15,
                    rentals_value: 72000,
                    new_clients: 28,
                    appointments: 38,
                    conversion_rate: 26.3,
                    average_deal_size: 1420000
                }
            ]

            setReportData(mockData)
        } catch (error) {
            console.error('Error loading report data:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value)
    }

    const currentPeriod = reportData[0]
    const previousPeriod = reportData[1]

    const getPercentageChange = (current: number, previous: number) => {
        if (!previous) return 0
        return ((current - previous) / previous) * 100
    }

    const reportCards = [
        {
            title: 'Vendas Realizadas',
            value: currentPeriod?.sales_count || 0,
            change: getPercentageChange(currentPeriod?.sales_count || 0, previousPeriod?.sales_count || 0),
            icon: Building2,
            color: 'bg-blue-500'
        },
        {
            title: 'Volume de Vendas',
            value: formatCurrency(currentPeriod?.sales_value || 0),
            change: getPercentageChange(currentPeriod?.sales_value || 0, previousPeriod?.sales_value || 0),
            icon: DollarSign,
            color: 'bg-green-500'
        },
        {
            title: 'Novos Clientes',
            value: currentPeriod?.new_clients || 0,
            change: getPercentageChange(currentPeriod?.new_clients || 0, previousPeriod?.new_clients || 0),
            icon: Users,
            color: 'bg-purple-500'
        },
        {
            title: 'Taxa de Conversão',
            value: `${currentPeriod?.conversion_rate || 0}%`,
            change: getPercentageChange(currentPeriod?.conversion_rate || 0, previousPeriod?.conversion_rate || 0),
            icon: TrendingUp,
            color: 'bg-orange-500'
        }
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando relatórios...</p>
                </div>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
                    <p className="text-gray-600">Análise de desempenho e métricas</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                        <option value="week">Esta Semana</option>
                        <option value="month">Este Mês</option>
                        <option value="quarter">Este Trimestre</option>
                        <option value="year">Este Ano</option>
                    </select>
                    
                    <button
                        onClick={loadReportData}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Atualizar
                    </button>
                    
                    <button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:from-amber-600 hover:to-amber-700 transition-all">
                        <Download className="h-4 w-4" />
                        Exportar
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {reportCards.map((card, index) => {
                    const IconComponent = card.icon
                    const isPositive = card.change >= 0
                    
                    return (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-600 mb-1">
                                        {card.title}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 mb-2">
                                        {card.value}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        {isPositive ? (
                                            <TrendingUp className="h-4 w-4 text-green-600" />
                                        ) : (
                                            <TrendingDown className="h-4 w-4 text-red-600" />
                                        )}
                                        <span className={`text-sm font-medium ${
                                            isPositive ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {isPositive ? '+' : ''}{card.change.toFixed(1)}%
                                        </span>
                                        <span className="text-sm text-gray-500">vs mês anterior</span>
                                    </div>
                                </div>
                                
                                <div className={`p-3 ${card.color} rounded-xl`}>
                                    <IconComponent className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Chart */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Vendas por Período</h3>
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-gray-400" />
                            <button className="p-1 hover:bg-gray-100 rounded">
                                <Eye className="h-4 w-4 text-gray-400" />
                            </button>
                        </div>
                    </div>
                    
                    {/* Simulated chart area */}
                    <div className="h-64 bg-gradient-to-t from-amber-50 to-white rounded-lg border-2 border-dashed border-amber-200 flex items-center justify-center">
                        <div className="text-center">
                            <BarChart3 className="h-12 w-12 text-amber-300 mx-auto mb-2" />
                            <p className="text-amber-600 font-medium">Gráfico de Vendas</p>
                            <p className="text-sm text-gray-500">Integração com biblioteca de gráficos</p>
                        </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{reportData.reduce((acc, item) => acc + item.sales_count, 0)}</p>
                            <p className="text-sm text-gray-500">Total Vendas</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{reportData.reduce((acc, item) => acc + item.rentals_count, 0)}</p>
                            <p className="text-sm text-gray-500">Total Aluguéis</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{reportData.reduce((acc, item) => acc + item.appointments, 0)}</p>
                            <p className="text-sm text-gray-500">Agendamentos</p>
                        </div>
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Receita por Categoria</h3>
                        <div className="flex items-center gap-2">
                            <PieChart className="h-5 w-5 text-gray-400" />
                            <button className="p-1 hover:bg-gray-100 rounded">
                                <Eye className="h-4 w-4 text-gray-400" />
                            </button>
                        </div>
                    </div>
                    
                    {/* Simulated pie chart area */}
                    <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-blue-200 flex items-center justify-center">
                        <div className="text-center">
                            <PieChart className="h-12 w-12 text-blue-300 mx-auto mb-2" />
                            <p className="text-blue-600 font-medium">Gráfico de Receita</p>
                            <p className="text-sm text-gray-500">Distribuição por tipo</p>
                        </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">Vendas</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">78.5%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">Aluguéis</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">21.5%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Desempenho Mensal</h3>
                        <div className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-gray-400" />
                            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                Ver Detalhes
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Período
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vendas
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Volume
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aluguéis
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Novos Clientes
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Conversão
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ticket Médio
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {reportData.map((period, index) => (
                                <motion.tr
                                    key={period.period}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {new Date(period.period + '-01').toLocaleDateString('pt-BR', { 
                                            month: 'long', 
                                            year: 'numeric' 
                                        })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {period.sales_count}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatCurrency(period.sales_value)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {period.rentals_count}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {period.new_clients}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {period.conversion_rate}%
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatCurrency(period.average_deal_size)}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-gray-900">Relatório Detalhado</p>
                            <p className="text-sm text-gray-500">Gerar PDF completo</p>
                        </div>
                    </div>
                </button>

                <button className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Download className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-gray-900">Exportar Dados</p>
                            <p className="text-sm text-gray-500">CSV, Excel ou JSON</p>
                        </div>
                    </div>
                </button>

                <button className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Calendar className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-gray-900">Agendar Relatório</p>
                            <p className="text-sm text-gray-500">Envio automático por email</p>
                        </div>
                    </div>
                </button>
            </div>
        </motion.div>
    )
}