'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import { useRealtimeMetrics } from '@/app/hooks/useRealtimeMetrics'
import { useDashboardActions } from '@/app/hooks/useDashboardActions'
import { PerformanceIndicators } from '@/app/components/dashboard/PerformanceIndicators'
import { NotificationCenter } from '@/app/components/dashboard/NotificationCenter'
import { QuickStatsWidget, QuickActionsWidget, TodayAgendaWidget } from '@/app/components/dashboard/QuickWidgets'
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
            await new Promise(resolve => setTimeout(resolve, 800))

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

    const handleMetricClick = (metricId: string) => {
        // Aqui você pode implementar ações específicas para cada métrica
        console.log('Metric clicked:', metricId)
    }

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-40 bg-gray-200 rounded-xl mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                        ))}
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
                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 mb-8 text-white relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-black opacity-10"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold mb-2">
                                    {getGreeting()}, {getUserName()}! 🏠
                                </h1>
                                <p className="text-blue-100 mb-4 text-lg">
                                    Seu centro de comando imobiliário
                                </p>

                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-blue-200">
                                        Última atualização: {lastUpdated?.toLocaleTimeString('pt-BR')}
                                    </span>
                                    <button
                                        onClick={refreshMetrics}
                                        className="flex items-center gap-1 px-3 py-1 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                                    >
                                        <RefreshCw className="h-3 w-3" />
                                        Atualizar
                                    </button>
                                </div>
                            </div>

                            <div className="hidden lg:block ml-8">
                                <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                    <BarChart3 className="h-16 w-16 text-white" />
                                </div>
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

                        <button
                            onClick={() => quickCall('11999999999')}
                            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-all group"
                        >
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

                        <button
                            onClick={() => quickWhatsApp('11999999999', 'Olá! Vi seu interesse em imóveis.')}
                            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-pink-50 hover:border-pink-300 transition-all group"
                        >
                            <div className="p-2 bg-pink-100 rounded-lg group-hover:bg-pink-200 transition-colors">
                                <MessageSquare className="h-5 w-5 text-pink-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">WhatsApp</span>
                        </button>
                    </div>
                </motion.div>

                {/* Performance Indicators */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                >
                    <PerformanceIndicators
                        metrics={metrics}
                        onMetricClick={handleMetricClick}
                    />
                </motion.div>

                {/* Navigation Tabs */}
                <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
                    {[
                        { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
                        { id: 'leads', label: 'Leads Ativos', icon: Users },
                        { id: 'properties', label: 'Imóveis', icon: Building2 },
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

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <OverviewTab metrics={metrics} />
                                </div>
                                <div className="space-y-6">
                                    <QuickStatsWidget metrics={metrics} />
                                    <QuickActionsWidget />
                                    <TodayAgendaWidget />
                                </div>
                            </div>
                        )}
                        {activeTab === 'leads' && <LeadsManagement leads={leadActivity} />}
                        {activeTab === 'properties' && <PropertyPerformance properties={propertyPerformance} />}
                        {activeTab === 'tasks' && <TasksAndSchedule tasks={upcomingTasks} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

// Overview Tab Component
function OverviewTab({ metrics }: { metrics: any }) {
    if (!metrics) return null

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value)
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Receita Mensal</h3>
                    </div>
                    <div className="text-2xl font-bold text-green-600 mb-1">
                        {formatCurrency(metrics.monthlyRevenue)}
                    </div>
                    <div className="text-sm text-gray-500">
                        Meta: {formatCurrency(metrics.salesGoal)}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Imóveis Ativos</h3>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                        {metrics.activeListings}
                    </div>
                    <div className="text-sm text-gray-500">
                        {metrics.totalProperties} no portfólio
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Users className="h-5 w-5 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Leads Ativos</h3>
                    </div>
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                        {metrics.totalLeads}
                    </div>
                    <div className="text-sm text-gray-500">
                        {metrics.hotLeads} leads quentes
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Calendar className="h-5 w-5 text-orange-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Agenda Hoje</h3>
                    </div>
                    <div className="text-2xl font-bold text-orange-600 mb-1">
                        {metrics.appointmentsToday}
                    </div>
                    <div className="text-sm text-gray-500">
                        {metrics.appointmentsWeek} esta semana
                    </div>
                </div>
            </div>
        </div>
    )
}

// Leads Management Component
function LeadsManagement({ leads }: { leads: LeadActivity[] }) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'negotiation': return 'bg-red-100 text-red-800'
            case 'proposal': return 'bg-blue-100 text-blue-800'
            case 'qualified': return 'bg-green-100 text-green-800'
            case 'contacted': return 'bg-yellow-100 text-yellow-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

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
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

// Property Performance Component
function PropertyPerformance({ properties }: { properties: PropertyPerformance[] }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Performance dos Imóveis</h2>
            </div>

            <div className="grid gap-6">
                {properties.map((property, index) => (
                    <motion.div
                        key={property.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl border border-gray-200 p-6"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{property.address}</h3>
                                <div className="text-2xl font-bold text-green-600 mt-1">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price)}
                                </div>
                            </div>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${property.trend === 'up' ? 'bg-green-100 text-green-800' :
                                property.trend === 'down' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                {property.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                                {property.trend === 'down' && <TrendingDown className="h-3 w-3" />}
                                {property.trend === 'stable' && <Activity className="h-3 w-3" />}
                                {property.trend}
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
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-600'
            case 'medium': return 'text-yellow-600'
            case 'low': return 'text-green-600'
            default: return 'text-gray-600'
        }
    }

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
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
