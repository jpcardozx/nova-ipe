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
    FiFileText,
    FiCloud,
    FiBarChart,
    FiSettings,
    FiDatabase,
    FiTarget,
    FiPieChart,
    FiFolderPlus,
    FiChevronLeft,
    FiHome
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

// Tab button component aprimorado
const TabButton = ({ active, onClick, icon: Icon, label }: {
    active: boolean
    onClick: () => void
    icon: any
    label: string
}) => (
    <motion.button
        onClick={onClick}
        className={`relative flex flex-col items-center justify-center p-4 rounded-xl font-medium transition-all duration-300 min-w-[100px] group overflow-hidden ${active
            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-md border border-transparent hover:border-gray-200'
            }`}
        whileHover={{
            scale: 1.02,
            y: -2,
            transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.98 }}
        initial={false}
        animate={{
            scale: active ? 1.05 : 1,
            transition: { duration: 0.2 }
        }}
    >
        {/* Background Glow Effect */}
        {active && (
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl opacity-20 blur-sm"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 0.3 }}
                transition={{ duration: 0.3 }}
            />
        )}

        {/* Hover Background */}
        {!active && (
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
            />
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
            <motion.div
                className="relative mb-2"
                whileHover={{ rotate: active ? 0 : 5 }}
                transition={{ duration: 0.2 }}
            >
                <Icon className={`h-5 w-5 ${active ? 'text-white' : 'text-gray-500 group-hover:text-blue-500'} transition-colors duration-200`} />

                {/* Active Indicator Ring */}
                {active && (
                    <motion.div
                        className="absolute -inset-2 border-2 border-white/30 rounded-full"
                        initial={{ scale: 0, rotate: 0 }}
                        animate={{ scale: 1, rotate: 360 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    />
                )}
            </motion.div>

            <motion.span
                className={`text-xs font-semibold text-center leading-tight ${active ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'} transition-colors duration-200`}
                layout
            >
                {label}
            </motion.span>
        </div>

        {/* Active Indicator Dot */}
        {active && (
            <motion.div
                className="absolute bottom-1 w-1.5 h-1.5 bg-white rounded-full shadow-lg"
                initial={{ scale: 0, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
            />
        )}
    </motion.button>
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

const AnalyticsView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FiBarChart className="h-5 w-5 mr-2 text-blue-600" />
            Analytics & Relatórios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-gray-900">Conversões</h3>
                <p className="text-2xl font-bold text-blue-600">24%</p>
            </div>
            <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-gray-900">Leads Ativos</h3>
                <p className="text-2xl font-bold text-green-600">156</p>
            </div>
            <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-gray-900">Ticket Médio</h3>
                <p className="text-2xl font-bold text-purple-600">R$ 85k</p>
            </div>
        </div>
    </div>
)

const LeadsView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FiUsers className="h-5 w-5 mr-2 text-green-600" />
            Gerenciar Leads
        </h2>
        <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                    <h3 className="font-medium">João Silva</h3>
                    <p className="text-sm text-gray-600">joao@email.com</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Ativo</span>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                    <h3 className="font-medium">Maria Santos</h3>
                    <p className="text-sm text-gray-600">maria@email.com</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Follow-up</span>
            </div>
        </div>
    </div>
)

const ConfigView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FiSettings className="h-5 w-5 mr-2 text-gray-600" />
            Configurações
        </h2>
        <div className="space-y-4">
            <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Integração Supabase</h3>
                <p className="text-sm text-gray-600 mb-2">Status da conexão com banco de dados</p>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Conectado</span>
            </div>
            <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Storage de Documentos</h3>
                <p className="text-sm text-gray-600 mb-2">Armazenamento na nuvem</p>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Ativo</span>
            </div>
        </div>
    </div>
)

interface IntegratedDashboardProps {
    leadId?: string
    view?: 'overview' | 'lead-detail' | 'documents' | 'tasks' | 'activities' | 'cloud' | 'analytics' | 'leads' | 'config'
}

export default function IntegratedDashboard({
    leadId,
    view = 'overview'
}: IntegratedDashboardProps) {
    const [activeView, setActiveView] = useState(view)
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [filterStatus, setFilterStatus] = useState<string>('all')
    const [searchTerm, setSearchTerm] = useState('')

    // Helper function for breadcrumb labels
    const getActiveViewLabel = (view: string) => {
        const labels = {
            'overview': 'Visão Geral',
            'leads': 'Gerenciar Leads',
            'documents': 'Documentos',
            'cloud': 'Armazenamento em Nuvem',
            'tasks': 'Tarefas',
            'analytics': 'Analytics & Relatórios',
            'config': 'Configurações'
        }
        return labels[view as keyof typeof labels] || view
    }

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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-3">
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239CA3AF' fill-opacity='0.03'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
                    }}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Aprimorado */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <motion.div
                                className="flex items-center space-x-4 mb-4"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                {leadId && (
                                    <motion.button
                                        className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                                        onClick={() => window.history.back()}
                                        whileHover={{ x: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FiChevronLeft className="h-5 w-5 mr-1" />
                                        <span className="text-sm">Voltar</span>
                                    </motion.button>
                                )}

                                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <FiTrendingUp className="h-6 w-6 text-white" />
                                </div>

                                <div>
                                    <motion.h1
                                        className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        {leadId ? 'Detalhes do Lead' : 'Dashboard CRM'}
                                    </motion.h1>
                                    <motion.p
                                        className="text-gray-600 mt-1"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        {leadId ? `Gerenciando ${lead?.name || 'lead'}` : 'Gestão integrada de leads e documentos'}
                                    </motion.p>
                                </div>
                            </motion.div>

                            {/* Breadcrumb Melhorado */}
                            {!leadId && (
                                <motion.nav
                                    className="flex items-center space-x-2 text-sm"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.3 }}
                                >
                                    <motion.button
                                        className="flex items-center text-gray-500 hover:text-blue-600 transition-colors"
                                        onClick={() => window.location.href = '/crm-system'}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <FiHome className="h-4 w-4 mr-1" />
                                        <span>CRM System</span>
                                    </motion.button>

                                    <FiChevronLeft className="h-4 w-4 text-gray-400 rotate-180" />

                                    <span className="text-gray-500">Dashboard</span>

                                    <FiChevronLeft className="h-4 w-4 text-gray-400 rotate-180" />

                                    <motion.span
                                        className="text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-md"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        {getActiveViewLabel(activeView)}
                                    </motion.span>
                                </motion.nav>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <motion.div
                            className="flex items-center space-x-3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                        >
                            <motion.button
                                onClick={refresh}
                                className="flex items-center p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                                title="Atualizar dados"
                                whileHover={{ scale: 1.05, rotate: 180 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiActivity className="h-5 w-5" />
                            </motion.button>

                            {!leadId && (
                                <motion.button
                                    onClick={() => setActiveView('config')}
                                    className="flex items-center p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                                    title="Configurações"
                                    whileHover={{ scale: 1.05, rotate: 90 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiSettings className="h-5 w-5" />
                                </motion.button>
                            )}

                            <motion.button
                                className="flex items-center px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FiPlus className="h-4 w-4 mr-2" />
                                Novo Lead
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {leadId ? (
                        <LeadDetailView key="lead-detail" />
                    ) : (
                        <div className="space-y-6">
                            {/* Navigation Tabs Aprimorada */}
                            <motion.div
                                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="flex items-center justify-between mb-3 px-3">
                                    <motion.h3
                                        className="text-sm font-semibold text-gray-700 flex items-center"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mr-2"></div>
                                        Navegação Principal
                                    </motion.h3>
                                    <motion.div
                                        className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.4, type: "spring" }}
                                    >
                                        6 módulos disponíveis
                                    </motion.div>
                                </div>

                                <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
                                    {[
                                        { id: 'overview', icon: FiTrendingUp, label: 'Dashboard', active: activeView === 'overview' },
                                        { id: 'leads', icon: FiUsers, label: 'Leads', active: activeView === 'leads' },
                                        { id: 'documents', icon: FiFileText, label: 'Documentos', active: activeView === 'documents' },
                                        { id: 'cloud', icon: FiCloud, label: 'Nuvem', active: activeView === 'cloud' },
                                        { id: 'tasks', icon: FiCheckCircle, label: 'Tarefas', active: activeView === 'tasks' },
                                        { id: 'analytics', icon: FiBarChart, label: 'Analytics', active: activeView === 'analytics' }
                                    ].map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 + 0.3 }}
                                        >
                                            <TabButton
                                                active={item.active}
                                                onClick={() => setActiveView(item.id as any)}
                                                icon={item.icon}
                                                label={item.label}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Secondary Navigation - Configurações */}
                            <motion.div
                                className="bg-gradient-to-r from-gray-50 to-white rounded-2xl shadow-sm border border-gray-200/50 p-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                            >
                                <div className="flex items-center justify-center">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <TabButton
                                            active={activeView === 'config'}
                                            onClick={() => setActiveView('config')}
                                            icon={FiSettings}
                                            label="Configurações"
                                        />
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Tab Content com Transições Elegantes */}
                            <motion.div
                                className="relative min-h-[600px]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeView}
                                        initial={{
                                            opacity: 0,
                                            y: 20,
                                            scale: 0.95
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            scale: 1
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -20,
                                            scale: 0.95
                                        }}
                                        transition={{
                                            duration: 0.4,
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30
                                        }}
                                        className="relative"
                                    >
                                        {/* Background Pattern for Content */}
                                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                                            <div
                                                className="w-full h-full"
                                                style={{
                                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233B82F6' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                                    backgroundRepeat: 'repeat'
                                                }}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="relative z-10">
                                            {activeView === 'overview' && <OverviewDashboard key="overview" />}
                                            {activeView === 'leads' && <LeadsView key="leads" />}
                                            {activeView === 'documents' && <DocumentsView key="documents" />}
                                            {activeView === 'cloud' && <CloudStorage key="cloud" />}
                                            {activeView === 'tasks' && <TasksView key="tasks" />}
                                            {activeView === 'analytics' && <AnalyticsView key="analytics" />}
                                            {activeView === 'config' && <ConfigView key="config" />}
                                        </div>

                                        {/* Loading Overlay */}
                                        <motion.div
                                            className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center pointer-events-none"
                                            initial={{ opacity: 1 }}
                                            animate={{ opacity: 0 }}
                                            transition={{ delay: 0.1, duration: 0.3 }}
                                        >
                                            <motion.div
                                                className="flex space-x-1"
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
                                                            opacity: [0.4, 1, 0.4]
                                                        }}
                                                        transition={{
                                                            duration: 0.6,
                                                            repeat: Infinity,
                                                            delay: i * 0.1,
                                                            ease: "easeInOut"
                                                        }}
                                                    />
                                                ))}
                                            </motion.div>
                                        </motion.div>
                                    </motion.div>
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
