// app/dashboard/components/modules/crm/ClientForm.tsx
'use client'

import { useState } from 'react'
import { User, Phone, Mail, DollarSign, Home, MessageSquare } from 'lucide-react'

interface ClientFormData {
    name: string
    email: string
    phone: string
    interest: 'buy' | 'sell' | 'rent'
    budget_min: string
    budget_max: string
    property_type: string
    notes: string
}

interface ClientFormProps {
    onSubmit: (data: ClientFormData) => Promise<void>
    loading?: boolean
    initialData?: Partial<ClientFormData>
}

export function ClientForm({ onSubmit, loading = false, initialData = {} }: ClientFormProps) {
    const [formData, setFormData] = useState<ClientFormData>({
        name: '',
        email: '',
        phone: '',
        interest: 'buy',
        budget_min: '',
        budget_max: '',
        property_type: 'apartamento',
        notes: '',
        ...initialData
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name.trim()) {
            alert('Nome é obrigatório')
            return
        }
        await onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dados Pessoais */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Dados Pessoais
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome completo *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ex: João Silva"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Mail className="w-4 h-4 inline mr-1" />
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="joao@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Phone className="w-4 h-4 inline mr-1" />
                            Telefone
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="(11) 99999-9999"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Home className="w-4 h-4 inline mr-1" />
                            Interesse
                        </label>
                        <select
                            name="interest"
                            value={formData.interest}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="buy">Comprar</option>
                            <option value="sell">Vender</option>
                            <option value="rent">Alugar</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Preferências do Imóvel */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Preferências
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de Imóvel
                        </label>
                        <select
                            name="property_type"
                            value={formData.property_type}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="apartamento">Apartamento</option>
                            <option value="casa">Casa</option>
                            <option value="comercial">Comercial</option>
                            <option value="terreno">Terreno</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Orçamento Mínimo
                        </label>
                        <input
                            type="number"
                            name="budget_min"
                            value={formData.budget_min}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 100.000"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Orçamento Máximo
                        </label>
                        <input
                            type="number"
                            name="budget_max"
                            value={formData.budget_max}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 500.000"
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MessageSquare className="w-4 h-4 inline mr-1" />
                        Observações
                    </label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Detalhes sobre as preferências do cliente..."
                    />
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Salvando...
                        </>
                    ) : (
                        'Salvar Cliente'
                    )}
                </button>
            </div>
        </form>
    )
}
