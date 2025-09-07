'use client'

import { useState, useEffect } from 'react'
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    PlusCircle,
    MinusCircle,
    Calendar,
    Filter,
    Download,
    Eye,
    Edit,
    Trash2,
    Search,
    CreditCard,
    Building2,
    Users,
    Target,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react'

interface Transaction {
    id: string
    type: 'income' | 'expense' | 'commission'
    category: string
    description: string
    amount: number
    date: Date
    status: 'pending' | 'completed' | 'cancelled'
    propertyId?: string
    clientId?: string
    agentId?: string
    paymentMethod?: string
}

interface FinancialSummary {
    totalIncome: number
    totalExpenses: number
    totalCommissions: number
    netProfit: number
    pendingPayments: number
    monthlyGrowth: number
}

export default function FinancePage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [summary, setSummary] = useState<FinancialSummary | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense' | 'commission'>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [showAddModal, setShowAddModal] = useState(false)

    useEffect(() => {
        loadFinancialData()
    }, [selectedPeriod, filterType])

    const loadFinancialData = async () => {
        setLoading(true)
        try {
            // Simulate loading
            await new Promise(resolve => setTimeout(resolve, 1000))

            setSummary({
                totalIncome: 487500,
                totalExpenses: 124300,
                totalCommissions: 73125,
                netProfit: 363200,
                pendingPayments: 45600,
                monthlyGrowth: 12.8
            })

            setTransactions([
                {
                    id: '1',
                    type: 'income',
                    category: 'Venda',
                    description: 'Venda Casa Centro - Comissão',
                    amount: 24500,
                    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
                    status: 'completed',
                    propertyId: 'prop-123',
                    clientId: 'client-456',
                    paymentMethod: 'transferencia'
                },
                {
                    id: '2',
                    type: 'commission',
                    category: 'Comissão Vendedor',
                    description: 'Comissão Maria Silva - Casa Centro',
                    amount: 12250,
                    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
                    status: 'pending',
                    agentId: 'agent-789',
                    paymentMethod: 'pix'
                },
                {
                    id: '3',
                    type: 'expense',
                    category: 'Marketing',
                    description: 'Anúncios Facebook/Instagram',
                    amount: 2500,
                    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
                    status: 'completed',
                    paymentMethod: 'cartao'
                },
                {
                    id: '4',
                    type: 'income',
                    category: 'Locação',
                    description: 'Taxa de Locação - Apt Vista Alegre',
                    amount: 3600,
                    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
                    status: 'completed',
                    propertyId: 'prop-567',
                    paymentMethod: 'transferencia'
                },
                {
                    id: '5',
                    type: 'expense',
                    category: 'Operacional',
                    description: 'Material de escritório',
                    amount: 850,
                    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
                    status: 'completed',
                    paymentMethod: 'dinheiro'
                }
            ])
        } catch (error) {
            console.error('Error loading financial data:', error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-green-600 bg-green-50'
            case 'pending': return 'text-yellow-600 bg-yellow-50'
            case 'cancelled': return 'text-red-600 bg-red-50'
            default: return 'text-gray-600 bg-gray-50'
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'completed': return 'Concluído'
            case 'pending': return 'Pendente'
            case 'cancelled': return 'Cancelado'
            default: return status
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'income': return <ArrowUpRight className="h-4 w-4 text-green-600" />
            case 'expense': return <ArrowDownRight className="h-4 w-4 text-red-600" />
            case 'commission': return <Target className="h-4 w-4 text-blue-600" />
            default: return <DollarSign className="h-4 w-4 text-gray-600" />
        }
    }

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'income': return 'Receita'
            case 'expense': return 'Despesa'
            case 'commission': return 'Comissão'
            default: return type
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount)
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date)
    }

    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = filterType === 'all' || transaction.type === filterType
        return matchesSearch && matchesType
    })

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Carregando dados financeiros...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <DollarSign className="h-7 w-7 text-amber-600" />
                            Financeiro
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Gerencie receitas, despesas e comissões
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                        >
                            <PlusCircle className="h-4 w-4" />
                            Nova Transação
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Download className="h-4 w-4" />
                            Exportar
                        </button>
                    </div>
                </div>

                {/* Financial Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                            <span className="text-sm text-green-600 font-medium">
                                +{summary?.monthlyGrowth}%
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {formatCurrency(summary?.totalIncome || 0)}
                        </div>
                        <div className="text-sm text-gray-600">Receita Total</div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <TrendingDown className="h-6 w-6 text-red-600" />
                            </div>
                            <span className="text-sm text-red-600 font-medium">Despesas</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {formatCurrency(summary?.totalExpenses || 0)}
                        </div>
                        <div className="text-sm text-gray-600">Total Gasto</div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Target className="h-6 w-6 text-blue-600" />
                            </div>
                            <span className="text-sm text-blue-600 font-medium">Comissões</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {formatCurrency(summary?.totalCommissions || 0)}
                        </div>
                        <div className="text-sm text-gray-600">Total Comissões</div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <DollarSign className="h-6 w-6 text-amber-600" />
                            </div>
                            <span className="text-sm text-amber-600 font-medium">Lucro Líquido</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {formatCurrency(summary?.netProfit || 0)}
                        </div>
                        <div className="text-sm text-gray-600">Resultado</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar transações..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as any)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            >
                                <option value="all">Todos os tipos</option>
                                <option value="income">Receitas</option>
                                <option value="expense">Despesas</option>
                                <option value="commission">Comissões</option>
                            </select>

                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            >
                                <option value="7d">Últimos 7 dias</option>
                                <option value="30d">Últimos 30 dias</option>
                                <option value="90d">Últimos 90 dias</option>
                                <option value="1y">Último ano</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Transações ({filteredTransactions.length})
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Tipo</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Descrição</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Categoria</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Valor</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Data</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.map((transaction) => (
                                        <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    {getTypeIcon(transaction.type)}
                                                    <span className="text-sm font-medium">
                                                        {getTypeLabel(transaction.type)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {transaction.description}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-sm text-gray-600">
                                                    {transaction.category}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`text-sm font-medium ${transaction.type === 'expense'
                                                        ? 'text-red-600'
                                                        : 'text-green-600'
                                                    }`}>
                                                    {transaction.type === 'expense' ? '-' : '+'}
                                                    {formatCurrency(transaction.amount)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-sm text-gray-600">
                                                    {formatDate(transaction.date)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                                    {getStatusLabel(transaction.status)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded">
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
