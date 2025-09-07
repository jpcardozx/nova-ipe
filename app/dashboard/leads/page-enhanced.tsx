
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import {
    TrendingUp,
    User,
    Phone,
    Mail,
    MapPin,
    DollarSign,
    Calendar,
    Plus,
    Eye,
    Edit,
    Trash2,
    Search,
    Filter,
    Star,
    Clock,
    CheckCircle2,
    Target,
    MessageCircle,
    PhoneCall,
    Zap,
    AlertTriangle,
    Users,
    ThermometerSun,
    Timer,
    Building2
} from 'lucide-react'

interface Lead {
    id: string
    name: string
    email: string
    phone: string
    whatsapp?: string
    source: 'website' | 'facebook' | 'instagram' | 'whatsapp' | 'referral' | 'cold_call' | 'indicacao' | 'placa' | 'anuncio' | 'other'
    status: 'new' | 'contacted' | 'qualified' | 'hot' | 'proposal' | 'negotiation' | 'won' | 'lost' | 'follow_up'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    interest: 'buy' | 'sell' | 'rent' | 'invest'
    budget_min: number
    budget_max: number
    preferred_location: string[]
    property_type: string[]
    rooms_min?: number
    parking_spots?: number
    has_financing?: boolean
    financing_approved?: boolean
    timeline: 'asap' | '1_month' | '3_months' | '6_months' | '1_year' | 'no_rush'
    score: number
    temperature: 'cold' | 'warm' | 'hot' | 'burning'
    last_contact: string
    next_follow_up: string
    assigned_to: string
    created_at: string
    notes?: string
    interactions: Interaction[]
    referral_source?: string
    family_size?: number
    current_situation: 'renting' | 'owns_home' | 'with_family' | 'investing' | 'relocating'
    decision_maker: 'lead' | 'spouse' | 'family' | 'unknown'
    conversion_probability: number
}

interface Interaction {
    id: string
    type: 'call' | 'whatsapp' | 'email' | 'meeting' | 'visit' | 'proposal'
    date: string
    duration?: number
    notes: string
    outcome: 'positive' | 'neutral' | 'negative'
    next_action?: string
    scheduled_follow_up?: string
}

export default function LeadsPage() {
    const { user } = useCurrentUser()
    const [leads, setLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | Lead['status']>('all')
    const [sourceFilter, setSourceFilter] = useState<'all' | Lead['source']>('all')
    const [temperatureFilter, setTemperatureFilter] = useState<'all' | Lead['temperature']>('all')
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

    useEffect(() => {
        loadLeads()
    }, [])

    const loadLeads = async () => {
        try {
            // Dados mais realistas para imobiliária pequena
            const mockLeads: Lead[] = [
                {
                    id: '1',
                    name: 'Carlos Oliveira',
                    email: 'carlos@email.com',
                    phone: '(11) 99999-1234',
                    whatsapp: '(11) 99999-1234',
                    source: 'website',
                    status: 'qualified',
                    priority: 'high',
                    interest: 'buy',
                    budget_min: 800000,
                    budget_max: 1200000,
                    preferred_location: ['Vila Madalena', 'Pinheiros'],
                    property_type: ['Apartamento'],
                    rooms_min: 3,
                    parking_spots: 2,
                    has_financing: true,
                    financing_approved: false,
                    timeline: '3_months',
                    score: 85,
                    temperature: 'hot',
                    last_contact: '2025-01-08T10:30:00.000Z',
                    next_follow_up: '2025-01-10T14:00:00.000Z',
                    assigned_to: 'user123',
                    created_at: '2025-01-05T14:20:00.000Z',
                    notes: 'Cliente muito interessado, quer apartamento de 3 quartos com vaga. Família com 2 filhos. Orçamento pré-aprovado no banco.',
                    interactions: [
                        {
                            id: 'int1',
                            type: 'call',
                            date: '2025-01-08T10:30:00.000Z',
                            duration: 15,
                            notes: 'Cliente muito interessado, quer visitar imóveis no fim de semana',
                            outcome: 'positive',
                            next_action: 'Agendar visitas',
                            scheduled_follow_up: '2025-01-10T14:00:00.000Z'
                        }
                    ],
                    family_size: 4,
                    current_situation: 'renting',
                    decision_maker: 'lead',
                    conversion_probability: 75
                },
                {
                    id: '2',
                    name: 'Fernanda Costa',
                    email: 'fernanda@email.com',
                    phone: '(11) 99999-5678',
                    whatsapp: '(11) 99999-5678',
                    source: 'indicacao',
                    status: 'proposal',
                    priority: 'urgent',
                    interest: 'sell',
                    budget_min: 1500000,
                    budget_max: 1800000,
                    preferred_location: ['Itaim Bibi'],
                    property_type: ['Casa'],
                    timeline: '1_month',
                    score: 92,
                    temperature: 'burning',
                    last_contact: '2025-01-07T16:45:00.000Z',
                    next_follow_up: '2025-01-09T09:00:00.000Z',
                    assigned_to: 'user123',
                    created_at: '2025-01-03T11:15:00.000Z',
                    notes: 'Indicação da Maria Silva. Quer vender casa para comprar apartamento menor. Urgência por mudança de emprego.',
                    interactions: [
                        {
                            id: 'int2',
                            type: 'meeting',
                            date: '2025-01-07T16:45:00.000Z',
                            duration: 60,
                            notes: 'Reunião na casa. Imóvel bem conservado, preço realista.',
                            outcome: 'positive',
                            next_action: 'Enviar proposta de venda'
                        }
                    ],
                    referral_source: 'Maria Silva',
                    current_situation: 'owns_home',
                    decision_maker: 'spouse',
                    conversion_probability: 85
                },
                {
                    id: '3',
                    name: 'Roberto Silva',
                    email: 'roberto@email.com',
                    phone: '(11) 99999-9012',
                    whatsapp: '(11) 99999-9012',
                    source: 'whatsapp',
                    status: 'new',
                    priority: 'medium',
                    interest: 'rent',
                    budget_min: 3000,
                    budget_max: 5000,
                    preferred_location: ['Pinheiros', 'Vila Madalena'],
                    property_type: ['Apartamento'],
                    timeline: 'asap',
                    score: 45,
                    temperature: 'cold',
                    last_contact: '2025-01-06T20:15:00.000Z',
                    next_follow_up: '2025-01-12T10:00:00.000Z',
                    assigned_to: 'user123',
                    created_at: '2025-01-06T20:15:00.000Z',
                    notes: 'Mudança de Recife para SP. Procura apartamento para alugar urgente, 2 quartos.',
                    interactions: [],
                    current_situation: 'relocating',
                    decision_maker: 'lead',
                    conversion_probability: 40
                },
                {
                    id: '4',
                    name: 'Ana Paula Martins',
                    email: 'ana.paula@email.com',
                    phone: '(11) 98888-7777',
                    whatsapp: '(11) 98888-7777',
                    source: 'placa',
                    status: 'hot',
                    priority: 'high',
                    interest: 'invest',
                    budget_min: 600000,
                    budget_max: 900000,
                    preferred_location: ['Centro', 'República'],
                    property_type: ['Apartamento', 'Loft'],
                    timeline: '6_months',
                    score: 78,
                    temperature: 'hot',
                    last_contact: '2025-01-08T14:20:00.000Z',
                    next_follow_up: '2025-01-11T16:00:00.000Z',
                    assigned_to: 'user123',
                    created_at: '2025-01-04T09:30:00.000Z',
                    notes: 'Investidora experiente. Procura imóveis para renda de aluguel. Foco em localização e potencial de valorização.',
                    interactions: [
                        {
                            id: 'int3',
                            type: 'whatsapp',
                            date: '2025-01-08T14:20:00.000Z',
                            duration: 10,
                            notes: 'Interessada em ver planilha de rentabilidade dos imóveis',
                            outcome: 'positive',
                            next_action: 'Enviar análise de investimento'
                        }
                    ],
                    current_situation: 'investing',
                    decision_maker: 'lead',
                    conversion_probability: 70
                }
            ]

            setLeads(mockLeads)
        } catch (error) {
            console.error('Error loading leads:', error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadge = (status: Lead['status']) => {
        const styles = {
            new: 'bg-blue-100 text-blue-800',
            contacted: 'bg-yellow-100 text-yellow-800',
            qualified: 'bg-green-100 text-green-800',
            hot: 'bg-red-100 text-red-800',
            proposal: 'bg-purple-100 text-purple-800',
            negotiation: 'bg-orange-100 text-orange-800',
            won: 'bg-emerald-100 text-emerald-800',
            lost: 'bg-gray-100 text-gray-800',
            follow_up: 'bg-indigo-100 text-indigo-800'
        }

        const labels = {
            new: 'Novo',
            contacted: 'Contatado',
            qualified: 'Qualificado',
            hot: 'Quente',
            proposal: 'Proposta',
            negotiation: 'Negociação',
            won: 'Fechado',
            lost: 'Perdido',
            follow_up: 'Follow-up'
        }

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
                {labels[status]}
            </span>
        )
    }

    const getTemperatureBadge = (temperature: Lead['temperature']) => {
        const styles = {
            cold: 'bg-blue-100 text-blue-800',
            warm: 'bg-yellow-100 text-yellow-800',
            hot: 'bg-orange-100 text-orange-800',
            burning: 'bg-red-100 text-red-800'
        }

        const labels = {
            cold: 'Frio',
            warm: 'Morno',
            hot: 'Quente',
            burning: 'Muito Quente'
        }

        const icons = {
            cold: '🧊',
            warm: '🌡️',
            hot: '🔥',
            burning: '💥'
        }

        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${styles[temperature]}`}>
                <span>{icons[temperature]}</span>
                {labels[temperature]}
            </span>
        )
    }

    const getPriorityBadge = (priority: Lead['priority']) => {
        const styles = {
            low: 'bg-gray-100 text-gray-600',
            medium: 'bg-blue-100 text-blue-600',
            high: 'bg-orange-100 text-orange-600',
            urgent: 'bg-red-100 text-red-600'
        }

        const labels = {
            low: 'Baixa',
            medium: 'Média',
            high: 'Alta',
            urgent: 'Urgente'
        }

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[priority]}`}>
                {labels[priority]}
            </span>
        )
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value)
    }

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

        if (diffInHours < 1) return 'Agora mesmo'
        if (diffInHours < 24) return `${diffInHours}h atrás`
        if (diffInHours < 48) return 'Ontem'

        const diffInDays = Math.floor(diffInHours / 24)
        return `${diffInDays} dias atrás`
    }

    const isFollowUpOverdue = (followUpDate: string) => {
        return new Date(followUpDate) < new Date()
    }

    const filteredLeads = leads.filter(lead => {
        const matchesSearch =
            lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.phone.includes(searchQuery) ||
            lead.preferred_location.some(loc => loc.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
        const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter
        const matchesTemperature = temperatureFilter === 'all' || lead.temperature === temperatureFilter

        return matchesSearch && matchesStatus && matchesSource && matchesTemperature
    })

    // Ordenar por prioridade e follow-up vencido
    const sortedLeads = filteredLeads.sort((a, b) => {
        // Primeiro, leads com follow-up vencido
        const aOverdue = isFollowUpOverdue(a.next_follow_up)
        const bOverdue = isFollowUpOverdue(b.next_follow_up)
        if (aOverdue && !bOverdue) return -1
        if (!aOverdue && bOverdue) return 1

        // Depois por prioridade
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
        if (priorityDiff !== 0) return priorityDiff

        // Por último, por temperatura
        const tempOrder = { burning: 4, hot: 3, warm: 2, cold: 1 }
        return tempOrder[b.temperature] - tempOrder[a.temperature]
    })

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Carregando leads...</p>
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
                            <Target className="h-7 w-7 text-amber-600" />
                            Pipeline de Leads
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Gerencie e converta oportunidades em vendas
                        </p>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                        <Plus className="h-4 w-4" />
                        Novo Lead
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <Users className="h-8 w-8 text-blue-600" />
                            <span className="text-xs text-blue-600 font-medium">Total</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {leads.length}
                        </div>
                        <div className="text-sm text-gray-600">Leads Ativos</div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <ThermometerSun className="h-8 w-8 text-red-600" />
                            <span className="text-xs text-red-600 font-medium">Quentes</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {leads.filter(l => l.temperature === 'hot' || l.temperature === 'burning').length}
                        </div>
                        <div className="text-sm text-gray-600">Alta Prioridade</div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <Timer className="h-8 w-8 text-orange-600" />
                            <span className="text-xs text-orange-600 font-medium">Vencidos</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {leads.filter(l => isFollowUpOverdue(l.next_follow_up)).length}
                        </div>
                        <div className="text-sm text-gray-600">Follow-ups</div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <TrendingUp className="h-8 w-8 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">Conversão</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {Math.round(leads.reduce((acc, l) => acc + l.conversion_probability, 0) / leads.length)}%
                        </div>
                        <div className="text-sm text-gray-600">Média</div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <DollarSign className="h-8 w-8 text-purple-600" />
                            <span className="text-xs text-purple-600 font-medium">Potencial</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {formatCurrency(leads.reduce((acc, l) => acc + ((l.budget_min + l.budget_max) / 2), 0))}
                        </div>
                        <div className="text-sm text-gray-600">Total Pipeline</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Buscar por nome, email, telefone ou localização..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                            <option value="all">Todos os Status</option>
                            <option value="new">Novo</option>
                            <option value="contacted">Contatado</option>
                            <option value="qualified">Qualificado</option>
                            <option value="hot">Quente</option>
                            <option value="proposal">Proposta</option>
                            <option value="negotiation">Negociação</option>
                            <option value="follow_up">Follow-up</option>
                        </select>

                        <select
                            value={temperatureFilter}
                            onChange={(e) => setTemperatureFilter(e.target.value as any)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                            <option value="all">Todas Temperaturas</option>
                            <option value="burning">Muito Quente</option>
                            <option value="hot">Quente</option>
                            <option value="warm">Morno</option>
                            <option value="cold">Frio</option>
                        </select>

                        <select
                            value={sourceFilter}
                            onChange={(e) => setSourceFilter(e.target.value as any)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                            <option value="all">Todas as Fontes</option>
                            <option value="website">Site</option>
                            <option value="whatsapp">WhatsApp</option>
                            <option value="indicacao">Indicação</option>
                            <option value="placa">Placa</option>
                            <option value="facebook">Facebook</option>
                            <option value="instagram">Instagram</option>
                        </select>
                    </div>
                </div>

                {/* Leads List */}
                <div className="space-y-4">
                    {sortedLeads.map((lead) => (
                        <motion.div
                            key={lead.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`bg-white rounded-xl border-2 shadow-sm p-6 hover:shadow-md transition-all ${isFollowUpOverdue(lead.next_follow_up) ? 'border-red-200 bg-red-50' : 'border-gray-200'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                                        {lead.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg mb-1 flex items-center gap-2">
                                            {lead.name}
                                            {isFollowUpOverdue(lead.next_follow_up) && (
                                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                            )}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                            <span className="flex items-center gap-1">
                                                <Mail className="h-4 w-4" />
                                                {lead.email}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Phone className="h-4 w-4" />
                                                {lead.phone}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 mb-3">
                                            {getStatusBadge(lead.status)}
                                            {getTemperatureBadge(lead.temperature)}
                                            {getPriorityBadge(lead.priority)}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-lg font-bold text-gray-900 mb-1">
                                        {lead.conversion_probability}%
                                    </div>
                                    <div className="text-xs text-gray-500">Conversão</div>
                                </div>
                            </div>

                            {/* Lead Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                        <Building2 className="h-4 w-4" />
                                        Interesse
                                    </div>
                                    <div className="font-medium">
                                        {lead.interest === 'buy' ? 'Comprar' :
                                            lead.interest === 'sell' ? 'Vender' :
                                                lead.interest === 'rent' ? 'Alugar' : 'Investir'}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {lead.property_type.join(', ')}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                        <DollarSign className="h-4 w-4" />
                                        Orçamento
                                    </div>
                                    <div className="font-medium">
                                        {formatCurrency(lead.budget_min)} - {formatCurrency(lead.budget_max)}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                        <MapPin className="h-4 w-4" />
                                        Localização
                                    </div>
                                    <div className="font-medium">
                                        {lead.preferred_location.join(', ')}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                        <Clock className="h-4 w-4" />
                                        Próximo Follow-up
                                    </div>
                                    <div className={`font-medium ${isFollowUpOverdue(lead.next_follow_up) ? 'text-red-600' : 'text-gray-900'}`}>
                                        {new Date(lead.next_follow_up).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {lead.notes && (
                                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                    <p className="text-sm text-gray-700">{lead.notes}</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Clock className="h-4 w-4" />
                                    Último contato: {formatTimeAgo(lead.last_contact)}
                                    {lead.referral_source && (
                                        <span className="ml-3 text-purple-600">
                                            Indicação: {lead.referral_source}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button className="flex items-center gap-1 px-3 py-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                        <MessageCircle className="h-4 w-4" />
                                        WhatsApp
                                    </button>
                                    <button className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        <PhoneCall className="h-4 w-4" />
                                        Ligar
                                    </button>
                                    <button className="flex items-center gap-1 px-3 py-1 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                                        <Edit className="h-4 w-4" />
                                        Editar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {sortedLeads.length === 0 && (
                    <div className="text-center py-12">
                        <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum lead encontrado</h3>
                        <p className="text-gray-600">
                            {searchQuery ? 'Tente ajustar os filtros ou termo de busca.' : 'Comece adicionando seu primeiro lead.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
