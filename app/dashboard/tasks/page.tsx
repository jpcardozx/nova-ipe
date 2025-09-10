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
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Zap,
    Target,
    TrendingUp,
    CalendarDays,
    CheckCircle,
    XCircle,
    PlayCircle,
    PauseCircle,
    Phone,
    Building2,
    MessageCircle,
    CheckSquare,
    Flag,
    X,
    Play
} from 'lucide-react'
import { TasksService } from '@/lib/supabase/tasks-service'
import { useNotifications } from '@/hooks/useNotifications'
import { Task, TaskCategory } from '@/app/types/database'
import { TaskModal } from '@/components/dashboard/TaskModal'

interface TaskStats {
    total: number
    pending: number
    in_progress: number
    completed: number
    overdue: number
    today: number
    urgent: number
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [categories, setCategories] = useState<TaskCategory[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | Task['status']>('all')
    const [priorityFilter, setPriorityFilter] = useState<'all' | Task['priority']>('all')
    const [categoryFilter, setCategoryFilter] = useState<'all' | string>('all')
    const [viewMode, setViewMode] = useState<'list' | 'board' | 'calendar'>('list')
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [showTaskModal, setShowTaskModal] = useState(false)

    // Notifications
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications('current-user')
    const [showNotifications, setShowNotifications] = useState(false)

    const [stats, setStats] = useState<TaskStats>({
        total: 0,
        pending: 0,
        in_progress: 0,
        completed: 0,
        overdue: 0,
        today: 0,
        urgent: 0
    })

    useEffect(() => {
        loadTasks()
        loadCategories()
    }, [statusFilter, priorityFilter, categoryFilter, searchQuery])

    const loadTasks = async () => {
        setLoading(true)
        try {
            const { data, error } = await TasksService.getTasks({
                status: statusFilter !== 'all' ? statusFilter : undefined,
                priority: priorityFilter !== 'all' ? priorityFilter : undefined,
                category: categoryFilter !== 'all' ? categoryFilter : undefined,
                search: searchQuery || undefined
            })

            if (data) {
                setTasks(data)
                calculateStats(data)
            }
        } catch (error) {
            console.error('Error loading tasks:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadCategories = async () => {
        try {
            const { data } = await TasksService.getTaskCategories()
            setCategories(data || [])
        } catch (error) {
            console.error('Error loading categories:', error)
        }
    }

    const calculateStats = (allTasks: Task[]) => {
        const now = new Date()
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const startOfWeek = new Date(startOfDay)
        startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay())

        setStats({
            total: allTasks.length,
            pending: allTasks.filter(t => t.status === 'pending').length,
            in_progress: allTasks.filter(t => t.status === 'in_progress').length,
            completed: allTasks.filter(t => t.status === 'completed').length,
            overdue: allTasks.filter(t => t.status === 'overdue').length,
            urgent: allTasks.filter(t => t.priority === 'urgent').length,
            today: allTasks.filter(t => {
                if (!t.due_date) return false
                const dueDate = new Date(t.due_date)
                return dueDate >= startOfDay && dueDate < new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
            }).length,
        })
    }

    const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
        try {
            const { data, error } = await TasksService.updateTask(taskId, {
                status: newStatus,
                completed_at: newStatus === 'completed' ? new Date().toISOString() : undefined
            })

            if (data) {
                setTasks(prev => prev.map(task =>
                    task.id === taskId ? { ...task, ...data } : task
                ))
            }
        } catch (error) {
            console.error('Error updating task status:', error)
        }
    }

    const deleteTask = async (taskId: string) => {
        try {
            await TasksService.deleteTask(taskId)
            setTasks(prev => prev.filter(task => task.id !== taskId))
        } catch (error) {
            console.error('Error deleting task:', error)
        }
    }

    const getStatusConfig = (status: Task['status']) => {
        const configs: { [key in Task['status']]: { color: string; icon: JSX.Element; label: string } } = {
            pending: {
                color: 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200',
                icon: <Clock className="h-3 w-3" />,
                label: 'Pendente'
            },
            in_progress: {
                color: 'bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 border-yellow-200',
                icon: <Play className="h-3 w-3" />,
                label: 'Em andamento'
            },
            completed: {
                color: 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200',
                icon: <CheckCircle2 className="h-3 w-3" />,
                label: 'Concluída'
            },
            cancelled: {
                color: 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-600 border-gray-200',
                icon: <X className="h-3 w-3" />,
                label: 'Cancelada'
            },
            overdue: {
                color: 'bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border-red-200',
                icon: <AlertTriangle className="h-3 w-3" />,
                label: 'Atrasada'
            }
        }
        return configs[status]
    }

    const getPriorityConfig = (priority: Task['priority']) => {
        const configs: { [key in Task['priority']]: { color: string; icon: string; label: string } } = {
            low: { color: 'text-green-500', icon: '🌱', label: 'Baixa' },
            medium: { color: 'text-yellow-500', icon: '⚡', label: 'Média' },
            high: { color: 'text-orange-500', icon: '🔥', label: 'Alta' },
            urgent: { color: 'text-red-500', icon: '🚨', label: 'Urgente' }
        }
        return configs[priority]
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = date.getTime() - now.getTime()
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

        if (diffDays === 0) return 'Hoje'
        if (diffDays === 1) return 'Amanhã'
        if (diffDays === -1) return 'Ontem'
        if (diffDays > 0) return `Em ${diffDays} dias`
        return `${Math.abs(diffDays)} dias atrás`
    }

    const formatTime = (dateString?: string) => {
        if (!dateString) return ''
        return new Date(dateString).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getTypeIcon = (type: Task['type']) => {
        const icons: { [key in Task['type']]: React.ElementType } = {
            call: Phone,
            meeting: Calendar,
            document: Building2,
            follow_up: MessageCircle,
            visit: Building2,
            other: CheckSquare
        }
        return icons[type]
    }

    const getTypeLabel = (type: Task['type']) => {
        const labels: { [key in Task['type']]: string } = {
            call: 'Ligação',
            meeting: 'Reunião',
            document: 'Documento',
            follow_up: 'Follow-up',
            visit: 'Visita',
            other: 'Outro'
        }
        return labels[type]
    }

    const getPriorityColor = (priority: Task['priority']) => {
        const colors: { [key in Task['priority']]: string } = {
            low: 'bg-gray-100 text-gray-800',
            medium: 'bg-blue-100 text-blue-800',
            high: 'bg-orange-100 text-orange-800',
            urgent: 'bg-red-100 text-red-800'
        }
        return colors[priority]
    }

    const getPriorityIcon = (priority: Task['priority']) => {
        if (priority === 'urgent') return <AlertTriangle className="h-3 w-3" />
        if (priority === 'high') return <Flag className="h-3 w-3" />
        return null
    }

    const getStatusBadge = (status: Task['status']) => {
        const styles: { [key in Task['status']]: string } = {
            pending: 'bg-yellow-100 text-yellow-800',
            in_progress: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            overdue: 'bg-red-200 text-red-900'
        }

        const labels: { [key in Task['status']]: string } = {
            pending: 'Pendente',
            in_progress: 'Em Andamento',
            completed: 'Concluída',
            cancelled: 'Cancelada',
            overdue: 'Atrasada'
        }

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
                {labels[status]}
            </span>
        )
    }

    const isOverdue = (dueDate?: string, dueTime?: string) => {
        if (!dueDate) return false
        const now = new Date()
        const due = new Date(dueDate)
        if (dueTime) {
            const [hours, minutes] = dueTime.split(':')
            due.setHours(parseInt(hours), parseInt(minutes))
        }
        return due < now
    }

    const markAsCompleted = async (taskId: string) => {
        setTasks(prev => prev.map(task =>
            task.id === taskId
                ? { ...task, status: 'completed', completed_at: new Date().toISOString() }
                : task
        ))
        await updateTaskStatus(taskId, 'completed')
    }

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.client_name && task.client_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (task.property_title && task.property_title.toLowerCase().includes(searchQuery.toLowerCase()))
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter
        const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter

        return matchesSearch && matchesStatus && matchesPriority
    })

    const todayTasks = filteredTasks.filter(task => {
        if (!task.due_date) return false
        const today = new Date().toISOString().split('T')[0]
        return task.due_date === today && task.status !== 'completed'
    })

    const overdueTasks = filteredTasks.filter(task =>
        task.status !== 'completed' && isOverdue(task.due_date, task.due_time)
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando tarefas...</p>
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
                    <h1 className="text-2xl font-bold text-gray-900">Tarefas e Follow-ups</h1>
                    <p className="text-gray-600">Gerencie suas atividades diárias</p>
                </div>

                <button
                    onClick={() => setShowTaskModal(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:from-amber-600 hover:to-amber-700 transition-all"
                >
                    <Plus className="h-4 w-4" />
                    Nova Tarefa
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Em Atraso</p>
                            <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <Clock className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Hoje</p>
                            <p className="text-2xl font-bold text-amber-600">{stats.today}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <CheckSquare className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pendentes</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {stats.pending}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Concluídas</p>
                            <p className="text-2xl font-bold text-green-600">
                                {stats.completed}
                            </p>
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
                                placeholder="Buscar tarefas, clientes ou imóveis..."
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
                        <option value="pending">Pendente</option>
                        <option value="in_progress">Em Andamento</option>
                        <option value="completed">Concluída</option>
                        <option value="cancelled">Cancelada</option>
                        <option value="overdue">Atrasada</option>
                    </select>

                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                        <option value="all">Todas as prioridades</option>
                        <option value="urgent">Urgente</option>
                        <option value="high">Alta</option>
                        <option value="medium">Média</option>
                        <option value="low">Baixa</option>
                    </select>
                </div>
            </div>

            {/* Tasks List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {filteredTasks.length === 0 ? (
                    <div className="p-12 text-center">
                        <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma tarefa encontrada</h3>
                        <p className="text-gray-500 mb-4">Não há tarefas que correspondam aos filtros selecionados.</p>
                        <button 
                            onClick={() => setShowTaskModal(true)}
                            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-lg font-medium">
                            Criar Primeira Tarefa
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredTasks.map((task) => {
                            const TypeIcon = getTypeIcon(task.type)
                            const overdue = task.status !== 'completed' && isOverdue(task.due_date, task.due_time)

                            return (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className={`p-6 hover:bg-gray-50 transition-colors ${overdue ? 'border-l-4 border-red-500 bg-red-50' : ''}`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0 mt-1">
                                                    <div className={`p-2 rounded-lg ${task.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'}`}>
                                                        <TypeIcon className={`h-4 w-4 ${task.status === 'completed' ? 'text-green-600' : 'text-gray-600'}`} />
                                                    </div>
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className={`text-lg font-semibold ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                                            {task.title}
                                                        </h3>
                                                        {getStatusBadge(task.status)}
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)} flex items-center gap-1`}>
                                                            {getPriorityIcon(task.priority)}
                                                            {getPriorityConfig(task.priority).label}
                                                        </span>
                                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                                            {getTypeLabel(task.type)}
                                                        </span>
                                                    </div>

                                                    <p className="text-gray-600 mb-3">{task.description}</p>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600 mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-gray-400" />
                                                            <span className={overdue ? 'text-red-600 font-medium' : ''}>
                                                                {formatDate(task.due_date)}
                                                                {task.due_time && ` às ${task.due_time}`}
                                                                {overdue && ' (Atrasada)'}
                                                            </span>
                                                        </div>

                                                        {task.client_name && (
                                                            <div className="flex items-center gap-2">
                                                                <Users className="h-4 w-4 text-gray-400" />
                                                                <span>{task.client_name}</span>
                                                            </div>
                                                        )}

                                                        {task.client_phone && (
                                                            <div className="flex items-center gap-2">
                                                                <Phone className="h-4 w-4 text-gray-400" />
                                                                <span>{task.client_phone}</span>
                                                            </div>
                                                        )}

                                                        {task.property_title && (
                                                            <div className="flex items-center gap-2 md:col-span-2 lg:col-span-3">
                                                                <Building2 className="h-4 w-4 text-gray-400" />
                                                                <span>{task.property_title}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {task.notes && (
                                                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                            <p className="text-sm text-gray-700">{task.notes}</p>
                                                        </div>
                                                    )}

                                                    {task.completed_at && (
                                                        <div className="mt-2 text-xs text-green-600">
                                                            ✅ Concluída em {new Date(task.completed_at).toLocaleString('pt-BR')}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 ml-4">
                                            {task.status !== 'completed' && (
                                                <button
                                                    onClick={() => markAsCompleted(task.id)}
                                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Marcar como concluída"
                                                >
                                                    <CheckCircle2 className="h-4 w-4" />
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => {setSelectedTask(task); setShowTaskModal(true);}}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button 
                                                onClick={() => deleteTask(task.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
            <TaskModal 
                isOpen={showTaskModal} 
                onClose={() => {setShowTaskModal(false); setSelectedTask(null);}} 
                onSave={() => {setShowTaskModal(false); setSelectedTask(null); loadTasks();}} 
                categories={categories} 
                task={selectedTask || undefined} 
            />
        </motion.div>
    )
}