'use client'

import { useState } from 'react'
import { useIntegratedCRM } from '@/app/hooks/useIntegratedCRM'
import { motion, AnimatePresence } from 'framer-motion'
import CloudStorage from '@/app/components/business/CloudStorage'
import {
    FiFile,
    FiUsers,
    FiCheckCircle,
    FiClock,
    FiTrendingUp,
    FiPhone,
    FiMail,
    FiCalendar,
    FiPlus,
    FiDownload,
    FiUpload,
    FiUser,
    FiActivity,
    FiAlertCircle,
    FiFilter,
    FiSearch,
    FiMoreVertical,
    FiMessageCircle,
    FiFileText
} from 'react-icons/fi'
// import { FaWhatsapp } from 'react-icons/fa'
// import { toast } from 'react-hot-toast'

// Placeholder components for missing dependencies
const LeadDocuments = ({ leadId, documents }: { leadId: string, documents: any[] }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Documentos</h3>
        <p className="text-gray-500">Documentos do lead {leadId} ({documents?.length || 0} documentos)</p>
    </div>
)

const LeadActivities = ({ leadId, activities }: { leadId: string, activities: any[] }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Atividades</h3>
        <p className="text-gray-500">Atividades do lead {leadId} ({activities?.length || 0} atividades)</p>
    </div>
)

const LeadTasks = ({ leadId, tasks }: { leadId: string, tasks: any[] }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Tarefas</h3>
        <p className="text-gray-500">Tarefas do lead {leadId} ({tasks?.length || 0} tarefas)</p>
    </div>
)

const LeadInfo = ({ lead }: { lead: any }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Informações do Lead</h3>
        <p className="text-gray-500">Detalhes do lead: {lead?.nome || 'N/A'}</p>
    </div>
)

// Tab button component
const TabButton = ({ active, onClick, icon: Icon, label }: {
    active: boolean
    onClick: () => void
    icon: any
    label: string
}) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${active
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
    >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
    </button>
)

// Simple views for documents and tasks
const DocumentsView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Gerenciar Documentos</h2>
        <p className="text-gray-600">Visualização completa de documentos em desenvolvimento.</p>
    </div>
)

const TasksView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Gerenciar Tarefas</h2>
        <p className="text-gray-600">Visualização completa de tarefas em desenvolvimento.</p>
    </div>
)

interface IntegratedDashboardProps {
    leadId?: string
    view?: 'overview' | 'lead-detail' | 'documents' | 'tasks' | 'activities' | 'cloud'
}

export default function IntegratedDashboard({
    leadId,
    view = 'overview'
}: IntegratedDashboardProps) {
    const [activeView, setActiveView] = useState(view)
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [filterStatus, setFilterStatus] = useState<string>('all')
    const [searchTerm, setSearchTerm] = useState('')

    const {
        data,
        loading,
        error,
        refresh,
        createLead,
        updateLeadStatus,
        logCall,
        logEmail,
        logWhatsApp,
        uploadDocument,
        completeTask,
        scheduleFollowUp,
        downloadDocument,
        addActivity
    } = useIntegratedCRM({
        leadId,
        autoRefresh: true,
        refreshInterval: 30000
    })

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <FiAlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar dados</h3>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <button
                        onClick={refresh}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Tentar novamente
                    </button>
                </div>
            </div>
        )
    }

    const { lead, documents, tasks, activities, stats } = data

    // ==================== OVERVIEW DASHBOARD ====================
    const OverviewDashboard = () => (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total de Leads"
                    value={stats?.total_leads || 0}
                    icon={FiUsers}
                    color="blue"
                    change={`+${stats?.new_leads_this_month || 0} este mês`}
                />
                <StatCard
                    title="Documentos"
                    value={stats?.total_documents || 0}
                    icon={FiFileText}
                    color="green"
                    change={`${stats?.pending_documents || 0} pendentes`}
                />
                <StatCard
                    title="Tarefas Ativas"
                    value={stats?.active_tasks || 0}
                    icon={FiClock}
                    color="yellow"
                    change={`${stats?.overdue_tasks || 0} atrasadas`}
                />
                <StatCard
                    title="Taxa de Conversão"
                    value={`${stats?.conversion_rate || 0}%`}
                    icon={FiTrendingUp}
                    color="purple"
                    change={stats?.conversion_trend || 'Estável'}
                />
            </div>

            {/* Recent Activities & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentActivities activities={activities} />
                <QuickActions />
            </div>

            {/* Recent Documents & Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentDocuments documents={documents.slice(0, 5)} />
                <ActiveTasks tasks={tasks.slice(0, 5)} />
            </div>
        </div>
    )

    // ==================== LEAD DETAIL VIEW ====================
    const LeadDetailView = () => {
        if (!lead) {
            return (
                <div className="text-center py-12">
                    <FiUser className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Lead não encontrado</h3>
                    <p className="text-gray-500">Selecione um lead para ver os detalhes</p>
                </div>
            )
        }

        return (
            <div className="space-y-6">
                {/* Lead Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <FiUser className="h-8 w-8 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
                                <p className="text-gray-500">{lead.email}</p>
                                <p className="text-gray-500">{lead.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <StatusBadge status={lead.status} />
                            <button
                                onClick={() => {/* Open edit modal */ }}
                                className="p-2 text-gray-400 hover:text-gray-600"
                            >
                                <FiMoreVertical className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Lead Actions */}
                    <div className="mt-6 flex space-x-3">
                        <ActionButton
                            icon={FiPhone}
                            label="Ligar"
                            onClick={() => {/* Handle call */ }}
                            color="blue"
                        />
                        <ActionButton
                            icon={FiMail}
                            label="Email"
                            onClick={() => {/* Handle email */ }}
                            color="green"
                        />
                        <ActionButton
                            icon={FiMessageCircle}
                            label="WhatsApp"
                            onClick={() => {/* Handle WhatsApp */ }}
                            color="green"
                        />
                        <ActionButton
                            icon={FiCalendar}
                            label="Agendar"
                            onClick={() => {/* Handle schedule */ }}
                            color="purple"
                        />
                    </div>
                </div>

                {/* Lead Content Tabs */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <LeadDocuments leadId={lead.id} documents={documents} />
                        <LeadActivities leadId={lead.id} activities={activities} />
                    </div>
                    <div className="space-y-6">
                        <LeadTasks leadId={lead.id} tasks={tasks} />
                        <LeadInfo lead={lead} />
                    </div>
                </div>
            </div>
        )
    }

    // ==================== COMPONENTS ====================
    const StatCard = ({ title, value, icon: Icon, color, change }: any) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                    <p className="text-sm text-gray-500 mt-1">{change}</p>
                </div>
                <div className={`h-12 w-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 text-${color}-600`} />
                </div>
            </div>
        </motion.div>
    )

    const RecentActivities = ({ activities }: { activities: any[] }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Atividades Recentes</h3>
                <button
                    onClick={() => setActiveView('activities')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                    Ver todas
                </button>
            </div>
            <div className="space-y-3">
                {activities.slice(0, 5).map((activity, index) => (
                    <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
                    >
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <FiActivity className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{activity.subject}</p>
                            <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                            <p className="text-xs text-gray-400 mt-1">
                                {new Date(activity.created_at).toLocaleString('pt-BR')}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )

    const QuickActions = () => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="grid grid-cols-2 gap-4">
                <QuickActionButton
                    icon={FiPlus}
                    label="Novo Lead"
                    onClick={() => {/* Handle new lead */ }}
                />
                <QuickActionButton
                    icon={FiUpload}
                    label="Upload Doc"
                    onClick={() => {/* Handle upload */ }}
                />
                <QuickActionButton
                    icon={FiCalendar}
                    label="Agendar"
                    onClick={() => {/* Handle schedule */ }}
                />
                <QuickActionButton
                    icon={FiPhone}
                    label="Ligar"
                    onClick={() => {/* Handle call */ }}
                />
            </div>
        </div>
    )

    const QuickActionButton = ({ icon: Icon, label, onClick }: any) => (
        <button
            onClick={onClick}
            className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
            <Icon className="h-6 w-6 text-gray-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">{label}</span>
        </button>
    )

    const RecentDocuments = ({ documents }: { documents: any[] }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Documentos Recentes</h3>
                <button
                    onClick={() => setActiveView('documents')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                    Ver todos
                </button>
            </div>
            <div className="space-y-3">
                {documents.map((doc, index) => (
                    <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                    >
                        <div className="flex items-center space-x-3">
                            <FiFileText className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                                <p className="text-xs text-gray-500">{doc.file_type}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => downloadDocument(doc)}
                            className="p-1 text-gray-400 hover:text-blue-600"
                        >
                            <FiDownload className="h-4 w-4" />
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    )

    const ActiveTasks = ({ tasks }: { tasks: any[] }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Tarefas Ativas</h3>
                <button
                    onClick={() => setActiveView('tasks')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                    Ver todas
                </button>
            </div>
            <div className="space-y-3">
                {tasks.map((task, index) => (
                    <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                    >
                        <div className="flex items-center space-x-3">
                            <div className={`h-2 w-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' :
                                task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                }`} />
                            <div>
                                <p className="text-sm font-medium text-gray-900">{task.title}</p>
                                <p className="text-xs text-gray-500">
                                    {task.due_date && new Date(task.due_date).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => completeTask(task.id)}
                            className="p-1 text-gray-400 hover:text-green-600"
                        >
                            <FiCheckCircle className="h-4 w-4" />
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    )

    const StatusBadge = ({ status }: { status: string }) => {
        const statusColors = {
            'new': 'bg-blue-100 text-blue-800',
            'contacted': 'bg-yellow-100 text-yellow-800',
            'qualified': 'bg-green-100 text-green-800',
            'viewing': 'bg-purple-100 text-purple-800',
            'proposal': 'bg-orange-100 text-orange-800',
            'negotiating': 'bg-red-100 text-red-800',
            'closed': 'bg-gray-100 text-gray-800',
        }

        const statusLabels = {
            'new': 'Novo',
            'contacted': 'Contatado',
            'qualified': 'Qualificado',
            'viewing': 'Visitando',
            'proposal': 'Proposta',
            'negotiating': 'Negociando',
            'closed': 'Fechado',
        }

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                }`}>
                {statusLabels[status as keyof typeof statusLabels] || status}
            </span>
        )
    }

    const ActionButton = ({ icon: Icon, label, onClick, color = 'blue' }: any) => (
        <button
            onClick={onClick}
            className={`inline-flex items-center px-4 py-2 rounded-lg border border-transparent text-sm font-medium text-white bg-${color}-600 hover:bg-${color}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500 transition-colors`}
        >
            <Icon className="h-4 w-4 mr-2" />
            {label}
        </button>
    )

    // ==================== MAIN RENDER ====================
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {leadId ? 'Detalhes do Lead' : 'Dashboard CRM'}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {leadId ? `Gerenciando ${lead?.name || 'lead'}` : 'Gestão integrada de leads e documentos'}
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={refresh}
                                className="p-2 text-gray-400 hover:text-gray-600"
                            >
                                <FiActivity className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {leadId ? (
                        <LeadDetailView key="lead-detail" />
                    ) : (
                        <div className="space-y-6">
                            {/* Navigation Tabs */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
                                <div className="flex space-x-1">
                                    <TabButton
                                        active={activeView === 'overview'}
                                        onClick={() => setActiveView('overview')}
                                        icon={FiTrendingUp}
                                        label="Visão Geral"
                                    />
                                    <TabButton
                                        active={activeView === 'documents'}
                                        onClick={() => setActiveView('documents')}
                                        icon={FiFileText}
                                        label="Documentos"
                                    />
                                    <TabButton
                                        active={activeView === 'tasks'}
                                        onClick={() => setActiveView('tasks')}
                                        icon={FiCheckCircle}
                                        label="Tarefas"
                                    />
                                    <TabButton
                                        active={activeView === 'cloud'}
                                        onClick={() => setActiveView('cloud')}
                                        icon={FiFile}
                                        label="Nuvem"
                                    />
                                </div>
                            </div>

                            {/* Tab Content */}
                            <AnimatePresence mode="wait">
                                {activeView === 'overview' && <OverviewDashboard key="overview" />}
                                {activeView === 'documents' && <DocumentsView key="documents" />}
                                {activeView === 'tasks' && <TasksView key="tasks" />}
                                {activeView === 'cloud' && <CloudStorage key="cloud" />}
                            </AnimatePresence>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
