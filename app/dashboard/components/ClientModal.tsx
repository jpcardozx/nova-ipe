'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Phone, Mail, Building2, MapPin, Save, AlertCircle, FileText } from 'lucide-react'
import { ClientsService, Client } from '@/lib/supabase/clients-service'
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
        client_type: 'individual' as Client['client_type'],
        status: 'prospect' as Client['status'],
        priority: 'medium' as Client['priority'],
        document_number: '',
        document_type: 'cpf' as Client['document_type'],
        profession: '',
        income: '',
        company_name: '',
        company_role: '',
        birth_date: '',
        notes: ''
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (client) {
            setFormData({
                name: client.name,
                email: client.email || '',
                phone: client.phone || '',
                client_type: client.client_type || 'individual',
                status: client.status,
                priority: client.priority,
                document_number: client.document_number || '',
                document_type: client.document_type || 'cpf',
                profession: client.profession || '',
                income: client.income?.toString() || '',
                company_name: client.company_name || '',
                company_role: client.company_role || '',
                birth_date: client.birth_date || '',
                notes: client.notes || ''
            })
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                client_type: 'individual',
                status: 'prospect',
                priority: 'medium',
                document_number: '',
                document_type: 'cpf',
                profession: '',
                income: '',
                company_name: '',
                company_role: '',
                birth_date: '',
                notes: ''
            })
        }
    }, [client, isOpen])

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

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setLoading(true)

        try {
            const clientData = {
                name: formData.name.trim(),
                email: formData.email.trim() || undefined,
                phone: formData.phone.trim() || undefined,
                client_type: formData.client_type,
                status: formData.status,
                priority: formData.priority,
                document_number: formData.document_number.trim() || undefined,
                document_type: formData.document_type,
                profession: formData.profession.trim() || undefined,
                income: formData.income ? parseFloat(formData.income) : undefined,
                company_name: formData.company_name.trim() || undefined,
                company_role: formData.company_role.trim() || undefined,
                birth_date: formData.birth_date || undefined,
                notes: formData.notes.trim() || undefined,
                user_id: user?.id || 'anonymous'
            }

            if (client?.id) {
                await ClientsService.updateClient(client.id, clientData)
            } else {
                await ClientsService.createClient(clientData)
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

                                    {/* Tipo e Status */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tipo
                                            </label>
                                            <select
                                                value={formData.client_type}
                                                onChange={(e) => setFormData({ ...formData, client_type: e.target.value as Client['client_type'] })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="individual">Pessoa Física</option>
                                                <option value="company">Pessoa Jurídica</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Status
                                            </label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value as Client['status'] })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="prospect">Prospect</option>
                                                <option value="active">Ativo</option>
                                                <option value="inactive">Inativo</option>
                                                <option value="vip">VIP</option>
                                                <option value="blacklist">Blacklist</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Prioridade
                                            </label>
                                            <select
                                                value={formData.priority}
                                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Client['priority'] })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="low">Baixa</option>
                                                <option value="medium">Média</option>
                                                <option value="high">Alta</option>
                                                <option value="urgent">Urgente</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Documentos */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                                        Documentação
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tipo de Documento
                                            </label>
                                            <select
                                                value={formData.document_type}
                                                onChange={(e) => setFormData({ ...formData, document_type: e.target.value as Client['document_type'] })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="cpf">CPF</option>
                                                <option value="cnpj">CNPJ</option>
                                                <option value="rg">RG</option>
                                                <option value="passport">Passaporte</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <FileText size={16} className="inline mr-2" />
                                                Número do Documento
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.document_number}
                                                onChange={(e) => setFormData({ ...formData, document_number: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="000.000.000-00"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Informações Profissionais */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                                        Informações Profissionais
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Profissão
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.profession}
                                                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Profissão"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Renda Mensal
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.income}
                                                onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    {formData.client_type === 'company' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <Building2 size={16} className="inline mr-2" />
                                                    Nome da Empresa
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.company_name}
                                                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Nome da empresa"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Cargo na Empresa
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.company_role}
                                                    onChange={(e) => setFormData({ ...formData, company_role: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Cargo ou função"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Informações Pessoais */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                                        Informações Pessoais
                                    </h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Data de Nascimento
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.birth_date}
                                            onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Notas
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