'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import IntegratedDashboard from '@/app/components/business/IntegratedDashboard'
import CloudStorage from '@/app/components/business/CloudStorage'
import {
    FiUsers,
    FiFileText,
    FiBarChart,
    FiSettings,
    FiChevronLeft,
    FiHome,
    FiCloud,
    FiCalendar,
    FiPhone,
    FiMail,
    FiCheckSquare,
    FiTrendingUp,
    FiDatabase,
    FiUploadCloud,
    FiDownloadCloud,
    FiFolderPlus,
    FiBookOpen,
    FiArrowLeft,
    FiClock
} from 'react-icons/fi'

export default function CRMSystemPage() {
    const [activeView, setActiveView] = useState<'dashboard' | 'documents' | 'leads' | 'analytics' | 'cloud' | 'calendar' | 'communications' | 'tasks' | 'reports' | 'educational' | 'settings'>('dashboard')
    const [selectedLeadId, setSelectedLeadId] = useState<string | undefined>()
    const [selectedArticle, setSelectedArticle] = useState<string | null>(null)

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
            description: 'Documentos em trânsito'
        },
        {
            id: 'cloud',
            name: 'Nuvem',
            icon: FiCloud,
            description: 'Armazenamento seguro'
        },
        {
            id: 'tasks',
            name: 'Tarefas',
            icon: FiCheckSquare,
            description: 'Gestão de tarefas'
        },
        {
            id: 'calendar',
            name: 'Agenda',
            icon: FiCalendar,
            description: 'Compromissos e visitas'
        },
        {
            id: 'communications',
            name: 'Comunicações',
            icon: FiMail,
            description: 'WhatsApp, email, calls'
        },
        {
            id: 'analytics',
            name: 'Analytics',
            icon: FiBarChart,
            description: 'Relatórios e métricas'
        },
        {
            id: 'reports',
            name: 'Relatórios',
            icon: FiTrendingUp,
            description: 'Relatórios detalhados'
        },
        {
            id: 'educational',
            name: 'Educativo',
            icon: FiBookOpen,
            description: 'Estratégias e insights'
        },
        {
            id: 'settings',
            name: 'Configurações',
            icon: FiSettings,
            description: 'Configurações do sistema'
        }
    ]

    const renderContent = () => {
        switch (activeView) {
            case 'dashboard':
                return <IntegratedDashboard />
            case 'leads':
                return <IntegratedDashboard leadId={selectedLeadId} view="leads" />
            case 'documents':
                return <DocumentsManagerView />
            case 'cloud':
                return <CloudStorage />
            case 'tasks':
                return <IntegratedDashboard view="tasks" />
            case 'calendar':
                return <CalendarView />
            case 'communications':
                return <CommunicationsView />
            case 'analytics':
                return <AnalyticsView />
            case 'reports':
                return <ReportsView />
            case 'educational':
                return <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Conteúdo Educacional</h2>
                    <p className="text-gray-600">Em desenvolvimento...</p>
                </div>
            case 'settings':
                return <SettingsView />
            default:
                return <IntegratedDashboard />
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Header Aprimorado */}
            <motion.header
                className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-40"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <motion.div
                            className="flex items-center space-x-4"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <div className="flex items-center space-x-3">
                                <motion.div
                                    className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
                                    whileHover={{
                                        scale: 1.05,
                                        rotate: 5,
                                        transition: { duration: 0.2 }
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiHome className="h-5 w-5 text-white" />
                                </motion.div>
                                <div>
                                    <motion.h1
                                        className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        IPÊ CRM
                                    </motion.h1>
                                    <motion.p
                                        className="text-xs text-gray-500 font-medium"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        Sistema Integrado de Gestão
                                    </motion.p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="flex items-center space-x-4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <motion.div
                                className="text-sm text-gray-600 hidden md:block"
                                whileHover={{ scale: 1.02 }}
                            >
                                Sistema de gestão de leads e documentos
                            </motion.div>
                            <motion.button
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                                whileHover={{
                                    scale: 1.1,
                                    rotate: 90,
                                    transition: { duration: 0.2 }
                                }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FiSettings className="h-5 w-5" />
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </motion.header>

            <div className="flex">
                {/* Sidebar Aprimorada com Design Elegante */}
                <aside className="w-80 bg-gradient-to-b from-white to-gray-50 shadow-xl border-r border-gray-200 min-h-screen relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                        }}></div>
                    </div>

                    <nav className="relative mt-8 px-6">
                        <div className="space-y-2">
                            {navigation.map((item, index) => {
                                const Icon = item.icon
                                const isActive = activeView === item.id

                                return (
                                    <motion.button
                                        key={item.id}
                                        onClick={() => setActiveView(item.id as any)}
                                        className={`w-full group relative overflow-hidden ${isActive
                                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: index * 0.1,
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30
                                        }}
                                        whileHover={{
                                            scale: 1.02,
                                            transition: { duration: 0.2 }
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            borderRadius: '16px',
                                            padding: '16px',
                                            marginBottom: '8px'
                                        }}
                                    >
                                        {/* Hover Background Effect */}
                                        {!isActive && (
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100"
                                                style={{ borderRadius: '16px' }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        )}

                                        {/* Active Indicator */}
                                        {isActive && (
                                            <motion.div
                                                className="absolute left-0 top-1/2 w-1 h-8 bg-white rounded-r-full"
                                                initial={{ scaleY: 0 }}
                                                animate={{ scaleY: 1 }}
                                                style={{ transform: 'translateY(-50%)' }}
                                            />
                                        )}

                                        <div className="relative flex items-center">
                                            <motion.div
                                                className="relative"
                                                whileHover={{ rotate: 5 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Icon className={`mr-4 h-6 w-6 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'} transition-colors duration-200`} />
                                                {isActive && (
                                                    <motion.div
                                                        className="absolute -inset-2 bg-white/20 rounded-full"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ duration: 0.3 }}
                                                    />
                                                )}
                                            </motion.div>

                                            <div className="text-left flex-1">
                                                <motion.div
                                                    className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-gray-900'}`}
                                                    layout
                                                >
                                                    {item.name}
                                                </motion.div>
                                                <motion.div
                                                    className={`text-xs mt-1 ${isActive ? 'text-blue-100' : 'text-gray-500'}`}
                                                    layout
                                                >
                                                    {item.description}
                                                </motion.div>
                                            </div>

                                            {isActive && (
                                                <motion.div
                                                    className="w-2 h-2 bg-white rounded-full shadow-lg"
                                                    initial={{ scale: 0, rotate: 180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 500,
                                                        damping: 25,
                                                        delay: 0.1
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </motion.button>
                                )
                            })}
                        </div>
                    </nav>

                    {/* Estatísticas Rápidas com Glassmorphism */}
                    <motion.div
                        className="mt-8 px-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                    >
                        <div className="backdrop-blur-sm bg-white/70 border border-white/20 rounded-2xl p-6 shadow-xl">
                            <motion.h4
                                className="text-sm font-semibold text-gray-900 mb-4 flex items-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                            >
                                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mr-2"></div>
                                Status do Sistema
                            </motion.h4>
                            <div className="space-y-3">
                                {[
                                    { label: 'Leads Ativos', value: '24', color: 'text-blue-600', delay: 0.1 },
                                    { label: 'Documentos', value: '156', color: 'text-green-600', delay: 0.2 },
                                    { label: 'Tarefas Pendentes', value: '8', color: 'text-orange-600', delay: 0.3 }
                                ].map((stat, index) => (
                                    <motion.div
                                        key={stat.label}
                                        className="flex items-center justify-between group"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1 + stat.delay }}
                                        whileHover={{ x: 4 }}
                                    >
                                        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                            {stat.label}
                                        </span>
                                        <motion.span
                                            className={`text-sm font-bold ${stat.color} tabular-nums`}
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ type: "spring", stiffness: 400 }}
                                        >
                                            {stat.value}
                                        </motion.span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Status de Conexão com Indicadores Animados */}
                    <motion.div
                        className="mt-6 px-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                    >
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50 rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center mb-4">
                                <motion.div
                                    className="h-3 w-3 bg-green-500 rounded-full mr-3"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [1, 0.7, 1]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                                <span className="text-sm font-semibold text-green-800">Sistema Online</span>
                            </div>
                            <p className="text-xs text-green-600 mb-4">Todos os serviços funcionando perfeitamente</p>

                            <div className="space-y-2">
                                {[
                                    { name: 'Supabase', status: true, delay: 0.1 },
                                    { name: 'Storage', status: true, delay: 0.2 },
                                    { name: 'Auth', status: true, delay: 0.3 }
                                ].map((service, index) => (
                                    <motion.div
                                        key={service.name}
                                        className="flex items-center justify-between"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1.4 + service.delay }}
                                        whileHover={{ x: 2 }}
                                    >
                                        <span className="text-xs text-green-700">{service.name}</span>
                                        <motion.span
                                            className="text-xs text-green-600"
                                            initial={{ rotate: 0 }}
                                            animate={{ rotate: service.status ? 360 : 0 }}
                                            transition={{ duration: 0.5, delay: 1.4 + service.delay }}
                                        >
                                            ✓
                                        </motion.span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Ações Rápidas com Micro-interações */}
                    <motion.div
                        className="mt-6 px-6 pb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.6, duration: 0.5 }}
                    >
                        <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200/50 rounded-2xl p-6 shadow-lg">
                            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                                <motion.div
                                    className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-2"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                />
                                Ações Rápidas
                            </h4>
                            <div className="space-y-2">
                                {[
                                    { icon: FiUploadCloud, label: 'Upload Documento', color: 'text-blue-600' },
                                    { icon: FiUsers, label: 'Novo Lead', color: 'text-green-600' },
                                    { icon: FiFolderPlus, label: 'Criar Pasta', color: 'text-purple-600' }
                                ].map((action, index) => (
                                    <motion.button
                                        key={action.label}
                                        className="w-full flex items-center p-3 text-sm text-gray-700 hover:text-gray-900 bg-white/50 hover:bg-white rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md border border-transparent hover:border-gray-200"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1.8 + (index * 0.1) }}
                                        whileHover={{
                                            scale: 1.02,
                                            x: 4,
                                            transition: { duration: 0.2 }
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <motion.div
                                            whileHover={{ rotate: 5, scale: 1.1 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <action.icon className={`mr-3 h-4 w-4 ${action.color} group-hover:scale-110 transition-transform duration-200`} />
                                        </motion.div>
                                        <span className="font-medium">{action.label}</span>
                                        <motion.div
                                            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                            initial={{ x: -10 }}
                                            whileHover={{ x: 0 }}
                                        >
                                            <FiChevronLeft className="h-4 w-4 rotate-180 text-gray-400" />
                                        </motion.div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </aside>

                {/* Main Content com Transições Elegantes */}
                <main className="flex-1 relative overflow-hidden">
                    {/* Background Pattern para o Content */}
                    <div className="absolute inset-0 opacity-3">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239CA3AF' fill-opacity='0.05'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
                        }}></div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeView}
                            initial={{
                                opacity: 0,
                                y: 20,
                                scale: 0.98
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1
                            }}
                            exit={{
                                opacity: 0,
                                y: -20,
                                scale: 0.98
                            }}
                            transition={{
                                duration: 0.4,
                                type: "spring",
                                stiffness: 300,
                                damping: 30
                            }}
                            className="h-full relative z-10"
                        >
                            {/* Loading State Elegante */}
                            <motion.div
                                initial={{ opacity: 1 }}
                                animate={{ opacity: 0 }}
                                transition={{ delay: 0.1, duration: 0.3 }}
                                className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center pointer-events-none"
                            >
                                <motion.div
                                    className="flex space-x-2"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                >
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            className="w-2 h-2 bg-blue-500 rounded-full"
                                            animate={{
                                                y: [-4, 4, -4],
                                                opacity: [0.5, 1, 0.5]
                                            }}
                                            transition={{
                                                duration: 0.8,
                                                repeat: Infinity,
                                                delay: i * 0.1
                                            }}
                                        />
                                    ))}
                                </motion.div>
                            </motion.div>

                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    )
}

// Componente de Gerenciamento de Documentos
function DocumentsManagerView() {
    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Documentos</h1>
                    <p className="text-gray-600 mt-2">Documentos em trânsito com clientes</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            <FiFileText className="inline mr-2" />
                            Documentos Recentes
                        </h3>
                        <p className="text-gray-500">Sistema de documentos em desenvolvimento...</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-center p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                                <FiUploadCloud className="mr-2" />
                                Novo Documento
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Componente de Analytics
function AnalyticsView() {
    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Analytics & Relatórios</h1>
                    <p className="text-gray-600 mt-2">Métricas e insights do seu negócio</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance de Leads</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Taxa de Conversão</span>
                                <span className="font-semibold text-green-600">23.5%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Leads este Mês</span>
                                <span className="font-semibold text-blue-600">47</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gráficos</h3>
                        <div className="text-center py-8">
                            <FiBarChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Gráficos serão implementados com Chart.js</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Componente de Agenda/Calendar
function CalendarView() {
    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Agenda & Compromissos</h1>
                    <p className="text-gray-600 mt-2">Gerencie visitas, reuniões e follow-ups</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            <FiCalendar className="inline mr-2" />
                            Próximos Compromissos
                        </h3>
                        <p className="text-gray-500">Integração com calendário em desenvolvimento...</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-center p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                                <FiCalendar className="mr-2" />
                                Agendar Visita
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Componente de Comunicações
function CommunicationsView() {
    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Central de Comunicações</h1>
                    <p className="text-gray-600 mt-2">WhatsApp, Email, Ligações e Mensagens</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            <FiPhone className="inline mr-2 text-green-600" />
                            WhatsApp
                        </h3>
                        <p className="text-gray-500">Templates e automações</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            <FiMail className="inline mr-2 text-blue-600" />
                            Email Marketing
                        </h3>
                        <p className="text-gray-500">Campanhas e newsletters</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            <FiPhone className="inline mr-2 text-purple-600" />
                            Ligações
                        </h3>
                        <p className="text-gray-500">Histórico de chamadas</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Componente de Relatórios
function ReportsView() {
    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Relatórios Detalhados</h1>
                    <p className="text-gray-600 mt-2">Relatórios personalizados e exportação de dados</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            <FiTrendingUp className="inline mr-2 text-green-600" />
                            Relatórios de Vendas
                        </h3>
                        <p className="text-gray-500">Performance de vendas e conversões</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            <FiDatabase className="inline mr-2 text-blue-600" />
                            Relatórios de Dados
                        </h3>
                        <p className="text-gray-500">Exportação e análise de dados</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Componente de Configurações
function SettingsView() {
    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Configurações do Sistema</h1>
                    <p className="text-gray-600 mt-2">Personalize sua experiência e configure integrações</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            <FiSettings className="inline mr-2" />
                            Configurações Gerais
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Notificações</span>
                                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Ativado</button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Backup Automático</span>
                                <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">Ativado</button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            <FiDatabase className="inline mr-2" />
                            Integrações
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Supabase</span>
                                <span className="text-green-600 text-sm">✓ Conectado</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">WhatsApp API</span>
                                <span className="text-yellow-600 text-sm">⚠ Configurar</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
