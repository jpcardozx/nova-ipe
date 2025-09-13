'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LeadsService } from '@/lib/supabase/leads-service'
import type { Lead } from '@/app/types/database'
import {
    Users,
    Target,
    Handshake,
    CheckCircle,
    Plus,
    Search,
    Filter,
    Calendar,
    User,
    Phone,
    Mail,
    MapPin,
    DollarSign,
    Clock,
    Star,
    TrendingUp,
    ArrowRight,
    Building2,
    Eye,
    Edit3,
    MoreVertical,
    Activity,
    Zap,
    Award,
    AlertCircle,
    MessageSquare,
    FileText,
    ChevronRight,
    Timer,
    X
} from 'lucide-react'

interface FunnelStats {
    stage: string
    count: number
    value: number
    conversion_rate: number
    avg_time_in_stage: number
}

// TODO: Replace with actual API call to fetch leads from backend
// Mock data removed for production - connect to real funnel leads API
const mockLeads: Lead[] = []

// Mapear status dos leads para estágios do funil
const mapLeadToFunnelStage = (status: Lead['status']) => {
    switch (status) {
        case 'new': return 'captacao'
        case 'contacted': return 'qualificacao'
        case 'qualified': return 'negociacao'
        case 'proposal': return 'negociacao'
        case 'negotiation': return 'negociacao'
        case 'won': return 'fechamento'
        default: return 'captacao'
    }
}

// Extender Lead com campos do funil
const enrichLeadForFunnel = (lead: Lead) => ({
    ...lead,
    stage: mapLeadToFunnelStage(lead.status),
    probability: lead.conversion_probability || (lead.score || 50),
    value_potential: (lead.budget_max || lead.budget_min || 500000),
    activities_count: 0, // TODO: integrar com atividades reais
    property_type: 'apartment', // TODO: mapear do property_interest
    location_preference: lead.location_interest || 'Não especificado'
})

const stages = [
    {
        id: 'captacao',
        name: 'Captação',
        icon: Users,
        color: 'bg-blue-500',
        lightColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        description: 'Novos leads e primeiros contatos'
    },
    {
        id: 'qualificacao',
        name: 'Qualificação',
        icon: Target,
        color: 'bg-yellow-500',
        lightColor: 'bg-yellow-50',
        textColor: 'text-yellow-600',
        description: 'Validação de interesse e orçamento'
    },
    {
        id: 'negociacao',
        name: 'Negociação',
        icon: Handshake,
        color: 'bg-orange-500',
        lightColor: 'bg-orange-50',
        textColor: 'text-orange-600',
        description: 'Apresentação e discussão de propostas'
    },
    {
        id: 'fechamento',
        name: 'Fechamento',
        icon: CheckCircle,
        color: 'bg-green-500',
        lightColor: 'bg-green-50',
        textColor: 'text-green-600',
        description: 'Finalização e assinatura de contratos'
    }
]

const sourceIcons = {
    website: Building2,
    facebook: Users,
    instagram: Star,
    whatsapp: MessageSquare,
    referral: User,
    cold_call: Phone
}

const priorityConfig = {
    low: { color: 'bg-gray-100 text-gray-800', label: 'Baixa' },
    medium: { color: 'bg-blue-100 text-blue-800', label: 'Média' },
    high: { color: 'bg-orange-100 text-orange-800', label: 'Alta' },
    urgent: { color: 'bg-red-100 text-red-800', label: 'Urgente' }
}

export default function FunnelPage() {
    const [selectedStage, setSelectedStage] = useState<string>('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedLead, setSelectedLead] = useState<any | null>(null)
    const [draggedLead, setDraggedLead] = useState<string | null>(null)
    const [leads, setLeads] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadLeads()
    }, [])

    const loadLeads = async () => {
        setLoading(true)
        try {
            const { leads: realLeads, error } = await LeadsService.getLeads()

            if (error) {
                console.error('Erro ao carregar leads:', error)
                setLeads([])
            } else {
                // Enriquecer leads com dados do funil
                const enrichedLeads = (realLeads || []).map(enrichLeadForFunnel)
                setLeads(enrichedLeads)
            }
        } catch (error) {
            console.error('Error loading leads:', error)
            setLeads([])
        } finally {
            setLoading(false)
        }
    }
    //         const response = await fetch('/api/leads/funnel')
    //         const data = await response.json()
    //         setLeads(data)
    //     }
    //     loadLeads()
    // }, [])
    const dragOverStage = useRef<string | null>(null)

    const filteredLeads = leads.filter(lead => {
        const matchesStage = selectedStage === 'all' || lead.stage === selectedStage
        const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.phone.includes(searchTerm)
        return matchesStage && matchesSearch
    })

    const getStageLeads = (stageId: string) => {
        return leads.filter(lead => lead.stage === stageId)
    }

    const getStageStats = (stageId: string): FunnelStats => {
        const stageLeads = getStageLeads(stageId)
        const totalValue = stageLeads.reduce((sum, lead) => sum + lead.value_potential, 0)
        const avgScore = stageLeads.length > 0
            ? stageLeads.reduce((sum, lead) => sum + lead.score, 0) / stageLeads.length
            : 0

        return {
            stage: stageId,
            count: stageLeads.length,
            value: totalValue,
            conversion_rate: avgScore,
            avg_time_in_stage: Math.floor(Math.random() * 15) + 5 // Mock data
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

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600 bg-green-100'
        if (score >= 80) return 'text-blue-600 bg-blue-100'
        if (score >= 70) return 'text-yellow-600 bg-yellow-100'
        return 'text-red-600 bg-red-100'
    }

    const getProbabilityColor = (probability: number) => {
        if (probability >= 80) return 'bg-green-500'
        if (probability >= 60) return 'bg-yellow-500'
        return 'bg-red-500'
    }

    const handleDragStart = (e: React.DragEvent, leadId: string) => {
        setDraggedLead(leadId)
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (e: React.DragEvent, stageId: string) => {
        e.preventDefault()
        dragOverStage.current = stageId
    }

    const handleDrop = (e: React.DragEvent, stageId: string) => {
        e.preventDefault()
        if (draggedLead) {
            setLeads(prev => prev.map(lead =>
                lead.id === draggedLead
                    ? { ...lead, stage: stageId }
                    : lead
            ))
            setDraggedLead(null)
            dragOverStage.current = null
        }
    }

    const totalLeads = leads.length
    const totalValue = leads.reduce((sum, lead) => sum + lead.value_potential, 0)
    const avgConversionRate = leads.reduce((sum, lead) => sum + lead.probability, 0) / leads.length
    const hotLeads = leads.filter(lead => lead.priority === 'urgent' || lead.priority === 'high').length

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Funil de Vendas
                    </h1>
                    <p className="text-gray-600">
                        Gerencie seus leads do primeiro contato até o fechamento
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Novo Lead
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total de Leads</p>
                            <p className="text-3xl font-bold text-gray-900">{totalLeads}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-green-600">+2 esta semana</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Valor do Pipeline</p>
                            <p className="text-2xl font-bold text-green-600">
                                {formatCurrency(totalValue)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                            <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-gray-600">Potencial de receita</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Taxa de Conversão</p>
                            <p className="text-3xl font-bold text-blue-600">
                                {Math.round(avgConversionRate)}%
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Target className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-gray-600">Média do funil</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Leads Quentes</p>
                            <p className="text-3xl font-bold text-red-600">{hotLeads}</p>
                        </div>
                        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                            <Zap className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-red-600">Precisam atenção</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Buscar leads por nome, email ou telefone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                        <button
                            onClick={() => setSelectedStage('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedStage === 'all'
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Todos os Estágios
                        </button>
                        {stages.map(stage => (
                            <button
                                key={stage.id}
                                onClick={() => setSelectedStage(stage.id)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${selectedStage === stage.id
                                        ? `${stage.color} text-white`
                                        : `${stage.lightColor} ${stage.textColor} hover:bg-opacity-80`
                                    }`}
                            >
                                <stage.icon className="h-4 w-4" />
                                {stage.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                {stages.map(stage => {
                    const stageStats = getStageStats(stage.id)
                    const stageLeads = getStageLeads(stage.id)

                    return (
                        <div
                            key={stage.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                            onDragOver={(e) => handleDragOver(e, stage.id)}
                            onDrop={(e) => handleDrop(e, stage.id)}
                        >
                            {/* Stage Header */}
                            <div className={`${stage.lightColor} p-4 border-b border-gray-200`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 ${stage.color} rounded-lg flex items-center justify-center`}>
                                            <stage.icon className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <h3 className={`font-semibold ${stage.textColor}`}>
                                                {stage.name}
                                            </h3>
                                            <p className="text-xs text-gray-600">
                                                {stage.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900">
                                            {stageStats.count}
                                        </p>
                                        <p className="text-xs text-gray-600">leads</p>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-gray-600">
                                        <span>Valor Total</span>
                                        <span className="font-semibold">
                                            {formatCurrency(stageStats.value)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-600">
                                        <span>Score Médio</span>
                                        <span className="font-semibold">
                                            {Math.round(stageStats.conversion_rate)}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Stage Content */}
                            <div className="p-4 space-y-4 min-h-[500px] max-h-[600px] overflow-y-auto">
                                <AnimatePresence>
                                    {stageLeads.map((lead, index) => (
                                        <motion.div
                                            key={lead.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ delay: index * 0.1 }}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e as any, lead.id)}
                                            className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all cursor-move group"
                                            onClick={() => setSelectedLead(lead)}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-gray-900 truncate">
                                                        {lead.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 truncate">
                                                        {lead.email}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1 ml-2">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[lead.priority].color}`}>
                                                        {priorityConfig[lead.priority].label}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600 flex items-center gap-1">
                                                        <DollarSign className="h-3 w-3" />
                                                        Orçamento
                                                    </span>
                                                    <span className="font-semibold text-green-600 text-xs">
                                                        {formatCurrency(lead.budget_min)} - {formatCurrency(lead.budget_max)}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">Interesse</span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getScoreColor(lead.score)}`}>
                                                        {lead.score}%
                                                    </span>
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-600">Chance de fechar</span>
                                                        <span className="text-xs font-semibold">{lead.probability}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full transition-all ${getProbabilityColor(lead.probability)}`}
                                                            style={{ width: `${lead.probability}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    {React.createElement(sourceIcons[lead.source], { className: 'h-3 w-3' })}
                                                    <span className="capitalize">{lead.source.replace('_', ' ')}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Activity className="h-3 w-3" />
                                                    <span>{lead.activities_count} atividades</span>
                                                </div>
                                            </div>

                                            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(lead.last_contact).toLocaleDateString('pt-BR')}
                                                </span>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-1 hover:bg-blue-100 rounded text-blue-600 transition-all">
                                                        <Phone className="h-3 w-3" />
                                                    </button>
                                                    <button className="p-1 hover:bg-green-100 rounded text-green-600 transition-all">
                                                        <MessageSquare className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {stageLeads.length === 0 && (
                                    <div className="text-center py-8 text-gray-400">
                                        <stage.icon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Nenhum lead neste estágio</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Lead Details Modal */}
            <AnimatePresence>
                {selectedLead && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedLead(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                            {selectedLead.name}
                                        </h2>
                                        <div className="flex items-center gap-4 text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Mail className="h-4 w-4" />
                                                {selectedLead.email}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Phone className="h-4 w-4" />
                                                {selectedLead.phone}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${priorityConfig[selectedLead.priority].color}`}>
                                            {priorityConfig[selectedLead.priority].label}
                                        </span>
                                        <button
                                            onClick={() => setSelectedLead(null)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-3">Informações do Lead</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Score</span>
                                                <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getScoreColor(selectedLead.score)}`}>
                                                    {selectedLead.score}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Probabilidade</span>
                                                <span className="font-semibold">{selectedLead.probability}%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Valor Potencial</span>
                                                <span className="font-semibold text-green-600">
                                                    {formatCurrency(selectedLead.value_potential)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Origem</span>
                                                <span className="capitalize">{selectedLead.source.replace('_', ' ')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-3">Preferências</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Tipo de Imóvel</span>
                                                <span className="capitalize">{selectedLead.property_type}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Orçamento</span>
                                                <span className="text-right">
                                                    {formatCurrency(selectedLead.budget_min)} - <br />
                                                    {formatCurrency(selectedLead.budget_max)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Localização</span>
                                                <span className="text-right">{selectedLead.location_preference}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3">Observações</h3>
                                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                                        {selectedLead.notes}
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        Ligar
                                    </button>
                                    <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                                        <MessageSquare className="h-4 w-4" />
                                        WhatsApp
                                    </button>
                                    <button className="flex-1 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Agendar
                                    </button>
                                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                        <Edit3 className="h-4 w-4" />
                                        Editar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}