'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'

interface EmailStatsProps {
  totalEmails: number
  readEmails: number
  unreadEmails: number
  sentToday?: number
  responseRate?: number
  isLoading?: boolean
}

export default function EmailStats({
  totalEmails,
  readEmails,
  unreadEmails,
  sentToday = 0,
  responseRate = 0,
  isLoading = false
}: EmailStatsProps) {
  const readPercentage = totalEmails > 0 ? Math.round((readEmails / totalEmails) * 100) : 0

  const stats = [
    {
      label: 'Total',
      value: totalEmails,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      label: 'Lidas',
      value: readEmails,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      percentage: readPercentage
    },
    {
      label: 'Não lidas',
      value: unreadEmails,
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    ...(sentToday > 0 ? [{
      label: 'Enviados hoje',
      value: sentToday,
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }] : [])
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Estatísticas
        </span>
        <motion.button
          whileHover={{ rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          className="p-1"
          disabled={isLoading}
        >
          <RefreshCw className={`h-3 w-3 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bgColor} rounded-lg p-3 text-center border border-white/50 hover:shadow-sm transition-all duration-200`}
          >
            <div className={`font-semibold ${stat.textColor} text-lg`}>
              {isLoading ? (
                <div className="w-6 h-6 mx-auto bg-gray-200 rounded animate-pulse"></div>
              ) : (
                stat.value
              )}
            </div>
            <div className={`${stat.textColor.replace('600', '500')} text-xs font-medium`}>
              {stat.label}
            </div>
            {stat.percentage !== undefined && (
              <div className="text-xs text-gray-500 mt-1">
                {stat.percentage}%
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Response Rate */}
      {responseRate > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 border border-amber-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-700">Taxa de Resposta</span>
            {responseRate >= 50 ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
          </div>
          <div className="text-lg font-semibold text-amber-600 mt-1">
            {responseRate}%
          </div>
          <div className="w-full bg-amber-200 rounded-full h-1.5 mt-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${responseRate}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-amber-500 h-1.5 rounded-full"
            ></motion.div>
          </div>
        </motion.div>
      )}

      {/* Quick Tips */}
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <div className="text-xs font-medium text-gray-700 mb-2">💡 Dica Rápida</div>
        <div className="text-xs text-gray-600 leading-relaxed">
          {unreadEmails > 5
            ? "Você tem muitos e-mails não lidos. Considere usar filtros para organizar."
            : readPercentage > 80
            ? "Excelente! Você está em dia com seus e-mails."
            : "Use templates para responder mais rapidamente."
          }
        </div>
      </div>
    </div>
  )
}