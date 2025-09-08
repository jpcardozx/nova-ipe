'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import {
    TrendingUp, Users, Building2, Calendar, Target, DollarSign, Star, Clock,
    ArrowRight, Bell, Phone, Mail, MessageSquare, FileText, Calculator, Zap,
    Plus, Filter, Eye, Heart, Share2, CheckCircle, AlertTriangle, RefreshCw,
    BarChart3, PieChart, MapPin, TrendingDown, Activity, Search, Settings
} from 'lucide-react'

// Interfaces
interface DashboardMetrics {
    totalRevenue: number
    monthlyRevenue: number
    salesGoal: number
    salesGoalProgress: number
    totalProperties: number
    activeListings: number
    soldThisMonth: number
    avgDaysOnMarket: number
    totalLeads: number
    qualifiedLeads: number
    hotLeads: number
    conversionRate: number
    responseTime: number
    appointmentsToday: number
    appointmentsWeek: number
    avgRating: number
    totalReviews: number
    callsMade: number
    emailsSent: number
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
    phone: string
    email: string
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
    completed: boolean
}

export default function ProfessionalDashboard() {
    const { user } = useCurrentUser()
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
    const [leadActivity, setLeadActivity] = useState<LeadActivity[]>([])
    const [propertyPerformance, setPropertyPerformance] = useState<PropertyPerformance[]>([])
    const [upcomingTasks, setUpcomingTasks] = useState<UpcomingTask[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'properties' | 'tasks'>('overview')
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        loadDashboardData()
    }, [])

    const loadDashboardData = async () => {
        setRefreshing(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 800))

            // Métricas realistas para pequena imobiliária
            setMetrics({
                totalRevenue: 2450000,
                monthlyRevenue: 185000,
                salesGoal: 200000,
                salesGoalProgress: 92.5,
                totalProperties: 45,
                activeListings: 28,
                soldThisMonth: 3,
                avgDaysOnMarket: 45,
                totalLeads: 67,
                qualifiedLeads: 23,
                hotLeads: 8,
                conversionRate: 12.5,
                responseTime: 15,
                appointmentsToday: 4,
                appointmentsWeek: 12,
                avgRating: 4.7,
                totalReviews: 89,
                callsMade: 34,
                emailsSent: 78
            })

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
                    status: 'negotiation',
                    phone: '11999887766',
                    email: 'maria.silva@email.com'
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
                    status: 'proposal',
                    phone: '11988776655',
                    email: 'joao.carlos@email.com'
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
                    status: 'qualified',
                    phone: '11977665544',
                    email: 'ana.paula@email.com'
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
                    description: 'Retornar ligação sobre proposta da cobertura',
                    completed: false
                },
                {
                    id: '2',
                    title: 'Visita técnica',
                    type: 'showing',
                    time: '16:00',
                    priority: 'high',
                    client: 'João Carlos',
                    property: 'Apt Vila Madalena',
                    description: 'Segunda visita com arquiteto',
                    completed: false
                }
            ])

        } catch (error) {
            console.error('Error loading dashboard data:', error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    // Utility functions
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

    const handleQuickAction = (action: string, data?: any) => {
        switch (action) {
            case 'call':
                if (data?.phone) {
                    window.open(`tel:${data.phone}`, '_self')
                }
                break
            case 'whatsapp':
                if (data?.phone) {
                    const message = encodeURIComponent('Olá! Entrei em contato sobre o imóvel do seu interesse.')
                    window.open(`https://wa.me/55${data.phone.replace(/\D/g, '')}?text=${message}`, '_blank')
                }
                break
            case 'email':
                if (data?.email) {
                    window.open(`mailto:${data.email}?subject=Sobre seu interesse em imóvel`, '_self')
                }
                break
            default:
                console.log(`Action: ${action}`, data)
        }
    }

    const completeTask = (taskId: string) => {
        setUpcomingTasks(prev =>
            prev.map(task =>
                task.id === taskId ? { ...task, completed: true } : task
            )
        )
    }

    if (loading) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <div className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-2xl mb-8"></div>
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
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Enhanced Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-blue-800 via-purple-600 to-blue-800 rounded-2xl p-8 mb-8 text-white relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-black opacity-10"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between h-full">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold mb-2">
                                    {getGreeting()}, {getUserName()} 🏠
                                </h1>
                                <p className="text-blue-100 mb-6 text-lg">
                                    Bem-vindo! Este é o seu sistema de administração imobiliária
                                </p>
                            </div>

                            <div className="flex items-center gap-4 ml-8">
                                <button
                                    onClick={loadDashboardData}
                                    disabled={refreshing}
                                    className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors disabled:opacity-50"
                                >
                                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                                    Atualizar
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm"
                >
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                        <button
                            onClick={() => handleQuickAction('new-lead')}
                            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all group"
                        >
                            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                <Plus className="h-5 w-5 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Novo Lead</span>
                        </button>

                        <button
                            onClick={() => handleQuickAction('call', { phone: '11999887766' })}
                            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-all group"
                        >
                            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                                <Phone className="h-5 w-5 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Ligar</span>
                        </button>

                        <button
                            onClick={() => handleQuickAction('whatsapp', { phone: '11999887766' })}
                            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all group"
                        >
                            <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                                <MessageSquare className="h-5 w-5 text-emerald-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">WhatsApp</span>
                        </button>

                        <button
                            onClick={() => handleQuickAction('schedule')}
                            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-all group"
                        >
                            <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                                <Calendar className="h-5 w-5 text-purple-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Agendar</span>
                        </button>

                        <button
                            onClick={() => handleQuickAction('calculator')}
                            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all group"
                        >
                            <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                                <Calculator className="h-5 w-5 text-indigo-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Simular</span>
                        </button>

                        <button
                            onClick={() => handleQuickAction('property')}
                            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-orange-50 hover:border-orange-300 transition-all group"
                        >
                            <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                                <Building2 className="h-5 w-5 text-orange-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Imóveis</span>
                        </button>
                    </div>
                </motion.div>

                {/* Navigation Tabs */}
                <div className="flex space-x-1 mb-8 bg-white p-1 rounded-lg border border-gray-200">
                    {[
                        { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
                        { id: 'leads', label: 'Leads Ativos', icon: Users },
                        { id: 'properties', label: 'Imóveis', icon: Building2 },
                        { id: 'tasks', label: 'Agenda', icon: Calendar }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === tab.id
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'overview' && <OverviewTab metrics={metrics} />}
                        {activeTab === 'leads' && (
                            <LeadsManagement
                                leads={leadActivity}
                                onQuickAction={handleQuickAction}
                            />
                        )}
                        {activeTab === 'properties' && <PropertiesTab properties={propertyPerformance} />}
                        {activeTab === 'tasks' && (
                            <TasksTab
                                tasks={upcomingTasks}
                                onCompleteTask={completeTask}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

// Overview Tab Component
function OverviewTab({ metrics }: { metrics: DashboardMetrics | null }) {
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
        <div className="space-y-8">
            {/* Performance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
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
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                        <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${metrics.salesGoalProgress}%` }}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Imóveis</h3>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                        {metrics.activeListings}
                    </div>
                    <div className="text-sm text-gray-500">
                        {metrics.totalProperties} no portfólio
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">
                            {metrics.soldThisMonth} vendidos este mês
                        </span>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Users className="h-5 w-5 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Leads</h3>
                    </div>
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                        {metrics.totalLeads}
                    </div>
                    <div className="text-sm text-gray-500">
                        {metrics.qualifiedLeads} qualificados
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                        <Zap className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-600">
                            {metrics.hotLeads} leads quentes
                        </span>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Clock className="h-5 w-5 text-orange-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Performance</h3>
                    </div>
                    <div className="text-2xl font-bold text-orange-600 mb-1">
                        {metrics.conversionRate}%
                    </div>
                    <div className="text-sm text-gray-500">
                        Taxa de conversão
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                        <Activity className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-blue-600">
                            {metrics.responseTime}min resposta
                        </span>
                    </div>
                </div>
            </div>

            {/* Activity Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Atividade do Dia
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-green-600" />
                                <span className="font-medium text-gray-900">Ligações Feitas</span>
                            </div>
                            <span className="text-xl font-bold text-green-600">
                                {metrics.callsMade}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-blue-600" />
                                <span className="font-medium text-gray-900">Emails Enviados</span>
                            </div>
                            <span className="text-xl font-bold text-blue-600">
                                {metrics.emailsSent}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-purple-600" />
                                <span className="font-medium text-gray-900">Agendamentos</span>
                            </div>
                            <span className="text-xl font-bold text-purple-600">
                                {metrics.appointmentsWeek}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Próximas Ações Prioritárias
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 border border-red-200 rounded-lg bg-red-50">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <div>
                                <div className="font-medium text-gray-900">
                                    Retornar 3 leads quentes
                                </div>
                                <div className="text-sm text-gray-600">
                                    Resposta urgente necessária
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                            <Clock className="h-5 w-5 text-yellow-600" />
                            <div>
                                <div className="font-medium text-gray-900">
                                    Preparar 2 visitas para hoje
                                </div>
                                <div className="text-sm text-gray-600">
                                    Confirmar horários e documentos
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 border border-blue-200 rounded-lg bg-blue-50">
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                            <div>
                                <div className="font-medium text-gray-900">
                                    Atualizar 5 anúncios
                                </div>
                                <div className="text-sm text-gray-600">
                                    Revisar preços e descrições
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Leads Management Component
function LeadsManagement({
    leads,
    onQuickAction
}: {
    leads: LeadActivity[]
    onQuickAction: (action: string, data?: any) => void
}) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'negotiation': return 'bg-red-100 text-red-800'
            case 'proposal': return 'bg-blue-100 text-blue-800'
            case 'qualified': return 'bg-green-100 text-green-800'
            case 'contacted': return 'bg-yellow-100 text-yellow-800'
            default: return 'bg-gray-100 text-gray-800'
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Leads Ativos</h2>
                    <p className="text-gray-600">Gerencie seus prospects prioritários</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => onQuickAction('new-lead')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
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
                                    {formatCurrency(lead.value)}
                                </div>
                                <div className="text-sm text-gray-500">Valor potencial</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Imóvel</div>
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
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Contato</div>
                                <div className="font-medium text-gray-900">{lead.phone}</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onQuickAction('call', { phone: lead.phone })}
                                    className="flex items-center gap-1 px-3 py-1.5 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                    <Phone className="h-3 w-3" />
                                    Ligar
                                </button>
                                <button
                                    onClick={() => onQuickAction('whatsapp', { phone: lead.phone })}
                                    className="flex items-center gap-1 px-3 py-1.5 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                                >
                                    <MessageSquare className="h-3 w-3" />
                                    WhatsApp
                                </button>
                                <button
                                    onClick={() => onQuickAction('email', { email: lead.email })}
                                    className="flex items-center gap-1 px-3 py-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <Mail className="h-3 w-3" />
                                    Email
                                </button>
                                <button
                                    onClick={() => onQuickAction('schedule', { leadId: lead.id })}
                                    className="flex items-center gap-1 px-3 py-1.5 text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                                >
                                    <Calendar className="h-3 w-3" />
                                    Agendar
                                </button>
                            </div>
                            <div className="flex items-center gap-1">
                                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                    <FileText className="h-4 w-4" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                    <Settings className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Lead Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
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
                        {formatCurrency(leads.reduce((sum, lead) => sum + lead.value, 0))}
                    </div>
                    <div className="text-sm text-green-700">Valor Total</div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(Math.round(leads.reduce((sum, lead) => sum + lead.value, 0) / leads.length))}
                    </div>
                    <div className="text-sm text-blue-700">Ticket Médio</div>
                </div>
            </div>
        </div>
    )
}

// Properties Tab Component
function PropertiesTab({ properties }: { properties: PropertyPerformance[] }) {
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
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Performance dos Imóveis</h2>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Plus className="h-4 w-4" />
                        Novo Imóvel
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
                        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    {property.address}
                                </h3>
                                <div className="text-2xl font-bold text-green-600">
                                    {formatCurrency(property.price)}
                                </div>
                            </div>
                            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${property.trend === 'up' ? 'bg-green-100 text-green-800' :
                                property.trend === 'down' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                {property.trend === 'up' && <TrendingUp className="h-4 w-4" />}
                                {property.trend === 'down' && <TrendingDown className="h-4 w-4" />}
                                {property.trend === 'stable' && <Activity className="h-4 w-4" />}
                                {property.trend}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <Eye className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                                <div className="text-lg font-semibold text-gray-900">{property.views}</div>
                                <div className="text-xs text-gray-500">Visualizações</div>
                            </div>

                            <div className="text-center p-3 bg-red-50 rounded-lg">
                                <Heart className="h-5 w-5 text-red-500 mx-auto mb-1" />
                                <div className="text-lg font-semibold text-red-600">{property.favorites}</div>
                                <div className="text-xs text-gray-500">Favoritos</div>
                            </div>

                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <Share2 className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                                <div className="text-lg font-semibold text-blue-600">{property.shares}</div>
                                <div className="text-xs text-gray-500">Compartilhamentos</div>
                            </div>

                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <MessageSquare className="h-5 w-5 text-green-500 mx-auto mb-1" />
                                <div className="text-lg font-semibold text-green-600">{property.inquiries}</div>
                                <div className="text-xs text-gray-500">Consultas</div>
                            </div>

                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                                <Calendar className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                                <div className="text-lg font-semibold text-purple-600">{property.visits}</div>
                                <div className="text-xs text-gray-500">Visitas</div>
                            </div>

                            <div className="text-center p-3 bg-orange-50 rounded-lg">
                                <Clock className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                                <div className="text-lg font-semibold text-orange-600">{property.daysOnMarket}</div>
                                <div className="text-xs text-gray-500">Dias no Mercado</div>
                            </div>

                            <div className="text-center p-3 bg-indigo-50 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-indigo-500 mx-auto mb-1" />
                                <div className={`text-lg font-semibold ${property.priceChange >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
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

// Tasks Tab Component  
function TasksTab({
    tasks,
    onCompleteTask
}: {
    tasks: UpcomingTask[]
    onCompleteTask: (taskId: string) => void
}) {
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
                        className={`bg-white rounded-xl border p-6 hover:shadow-lg transition-all ${task.completed
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200'
                            }`}
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
                                    <h3 className={`font-semibold ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                                        }`}>
                                        {task.title}
                                    </h3>
                                    <span className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority).replace('text-', 'bg-')
                                        }`}></span>
                                </div>
                                <p className={`text-sm mb-1 ${task.completed ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                    {task.description}
                                </p>
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
                                {!task.completed && (
                                    <button
                                        onClick={() => onCompleteTask(task.id)}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    >
                                        <CheckCircle className="h-5 w-5" />
                                    </button>
                                )}
                                {task.completed && (
                                    <div className="p-2 text-green-600">
                                        <CheckCircle className="h-5 w-5 fill-current" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Task Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                        {tasks.filter(t => !t.completed).length}
                    </div>
                    <div className="text-sm text-blue-700">Tarefas Pendentes</div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                        {tasks.filter(t => t.completed).length}
                    </div>
                    <div className="text-sm text-green-700">Tarefas Concluídas</div>
                </div>
                <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">
                        {tasks.filter(t => t.priority === 'high' && !t.completed).length}
                    </div>
                    <div className="text-sm text-red-700">Alta Prioridade</div>
                </div>
            </div>
        </div>
    )
}
