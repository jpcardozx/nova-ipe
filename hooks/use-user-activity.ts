// hooks/use-user-activity.ts
import { useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface ActivityMetadata {
  [key: string]: any
}

export function useUserActivity() {
  const logActivity = useCallback(async (
    activity: string, 
    metadata: ActivityMetadata = {}
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.warn('⚠️ Tentativa de log sem usuário autenticado')
        return
      }

      // Adicionar informações de contexto
      const enrichedMetadata = {
        ...metadata,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : '',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
      }

      console.log('📊 Registrando atividade:', activity, enrichedMetadata)

      const { error } = await supabase
        .from('user_activities')
        .insert([{
          user_id: user.id,
          activity,
          metadata: enrichedMetadata
        }])

      if (error) {
        console.error('❌ Erro ao registrar atividade:', error)
      }
    } catch (error) {
      console.error('❌ Erro crítico ao registrar atividade:', error)
    }
  }, [])

  const logPageView = useCallback((pageName: string, additionalData?: ActivityMetadata) => {
    logActivity('page_view', { 
      page: pageName,
      ...additionalData 
    })
  }, [logActivity])

  const logPropertyView = useCallback((propertyId: string, propertyData?: ActivityMetadata) => {
    logActivity('property_view', { 
      property_id: propertyId,
      ...propertyData 
    })
  }, [logActivity])

  const logSearch = useCallback((searchQuery: string, filters?: ActivityMetadata) => {
    logActivity('search', { 
      query: searchQuery,
      filters,
      results_count: filters?.results_count || 0
    })
  }, [logActivity])

  const logContact = useCallback((contactType: string, targetData?: ActivityMetadata) => {
    logActivity('contact_attempt', { 
      contact_type: contactType,
      ...targetData 
    })
  }, [logActivity])

  const logError = useCallback((errorType: string, errorData?: ActivityMetadata) => {
    logActivity('error_encountered', { 
      error_type: errorType,
      ...errorData 
    })
  }, [logActivity])

  return {
    logActivity,
    logPageView,
    logPropertyView,
    logSearch,
    logContact,
    logError
  }
}

// Hook para obter atividades do usuário atual
export function useUserActivityHistory() {
  const fetchActivities = useCallback(async (limit = 50) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return []
      }

      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('❌ Erro ao buscar atividades:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('❌ Erro crítico ao buscar atividades:', error)
      return []
    }
  }, [])

  return { fetchActivities }
}