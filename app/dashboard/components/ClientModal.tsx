'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Phone, Mail, Building2, MapPin, Save, AlertCircle, FileText, RefreshCw, Hash } from 'lucide-react'
import { CRMService, Client } from '@/lib/supabase/crm-service'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser-simple'

interface ClientModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: () => void
    client?: Client // Para edição
}

export function ClientModal({ isOpen, onClose, onSave, client }: ClientModalProps) {
    const { user } = useCurrentUser()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        client_code: '',
        status: 'lead' as 'lead' | 'prospect' | 'client' | 'inactive',
        priority: 'medium' as 'low' | 'medium' | 'high',
        document: '',
        notes: '',
        budget_min: '',
        budget_max: '',
        property_type: '' as 'apartment' | 'house' | 'commercial' | 'land' | 'other' | '',
        transaction_type: '' as 'buy' | 'rent' | 'sell' | ''
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (client) {
            setFormData({
                name: client.name,
                email: client.email || '',
                phone: client.phone || '',
                client_code: client.client_code || '',
                status: client.status,
                priority: client.priority || 'medium',
                document: client.document || '',
                notes: client.notes || '',
                budget_min: client.budget_min?.toString() || '',
                budget_max: client.budget_max?.toString() || '',
                property_type: (client.property_type as 'house' | 'apartment' | 'commercial' | 'land' | 'other' | '') || '',
                transaction_type: (client.transaction_type as 'rent' | 'buy' | 'sell' | '') || ''
            })
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                client_code: '',
                status: 'lead',
                priority: 'medium',
                document: '',
                notes: '',
                budget_min: '',
                budget_max: '',
                property_type: '',
                transaction_type: ''
            })
        }
    }, [client, isOpen])

    const generateClientCode = async () => {
        if (!formData.name.trim()) {
            setErrors({ ...errors, client_code: 'Digite o nome primeiro para gerar o código' })
            return
        }

        const code = CRMService.generateClientCode(formData.name, formData.status)
        const uniqueCode = await CRMService.ensureClientCodeUnique(code)
        setFormData({ ...formData, client_code: uniqueCode })

        // Remove any previous errors
        const newErrors = { ...errors }
        delete newErrors.client_code
        setErrors(newErrors)
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Nome é obrigatório'
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email inválido'
        }

        if (formData.phone && formData.phone.length < 10) {
            newErrors.phone = 'Telefone deve ter pelo menos 10 dígitos'
        }

        if (!formData.client_code.trim() && !client) {
            newErrors.client_code = 'Código do cliente é obrigatório. Clique em "Gerar" para criar automaticamente.'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setLoading(true)

        try {
            // Generate client code if not exists
            let clientCode = formData.client_code
            if (!clientCode && formData.name.trim()) {
                const code = CRMService.generateClientCode(formData.name, formData.status)
                clientCode = await CRMService.ensureClientCodeUnique(code)
            }

            const clientData = {
                name: formData.name.trim(),
                email: formData.email.trim() || undefined,
                phone: formData.phone.trim() || undefined,
                client_code: clientCode,
                status: formData.status,
                priority: formData.priority,
                document: formData.document.trim() || undefined,
                notes: formData.notes.trim() || undefined,
                budget_min: formData.budget_min ? parseFloat(formData.budget_min) : undefined,
                budget_max: formData.budget_max ? parseFloat(formData.budget_max) : undefined,
                property_type: formData.property_type || undefined,
                transaction_type: formData.transaction_type || undefined,
                assigned_to: user?.id || undefined,
                created_by: user?.id || undefined
            }

            if (client?.id) {
                await CRMService.updateClient(client.id, clientData)
            } else {
                await CRMService.createClient(clientData)
            }

            onSave()
        } catch (error) {
            console.error('Erro ao salvar cliente:', error)
            setErrors({ submit: 'Erro ao salvar cliente. Tente novamente.' })
        } finally {
            setLoading(false)
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
                        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {client ? 'Editar Cliente' : 'Novo Cliente'}
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
                                {/* Informações Básicas */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                                        Informações Básicas
                                    </h3>

                                    {/* Nome */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <User size={16} className="inline mr-2" />
                                            Nome *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Nome completo"
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                        )}
                                    </div>

                                    {/* Código do Cliente */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Hash size={16} className="inline mr-2" />
                                            Código do Cliente *
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={formData.client_code}
                                                onChange={(e) => setFormData({ ...formData, client_code: e.target.value })}
                                                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.client_code ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                placeholder="Ex: LDJO24001"
                                                readOnly={!client} // Read-only when editing existing clients
                                            />
                                            {!client && (
                                                <button
                                                    type="button"
                                                    onClick={generateClientCode}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                                                    title="Gerar código baseado no nome e status"
                                                >
                                                    <RefreshCw size={16} />
                                                    Gerar
                                                </button>
                                            )}
                                        </div>
                                        {errors.client_code && (
                                            <p className="text-red-500 text-sm mt-1">{errors.client_code}</p>
                                        )}
                                        <p className="text-gray-500 text-xs mt-1">
                                            Código interno para controle comercial. Formato: [STATUS][NOME][ANO][SEQUENCIAL]
                                        </p>
                                    </div>

                                    {/* Email e Telefone */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Mail size={16} className="inline mr-2" />
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                placeholder="email@exemplo.com"
                                            />
                                            {errors.email && (
                                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Phone size={16} className="inline mr-2" />
                                                Telefone
                                            </label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                placeholder="(11) 99999-9999"
                                            />
                                            {errors.phone && (
                                                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status e Prioridade */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Status
                                            </label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'lead' | 'prospect' | 'client' | 'inactive' })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="lead">Lead</option>
                                                <option value="prospect">Prospect</option>
                                                <option value="client">Cliente</option>
                                                <option value="inactive">Inativo</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Prioridade
                                            </label>
                                            <select
                                                value={formData.priority}
                                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="low">Baixa</option>
                                                <option value="medium">Média</option>
                                                <option value="high">Alta</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Interesse Imobiliário */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                                        Interesse Imobiliário
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tipo de Imóvel
                                            </label>
                                            <select
                                                value={formData.property_type}
                                                onChange={(e) => setFormData({ ...formData, property_type: e.target.value as 'apartment' | 'house' | 'commercial' | 'land' | 'other' | '' })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">Selecione...</option>
                                                <option value="house">Casa</option>
                                                <option value="apartment">Apartamento</option>
                                                <option value="commercial">Comercial</option>
                                                <option value="land">Terreno</option>
                                                <option value="other">Outro</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tipo de Transação
                                            </label>
                                            <select
                                                value={formData.transaction_type}
                                                onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value as 'buy' | 'rent' | 'sell' | '' })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">Selecione...</option>
                                                <option value="buy">Comprar</option>
                                                <option value="rent">Alugar</option>
                                                <option value="sell">Vender</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Orçamento Mínimo (R$)
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.budget_min}
                                                onChange={(e) => setFormData({ ...formData, budget_min: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="0"
                                                min="0"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Orçamento Máximo (R$)
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.budget_max}
                                                onChange={(e) => setFormData({ ...formData, budget_max: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="0"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Informações Adicionais */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                                        Informações Adicionais
                                    </h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FileText size={16} className="inline mr-2" />
                                            Documento
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.document}
                                            onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="CPF, CNPJ ou RG"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Observações
                                        </label>
                                        <textarea
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            rows={3}
                                            placeholder="Informações adicionais sobre o cliente..."
                                        />
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
                                                {client ? 'Atualizar' : 'Criar Cliente'}
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

export default ClientModal