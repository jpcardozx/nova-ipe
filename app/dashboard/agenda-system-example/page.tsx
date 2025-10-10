/**
 * Exemplo de implementação do Sistema de Agenda
 * Demonstra uso dos hooks e features do sistema
 */

'use client'

import { useState } from 'react'
import { useAgendaSystem } from '@/hooks/useAgendaSystem'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import { Calendar, Clock, Bell, Plus, X, Check, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AgendaSystemExample() {
  const { user } = useCurrentUser()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const {
    calendar,
    notifications,
    loading,
    error
  } = useAgendaSystem({
    userId: user?.id || '',
    enableRealtime: true,      // ✅ Updates em tempo real
    autoRefresh: true,          // ✅ Auto refresh a cada 60s
    playSound: true,            // ✅ Som ao receber notificação
    showBrowserNotification: true // ✅ Browser notification
  })

  if (!user) {
    return <div>Carregando usuário...</div>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <p className="text-red-600">❌ Erro: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header com Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📅 Minha Agenda</h1>
            <p className="text-gray-600">Sistema completo com notificações em tempo real</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Novo Evento
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Calendar className="text-blue-600" />}
            label="Total de Eventos"
            value={calendar.stats.total}
            color="bg-blue-50"
          />
          <StatCard
            icon={<Clock className="text-green-600" />}
            label="Hoje"
            value={calendar.stats.today}
            color="bg-green-50"
          />
          <StatCard
            icon={<AlertCircle className="text-orange-600" />}
            label="Próximas 24h"
            value={calendar.stats.upcoming}
            color="bg-orange-50"
          />
          <StatCard
            icon={<Bell className="text-purple-600" />}
            label="Não lidas"
            value={notifications.unreadCount}
            color="bg-purple-50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Eventos de Hoje */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="text-blue-600" size={24} />
              Eventos de Hoje
            </h2>
            <button
              onClick={calendar.refresh}
              className="text-gray-600 hover:text-blue-600 transition"
            >
              🔄 Atualizar
            </button>
          </div>

          <AnimatePresence mode="popLayout">
            {calendar.todayEvents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 text-gray-500"
              >
                <Calendar className="mx-auto mb-4 text-gray-300" size={48} />
                <p>Nenhum evento agendado para hoje</p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {calendar.todayEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onCancel={(id, reason) => calendar.cancelEvent(id, reason)}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Próximos Eventos */}
          {calendar.upcomingEvents.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-3">Próximas 24 horas</h3>
              <div className="space-y-2">
                {calendar.upcomingEvents.map((event) => (
                  <UpcomingEventItem key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notificações */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Bell className="text-purple-600" size={24} />
              Notificações
              {notifications.unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {notifications.unreadCount}
                </span>
              )}
            </h2>
            {notifications.unreadCount > 0 && (
              <button
                onClick={notifications.markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Marcar todas
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {notifications.notifications.slice(0, 10).map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={notifications.markAsRead}
                onDelete={notifications.deleteNotification}
              />
            ))}
          </div>

          {notifications.notifications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Bell className="mx-auto mb-2 text-gray-300" size={32} />
              <p>Nenhuma notificação</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Criar Evento */}
      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onCreate={async (event) => {
            await calendar.createEvent(event)
            setShowCreateModal(false)
          }}
          userId={user.id}
        />
      )}

      {/* Realtime Indicator */}
      <div className="fixed bottom-4 right-4 bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        Tempo Real Ativo
      </div>
    </div>
  )
}

// =====================================================
// SUB-COMPONENTS
// =====================================================

function StatCard({ icon, label, value, color }: any) {
  return (
    <div className={`${color} rounded-lg p-4`}>
      <div className="flex items-center gap-3">
        <div>{icon}</div>
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}

function EventCard({ event, onCancel }: any) {
  const [showActions, setShowActions] = useState(false)

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      meeting: 'bg-blue-100 text-blue-800',
      viewing: 'bg-green-100 text-green-800',
      call: 'bg-purple-100 text-purple-800',
      reminder: 'bg-yellow-100 text-yellow-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityBadge = (priority: string) => {
    const badges: Record<string, string> = {
      urgent: '🔴',
      high: '🟠',
      medium: '🟡',
      low: '🟢'
    }
    return badges[priority] || ''
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(event.event_type)}`}>
              {event.event_type}
            </span>
            <span>{getPriorityBadge(event.priority)}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
          {event.description && (
            <p className="text-gray-600 text-sm mb-2">{event.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {new Date(event.start_datetime).toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            {event.location && (
              <span>📍 {event.location}</span>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowActions(!showActions)}
          className="text-gray-400 hover:text-gray-600"
        >
          ⋮
        </button>
      </div>

      {showActions && (
        <div className="mt-3 pt-3 border-t flex gap-2">
          <button
            onClick={() => {
              if (confirm('Deseja cancelar este evento?')) {
                onCancel(event.id, 'Cancelado pelo usuário')
              }
            }}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Cancelar Evento
          </button>
        </div>
      )}
    </motion.div>
  )
}

function UpcomingEventItem({ event }: any) {
  const minutesUntil = Math.floor((new Date(event.start_datetime).getTime() - Date.now()) / 60000)
  
  return (
    <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
      <div className="text-2xl">{getEventIcon(event.event_type)}</div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{event.title}</p>
        <p className="text-xs text-gray-500">Em {minutesUntil} minutos</p>
      </div>
    </div>
  )
}

function NotificationCard({ notification, onMarkAsRead, onDelete }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`border rounded-lg p-3 ${
        notification.is_read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
      }`}
    >
      <div className="flex items-start gap-2">
        <span className="text-xl">{notification.icon || '🔔'}</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm">{notification.title}</h4>
          {notification.message && (
            <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            {notification.action_url && (
              <a
                href={notification.action_url}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                {notification.action_label || 'Ver'}
              </a>
            )}
            {!notification.is_read && (
              <button
                onClick={() => onMarkAsRead(notification.id)}
                className="text-xs text-gray-600 hover:text-gray-800"
              >
                Marcar como lida
              </button>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(notification.id)}
          className="text-gray-400 hover:text-red-600"
        >
          <X size={14} />
        </button>
      </div>
    </motion.div>
  )
}

function CreateEventModal({ onClose, onCreate, userId }: any) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'meeting',
    priority: 'medium',
    start_datetime: '',
    end_datetime: '',
    reminders: [15, 60]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreate({
      ...formData,
      user_id: userId,
      created_by: userId,
      status: 'scheduled',
      all_day: false,
      timezone: 'America/Sao_Paulo',
      is_recurring: false,
      notification_sent: false
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
      >
        <h2 className="text-2xl font-bold mb-4">Criar Novo Evento</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select
              value={formData.event_type}
              onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="meeting">Reunião</option>
              <option value="viewing">Visita</option>
              <option value="call">Ligação</option>
              <option value="reminder">Lembrete</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Início</label>
              <input
                type="datetime-local"
                required
                value={formData.start_datetime}
                onChange={(e) => setFormData({ ...formData, start_datetime: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fim</label>
              <input
                type="datetime-local"
                required
                value={formData.end_datetime}
                onChange={(e) => setFormData({ ...formData, end_datetime: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Criar Evento
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

function getEventIcon(type: string) {
  const icons: Record<string, string> = {
    meeting: '👥',
    viewing: '🏠',
    call: '📞',
    reminder: '⏰',
    task: '✅',
    appointment: '📅',
    personal: '🙋',
    deadline: '⚠️'
  }
  return icons[type] || '📌'
}
