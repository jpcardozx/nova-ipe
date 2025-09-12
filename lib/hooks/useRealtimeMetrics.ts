'use client'

import { useState, useEffect, useCallback } from 'react'
import { DashboardMetrics, LeadActivity, PropertyPerformance, UpcomingTask, MetricsService } from '@/lib/services/metrics-service'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import { logger, debugError, createTimer } from '@/lib/utils/debug'

interface UseRealtimeMetricsReturn {
  metrics: DashboardMetrics | null
  leads: LeadActivity[]
  properties: PropertyPerformance[]
  tasks: UpcomingTask[]
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  refreshMetrics: () => Promise<void>
  refreshLeads: () => Promise<void>
  refreshProperties: () => Promise<void>
  refreshTasks: () => Promise<void>
  refreshAll: () => Promise<void>
}

interface UseRealtimeMetricsOptions {
  autoRefresh?: boolean
  refreshInterval?: number // em milissegundos
  enableRealtime?: boolean
}

export function useRealtimeMetrics(options: UseRealtimeMetricsOptions = {}): UseRealtimeMetricsReturn {
  const {
    autoRefresh = true,
    refreshInterval = 30000, // 30 segundos
    enableRealtime = false // Por enquanto false, implementar websockets depois
  } = options

  const { user, isAuthenticated } = useCurrentUser()
  
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [leads, setLeads] = useState<LeadActivity[]>([])
  const [properties, setProperties] = useState<PropertyPerformance[]>([])
  const [tasks, setTasks] = useState<UpcomingTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Função para buscar métricas
  const refreshMetrics = useCallback(async () => {
    if (!isAuthenticated) return

    const timer = createTimer('refreshMetrics')
    
    try {
      logger.info('Refreshing dashboard metrics', { userId: user?.id })
      
      const metricsData = await MetricsService.getDashboardMetrics(user?.id)
      setMetrics(metricsData)
      setError(null)
      
      logger.info('Dashboard metrics refreshed successfully', { userId: user?.id })
      timer.end({ success: true })
    } catch (err) {
      const errorMessage = 'Erro ao carregar métricas do dashboard'
      debugError('Failed to refresh metrics', err, { userId: user?.id })
      setError(errorMessage)
      timer.end({ success: false, error: err })
    }
  }, [isAuthenticated, user?.id])

  // Função para buscar leads
  const refreshLeads = useCallback(async () => {
    if (!isAuthenticated) return

    const timer = createTimer('refreshLeads')
    
    try {
      logger.debug('Refreshing active leads', { userId: user?.id })
      
      const leadsData = await MetricsService.getActiveLeads(user?.id)
      setLeads(leadsData)
      
      timer.end({ success: true, count: leadsData.length })
    } catch (err) {
      debugError('Failed to refresh leads', err, { userId: user?.id })
      timer.end({ success: false, error: err })
      // Não atualizar error state para leads, apenas log
    }
  }, [isAuthenticated, user?.id])

  // Função para buscar propriedades
  const refreshProperties = useCallback(async () => {
    if (!isAuthenticated) return

    const timer = createTimer('refreshProperties')
    
    try {
      logger.debug('Refreshing property performance', { userId: user?.id })
      
      const propertiesData = await MetricsService.getPropertyPerformance(user?.id)
      setProperties(propertiesData)
      
      timer.end({ success: true, count: propertiesData.length })
    } catch (err) {
      debugError('Failed to refresh properties', err, { userId: user?.id })
      timer.end({ success: false, error: err })
    }
  }, [isAuthenticated, user?.id])

  // Função para buscar tarefas
  const refreshTasks = useCallback(async () => {
    if (!isAuthenticated) return

    const timer = createTimer('refreshTasks')
    
    try {
      logger.debug('Refreshing upcoming tasks', { userId: user?.id })
      
      const tasksData = await MetricsService.getUpcomingTasks(user?.id)
      setTasks(tasksData)
      
      timer.end({ success: true, count: tasksData.length })
    } catch (err) {
      debugError('Failed to refresh tasks', err, { userId: user?.id })
      timer.end({ success: false, error: err })
    }
  }, [isAuthenticated, user?.id])

  // Função para refresh completo
  const refreshAll = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    const timer = createTimer('refreshAll')
    setLoading(true)
    
    try {
      logger.info('Starting complete refresh of dashboard data', { userId: user?.id })
      
      // Executar todos os refreshes em paralelo
      await Promise.all([
        refreshMetrics(),
        refreshLeads(),
        refreshProperties(),
        refreshTasks()
      ])
      
      setLastUpdated(new Date())
      setError(null)
      
      logger.info('Complete dashboard refresh completed successfully', { userId: user?.id })
      timer.end({ success: true })
    } catch (err) {
      const errorMessage = 'Erro ao atualizar dados do dashboard'
      debugError('Failed to refresh all dashboard data', err, { userId: user?.id })
      setError(errorMessage)
      timer.end({ success: false, error: err })
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, user?.id, refreshMetrics, refreshLeads, refreshProperties, refreshTasks])

  // Effect para carregar dados iniciais
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      logger.info('Initializing realtime metrics', { userId: user.id, autoRefresh })
      refreshAll()
    } else if (!isAuthenticated) {
      // Limpar dados quando não autenticado
      setMetrics(null)
      setLeads([])
      setProperties([])
      setTasks([])
      setLoading(false)
      setError(null)
      setLastUpdated(null)
    }
  }, [isAuthenticated, user?.id, refreshAll])

  // Effect para auto-refresh
  useEffect(() => {
    if (!autoRefresh || !isAuthenticated) return

    logger.debug('Setting up auto-refresh', { 
      userId: user?.id, 
      interval: refreshInterval 
    })

    const interval = setInterval(() => {
      logger.debug('Auto-refreshing metrics')
      refreshAll()
    }, refreshInterval)

    return () => {
      logger.debug('Clearing auto-refresh interval')
      clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval, isAuthenticated, refreshAll, user?.id])

  // TODO: Implementar realtime updates via websockets/supabase realtime
  useEffect(() => {
    if (!enableRealtime || !isAuthenticated) return

    logger.info('Setting up realtime subscriptions', { userId: user?.id })
    
    // Implementar subscriptions do Supabase para updates em tempo real
    // const subscription = supabase
    //   .channel('dashboard_updates')
    //   .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, refreshLeads)
    //   .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, refreshProperties)
    //   .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, refreshTasks)
    //   .subscribe()

    // return () => {
    //   logger.info('Unsubscribing from realtime updates')
    //   subscription.unsubscribe()
    // }
  }, [enableRealtime, isAuthenticated, user?.id])

  return {
    metrics,
    leads,
    properties,
    tasks,
    loading,
    error,
    lastUpdated,
    refreshMetrics,
    refreshLeads,
    refreshProperties,
    refreshTasks,
    refreshAll
  }
}