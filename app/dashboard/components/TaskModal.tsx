'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X,
    Save,
    User,
    Calendar,
    Clock,
    Flag,
    Tag,
    FileText,
    Users,
    Eye,
    EyeOff,
    AlertCircle,
    Building2,
    Phone,
    Mail,
    Share2
} from 'lucide-react'
import { Task, Client, CRMService } from '@/lib/supabase/crm-service'
import { User as SystemUser, UserService } from '@/lib/supabase/user-service'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser-simple'
import { ShareModal } from '@/components/shared/ShareModal'

interface TaskModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: () => void
    task?: Task // Para edição
}

export function TaskModal({ isOpen, onClose, onSave, task }: TaskModalProps) {
    const { user } = useCurrentUser()
    const [clients, setClients] = useState<Client[]>([])
    const [users, setUsers] = useState<SystemUser[]>([])
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
        status: 'pending' as 'pending' | 'in_progress' | 'completed' | 'cancelled',
        assigned_to: '',
        client_id: '',
        property_id: '',
        due_date: '',
        task_type: 'internal' as 'internal' | 'client' | 'team',
        visibility: 'private' as 'private' | 'shared',
        category: '' as 'follow_up' | 'property_visit' | 'document_review' | 'contract' | 'marketing' | 'administrative' | 'other' | '',
        start_time: '',
        end_time: '',
        reminders: [] as string[],
        notifications_enabled: true
    })
    const [loading, setLoading] = useState(false)
    const [loadingClients, setLoadingClients] = useState(false)
    const [loadingUsers, setLoadingUsers] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [showShareModal, setShowShareModal] = useState(false)

    // Load clients and users for selection
    useEffect(() => {
        if (isOpen) {
            loadClients()
            loadUsers()
        }
    }, [isOpen])

    const loadClients = async () => {
        setLoadingClients(true)
        try {
            const { data, error } = await CRMService.getClients({ status: 'all' })
            if (data && !error) {
                setClients(data)
            }
        } catch (error) {
            console.error('Error loading clients:', error)
        } finally {
            setLoadingClients(false)
        }
    }

    const loadUsers = async () => {
        setLoadingUsers(true)
        try {
            console.log('TaskModal: Loading users...')
            const allUsers = await UserService.getAllUsers()
            console.log('TaskModal: Loaded users:', allUsers)
            setUsers(allUsers)
        } catch (error) {
            console.error('TaskModal: Error loading users:', error)
        } finally {
            setLoadingUsers(false)
        }
    }

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description || '',
                priority: task.priority,
                status: task.status,
                assigned_to: task.assigned_to || '',
                client_id: task.client_id || '',
                property_id: task.property_id || '',
                due_date: task.due_date ? task.due_date.split('T')[0] : '',
                task_type: task.task_type,
                visibility: task.visibility,
                category: task.category || '',
                start_time: task.start_time || '',
                end_time: task.end_time || '',
                reminders: task.reminders || [],
                notifications_enabled: true
            })
        } else {
            setFormData({
                title: '',
                description: '',
                priority: 'medium',
                status: 'pending',
                assigned_to: '',
                client_id: '',
                property_id: '',
                due_date: '',
                task_type: 'internal',
                visibility: 'private',
                category: '',
                start_time: '',
                end_time: '',
                reminders: [],
                notifications_enabled: true
            })
        }
    }, [task, isOpen])

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.title.trim()) {
            newErrors.title = 'Título é obrigatório'
        }

        if (formData.task_type === 'client' && !formData.client_id) {
            newErrors.client_id = 'Cliente é obrigatório para tarefas de cliente'
        }

        if (formData.due_date && new Date(formData.due_date) < new Date()) {
            newErrors.due_date = 'Data de vencimento não pode ser no passado'
        }

        if (formData.start_time && formData.end_time) {
            const startTime = new Date(`2024-01-01T${formData.start_time}`)
            const endTime = new Date(`2024-01-01T${formData.end_time}`)

            if (startTime >= endTime) {
                newErrors.end_time = 'Horário de término deve ser posterior ao de início'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setLoading(true)

        try {
            const taskData = {
                title: formData.title.trim(),
                description: formData.description.trim() || undefined,
                priority: formData.priority,
                status: formData.status,
                client_id: formData.client_id || undefined,
                property_id: formData.property_id || undefined,
                due_date: formData.due_date ? `${formData.due_date}T23:59:59` : undefined,
                task_type: formData.task_type,
                visibility: formData.visibility,
                category: formData.category || undefined,
                start_time: formData.start_time || undefined,
                end_time: formData.end_time || undefined,
                reminders: formData.reminders,
                assigned_to: formData.assigned_to || user?.id || undefined,
                created_by: user?.id || undefined
            }

            if (task?.id) {
                await CRMService.updateTask(task.id, taskData)
            } else {
                await CRMService.createTask(taskData)
            }

            onSave()
        } catch (error) {
            console.error('Erro ao salvar tarefa:', error)
            setErrors({ submit: 'Erro ao salvar tarefa. Tente novamente.' })
        } finally {
            setLoading(false)
        }
    }

    const getSelectedClient = () => {
        return clients.find(c => c.id === formData.client_id)
    }

    const getCategoryLabel = (category: string) => {
        const labels = {
            follow_up: 'Follow-up',
            property_visit: 'Visita de Imóvel',
            document_review: 'Revisão de Documentos',
            contract: 'Contrato',
            marketing: 'Marketing',
            administrative: 'Administrativo',
            other: 'Outro'
        }
        return labels[category as keyof typeof labels] || category
    }

    const selectedClient = getSelectedClient()

    const getSelectedUser = () => {
        if (!formData.assigned_to) return null
        if (formData.assigned_to === user?.id) return user
        return users.find(u => u.id === formData.assigned_to)
    }

    const selectedUser = getSelectedUser()

    const handleShare = async (userIds: string[], permissions: 'view' | 'edit') => {
        try {
            // TODO: Implementar compartilhamento de tarefa via API
            console.log('Compartilhando tarefa com usuários:', userIds, 'Permissões:', permissions)
            // Aqui você faria a chamada para a API de compartilhamento
        } catch (error) {
            console.error('Erro ao compartilhar tarefa:', error)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {task ? 'Editar Tarefa' : 'Nova Tarefa'}
                                </h2>
                                <div className="flex items-center gap-2">
                                    {task && (
                                        <button
                                            onClick={() => setShowShareModal(true)}
                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Compartilhar tarefa"
                                        >
                                            <Share2 size={20} />
                                        </button>
                                    )}
                                    <button
                                        onClick={onClose}
                                        className="text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Informações Básicas */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                                        Informações Básicas
                                    </h3>

                                    {/* Título */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FileText size={16} className="inline mr-2" />
                                            Título *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Descreva brevemente a tarefa"
                                        />
                                        {errors.title && (
                                            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                                        )}
                                    </div>

                                    {/* Descrição */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Descrição
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            rows={3}
                                            placeholder="Detalhes adicionais sobre a tarefa..."
                                        />
                                    </div>

                                    {/* Tipo e Visibilidade */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tipo da Tarefa
                                            </label>
                                            <select
                                                value={formData.task_type}
                                                onChange={(e) => setFormData({ ...formData, task_type: e.target.value as 'internal' | 'client' | 'team' })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="internal">Interna</option>
                                                <option value="client">Cliente</option>
                                                <option value="team">Equipe</option>
                                            </select>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formData.task_type === 'internal' && 'Tarefa pessoal ou administrativa'}
                                                {formData.task_type === 'client' && 'Tarefa relacionada a um cliente específico'}
                                                {formData.task_type === 'team' && 'Tarefa colaborativa da equipe'}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                                                {formData.visibility === 'private' ? <EyeOff size={16} /> : <Eye size={16} />}
                                                Visibilidade
                                            </label>
                                            <select
                                                value={formData.visibility}
                                                onChange={(e) => setFormData({ ...formData, visibility: e.target.value as 'private' | 'shared' })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="private">Privada</option>
                                                <option value="shared">Compartilhada</option>
                                            </select>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formData.visibility === 'private' ? 'Apenas você pode ver esta tarefa' : 'Equipe pode ver esta tarefa'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Cliente (se tipo for 'client') */}
                                {formData.task_type === 'client' && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                                            Cliente Associado
                                        </h3>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <User size={16} className="inline mr-2" />
                                                Cliente *
                                            </label>
                                            {loadingClients ? (
                                                <div className="flex items-center justify-center py-8">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                                    <span className="ml-2 text-gray-600">Carregando clientes...</span>
                                                </div>
                                            ) : (
                                                <select
                                                    value={formData.client_id}
                                                    onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.client_id ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                >
                                                    <option value="">Selecione um cliente...</option>
                                                    {clients.map(client => (
                                                        <option key={client.id} value={client.id}>
                                                            {client.name} - {client.status} {client.client_code ? `(${client.client_code})` : ''}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                            {errors.client_id && (
                                                <p className="text-red-500 text-sm mt-1">{errors.client_id}</p>
                                            )}
                                        </div>

                                        {/* Cliente Selecionado */}
                                        {selectedClient && (
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <h4 className="font-medium text-blue-900 mb-2">Cliente Selecionado:</h4>
                                                <div className="space-y-1 text-sm text-blue-800">
                                                    <p className="flex items-center gap-2">
                                                        <User size={14} />
                                                        {selectedClient.name}
                                                    </p>
                                                    {selectedClient.email && (
                                                        <p className="flex items-center gap-2">
                                                            <Mail size={14} />
                                                            {selectedClient.email}
                                                        </p>
                                                    )}
                                                    {selectedClient.phone && (
                                                        <p className="flex items-center gap-2">
                                                            <Phone size={14} />
                                                            {selectedClient.phone}
                                                        </p>
                                                    )}
                                                    {selectedClient.client_code && (
                                                        <p className="flex items-center gap-2">
                                                            <Tag size={14} />
                                                            Código: {selectedClient.client_code}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Configurações da Tarefa */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                                        Configurações
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Flag size={16} className="inline mr-2" />
                                                Prioridade
                                            </label>
                                            <select
                                                value={formData.priority}
                                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="low">Baixa</option>
                                                <option value="medium">Média</option>
                                                <option value="high">Alta</option>
                                                <option value="urgent">Urgente</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Tag size={16} className="inline mr-2" />
                                                Categoria
                                            </label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">Selecione...</option>
                                                <option value="follow_up">Follow-up</option>
                                                <option value="property_visit">Visita de Imóvel</option>
                                                <option value="document_review">Revisão de Documentos</option>
                                                <option value="contract">Contrato</option>
                                                <option value="marketing">Marketing</option>
                                                <option value="administrative">Administrativo</option>
                                                <option value="other">Outro</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <User size={16} className="inline mr-2" />
                                                Responsável (Funcionário)
                                            </label>
                                            {loadingUsers ? (
                                                <div className="flex items-center justify-center py-3">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                                    <span className="ml-2 text-sm text-gray-600">Carregando da tabela profiles...</span>
                                                </div>
                                            ) : users.length === 0 ? (
                                                <div className="text-center py-3 space-y-2">
                                                    <p className="text-sm text-red-600">
                                                        ⚠️ Nenhum funcionário encontrado na tabela profiles
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Possível problema: RLS policies, tabela vazia ou permissões
                                                    </p>
                                                    <div className="space-y-1">
                                                        <button
                                                            type="button"
                                                            onClick={async () => {
                                                                console.log('🔐 Checking authentication...')
                                                                const authOk = await UserService.checkAndRefreshAuth()
                                                                if (authOk) {
                                                                    console.log('✅ Auth OK, reloading users...')
                                                                    await loadUsers()
                                                                } else {
                                                                    console.log('❌ Auth failed - user needs to login')
                                                                    alert('Sua sessão expirou. Por favor, faça login novamente.')
                                                                }
                                                            }}
                                                            className="text-xs text-green-600 hover:text-green-800 underline block"
                                                        >
                                                            🔐 Verificar Login e Recarregar
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={async () => {
                                                                console.log('🔧 Running database debug...')
                                                                await UserService.debugDatabaseAccess()
                                                            }}
                                                            className="text-xs text-blue-600 hover:text-blue-800 underline block"
                                                        >
                                                            🔍 Executar diagnóstico (ver console)
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={async () => {
                                                                console.log('🔄 Reloading users...')
                                                                await loadUsers()
                                                            }}
                                                            className="text-xs text-orange-600 hover:text-orange-800 underline block"
                                                        >
                                                            🔄 Forçar recarregamento
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={async () => {
                                                                console.log('🎯 FORCING REAL DATABASE CONNECTION...')
                                                                console.log('This will show all query attempts in detail')
                                                                await loadUsers()
                                                            }}
                                                            className="text-xs text-red-600 hover:text-red-800 underline block font-bold"
                                                        >
                                                            🎯 FORÇAR CONEXÃO REAL (debug)
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <select
                                                    value={formData.assigned_to}
                                                    onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="">Selecione um funcionário responsável...</option>
                                                    <option value={user?.id || ''}>Eu mesmo</option>
                                                    {users.filter(u => u.id !== user?.id).map(employee => (
                                                        <option key={employee.id} value={employee.id}>
                                                            {employee.name} - {employee.department || employee.role}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                            <p className="text-xs text-gray-500 mt-1">
                                                {users.length > 1
                                                    ? `✅ Conectado à tabela profiles - ${users.length} funcionário(s) encontrado(s)`
                                                    : users.length === 1
                                                    ? '⚠️ Apenas seu perfil encontrado - usando dados de exemplo'
                                                    : 'Selecione um funcionário da equipe para ser responsável por esta tarefa'
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    {/* Responsável Selecionado */}
                                    {selectedUser && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                            <h4 className="font-medium text-green-900 mb-2">Responsável Selecionado:</h4>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                                    <User className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-green-900">
                                                        {(selectedUser as any).name || selectedUser.full_name || 'Funcionário'}
                                                    </p>
                                                    <p className="text-sm text-green-700">
                                                        {selectedUser.email}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {formData.assigned_to === user?.id ? (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                Você mesmo
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                {(selectedUser as any).department || (selectedUser as any).role || 'Funcionário'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Horários */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Clock size={16} className="inline mr-2" />
                                                Horário de Início (opcional)
                                            </label>
                                            <input
                                                type="time"
                                                value={formData.start_time}
                                                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Define quando a tarefa deve começar
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Clock size={16} className="inline mr-2" />
                                                Horário de Término (opcional)
                                            </label>
                                            <input
                                                type="time"
                                                value={formData.end_time}
                                                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                    errors.end_time ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {errors.end_time && (
                                                <p className="text-red-500 text-sm mt-1">{errors.end_time}</p>
                                            )}
                                            {!errors.end_time && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Define quando a tarefa deve terminar
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Duração Calculada */}
                                    {formData.start_time && formData.end_time && !errors.end_time && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-blue-600" />
                                                <span className="text-sm font-medium text-blue-900">
                                                    Duração estimada: {(() => {
                                                        const start = new Date(`2024-01-01T${formData.start_time}`)
                                                        const end = new Date(`2024-01-01T${formData.end_time}`)
                                                        const diff = (end.getTime() - start.getTime()) / (1000 * 60)
                                                        const hours = Math.floor(diff / 60)
                                                        const minutes = diff % 60
                                                        return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`
                                                    })()}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Calendar size={16} className="inline mr-2" />
                                            Data de Vencimento
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.due_date}
                                            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.due_date ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                        {errors.due_date && (
                                            <p className="text-red-500 text-sm mt-1">{errors.due_date}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Error Message */}
                                {errors.submit && (
                                    <div className="bg-red-50 border border-red-300 rounded-lg p-3">
                                        <div className="flex items-center">
                                            <AlertCircle size={16} className="text-red-500 mr-2" />
                                            <p className="text-red-700 text-sm">{errors.submit}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                    >
                                        {loading ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                        ) : (
                                            <>
                                                <Save size={16} className="mr-2" />
                                                {task ? 'Atualizar Tarefa' : 'Criar Tarefa'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>

                    {/* Share Modal */}
                    {task && (
                        <ShareModal
                            isOpen={showShareModal}
                            onClose={() => setShowShareModal(false)}
                            item={{
                                id: task.id,
                                type: 'task',
                                title: task.title
                            }}
                            onShare={handleShare}
                        />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default TaskModal