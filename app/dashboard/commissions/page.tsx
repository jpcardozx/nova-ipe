'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    DollarSign,
    TrendingUp,
    Target,
    Calendar,
    Building2,
    User,
    BarChart3,
    Star,
    Award,
    Percent,
    FileText,
    Download,
    Filter,
    Search,
    ChevronDown,
    ArrowUp,
    ArrowDown,
    Eye
} from 'lucide-react'

interface Commission {
    id: string
    property_title: string
    property_address: string
    client_name: string
    sale_value: number
    commission_percentage: number
    commission_amount: number
    status: 'pending' | 'paid' | 'cancelled'
    sale_date: string
    payment_date?: string
    type: 'sale' | 'rental'
}

interface Goal {
    id: string
    title: string
    target_amount: number
    current_amount: number
    target_date: string
    type: 'monthly' | 'quarterly' | 'yearly'
}

// TODO: Replace with actual API calls to fetch commissions and goals from backend
// Mock data removed for production - connect to real commissions and goals APIs
const mockCommissions: Commission[] = []

const mockGoals: Goal[] = []

export default function CommissionsPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [typeFilter, setTypeFilter] = useState('all')
    const [commissions, setCommissions] = useState<Commission[]>([])
    const [goals, setGoals] = useState<Goal[]>([])
    
    // TODO: Implement useEffect to load commissions and goals from API
    // useEffect(() => {
    //     const loadData = async () => {
    //         const [commissionsResponse, goalsResponse] = await Promise.all([
    //             fetch('/api/commissions'),
    //             fetch('/api/goals')
    //         ])
    //         const commissionsData = await commissionsResponse.json()
    //         const goalsData = await goalsResponse.json()
    //         setCommissions(commissionsData)
    //         setGoals(goalsData)
    //     }
    //     loadData()
    // }, [])

    const filteredCommissions = commissions.filter(commission => {
        const matchesSearch = commission.property_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            commission.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            commission.property_address.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || commission.status === statusFilter
        const matchesType = typeFilter === 'all' || commission.type === typeFilter
        return matchesSearch && matchesStatus && matchesType
    })

    const totalCommissionsPaid = commissions
        .filter(c => c.status === 'paid')
        .reduce((sum, c) => sum + c.commission_amount, 0)

    const totalCommissionsPending = commissions
        .filter(c => c.status === 'pending')
        .reduce((sum, c) => sum + c.commission_amount, 0)

    const averageCommission = commissions.length > 0 
        ? commissions.reduce((sum, c) => sum + c.commission_amount, 0) / commissions.length 
        : 0

    const statusConfig = {
        pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: Calendar },
        paid: { label: 'Pago', color: 'bg-green-100 text-green-800', icon: DollarSign },
        cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: FileText }
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    const getProgressPercentage = (current: number, target: number) => {
        return Math.min((current / target) * 100, 100)
    }

    const getProgressColor = (percentage: number) => {
        if (percentage >= 100) return 'bg-green-500'
        if (percentage >= 75) return 'bg-blue-500'
        if (percentage >= 50) return 'bg-yellow-500'
        return 'bg-red-500'
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Comissões e Metas
                    </h1>
                    <p className="text-gray-600">
                        Acompanhe suas comissões, recebimentos e metas de desempenho
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Relatório
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Recebido</p>
                            <p className="text-2xl font-bold text-green-600">
                                {formatCurrency(totalCommissionsPaid)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                            <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-green-600">+12% este mês</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">A Receber</p>
                            <p className="text-2xl font-bold text-yellow-600">
                                {formatCurrency(totalCommissionsPending)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-gray-600">{commissions.filter(c => c.status === 'pending').length} pendentes</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Média por Venda</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {formatCurrency(averageCommission)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                            <BarChart3 className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-gray-600">Baseado em {commissions.length} vendas</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Meta do Mês</p>
                            <p className="text-2xl font-bold text-purple-600">
                                {Math.round(getProgressPercentage(goals[0]?.current_amount || 0, goals[0]?.target_amount || 1))}%
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                            <Target className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(getProgressPercentage(goals[0]?.current_amount || 0, goals[0]?.target_amount || 1), 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Goals Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-600" />
                        Metas de Performance
                    </h2>
                    <button className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg text-sm font-medium transition-colors">
                        Definir Nova Meta
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {goals.map((goal) => {
                        const progress = getProgressPercentage(goal.current_amount, goal.target_amount)
                        const isCompleted = progress >= 100
                        
                        return (
                            <motion.div
                                key={goal.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gray-50 p-4 rounded-xl"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                                        <p className="text-sm text-gray-500">
                                            Até {new Date(goal.target_date).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                    {isCompleted && (
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <Award className="h-4 w-4 text-green-600" />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Progresso</span>
                                        <span className="font-semibold">{Math.round(progress)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(progress)}`}
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <div>
                                        <p className="text-gray-600">Atual</p>
                                        <p className="font-semibold text-gray-900">
                                            {formatCurrency(goal.current_amount)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-600">Meta</p>
                                        <p className="font-semibold text-gray-900">
                                            {formatCurrency(goal.target_amount)}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Buscar por imóvel, cliente ou endereço..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">Todos os status</option>
                            <option value="pending">Pendente</option>
                            <option value="paid">Pago</option>
                            <option value="cancelled">Cancelado</option>
                        </select>

                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">Todos os tipos</option>
                            <option value="sale">Venda</option>
                            <option value="rental">Locação</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Commissions Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Histórico de Comissões ({filteredCommissions.length})
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Imóvel
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cliente
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Valor da Venda
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Comissão
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Data
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredCommissions.map((commission) => {
                                const statusInfo = statusConfig[commission.status]

                                return (
                                    <motion.tr
                                        key={commission.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                                    <Building2 className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{commission.property_title}</p>
                                                    <p className="text-sm text-gray-500">{commission.property_address}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-gray-400" />
                                                <span className="font-medium text-gray-900">{commission.client_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900">
                                                    {formatCurrency(commission.sale_value)}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {commission.type === 'sale' ? 'Venda' : 'Locação'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-right">
                                                <p className="font-semibold text-green-600">
                                                    {formatCurrency(commission.commission_amount)}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {commission.commission_percentage}%
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                                <statusInfo.icon className="h-3 w-3" />
                                                {statusInfo.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div>
                                                <p>Venda: {new Date(commission.sale_date).toLocaleDateString('pt-BR')}</p>
                                                {commission.payment_date && (
                                                    <p className="text-green-600">
                                                        Pago: {new Date(commission.payment_date).toLocaleDateString('pt-BR')}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}