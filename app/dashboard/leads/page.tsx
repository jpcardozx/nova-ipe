'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Users,
    Plus,
    Search,
    Filter,
    TrendingUp,
    Calendar,
    Phone,
    Mail,
    MapPin,
    DollarSign,
    Star,
    Clock,
    Target,
    Zap,
    Eye,
    Edit,
    Trash2,
    MoreVertical,
    ArrowRight,
    Building2,
    User,
    CheckCircle2,
    AlertCircle,
    Download,
    RefreshCw,
    MessageCircle,
    Timer,
    TrendingDown
} from 'lucide-react'
import { LeadsService } from '@/lib/supabase/leads-service'
import LeadDetailModal from '@/app/dashboard/components/LeadDetailModal'
import type { Lead } from '@/app/types/database'

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | Lead['status']>('all')
    const [sourceFilter, setSourceFilter] = useState<'all' | Lead['source']>('all')
    const [priorityFilter, setPriorityFilter] = useState<'all' | Lead['priority']>('all')
    const [viewMode, setViewMode] = useState<'grid' | 'list' | 'pipeline'>('pipeline')
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
    const [showDetailModal, setShowDetailModal] = useState(false)

    const [stats, setStats] = useState({
        total: 0,
        new: 0,
        contacted: 0,
        qualified: 0,
        proposal: 0,
        won: 0,
        lost: 0,
        conversionRate: 0,
        avgScore: 0,
        hotLeads: 0
    })

    useEffect(() => {
        loadLeads()
    }, [statusFilter, sourceFilter, priorityFilter, searchQuery])

    const loadLeads = async () => {
        setLoading(true)
        try {
            // Usar o serviço do Supabase para carregar leads reais
            const { leads: realLeads, error } = await LeadsService.getLeads({
                status: statusFilter !== 'all' ? [statusFilter] : undefined,
                source: sourceFilter !== 'all' ? [sourceFilter] : undefined,
                priority: priorityFilter !== 'all' ? [priorityFilter] : undefined,
                search: searchQuery || undefined
            })

            if (error) {
                console.error('Erro ao carregar leads:', error)
                // Fallback para dados demo se houver erro
                const demoLeads = getDemoLeads()
                setLeads(demoLeads)
                calculateStats(demoLeads)
            } else {
                setLeads(realLeads || [])
                calculateStats(realLeads || [])
            }
        } catch (error) {
            console.error('Error loading leads:', error)
            // Fallback para dados demo em caso de erro
            const demoLeads = getDemoLeads()
            setLeads(demoLeads)
            calculateStats(demoLeads)
        } finally {
            setLoading(false)
        }
    }

    const calculateStats = (allLeads: Lead[]) => {
        const total = allLeads.length
        const won = allLeads.filter(l => l.status === 'won').length
        const conversionRate = total > 0 ? (won / total) * 100 : 0
        const avgScore = total > 0 ? allLeads.reduce((sum, l) => sum + l.score, 0) / total : 0
        const hotLeads = allLeads.filter(l => l.priority === 'high' && l.status !== 'won' && l.status !== 'lost').length

        setStats({
            total,
            new: allLeads.filter(l => l.status === 'new').length,
            contacted: allLeads.filter(l => l.status === 'contacted').length,
            qualified: allLeads.filter(l => l.status === 'qualified').length,
            proposal: allLeads.filter(l => l.status === 'proposal').length,
            won,
            lost: allLeads.filter(l => l.status === 'lost').length,
            conversionRate,
            avgScore,
            hotLeads
        })
    }

    // TODO: Replace with actual API call to fetch leads from backend
    // Mock data removed for production - connect to real leads management API
    const getDemoLeads = (): Lead[] => []

    const openLeadDetail = (lead: Lead) => {
        setSelectedLead(lead)
        setShowDetailModal(true)
    }

    const handleLeadUpdate = (updatedLead: Lead) => {
        setLeads(leads => leads.map(l => l.id === updatedLead.id ? updatedLead : l))
        setSelectedLead(updatedLead)
    }

    const getStatusConfig = (status: Lead['status']) => {
        const configs = {
            new: {
                color: 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200',
                icon: <Zap className="h-3 w-3" />,
                label: 'Novo'
            },
            contacted: {
                color: 'bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 border-yellow-200',
                icon: <Phone className="h-3 w-3" />,
                label: 'Contatado'
            },
            qualified: {
                color: 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 border-purple-200',
                icon: <Target className="h-3 w-3" />,
                label: 'Qualificado'
            },
            proposal: {
                color: 'bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 border-orange-200',
                icon: <Star className="h-3 w-3" />,
                label: 'Proposta'
            },
            won: {
                color: 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200',
                icon: <CheckCircle2 className="h-3 w-3" />,
                label: 'Ganho'
            },
            lost: {
                color: 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-600 border-gray-200',
                icon: <AlertCircle className="h-3 w-3" />,
                label: 'Perdido'
            }
        }
        return configs[status]
    }

    const getPriorityColor = (priority: Lead['priority']) => {
        switch (priority) {
            case 'high': return 'text-red-500'
            case 'medium': return 'text-yellow-500'
            case 'low': return 'text-green-500'
            default: return 'text-gray-400'
        }
    }

    const getSourceIcon = (source: Lead['source']) => {
        switch (source) {
            case 'website': return '🌐'
            case 'social_media': return '�'
            case 'real_estate_portal': return '🏠'
            case 'referral': return '👥'
            case 'phone': return '📞'
            case 'walk_in': return '🚶'
            default: return '📋'
        }
    }

    const formatBudget = (min?: number, max?: number) => {
        if (!min && !max) return 'A negociar'
        if (!max) return `A partir de R$ ${min?.toLocaleString()}`
        if (!min) return `Até R$ ${max?.toLocaleString()}`
        return `R$ ${min.toLocaleString()} - R$ ${max.toLocaleString()}`
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8"
                >
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Gestão de Leads
                        </h1>
                        <p className="text-gray-600 mt-1 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Pipeline de vendas e conversão de prospects
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={loadLeads}
                            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                            title="Atualizar"
                        >
                            <RefreshCw className="h-5 w-5" />
                        </button>

                        <button className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                            <Download className="h-5 w-5" />
                        </button>

                        <button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            <Plus className="h-5 w-5" />
                            Novo Lead
                        </button>
                    </div>
                </motion.div>

                {/* Enhanced Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                >
                    {/* Card Principal - Total de Leads */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Total de Leads</h3>
                                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.total}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {stats.new} novos • {stats.contacted} em andamento
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    {/* Card Conversão */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
                                <p className="text-3xl font-bold text-green-600 mt-1">{stats.conversionRate.toFixed(1)}%</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {stats.won} convertidos de {stats.total}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    {/* Card Hot Leads */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Hot Leads</h3>
                                <p className="text-3xl font-bold text-orange-600 mt-1">{stats.qualified}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Score alto • Prontos para proposta
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Star className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Enhanced Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8"
                >
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative group">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-amber-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Buscar por nome, email, telefone ou interesse..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-3">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                className="border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white min-w-[150px]"
                            >
                                <option value="all">Todos os status</option>
                                <option value="new">🔥 Novos</option>
                                <option value="contacted">📞 Contatados</option>
                                <option value="qualified">🎯 Qualificados</option>
                                <option value="proposal">⭐ Propostas</option>
                                <option value="won">✅ Convertidos</option>
                                <option value="lost">❌ Perdidos</option>
                            </select>

                            <select
                                value={sourceFilter}
                                onChange={(e) => setSourceFilter(e.target.value as any)}
                                className="border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white min-w-[140px]"
                            >
                                <option value="all">Todas as origens</option>
                                <option value="website">🌐 Website</option>
                                <option value="facebook">📘 Facebook</option>
                                <option value="google">🔍 Google</option>
                                <option value="referral">👥 Indicação</option>
                                <option value="phone">📞 Telefone</option>
                                <option value="walk_in">🚶 Presencial</option>
                            </select>

                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value as any)}
                                className="border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white min-w-[130px]"
                            >
                                <option value="all">Todas prioridades</option>
                                <option value="high">🔥 Alta</option>
                                <option value="medium">⚡ Média</option>
                                <option value="low">🌱 Baixa</option>
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* Leads Grid */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center py-20"
                        >
                            <div className="relative">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-600 border-t-transparent absolute top-0"></div>
                            </div>
                        </motion.div>
                    ) : leads.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <TrendingUp className="h-10 w-10 text-amber-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Nenhum lead encontrado</h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                Ajuste os filtros para encontrar leads ou comece a capturar novos prospects.
                            </p>
                            <button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-medium inline-flex items-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                <Plus className="h-5 w-5" />
                                Capturar Primeiro Lead
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {leads.map((lead, index) => {
                                const statusConfig = getStatusConfig(lead.status)
                                return (
                                    <motion.div
                                        key={lead.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 group relative overflow-hidden"
                                    >
                                        {/* Score indicator */}
                                        <div className="absolute top-4 right-4 flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(lead.priority)}`} style={{ backgroundColor: 'currentColor' }}></div>
                                            <span className="text-xs font-semibold text-gray-600">{lead.score}</span>
                                        </div>

                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                                                    <span className="text-lg font-semibold text-amber-700">
                                                        {lead.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                                                        {lead.name}
                                                    </h3>
                                                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${statusConfig.color}`}>
                                                        {statusConfig.icon}
                                                        {statusConfig.label}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Interest & Budget */}
                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Building2 className="h-4 w-4 text-gray-500" />
                                                <span className="font-medium text-gray-700">{lead.property_interest}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <DollarSign className="h-4 w-4 text-green-600" />
                                                <span>{formatBudget(lead.budget_min, lead.budget_max)}</span>
                                            </div>
                                            {lead.location_interest && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{lead.location_interest}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Contact Info */}
                                        <div className="space-y-2 mb-4">
                                            {lead.email && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Mail className="h-4 w-4" />
                                                    <span className="truncate">{lead.email}</span>
                                                </div>
                                            )}
                                            {lead.phone && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Phone className="h-4 w-4" />
                                                    <span>{lead.phone}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Source & Timeline */}
                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                            <div className="flex items-center gap-1">
                                                <span>{getSourceIcon(lead.source)}</span>
                                                <span className="capitalize">{lead.source}</span>
                                            </div>
                                            <span>Criado: {formatDate(lead.created_at)}</span>
                                        </div>

                                        {/* Conversion Probability Bar */}
                                        <div className="mb-4">
                                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                <span>Probabilidade</span>
                                                <span>{lead.conversion_probability}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all"
                                                    style={{ width: `${lead.conversion_probability}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-4 border-t border-gray-100">
                                            <button
                                                onClick={() => openLeadDetail(lead)}
                                                className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 py-2 px-3 rounded-lg text-sm font-medium text-center transition-colors flex items-center justify-center gap-1"
                                            >
                                                <Eye className="h-4 w-4" />
                                                Ver
                                            </button>
                                            <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-3 rounded-lg text-sm font-medium text-center transition-colors flex items-center justify-center gap-1">
                                                <Phone className="h-4 w-4" />
                                                Contatar
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                <MoreVertical className="h-4 w-4 text-gray-500" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modal de Detalhes do Lead */}
            {selectedLead && (
                <LeadDetailModal
                    lead={selectedLead}
                    isOpen={showDetailModal}
                    onClose={() => setShowDetailModal(false)}
                    onUpdate={handleLeadUpdate}
                />
            )}
        </div>
    )
}
