'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import {
    Target,
    Plus,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    Play,
    Pause,
    BarChart3,
    Users,
    TrendingUp,
    DollarSign,
    Calendar,
    Globe,
    Mail,
    Facebook,
    Instagram,
    MessageCircle
} from 'lucide-react'

interface Campaign {
    id: string
    name: string
    type: 'social_media' | 'email' | 'seo' | 'ppc' | 'print' | 'other'
    status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
    budget: number
    spent: number
    impressions: number
    clicks: number
    leads: number
    conversions: number
    start_date: string
    end_date: string
    target_audience: string
    created_at: string
}

export default function CampaignsPage() {
    const { user } = useCurrentUser()
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | Campaign['status']>('all')
    const [typeFilter, setTypeFilter] = useState<'all' | Campaign['type']>('all')

    useEffect(() => {
        loadCampaigns()
    }, [])

    const loadCampaigns = async () => {
        try {
            // Simulando dados de campanhas
            const mockCampaigns: Campaign[] = [
                {
                    id: '1',
                    name: 'Apartamentos Premium - Itaim',
                    type: 'social_media',
                    status: 'active',
                    budget: 5000,
                    spent: 3200,
                    impressions: 45000,
                    clicks: 2300,
                    leads: 89,
                    conversions: 12,
                    start_date: '2025-01-01',
                    end_date: '2025-01-31',
                    target_audience: 'Executivos 30-45 anos, renda alta',
                    created_at: '2024-12-28T10:00:00.000Z'
                },
                {
                    id: '2',
                    name: 'Casas Familiares - Zona Sul',
                    type: 'ppc',
                    status: 'active',
                    budget: 8000,
                    spent: 4500,
                    impressions: 28000,
                    clicks: 1850,
                    leads: 67,
                    conversions: 8,
                    start_date: '2025-01-05',
                    end_date: '2025-02-05',
                    target_audience: 'Famílias com filhos, 25-40 anos',
                    created_at: '2025-01-02T14:30:00.000Z'
                },
                {
                    id: '3',
                    name: 'Newsletter Mensal',
                    type: 'email',
                    status: 'completed',
                    budget: 500,
                    spent: 500,
                    impressions: 12000,
                    clicks: 890,
                    leads: 34,
                    conversions: 5,
                    start_date: '2024-12-01',
                    end_date: '2024-12-31',
                    target_audience: 'Base de clientes existente',
                    created_at: '2024-11-25T09:15:00.000Z'
                },
                {
                    id: '4',
                    name: 'Imóveis de Luxo - São Paulo',
                    type: 'social_media',
                    status: 'paused',
                    budget: 12000,
                    spent: 2800,
                    impressions: 18000,
                    clicks: 750,
                    leads: 23,
                    conversions: 2,
                    start_date: '2024-12-15',
                    end_date: '2025-02-15',
                    target_audience: 'Alto padrão, 35+ anos',
                    created_at: '2024-12-10T16:45:00.000Z'
                }
            ]

            setCampaigns(mockCampaigns)
        } catch (error) {
            console.error('Error loading campaigns:', error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadge = (status: Campaign['status']) => {
        const styles = {
            draft: 'bg-gray-100 text-gray-800',
            active: 'bg-green-100 text-green-800',
            paused: 'bg-yellow-100 text-yellow-800',
            completed: 'bg-blue-100 text-blue-800',
            cancelled: 'bg-red-100 text-red-800'
        }
        
        const labels = {
            draft: 'Rascunho',
            active: 'Ativa',
            paused: 'Pausada',
            completed: 'Finalizada',
            cancelled: 'Cancelada'
        }

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
                {labels[status]}
            </span>
        )
    }

    const getTypeIcon = (type: Campaign['type']) => {
        const icons = {
            social_media: Facebook,
            email: Mail,
            seo: Globe,
            ppc: Target,
            print: Target,
            other: Target
        }
        
        return icons[type] || Target
    }

    const getTypeLabel = (type: Campaign['type']) => {
        const labels = {
            social_media: 'Redes Sociais',
            email: 'Email Marketing',
            seo: 'SEO',
            ppc: 'Google Ads',
            print: 'Mídia Impressa',
            other: 'Outros'
        }
        
        return labels[type]
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value)
    }

    const calculateCTR = (clicks: number, impressions: number) => {
        return impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00'
    }

    const calculateCPC = (spent: number, clicks: number) => {
        return clicks > 0 ? (spent / clicks).toFixed(2) : '0.00'
    }

    const filteredCampaigns = campaigns.filter(campaign => {
        const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter
        const matchesType = typeFilter === 'all' || campaign.type === typeFilter
        
        return matchesSearch && matchesStatus && matchesType
    })

    // Calcular métricas totais
    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0)
    const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0)
    const totalLeads = campaigns.reduce((sum, c) => sum + c.leads, 0)
    const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0)
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando campanhas...</p>
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
                    <h1 className="text-2xl font-bold text-gray-900">Campanhas</h1>
                    <p className="text-gray-600">Gerencie suas campanhas de marketing</p>
                </div>
                
                <button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:from-amber-600 hover:to-amber-700 transition-all">
                    <Plus className="h-4 w-4" />
                    Nova Campanha
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Target className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Campanhas Ativas</p>
                            <p className="text-2xl font-bold text-gray-900">{activeCampaigns}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Orçamento Total</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBudget)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Gasto Total</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Users className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Leads Gerados</p>
                            <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                            <BarChart3 className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Conversões</p>
                            <p className="text-2xl font-bold text-gray-900">{totalConversions}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar campanhas..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                        <option value="all">Todos os status</option>
                        <option value="draft">Rascunho</option>
                        <option value="active">Ativa</option>
                        <option value="paused">Pausada</option>
                        <option value="completed">Finalizada</option>
                        <option value="cancelled">Cancelada</option>
                    </select>

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                        <option value="all">Todos os tipos</option>
                        <option value="social_media">Redes Sociais</option>
                        <option value="email">Email Marketing</option>
                        <option value="seo">SEO</option>
                        <option value="ppc">Google Ads</option>
                        <option value="print">Mídia Impressa</option>
                        <option value="other">Outros</option>
                    </select>
                </div>
            </div>

            {/* Campaigns List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {filteredCampaigns.length === 0 ? (
                    <div className="p-12 text-center">
                        <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma campanha encontrada</h3>
                        <p className="text-gray-500 mb-4">Não há campanhas que correspondam aos filtros selecionados.</p>
                        <button className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-lg font-medium">
                            Criar Primeira Campanha
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredCampaigns.map((campaign) => {
                            const TypeIcon = getTypeIcon(campaign.type)
                            const budgetUsed = (campaign.spent / campaign.budget) * 100
                            
                            return (
                                <motion.div
                                    key={campaign.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-6 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="flex items-center gap-2">
                                                    <TypeIcon className="h-5 w-5 text-gray-400" />
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {campaign.name}
                                                    </h3>
                                                </div>
                                                {getStatusBadge(campaign.status)}
                                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                                    {getTypeLabel(campaign.type)}
                                                </span>
                                            </div>

                                            {/* Budget Progress */}
                                            <div className="mb-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm text-gray-600">Orçamento Utilizado</span>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)} ({budgetUsed.toFixed(0)}%)
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className={`h-2 rounded-full ${
                                                            budgetUsed > 90 ? 'bg-red-500' : 
                                                            budgetUsed > 70 ? 'bg-yellow-500' : 
                                                            'bg-green-500'
                                                        }`}
                                                        style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {/* Campaign Metrics */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-500">Impressões</p>
                                                    <p className="font-semibold text-gray-900">{campaign.impressions.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Cliques</p>
                                                    <p className="font-semibold text-gray-900">{campaign.clicks.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">CTR</p>
                                                    <p className="font-semibold text-gray-900">{calculateCTR(campaign.clicks, campaign.impressions)}%</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">CPC</p>
                                                    <p className="font-semibold text-gray-900">R$ {calculateCPC(campaign.spent, campaign.clicks)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Leads</p>
                                                    <p className="font-semibold text-gray-900">{campaign.leads}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Conversões</p>
                                                    <p className="font-semibold text-gray-900">{campaign.conversions}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Taxa Conversão</p>
                                                    <p className="font-semibold text-gray-900">
                                                        {campaign.leads > 0 ? ((campaign.conversions / campaign.leads) * 100).toFixed(1) : 0}%
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Período</p>
                                                    <p className="font-semibold text-gray-900">
                                                        {new Date(campaign.start_date).toLocaleDateString('pt-BR')} - {new Date(campaign.end_date).toLocaleDateString('pt-BR')}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Target Audience */}
                                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Público-alvo:</span> {campaign.target_audience}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 ml-4">
                                            {campaign.status === 'active' && (
                                                <button className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                                                    <Pause className="h-4 w-4" />
                                                </button>
                                            )}
                                            {campaign.status === 'paused' && (
                                                <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                                    <Play className="h-4 w-4" />
                                                </button>
                                            )}
                                            <button className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </div>
        </motion.div>
    )
}