'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Phone, Mail, MapPin, Building2, Save, AlertCircle } from 'lucide-react'
import { LeadsService, Lead } from '@/lib/supabase/leads-service'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser-simple'

interface LeadModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: () => void
    lead?: Lead // Para edição
}

export function LeadModal({ isOpen, onClose, onSave, lead }: LeadModalProps) {
    const { user } = useCurrentUser()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        notes: '',
        source: 'website' as Lead['source'],
        status: 'new' as Lead['status'],
        priority: 'medium' as Lead['priority'],
        interest_type: 'buy' as Lead['interest_type'],
        budget_min: '',
        budget_max: '',
        preferred_location: ''
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (lead) {
            setFormData({
                name: lead.name,
                email: lead.email || '',
                phone: lead.phone || '',
                notes: lead.notes || '',
                source: lead.source,
                status: lead.status,
                priority: lead.priority,
                interest_type: lead.interest_type || 'buy',
                budget_min: lead.budget_min?.toString() || '',
                budget_max: lead.budget_max?.toString() || '',
                preferred_location: lead.preferred_location || ''
            })
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                notes: '',
                source: 'website',
                status: 'new',
                priority: 'medium',
                interest_type: 'buy',
                budget_min: '',
                budget_max: '',
                preferred_location: ''
            })
        }
    }, [lead, isOpen])

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Nome é obrigatório'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email é obrigatório'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email inválido'
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Telefone é obrigatório'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setLoading(true)

        try {
            const leadData = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                notes: formData.notes.trim(),
                source: formData.source,
                status: formData.status,
                priority: formData.priority,
                interest_type: formData.interest_type,
                budget_min: formData.budget_min ? parseFloat(formData.budget_min) : undefined,
                budget_max: formData.budget_max ? parseFloat(formData.budget_max) : undefined,
                preferred_location: formData.preferred_location.trim() || undefined,
                user_id: user?.id || 'anonymous'
            }

            if (lead?.id) {
                await LeadsService.updateLead(lead.id, leadData)
            } else {
                await LeadsService.createLead(leadData)
            }

            onSave()
        } catch (error) {
            console.error('Erro ao salvar lead:', error)
            setErrors({ submit: 'Erro ao salvar lead. Tente novamente.' })
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
                        className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {lead ? 'Editar Lead' : 'Novo Lead'}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
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
                                        placeholder="Nome completo do lead"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Mail size={16} className="inline mr-2" />
                                        Email *
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

                                {/* Telefone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Phone size={16} className="inline mr-2" />
                                        Telefone *
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

                                {/* Notas */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Notas
                                    </label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows={3}
                                        placeholder="Notas sobre o lead..."
                                    />
                                </div>

                                {/* Status e Tipo */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value as Lead['status'] })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="new">Novo</option>
                                            <option value="contacted">Contatado</option>
                                            <option value="qualified">Qualificado</option>
                                            <option value="won">Convertido</option>
                                            <option value="lost">Perdido</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Interesse
                                        </label>
                                        <select
                                            value={formData.interest_type}
                                            onChange={(e) => setFormData({ ...formData, interest_type: e.target.value as Lead['interest_type'] })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="buy">Comprar</option>
                                            <option value="rent">Alugar</option>
                                            <option value="sell">Vender</option>
                                            <option value="evaluate">Avaliar</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Orçamento */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Orçamento Mín.
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.budget_min}
                                            onChange={(e) => setFormData({ ...formData, budget_min: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Orçamento Máx.
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.budget_max}
                                            onChange={(e) => setFormData({ ...formData, budget_max: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                {/* Localização */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <MapPin size={16} className="inline mr-2" />
                                        Localização Preferida
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.preferred_location}
                                        onChange={(e) => setFormData({ ...formData, preferred_location: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Bairro, cidade ou região preferida"
                                    />
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
                                                {lead ? 'Atualizar' : 'Criar Lead'}
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

export default LeadModal