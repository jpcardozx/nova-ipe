'use client'

import { useState, useEffect } from 'react'

// Tipos básicos para fazer funcionar
export interface DashboardMetrics {
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
  lastUpdated: string
  userId?: string
}

export interface LeadActivity {
  id: string
  name: string
  email?: string
  phone?: string
  type: 'hot' | 'warm' | 'cold'
  property?: string
  value?: number
  lastContact?: string
  source?: string
  priority: 'high' | 'medium' | 'low'
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation'
  created_at: string
  updated_at: string
}

export interface PropertyPerformance {
  id: string
  address: string
  price: number
  views: number
  favorites: number
  shares: number
  inquiries: number
  visits: number
  daysOnMarket: number
  priceChange: number
  trend: 'up' | 'down' | 'stable'
  created_at: string
}

export interface UpcomingTask {
  id: string
  title: string
  type: 'call' | 'meeting' | 'document' | 'follow_up' | 'showing' | 'visit' | 'other'
  due_date?: string
  due_time?: string
  priority: 'high' | 'medium' | 'low' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue'
  client_name?: string
  client_phone?: string
  property_title?: string
  description: string
  created_at: string
}

// Hook simplificado temporário
export function useRealtimeMetrics(options = {}) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [leads, setLeads] = useState<LeadActivity[]>([])
  const [properties, setProperties] = useState<PropertyPerformance[]>([])
  const [tasks, setTasks] = useState<UpcomingTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Dados mock temporários para fazer funcionar
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      setMetrics({
        totalRevenue: 0,
        monthlyRevenue: 0,
        quarterlyRevenue: 0,
        averageTicket: 0,
        salesGoal: 100000,
        salesGoalProgress: 0,
        totalProperties: 0,
        activeListings: 0,
        soldThisMonth: 0,
        avgDaysOnMarket: 0,
        priceReductions: 0,
        exclusiveListings: 0,
        totalLeads: 0,
        qualifiedLeads: 0,
        hotLeads: 0,
        conversionRate: 0,
        responseTime: 0,
        totalClients: 0,
        appointmentsToday: 0,
        appointmentsWeek: 0,
        visitConversionRate: 0,
        showingsCompleted: 0,
        avgRating: 0,
        totalReviews: 0,
        marketShare: 0,
        clientSatisfaction: 0,
        callsMade: 0,
        emailsSent: 0,
        proposalsSent: 0,
        contractsSigned: 0,
        activeCampaigns: 0,
        campaignROI: 0,
        leadCost: 0,
        digitalEngagement: 0,
        lastUpdated: new Date().toISOString()
      })
      
      setLeads([])
      setProperties([])
      setTasks([])
      setLastUpdated(new Date())
      setLoading(false)
    }
    
    loadData()
  }, [])

  const refreshAll = async () => {
    console.log('Refreshing all metrics...')
    setLastUpdated(new Date())
  }

  return {
    metrics,
    leads,
    properties,
    tasks,
    loading,
    error,
    lastUpdated,
    refreshAll
  }
}