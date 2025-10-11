'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    TrendingUp,
    TrendingDown,
    Eye,
    Heart,
    Share2,
    MessageSquare,
    Calendar,
    Phone,
    Mail,
    MapPin,
    DollarSign,
    Clock,
    Filter,
    Search,
    Plus,
    MoreHorizontal,
    Star,
    Building2,
    Users,
    Target,
    Activity
} from 'lucide-react'

interface LeadScoringMetrics {
    engagement: number
    budget_match: number
    timeline: number
    contact_frequency: number
    property_views: number
    overall_score: number
}

interface Lead {
    id: string
    name: string
    email: string
    phone: string
    source: string
    status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed' | 'lost'
    priority: 'high' | 'medium' | 'low'
    budget_min: number
    budget_max: number
    property_type: string
    location_preference: string
    timeline: string
    last_contact: string
    created_at: string
    assigned_agent: string
    scoring: LeadScoringMetrics
    notes: string[]
    activities: LeadActivity[]
    properties_viewed: number
    emails_opened: number
    responses_count: number
    temperature: 'hot' | 'warm' | 'cold'
    conversion_probability: number
}

interface LeadActivity {
    id: string
    type: 'call' | 'email' | 'whatsapp' | 'visit' | 'proposal' | 'meeting'
    description: string
    date: string
    duration?: number
    outcome: 'positive' | 'neutral' | 'negative'
    next_action?: string
}

interface LeadFilters {
    status: string[]
    priority: string[]
    source: string[]
    budget_range: [number, number]
    timeline: string[]
    temperature: string[]
    date_range: [string, string]
}

export default function SmartLeadsManager() {
    const [leads, setLeads] = useState<Lead[]>([])
    const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
    const [filters, setFilters] = useState<LeadFilters>({
        status: [],
        priority: [],
        source: [],
        budget_range: [0, 10000000],
        timeline: [],
        temperature: [],
        date_range: ['', '']
    })
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState<'score' | 'date' | 'priority' | 'value'>('score')
    const [showFilters, setShowFilters] = useState(false)

    useEffect(() => {
        loadLeads()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [leads, filters, searchTerm, sortBy])

    const loadLeads = async () => {
        try {
            // Carregar leads do backend real
            // const response = await fetch('/api/leads')
            // const leads = await response.json()

            await new Promise(resolve => setTimeout(resolve, 1000))

            // Array vazio até conectar com backend
            setLeads([])
            setFilteredLeads([])
            setLoading(false)
        } catch (error) {
            console.error('Erro ao carregar leads:', error)
            setLoading(false)
        }
    }

const applyFilters = () => {
    let filtered = [...leads]

    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(lead =>
            lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.phone.includes(searchTerm) ||
            lead.location_preference.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }

    // Apply status filter
    if (filters.status.length > 0) {
        filtered = filtered.filter(lead => filters.status.includes(lead.status))
    }

    // Apply priority filter
    if (filters.priority.length > 0) {
        filtered = filtered.filter(lead => filters.priority.includes(lead.priority))
    }

    // Apply temperature filter
    if (filters.temperature.length > 0) {
        filtered = filtered.filter(lead => filters.temperature.includes(lead.temperature))
    }

    // Apply budget filter
    filtered = filtered.filter(lead =>
        lead.budget_max >= filters.budget_range[0] &&
        lead.budget_min <= filters.budget_range[1]
    )

    // Sort
    filtered.sort((a, b) => {
        switch (sortBy) {
            case 'score':
                return b.scoring.overall_score - a.scoring.overall_score
            case 'date':
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            case 'priority':
                const priorityOrder = { high: 3, medium: 2, low: 1 }
                return priorityOrder[b.priority] - priorityOrder[a.priority]
            case 'value':
                return b.budget_max - a.budget_max
            default:
                return 0
        }
    })

    setFilteredLeads(filtered)
}

const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
}

const getTemperatureColor = (temp: string) => {
    switch (temp) {
        case 'hot': return 'text-red-600 bg-red-100'
        case 'warm': return 'text-yellow-600 bg-yellow-100'
        case 'cold': return 'text-blue-600 bg-blue-100'
        default: return 'text-gray-600 bg-gray-100'
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
            <div className="animate-pulse space-y-4">
                <div className="h-16 bg-gray-200 rounded-xl"></div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
                ))}
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
                    <h1 className="text-3xl font-bold text-gray-900">Gerenciamento Inteligente de Leads</h1>
                    <p className="text-gray-600 mt-2">
                        Sistema avançado com scoring automático e insights de conversão
                    </p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                    <Plus className="h-5 w-5" />
                    Novo Lead
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">Total de Leads</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{leads.length}</div>
                    <div className="text-sm text-green-600 mt-1">+12% esta semana</div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Target className="h-6 w-6 text-red-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">Leads Quentes</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                        {leads.filter(l => l.temperature === 'hot').length}
                    </div>
                    <div className="text-sm text-red-600 mt-1">Alta prioridade</div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">Taxa de Conversão</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">24.5%</div>
                    <div className="text-sm text-green-600 mt-1">+3.2% vs. mês anterior</div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <DollarSign className="h-6 w-6 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">Valor Potencial</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                        R$ {(leads.reduce((sum, lead) => sum + lead.budget_max, 0) / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm text-purple-600 mt-1">Pipeline total</div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1 relative">
                        <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Buscar por nome, email, telefone ou localização..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        <Filter className="h-5 w-5" />
                        Filtros
                    </button>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="score">Ordenar por Score</option>
                        <option value="date">Ordenar por Data</option>
                        <option value="priority">Ordenar por Prioridade</option>
                        <option value="value">Ordenar por Valor</option>
                    </select>
                </div>

                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <div className="space-y-2">
                                {['new', 'contacted', 'qualified', 'proposal', 'negotiation'].map(status => (
                                    <label key={status} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={filters.status.includes(status)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setFilters(prev => ({ ...prev, status: [...prev.status, status] }))
                                                } else {
                                                    setFilters(prev => ({ ...prev, status: prev.status.filter(s => s !== status) }))
                                                }
                                            }}
                                            className="mr-2"
                                        />
                                        <span className="text-sm capitalize">{status}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Temperatura</label>
                            <div className="space-y-2">
                                {['hot', 'warm', 'cold'].map(temp => (
                                    <label key={temp} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={filters.temperature.includes(temp)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setFilters(prev => ({ ...prev, temperature: [...prev.temperature, temp] }))
                                                } else {
                                                    setFilters(prev => ({ ...prev, temperature: prev.temperature.filter(t => t !== temp) }))
                                                }
                                            }}
                                            className="mr-2"
                                        />
                                        <span className="text-sm capitalize">{temp}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                            <div className="space-y-2">
                                {['high', 'medium', 'low'].map(priority => (
                                    <label key={priority} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={filters.priority.includes(priority)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setFilters(prev => ({ ...prev, priority: [...prev.priority, priority] }))
                                                } else {
                                                    setFilters(prev => ({ ...prev, priority: prev.priority.filter(p => p !== priority) }))
                                                }
                                            }}
                                            className="mr-2"
                                        />
                                        <span className="text-sm capitalize">{priority}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Leads List */}
            <div className="space-y-4">
                {filteredLeads.map((lead, index) => (
                    <motion.div
                        key={lead.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => setSelectedLead(lead)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-3">
                                    <h3 className="font-semibold text-lg text-gray-900">{lead.name}</h3>

                                    {/* Score Badge */}
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(lead.scoring.overall_score)}`}>
                                        Score: {lead.scoring.overall_score.toFixed(1)}
                                    </div>

                                    {/* Temperature Badge */}
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getTemperatureColor(lead.temperature)}`}>
                                        {lead.temperature.toUpperCase()}
                                    </div>

                                    {/* Priority Indicator */}
                                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(lead.priority).replace('text-', 'bg-')}`}></div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                    <div>
                                        <span className="text-sm text-gray-500">Contato</span>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            {lead.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                            {lead.phone}
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-sm text-gray-500">Orçamento</span>
                                        <div className="text-sm font-medium">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.budget_min)} -
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.budget_max)}
                                        </div>
                                        <div className="text-xs text-gray-500">{lead.property_type}</div>
                                    </div>

                                    <div>
                                        <span className="text-sm text-gray-500">Localização</span>
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                            {lead.location_preference}
                                        </div>
                                        <div className="text-xs text-gray-500">Timeline: {lead.timeline}</div>
                                    </div>

                                    <div>
                                        <span className="text-sm text-gray-500">Engajamento</span>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="flex items-center gap-1">
                                                <Eye className="h-4 w-4 text-blue-500" />
                                                {lead.properties_viewed}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Mail className="h-4 w-4 text-green-500" />
                                                {lead.emails_opened}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MessageSquare className="h-4 w-4 text-purple-500" />
                                                {lead.responses_count}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Prob. conversão: {lead.conversion_probability}%
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span>Fonte: {lead.source}</span>
                                    <span>Status: {lead.status}</span>
                                    <span>Último contato: {lead.last_contact}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                                    <Phone className="h-5 w-5" />
                                </button>
                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                    <MessageSquare className="h-5 w-5" />
                                </button>
                                <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg">
                                    <Mail className="h-5 w-5" />
                                </button>
                                <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                                    <MoreHorizontal className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredLeads.length === 0 && (
                <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum lead encontrado</h3>
                    <p className="text-gray-600">Ajuste os filtros ou adicione novos leads ao sistema.</p>
                </div>
            )}

            {/* Lead Detail Modal would go here */}
            {selectedLead && (
                <LeadDetailModal
                    lead={selectedLead}
                    onClose={() => setSelectedLead(null)}
                />
            )}
        </div>
    </div>
)
}

// Lead Detail Modal Component
function LeadDetailModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{lead.name}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        ×
                    </button>
                </div>

                {/* Lead details content would go here */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Contact & Score */}
                    <div className="space-y-6">
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Informações de Contato</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                    <span>{lead.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                    <span>{lead.phone}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                    <span>{lead.location_preference}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Score de Qualificação</h3>
                            <div className="space-y-3">
                                {Object.entries(lead.scoring).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 capitalize">
                                            {key.replace('_', ' ')}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${value}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium">{value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Activities & Notes */}
                    <div className="space-y-6">
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Atividades Recentes</h3>
                            <div className="space-y-3">
                                {lead.activities.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            {activity.type === 'call' && <Phone className="h-4 w-4 text-blue-600" />}
                                            {activity.type === 'email' && <Mail className="h-4 w-4 text-blue-600" />}
                                            {activity.type === 'whatsapp' && <MessageSquare className="h-4 w-4 text-blue-600" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{activity.description}</p>
                                            <p className="text-xs text-gray-500">{activity.date}</p>
                                            {activity.next_action && (
                                                <p className="text-xs text-blue-600 mt-1">
                                                    Próxima ação: {activity.next_action}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Observações</h3>
                            <div className="space-y-2">
                                {lead.notes.map((note, index) => (
                                    <div key={index} className="text-sm text-gray-700 p-3 bg-white rounded-lg">
                                        {note}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
