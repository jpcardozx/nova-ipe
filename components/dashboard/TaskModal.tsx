'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, Tag, AlertCircle, Save } from 'lucide-react'
import { TasksService } from '@/lib/supabase/tasks-service'
import { Task, TaskCategory } from '@/app/types/database'

interface TaskModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: () => void
    categories: TaskCategory[]
    task?: Task // Para edição
}

export function TaskModal({ isOpen, onClose, onSave, categories, task }: TaskModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium' as Task['priority'],
        category_id: '',
        due_date: '',
        due_time: '',
        reminder_minutes: 15
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description || '',
                priority: task.priority,
                category_id: task.category_id || '',
                due_date: task.due_date || '',
                due_time: task.due_time || '',
                reminder_minutes: task.reminder_minutes_before || 15
            })
        } else {
            setFormData({
                title: '',
                description: '',
                priority: 'medium',
                category_id: '',
                due_date: '',
                due_time: '',
                reminder_minutes: 15
            })
        }
        setErrors({})
    }, [task, isOpen])

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.title.trim()) {
            newErrors.title = 'Título é obrigatório'
        }

        if (formData.due_date && formData.due_time) {
            const dueDateTime = new Date(`${formData.due_date}T${formData.due_time}`)
            if (dueDateTime < new Date()) {
                newErrors.due_date = 'Data e hora não podem ser no passado'
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
            const taskData: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'category'> = {
                title: formData.title,
                description: formData.description,
                priority: formData.priority,
                category_id: formData.category_id || undefined,
                due_date: formData.due_date || undefined,
                due_time: formData.due_time || undefined,
                reminder_minutes_before: formData.reminder_minutes,
                status: 'pending' as Task['status'],
                reminder_enabled: formData.reminder_minutes > 0,
                recurring_type: 'none',
                type: 'other',
            }

            if (task) {
                await TasksService.updateTask(task.id, taskData)
            } else {
                await TasksService.createTask(taskData)
            }

            onSave()
            onClose()
        } catch (error) {
            console.error('Error saving task:', error)
            setErrors({ submit: 'Erro ao salvar tarefa. Tente novamente.' })
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={(e) => e.target === e.currentTarget && onClose()}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {task ? 'Editar Tarefa' : 'Nova Tarefa'}
                                </h2>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white/50 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Título *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => handleChange('title', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.title ? 'border-red-300' : 'border-gray-200'
                                            }`}
                                        placeholder="Digite o título da tarefa..."
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Descrição
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        placeholder="Descreva os detalhes da tarefa..."
                                    />
                                </div>

                                {/* Priority */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Prioridade
                                    </label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => handleChange('priority', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    >
                                        <option value="low">🌱 Baixa</option>
                                        <option value="medium">⚡ Média</option>
                                        <option value="high">🔥 Alta</option>
                                        <option value="urgent">🚨 Urgente</option>
                                    </select>
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Categoria
                                    </label>
                                    <select
                                        value={formData.category_id}
                                        onChange={(e) => handleChange('category_id', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    >
                                        <option value="">Selecione uma categoria</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Date and Time */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Calendar className="h-4 w-4 inline mr-1" />
                                            Data de Vencimento
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.due_date}
                                            onChange={(e) => handleChange('due_date', e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.due_date ? 'border-red-300' : 'border-gray-200'
                                                }`}
                                        />
                                        {errors.due_date && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                                <AlertCircle className="h-4 w-4 mr-1" />
                                                {errors.due_date}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Clock className="h-4 w-4 inline mr-1" />
                                            Horário
                                        </label>
                                        <input
                                            type="time"
                                            value={formData.due_time}
                                            onChange={(e) => handleChange('due_time', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Reminder */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Lembrete (minutos antes)
                                    </label>
                                    <select
                                        value={formData.reminder_minutes}
                                        onChange={(e) => handleChange('reminder_minutes', parseInt(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    >
                                        <option value={0}>Sem lembrete</option>
                                        <option value={5}>5 minutos antes</option>
                                        <option value={15}>15 minutos antes</option>
                                        <option value={30}>30 minutos antes</option>
                                        <option value={60}>1 hora antes</option>
                                        <option value={120}>2 horas antes</option>
                                        <option value={1440}>1 dia antes</option>
                                    </select>
                                </div>

                                {errors.submit && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm text-red-600 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-2" />
                                            {errors.submit}
                                        </p>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end space-x-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Salvando...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <Save className="h-4 w-4 mr-2" />
                                        {task ? 'Atualizar' : 'Criar'} Tarefa
                                    </div>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}