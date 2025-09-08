'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CRMService } from '@/lib/supabase/crm-service'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import {
    User,
    Mail,
    Phone,
    MapPin,
    Building2,
    DollarSign,
    Calendar,
    ArrowLeft,
    Save,
    AlertCircle,
    CheckCircle
} from 'lucide-react'
import Link from 'next/link'

interface FormData {
    name: string
    email: string
    phone: string
    whatsapp?: string
    company?: string
    cpf_cnpj?: string
    address?: string
    city?: string
    state?: string
    cep?: string
    source: 'website' | 'referral' | 'cold_call' | 'social_media' | 'advertisement' | 'other'
    status: 'lead' | 'prospect' | 'client' | 'inactive'
    preferred_contact: 'phone' | 'email' | 'whatsapp'
    budget_min?: number
    budget_max?: number
    notes?: string
    interested_in: string[]
}

export default function NewClientPage() {
    const router = useRouter()
    const { user } = useCurrentUser()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        whatsapp: '',
        company: '',
        cpf_cnpj: '',
        address: '',
        city: '',
        state: '',
        cep: '',
        source: 'website',
        status: 'lead',
        preferred_contact: 'whatsapp',
        budget_min: 0,
        budget_max: 0,
        notes: '',
        interested_in: []
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleInterestToggle = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interested_in: prev.interested_in.includes(interest)
                ? prev.interested_in.filter(i => i !== interest)
                : [...prev.interested_in, interest]
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setLoading(true)
        setError('')

        try {
            const clientData = {
                ...formData,
                budget_min: formData.budget_min || undefined,
                budget_max: formData.budget_max || undefined,
                assigned_to: user.id,
                created_by: user.id
            }

            const { data, error } = await CRMService.createClient(clientData)

            if (error) throw error

            setSuccess(true)
            setTimeout(() => {
                router.push('/dashboard/clients')
            }, 2000)

        } catch (err: any) {
            setError(err.message || 'Erro ao criar cliente')
        } finally {
            setLoading(false)
        }
    }

    const interests = [
        'Comprar imóvel',
        'Vender imóvel',
        'Alugar imóvel',
        'Investir em imóveis',
        'Financiamento',
        'Consultoria',
        'Avaliação'
    ]

    const sources = [
        { value: 'website', label: 'Website' },
        { value: 'referral', label: 'Indicação' },
        { value: 'cold_call', label: 'Ligação' },
        { value: 'social_media', label: 'Redes Sociais' },
        { value: 'advertisement', label: 'Anúncio' },
        { value: 'other', label: 'Outro' }
    ]

    const statuses = [
        { value: 'lead', label: 'Lead' },
        { value: 'prospect', label: 'Prospect' },
        { value: 'client', label: 'Cliente' },
        { value: 'inactive', label: 'Inativo' }
    ]

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-auto"
                >
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Cliente Criado!</h2>
                    <p className="text-gray-600 mb-4">O cliente foi adicionado ao seu CRM com sucesso.</p>
                    <p className="text-sm text-gray-500">Redirecionando...</p>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/dashboard/clients"
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar para Clientes
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Novo Cliente</h1>
                    <p className="text-gray-600 mt-2">Adicione um novo cliente ao seu CRM</p>
                </div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200"
                >
                    <form onSubmit={handleSubmit} className="p-6">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-red-500" />
                                <span className="text-red-700">{error}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Informações Básicas */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Informações Básicas
                                </h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nome completo *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="João Silva"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        E-mail *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="joao@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Telefone *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="(11) 99999-9999"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        WhatsApp
                                    </label>
                                    <input
                                        type="tel"
                                        name="whatsapp"
                                        value={formData.whatsapp}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="(11) 99999-9999"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Empresa
                                    </label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="Empresa LTDA"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        CPF/CNPJ
                                    </label>
                                    <input
                                        type="text"
                                        name="cpf_cnpj"
                                        value={formData.cpf_cnpj}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="000.000.000-00"
                                    />
                                </div>
                            </div>

                            {/* Informações Complementares */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Endereço & Contato
                                </h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Endereço
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="Rua das Flores, 123"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Cidade
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="São Paulo"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Estado
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="SP"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        CEP
                                    </label>
                                    <input
                                        type="text"
                                        name="cep"
                                        value={formData.cep}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="00000-000"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Origem
                                    </label>
                                    <select
                                        name="source"
                                        value={formData.source}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    >
                                        {sources.map(source => (
                                            <option key={source.value} value={source.value}>
                                                {source.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    >
                                        {statuses.map(status => (
                                            <option key={status.value} value={status.value}>
                                                {status.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Contato Preferido
                                    </label>
                                    <select
                                        name="preferred_contact"
                                        value={formData.preferred_contact}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    >
                                        <option value="whatsapp">WhatsApp</option>
                                        <option value="phone">Telefone</option>
                                        <option value="email">E-mail</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Orçamento */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                <DollarSign className="h-5 w-5" />
                                Orçamento
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Orçamento Mínimo (R$)
                                    </label>
                                    <input
                                        type="number"
                                        name="budget_min"
                                        value={formData.budget_min}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="200000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Orçamento Máximo (R$)
                                    </label>
                                    <input
                                        type="number"
                                        name="budget_max"
                                        value={formData.budget_max}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="500000"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Interesses */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                <Building2 className="h-5 w-5" />
                                Interesses
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {interests.map(interest => (
                                    <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.interested_in.includes(interest)}
                                            onChange={() => handleInterestToggle(interest)}
                                            className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                        />
                                        <span className="text-sm text-gray-700">{interest}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Observações */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Observações
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                placeholder="Observações adicionais sobre o cliente..."
                            />
                        </div>

                        {/* Actions */}
                        <div className="mt-8 flex justify-end space-x-4">
                            <Link
                                href="/dashboard/clients"
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                {loading ? 'Salvando...' : 'Criar Cliente'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}
