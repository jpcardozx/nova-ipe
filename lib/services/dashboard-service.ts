// Dashboard Service - Conectar com dados reais do Supabase
// Substitui simulações por dados reais das tabelas

import { supabase } from '@/lib/supabase'

export interface DashboardMetrics {
  totalLeads: number
  activeProperties: number
  appointmentsToday: number
  appointmentsWeek: number
  tasksOverdue: number
  completedTasksToday: number
  totalRevenue: number
  monthlyRevenue: number
  avgResponseTime: number
  lastUpdated: string
}

export interface RecentActivity {
  id: string
  type: 'lead' | 'property' | 'appointment' | 'task' | 'call'
  title: string
  description: string
  time: string
  priority?: 'high' | 'medium' | 'low'
  status?: string
  user_id?: string
}

export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  status: string
  priority?: string
  source?: string
  created_at: string
  updated_at?: string
  assigned_to?: string
}

export interface Property {
  id: string
  title: string
  price: number
  status: string
  type: string
  location?: string
  created_at: string
  updated_at?: string
  views_count?: number
}

export interface Task {
  id: string
  title: string
  description?: string
  due_date?: string
  status: string
  priority?: string
  assigned_to?: string
  created_at: string
}

export interface Appointment {
  id: string
  client_name: string
  client_phone?: string
  client_email?: string
  date: string
  time: string
  end_time?: string
  status: string
  property_title?: string
  notes?: string
  created_at: string
}

class DashboardService {
  // Buscar métricas principais do dashboard
  async getMetrics(userId: string): Promise<DashboardMetrics> {
    try {
      const today = new Date().toISOString().split('T')[0]
      const startOfWeek = new Date()
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
      const startOfMonth = new Date()
      startOfMonth.setDate(1)

      // TODO: Implementar queries quando tabelas existirem
      // Por enquanto retorna estrutura vazia até conectar com backend real
      
      /*
      // Buscar leads ativos
      const { count: totalLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')
        .eq('assigned_to', userId)

      // Buscar propriedades ativas
      const { count: activeProperties } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')
        .eq('created_by', userId)

      // Buscar agendamentos de hoje
      const { count: appointmentsToday } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('date', today)
        .in('status', ['scheduled', 'confirmed'])
        .eq('assigned_to', userId)

      // Buscar agendamentos da semana
      const { count: appointmentsWeek } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .gte('date', startOfWeek.toISOString().split('T')[0])
        .in('status', ['scheduled', 'confirmed'])
        .eq('assigned_to', userId)

      // Buscar tarefas em atraso
      const { count: tasksOverdue } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .lt('due_date', today)
        .neq('status', 'completed')
        .eq('assigned_to', userId)

      // Buscar tarefas completadas hoje
      const { count: completedTasksToday } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed')
        .gte('updated_at', today)
        .eq('assigned_to', userId)
      */

      // Estrutura temporária até conectar com backend
      return {
        totalLeads: 0,
        activeProperties: 0,
        appointmentsToday: 0,
        appointmentsWeek: 0,
        tasksOverdue: 0,
        completedTasksToday: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        avgResponseTime: 0,
        lastUpdated: new Date().toISOString()
      }
    } catch (error) {
      console.error('Erro ao buscar métricas:', error)
      throw new Error('Erro ao carregar métricas do dashboard')
    }
  }

  // Buscar atividades recentes
  async getRecentActivities(userId: string, limit = 10): Promise<RecentActivity[]> {
    try {
      // TODO: Implementar quando tabelas de audit/log existirem
      // Por enquanto retorna array vazio até conectar com backend real
      
      /*
      const { data: activities, error } = await supabase
        .from('activity_log')
        .select(`
          id,
          type,
          title,
          description,
          created_at,
          priority,
          status,
          user_id
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return activities?.map(activity => ({
        ...activity,
        time: new Date(activity.created_at).toLocaleString('pt-BR')
      })) || []
      */

      return []
    } catch (error) {
      console.error('Erro ao buscar atividades:', error)
      return []
    }
  }

  // Buscar leads ativos
  async getActiveLeads(userId: string, limit = 5): Promise<Lead[]> {
    try {
      // TODO: Implementar quando tabela leads existir
      // Por enquanto retorna array vazio até conectar com backend real
      
      /*
      const { data: leads, error } = await supabase
        .from('leads')
        .select('*')
        .eq('assigned_to', userId)
        .in('status', ['new', 'contacted', 'qualified', 'hot'])
        .order('updated_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return leads || []
      */

      return []
    } catch (error) {
      console.error('Erro ao buscar leads:', error)
      return []
    }
  }

  // Buscar propriedades ativas
  async getActiveProperties(userId: string, limit = 5): Promise<Property[]> {
    try {
      // TODO: Implementar quando tabela properties existir
      // Por enquanto retorna array vazio até conectar com backend real
      
      /*
      const { data: properties, error } = await supabase
        .from('properties')
        .select('*')
        .eq('created_by', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return properties || []
      */

      return []
    } catch (error) {
      console.error('Erro ao buscar propriedades:', error)
      return []
    }
  }

  // Buscar tarefas pendentes
  async getPendingTasks(userId: string, limit = 5): Promise<Task[]> {
    try {
      // TODO: Implementar quando tabela tasks existir
      // Por enquanto retorna array vazio até conectar com backend real
      
      /*
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to', userId)
        .neq('status', 'completed')
        .order('due_date', { ascending: true })
        .limit(limit)

      if (error) throw error
      return tasks || []
      */

      return []
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error)
      return []
    }
  }

  // Buscar próximos agendamentos
  async getUpcomingAppointments(userId: string, limit = 5): Promise<Appointment[]> {
    try {
      // TODO: Implementar quando tabela appointments existir
      // Por enquanto retorna array vazio até conectar com backend real
      
      /*
      const today = new Date().toISOString().split('T')[0]
      
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('assigned_to', userId)
        .gte('date', today)
        .in('status', ['scheduled', 'confirmed'])
        .order('date', { ascending: true })
        .order('time', { ascending: true })
        .limit(limit)

      if (error) throw error
      return appointments || []
      */

      return []
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error)
      return []
    }
  }

  // Registrar atividade no log (para auditoria)
  async logActivity(userId: string, type: string, title: string, description?: string) {
    try {
      // TODO: Implementar quando tabela activity_log existir
      
      /*
      const { error } = await supabase
        .from('activity_log')
        .insert({
          user_id: userId,
          type,
          title,
          description,
          created_at: new Date().toISOString()
        })

      if (error) throw error
      */

      console.log('Activity logged:', { userId, type, title, description })
    } catch (error) {
      console.error('Erro ao registrar atividade:', error)
    }
  }

  // Buscar dados completos do dashboard
  async getDashboardData(userId: string) {
    try {
      const [metrics, activities, leads, properties, tasks, appointments] = await Promise.all([
        this.getMetrics(userId),
        this.getRecentActivities(userId),
        this.getActiveLeads(userId),
        this.getActiveProperties(userId),
        this.getPendingTasks(userId),
        this.getUpcomingAppointments(userId)
      ])

      return {
        metrics,
        activities,
        leads,
        properties,
        tasks,
        appointments,
        lastUpdated: new Date().toISOString()
      }
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error)
      throw error
    }
  }
}

// Instância singleton
export const dashboardService = new DashboardService()
export default dashboardService