'use client'

import { useState, useEffect, useRef } from 'react'

interface DashboardMetrics {
  totalRevenue: number
  monthlyRevenue: number
  quarterlyRevenue: number
  averageTicket: number
  salesGoal: number
  salesGoalProgress: number
  
  totalProperties: number
  activeListings: number
  soldThisMonth: number
  avgDaysOnMarket: number
  priceReductions: number
  exclusiveListings: number
  
  totalLeads: number
  qualifiedLeads: number
  hotLeads: number
  conversionRate: number
  responseTime: number
  totalClients: number
  
  appointmentsToday: number
  appointmentsWeek: number
  visitConversionRate: number
  showingsCompleted: number
  
  avgRating: number
  totalReviews: number
  marketShare: number
  clientSatisfaction: number
  
  callsMade: number
  emailsSent: number
  proposalsSent: number
  contractsSigned: number
  
  activeCampaigns: number
  campaignROI: number
  leadCost: number
  digitalEngagement: number
}

export function useRealtimeMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchMetrics = async () => {
    try {
      // TODO: Implementar chamada para API real
      // const response = await fetch('/api/dashboard/metrics')
      // const data = await response.json()
      
      // Estrutura vazia até conectar com backend real
      const emptyMetrics: DashboardMetrics = {
        // Vendas e Receita
        totalRevenue: 0,
        monthlyRevenue: 0,
        quarterlyRevenue: 0,
        averageTicket: 0,
        salesGoal: 0,
        salesGoalProgress: 0,
        
        // Propriedades
        totalProperties: 0,
        activeListings: 0,
        soldThisMonth: 0,
        avgDaysOnMarket: 0,
        priceReductions: 0,
        exclusiveListings: 0,
        
        // Leads
        totalLeads: 0,
        qualifiedLeads: 0,
        hotLeads: 0,
        conversionRate: 0,
        responseTime: 0,
        totalClients: 0,
        
        // Agendamentos
        appointmentsToday: 0,
        appointmentsWeek: 0,
        visitConversionRate: 0,
        showingsCompleted: 0,
        
        // Performance
        avgRating: 0,
        totalReviews: 0,
        marketShare: 0,
        clientSatisfaction: 0,
        
        // Atividade
        callsMade: 0,
        emailsSent: 0,
        proposalsSent: 0,
        contractsSigned: 0,
        
        // Marketing
        activeCampaigns: 0,
        campaignROI: 0,
        leadCost: 0,
        digitalEngagement: 0
      }

      setMetrics(emptyMetrics)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Erro ao buscar métricas:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Buscar dados inicialmente
    fetchMetrics()

    // Atualizar a cada 5 minutos (para uma pequena imobiliária, não precisa ser mais frequente)
    intervalRef.current = setInterval(fetchMetrics, 5 * 60 * 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const refreshMetrics = () => {
    setLoading(true)
    fetchMetrics()
  }

  const getMetricTrend = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100
    return {
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      percentage: Math.abs(change)
    }
  }

  const getGoalProgress = (current: number, goal: number) => {
    return Math.min(100, (current / goal) * 100)
  }

  const isMetricPositive = (metricName: string, value: number) => {
    // Define quais métricas são "boas" quando altas vs baixas
    const higherIsBetter = [
      'totalRevenue', 'monthlyRevenue', 'averageTicket', 'salesGoalProgress',
      'totalProperties', 'activeListings', 'soldThisMonth', 'exclusiveListings',
      'qualifiedLeads', 'hotLeads', 'conversionRate', 'totalClients',
      'appointmentsToday', 'visitConversionRate', 'showingsCompleted',
      'avgRating', 'clientSatisfaction', 'contractsSigned', 'campaignROI'
    ]
    
    const lowerIsBetter = ['avgDaysOnMarket', 'priceReductions', 'responseTime', 'leadCost']
    
    if (higherIsBetter.includes(metricName)) return value > 0
    if (lowerIsBetter.includes(metricName)) return value < 0
    return true // neutro
  }

  return {
    metrics,
    loading,
    lastUpdated,
    refreshMetrics,
    getMetricTrend,
    getGoalProgress,
    isMetricPositive
  }
}
