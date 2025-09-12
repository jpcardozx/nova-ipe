'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Building2,
    Users,
    TrendingUp,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    Settings,
    ExternalLink,
    Upload,
    Download,
    Eye,
    Edit,
    Trash2,
    Share2,
    Filter,
    Search,
    Plus
} from 'lucide-react'
import { useJetimob, useJetimobProperties, useJetimobLeads, useJetimobPortals } from '@/lib/jetimob/use-jetimob'

export default function JetimobDashboard() {
    const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'leads' | 'portals' | 'settings'>('overview')

    const {
        isAuthenticated,
        isLoading: mainLoading,
        error: mainError,
        authenticate
    } = useJetimob()

    const {
        properties,
        loadProperties,
        createProperty,
        updateProperty,
        deleteProperty,
        isLoading: propertiesLoading
    } = useJetimobProperties()

    const {
        leads,
        loadLeads,
        updateLeadStatus,
        isLoading: leadsLoading
    } = useJetimobLeads()

    const {
        portals,
        loadPortals,
        syncToPortals,
        unsyncFromPortals,
        isLoading: portalsLoading
    } = useJetimobPortals()

    const [stats, setStats] = useState({
        totalProperties: 0,
        activeProperties: 0,
        totalLeads: 0,
        newLeads: 0,
        activePortals: 0,
        syncSuccess: 0
    })

    // Carregar dados iniciais
    useEffect(() => {
        if (isAuthenticated) {
            loadProperties()
            loadLeads()
            loadPortals()
        }
    }, [isAuthenticated])

    // Calcular estatísticas
    useEffect(() => {
        setStats({
            totalProperties: properties.length,
            activeProperties: properties.filter(p => p.status === 'active').length,
            totalLeads: leads.length,
            newLeads: leads.filter(l => l.status === 'new').length,
            activePortals: portals.filter(p => p.status === 'active').length,
            syncSuccess: 95 // Exemplo
        })
    }, [properties, leads, portals])

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 rounded-lg shadow-lg">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building2 className="h-8 w-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Jetimob Integration</h2>
                    <p className="text-gray-600 mb-6">
                        Conecte-se à API da Jetimob para sincronizar seus imóveis com os principais portais imobiliários.
                    </p>
                    {mainError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center">
                                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                                <p className="text-red-700 text-sm">{mainError}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={authenticate}
                        disabled={mainLoading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                    >
                        {mainLoading ? (
                            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        {mainLoading ? 'Conectando...' : 'Conectar com Jetimob'}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Building2 className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Jetimob Dashboard</h1>
                            <p className="text-gray-600">Gerencie imóveis, leads e sincronização com portais</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <span className="text-sm font-medium">Conectado</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {[
                            { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
                            { id: 'properties', label: 'Imóveis', icon: Building2 },
                            { id: 'leads', label: 'Leads', icon: Users },
                            { id: 'portals', label: 'Portais', icon: Share2 },
                            { id: 'settings', label: 'Configurações', icon: Settings }
                        ].map((tab) => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
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
                            onRefresh={loadProperties}
                            onUpdate={updateProperty}
                            onDelete={deleteProperty}
                        />
                    )}
                    {activeTab === 'leads' && (
                        <LeadsTab
                            leads={leads}
                            loading={leadsLoading}
                            onRefresh={loadLeads}
                            onUpdateStatus={updateLeadStatus}
                        />
                    )}
                    {activeTab === 'portals' && (
                        <PortalsTab
                            portals={portals}
                            properties={properties}
                            loading={portalsLoading}
                            onSync={syncToPortals}
                            onUnsync={unsyncFromPortals}
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
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg">
                        <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Imóveis Totais</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
                        <p className="text-sm text-green-600">{stats.activeProperties} ativos</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                        <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Leads</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
                        <p className="text-sm text-green-600">{stats.newLeads} novos</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg">
                        <Share2 className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Portais Ativos</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.activePortals}</p>
                        <p className="text-sm text-green-600">{stats.syncSuccess}% sync</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Componente da aba Properties
function PropertiesTab({ properties, loading, onRefresh, onUpdate, onDelete }: any) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Imóveis ({properties.length})</h2>
                <div className="flex space-x-3">
                    <button
                        onClick={onRefresh}
                        disabled={loading}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        <span>Atualizar</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        <Plus className="h-4 w-4" />
                        <span>Novo Imóvel</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                </div>
            ) : properties.length === 0 ? (
                <div className="text-center py-12">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Nenhum imóvel encontrado</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Imóvel
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tipo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Preço
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {properties.map((property: any) => (
                                <tr key={property.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{property.title}</p>
                                            <p className="text-sm text-gray-500">{property.address?.neighborhood}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {property.property_type}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        R$ {property.price?.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${property.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {property.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button className="text-blue-600 hover:text-blue-900">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button className="text-green-600 hover:text-green-900">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button className="text-red-600 hover:text-red-900">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

// Componente da aba Leads
function LeadsTab({ leads, loading, onRefresh, onUpdateStatus }: any) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Leads ({leads.length})</h2>
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Atualizar</span>
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                </div>
            ) : leads.length === 0 ? (
                <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Nenhum lead encontrado</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {leads.map((lead: any) => (
                        <div key={lead.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">{lead.name}</h3>
                                    <p className="text-sm text-gray-600">{lead.email}</p>
                                    <p className="text-sm text-gray-600">{lead.phone}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${lead.status === 'new'
                                        ? 'bg-blue-100 text-blue-800'
                                        : lead.status === 'contacted'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-green-100 text-green-800'
                                        }`}>
                                        {lead.status}
                                    </span>
                                    <p className="text-sm text-gray-500 mt-1">{lead.source}</p>
                                </div>
                            </div>
                            {lead.message && (
                                <p className="text-sm text-gray-700 mt-2 p-2 bg-gray-50 rounded">
                                    {lead.message}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// Componente da aba Portals
function PortalsTab({ portals, properties, loading, onSync, onUnsync }: any) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Portais Imobiliários</h2>
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    <RefreshCw className="h-4 w-4" />
                    <span>Sincronizar Todos</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portals.map((portal: any) => (
                    <div key={portal.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-gray-900">{portal.name}</h3>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${portal.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                                }`}>
                                {portal.status}
                            </span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Auto Sync:</span>
                                <span className="text-gray-900">
                                    {portal.configuration?.auto_sync ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Frequência:</span>
                                <span className="text-gray-900">
                                    {portal.configuration?.sync_frequency || 'N/A'}h
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 flex space-x-2">
                            <button className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                                Configurar
                            </button>
                            <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                                Sincronizar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Componente da aba Settings
function SettingsTab() {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Configurações da Integração</h2>

            <div className="space-y-6">
                <div>
                    <h3 className="text-md font-medium text-gray-900 mb-3">Autenticação</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                API Key
                            </label>
                            <input
                                type="password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="••••••••••••••••"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                User ID
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Seu User ID"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-md font-medium text-gray-900 mb-3">Sincronização</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Sincronização Automática</p>
                                <p className="text-sm text-gray-600">Sincronizar imóveis automaticamente com os portais</p>
                            </div>
                            <input type="checkbox" className="h-4 w-4 text-blue-600" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Notificações de Sync</p>
                                <p className="text-sm text-gray-600">Receber notificações sobre status de sincronização</p>
                            </div>
                            <input type="checkbox" className="h-4 w-4 text-blue-600" defaultChecked />
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        Salvar Configurações
                    </button>
                </div>
            </div>
        </div>
    )
}
