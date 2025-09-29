// components/dashboard/UserActivityWidget.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Clock, User, Search, Eye, Phone, AlertTriangle } from 'lucide-react'
import { useUserActivityHistory } from '@/hooks/use-user-activity'

interface ActivityRecord {
  id: string
  activity: string
  metadata: any
  created_at: string
}

interface ActivityWidgetProps {
  userId?: string
  limit?: number
  showOnlyRecent?: boolean
}

const activityIcons = {
  successful_login: User,
  page_view: Eye,
  property_view: Eye,
  search: Search,
  contact_attempt: Phone,
  error_encountered: AlertTriangle,
  login_failure: AlertTriangle
}

const activityLabels = {
  successful_login: 'Login realizado',
  page_view: 'Página visitada',
  property_view: 'Imóvel visualizado',
  search: 'Busca realizada',
  contact_attempt: 'Contato iniciado',
  error_encountered: 'Erro encontrado',
  login_failure: 'Falha no login'
}

export function UserActivityWidget({ limit = 10, showOnlyRecent = true }: ActivityWidgetProps) {
  const [activities, setActivities] = useState<ActivityRecord[]>([])
  const [loading, setLoading] = useState(true)
  const { fetchActivities } = useUserActivityHistory()

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    try {
      setLoading(true)
      const data = await fetchActivities(limit)
      setActivities(data)
    } catch (error) {
      console.error('Erro ao carregar atividades:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60)
      return `${minutes}m atrás`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h atrás`
    } else {
      const days = Math.floor(diffInHours / 24)
      return `${days}d atrás`
    }
  }

  const getActivityDescription = (activity: ActivityRecord) => {
    const baseLabel = activityLabels[activity.activity as keyof typeof activityLabels] || activity.activity
    const metadata = activity.metadata || {}

    switch (activity.activity) {
      case 'successful_login':
        return `${baseLabel} - ${metadata.provider || 'Sistema'}`
      case 'page_view':
        return `${baseLabel}: ${metadata.page || 'Página'}`
      case 'property_view':
        return `${baseLabel}: ID ${metadata.property_id || 'N/A'}`
      case 'search':
        return `${baseLabel}: "${metadata.query || 'N/A'}" (${metadata.results_count || 0} resultados)`
      case 'contact_attempt':
        return `${baseLabel} - ${metadata.contact_type || 'Contato'}`
      case 'error_encountered':
        return `${baseLabel}: ${metadata.error_type || 'Erro desconhecido'}`
      case 'login_failure':
        return `${baseLabel} - ${metadata.attempted_provider || 'Sistema'}`
      default:
        return baseLabel
    }
  }

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'successful_login':
        return 'text-green-600 bg-green-50'
      case 'login_failure':
      case 'error_encountered':
        return 'text-red-600 bg-red-50'
      case 'property_view':
        return 'text-blue-600 bg-blue-50'
      case 'contact_attempt':
        return 'text-purple-600 bg-purple-50'
      case 'search':
        return 'text-orange-600 bg-orange-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Atividade Recente</h3>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Atividade Recente</h3>
        </div>
        <span className="text-sm text-gray-500">{activities.length} atividades</span>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Nenhuma atividade registrada</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => {
            const IconComponent = activityIcons[activity.activity as keyof typeof activityIcons] || Activity
            const colorClass = getActivityColor(activity.activity)
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`p-2 rounded-full ${colorClass}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {getActivityDescription(activity)}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {formatTime(activity.created_at)}
                    </span>
                    {activity.metadata?.url && (
                      <span className="text-xs text-gray-400 truncate max-w-32">
                        {new URL(activity.metadata.url).pathname}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {activities.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <button
            onClick={loadActivities}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Atualizar atividades
          </button>
        </div>
      )}
    </div>
  )
}