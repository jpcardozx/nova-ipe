'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import IntegratedDashboard from '@/app/components/business/IntegratedDashboard'
import DocumentManagerNew from '@/app/components/documents/DocumentManagerNew'
import CloudStorage from '@/app/components/business/CloudStorage'
import {
    FiUsers,
    FiFileText,
    FiBarChart3,
    FiSettings,
    FiChevronLeft,
    FiHome,
    FiCloud
} from 'react-icons/fi'

export default function CRMSystemPage() {
    const [activeView, setActiveView] = useState<'dashboard' | 'documents' | 'leads' | 'analytics' | 'cloud'>('dashboard')
    const [selectedLeadId, setSelectedLeadId] = useState<string | undefined>()

    const navigation = [
        {
            id: 'dashboard',
            name: 'Dashboard',
            icon: FiHome,
            description: 'Visão geral do sistema'
        },
        {
            id: 'leads',
            name: 'Leads',
            icon: FiUsers,
            description: 'Gestão de leads e CRM'
        },
        {
            id: 'documents',
            name: 'Documentos',
            icon: FiFileText,
            description: 'Gestão de documentos'
        },
        {
            id: 'cloud',
            name: 'Nuvem',
            icon: FiCloud,
            description: 'Armazenamento em nuvem'
        },
        {
            id: 'analytics',
            name: 'Analytics',
            icon: FiBarChart3,
            description: 'Relatórios e métricas'
        }
    ]

    const renderContent = () => {
        switch (activeView) {
            case 'dashboard':
                return <IntegratedDashboard />
            case 'leads':
                return <IntegratedDashboard leadId={selectedLeadId} view="lead-detail" />
            case 'documents':
                return <div>Documentos em Trânsito (em desenvolvimento)</div>
            case 'cloud':
                return <CloudStorage />
            case 'analytics':
                return <AnalyticsView />
            default:
                return <IntegratedDashboard />
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <FiHome className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-semibold text-gray-900">Nova IPÊ CRM</h1>
                                    <p className="text-xs text-gray-500">Sistema Integrado de Gestão</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-600">
                                Sistema de gestão de leads e documentos
                            </div>
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                                <FiSettings className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
                    <nav className="mt-8 px-4">
                        <div className="space-y-2">
                            {navigation.map((item) => {
                                const Icon = item.icon
                                const isActive = activeView === item.id

                                return (
                                    <motion.button
                                        key={item.id}
                                        onClick={() => setActiveView(item.id as any)}
                                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                                        <div className="text-left">
                                            <div>{item.name}</div>
                                            <div className="text-xs text-gray-500">{item.description}</div>
                                        </div>
                                    </motion.button>
                                )
                            })}
                        </div>
                    </nav>

                    {/* Status do Sistema */}
                    <div className="mt-8 px-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center">
                                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                <span className="ml-2 text-sm font-medium text-green-800">Sistema Online</span>
                            </div>
                            <p className="text-xs text-green-600 mt-1">Todos os serviços funcionando</p>
                        </div>
                    </div>

                    {/* Info do Sistema */}
                    <div className="mt-4 px-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <h4 className="text-sm font-medium text-blue-900 mb-2">Funcionalidades</h4>
                            <ul className="text-xs text-blue-700 space-y-1">
                                <li>✓ Gestão de Leads</li>
                                <li>✓ Upload de Documentos</li>
                                <li>✓ Workflow Automático</li>
                                <li>✓ Relatórios em Tempo Real</li>
                                <li>✓ Integração Supabase</li>
                            </ul>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    <motion.div
                        key={activeView}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                    >
                        {renderContent()}
                    </motion.div>
                </main>
            </div>
        </div>
    )
}

// Componente de Analytics temporário
function AnalyticsView() {
    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Analytics & Relatórios</h1>
                    <p className="text-gray-600 mt-2">Métricas e insights do seu negócio</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Métricas de Leads */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance de Leads</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Taxa de Conversão</span>
                                <span className="font-semibold text-green-600">23.5%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Leads este mês</span>
                                <span className="font-semibold">47</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Tempo médio de fechamento</span>
                                <span className="font-semibold">12 dias</span>
                            </div>
                        </div>
                    </div>

                    {/* Métricas de Documentos */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestão de Documentos</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Documentos processados</span>
                                <span className="font-semibold">156</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Pendentes de assinatura</span>
                                <span className="font-semibold text-yellow-600">8</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Tempo médio de aprovação</span>
                                <span className="font-semibold">2.3 dias</span>
                            </div>
                        </div>
                    </div>

                    {/* Gráfico de Atividades */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividades Recentes</h3>
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <FiBarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">Gráficos serão implementados com Chart.js</p>
                                <p className="text-sm text-gray-400 mt-2">
                                    Métricas em tempo real dos leads e documentos
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
