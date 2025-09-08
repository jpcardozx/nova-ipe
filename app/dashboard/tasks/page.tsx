'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
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
    Flag
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
    client_id?: string
    client_name?: string
    client_phone?: string
    property_id?: string
    property_title?: string
    created_at: string
    completed_at?: string
    notes?: string
}

export default function TasksPage() {
    const { user } = useCurrentUser()
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | Task['status']>('pending')
    const [priorityFilter, setPriorityFilter] = useState<'all' | Task['priority']>('all')
    const [showAddTask, setShowAddTask] = useState(false)

    useEffect(() => {
        loadTasks()
    }, [])

    const loadTasks = async () => {
        try {
            // Simulando dados de tarefas
            const mockTasks: Task[] = [
                {
                    id: '1',
                    title: 'Ligar para Maria Silva - Follow-up Apartamento',
                    description: 'Cliente interessada no apartamento de 2 dormitórios. Ligar para agendar visita.',
                    type: 'call',
                    priority: 'high',
                    status: 'pending',
                    due_date: '2025-01-10',
                    due_time: '09:00',
                    client_id: 'c1',
                    client_name: 'Maria Silva',
                    client_phone: '(11) 99999-1111',
                    property_id: 'p1',
                    property_title: 'Apartamento 2 dorms - Vila Madalena',
                    created_at: '2025-01-09T14:00:00.000Z',
                    notes: 'Cliente mencionou urgência na decisão'
                },
                {
                    id: '2',
                    title: 'Reunião com João Santos - Negociação',
                    description: 'Apresentar contraproposta para casa em Pinheiros',
                    type: 'meeting',
                    priority: 'urgent',
                    status: 'pending',
                    due_date: '2025-01-10',
                    due_time: '14:30',
                    client_id: 'c2',
                    client_name: 'João Santos',
                    client_phone: '(11) 99999-2222',
                    property_id: 'p2',
                    property_title: 'Casa 3 dorms - Pinheiros',
                    created_at: '2025-01-08T16:20:00.000Z'
                },
                {
                    id: '3',
                    title: 'Preparar documentos - Contrato Ana Costa',
                    description: 'Organizar toda documentação para assinatura do contrato',
                    type: 'document',
                    priority: 'high',
                    status: 'in_progress',
                    due_date: '2025-01-11',
                    client_id: 'c3',
                    client_name: 'Ana Costa',
                    property_id: 'p3',
                    property_title: 'Cobertura - Itaim Bibi',
                    created_at: '2025-01-08T10:15:00.000Z'
                },
                {
                    id: '4',
                    title: 'Follow-up Carlos Oliveira - Feedback Visita',
                    description: 'Cliente visitou o imóvel ontem, verificar interesse',
                    type: 'follow_up',
                    priority: 'medium',
                    status: 'pending',
                    due_date: '2025-01-10',
                    due_time: '16:00',
                    client_id: 'c4',
                    client_name: 'Carlos Oliveira',
                    client_phone: '(11) 99999-3333',
                    created_at: '2025-01-09T08:30:00.000Z'
                },
                {
                    id: '5',
                    title: 'Visita técnica - Apartamento Jardins',
                    description: 'Vistoria do imóvel antes da entrega das chaves',
                    type: 'visit',
                    priority: 'medium',
                    status: 'completed',
                    due_date: '2025-01-09',
                    due_time: '10:00',
                    property_title: 'Apartamento 1 dorm - Jardins',
                    created_at: '2025-01-08T14:45:00.000Z',
                    completed_at: '2025-01-09T10:30:00.000Z',
                    notes: 'Vistoria concluída, tudo OK para entrega'
                }
            ]

            setTasks(mockTasks)
        } catch (error) {
            console.error('Error loading tasks:', error)
        } finally {
            setLoading(false)
        }
    }

    const getTypeIcon = (type: Task['type']) => {
        const icons = {
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
        const labels = {
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
        const colors = {
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
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            in_progress: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        }
        
        const labels = {
            pending: 'Pendente',
            in_progress: 'Em Andamento',
            completed: 'Concluída',
            cancelled: 'Cancelada'
        }

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
                {labels[status]}
            </span>
        )
    }

    const isOverdue = (dueDate: string, dueTime?: string) => {
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
    }

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            task.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            task.property_title?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter
        const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
        
        return matchesSearch && matchesStatus && matchesPriority
    })

    const todayTasks = filteredTasks.filter(task => {
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
                    onClick={() => setShowAddTask(true)}
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
                            <p className="text-2xl font-bold text-red-600">{overdueTasks.length}</p>
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
                            <p className="text-2xl font-bold text-amber-600">{todayTasks.length}</p>
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
                                {tasks.filter(t => t.status === 'pending').length}
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
                                {tasks.filter(t => t.status === 'completed').length}
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
                        <button className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-lg font-medium">
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
                                    className={`p-6 hover:bg-gray-50 transition-colors ${
                                        overdue ? 'border-l-4 border-red-500 bg-red-50' : ''
                                    }`}
                                >
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
                                                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
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
                                                                {new Date(task.due_date).toLocaleDateString('pt-BR')}
                                                                {task.due_time && ` às ${task.due_time}`}
                                                                {overdue && ' (Atrasada)'}
                                                            </span>
                                                        </div>
                                                        
                                                        {task.client_name && (
                                                            <div className="flex items-center gap-2">
                                                                <User className="h-4 w-4 text-gray-400" />
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
                                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
        </motion.div>
    )
}