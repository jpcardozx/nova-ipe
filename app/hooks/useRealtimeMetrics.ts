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
      // Em uma aplicação real, isso seria uma chamada para sua API
      // Simulando dados realistas para uma pequena imobiliária
      const mockMetrics: DashboardMetrics = {
        // Vendas e Receita (valores realistas para pequena imobiliária)
        totalRevenue: 2450000, // Receita anual acumulada
        monthlyRevenue: 185000, // Receita do mês atual
        quarterlyRevenue: 520000, // Receita do trimestre
        averageTicket: 380000, // Ticket médio
        salesGoal: 200000, // Meta mensal
        salesGoalProgress: 92.5, // 185k/200k = 92.5%
        
        // Propriedades (números realistas)
        totalProperties: 45, // Total no portfólio
        activeListings: 28, // Anúncios ativos
        soldThisMonth: 3, // Vendidos no mês
        avgDaysOnMarket: 45, // Dias médios no mercado
        priceReductions: 2, // Reduções de preço
        exclusiveListings: 18, // Exclusividades
        
        // Leads (números gerenciáveis)
        totalLeads: 67, // Total de leads ativos
        qualifiedLeads: 23, // Leads qualificados
        hotLeads: 8, // Leads quentes
        conversionRate: 12.5, // Taxa de conversão
        responseTime: 15, // Tempo de resposta em minutos
        totalClients: 156, // Base total de clientes
        
        // Agendamentos
        appointmentsToday: 4,
        appointmentsWeek: 12,
        visitConversionRate: 35.0,
        showingsCompleted: 15,
        
        // Performance
        avgRating: 4.7,
        totalReviews: 89,
        marketShare: 8.5, // Participação local
        clientSatisfaction: 92.0,
        
        // Atividade
        callsMade: 34,
        emailsSent: 78,
        proposalsSent: 6,
        contractsSigned: 3,
        
        // Marketing (números modestos)
        activeCampaigns: 2,
        campaignROI: 280,
        leadCost: 125,
        digitalEngagement: 1250
      }

      // Simular pequenas variações nos dados para parecer tempo real
      const variation = () => Math.random() * 0.1 - 0.05 // ±5%
      
      if (metrics) {
        // Atualizar apenas alguns campos que mudam frequentemente
        mockMetrics.hotLeads = Math.max(1, Math.round(mockMetrics.hotLeads * (1 + variation())))
        mockMetrics.totalLeads = Math.max(mockMetrics.hotLeads, Math.round(mockMetrics.totalLeads * (1 + variation() * 0.2)))
        mockMetrics.digitalEngagement = Math.round(mockMetrics.digitalEngagement * (1 + variation() * 0.3))
        mockMetrics.callsMade = Math.round(mockMetrics.callsMade * (1 + variation() * 0.2))
      }

      setMetrics(mockMetrics)
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
