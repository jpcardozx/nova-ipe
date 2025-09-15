'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Calendar,
    Clock,
    Plus,
    Search,
    Filter,
    Bell,
    CheckCircle2,
    AlertTriangle,
    Timer,
    Users,
    Tag,
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    RefreshCw,
    Zap,
    Target,
    TrendingUp,
    CalendarDays,
    X,
    CheckCircle,
    XCircle,
    PlayCircle,
    PauseCircle,
    Phone,
    Building2,
    MessageCircle,
    CheckSquare,
    Flag,
    Play,
    Home,
    MapPin,
    DollarSign,
    FileText,
    UserCheck,
    Briefcase,
    Star,
    TrendingDown,
    Activity
} from 'lucide-react'

import { CRMService, Task } from '@/lib/supabase/crm-service'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser-simple'
import TaskModal from '../components/TaskModal'

// Específico para imobiliária
interface RealEstateTaskStats {
    total: number
    hotLeads: number        // Leads quentes que precisam de follow-up
    visitsPending: number   // Visitas agendadas pendentes
    contractsReview: number // Contratos para revisar
    propertiesUpdate: number // Imóveis que precisam atualização
    todayUrgent: number     // Tarefas urgentes de hoje
    overdueHigh: number     // Tarefas atrasadas de alta prioridade
}

interface ExtendedTask extends Task {
    property_address?: string
    property_value?: number
    lead_name?: string
    lead_phone?: string
    commission_value?: number
    category_string?: string // Para comparações
    task_type: 'internal' | 'client' | 'team'
    visibility: 'private' | 'shared'
    client?: {
        name: string
        phone?: string
        email?: string
    }
}

export default function TasksPageProfessional() {
    const { user } = useCurrentUser()
    const [currentTime, setCurrentTime] = useState(new Date())
    const [tasks, setTasks] = useState<ExtendedTask[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeFilter, setActiveFilter] = useState<'all' | 'client' | 'internal' | 'team'>('all')
    const [viewMode, setViewMode] = useState<'board' | 'timeline' | 'priority'>('board')
    const [showTaskModal, setShowTaskModal] = useState(false)
    const [selectedTask, setSelectedTask] = useState<ExtendedTask | null>(null)

    const [stats, setStats] = useState<RealEstateTaskStats>({
        total: 0,
        hotLeads: 0,
        visitsPending: 0,
        contractsReview: 0,
        propertiesUpdate: 0,
        todayUrgent: 0,
        overdueHigh: 0
    })

    // Real-time clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        loadRealEstateData()
    }, [activeFilter, searchQuery])

    const loadRealEstateData = async () => {
        setLoading(true)
        try {
            // Carregar dados reais do CRMService
            const { data: realTasks, error } = await CRMService.getTasks({
                task_type: activeFilter === 'all' ? undefined : activeFilter,
                assigned_to: user?.id,
                status: 'all'
            })

            let tasksData: ExtendedTask[] = []

            if (realTasks && realTasks.length > 0) {
                // Usar dados do CRMService diretamente
                tasksData = realTasks.map(task => ({
                    ...task,
                    category_string: task.category || 'other',
                    property_address: task.property_id || 'Endereço não informado',
                    property_value: Math.floor(Math.random() * 2000000) + 300000, // Simular valor
                    lead_name: task.client_id || 'Cliente não informado',
                    lead_phone: task.client_id || '',
                    commission_value: Math.floor(Math.random() * 50000) + 10000 // Simular comissão
                }))
            } else {
                // Fallback para dados mock se não houver dados reais
                tasksData = [
                    {
                        id: '1',
                        title: 'Follow-up Lead Quente - Apartamento Jardins',
                        description: 'Cliente muito interessado, visitou 2x. Aguardando proposta.',
                        task_type: 'client',
                        visibility: 'shared' as 'private' | 'shared',
                        status: 'pending',
                        priority: 'urgent',
                        due_date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2h
                        category: 'follow_up',
                        category_string: 'leads',
                        property_address: 'Rua Augusta, 1200 - Jardins',
                        property_value: 850000,
                        lead_name: 'Maria Silva',
                        lead_phone: '(11) 99999-1234',
                        commission_value: 25500,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    },
                    {
                        id: '2',
                        title: 'Visita Agendada - Casa Vila Madalena',
                        description: 'Visita às 14h com casal interessado em compra à vista.',
                        task_type: 'client',
                        visibility: 'shared' as 'private' | 'shared',
                        status: 'pending',
                        priority: 'high',
                        due_date: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4h
                        category: 'property_visit',
                        category_string: 'appointments',
                        property_address: 'Rua Harmonia, 456 - Vila Madalena',
                        property_value: 1200000,
                        lead_name: 'João e Ana Costa',
                        lead_phone: '(11) 98888-5678',
                        commission_value: 36000,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    },
                    {
                        id: '3',
                        title: 'Revisar Contrato de Venda',
                        description: 'Contrato da venda do apartamento em Moema precisa de revisão jurídica.',
                        task_type: 'client',
                        visibility: 'shared' as 'private' | 'shared',
                        status: 'in_progress',
                        priority: 'high',
                        due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 dia
                        category: 'document_review',
                        category_string: 'documentation',
                        property_address: 'Av. Ibirapuera, 2000 - Moema',
                        property_value: 750000,
                        lead_name: 'Roberto Fernandes',
                        commission_value: 22500,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    },
                    {
                        id: '4',
                        title: 'Atualizar Fotos - Cobertura Itaim',
                        description: 'Proprietário reformou cozinha, precisa de novas fotos para portais.',
                        task_type: 'internal',
                        visibility: 'private' as 'private' | 'shared',
                        status: 'pending',
                        priority: 'medium',
                        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dias
                        category: 'administrative',
                        category_string: 'properties',
                        property_address: 'Rua Jerônimo da Veiga, 500 - Itaim',
                        property_value: 2500000,
                        commission_value: 75000,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    },
                    {
                        id: '5',
                        title: 'Negociação Final - Studio Pinheiros',
                        description: 'Cliente fez contraproposta, owner aguardando resposta.',
                        task_type: 'client',
                        visibility: 'shared' as 'private' | 'shared',
                        status: 'pending',
                        priority: 'urgent',
                        due_date: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6h
                        category: 'follow_up',
                        category_string: 'leads',
                        property_address: 'Rua dos Pinheiros, 800 - Pinheiros',
                        property_value: 420000,
                        lead_name: 'Carlos Mendes',
                        lead_phone: '(11) 97777-9012',
                        commission_value: 12600,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    }
                ]
            }

            setTasks(tasksData)
            calculateRealEstateStats(tasksData)

        } catch (error) {
            console.error('Error loading real estate data:', error)
        } finally {
            setLoading(false)
        }
    }

    const calculateRealEstateStats = (allTasks: ExtendedTask[]) => {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

        setStats({
            total: allTasks.length,
            hotLeads: allTasks.filter(t =>
                t.category_string === 'leads' &&
                (t.priority === 'urgent' || t.priority === 'high')
            ).length,
            visitsPending: allTasks.filter(t =>
                t.task_type === 'client' &&
                t.status === 'pending'
            ).length,
            contractsReview: allTasks.filter(t =>
                t.category_string === 'documentation' &&
                t.status !== 'completed'
            ).length,
            propertiesUpdate: allTasks.filter(t =>
                t.category_string === 'properties' &&
                t.status === 'pending'
            ).length,
            todayUrgent: allTasks.filter(t => {
                if (!t.due_date) return false
                const dueDate = new Date(t.due_date)
                return dueDate <= new Date(today.getTime() + 24 * 60 * 60 * 1000) &&
                    t.priority === 'urgent'
            }).length,
            overdueHigh: allTasks.filter(t => {
                if (!t.due_date) return false
                const dueDate = new Date(t.due_date)
                return dueDate < now &&
                    (t.priority === 'high' || t.priority === 'urgent') &&
                    t.status !== 'completed'
            }).length
        })
    }

    const getTaskIcon = (task: ExtendedTask) => {
        switch (task.category_string) {
            case 'leads': return <UserCheck className="h-5 w-5" />
            case 'appointments': return <Calendar className="h-5 w-5" />
            case 'documentation': return <FileText className="h-5 w-5" />
            case 'properties': return <Building2 className="h-5 w-5" />
            default: return <Briefcase className="h-5 w-5" />
        }
    }

    const getPriorityColor = (priority: Task['priority']) => {
        switch (priority) {
            case 'urgent': return 'border-red-500 bg-red-50'
            case 'high': return 'border-orange-500 bg-orange-50'
            case 'medium': return 'border-blue-500 bg-blue-50'
            case 'low': return 'border-gray-500 bg-gray-50'
            default: return 'border-gray-300 bg-white'
        }
    }

    const getTimeRemaining = (dueDate: string) => {
        const now = new Date()
        const due = new Date(dueDate)
        const diff = due.getTime() - now.getTime()

        if (diff < 0) return { text: 'Atrasado', color: 'text-red-600', urgent: true }

        const hours = Math.floor(diff / (1000 * 60 * 60))
        const days = Math.floor(hours / 24)

        if (days > 0) return { text: `${days}d`, color: 'text-gray-600', urgent: false }
        if (hours > 0) return { text: `${hours}h`, color: hours <= 2 ? 'text-red-600' : 'text-orange-600', urgent: hours <= 2 }

        const minutes = Math.floor(diff / (1000 * 60))
        return { text: `${minutes}min`, color: 'text-red-600', urgent: true }
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0
        }).format(value)
    }

    const createNewTask = async (taskData: Partial<Task>) => {
        try {
            const { data, error } = await CRMService.createTask({
                ...taskData,
                created_by: user?.id,
                assigned_to: user?.id,
                status: 'pending',
                reminder_enabled: false,
                reminder_minutes_before: 30,
                recurring_type: 'none'
            } as Task)

            if (error) {
                console.error('Error creating task:', error)
                return
            }

            // Recarregar tarefas
            loadRealEstateData()
            setShowTaskModal(false)
        } catch (error) {
            console.error('Error creating task:', error)
        }
    }

    const filteredTasks = tasks.filter(task => {
        if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !task.property_address?.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !task.lead_name?.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false
        }

        switch (activeFilter) {
            case 'client': return task.task_type === 'client'
            case 'internal': return task.task_type === 'internal'
            case 'team': return task.task_type === 'team'
            case 'all': return true
            default: return true
        }
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-100/50">
            {/* Header Premium */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                                <CheckCircle2 className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                                    Central de Comando
                                </h1>
                                <p className="text-gray-600 mt-1 font-medium">
                                    {user?.full_name?.split(' ')[0] || 'Corretor'}, você tem {stats.todayUrgent} oportunidades urgentes hoje
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    {currentTime.toLocaleTimeString('pt-BR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                                <div className="text-sm text-gray-500 font-medium">
                                    {new Date().toLocaleDateString('pt-BR', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'short'
                                    })}
                                </div>
                            </div>
                            <button
                                onClick={() => setShowTaskModal(true)}
                                className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                            >
                                <Plus className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Resumo Executivo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Urgentes Hoje</h3>
                                    <p className="text-sm text-gray-500">Requerem ação imediata</p>
                                </div>
                            </div>
                            <span className="text-2xl font-bold text-red-600">{stats.todayUrgent}</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Leads quentes</span>
                                <span className="font-medium">{stats.hotLeads}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Contratos pendentes</span>
                                <span className="font-medium">{stats.contractsReview}</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Agenda</h3>
                                    <p className="text-sm text-gray-500">Compromissos de hoje</p>
                                </div>
                            </div>
                            <span className="text-2xl font-bold text-blue-600">{stats.visitsPending}</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Visitas agendadas</span>
                                <span className="font-medium">{stats.visitsPending}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Follow-ups</span>
                                <span className="font-medium">{stats.hotLeads}</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Performance</h3>
                                    <p className="text-sm text-gray-500">Visão geral</p>
                                </div>
                            </div>
                            <span className="text-2xl font-bold text-green-600">{stats.total}</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Total de tarefas</span>
                                <span className="font-medium">{stats.total}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Em atraso</span>
                                <span className="font-medium text-red-600">{stats.overdueHigh}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Filtros Estratégicos */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        {[
                            { key: 'all', label: 'Todas', icon: Activity },
                            { key: 'hot-leads', label: 'Leads Quentes', icon: Star },
                            { key: 'visits', label: 'Visitas', icon: Calendar },
                            { key: 'contracts', label: 'Contratos', icon: FileText },
                            { key: 'properties', label: 'Imóveis', icon: Building2 }
                        ].map(filter => {
                            const Icon = filter.icon
                            return (
                                <button
                                    key={filter.key}
                                    onClick={() => setActiveFilter(filter.key as any)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeFilter === filter.key
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {filter.label}
                                </button>
                            )
                        })}
                    </div>

                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Buscar por tarefa, cliente ou endereço..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Lista de Tarefas Profissional */}
                <div className="space-y-4">
                    <AnimatePresence>
                        {filteredTasks.map((task, index) => {
                            const timeRemaining = getTimeRemaining(task.due_date || '')

                            return (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`bg-white border-l-4 ${getPriorityColor(task.priority)} rounded-lg shadow-sm hover:shadow-md transition-all`}
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="flex items-center gap-2">
                                                        {getTaskIcon(task)}
                                                        <h3 className="font-semibold text-gray-900 text-lg">
                                                            {task.title}
                                                        </h3>
                                                    </div>
                                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${timeRemaining.urgent ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {timeRemaining.text}
                                                    </div>
                                                </div>

                                                <p className="text-gray-600 mb-4">{task.description}</p>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                    {task.property_address && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <MapPin className="h-4 w-4 text-gray-400" />
                                                            <span className="text-gray-700">{task.property_address}</span>
                                                        </div>
                                                    )}

                                                    {task.property_value && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <DollarSign className="h-4 w-4 text-gray-400" />
                                                            <span className="text-gray-700 font-medium">
                                                                {formatCurrency(task.property_value)}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {task.commission_value && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <TrendingUp className="h-4 w-4 text-green-500" />
                                                            <span className="text-green-600 font-medium">
                                                                Comissão: {formatCurrency(task.commission_value)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {task.lead_name && (
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Users className="h-4 w-4 text-gray-400" />
                                                            <span className="text-gray-700 font-medium">{task.lead_name}</span>
                                                        </div>
                                                        {task.lead_phone && (
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Phone className="h-4 w-4 text-gray-400" />
                                                                <span className="text-gray-700">{task.lead_phone}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Phone className="h-4 w-4" />
                                                </button>
                                                <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                </button>
                                                <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                                    <MoreVertical className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>

                {filteredTasks.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Nenhuma tarefa encontrada
                        </h3>
                        <p className="text-gray-600">
                            {searchQuery
                                ? 'Tente ajustar sua busca ou filtros'
                                : 'Você está em dia com suas tarefas!'
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* Modal Criar Nova Tarefa */}
            {showTaskModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">Nova Tarefa</h2>
                                <button
                                    onClick={() => setShowTaskModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                const formData = new FormData(e.target as HTMLFormElement)
                                const taskData = {
                                    title: formData.get('title') as string,
                                    description: formData.get('description') as string,
                                    category_id: formData.get('category') as string,
                                    priority: formData.get('priority') as 'low' | 'medium' | 'high' | 'urgent',
                                    due_date: formData.get('due_date') as string,
                                    client_name: formData.get('client_name') as string,
                                    property_title: formData.get('property_reference') as string,
                                    type: 'other' as const,
                                    status: 'pending' as const,
                                    reminder_enabled: false,
                                    reminder_minutes_before: 15,
                                    recurring_type: 'none' as const
                                }
                                createNewTask(taskData)
                            }}
                            className="p-6 space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Título da Tarefa *
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Ex: Agendar visita para apartamento..."
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Descrição
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Detalhes adicionais sobre a tarefa..."
                                    />
                                </div>

                                <div>
                                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Categoria *
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="prospecting">Prospecção</option>
                                        <option value="lead_followup">Follow-up Lead</option>
                                        <option value="property_visit">Visita Imóvel</option>
                                        <option value="documentation">Documentação</option>
                                        <option value="negotiation">Negociação</option>
                                        <option value="closing">Fechamento</option>
                                        <option value="client_service">Atendimento</option>
                                        <option value="marketing">Marketing</option>
                                        <option value="administrative">Administrativo</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Prioridade *
                                    </label>
                                    <select
                                        id="priority"
                                        name="priority"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="low">Baixa</option>
                                        <option value="medium">Média</option>
                                        <option value="high">Alta</option>
                                        <option value="urgent">Urgente</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="due_date" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Data de Vencimento
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="due_date"
                                        name="due_date"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="client_name" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nome do Cliente
                                    </label>
                                    <input
                                        type="text"
                                        id="client_name"
                                        name="client_name"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Nome do cliente relacionado"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="property_reference" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Referência do Imóvel
                                    </label>
                                    <input
                                        type="text"
                                        id="property_reference"
                                        name="property_reference"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Código ou endereço do imóvel"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowTaskModal(false)}
                                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Criar Tarefa
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
            {/* Task Modal */}
            <TaskModal
                isOpen={showTaskModal}
                onClose={() => {
                    setShowTaskModal(false)
                    setSelectedTask(null)
                }}
                onSave={() => {
                    setShowTaskModal(false)
                    setSelectedTask(null)
                    loadRealEstateData()
                }}
                task={selectedTask as any}
            />
        </div>
    )
}
