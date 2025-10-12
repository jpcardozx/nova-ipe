'use client'

/**
 * Jetimob Dashboard - UI/UX S-Tier
 * 5 Tabs com as 10 funcionalidades principais
 * Design System: shadcn/ui + CSS Variables + Dark Mode
 */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Building2,
    Users,
    Globe,
    Settings,
    TrendingUp,
    Eye,
    Home,
    Phone,
    Mail,
    MapPin,
    Calendar,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Clock,
    BarChart3,
    Image as ImageIcon,
    ExternalLink,
    ChevronRight,
    Search,
    Filter,
    Download
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { isJetimobConfigured } from '@/lib/jetimob/jetimob-service'
import {
    useJetimobProperties,
    useJetimobLeads,
    useJetimobPortals,
    useJetimobAnuncios,
    useJetimobEstatisticas,
    useJetimobCorretores
} from '@/lib/jetimob/use-jetimob-query'

// Types
type TabType = 'overview' | 'properties' | 'leads' | 'portals' | 'settings'

export default function JetimobDashboard() {
    const [activeTab, setActiveTab] = useState<TabType>('overview')
    const [searchQuery, setSearchQuery] = useState('')

    // Check configuration
    const isConfigured = isJetimobConfigured()

    // Queries
    const { data: properties = [], isLoading: propertiesLoading, error: propertiesError, refetch: refetchProperties } = useJetimobProperties()
    const { data: leads = [], isLoading: leadsLoading, error: leadsError, refetch: refetchLeads } = useJetimobLeads()
    const { data: portals = [], isLoading: portalsLoading, error: portalsError, refetch: refetchPortals } = useJetimobPortals()
    const { data: anuncios = [], isLoading: anunciosLoading, refetch: refetchAnuncios } = useJetimobAnuncios()
    const { data: estatisticas, isLoading: estatisticasLoading, refetch: refetchEstatisticas } = useJetimobEstatisticas('mes')
    const { data: corretores = [], isLoading: corretoresLoading } = useJetimobCorretores()

    const isLoading = propertiesLoading || leadsLoading || portalsLoading
    const hasError = propertiesError || leadsError || portalsError

    // Refresh all data
    const refreshAll = () => {
        refetchProperties()
        refetchLeads()
        refetchPortals()
        refetchAnuncios()
        refetchEstatisticas()
    }

    // Tabs configuration
    const tabs = [
        { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
        { id: 'properties' as const, label: 'Imóveis', icon: Building2 },
        { id: 'leads' as const, label: 'Leads', icon: Users },
        { id: 'portals' as const, label: 'Portais', icon: Globe },
        { id: 'settings' as const, label: 'Configurações', icon: Settings },
    ]

    // Configuration not ready
    if (!isConfigured) {
        return <ConfigurationScreen />
    }

    // Error state
    if (hasError && !isLoading) {
        return <ErrorScreen onRetry={refreshAll} error={propertiesError || leadsError || portalsError} />
    }

    return (
        <div className="min-h-screen bg-[var(--color-background)]">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[var(--color-surface)]/95 backdrop-blur-sm border-b border-[var(--color-border)] shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary)]/70 flex items-center justify-center shadow-lg">
                                <Building2 className="h-5 w-5 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-[var(--color-foreground)]">Jetimob Integration</h1>
                                <p className="text-xs text-[var(--color-muted-foreground)]">Gestão completa de imóveis e portais</p>
                            </div>
                        </div>

                        <button
                            onClick={refreshAll}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                            <span className="text-sm font-medium">Atualizar</span>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 -mb-px">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-2 px-4 py-3 border-b-2 transition-all
                                    ${activeTab === tab.id
                                        ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/5'
                                        : 'border-transparent text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-muted)]/50'
                                    }
                                `}
                            >
                                <tab.icon className="h-4 w-4" strokeWidth={2} />
                                <span className="text-sm font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'overview' && (
                            <OverviewTab
                                estatisticas={estatisticas}
                                properties={properties}
                                leads={leads}
                                portals={portals}
                                anuncios={anuncios}
                                isLoading={estatisticasLoading}
                            />
                        )}
                        {activeTab === 'properties' && (
                            <PropertiesTab
                                properties={properties}
                                isLoading={propertiesLoading}
                                searchQuery={searchQuery}
                                onSearchChange={setSearchQuery}
                            />
                        )}
                        {activeTab === 'leads' && (
                            <LeadsTab
                                leads={leads}
                                isLoading={leadsLoading}
                                properties={properties}
                            />
                        )}
                        {activeTab === 'portals' && (
                            <PortalsTab
                                portals={portals}
                                anuncios={anuncios}
                                isLoading={portalsLoading || anunciosLoading}
                            />
                        )}
                        {activeTab === 'settings' && (
                            <SettingsTab
                                corretores={corretores}
                                isLoading={corretoresLoading}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    )
}

// ==================== TAB 1: OVERVIEW ====================

function OverviewTab({ estatisticas, properties, leads, portals, anuncios, isLoading }: any) {
    const stats = useMemo(() => {
        if (estatisticas) {
            return [
                {
                    label: 'Total de Imóveis',
                    value: estatisticas.total_imoveis,
                    change: '+0%',
                    icon: Building2,
                    color: 'blue'
                },
                {
                    label: 'Imóveis Ativos',
                    value: estatisticas.imoveis_ativos,
                    change: `${((estatisticas.imoveis_ativos / estatisticas.total_imoveis) * 100).toFixed(0)}%`,
                    icon: CheckCircle2,
                    color: 'green'
                },
                {
                    label: 'Leads Recebidos',
                    value: estatisticas.leads_recebidos,
                    change: `+${estatisticas.leads_recebidos}`,
                    icon: Users,
                    color: 'purple'
                },
                {
                    label: 'Taxa de Conversão',
                    value: `${estatisticas.taxa_conversao.toFixed(1)}%`,
                    change: `${estatisticas.leads_convertidos} convertidos`,
                    icon: TrendingUp,
                    color: 'orange'
                },
                {
                    label: 'Portais Ativos',
                    value: estatisticas.portais_ativos,
                    change: `${estatisticas.anuncios_ativos} anúncios`,
                    icon: Globe,
                    color: 'indigo'
                },
            ]
        }

        // Fallback para dados calculados
        return [
            {
                label: 'Total de Imóveis',
                value: properties?.length || 0,
                change: '+0%',
                icon: Building2,
                color: 'blue'
            },
            {
                label: 'Imóveis Ativos',
                value: properties?.filter((p: any) => p.status === 'active').length || 0,
                change: '---',
                icon: CheckCircle2,
                color: 'green'
            },
            {
                label: 'Total de Leads',
                value: leads?.length || 0,
                change: `${leads?.filter((l: any) => l.status === 'new').length || 0} novos`,
                icon: Users,
                color: 'purple'
            },
            {
                label: 'Portais Ativos',
                value: portals?.filter((p: any) => p.status === 'active').length || 0,
                change: `${anuncios?.length || 0} anúncios`,
                icon: Globe,
                color: 'indigo'
            },
        ]
    }, [estatisticas, properties, leads, portals, anuncios])

    if (isLoading) {
        return <LoadingSkeleton />
    }

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard
                    title="Performance por Portal"
                    description="Visualizações e leads nos últimos 30 dias"
                    data={portals}
                />
                <ChartCard
                    title="Leads por Status"
                    description="Distribuição de leads por estágio do funil"
                    data={leads}
                />
            </div>

            {/* Recent Activity */}
            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
                <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-4">Atividade Recente</h3>
                <div className="space-y-3">
                    {leads?.slice(0, 5).map((lead: any, index: number) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                                    <Users className="h-4 w-4 text-[var(--color-primary)]" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[var(--color-foreground)]">{lead.name}</p>
                                    <p className="text-xs text-[var(--color-muted-foreground)]">{lead.source} • {lead.created_at ? format(new Date(lead.created_at), 'dd/MM/yyyy', { locale: ptBR }) : 'N/A'}</p>
                                </div>
                            </div>
                            <StatusBadge status={lead.status} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// Stat Card Component
function StatCard({ label, value, change, icon: Icon, color }: any) {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        purple: 'from-purple-500 to-purple-600',
        orange: 'from-orange-500 to-orange-600',
        indigo: 'from-indigo-500 to-indigo-600',
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" strokeWidth={2} />
                </div>
            </div>
            <div>
                <p className="text-3xl font-bold text-[var(--color-foreground)] mb-1">{value}</p>
                <p className="text-sm font-medium text-[var(--color-muted-foreground)] mb-1">{label}</p>
                <p className="text-xs text-[var(--color-muted-foreground)]">{change}</p>
            </div>
        </motion.div>
    )
}

// Chart Card Placeholder
function ChartCard({ title, description, data }: any) {
    return (
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-[var(--color-foreground)]">{title}</h3>
                <p className="text-sm text-[var(--color-muted-foreground)]">{description}</p>
            </div>
            <div className="h-48 flex items-center justify-center bg-[var(--color-muted)]/20 rounded-lg border border-dashed border-[var(--color-border)]">
                <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-[var(--color-muted-foreground)] mx-auto mb-2" />
                    <p className="text-sm text-[var(--color-muted-foreground)]">Gráfico em desenvolvimento</p>
                </div>
            </div>
        </div>
    )
}

// Status Badge
function StatusBadge({ status }: { status: string }) {
    const statusConfig = {
        new: { label: 'Novo', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
        contacted: { label: 'Contatado', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
        qualified: { label: 'Qualificado', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
        converted: { label: 'Convertido', color: 'bg-green-500/10 text-green-600 border-green-500/20' },
        active: { label: 'Ativo', color: 'bg-green-500/10 text-green-600 border-green-500/20' },
        inactive: { label: 'Inativo', color: 'bg-gray-500/10 text-gray-600 border-gray-500/20' },
        ativo: { label: 'Ativo', color: 'bg-green-500/10 text-green-600 border-green-500/20' },
        inativo: { label: 'Inativo', color: 'bg-gray-500/10 text-gray-600 border-gray-500/20' },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
            {config.label}
        </span>
    )
}

// Loading Skeleton
function LoadingSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 h-40" />
                ))}
            </div>
        </div>
    )
}

// ==================== TAB 2: PROPERTIES ====================

function PropertiesTab({ properties, isLoading, searchQuery, onSearchChange }: any) {
    const filteredProperties = useMemo(() => {
        if (!searchQuery) return properties
        
        return properties.filter((property: any) =>
            property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.address?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.address?.neighborhood?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [properties, searchQuery])

    if (isLoading) {
        return <LoadingSkeleton />
    }

    return (
        <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-muted-foreground)]" />
                    <input
                        type="text"
                        placeholder="Buscar imóveis por título, cidade ou bairro..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] hover:bg-[var(--color-muted)]/50 transition-colors">
                    <Filter className="h-5 w-5" />
                    <span className="text-sm font-medium">Filtros</span>
                </button>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property: any, index: number) => (
                    <PropertyCard key={property.id || index} property={property} />
                ))}
            </div>

            {filteredProperties.length === 0 && (
                <div className="text-center py-12">
                    <Building2 className="h-12 w-12 text-[var(--color-muted-foreground)] mx-auto mb-4" />
                    <p className="text-lg font-medium text-[var(--color-foreground)]">Nenhum imóvel encontrado</p>
                    <p className="text-sm text-[var(--color-muted-foreground)]">Tente ajustar os filtros de busca</p>
                </div>
            )}
        </div>
    )
}

// Property Card Component
function PropertyCard({ property }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
        >
            {/* Image */}
            <div className="relative h-48 bg-[var(--color-muted)]/20 overflow-hidden">
                {property.images?.[0] ? (
                    <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-[var(--color-muted-foreground)]" />
                    </div>
                )}
                <div className="absolute top-3 right-3">
                    <StatusBadge status={property.status} />
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-2 line-clamp-1">{property.title || property.property_type}</h3>
                
                <div className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] mb-3">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{property.address?.city || 'N/A'} - {property.address?.neighborhood || 'N/A'}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                    <div className="flex items-center gap-1">
                        <Home className="h-4 w-4 text-[var(--color-muted-foreground)]" />
                        <span className="text-[var(--color-foreground)]">{property.bedrooms || 0} qt</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Home className="h-4 w-4 text-[var(--color-muted-foreground)]" />
                        <span className="text-[var(--color-foreground)]">{property.bathrooms || 0} bh</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Home className="h-4 w-4 text-[var(--color-muted-foreground)]" />
                        <span className="text-[var(--color-foreground)]">{property.area || 0}m²</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-[var(--color-muted-foreground)]">Valor</p>
                        <p className="text-xl font-bold text-[var(--color-foreground)]">
                            {property.price ? `R$ ${property.price.toLocaleString('pt-BR')}` : 'N/A'}
                        </p>
                    </div>
                    <button className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors text-sm font-medium">
                        Ver Detalhes
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

// ==================== TAB 3: LEADS ====================

function LeadsTab({ leads, isLoading, properties }: any) {
    const leadsByStatus = useMemo(() => {
        const grouped = {
            new: leads.filter((l: any) => l.status === 'new'),
            contacted: leads.filter((l: any) => l.status === 'contacted'),
            qualified: leads.filter((l: any) => l.status === 'qualified'),
            converted: leads.filter((l: any) => l.status === 'converted'),
        }
        return grouped
    }, [leads])

    if (isLoading) {
        return <LoadingSkeleton />
    }

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-[var(--color-muted-foreground)]">Novos</p>
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[var(--color-foreground)]">{leadsByStatus.new.length}</p>
                </div>
                <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-[var(--color-muted-foreground)]">Contatados</p>
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                            <Phone className="h-4 w-4 text-yellow-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[var(--color-foreground)]">{leadsByStatus.contacted.length}</p>
                </div>
                <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-[var(--color-muted-foreground)]">Qualificados</p>
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-purple-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[var(--color-foreground)]">{leadsByStatus.qualified.length}</p>
                </div>
                <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-[var(--color-muted-foreground)]">Convertidos</p>
                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[var(--color-foreground)]">{leadsByStatus.converted.length}</p>
                </div>
            </div>

            {/* Leads List */}
            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
                <div className="p-6 border-b border-[var(--color-border)]">
                    <h3 className="text-lg font-semibold text-[var(--color-foreground)]">Todos os Leads</h3>
                </div>
                <div className="divide-y divide-[var(--color-border)]">
                    {leads.map((lead: any, index: number) => (
                        <LeadRow key={lead.id || index} lead={lead} properties={properties} />
                    ))}
                </div>
            </div>
        </div>
    )
}

// Lead Row Component
function LeadRow({ lead, properties }: any) {
    const property = properties?.find((p: any) => p.id === lead.property_id)

    return (
        <div className="p-4 hover:bg-[var(--color-muted)]/30 transition-colors">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary)]/70 flex items-center justify-center text-white font-semibold">
                        {lead.name?.charAt(0).toUpperCase() || 'L'}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-[var(--color-foreground)]">{lead.name}</h4>
                            <StatusBadge status={lead.status} />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-[var(--color-muted-foreground)] mb-2">
                            <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {lead.email}
                            </span>
                            <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {lead.phone}
                            </span>
                        </div>
                        <p className="text-xs text-[var(--color-muted-foreground)]">
                            {property?.title || `Imóvel ${lead.property_id}`} • {lead.source} • {lead.created_at ? format(new Date(lead.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 'N/A'}
                        </p>
                        {lead.message && (
                            <p className="text-sm text-[var(--color-foreground)] mt-2 line-clamp-2">{lead.message}</p>
                        )}
                    </div>
                </div>
                <button className="px-3 py-1.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors text-xs font-medium">
                    Ver Detalhes
                </button>
            </div>
        </div>
    )
}

// ==================== TAB 4: PORTALS ====================

function PortalsTab({ portals, anuncios, isLoading }: any) {
    if (isLoading) {
        return <LoadingSkeleton />
    }

    return (
        <div className="space-y-6">
            {/* Portals Grid */}
            <div>
                <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-4">Portais Integrados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portals.map((portal: any, index: number) => (
                        <PortalCard key={portal.id || index} portal={portal} anuncios={anuncios} />
                    ))}
                </div>
            </div>

            {/* Anúncios List */}
            <div>
                <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-4">Anúncios Publicados</h3>
                <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] divide-y divide-[var(--color-border)]">
                    {anuncios.map((anuncio: any, index: number) => (
                        <AnuncioRow key={anuncio.id || index} anuncio={anuncio} />
                    ))}
                </div>
            </div>
        </div>
    )
}

// Portal Card Component
function PortalCard({ portal, anuncios }: any) {
    const portalAnuncios = anuncios.filter((a: any) => a.portal_id === portal.id)
    const isActive = portal.status === 'active'

    return (
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h4 className="text-lg font-semibold text-[var(--color-foreground)] mb-1">{portal.name}</h4>
                    <p className="text-sm text-[var(--color-muted-foreground)]">{portalAnuncios.length} anúncios</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-muted-foreground)]">Status</span>
                    <StatusBadge status={portal.status} />
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-muted-foreground)]">Sincronização</span>
                    <span className="text-[var(--color-foreground)]">{portal.configuration?.auto_sync ? 'Automática' : 'Manual'}</span>
                </div>
            </div>

            <button className="w-full px-4 py-2 bg-[var(--color-muted)]/50 text-[var(--color-foreground)] rounded-lg hover:bg-[var(--color-muted)] transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <Globe className="h-4 w-4" />
                Ver Portal
            </button>
        </div>
    )
}

// Anuncio Row Component
function AnuncioRow({ anuncio }: any) {
    return (
        <div className="p-4 hover:bg-[var(--color-muted)]/30 transition-colors">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-[var(--color-muted)]/50 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-[var(--color-muted-foreground)]" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-[var(--color-foreground)]">Imóvel {anuncio.imovel_codigo}</h4>
                            <StatusBadge status={anuncio.status} />
                        </div>
                        <p className="text-xs text-[var(--color-muted-foreground)]">
                            {anuncio.portal_nome} • Publicado em {anuncio.data_publicacao ? format(new Date(anuncio.data_publicacao), 'dd/MM/yyyy', { locale: ptBR }) : 'N/A'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {anuncio.visualizacoes !== undefined && (
                        <div className="text-right">
                            <p className="text-sm font-semibold text-[var(--color-foreground)]">{anuncio.visualizacoes}</p>
                            <p className="text-xs text-[var(--color-muted-foreground)]">visualizações</p>
                        </div>
                    )}
                    {anuncio.url_anuncio && (
                        <a
                            href={anuncio.url_anuncio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors"
                        >
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}

// ==================== TAB 5: SETTINGS ====================

function SettingsTab({ corretores, isLoading }: any) {
    if (isLoading) {
        return <LoadingSkeleton />
    }

    return (
        <div className="space-y-6">
            {/* API Info */}
            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
                <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-4">Informações da API</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-[var(--color-border)]">
                        <span className="text-sm text-[var(--color-muted-foreground)]">Status da Conexão</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-sm font-medium text-[var(--color-foreground)]">Conectado</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-[var(--color-border)]">
                        <span className="text-sm text-[var(--color-muted-foreground)]">Modo da API</span>
                        <span className="text-sm font-medium text-[var(--color-foreground)]">Somente Leitura</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-[var(--color-muted-foreground)]">Documentação</span>
                        <a
                            href="https://jetimob.docs.apiary.io"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-[var(--color-primary)] hover:underline"
                        >
                            Ver Documentação
                        </a>
                    </div>
                </div>
            </div>

            {/* Corretores */}
            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
                <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-4">Equipe de Corretores</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {corretores.map((corretor: any, index: number) => (
                        <CorretorCard key={corretor.id || index} corretor={corretor} />
                    ))}
                </div>
            </div>

            {/* Warning */}
            <div className="bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-[var(--color-warning)] flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-[var(--color-warning)] mb-1">API Somente Leitura</p>
                        <p className="text-xs text-[var(--color-warning)]/80">
                            A API da Jetimob é somente leitura. Para criar, editar ou deletar imóveis, leads e anúncios, 
                            utilize o <a href="https://jetimob.com" target="_blank" rel="noopener noreferrer" className="underline">painel web da Jetimob</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Corretor Card Component
function CorretorCard({ corretor }: any) {
    return (
        <div className="flex items-center gap-4 p-4 bg-[var(--color-muted)]/20 rounded-lg border border-[var(--color-border)]">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary)]/70 flex items-center justify-center text-white font-semibold text-lg">
                {corretor.nome?.charAt(0).toUpperCase() || 'C'}
            </div>
            <div className="flex-1">
                <h4 className="text-sm font-semibold text-[var(--color-foreground)]">{corretor.nome}</h4>
                <p className="text-xs text-[var(--color-muted-foreground)]">{corretor.creci ? `CRECI ${corretor.creci}` : 'Corretor'}</p>
                <div className="flex items-center gap-3 mt-1">
                    {corretor.email && (
                        <a href={`mailto:${corretor.email}`} className="text-xs text-[var(--color-primary)] hover:underline">
                            Email
                        </a>
                    )}
                    {corretor.telefone && (
                        <a href={`tel:${corretor.telefone}`} className="text-xs text-[var(--color-primary)] hover:underline">
                            Telefone
                        </a>
                    )}
                </div>
            </div>
            {corretor.ativo && (
                <div className="w-2 h-2 rounded-full bg-green-500" />
            )}
        </div>
    )
}

// ==================== ERROR & CONFIG SCREENS ====================

function ConfigurationScreen() {
    return (
        <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-6">
            <div className="bg-[var(--color-surface)] rounded-xl shadow-2xl border border-[var(--color-border)] p-8 max-w-md w-full">
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary)]/20 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                        <Building2 className="h-10 w-10 text-[var(--color-primary)]" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-3">Jetimob Integration</h2>
                    <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-6">
                        Configure suas credenciais da Jetimob para sincronizar seus imóveis com os principais portais imobiliários.
                    </p>
                </div>

                <div className="bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/30 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-[var(--color-warning)] flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-[var(--color-warning)] mb-1">Configuração Necessária</p>
                            <p className="text-xs text-[var(--color-warning)]/80 leading-relaxed">
                                Adicione as seguintes variáveis no arquivo <code className="bg-black/10 px-1 py-0.5 rounded">.env.local</code>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--color-muted)]/20 rounded-lg p-4 mb-6 font-mono text-xs">
                    <code className="text-[var(--color-foreground)] block mb-1">NEXT_PUBLIC_JETIMOB_WEBSERVICE_KEY=xxx</code>
                    <code className="text-[var(--color-foreground)] block mb-1">NEXT_PUBLIC_JETIMOB_PUBLIC_KEY=xxx</code>
                    <code className="text-[var(--color-foreground)] block">NEXT_PUBLIC_JETIMOB_PRIVATE_KEY=xxx</code>
                </div>

                <a
                    href="https://jetimob.docs.apiary.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-4 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors text-center font-medium"
                >
                    Ver Documentação
                </a>
            </div>
        </div>
    )
}

function ErrorScreen({ onRetry, error }: any) {
    return (
        <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-6">
            <div className="bg-[var(--color-surface)] rounded-xl shadow-2xl border border-[var(--color-border)] p-8 max-w-md w-full text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <XCircle className="h-10 w-10 text-red-600" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-3">Erro na Conexão</h2>
                <p className="text-[var(--color-muted-foreground)] mb-6">
                    {error?.message || 'Não foi possível conectar à API da Jetimob. Verifique sua conexão e tente novamente.'}
                </p>
                <button
                    onClick={onRetry}
                    className="w-full px-4 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors font-medium"
                >
                    Tentar Novamente
                </button>
            </div>
        </div>
    )
}
