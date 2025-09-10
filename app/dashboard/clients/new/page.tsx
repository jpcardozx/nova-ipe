'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { CRMService } from '@/lib/supabase/crm-service'
import {
    ArrowLeft,
    Save,
    User,
    Phone,
    Mail,
    MapPin,
    DollarSign,
    Building2,
    Calendar,
    Star,
    Target,
    Zap,
    AlertTriangle,
    CheckCircle,
    Home,
    Car,
    Users,
    Heart
} from 'lucide-react'

export default function NewClientPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        // Dados básicos (Essenciais)
        name: '',
        email: '',
        phone: '',

        // Localização (Importante para imobiliária)
        city: '',
        neighborhood: '',

        // Perfil do cliente (Fundamental)
        status: 'lead' as 'lead' | 'prospect' | 'client',
        priority: 'medium' as 'low' | 'medium' | 'high',
        source: 'website' as 'website' | 'referral' | 'social_media' | 'phone' | 'walk_in',

        // Orçamento (Crucial para imobiliária)
        budget_min: '',
        budget_max: '',

        // Interesse imobiliário (Específico do negócio)
        property_type: 'apartment' as 'apartment' | 'house' | 'commercial' | 'land' | 'other',
        transaction_type: 'buy' as 'buy' | 'rent' | 'sell',
        urgency: 'medium' as 'low' | 'medium' | 'high',

        // Follow-up
        next_follow_up: '',
        notes: ''
    })

    const steps = [
        {
            id: 1,
            title: 'Informações Básicas',
            description: 'Nome, contato e localização',
            icon: <User className="h-5 w-5" />
        },
        {
            id: 2,
            title: 'Perfil do Cliente',
            description: 'Status, prioridade e origem',
            icon: <Target className="h-5 w-5" />
        },
        {
            id: 3,
            title: 'Interesse Imobiliário',
            description: 'Tipo de imóvel e transação',
            icon: <Building2 className="h-5 w-5" />
        },
        {
            id: 4,
            title: 'Orçamento & Follow-up',
            description: 'Valores e próximos passos',
            icon: <DollarSign className="h-5 w-5" />
        }
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const clientData = {
                ...formData,
                budget_min: formData.budget_min ? parseFloat(formData.budget_min) : undefined,
                budget_max: formData.budget_max ? parseFloat(formData.budget_max) : undefined,
                next_follow_up: formData.next_follow_up || undefined
            }

            const { data, error } = await CRMService.createClient(clientData)

            if (error) {
                console.error('Erro ao criar cliente:', error)
                alert('Erro ao criar cliente. Tente novamente.')
                return
            }

            if (data) {
                console.log('Cliente criado com sucesso:', data)
                router.push('/dashboard/clients')
            }
        } catch (error) {
            console.error('Erro inesperado ao criar cliente:', error)
            alert('Erro inesperado ao criar cliente. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return formData.name && formData.phone
            case 2:
                return formData.status && formData.source
            case 3:
                return formData.property_type && formData.transaction_type
            case 4:
                return true
            default:
                return false
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'lead': return <Zap className="h-4 w-4" />
            case 'prospect': return <Target className="h-4 w-4" />
            case 'client': return <CheckCircle className="h-4 w-4" />
            default: return <User className="h-4 w-4" />
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-50 border-red-200'
            case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
            case 'low': return 'text-green-600 bg-green-50 border-green-200'
            default: return 'text-gray-600 bg-gray-50 border-gray-200'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 rounded-lg">
            <div className="max-w-6xl mx-auto px-24 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-8"
                >
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Novo Cliente</h1>
                            <p className="text-gray-600">Adicione um novo contato ao seu pipeline</p>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">
                        Passo {currentStep} de {steps.length}
                    </div>
                </motion.div>

                {/* Progress Steps */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8"
                >
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div className={`flex items-center gap-3 ${step.id === currentStep
                                    ? 'text-amber-600'
                                    : step.id < currentStep
                                        ? 'text-green-600'
                                        : 'text-gray-400'
                                    }`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all ${step.id === currentStep
                                        ? 'bg-amber-50 border-amber-300'
                                        : step.id < currentStep
                                            ? 'bg-green-50 border-green-300'
                                            : 'bg-gray-50 border-gray-200'
                                        }`}>
                                        {step.id < currentStep ? (
                                            <CheckCircle className="h-5 w-5" />
                                        ) : (
                                            step.icon
                                        )}
                                    </div>
                                    <div className="hidden lg:block">
                                        <div className="font-medium text-sm">{step.title}</div>
                                        <div className="text-xs opacity-75">{step.description}</div>
                                    </div>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`w-12 h-0.5 mx-4 ${step.id < currentStep ? 'bg-green-300' : 'bg-gray-200'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Form */}
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
                >
                    {/* Step 1: Informações Básicas */}
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <User className="h-8 w-8 text-blue-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">Informações Básicas</h2>
                                <p className="text-gray-600">Como podemos identificar e contatar este cliente?</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nome Completo *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="Digite o nome completo do cliente"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Telefone *
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="(11) 99999-9999"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="cliente@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cidade
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            type="text"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="São Paulo"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bairro de Interesse
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.neighborhood}
                                        onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="Vila Madalena, Itaim, etc."
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Perfil do Cliente */}
                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Target className="h-8 w-8 text-purple-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">Perfil do Cliente</h2>
                                <p className="text-gray-600">Qual o estágio e origem deste contato?</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Status no Pipeline *
                                    </label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {[
                                            { value: 'lead', label: 'Lead', desc: 'Primeiro contato', color: 'yellow' },
                                            { value: 'prospect', label: 'Prospecto', desc: 'Interesse qualificado', color: 'blue' },
                                            { value: 'client', label: 'Cliente', desc: 'Fechou negócio', color: 'green' }
                                        ].map((status) => (
                                            <label key={status.value} className="relative">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value={status.value}
                                                    checked={formData.status === status.value}
                                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                                    className="sr-only"
                                                />
                                                <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.status === status.value
                                                    ? `border-${status.color}-300 bg-${status.color}-50`
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}>
                                                    <div className="flex items-center gap-3">
                                                        {getStatusIcon(status.value)}
                                                        <div>
                                                            <div className="font-medium text-gray-900">{status.label}</div>
                                                            <div className="text-sm text-gray-600">{status.desc}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Prioridade
                                    </label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {[
                                            { value: 'high', label: 'Alta', desc: 'Urgente, hot lead', icon: '🔥' },
                                            { value: 'medium', label: 'Média', desc: 'Follow-up normal', icon: '⚡' },
                                            { value: 'low', label: 'Baixa', desc: 'Não tem pressa', icon: '🌱' }
                                        ].map((priority) => (
                                            <label key={priority.value} className="relative">
                                                <input
                                                    type="radio"
                                                    name="priority"
                                                    value={priority.value}
                                                    checked={formData.priority === priority.value}
                                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                                                    className="sr-only"
                                                />
                                                <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.priority === priority.value
                                                    ? getPriorityColor(priority.value)
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-lg">{priority.icon}</span>
                                                        <div>
                                                            <div className="font-medium text-gray-900">{priority.label}</div>
                                                            <div className="text-sm text-gray-600">{priority.desc}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Origem do Lead *
                                    </label>
                                    <select
                                        value={formData.source}
                                        onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="website">🌐 Site/Landing Page</option>
                                        <option value="referral">👥 Indicação</option>
                                        <option value="social_media">📱 Redes Sociais</option>
                                        <option value="phone">📞 Ligação</option>
                                        <option value="walk_in">🚪 Visita presencial</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Interesse Imobiliário */}
                    {currentStep === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Building2 className="h-8 w-8 text-green-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">Interesse Imobiliário</h2>
                                <p className="text-gray-600">Que tipo de negócio o cliente busca?</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Tipo de Imóvel *
                                    </label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {[
                                            { value: 'apartment', label: 'Apartamento', icon: <Building2 className="h-5 w-5" /> },
                                            { value: 'house', label: 'Casa', icon: <Home className="h-5 w-5" /> },
                                            { value: 'commercial', label: 'Comercial', icon: <Users className="h-5 w-5" /> },
                                            { value: 'land', label: 'Terreno', icon: <MapPin className="h-5 w-5" /> }
                                        ].map((type) => (
                                            <label key={type.value} className="relative">
                                                <input
                                                    type="radio"
                                                    name="property_type"
                                                    value={type.value}
                                                    checked={formData.property_type === type.value}
                                                    onChange={(e) => setFormData({ ...formData, property_type: e.target.value as any })}
                                                    className="sr-only"
                                                />
                                                <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.property_type === type.value
                                                    ? 'border-green-300 bg-green-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}>
                                                    <div className="flex items-center gap-3">
                                                        {type.icon}
                                                        <span className="font-medium text-gray-900">{type.label}</span>
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Tipo de Transação *
                                    </label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {[
                                            { value: 'buy', label: 'Comprar', desc: 'Cliente quer adquirir', icon: '💰' },
                                            { value: 'rent', label: 'Alugar', desc: 'Cliente quer locar', icon: '🔑' },
                                            { value: 'sell', label: 'Vender', desc: 'Cliente tem imóvel', icon: '🏷️' }
                                        ].map((transaction) => (
                                            <label key={transaction.value} className="relative">
                                                <input
                                                    type="radio"
                                                    name="transaction_type"
                                                    value={transaction.value}
                                                    checked={formData.transaction_type === transaction.value}
                                                    onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value as any })}
                                                    className="sr-only"
                                                />
                                                <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.transaction_type === transaction.value
                                                    ? 'border-blue-300 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xl">{transaction.icon}</span>
                                                        <div>
                                                            <div className="font-medium text-gray-900">{transaction.label}</div>
                                                            <div className="text-sm text-gray-600">{transaction.desc}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Urgência
                                    </label>
                                    <select
                                        value={formData.urgency}
                                        onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    >
                                        <option value="low">🌱 Baixa - Sem pressa</option>
                                        <option value="medium">⚡ Média - Próximos meses</option>
                                        <option value="high">🔥 Alta - Urgente</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Orçamento & Follow-up */}
                    {currentStep === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <DollarSign className="h-8 w-8 text-amber-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">Orçamento & Follow-up</h2>
                                <p className="text-gray-600">Detalhes financeiros e próximos passos</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Orçamento Mínimo (R$)
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            type="number"
                                            value={formData.budget_min}
                                            onChange={(e) => setFormData({ ...formData, budget_min: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="300000"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Orçamento Máximo (R$)
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            type="number"
                                            value={formData.budget_max}
                                            onChange={(e) => setFormData({ ...formData, budget_max: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="500000"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Próximo Follow-up
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            type="datetime-local"
                                            value={formData.next_follow_up}
                                            onChange={(e) => setFormData({ ...formData, next_follow_up: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Observações
                                    </label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="Informações importantes sobre o cliente..."
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Form Actions */}
                    <div className="flex justify-between pt-8 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Anterior
                        </button>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>

                            {currentStep < steps.length ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!canProceed()}
                                    className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Próximo
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            Salvando...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            Salvar Cliente
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </motion.form>
            </div>
        </div>
    )
}
