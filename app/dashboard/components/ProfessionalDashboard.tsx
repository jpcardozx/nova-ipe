'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import { useRealtimeMetrics } from '@/app/hooks/useRealtimeMetrics'
import { useDashboardActions } from '@/app/hooks/useDashboardActions'
import { PerformanceIndicators } from '@/app/components/dashboard/PerformanceIndicators'
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
    Activity,
    Phone,
    Mail,
    MapPin,
    Eye,
    Heart,
    Share2,
    BarChart3,
    PieChart,
    TrendingDown,
    AlertTriangle,
    CheckCircle,
    Filter,
    Search,
    Download,
    Plus,
    MessageSquare,
    FileText,
    Calculator,
    Zap,
    RefreshCw
} from 'lucide-react'

interface ProfessionalDashboardProps {
    className?: string
}

// Utility functions
const getStatusColor = (status: string) => {
    switch (status) {
        case 'negotiation': return 'bg-orange-100 text-orange-800'
        case 'proposal': return 'bg-blue-100 text-blue-800'
        case 'qualified': return 'bg-green-100 text-green-800'
        case 'contacted': return 'bg-purple-100 text-purple-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'high': return 'bg-red-100 text-red-800'
        case 'medium': return 'bg-yellow-100 text-yellow-800'
        case 'low': return 'bg-green-100 text-green-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}

interface DashboardMetrics {
    // Vendas e Receita
    totalRevenue: number
    monthlyRevenue: number
    quarterlyRevenue: number
    averageTicket: number
    salesGoal: number
    salesGoalProgress: number

    // Propriedades e Inventário
    totalProperties: number
    activeListings: number
    soldThisMonth: number
    avgDaysOnMarket: number
    priceReductions: number
    exclusiveListings: number

    // Leads e Clientes
    totalLeads: number
    qualifiedLeads: number
    hotLeads: number
    conversionRate: number
    responseTime: number
    totalClients: number

    // Agendamentos e Visitas
    appointmentsToday: number
    appointmentsWeek: number
    visitConversionRate: number
    showingsCompleted: number

    // Performance e Avaliações
    avgRating: number
    totalReviews: number
    marketShare: number
    clientSatisfaction: number

    // Atividade e Produtividade
    callsMade: number
    emailsSent: number
    proposalsSent: number
    contractsSigned: number

    // Campanhas e Marketing
    activeCampaigns: number
    campaignROI: number
    leadCost: number
    digitalEngagement: number
}

interface LeadActivity {
    id: string
    name: string
    type: 'hot' | 'warm' | 'cold'
    property: string
    value: number
    lastContact: string
    source: string
    priority: 'high' | 'medium' | 'low'
    status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation'
}

interface PropertyPerformance {
    id: string
    address: string
    price: number
    views: number
    favorites: number
    shares: number
    inquiries: number
    visits: number
    daysOnMarket: number
    priceChange: number
    trend: 'up' | 'down' | 'stable'
}

interface UpcomingTask {
    id: string
    title: string
    type: 'call' | 'meeting' | 'document' | 'follow-up' | 'showing'
    time: string
    priority: 'high' | 'medium' | 'low'
    client?: string
    property?: string
    description: string
}

export default function ProfessionalDashboard({ className = '' }: ProfessionalDashboardProps) {
    const { user } = useCurrentUser()
    const { metrics, loading, lastUpdated, refreshMetrics } = useRealtimeMetrics()
    const { quickCall, quickWhatsApp, quickEmail } = useDashboardActions()
    const [leadActivity, setLeadActivity] = useState<LeadActivity[]>([])
    const [propertyPerformance, setPropertyPerformance] = useState<PropertyPerformance[]>([])
    const [upcomingTasks, setUpcomingTasks] = useState<UpcomingTask[]>([])
    const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'properties' | 'tasks'>('overview')

    useEffect(() => {
        loadDashboardData()
    }, [])

    const loadDashboardData = async () => {
        try {
            // Simulate API calls with realistic data
            await new Promise(resolve => setTimeout(resolve, 1200))

            setLeadActivity([
                {
                    id: '1',
                    name: 'Maria Silva Santos',
                    type: 'hot',
                    property: 'Cobertura Itaim Bibi',
                    value: 850000,
                    lastContact: '15 min',
                    source: 'WhatsApp',
                    priority: 'high',
                    status: 'negotiation'
                },
                {
                    id: '2',
                    name: 'João Carlos Oliveira',
                    type: 'warm',
                    property: 'Apartamento Vila Madalena',
                    value: 650000,
                    lastContact: '2h',
                    source: 'Site',
                    priority: 'high',
                    status: 'proposal'
                },
                {
                    id: '3',
                    name: 'Ana Paula Costa',
                    type: 'hot',
                    property: 'Casa Morumbi',
                    value: 1200000,
                    lastContact: '4h',
                    source: 'Indicação',
                    priority: 'high',
                    status: 'qualified'
                },
                {
                    id: '4',
                    name: 'Carlos Eduardo Lima',
                    type: 'warm',
                    property: 'Loft Pinheiros',
                    value: 450000,
                    lastContact: '1 dia',
                    source: 'Facebook',
                    priority: 'medium',
                    status: 'contacted'
                }
            ])

            setPropertyPerformance([
                {
                    id: '1',
                    address: 'Rua Augusta, 1200 - Consolação',
                    price: 850000,
                    views: 1250,
                    favorites: 45,
                    shares: 12,
                    inquiries: 23,
                    visits: 8,
                    daysOnMarket: 15,
                    priceChange: 0,
                    trend: 'up'
                },
                {
                    id: '2',
                    address: 'Av. Paulista, 2500 - Bela Vista',
                    price: 1200000,
                    views: 890,
                    favorites: 32,
                    shares: 8,
                    inquiries: 18,
                    visits: 12,
                    daysOnMarket: 8,
                    priceChange: -5,
                    trend: 'down'
                },
                {
                    id: '3',
                    address: 'Rua Oscar Freire, 800 - Jardins',
                    price: 2100000,
                    views: 2100,
                    favorites: 67,
                    shares: 25,
                    inquiries: 34,
                    visits: 15,
                    daysOnMarket: 22,
                    priceChange: 0,
                    trend: 'stable'
                }
            ])

            setUpcomingTasks([
                {
                    id: '1',
                    title: 'Ligação de follow-up',
                    type: 'call',
                    time: '14:30',
                    priority: 'high',
                    client: 'Maria Silva',
                    description: 'Retornar ligação sobre proposta da cobertura'
                },
                {
                    id: '2',
                    title: 'Visita técnica',
                    type: 'showing',
                    time: '16:00',
                    priority: 'high',
                    client: 'João Carlos',
                    property: 'Apt Vila Madalena',
                    description: 'Segunda visita com arquiteto'
                },
                {
                    id: '3',
                    title: 'Assinatura de contrato',
                    type: 'document',
                    time: '18:00',
                    priority: 'high',
                    client: 'Ana Paula',
                    description: 'Finalizar documentação da casa Morumbi'
                },
                {
                    id: '4',
                    title: 'Reunião com investidor',
                    type: 'meeting',
                    time: 'Amanhã 10:00',
                    priority: 'medium',
                    description: 'Apresentar portfólio de imóveis comerciais'
                }
            ])

        } catch (error) {
            console.error('Error loading dashboard data:', error)
        }
    }

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Bom dia'
        if (hour < 18) return 'Boa tarde'
        return 'Boa noite'
    }

    const getUserName = () => {
        return user?.user_metadata?.full_name?.split(' ')[0] ||
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

    const formatPercentage = (value: number) => {
        return `${value.toFixed(1)}%`
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'negotiation': return 'bg-red-100 text-red-800'
            case 'proposal': return 'bg-blue-100 text-blue-800'
            case 'qualified': return 'bg-green-100 text-green-800'
            case 'contacted': return 'bg-yellow-100 text-yellow-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-600'
            case 'medium': return 'text-yellow-600'
            case 'low': return 'text-green-600'
            default: return 'text-gray-600'
        }
    }

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-40 bg-gray-200 rounded-xl mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="h-96 bg-gray-200 rounded-xl"></div>
                        <div className="h-96 bg-gray-200 rounded-xl"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`p-6 ${className}`}>
            <div className="max-w-7xl mx-auto">
                {/* Enhanced Welcome Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-blue-800 via-purple-700 to-blue-800 rounded-2xl p-8 mb-8 text-white relative overflow-hidden w-auto"
                >
                    <div className="absolute inset-0 bg-black opacity-10"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold mb-2">
                                    {getGreeting()}, {getUserName()}! 🏠
                                </h1>
                                <p className="text-blue-100 mb-6 text-lg">
                                    Seu centro de comando imobiliário
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm"
                >
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all group">
                            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                <Plus className="h-5 w-5 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Novo Lead</span>
                        </button>

                        <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-all group">
                            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                                <Phone className="h-5 w-5 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Ligar</span>
                        </button>

                        <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-all group">
                            <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                                <Calendar className="h-5 w-5 text-purple-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Agendar</span>
                        </button>

                        <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-orange-50 hover:border-orange-300 transition-all group">
                            <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                                <Building2 className="h-5 w-5 text-orange-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Imóvel</span>
                        </button>

                        <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all group">
                            <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                                <Calculator className="h-5 w-5 text-indigo-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Simular</span>
                        </button>

                        <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-pink-50 hover:border-pink-300 transition-all group">
                            <div className="p-2 bg-pink-100 rounded-lg group-hover:bg-pink-200 transition-colors">
                                <MessageSquare className="h-5 w-5 text-pink-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">WhatsApp</span>
                        </button>
                    </div>
                </motion.div>

                {/* Navigation Tabs */}
                <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
                    {[
                        { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
                        { id: 'leads', label: 'Leads Ativos', icon: Users },
                        { id: 'properties', label: 'Performance Imóveis', icon: Building2 },
                        { id: 'tasks', label: 'Agenda', icon: Calendar }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === tab.id
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            {/* Primary Metrics Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <MetricCard
                                    title="Receita Mensal"
                                    value={formatCurrency(metrics?.monthlyRevenue || 0)}
                                    change="+15.3%"
                                    changeType="positive"
                                    icon={DollarSign}
                                    color="green"
                                />

                                <MetricCard
                                    title="Leads Qualificados"
                                    value={metrics?.qualifiedLeads?.toString() || '0'}
                                    change="+8 esta semana"
                                    changeType="positive"
                                    icon={Target}
                                    color="blue"
                                />

                                <MetricCard
                                    title="Imóveis Ativos"
                                    value={metrics?.activeListings?.toString() || '0'}
                                    change="3 novos hoje"
                                    changeType="neutral"
                                    icon={Building2}
                                    color="purple"
                                />

                                <MetricCard
                                    title="Ticket Médio"
                                    value={formatCurrency(metrics?.averageTicket || 0)}
                                    change="+12.5%"
                                    changeType="positive"
                                    icon={TrendingUp}
                                    color="orange"
                                />
                            </div>

                            {/* Secondary Metrics Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <MetricCard
                                    title="Agendamentos Hoje"
                                    value={metrics?.appointmentsToday?.toString() || '0'}
                                    change="próximo às 14:30"
                                    changeType="neutral"
                                    icon={Calendar}
                                    color="indigo"
                                />

                                <MetricCard
                                    title="Taxa de Conversão"
                                    value={formatPercentage(metrics?.conversionRate || 0)}
                                    change="+2.1% este mês"
                                    changeType="positive"
                                    icon={PieChart}
                                    color="teal"
                                />

                                <MetricCard
                                    title="Vendas no Mês"
                                    value={metrics?.soldThisMonth?.toString() || '0'}
                                    change="meta: 12"
                                    changeType="positive"
                                    icon={CheckCircle}
                                    color="emerald"
                                />

                                <MetricCard
                                    title="Tempo no Mercado"
                                    value={`${metrics?.avgDaysOnMarket || 0} dias`}
                                    change="-5 dias vs. mês anterior"
                                    changeType="positive"
                                    icon={Clock}
                                    color="rose"
                                />
                            </div>

                            {/* Charts and Analytics Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Revenue Chart Placeholder */}
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Performance de Vendas
                                        </h3>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg">
                                                30 dias
                                            </button>
                                            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                                                90 dias
                                            </button>
                                        </div>
                                    </div>

                                    <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                                        <div className="text-center">
                                            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600">Gráfico de Performance</p>
                                            <p className="text-sm text-gray-500">Integração com analytics em desenvolvimento</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Lead Funnel */}
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Funil de Vendas
                                        </h3>
                                        <Filter className="h-5 w-5 text-gray-400" />
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            { stage: 'Leads Totais', count: metrics?.totalLeads || 0, percentage: 100 },
                                            { stage: 'Qualificados', count: metrics?.qualifiedLeads || 0, percentage: 27 },
                                            { stage: 'Propostas', count: 15, percentage: 18 },
                                            { stage: 'Negociação', count: 8, percentage: 12 },
                                            { stage: 'Fechados', count: metrics?.soldThisMonth || 0, percentage: 8 }
                                        ].map((item, index) => (
                                            <div key={item.stage} className="flex items-center gap-4">
                                                <div className="w-24 text-sm font-medium text-gray-700">
                                                    {item.stage}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm text-gray-600">{item.count}</span>
                                                        <span className="text-sm text-gray-500">{item.percentage}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                                                            style={{ width: `${item.percentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'leads' && (
                        <motion.div
                            key="leads"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <LeadsManagement leads={leadActivity} />
                        </motion.div>
                    )}

                    {activeTab === 'properties' && (
                        <motion.div
                            key="properties"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <PropertyPerformanceView properties={propertyPerformance} />
                        </motion.div>
                    )}

                    {activeTab === 'tasks' && (
                        <motion.div
                            key="tasks"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <TasksAndSchedule tasks={upcomingTasks} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

// Metric Card Component
interface MetricCardProps {
    title: string
    value: string
    change: string
    changeType: 'positive' | 'negative' | 'neutral'
    icon: any
    color: string
}

function MetricCard({ title, value, change, changeType, icon: Icon, color }: MetricCardProps) {
    const getColorClasses = (color: string) => {
        const colorMap: Record<string, string> = {
            green: 'bg-green-500 text-white',
            blue: 'bg-blue-500 text-white',
            purple: 'bg-purple-500 text-white',
            orange: 'bg-orange-500 text-white',
            indigo: 'bg-indigo-500 text-white',
            teal: 'bg-teal-500 text-white',
            emerald: 'bg-emerald-500 text-white',
            rose: 'bg-rose-500 text-white'
        }
        return colorMap[color] || 'bg-gray-500 text-white'
    }

    const getChangeColor = (type: string) => {
        switch (type) {
            case 'positive': return 'text-green-600'
            case 'negative': return 'text-red-600'
            default: return 'text-gray-600'
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all p-6"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${getColorClasses(color)}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <span className="text-xs text-gray-500 font-medium">{title}</span>
            </div>

            <div className="text-2xl font-bold text-gray-900 mb-2">
                {value}
            </div>

            <div className={`text-sm font-medium ${getChangeColor(changeType)}`}>
                {change}
            </div>
        </motion.div>
    )
}

// Leads Management Component - Enhanced for Small Real Estate
function LeadsManagement({ leads }: { leads: LeadActivity[] }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Leads Ativos</h2>
                    <p className="text-gray-600">Gerencie seus leads prioritários</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Plus className="h-4 w-4" />
                        Novo Lead
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Filter className="h-4 w-4" />
                        Filtrar
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                {leads.map((lead, index) => (
                    <motion.div
                        key={lead.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${lead.type === 'hot' ? 'bg-red-500' :
                                    lead.type === 'warm' ? 'bg-yellow-500' :
                                        'bg-blue-500'
                                    }`}></div>
                                <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                                    {lead.status === 'negotiation' ? 'Negociação' :
                                        lead.status === 'proposal' ? 'Proposta' :
                                            lead.status === 'qualified' ? 'Qualificado' :
                                                lead.status === 'contacted' ? 'Contatado' : 'Novo'}
                                </span>
                            </div>
                            <div className="text-right">
                                <div className="text-xl font-bold text-green-600">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.value)}
                                </div>
                                <div className="text-sm text-gray-500">Valor potencial</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Imóvel de Interesse</div>
                                <div className="font-medium text-gray-900">{lead.property}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Último Contato</div>
                                <div className="font-medium text-gray-900">{lead.lastContact}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Origem</div>
                                <div className="font-medium text-gray-900">{lead.source}</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-1 px-3 py-1.5 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                                    <Phone className="h-3 w-3" />
                                    Ligar
                                </button>
                                <button className="flex items-center gap-1 px-3 py-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                    <MessageSquare className="h-3 w-3" />
                                    WhatsApp
                                </button>
                                <button className="flex items-center gap-1 px-3 py-1.5 text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                                    <Calendar className="h-3 w-3" />
                                    Agendar
                                </button>
                            </div>
                            <div className="flex items-center gap-1">
                                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                    <Mail className="h-4 w-4" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                    <FileText className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Stats for Leads */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">
                        {leads.filter(l => l.type === 'hot').length}
                    </div>
                    <div className="text-sm text-red-700">Leads Quentes</div>
                </div>
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                        {leads.filter(l => l.type === 'warm').length}
                    </div>
                    <div className="text-sm text-yellow-700">Leads Mornos</div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                        {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(leads.reduce((sum, lead) => sum + lead.value, 0))}
                    </div>
                    <div className="text-sm text-green-700">Valor Total</div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                        {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(Math.round(leads.reduce((sum, lead) => sum + lead.value, 0) / leads.length))}
                    </div>
                    <div className="text-sm text-blue-700">Ticket Médio</div>
                </div>
            </div>
        </div>
    )
}

// Property Performance Component
function PropertyPerformanceView({ properties }: { properties: PropertyPerformance[] }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Performance dos Imóveis</h2>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Download className="h-4 w-4" />
                        Exportar
                    </button>
                </div>
            </div>

            <div className="grid gap-6">
                {properties.map((property, index) => (
                    <motion.div
                        key={property.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-semibold text-gray-900">{property.address}</h3>
                                <p className="text-xl font-bold text-blue-600">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price)}
                                </p>
                            </div>
                            <div className={`flex items-center gap-1 ${property.trend === 'up' ? 'text-green-600' :
                                property.trend === 'down' ? 'text-red-600' :
                                    'text-gray-600'
                                }`}>
                                {property.trend === 'up' ? <TrendingUp className="h-4 w-4" /> :
                                    property.trend === 'down' ? <TrendingDown className="h-4 w-4" /> :
                                        <Activity className="h-4 w-4" />}
                                <span className="text-sm font-medium">{property.trend}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                            <div className="text-center">
                                <Eye className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                                <div className="text-lg font-semibold">{property.views}</div>
                                <div className="text-xs text-gray-500">Visualizações</div>
                            </div>

                            <div className="text-center">
                                <Heart className="h-5 w-5 text-red-400 mx-auto mb-1" />
                                <div className="text-lg font-semibold">{property.favorites}</div>
                                <div className="text-xs text-gray-500">Favoritos</div>
                            </div>

                            <div className="text-center">
                                <Share2 className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                                <div className="text-lg font-semibold">{property.shares}</div>
                                <div className="text-xs text-gray-500">Compartilhamentos</div>
                            </div>

                            <div className="text-center">
                                <MessageSquare className="h-5 w-5 text-green-400 mx-auto mb-1" />
                                <div className="text-lg font-semibold">{property.inquiries}</div>
                                <div className="text-xs text-gray-500">Consultas</div>
                            </div>

                            <div className="text-center">
                                <Calendar className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                                <div className="text-lg font-semibold">{property.visits}</div>
                                <div className="text-xs text-gray-500">Visitas</div>
                            </div>

                            <div className="text-center">
                                <Clock className="h-5 w-5 text-orange-400 mx-auto mb-1" />
                                <div className="text-lg font-semibold">{property.daysOnMarket}</div>
                                <div className="text-xs text-gray-500">Dias no Mercado</div>
                            </div>

                            <div className="text-center">
                                <TrendingUp className="h-5 w-5 text-indigo-400 mx-auto mb-1" />
                                <div className={`text-lg font-semibold ${property.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {property.priceChange}%
                                </div>
                                <div className="text-xs text-gray-500">Mudança Preço</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

// Tasks and Schedule Component
function TasksAndSchedule({ tasks }: { tasks: UpcomingTask[] }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Agenda de Hoje</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="h-4 w-4" />
                    Nova Tarefa
                </button>
            </div>

            <div className="grid gap-4">
                {tasks.map((task, index) => (
                    <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${task.type === 'call' ? 'bg-green-100 text-green-600' :
                                task.type === 'meeting' ? 'bg-blue-100 text-blue-600' :
                                    task.type === 'document' ? 'bg-purple-100 text-purple-600' :
                                        task.type === 'showing' ? 'bg-orange-100 text-orange-600' :
                                            'bg-gray-100 text-gray-600'
                                }`}>
                                {task.type === 'call' && <Phone className="h-5 w-5" />}
                                {task.type === 'meeting' && <Users className="h-5 w-5" />}
                                {task.type === 'document' && <FileText className="h-5 w-5" />}
                                {task.type === 'showing' && <Building2 className="h-5 w-5" />}
                                {task.type === 'follow-up' && <ArrowRight className="h-5 w-5" />}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                                    <span className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority).replace('text-', 'bg-')}`}></span>
                                </div>
                                <p className="text-gray-600 text-sm mb-1">{task.description}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {task.time}
                                    </span>
                                    {task.client && (
                                        <span className="flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            {task.client}
                                        </span>
                                    )}
                                    {task.property && (
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {task.property}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                                    <CheckCircle className="h-4 w-4" />
                                </button>
                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                    <Clock className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
