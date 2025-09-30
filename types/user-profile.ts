// types/user-profile.ts
export interface ZohoUserData {
  email: string
  name: string
  organization: string
  provider: 'zoho_mail360'
  mode?: 'dashboard' | 'studio'
  timestamp: string
}

export interface UserProfileExtended {
  // Dados básicos do Zoho
  id: string
  email: string
  full_name: string
  organization: string
  provider: string
  
  // Dados estendidos armazenados localmente
  phone?: string
  department?: string
  position?: string
  hire_date?: string
  status: 'active' | 'inactive' | 'suspended'
  
  // Avatar e personalização
  avatar_url?: string
  theme_preference?: 'light' | 'dark' | 'auto'
  language?: 'pt-BR' | 'en-US'
  
  // Permissões e role
  role: {
    id: string
    name: string
    hierarchy_level: number
    permissions: string[]
  }
  
  // Configurações pessoais
  preferences: {
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
    }
    dashboard: {
      default_view?: string
      widgets_config?: any
    }
    calendar: {
      default_calendar?: string
      working_hours?: {
        start: string
        end: string
        days: number[]
      }
    }
  }
  
  // Métricas e dados de uso
  stats: {
    last_login: string
    login_count: number
    total_sessions: number
    avg_session_duration?: number
  }
  
  // Timestamps
  created_at: string
  updated_at: string
}

export interface UserEvent {
  id: string
  user_id: string
  type: 'reminder' | 'task' | 'meeting' | 'deadline' | 'follow_up'
  title: string
  description?: string
  
  // Timing
  scheduled_at: string
  completed_at?: string
  status: 'pending' | 'completed' | 'cancelled' | 'overdue'
  
  // Recorrência
  recurrence?: {
    type: 'daily' | 'weekly' | 'monthly' | 'yearly'
    interval: number
    until?: string
  }
  
  // Relacionamentos
  related_to?: {
    type: 'client' | 'property' | 'lead' | 'contract'
    id: string
    name: string
  }
  
  // Notificações
  notifications: {
    before_minutes: number[]
    sent: boolean[]
  }
  
  created_at: string
  updated_at: string
}

export interface UserNote {
  id: string
  user_id: string
  title: string
  content: string
  type: 'personal' | 'client' | 'property' | 'task'
  tags: string[]
  
  // Relacionamentos
  related_to?: {
    type: 'client' | 'property' | 'lead' | 'contract'
    id: string
    name: string
  }
  
  // Compartilhamento
  shared_with?: string[] // IDs de usuários
  is_private: boolean
  
  created_at: string
  updated_at: string
}