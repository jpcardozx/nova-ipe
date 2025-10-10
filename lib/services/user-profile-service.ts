// lib/services/user-profile-service.ts
import { supabase } from '@/lib/supabase'
import { UserProfileExtended, UserEvent, UserNote } from '@/types/user-profile'

export interface SupabaseUserData {
  email: string
  full_name?: string
  organization?: string
  provider?: string
}

export class UserProfileService {
  
  /**
   * Sincroniza usuário do Supabase com perfil local estendido
   */
  static async syncUser(userData: SupabaseUserData): Promise<UserProfileExtended | null> {
    try {
      console.log('🔄 Sincronizando usuário no Supabase:', userData.email)
      
      // Verificar se usuário já existe
      const { data: existingUser, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', userData.email)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError
      }

      const now = new Date().toISOString()

      if (existingUser) {
        // Atualizar usuário existente
        const updatedStats = {
          ...existingUser.stats,
          last_login: now,
          login_count: (existingUser.stats?.login_count || 0) + 1
        }

        const { data, error } = await supabase
          .from('user_profiles')
          .update({
            full_name: userData.full_name,
            organization: userData.organization,
            stats: updatedStats,
            updated_at: now
          })
          .eq('email', userData.email)
          .select()
          .single()

        if (error) throw error
        
        console.log('✅ Usuário atualizado no Supabase:', data.email)
        return data
      } else {
        // Criar novo usuário
        const newUser: Partial<UserProfileExtended> = {
          email: userData.email,
          full_name: userData.full_name,
          organization: userData.organization,
          provider: userData.provider || 'supabase',
          status: 'active',
          role: {
            id: 'user',
            name: 'Usuário',
            hierarchy_level: 1,
            permissions: ['dashboard.read', 'profile.edit']
          },
          preferences: {
            notifications: {
              email: true,
              push: true,
              sms: false
            },
            dashboard: {
              default_view: 'overview'
            },
            calendar: {
              working_hours: {
                start: '09:00',
                end: '18:00',
                days: [1, 2, 3, 4, 5] // Segunda a sexta
              }
            }
          },
          stats: {
            last_login: now,
            login_count: 1,
            total_sessions: 1
          },
          created_at: now,
          updated_at: now
        }

        const { data, error } = await supabase
          .from('user_profiles')
          .insert([newUser])
          .select()
          .single()

        if (error) throw error
        
        console.log('✅ Novo usuário criado no Supabase:', data.email)
        return data
      }
    } catch (error) {
      console.error('❌ Erro ao sincronizar usuário no Supabase:', error)
      
      // Em caso de erro de conectividade, não bloquear o login
      // O usuário ainda pode acessar o sistema mesmo sem sincronização
      console.warn('⚠️ Continuando sem sincronização Supabase devido a erro de conectividade')
      return null
    }
  }

  /**
   * Obter perfil completo do usuário
   */
  static async getUserProfile(email: string): Promise<UserProfileExtended | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', email)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      return data || null
    } catch (error) {
      console.error('❌ Erro ao buscar perfil do usuário:', error)
      return null
    }
  }

  /**
   * Atualizar perfil do usuário
   */
  static async updateUserProfile(email: string, updates: Partial<UserProfileExtended>): Promise<UserProfileExtended> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('email', email)
        .select()
        .single()

      if (error) throw error
      
      console.log('✅ Perfil atualizado:', data.email)
      return data
    } catch (error) {
      console.error('❌ Erro ao atualizar perfil:', error)
      throw error
    }
  }

  /**
   * Criar evento/lembrete para usuário
   */
  static async createUserEvent(userId: string, event: Omit<UserEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<UserEvent> {
    try {
      const now = new Date().toISOString()
      const eventData = {
        ...event,
        user_id: userId,
        created_at: now,
        updated_at: now
      }

      const { data, error } = await supabase
        .from('user_events')
        .insert([eventData])
        .select()
        .single()

      if (error) throw error
      
      console.log('✅ Evento criado:', data.title)
      return data
    } catch (error) {
      console.error('❌ Erro ao criar evento:', error)
      throw error
    }
  }

  /**
   * Obter eventos do usuário
   */
  static async getUserEvents(
    userId: string, 
    filters?: {
      type?: UserEvent['type']
      status?: UserEvent['status']
      from_date?: string
      to_date?: string
      limit?: number
    }
  ): Promise<UserEvent[]> {
    try {
      let query = supabase
        .from('user_events')
        .select('*')
        .eq('user_id', userId)
        .order('scheduled_at', { ascending: true })

      if (filters?.type) {
        query = query.eq('type', filters.type)
      }
      
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      
      if (filters?.from_date) {
        query = query.gte('scheduled_at', filters.from_date)
      }
      
      if (filters?.to_date) {
        query = query.lte('scheduled_at', filters.to_date)
      }
      
      if (filters?.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query

      if (error) throw error
      
      return data || []
    } catch (error) {
      console.error('❌ Erro ao buscar eventos:', error)
      return []
    }
  }

  /**
   * Criar nota do usuário
   */
  static async createUserNote(userId: string, note: Omit<UserNote, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<UserNote> {
    try {
      const now = new Date().toISOString()
      const noteData = {
        ...note,
        user_id: userId,
        created_at: now,
        updated_at: now
      }

      const { data, error } = await supabase
        .from('user_notes')
        .insert([noteData])
        .select()
        .single()

      if (error) throw error
      
      console.log('✅ Nota criada:', data.title)
      return data
    } catch (error) {
      console.error('❌ Erro ao criar nota:', error)
      throw error
    }
  }

  /**
   * Obter notas do usuário
   */
  static async getUserNotes(
    userId: string,
    filters?: {
      type?: UserNote['type']
      tags?: string[]
      search?: string
      limit?: number
    }
  ): Promise<UserNote[]> {
    try {
      let query = supabase
        .from('user_notes')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (filters?.type) {
        query = query.eq('type', filters.type)
      }
      
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`)
      }
      
      if (filters?.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query

      if (error) throw error
      
      return data || []
    } catch (error) {
      console.error('❌ Erro ao buscar notas:', error)
      return []
    }
  }

  /**
   * Registrar atividade do usuário
   */
  static async logUserActivity(userId: string, activity: {
    action: string
    details?: any
    ip_address?: string
    user_agent?: string
  }): Promise<void> {
    try {
      await supabase
        .from('user_activity_log')
        .insert([{
          user_id: userId,
          action: activity.action,
          details: activity.details,
          ip_address: activity.ip_address,
          user_agent: activity.user_agent,
          created_at: new Date().toISOString()
        }])
    } catch (error) {
      console.error('❌ Erro ao registrar atividade:', error)
      // Não fazer throw aqui para não quebrar o fluxo principal
    }
  }
}