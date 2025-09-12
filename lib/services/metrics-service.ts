import { supabase } from '@/lib/supabase'
import { logger, debugDatabase, debugError, createTimer } from '@/lib/utils/debug'

export interface DashboardMetrics {
  // Vendas e Receita
  totalRevenue: number
  monthlyRevenue: number
  quarterlyRevenue: number
  averageTicket: number
  salesGoal: number
  salesGoalProgress: number

  // Propriedades e Inventário
  totalProperties: number
  activeListings: number
  soldThisMonth: number
  avgDaysOnMarket: number
  priceReductions: number
  exclusiveListings: number

  // Leads e Clientes
  totalLeads: number
  qualifiedLeads: number
  hotLeads: number
  conversionRate: number
  responseTime: number
  totalClients: number

  // Agendamentos e Visitas
  appointmentsToday: number
  appointmentsWeek: number
  visitConversionRate: number
  showingsCompleted: number

  // Performance e Avaliações
  avgRating: number
  totalReviews: number
  marketShare: number
  clientSatisfaction: number

  // Atividade e Produtividade
  callsMade: number
  emailsSent: number
  proposalsSent: number
  contractsSigned: number

  // Campanhas e Marketing
  activeCampaigns: number
  campaignROI: number
  leadCost: number
  digitalEngagement: number

  // Meta informações
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

class MetricsService {
  // Buscar métricas completas do dashboard
  static async getDashboardMetrics(userId?: string): Promise<DashboardMetrics> {
    const timer = createTimer('getDashboardMetrics')
    
    try {
      logger.info('Fetching dashboard metrics', { userId })
      
      const [
        revenueMetrics,
        propertyMetrics,
        leadMetrics,
        taskMetrics
      ] = await Promise.all([
        this.getRevenueMetrics(userId),
        this.getPropertyMetrics(userId),
        this.getLeadMetrics(userId),
        this.getTaskMetrics(userId)
      ])

      const metrics: DashboardMetrics = {
        ...revenueMetrics,
        ...propertyMetrics,
        ...leadMetrics,
        ...taskMetrics,
        lastUpdated: new Date().toISOString(),
        userId
      }

      logger.info('Dashboard metrics fetched successfully', { 
        userId, 
        metricsCount: Object.keys(metrics).length 
      })
      
      timer.end({ success: true, metricsCount: Object.keys(metrics).length })
      return metrics

    } catch (error) {
      debugError('Failed to fetch dashboard metrics', error, { userId })
      timer.end({ success: false, error })
      throw error
    }
  }

  // Métricas de receita e vendas
  private static async getRevenueMetrics(userId?: string) {
    const timer = createTimer('getRevenueMetrics')
    
    try {
      debugDatabase('SELECT', 'properties/sales', { operation: 'revenue_metrics', userId })

      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)

      // Buscar vendas realizadas
      const { data: sales, error: salesError } = await supabase
        .from('properties')
        .select('price, status, sold_date, created_at')
        .eq('status', 'sold')
        .not('sold_date', 'is', null)

      if (salesError) {
        debugError('Error fetching sales data', salesError)
        throw salesError
      }

      const salesData = sales || []
      const monthlySales = salesData.filter(s => new Date(s.sold_date) >= startOfMonth)
      const quarterlySales = salesData.filter(s => new Date(s.sold_date) >= startOfQuarter)

      const totalRevenue = salesData.reduce((sum, sale) => sum + (sale.price || 0), 0)
      const monthlyRevenue = monthlySales.reduce((sum, sale) => sum + (sale.price || 0), 0)
      const quarterlyRevenue = quarterlySales.reduce((sum, sale) => sum + (sale.price || 0), 0)
      const averageTicket = salesData.length > 0 ? totalRevenue / salesData.length : 0

      timer.end({ success: true })

      return {
        totalRevenue,
        monthlyRevenue,
        quarterlyRevenue,
        averageTicket,
        salesGoal: 1000000, // Meta configurável
        salesGoalProgress: (monthlyRevenue / 1000000) * 100,
        contractsSigned: salesData.length
      }
    } catch (error) {
      debugError('Failed to get revenue metrics', error)
      timer.end({ success: false, error })
      throw error
    }
  }

  // Métricas de propriedades
  private static async getPropertyMetrics(userId?: string) {
    const timer = createTimer('getPropertyMetrics')
    
    try {
      debugDatabase('SELECT', 'properties', { operation: 'property_metrics', userId })

      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      const { data: properties, error } = await supabase
        .from('properties')
        .select('id, status, price, created_at, sold_date, updated_at')

      if (error) {
        debugError('Error fetching properties data', error)
        throw error
      }

      const propertiesData = properties || []
      const activeListings = propertiesData.filter(p => p.status === 'available').length
      const soldThisMonth = propertiesData.filter(p => 
        p.status === 'sold' && 
        p.sold_date && 
        new Date(p.sold_date) >= startOfMonth
      ).length

      // Calcular dias médios no mercado
      const soldProperties = propertiesData.filter(p => p.status === 'sold' && p.sold_date)
      const avgDaysOnMarket = soldProperties.length > 0 
        ? soldProperties.reduce((sum, p) => {
            const days = Math.floor((new Date(p.sold_date).getTime() - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24))
            return sum + days
          }, 0) / soldProperties.length
        : 0

      timer.end({ success: true })

      return {
        totalProperties: propertiesData.length,
        activeListings,
        soldThisMonth,
        avgDaysOnMarket: Math.round(avgDaysOnMarket),
        priceReductions: 0, // Implementar quando houver histórico de preços
        exclusiveListings: activeListings // Assumindo todas são exclusivas por enquanto
      }
    } catch (error) {
      debugError('Failed to get property metrics', error)
      timer.end({ success: false, error })
      throw error
    }
  }

  // Métricas de leads e clientes
  private static async getLeadMetrics(userId?: string) {
    const timer = createTimer('getLeadMetrics')
    
    try {
      debugDatabase('SELECT', 'clients', { operation: 'lead_metrics', userId })

      const { data: clients, error } = await supabase
        .from('clients')
        .select('id, status, priority, created_at, source')

      if (error) {
        debugError('Error fetching clients data', error)
        throw error
      }

      const clientsData = clients || []
      const totalClients = clientsData.length
      const leads = clientsData.filter(c => c.status === 'lead')
      const qualifiedLeads = clientsData.filter(c => c.status === 'prospect')
      const hotLeads = clientsData.filter(c => c.priority === 'high')
      const closedClients = clientsData.filter(c => c.status === 'client')

      const conversionRate = leads.length > 0 
        ? (closedClients.length / leads.length) * 100 
        : 0

      timer.end({ success: true })

      return {
        totalLeads: leads.length,
        qualifiedLeads: qualifiedLeads.length,
        hotLeads: hotLeads.length,
        conversionRate,
        totalClients,
        responseTime: 24, // Implementar cálculo real
        avgRating: 4.8, // Buscar de reviews quando implementado
        totalReviews: 0, // Implementar quando houver reviews
        marketShare: 0, // Métrica complexa para implementar
        clientSatisfaction: 95 // Métrica para implementar
      }
    } catch (error) {
      debugError('Failed to get lead metrics', error)
      timer.end({ success: false, error })
      throw error
    }
  }

  // Métricas de tarefas e agendamentos
  private static async getTaskMetrics(userId?: string) {
    const timer = createTimer('getTaskMetrics')
    
    try {
      debugDatabase('SELECT', 'tasks', { operation: 'task_metrics', userId })

      const now = new Date()
      const today = now.toISOString().split('T')[0]
      const startOfWeek = new Date(now)
      startOfWeek.setDate(now.getDate() - now.getDay())

      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('id, type, status, due_date, due_time, created_at')

      if (error) {
        debugError('Error fetching tasks data', error)
        throw error
      }

      const tasksData = tasks || []
      const appointmentsToday = tasksData.filter(t => 
        ['meeting', 'showing', 'visit'].includes(t.type) &&
        t.due_date === today
      ).length

      const appointmentsWeek = tasksData.filter(t => 
        ['meeting', 'showing', 'visit'].includes(t.type) &&
        t.due_date &&
        new Date(t.due_date) >= startOfWeek
      ).length

      const showingsCompleted = tasksData.filter(t => 
        t.type === 'showing' &&
        t.status === 'completed'
      ).length

      timer.end({ success: true })

      return {
        appointmentsToday,
        appointmentsWeek,
        visitConversionRate: 0, // Implementar cálculo
        showingsCompleted,
        callsMade: tasksData.filter(t => t.type === 'call' && t.status === 'completed').length,
        emailsSent: 0, // Implementar tracking
        proposalsSent: 0, // Implementar tracking
        activeCampaigns: 0, // Implementar quando houver campanhas
        campaignROI: 0, // Implementar cálculo
        leadCost: 0, // Implementar cálculo
        digitalEngagement: 0 // Implementar métricas digitais
      }
    } catch (error) {
      debugError('Failed to get task metrics', error)
      timer.end({ success: false, error })
      throw error
    }
  }

  // Buscar leads ativos
  static async getActiveLeads(userId?: string, limit = 10): Promise<LeadActivity[]> {
    const timer = createTimer('getActiveLeads')
    
    try {
      debugDatabase('SELECT', 'clients', { operation: 'active_leads', userId, limit })

      let query = supabase
        .from('clients')
        .select('*')
        .in('status', ['lead', 'prospect'])
        .order('updated_at', { ascending: false })
        .limit(limit)

      if (userId) {
        query = query.eq('assigned_to', userId)
      }

      const { data, error } = await query

      if (error) {
        debugError('Error fetching active leads', error)
        throw error
      }

      const leads: LeadActivity[] = (data || []).map(client => ({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        type: client.priority === 'high' ? 'hot' : client.priority === 'medium' ? 'warm' : 'cold',
        property: client.property_interest,
        value: client.budget_max || client.budget_min,
        lastContact: client.last_contact,
        source: client.source,
        priority: client.priority || 'medium',
        status: client.status === 'lead' ? 'new' : 'qualified',
        created_at: client.created_at,
        updated_at: client.updated_at
      }))

      timer.end({ success: true, count: leads.length })
      return leads
    } catch (error) {
      debugError('Failed to get active leads', error)
      timer.end({ success: false, error })
      throw error
    }
  }

  // Buscar performance de propriedades
  static async getPropertyPerformance(userId?: string, limit = 5): Promise<PropertyPerformance[]> {
    const timer = createTimer('getPropertyPerformance')
    
    try {
      debugDatabase('SELECT', 'properties', { operation: 'property_performance', userId, limit })

      const { data, error } = await supabase
        .from('properties')
        .select('id, title, address, price, views, status, created_at, updated_at')
        .eq('status', 'available')
        .order('views', { ascending: false })
        .limit(limit)

      if (error) {
        debugError('Error fetching property performance', error)
        throw error
      }

      const properties: PropertyPerformance[] = (data || []).map(property => {
        const daysOnMarket = Math.floor((new Date().getTime() - new Date(property.created_at).getTime()) / (1000 * 60 * 60 * 24))
        
        return {
          id: property.id,
          address: property.address || property.title,
          price: property.price || 0,
          views: property.views || 0,
          favorites: 0, // Implementar quando houver sistema de favoritos
          shares: 0, // Implementar tracking
          inquiries: 0, // Implementar tracking
          visits: 0, // Implementar tracking
          daysOnMarket,
          priceChange: 0, // Implementar histórico de preços
          trend: 'stable', // Implementar cálculo de tendência
          created_at: property.created_at
        }
      })

      timer.end({ success: true, count: properties.length })
      return properties
    } catch (error) {
      debugError('Failed to get property performance', error)
      timer.end({ success: false, error })
      throw error
    }
  }

  // Buscar tarefas próximas
  static async getUpcomingTasks(userId?: string, limit = 10): Promise<UpcomingTask[]> {
    const timer = createTimer('getUpcomingTasks')
    
    try {
      debugDatabase('SELECT', 'tasks', { operation: 'upcoming_tasks', userId, limit })

      const now = new Date()
      const today = now.toISOString().split('T')[0]

      let query = supabase
        .from('tasks')
        .select('*')
        .not('status', 'eq', 'completed')
        .not('status', 'eq', 'cancelled')
        .gte('due_date', today)
        .order('due_date', { ascending: true })
        .order('due_time', { ascending: true })
        .limit(limit)

      if (userId) {
        query = query.eq('assigned_to', userId)
      }

      const { data, error } = await query

      if (error) {
        debugError('Error fetching upcoming tasks', error)
        throw error
      }

      const tasks: UpcomingTask[] = (data || []).map(task => ({
        id: task.id,
        title: task.title,
        type: task.type,
        due_date: task.due_date,
        due_time: task.due_time,
        priority: task.priority,
        status: task.status,
        client_name: task.client_name,
        client_phone: task.client_phone,
        property_title: task.property_title,
        description: task.description || '',
        created_at: task.created_at
      }))

      timer.end({ success: true, count: tasks.length })
      return tasks
    } catch (error) {
      debugError('Failed to get upcoming tasks', error)
      timer.end({ success: false, error })
      throw error
    }
  }
}

export { MetricsService }