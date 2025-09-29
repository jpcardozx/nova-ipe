'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Calculator,
  DollarSign,
  Home,
  Users,
  Calendar,
  PieChart,
  Target
} from 'lucide-react'

interface Property {
  id: string
  address: string
  tenant: string
  currentRent: number
  iptu: number
  referenceRate: number
  newRent: number
  status: 'pending' | 'approved' | 'sent'
  lastUpdate: string
}

interface ExecutiveSummaryProps {
  properties: Property[]
  selectedProperties: string[]
}

export default function ExecutiveSummary({ properties, selectedProperties }: ExecutiveSummaryProps) {
  const selectedProps = properties.filter(p => selectedProperties.includes(p.id))

  // Cálculos
  const totalCurrentRent = selectedProps.reduce((sum, p) => sum + p.currentRent, 0)
  const totalNewRent = selectedProps.reduce((sum, p) => sum + p.newRent, 0)
  const totalIncrease = totalNewRent - totalCurrentRent
  const averageIncreasePercent = selectedProps.length > 0
    ? selectedProps.reduce((sum, p) => sum + ((p.newRent - p.currentRent) / p.currentRent * 100), 0) / selectedProps.length
    : 0

  const avgIptu = selectedProps.length > 0
    ? selectedProps.reduce((sum, p) => sum + p.iptu, 0) / selectedProps.length
    : 0

  const statusCount = {
    pending: selectedProps.filter(p => p.status === 'pending').length,
    approved: selectedProps.filter(p => p.status === 'approved').length,
    sent: selectedProps.filter(p => p.status === 'sent').length
  }

  const stats = [
    {
      label: 'Imóveis Selecionados',
      value: selectedProps.length,
      icon: Home,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Aluguel Total Atual',
      value: `R$ ${totalCurrentRent.toLocaleString('pt-BR')}`,
      icon: DollarSign,
      color: 'gray',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-600',
      borderColor: 'border-gray-200'
    },
    {
      label: 'Novo Aluguel Total',
      value: `R$ ${totalNewRent.toLocaleString('pt-BR')}`,
      icon: TrendingUp,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      label: 'Aumento Total',
      value: `R$ ${totalIncrease.toLocaleString('pt-BR')}`,
      icon: Calculator,
      color: 'orange',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200',
      subtitle: `${averageIncreasePercent.toFixed(1)}% em média`
    }
  ]

  if (selectedProps.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecione Imóveis</h3>
          <p className="text-gray-600">
            Selecione um ou mais imóveis para visualizar o resumo executivo dos reajustes
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-100 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
            <PieChart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Resumo Executivo</h2>
            <p className="text-sm text-gray-600">Análise consolidada dos reajustes selecionados</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`${stat.bgColor} rounded-xl p-4 border ${stat.borderColor} hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <IconComponent className={`h-5 w-5 ${stat.textColor}`} />
                  <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                </div>
                <div className={`text-2xl font-bold ${stat.textColor} mb-1`}>
                  {stat.value}
                </div>
                {stat.subtitle && (
                  <div className="text-xs text-gray-500">{stat.subtitle}</div>
                )}
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-50 rounded-xl p-4 border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-600" />
              Status dos Imóveis
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Pendentes</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{statusCount.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Aprovados</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{statusCount.approved}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Enviados</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{statusCount.sent}</span>
              </div>
            </div>
          </motion.div>

          {/* Additional Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-50 rounded-xl p-4 border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-gray-600" />
              Métricas Adicionais
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">IPTU Médio</span>
                <span className="text-sm font-semibold text-gray-900">
                  R$ {avgIptu.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Taxa Mín/Máx</span>
                <span className="text-sm font-semibold text-gray-900">
                  {Math.min(...selectedProps.map(p => p.referenceRate * 100)).toFixed(1)}% / {Math.max(...selectedProps.map(p => p.referenceRate * 100)).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Receita Mensal</span>
                <span className="text-sm font-semibold text-green-600">
                  +R$ {totalIncrease.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Impact Analysis */}
        {totalIncrease > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200"
          >
            <h3 className="text-lg font-semibold text-green-900 mb-2 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Impacto Financeiro
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-green-700 font-medium">Mensal:</span>
                <div className="text-xl font-bold text-green-800">
                  +R$ {totalIncrease.toLocaleString('pt-BR')}
                </div>
              </div>
              <div>
                <span className="text-green-700 font-medium">Anual:</span>
                <div className="text-xl font-bold text-green-800">
                  +R$ {(totalIncrease * 12).toLocaleString('pt-BR')}
                </div>
              </div>
              <div>
                <span className="text-green-700 font-medium">Aumento Médio:</span>
                <div className="text-xl font-bold text-green-800">
                  {averageIncreasePercent.toFixed(1)}%
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}