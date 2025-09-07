'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import {
    Calculator,
    DollarSign,
    Home,
    Percent,
    Calendar,
    TrendingUp,
    Info,
    Share,
    Download,
    RefreshCw,
    PiggyBank,
    CreditCard,
    Building2
} from 'lucide-react'

interface FinancingResult {
    monthlyPayment: number
    totalAmount: number
    totalInterest: number
    downPayment: number
    financedAmount: number
    affordablePropertyValue: number
}

export default function CalculatorPage() {
    const { user } = useCurrentUser()
    
    // Estados para Simulação de Financiamento
    const [propertyValue, setPropertyValue] = useState<string>('500000')
    const [downPaymentPercent, setDownPaymentPercent] = useState<string>('20')
    const [interestRate, setInterestRate] = useState<string>('10.5')
    const [termYears, setTermYears] = useState<string>('30')
    const [income, setIncome] = useState<string>('15000')
    
    // Estados para Capacidade de Compra
    const [monthlyIncome, setMonthlyIncome] = useState<string>('15000')
    const [monthlyExpenses, setMonthlyExpenses] = useState<string>('8000')
    const [availableDownPayment, setAvailableDownPayment] = useState<string>('100000')
    const [maxPaymentRatio, setMaxPaymentRatio] = useState<string>('30')
    
    const [activeTab, setActiveTab] = useState<'financing' | 'affordability' | 'investment'>('financing')
    const [result, setResult] = useState<FinancingResult | null>(null)

    useEffect(() => {
        calculateFinancing()
    }, [propertyValue, downPaymentPercent, interestRate, termYears])

    useEffect(() => {
        if (activeTab === 'affordability') {
            calculateAffordability()
        }
    }, [monthlyIncome, monthlyExpenses, availableDownPayment, maxPaymentRatio, activeTab])

    const calculateFinancing = () => {
        const value = parseFloat(propertyValue) || 0
        const downPercent = parseFloat(downPaymentPercent) || 0
        const rate = parseFloat(interestRate) || 0
        const years = parseFloat(termYears) || 0

        if (value <= 0 || years <= 0) {
            setResult(null)
            return
        }

        const downPayment = (value * downPercent) / 100
        const financedAmount = value - downPayment
        const monthlyRate = rate / 100 / 12
        const totalMonths = years * 12

        let monthlyPayment = 0
        if (rate > 0) {
            monthlyPayment = financedAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                           (Math.pow(1 + monthlyRate, totalMonths) - 1)
        } else {
            monthlyPayment = financedAmount / totalMonths
        }

        const totalAmount = monthlyPayment * totalMonths + downPayment
        const totalInterest = totalAmount - value

        setResult({
            monthlyPayment,
            totalAmount,
            totalInterest,
            downPayment,
            financedAmount,
            affordablePropertyValue: 0
        })
    }

    const calculateAffordability = () => {
        const income = parseFloat(monthlyIncome) || 0
        const expenses = parseFloat(monthlyExpenses) || 0
        const downPayment = parseFloat(availableDownPayment) || 0
        const paymentRatio = parseFloat(maxPaymentRatio) || 30
        const rate = parseFloat(interestRate) || 10.5
        const years = parseFloat(termYears) || 30

        const availableIncome = income - expenses
        const maxMonthlyPayment = (availableIncome * paymentRatio) / 100
        const monthlyRate = rate / 100 / 12
        const totalMonths = years * 12

        let maxFinancedAmount = 0
        if (rate > 0) {
            maxFinancedAmount = maxMonthlyPayment * (Math.pow(1 + monthlyRate, totalMonths) - 1) / 
                              (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))
        } else {
            maxFinancedAmount = maxMonthlyPayment * totalMonths
        }

        const affordablePropertyValue = maxFinancedAmount + downPayment

        setResult(prev => ({
            monthlyPayment: maxMonthlyPayment,
            totalAmount: maxMonthlyPayment * totalMonths + downPayment,
            totalInterest: (maxMonthlyPayment * totalMonths) - maxFinancedAmount,
            downPayment,
            financedAmount: maxFinancedAmount,
            affordablePropertyValue
        }))
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value)
    }

    const formatCurrencyInput = (value: string) => {
        const numericValue = value.replace(/\D/g, '')
        return parseFloat(numericValue || '0').toLocaleString('pt-BR')
    }

    const handleCurrencyInput = (value: string, setter: (value: string) => void) => {
        const numericValue = value.replace(/\D/g, '')
        setter(numericValue)
    }

    const tabs = [
        { id: 'financing', label: 'Simulação de Financiamento', icon: Calculator },
        { id: 'affordability', label: 'Capacidade de Compra', icon: PiggyBank },
        { id: 'investment', label: 'Análise de Investimento', icon: TrendingUp }
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Calculadora Imobiliária</h1>
                    <p className="text-gray-600">Simule financiamentos e analise investimentos</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Share className="h-4 w-4" />
                        Compartilhar
                    </button>
                    <button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:from-amber-600 hover:to-amber-700 transition-all">
                        <Download className="h-4 w-4" />
                        Exportar PDF
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Tab Navigation */}
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {tabs.map((tab) => {
                            const IconComponent = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                        activeTab === tab.id
                                            ? 'border-amber-500 text-amber-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <IconComponent className="h-4 w-4" />
                                    {tab.label}
                                </button>
                            )
                        })}
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'financing' && (
                        <motion.div
                            key="financing"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                        >
                            {/* Input Section */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900">Dados do Financiamento</h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Valor do Imóvel
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                                            <input
                                                type="text"
                                                value={formatCurrencyInput(propertyValue)}
                                                onChange={(e) => handleCurrencyInput(e.target.value, setPropertyValue)}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
                                                placeholder="500.000"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Entrada (%)
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={downPaymentPercent}
                                                    onChange={(e) => setDownPaymentPercent(e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                    placeholder="20"
                                                    min="0"
                                                    max="100"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Prazo (anos)
                                            </label>
                                            <input
                                                type="number"
                                                value={termYears}
                                                onChange={(e) => setTermYears(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                placeholder="30"
                                                min="1"
                                                max="35"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Taxa de Juros (% ao ano)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={interestRate}
                                                onChange={(e) => setInterestRate(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                placeholder="10.50"
                                                min="0"
                                                max="50"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Taxa média atual: 10,5% ao ano
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <button
                                        onClick={calculateFinancing}
                                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:from-amber-600 hover:to-amber-700 transition-all"
                                    >
                                        <Calculator className="h-4 w-4" />
                                        Recalcular
                                    </button>
                                </div>
                            </div>

                            {/* Result Section */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900">Resultado da Simulação</h3>
                                
                                {result ? (
                                    <div className="space-y-4">
                                        {/* Main Result Card */}
                                        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-6 text-white">
                                            <div className="flex items-center gap-3 mb-2">
                                                <CreditCard className="h-6 w-6" />
                                                <span className="text-lg font-medium">Parcela Mensal</span>
                                            </div>
                                            <p className="text-3xl font-bold">{formatCurrency(result.monthlyPayment)}</p>
                                            <p className="text-amber-100 text-sm mt-1">
                                                em {termYears} anos ({parseInt(termYears) * 12} parcelas)
                                            </p>
                                        </div>

                                        {/* Breakdown Cards */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Home className="h-4 w-4 text-blue-600" />
                                                    <span className="text-sm font-medium text-blue-900">Entrada</span>
                                                </div>
                                                <p className="text-xl font-bold text-blue-900">
                                                    {formatCurrency(result.downPayment)}
                                                </p>
                                                <p className="text-xs text-blue-700">
                                                    {downPaymentPercent}% do valor
                                                </p>
                                            </div>

                                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <DollarSign className="h-4 w-4 text-green-600" />
                                                    <span className="text-sm font-medium text-green-900">Financiado</span>
                                                </div>
                                                <p className="text-xl font-bold text-green-900">
                                                    {formatCurrency(result.financedAmount)}
                                                </p>
                                                <p className="text-xs text-green-700">
                                                    {(100 - parseFloat(downPaymentPercent)).toFixed(0)}% do valor
                                                </p>
                                            </div>

                                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Percent className="h-4 w-4 text-purple-600" />
                                                    <span className="text-sm font-medium text-purple-900">Juros Total</span>
                                                </div>
                                                <p className="text-xl font-bold text-purple-900">
                                                    {formatCurrency(result.totalInterest)}
                                                </p>
                                                <p className="text-xs text-purple-700">
                                                    Valor pago em juros
                                                </p>
                                            </div>

                                            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Building2 className="h-4 w-4 text-orange-600" />
                                                    <span className="text-sm font-medium text-orange-900">Total Pago</span>
                                                </div>
                                                <p className="text-xl font-bold text-orange-900">
                                                    {formatCurrency(result.totalAmount)}
                                                </p>
                                                <p className="text-xs text-orange-700">
                                                    Entrada + parcelas
                                                </p>
                                            </div>
                                        </div>

                                        {/* Info Box */}
                                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                                            <div className="flex gap-3">
                                                <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                                <div className="text-sm text-amber-800">
                                                    <p className="font-medium mb-1">Informações importantes:</p>
                                                    <ul className="text-xs space-y-1">
                                                        <li>• Esta é uma simulação. Valores reais podem variar</li>
                                                        <li>• Não inclui taxas de cartório, ITBI e outras despesas</li>
                                                        <li>• Consulte seu gerente para taxas personalizadas</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">Preencha os dados para ver a simulação</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'affordability' && (
                        <motion.div
                            key="affordability"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                        >
                            {/* Input Section */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900">Sua Situação Financeira</h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Renda Mensal Bruta
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                                            <input
                                                type="text"
                                                value={formatCurrencyInput(monthlyIncome)}
                                                onChange={(e) => handleCurrencyInput(e.target.value, setMonthlyIncome)}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                placeholder="15.000"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Gastos Mensais Fixos
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                                            <input
                                                type="text"
                                                value={formatCurrencyInput(monthlyExpenses)}
                                                onChange={(e) => handleCurrencyInput(e.target.value, setMonthlyExpenses)}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                placeholder="8.000"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Inclua: aluguel, contas, alimentação, etc.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Valor Disponível para Entrada
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                                            <input
                                                type="text"
                                                value={formatCurrencyInput(availableDownPayment)}
                                                onChange={(e) => handleCurrencyInput(e.target.value, setAvailableDownPayment)}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                placeholder="100.000"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            % da Renda para Parcela (máx. recomendado: 30%)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={maxPaymentRatio}
                                                onChange={(e) => setMaxPaymentRatio(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                placeholder="30"
                                                min="10"
                                                max="50"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <button
                                        onClick={calculateAffordability}
                                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:from-blue-600 hover:to-blue-700 transition-all"
                                    >
                                        <PiggyBank className="h-4 w-4" />
                                        Calcular Capacidade
                                    </button>
                                </div>
                            </div>

                            {/* Result Section */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900">Sua Capacidade de Compra</h3>
                                
                                {result ? (
                                    <div className="space-y-4">
                                        {/* Main Result */}
                                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Home className="h-6 w-6" />
                                                <span className="text-lg font-medium">Você pode comprar até</span>
                                            </div>
                                            <p className="text-3xl font-bold">{formatCurrency(result.affordablePropertyValue)}</p>
                                            <p className="text-blue-100 text-sm mt-1">
                                                Valor máximo do imóvel
                                            </p>
                                        </div>

                                        {/* Financial Summary */}
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h4 className="font-medium text-gray-900 mb-3">Resumo Financeiro</h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Renda mensal:</span>
                                                        <span className="font-medium">{formatCurrency(parseFloat(monthlyIncome))}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Gastos fixos:</span>
                                                        <span className="font-medium">-{formatCurrency(parseFloat(monthlyExpenses))}</span>
                                                    </div>
                                                    <div className="flex justify-between border-t pt-2">
                                                        <span className="text-gray-600">Renda disponível:</span>
                                                        <span className="font-medium text-green-600">
                                                            {formatCurrency(parseFloat(monthlyIncome) - parseFloat(monthlyExpenses))}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Parcela máxima ({maxPaymentRatio}%):</span>
                                                        <span className="font-medium text-blue-600">{formatCurrency(result.monthlyPayment)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Warning if ratio is high */}
                                        {parseFloat(maxPaymentRatio) > 30 && (
                                            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                                                <div className="flex gap-3">
                                                    <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                                    <div className="text-sm text-amber-800">
                                                        <p className="font-medium">Atenção!</p>
                                                        <p>Comprometer mais de 30% da renda com parcelas pode ser arriscado financeiramente.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <PiggyBank className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">Preencha os dados para calcular sua capacidade</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'investment' && (
                        <motion.div
                            key="investment"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-center py-12"
                        >
                            <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Análise de Investimento</h3>
                            <p className="text-gray-500 mb-4">Em desenvolvimento</p>
                            <p className="text-sm text-gray-400">
                                Funcionalidade para análise de rentabilidade, ROI e comparação de investimentos
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}