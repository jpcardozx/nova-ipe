'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import { RemindersService } from '@/lib/supabase/reminders-service'
import {
    CheckSquare,
    Plus,
    Search,
    Filter,
    Clock,
    AlertTriangle,
    User,
    Phone,
    Calendar,
    Building2,
    MessageCircle,
    Mail,
    CheckCircle2,
    X,
    Edit,
    Trash2,
    Bell,
    Flag,
    Users,
    Send,
    Eye,
    MoreVertical,
    Star,
    Archive,
    Share2,
    UserPlus,
    Zap,
    Activity,
    Target,
    Timer,
    PlayCircle,
    PauseCircle
} from 'lucide-react'

interface Task {
    id: string
    title: string
    description: string
    type: 'call' | 'meeting' | 'document' | 'follow_up' | 'visit' | 'other'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
    due_date: string
    due_time?: string
    assigned_to: string
    assigned_to_name?: string
    created_by: string
    created_by_name?: string
    client_id?: string
    client_name?: string
    client_phone?: string
    property_id?: string
    property_title?: string
    created_at: string
    completed_at?: string
    notes?: string
    collaborators?: string[]
    comments?: TaskComment[]
    attachments?: TaskAttachment[]
}

interface TaskComment {
    id: string
    task_id: string
    user_id: string
    user_name: string
    content: string
    created_at: string
}

interface TaskAttachment {
    id: string
    task_id: string
    file_name: string
    file_url: string
    file_size: number
    uploaded_by: string
    uploaded_at: string
}

interface TeamMember {
    id: string
    name: string
    email: string
    avatar?: string
    role: string
    online: boolean
}

export default function EnhancedTasksPage() {
    const { user } = useCurrentUser()
    const [tasks, setTasks] = useState<Task[]>([])
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all')
    const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all')
    const [assignedFilter, setAssignedFilter] = useState<'all' | 'me' | 'team' | string>('all')
    const [viewMode, setViewMode] = useState<'list' | 'board' | 'calendar'>('list')
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [showNewTaskModal, setShowNewTaskModal] = useState(false)
    const [newComment, setNewComment] = useState('')

    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        in_progress: 0,
        completed: 0,
        overdue: 0,
        my_tasks: 0,
        team_tasks: 0
    })

    // Mock data para demonstração
    useEffect(() => {
        loadTasks()
        loadTeamMembers()
    }, [statusFilter, priorityFilter, assignedFilter])

    const loadTasks = async () => {
        setLoading(true)
        try {
            // Aqui integraria com o RemindersService e CRM
            const mockTasks: Task[] = [
                {
                    id: '1',
                    title: 'Ligar para João Silva',
                    description: 'Follow-up sobre interesse em apartamento no Itaim',
                    type: 'call',
                    priority: 'high',
                    status: 'pending',
                    due_date: '2024-12-08',
                    due_time: '14:30',
                    assigned_to: user?.id || '',
                    assigned_to_name: user?.email?.split('@')[0] || '',
                    created_by: user?.id || '',
                    created_by_name: user?.email?.split('@')[0] || '',
                    client_id: 'client1',
                    client_name: 'João Silva',
                    client_phone: '(11) 99999-9999',
                    created_at: '2024-12-07T10:00:00Z',
                    collaborators: ['user2', 'user3'],
                    comments: [
                        {
                            id: 'c1',
                            task_id: '1',
                            user_id: user?.id || '',
                            user_name: user?.email?.split('@')[0] || '',
                            content: 'Cliente demonstrou interesse em imóveis de 2-3 quartos',
                            created_at: '2024-12-07T15:00:00Z'
                        }
                    ]
                },
                {
                    id: '2',
                    title: 'Reunião com Maria Santos',
                    description: 'Apresentação de portfólio para investidora',
                    type: 'meeting',
                    priority: 'urgent',
                    status: 'in_progress',
                    due_date: '2024-12-08',
                    due_time: '16:00',
                    assigned_to: 'user2',
                    assigned_to_name: 'Pedro Oliveira',
                    created_by: user?.id || '',
                    created_by_name: user?.email?.split('@')[0] || '',
                    client_id: 'client2',
                    client_name: 'Maria Santos',
                    created_at: '2024-12-06T09:00:00Z',
                    collaborators: [user?.id || '']
                },
                {
                    id: '3',
                    title: 'Revisar contrato',
                    description: 'Análise de cláusulas do contrato de venda',
                    type: 'document',
                    priority: 'medium',
                    status: 'completed',
                    due_date: '2024-12-07',
                    assigned_to: user?.id || '',
                    assigned_to_name: user?.email?.split('@')[0] || '',
                    created_by: user?.id || '',
                    created_by_name: user?.email?.split('@')[0] || '',
                    created_at: '2024-12-05T14:00:00Z',
                    completed_at: '2024-12-07T11:30:00Z'
                }
            ]

            setTasks(mockTasks)

            // Calcular estatísticas
            const now = new Date()
            const statsCalc = {
                total: mockTasks.length,
                pending: mockTasks.filter(t => t.status === 'pending').length,
                in_progress: mockTasks.filter(t => t.status === 'in_progress').length,
                completed: mockTasks.filter(t => t.status === 'completed').length,
                overdue: mockTasks.filter(t =>
                    t.status !== 'completed' && new Date(t.due_date) < now
                ).length,
                my_tasks: mockTasks.filter(t => t.assigned_to === user?.id).length,
                team_tasks: mockTasks.filter(t =>
                    t.assigned_to !== user?.id || t.collaborators?.includes(user?.id || '')
                ).length
            }
            setStats(statsCalc)

        } catch (error) {
            console.error('Erro ao carregar tarefas:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadTeamMembers = async () => {
        // Mock data - em produção, carregaria da API
        const mockTeam: TeamMember[] = [
            {
                id: 'user1',
                name: 'Ana Costa',
                email: 'ana@novaipe.com',
                role: 'Corretora',
                online: true
            },
            {
                id: 'user2',
                name: 'Pedro Oliveira',
                email: 'pedro@novaipe.com',
                role: 'Gerente',
                online: false
            },
            {
                id: 'user3',
                name: 'Carolina Lima',
                email: 'carolina@novaipe.com',
                role: 'Corretora',
                online: true
            }
        ]
        setTeamMembers(mockTeam)
    }

    const filteredTasks = tasks.filter(task => {
        if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !task.client_name?.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false
        }

        if (statusFilter !== 'all' && task.status !== statusFilter) {
            return false
        }

        if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
            return false
        }

        if (assignedFilter === 'me' && task.assigned_to !== user?.id) {
            return false
        }

        if (assignedFilter === 'team' && task.assigned_to === user?.id &&
            !task.collaborators?.includes(user?.id || '')) {
            return false
        }

        return true
    })

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'low': return 'text-green-600 bg-green-50 border-green-200'
            case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
            case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
            case 'urgent': return 'text-red-600 bg-red-50 border-red-200'
            default: return 'text-gray-600 bg-gray-50 border-gray-200'
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'text-gray-600 bg-gray-50'
            case 'in_progress': return 'text-blue-600 bg-blue-50'
            case 'completed': return 'text-green-600 bg-green-50'
            case 'cancelled': return 'text-red-600 bg-red-50'
            default: return 'text-gray-600 bg-gray-50'
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'call': return <Phone className="h-4 w-4" />
            case 'meeting': return <Calendar className="h-4 w-4" />
            case 'document': return <Building2 className="h-4 w-4" />
            case 'follow_up': return <MessageCircle className="h-4 w-4" />
            case 'visit': return <Eye className="h-4 w-4" />
            default: return <CheckSquare className="h-4 w-4" />
        }
    }

    const handleStatusChange = async (taskId: string, newStatus: string) => {
        // Implementar mudança de status
        setTasks(prev => prev.map(task =>
            task.id === taskId
                ? { ...task, status: newStatus as any, completed_at: newStatus === 'completed' ? new Date().toISOString() : undefined }
                : task
        ))
    }

    const handleAddComment = async (taskId: string) => {
        if (!newComment.trim()) return

        const comment: TaskComment = {
            id: Date.now().toString(),
            task_id: taskId,
            user_id: user?.id || '',
            user_name: user?.email?.split('@')[0] || '',
            content: newComment,
            created_at: new Date().toISOString()
        }

        setTasks(prev => prev.map(task =>
            task.id === taskId
                ? { ...task, comments: [...(task.comments || []), comment] }
                : task
        ))

        setNewComment('')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Sistema de Tarefas Colaborativo</h1>
                            <p className="text-gray-600 mt-2">Gerencie tarefas em equipe com comunicação integrada</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowNewTaskModal(true)}
                                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                            >
                                <Plus className="h-5 w-5" />
                                Nova Tarefa
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                </div>
                                <CheckSquare className="h-8 w-8 text-gray-400" />
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Pendentes</p>
                                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                                </div>
                                <Clock className="h-8 w-8 text-yellow-400" />
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Em Andamento</p>
                                    <p className="text-2xl font-bold text-blue-600">{stats.in_progress}</p>
                                </div>
                                <PlayCircle className="h-8 w-8 text-blue-400" />
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Concluídas</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                                </div>
                                <CheckCircle2 className="h-8 w-8 text-green-400" />
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Atrasadas</p>
                                    <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                                </div>
                                <AlertTriangle className="h-8 w-8 text-red-400" />
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Minhas</p>
                                    <p className="text-2xl font-bold text-purple-600">{stats.my_tasks}</p>
                                </div>
                                <User className="h-8 w-8 text-purple-400" />
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Em Equipe</p>
                                    <p className="text-2xl font-bold text-indigo-600">{stats.team_tasks}</p>
                                </div>
                                <Users className="h-8 w-8 text-indigo-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex-1 min-w-64">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Buscar tarefas ou clientes..."
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
                            <option value="all">Todos Status</option>
                            <option value="pending">Pendente</option>
                            <option value="in_progress">Em Andamento</option>
                            <option value="completed">Concluída</option>
                        </select>

                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value as any)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                            <option value="all">Todas Prioridades</option>
                            <option value="urgent">Urgente</option>
                            <option value="high">Alta</option>
                            <option value="medium">Média</option>
                            <option value="low">Baixa</option>
                        </select>

                        <select
                            value={assignedFilter}
                            onChange={(e) => setAssignedFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                            <option value="all">Todos Responsáveis</option>
                            <option value="me">Minhas Tarefas</option>
                            <option value="team">Tarefas da Equipe</option>
                        </select>

                        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-amber-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                Lista
                            </button>
                            <button
                                onClick={() => setViewMode('board')}
                                className={`px-3 py-2 text-sm border-l border-gray-300 ${viewMode === 'board' ? 'bg-amber-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                Kanban
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tasks List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                            <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma tarefa encontrada</h3>
                            <p className="text-gray-600">Tente ajustar os filtros ou criar uma nova tarefa.</p>
                        </div>
                    ) : (
                        filteredTasks.map(task => (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={`p-2 rounded-full ${getPriorityColor(task.priority)}`}>
                                                    {getTypeIcon(task.type)}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                                                    <p className="text-sm text-gray-600">{task.description}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 mt-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                                    {task.status === 'pending' && 'Pendente'}
                                                    {task.status === 'in_progress' && 'Em Andamento'}
                                                    {task.status === 'completed' && 'Concluída'}
                                                    {task.status === 'cancelled' && 'Cancelada'}
                                                </span>

                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                                    {task.priority === 'low' && 'Baixa'}
                                                    {task.priority === 'medium' && 'Média'}
                                                    {task.priority === 'high' && 'Alta'}
                                                    {task.priority === 'urgent' && 'Urgente'}
                                                </span>

                                                {task.client_name && (
                                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                                        <User className="h-4 w-4" />
                                                        {task.client_name}
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <Calendar className="h-4 w-4" />
                                                    {new Date(task.due_date).toLocaleDateString('pt-BR')}
                                                    {task.due_time && ` às ${task.due_time}`}
                                                </div>

                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <User className="h-4 w-4" />
                                                    {task.assigned_to_name}
                                                </div>

                                                {task.collaborators && task.collaborators.length > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        <Users className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">
                                                            +{task.collaborators.length} colaboradores
                                                        </span>
                                                    </div>
                                                )}

                                                {task.comments && task.comments.length > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        <MessageCircle className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">
                                                            {task.comments.length} comentários
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 ml-4">
                                            {task.status !== 'completed' && (
                                                <select
                                                    value={task.status}
                                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-amber-500"
                                                >
                                                    <option value="pending">Pendente</option>
                                                    <option value="in_progress">Em Andamento</option>
                                                    <option value="completed">Concluída</option>
                                                </select>
                                            )}

                                            <button
                                                onClick={() => setSelectedTask(task)}
                                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>

                                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                                <MoreVertical className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Comments Preview */}
                                    {task.comments && task.comments.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <div className="space-y-2">
                                                {task.comments.slice(-2).map(comment => (
                                                    <div key={comment.id} className="flex items-start gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                                                            <span className="text-xs font-medium text-gray-600">
                                                                {comment.user_name.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-medium text-gray-900">
                                                                    {comment.user_name}
                                                                </span>
                                                                <span className="text-xs text-gray-500">
                                                                    {new Date(comment.created_at).toLocaleString('pt-BR')}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-600 mt-1">{comment.content}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Task Detail Modal */}
                <AnimatePresence>
                    {selectedTask && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">{selectedTask.title}</h2>
                                        <button
                                            onClick={() => setSelectedTask(null)}
                                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                                        >
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Descrição</h3>
                                            <p className="text-gray-600">{selectedTask.description}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-medium text-gray-900">Status</h4>
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTask.status)} mt-1`}>
                                                    {selectedTask.status === 'pending' && 'Pendente'}
                                                    {selectedTask.status === 'in_progress' && 'Em Andamento'}
                                                    {selectedTask.status === 'completed' && 'Concluída'}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">Prioridade</h4>
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedTask.priority)} mt-1`}>
                                                    {selectedTask.priority === 'low' && 'Baixa'}
                                                    {selectedTask.priority === 'medium' && 'Média'}
                                                    {selectedTask.priority === 'high' && 'Alta'}
                                                    {selectedTask.priority === 'urgent' && 'Urgente'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Comments Section */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Comentários</h3>
                                            <div className="space-y-4">
                                                {selectedTask.comments?.map(comment => (
                                                    <div key={comment.id} className="flex items-start gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                                            <span className="text-sm font-medium text-gray-600">
                                                                {comment.user_name.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium text-gray-900">
                                                                    {comment.user_name}
                                                                </span>
                                                                <span className="text-sm text-gray-500">
                                                                    {new Date(comment.created_at).toLocaleString('pt-BR')}
                                                                </span>
                                                            </div>
                                                            <p className="text-gray-600 mt-1">{comment.content}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Add Comment */}
                                            <div className="mt-4 flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                    placeholder="Adicionar comentário..."
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleAddComment(selectedTask.id)
                                                        }
                                                    }}
                                                />
                                                <button
                                                    onClick={() => handleAddComment(selectedTask.id)}
                                                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center gap-2"
                                                >
                                                    <Send className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
