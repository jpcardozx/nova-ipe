'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Building2,
    Users,
    TrendingUp,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    Settings,
    Upload,
    Eye,
    Edit,
    Trash2,
    Share2,
    Plus
} from 'lucide-react'
import {
    useJetimobProperties,
    useJetimobLeads,
    useJetimobPortals
    // Future imports for mutations:
    // useCreateJetimobProperty,
    // useUpdateJetimobProperty,
    // useDeleteJetimobProperty,
    // useUpdateLeadStatus,
    // useSyncPropertyToPortals
} from '@/lib/jetimob/use-jetimob-query'
import { isJetimobConfigured } from '@/lib/jetimob/jetimob-service'

export default function JetimobDashboard() {
    const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'leads' | 'portals' | 'settings'>('overview')

    // Check if Jetimob is configured
    const isConfigured = isJetimobConfigured()

    // Queries
    const { 
        data: properties = [], 
        isLoading: propertiesLoading, 
        error: propertiesError,
        refetch: refetchProperties 
    } = useJetimobProperties()
    
    const { 
        data: leads = [], 
        isLoading: leadsLoading,
        error: leadsError,
        refetch: refetchLeads 
    } = useJetimobLeads()
    
    const { 
        data: portals = [], 
        isLoading: portalsLoading,
        error: portalsError,
        refetch: refetchPortals 
    } = useJetimobPortals()

    // Mutations (future use)
    // const createProperty = useCreateJetimobProperty()
    // const updateProperty = useUpdateJetimobProperty()
    // const deleteProperty = useDeleteJetimobProperty()
    // const updateLeadStatus = useUpdateLeadStatus()
    // const syncToPortals = useSyncPropertyToPortals()

    // Calculate statistics from data
    const stats = {
        totalProperties: Array.isArray(properties) ? properties.length : 0,
        activeProperties: Array.isArray(properties) ? properties.filter((p: any) => p?.status === 'active').length : 0,
        totalLeads: Array.isArray(leads) ? leads.length : 0,
        newLeads: Array.isArray(leads) ? leads.filter((l: any) => l?.status === 'new').length : 0,
        activePortals: Array.isArray(portals) ? (portals as any[]).filter((p: any) => p?.status === 'active').length : 0,
        syncSuccess: 95 // Example
    }

    // Verificar se há erros críticos de rede
    const hasNetworkError = propertiesError || leadsError || portalsError

    if (!isConfigured) {
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-6">
                <div className="bg-[var(--color-surface)] rounded-xl shadow-2xl border border-[var(--color-border)] p-8 max-w-md w-full">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary)]/20 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                            <Building2 className="h-10 w-10 text-[var(--color-primary)]" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-3">Jetimob Integration</h2>
                        <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-6">
                            Conecte-se à API da Jetimob para sincronizar seus imóveis com os principais portais imobiliários do Brasil.
                        </p>
                    </div>

                    <div className="bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/30 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-[var(--color-warning)] flex-shrink-0 mt-0.5" strokeWidth={2} />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[var(--color-warning)] mb-1">Configuração Necessária</p>
                                <p className="text-xs text-[var(--color-warning)]/80 leading-relaxed">
                                    As credenciais do Jetimob não foram configuradas. Verifique o arquivo .env.local
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-[var(--color-info)]/5 border border-[var(--color-info)]/20 rounded-lg">
                        <p className="text-xs text-[var(--color-info)] font-medium mb-2">💡 Requisitos de Configuração</p>
                        <ul className="text-xs text-[var(--color-muted-foreground)] space-y-1 list-disc list-inside">
                            <li>NEXT_PUBLIC_JETIMOB_WEBSERVICE_KEY</li>
                            <li>NEXT_PUBLIC_JETIMOB_PUBLIC_KEY</li>
                            <li>NEXT_PUBLIC_JETIMOB_PRIVATE_KEY</li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }

    // Mostrar erro de rede se houver
    if (hasNetworkError && !propertiesLoading && !leadsLoading && !portalsLoading) {
        const errorMessage = propertiesError?.message || leadsError?.message || portalsError?.message || 'Erro desconhecido'
        
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-6">
                <div className="bg-[var(--color-surface)] rounded-xl shadow-2xl border border-[var(--color-border)] p-8 max-w-md w-full">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-error)]/10 to-[var(--color-error)]/20 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                            <AlertCircle className="h-10 w-10 text-[var(--color-error)]" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-3">Erro de Conexão</h2>
                        <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-6">
                            Não foi possível conectar à API Jetimob. Verifique sua conexão e configurações.
                        </p>
                    </div>

                    <div className="bg-[var(--color-error)]/10 border border-[var(--color-error)]/30 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-[var(--color-error)] flex-shrink-0 mt-0.5" strokeWidth={2} />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[var(--color-error)] mb-1">Detalhes do Erro</p>
                                <p className="text-xs text-[var(--color-error)]/80 leading-relaxed font-mono">
                                    {errorMessage}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button 
                            onClick={() => {
                                refetchProperties()
                                refetchLeads()
                                refetchPortals()
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white font-medium py-3 px-6 rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all"
                        >
                            <RefreshCw className="h-5 w-5" strokeWidth={2} />
                            <span>Tentar Novamente</span>
                        </button>

                        <div className="p-4 bg-[var(--color-info)]/5 border border-[var(--color-info)]/20 rounded-lg">
                            <p className="text-xs text-[var(--color-info)] font-medium mb-2">🔍 Possíveis Causas:</p>
                            <ul className="text-xs text-[var(--color-muted-foreground)] space-y-1 list-disc list-inside">
                                <li>Credenciais inválidas ou expiradas</li>
                                <li>API Jetimob fora do ar ou em manutenção</li>
                                <li>Problemas de CORS ou firewall</li>
                                <li>Timeout de conexão (10s)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[var(--color-background)] p-6">
            {/* Header */}
            <div className="bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)] p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary)]/20 rounded-xl shadow-sm">
                            <Building2 className="h-8 w-8 text-[var(--color-primary)]" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-[var(--color-foreground)] mb-1">Jetimob Dashboard</h1>
                            <p className="text-[var(--color-muted-foreground)] text-sm">Gerencie imóveis, leads e sincronização com portais</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 rounded-lg">
                            <div className="w-2 h-2 bg-[var(--color-success)] rounded-full animate-pulse"></div>
                            <CheckCircle className="h-4 w-4 text-[var(--color-success)]" strokeWidth={2} />
                            <span className="text-sm font-medium text-[var(--color-success)]">Conectado</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-[var(--color-border)]">
                    <nav className="-mb-px flex gap-8">
                        {[
                            { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
                            { id: 'properties', label: 'Imóveis', icon: Building2 },
                            { id: 'leads', label: 'Leads', icon: Users },
                            { id: 'portals', label: 'Portais', icon: Share2 },
                            { id: 'settings', label: 'Configurações', icon: Settings }
                        ].map((tab) => {
                            const Icon = tab.icon
                            const isActive = activeTab === tab.id
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`
                                        flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all
                                        ${isActive
                                            ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                                            : 'border-transparent text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:border-[var(--color-border)]'
                                        }
                                    `}
                                >
                                    <Icon className="h-4 w-4" strokeWidth={isActive ? 2 : 1.5} />
                                    <span>{tab.label}</span>
                                </button>
                            )
                        })}
                    </nav>
                </div>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'overview' && <OverviewTab stats={stats} />}
                    {activeTab === 'properties' && (
                        <PropertiesTab
                            properties={properties}
                            loading={propertiesLoading}
                            onRefresh={refetchProperties}
                        />
                    )}
                    {activeTab === 'leads' && (
                        <LeadsTab
                            leads={leads}
                            loading={leadsLoading}
                            onRefresh={refetchLeads}
                        />
                    )}
                    {activeTab === 'portals' && (
                        <PortalsTab
                            portals={portals}
                        />
                    )}
                    {activeTab === 'settings' && <SettingsTab />}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

// Componente da aba Overview
function OverviewTab({ stats }: { stats: any }) {
    const statCards = [
        {
            label: 'Imóveis Totais',
            value: stats.totalProperties,
            subtitle: `${stats.activeProperties} ativos`,
            icon: Building2,
            gradient: 'from-blue-500/10 to-blue-600/20',
            iconColor: 'text-blue-600 dark:text-blue-500',
            bgColor: 'bg-blue-500/5'
        },
        {
            label: 'Leads',
            value: stats.totalLeads,
            subtitle: `${stats.newLeads} novos`,
            icon: Users,
            gradient: 'from-green-500/10 to-emerald-600/20',
            iconColor: 'text-green-600 dark:text-green-500',
            bgColor: 'bg-green-500/5'
        },
        {
            label: 'Portais Ativos',
            value: stats.activePortals,
            subtitle: `${stats.syncSuccess}% sync`,
            icon: Share2,
            gradient: 'from-purple-500/10 to-purple-600/20',
            iconColor: 'text-purple-600 dark:text-purple-500',
            bgColor: 'bg-purple-500/5'
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statCards.map((card, index) => {
                const Icon = card.icon
                return (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)] p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`p-3 bg-gradient-to-br ${card.gradient} rounded-xl`}>
                                <Icon className={`h-6 w-6 ${card.iconColor}`} strokeWidth={1.5} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[var(--color-muted-foreground)] mb-1">{card.label}</p>
                                <p className="text-3xl font-bold text-[var(--color-foreground)] mb-1">{card.value}</p>
                                <p className="text-sm text-[var(--color-success)] font-medium">{card.subtitle}</p>
                            </div>
                        </div>
                    </motion.div>
                )
            })}
        </div>
    )
}

// Componente da aba Properties
function PropertiesTab({ properties, loading, onRefresh }: any) {
    // Future: Add onUpdate and onDelete handlers here

    return (
        <div className="bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)] p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-[var(--color-foreground)]">Imóveis</h2>
                    <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
                        {properties.length} {properties.length === 1 ? 'imóvel cadastrado' : 'imóveis cadastrados'}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => onRefresh()}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-muted)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[var(--color-foreground)]"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} strokeWidth={2} />
                        <span className="font-medium">Atualizar</span>
                    </button>
                    <button className="flex items-center gap-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white px-4 py-2 rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all font-medium">
                        <Plus className="h-4 w-4" strokeWidth={2} />
                        <span>Novo Imóvel</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <RefreshCw className="h-8 w-8 animate-spin text-[var(--color-primary)]" strokeWidth={2} />
                    <p className="text-sm text-[var(--color-muted-foreground)]">Carregando imóveis...</p>
                </div>
            ) : properties.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-16 h-16 bg-[var(--color-muted)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Building2 className="h-8 w-8 text-[var(--color-muted-foreground)]" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-2">Nenhum imóvel encontrado</h3>
                    <p className="text-sm text-[var(--color-muted-foreground)]">Comece adicionando seu primeiro imóvel</p>
                </div>
            ) : (
                <div className="overflow-x-auto -mx-6">
                    <table className="min-w-full divide-y divide-[var(--color-border)]">
                        <thead className="bg-[var(--color-muted)]">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wide">
                                    Imóvel
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wide">
                                    Tipo
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wide">
                                    Preço
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wide">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wide">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-[var(--color-surface)] divide-y divide-[var(--color-border)]">
                            {properties.map((property: any, index: number) => (
                                <motion.tr
                                    key={property.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-[var(--color-muted)] transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary)]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Building2 className="h-5 w-5 text-[var(--color-primary)]" strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-[var(--color-foreground)]">{property.title}</p>
                                                <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">{property.address?.neighborhood}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-[var(--color-foreground)]">{property.property_type}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-semibold text-[var(--color-foreground)]">
                                            R$ {property.price?.toLocaleString('pt-BR')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
                                            property.status === 'active'
                                                ? 'bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20'
                                                : 'bg-[var(--color-muted)] text-[var(--color-muted-foreground)] border border-[var(--color-border)]'
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${property.status === 'active' ? 'bg-[var(--color-success)]' : 'bg-[var(--color-muted-foreground)]'}`}></div>
                                            {property.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-2">
                                            <button 
                                                className="p-2 hover:bg-[var(--color-info)]/10 rounded-lg transition-colors group"
                                                title="Visualizar"
                                            >
                                                <Eye className="h-4 w-4 text-[var(--color-muted-foreground)] group-hover:text-[var(--color-info)]" strokeWidth={2} />
                                            </button>
                                            <button 
                                                className="p-2 hover:bg-[var(--color-success)]/10 rounded-lg transition-colors group"
                                                title="Editar"
                                            >
                                                <Edit className="h-4 w-4 text-[var(--color-muted-foreground)] group-hover:text-[var(--color-success)]" strokeWidth={2} />
                                            </button>
                                            <button 
                                                className="p-2 hover:bg-[var(--color-error)]/10 rounded-lg transition-colors group"
                                                title="Excluir"
                                            >
                                                <Trash2 className="h-4 w-4 text-[var(--color-muted-foreground)] group-hover:text-[var(--color-error)]" strokeWidth={2} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

// Componente da aba Leads
function LeadsTab({ leads, loading, onRefresh }: any) {
    // Future: Add onUpdateStatus handler here

    const getStatusConfig = (status: string) => {
        const configs: Record<string, { bg: string; text: string; dot: string }> = {
            new: { bg: 'bg-[var(--color-info)]/10', text: 'text-[var(--color-info)]', dot: 'bg-[var(--color-info)]' },
            contacted: { bg: 'bg-[var(--color-warning)]/10', text: 'text-[var(--color-warning)]', dot: 'bg-[var(--color-warning)]' },
            qualified: { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-500', dot: 'bg-purple-600' },
            converted: { bg: 'bg-[var(--color-success)]/10', text: 'text-[var(--color-success)]', dot: 'bg-[var(--color-success)]' }
        }
        return configs[status] || configs.new
    }

    return (
        <div className="bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)] p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-[var(--color-foreground)]">Leads</h2>
                    <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
                        {leads.length} {leads.length === 1 ? 'lead registrado' : 'leads registrados'}
                    </p>
                </div>
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-muted)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[var(--color-foreground)]"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} strokeWidth={2} />
                    <span className="font-medium">Atualizar</span>
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <RefreshCw className="h-8 w-8 animate-spin text-[var(--color-primary)]" strokeWidth={2} />
                    <p className="text-sm text-[var(--color-muted-foreground)]">Carregando leads...</p>
                </div>
            ) : leads.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-16 h-16 bg-[var(--color-muted)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Users className="h-8 w-8 text-[var(--color-muted-foreground)]" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-2">Nenhum lead encontrado</h3>
                    <p className="text-sm text-[var(--color-muted-foreground)]">Aguarde novos contatos dos portais</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {leads.map((lead: any, index: number) => {
                        const statusConfig = getStatusConfig(lead.status)
                        return (
                            <motion.div
                                key={lead.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="border border-[var(--color-border)] rounded-xl p-5 hover:shadow-md hover:border-[var(--color-primary)]/30 transition-all"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary)]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Users className="h-6 w-6 text-[var(--color-primary)]" strokeWidth={1.5} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-[var(--color-foreground)] text-lg mb-2">{lead.name}</h3>
                                            <div className="space-y-1.5">
                                                <p className="text-sm text-[var(--color-muted-foreground)] flex items-center gap-2">
                                                    <span className="font-medium">Email:</span>
                                                    <span className="text-[var(--color-foreground)]">{lead.email}</span>
                                                </p>
                                                <p className="text-sm text-[var(--color-muted-foreground)] flex items-center gap-2">
                                                    <span className="font-medium">Telefone:</span>
                                                    <span className="text-[var(--color-foreground)]">{lead.phone}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text} border border-current/20`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></div>
                                            {lead.status}
                                        </span>
                                        <p className="text-xs text-[var(--color-muted-foreground)] mt-2 font-medium">{lead.source}</p>
                                    </div>
                                </div>
                                {lead.message && (
                                    <div className="mt-4 p-3 bg-[var(--color-muted)] rounded-lg border border-[var(--color-border)]">
                                        <p className="text-sm text-[var(--color-foreground)] leading-relaxed">{lead.message}</p>
                                    </div>
                                )}
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

// Componente da aba Portals
function PortalsTab({ portals }: any) {
    // Future: Add properties, loading, onSync handlers here

    return (
        <div className="bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)] p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-[var(--color-foreground)]">Portais Imobiliários</h2>
                    <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
                        {portals.length} {portals.length === 1 ? 'portal configurado' : 'portais configurados'}
                    </p>
                </div>
                <button className="flex items-center gap-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white px-4 py-2 rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all font-medium">
                    <RefreshCw className="h-4 w-4" strokeWidth={2} />
                    <span>Sincronizar Todos</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portals.map((portal: any, index: number) => (
                    <motion.div
                        key={portal.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-[var(--color-border)] rounded-xl p-5 hover:shadow-md hover:border-[var(--color-primary)]/30 transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary)]/20 rounded-lg flex items-center justify-center">
                                    <Share2 className="h-5 w-5 text-[var(--color-primary)]" strokeWidth={1.5} />
                                </div>
                                <h3 className="font-semibold text-[var(--color-foreground)]">{portal.name}</h3>
                            </div>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
                                portal.status === 'active'
                                    ? 'bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20'
                                    : 'bg-[var(--color-muted)] text-[var(--color-muted-foreground)] border border-[var(--color-border)]'
                            }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${portal.status === 'active' ? 'bg-[var(--color-success)] animate-pulse' : 'bg-[var(--color-muted-foreground)]'}`}></div>
                                {portal.status}
                            </span>
                        </div>
                        <div className="space-y-3 mb-4">
                            <div className="flex items-center justify-between p-2 bg-[var(--color-muted)] rounded-lg">
                                <span className="text-xs font-medium text-[var(--color-muted-foreground)]">Auto Sync:</span>
                                <span className="text-xs font-semibold text-[var(--color-foreground)]">
                                    {portal.configuration?.auto_sync ? '✓ Ativo' : '✗ Inativo'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-[var(--color-muted)] rounded-lg">
                                <span className="text-xs font-medium text-[var(--color-muted-foreground)]">Frequência:</span>
                                <span className="text-xs font-semibold text-[var(--color-foreground)]">
                                    {portal.configuration?.sync_frequency || 'N/A'}h
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm font-medium hover:bg-[var(--color-muted)] transition-colors text-[var(--color-foreground)]">
                                <Settings className="h-3.5 w-3.5 inline mr-1" />
                                Configurar
                            </button>
                            <button className="flex-1 px-3 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-colors">
                                <Upload className="h-3.5 w-3.5 inline mr-1" />
                                Sync
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

// Componente da aba Settings
function SettingsTab() {
    return (
        <div className="bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)] p-6">
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">Configurações da Integração</h2>
                <p className="text-sm text-[var(--color-muted-foreground)]">Configure as credenciais e preferências da API Jetimob</p>
            </div>

            <div className="space-y-8">
                {/* Autenticação */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary)]/20 rounded-lg flex items-center justify-center">
                            <Settings className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={2} />
                        </div>
                        <h3 className="text-lg font-semibold text-[var(--color-foreground)]">Autenticação</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                                Webservice Key
                            </label>
                            <input
                                type="password"
                                className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)]"
                                placeholder="••••••••••••••••"
                            />
                            <p className="text-xs text-[var(--color-muted-foreground)] mt-1.5">Chave principal de autenticação</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                                Public Key
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)]"
                                placeholder="Sua Public Key"
                            />
                            <p className="text-xs text-[var(--color-muted-foreground)] mt-1.5">Chave pública da API</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                                Private Key
                            </label>
                            <input
                                type="password"
                                className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)]"
                                placeholder="••••••••••••••••"
                            />
                            <p className="text-xs text-[var(--color-muted-foreground)] mt-1.5">Chave privada da API</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                                Base URL
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)]"
                                defaultValue="https://api.jetimob.com/v2"
                            />
                            <p className="text-xs text-[var(--color-muted-foreground)] mt-1.5">URL base da API</p>
                        </div>
                    </div>
                </div>

                {/* Sincronização */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-info)]/10 to-[var(--color-info)]/20 rounded-lg flex items-center justify-center">
                            <RefreshCw className="h-4 w-4 text-[var(--color-info)]" strokeWidth={2} />
                        </div>
                        <h3 className="text-lg font-semibold text-[var(--color-foreground)]">Sincronização</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-[var(--color-muted)] rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 transition-colors">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[var(--color-foreground)] mb-1">Sincronização Automática</p>
                                <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">Sincronizar imóveis automaticamente com os portais configurados</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-[var(--color-border)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--color-primary)]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-[var(--color-muted)] rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 transition-colors">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[var(--color-foreground)] mb-1">Notificações de Sync</p>
                                <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">Receber notificações sobre o status de sincronização e erros</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-[var(--color-border)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--color-primary)]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-4 pt-4 border-t border-[var(--color-border)]">
                    <button className="flex items-center gap-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white px-6 py-2.5 rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all font-medium">
                        <CheckCircle className="h-4 w-4" strokeWidth={2} />
                        <span>Salvar Configurações</span>
                    </button>
                    <button className="px-6 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-muted)] transition-colors text-[var(--color-foreground)] font-medium">
                        Testar Conexão
                    </button>
                </div>
            </div>
        </div>
    )
}
