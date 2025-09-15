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
    Mail
} from 'lucide-react'
import { Task, Client, CRMService } from '@/lib/supabase/crm-service'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser-simple'

interface TaskModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: () => void
    task?: Task // Para edi��o
}

export function TaskModal({ isOpen, onClose, onSave, task }: TaskModalProps) {
    const { user } = useCurrentUser()
    const [clients, setClients] = useState<Client[]>([])
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
        status: 'pending' as 'pending' | 'in_progress' | 'completed' | 'cancelled',
        client_id: '',
        property_id: '',
        due_date: '',
        task_type: 'internal' as 'internal' | 'client' | 'team',
        visibility: 'private' as 'private' | 'shared',
        category: '' as 'follow_up' | 'property_visit' | 'document_review' | 'contract' | 'marketing' | 'administrative' | 'other' | '',
        estimated_duration: '',
        reminders: [] as string[]
    })
    const [loading, setLoading] = useState(false)
    const [loadingClients, setLoadingClients] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    // Load clients for selection
    useEffect(() => {
        if (isOpen) {
            loadClients()
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

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description || '',
                priority: task.priority,
                status: task.status,
                client_id: task.client_id || '',
                property_id: task.property_id || '',
                due_date: task.due_date ? task.due_date.split('T')[0] : '',
                task_type: task.task_type,
                visibility: task.visibility,
                category: task.category || '',
                estimated_duration: task.estimated_duration?.toString() || '',
                reminders: task.reminders || []
            })
        } else {
            setFormData({
                title: '',
                description: '',
                priority: 'medium',
                status: 'pending',
                client_id: '',
                property_id: '',
                due_date: '',
                task_type: 'internal',
                visibility: 'private',
                category: '',
                estimated_duration: '',
                reminders: []
            })
        }
    }, [task, isOpen])

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.title.trim()) {
            newErrors.title = 'T�tulo � obrigat�rio'
        }

        if (formData.task_type === 'client' && !formData.client_id) {
            newErrors.client_id = 'Cliente � obrigat�rio para tarefas de cliente'
        }

        if (formData.due_date && new Date(formData.due_date) < new Date()) {
            newErrors.due_date = 'Data de vencimento n�o pode ser no passado'
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
                estimated_duration: formData.estimated_duration ? parseInt(formData.estimated_duration) : undefined,
                reminders: formData.reminders,
                assigned_to: user?.id || undefined,
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
            property_visit: 'Visita de Im�vel',
            document_review: 'Revis�o de Documentos',
            contract: 'Contrato',
            marketing: 'Marketing',
            administrative: 'Administrativo',
            other: 'Outro'
        }
        return labels[category as keyof typeof labels] || category
    }

    const selectedClient = getSelectedClient()

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
                                <button
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Informa��es B�sicas */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                                        Informa��es B�sicas
                                    </h3>

                                    {/* T�tulo */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FileText size={16} className="inline mr-2" />
                                            T�tulo *
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

                                    {/* Descri��o */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Descri��o
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
                                                {formData.task_type === 'client' && 'Tarefa relacionada a um cliente espec�fico'}
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
                                                {formData.visibility === 'private' ? 'Apenas voc� pode ver esta tarefa' : 'Equipe pode ver esta tarefa'}
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
                                                            C�digo: {selectedClient.client_code}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Configura��es da Tarefa */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                                        Configura��es
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
                                                <option value="medium">M�dia</option>
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
                                                <option value="property_visit">Visita de Im�vel</option>
                                                <option value="document_review">Revis�o de Documentos</option>
                                                <option value="contract">Contrato</option>
                                                <option value="marketing">Marketing</option>
                                                <option value="administrative">Administrativo</option>
                                                <option value="other">Outro</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Clock size={16} className="inline mr-2" />
                                                Dura��o Estimada (min)
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.estimated_duration}
                                                onChange={(e) => setFormData({ ...formData, estimated_duration: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="30"
                                                min="1"
                                            />
                                        </div>
                                    </div>

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
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default TaskModal