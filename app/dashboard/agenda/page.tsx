'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar as CalendarIcon, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Plus,
  Filter,
  ListTodo,
  CalendarDays,
  X,
  User,
  Trash
} from 'lucide-react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { toast, Toaster } from 'sonner'
import { format, startOfDay, endOfDay, isToday, isFuture, isPast } from 'date-fns'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser-simple'
import { CalendarService } from '@/lib/services/calendar-notifications'
import type { CalendarEvent } from '@/lib/services/calendar-notifications'
import type { EventClickArg, DateSelectArg, EventDropArg } from '@fullcalendar/core'

export default function AgendaPage() {
  const { user } = useCurrentUser()
  const [view, setView] = useState<'calendar' | 'tasks'>('calendar')
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day' | 'list'>('month')
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [filters, setFilters] = useState({
    eventType: 'all',
    priority: 'all',
    status: 'all'
  })
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    upcoming: 0,
    overdue: 0,
    completed: 0
  })

  const loadEvents = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const filterParams: any = { user_id: user.id }
      if (filters.eventType !== 'all') filterParams.event_type = filters.eventType
      if (filters.status !== 'all') filterParams.status = filters.status

      const { data, error } = await CalendarService.getEvents(filterParams)
      if (error) throw error
      setEvents(data || [])
      
      const today = startOfDay(new Date())
      const todayEnd = endOfDay(new Date())
      
      const todayCount = data?.filter(e => {
        const eventDate = new Date(e.start_datetime)
        return eventDate >= today && eventDate <= todayEnd
      }).length || 0

      const upcomingCount = data?.filter(e => isFuture(new Date(e.start_datetime)) && !isToday(new Date(e.start_datetime))).length || 0
      const overdueCount = data?.filter(e => isPast(new Date(e.end_datetime)) && e.status === 'scheduled').length || 0
      const completedCount = data?.filter(e => e.status === 'completed').length || 0

      setStats({
        total: data?.length || 0,
        today: todayCount,
        upcoming: upcomingCount,
        overdue: overdueCount,
        completed: completedCount
      })
    } catch (error) {
      console.error('Error loading events:', error)
      toast.error('Erro ao carregar eventos')
    } finally {
      setLoading(false)
    }
  }, [user, filters])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
    setSelectedDate(new Date(selectInfo.startStr))
    setSelectedEvent(null)
    setShowCreateModal(true)
  }, [])

  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
    const event = events.find(e => e.id === clickInfo.event.id)
    if (event) {
      setSelectedEvent(event)
      setShowCreateModal(true)
    }
  }, [events])

  const handleEventDrop = useCallback(async (dropInfo: EventDropArg) => {
    try {
      const { error } = await CalendarService.updateEvent(dropInfo.event.id, {
        start_datetime: dropInfo.event.startStr,
        end_datetime: dropInfo.event.endStr
      })
      if (error) throw error
      toast.success('📅 Evento reagendado')
      loadEvents()
    } catch (error) {
      console.error('Error updating event:', error)
      toast.error('Erro ao reagendar')
      dropInfo.revert()
    }
  }, [loadEvents])

  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.start_datetime,
    end: event.end_datetime,
    allDay: event.all_day,
    backgroundColor: getEventColor(event.event_type, event.priority),
    borderColor: getEventColor(event.event_type, event.priority),
    extendedProps: event
  }))

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <CalendarIcon className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Toaster position="top-right" richColors />

      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agenda & Tarefas</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Clock size={16} />
                {stats.today} hoje
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays size={16} />
                {stats.upcoming} próximos
              </span>
              {stats.overdue > 0 && (
                <span className="flex items-center gap-1 text-red-600">
                  <AlertTriangle size={16} />
                  {stats.overdue} atrasados
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setView('calendar')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                  view === 'calendar'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <CalendarIcon size={16} className="inline mr-1" />
                Calendário
              </button>
              <button
                onClick={() => setView('tasks')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                  view === 'tasks'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ListTodo size={16} className="inline mr-1" />
                Tarefas
              </button>
            </div>

            {view === 'calendar' && (
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                {(['month', 'week', 'day', 'list'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setCalendarView(v)}
                    className={`px-2 py-1 rounded text-xs font-medium transition ${
                      calendarView === v
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {v === 'month' ? 'Mês' : v === 'week' ? 'Semana' : v === 'day' ? 'Dia' : 'Lista'}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => {
                setSelectedEvent(null)
                setSelectedDate(new Date())
                setShowCreateModal(true)
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={18} />
              Novo {view === 'calendar' ? 'Evento' : 'Tarefa'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <Filter size={16} className="text-gray-400" />
          <select
            value={filters.eventType}
            onChange={(e) => setFilters({ ...filters, eventType: e.target.value })}
            className="text-sm border rounded px-3 py-1.5"
          >
            <option value="all">Todos os tipos</option>
            <option value="meeting">Reuniões</option>
            <option value="viewing">Visitas</option>
            <option value="call">Ligações</option>
            <option value="task">Tarefas</option>
            <option value="reminder">Lembretes</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="text-sm border rounded px-3 py-1.5"
          >
            <option value="all">Todas prioridades</option>
            <option value="urgent">🔴 Urgente</option>
            <option value="high">🟠 Alta</option>
            <option value="medium">🟡 Média</option>
            <option value="low">🟢 Baixa</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="text-sm border rounded px-3 py-1.5"
          >
            <option value="all">Todos status</option>
            <option value="scheduled">Agendado</option>
            <option value="confirmed">Confirmado</option>
            <option value="completed">Concluído</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        {view === 'calendar' ? (
          <div className="bg-white rounded-lg shadow-sm h-full p-4">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: ''
              }}
              events={calendarEvents}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              select={handleDateSelect}
              eventClick={handleEventClick}
              eventDrop={handleEventDrop}
              height="100%"
              locale="pt-br"
              buttonText={{
                today: 'Hoje'
              }}
              slotMinTime="07:00:00"
              slotMaxTime="22:00:00"
              allDaySlot={true}
              nowIndicator={true}
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }}
            />
          </div>
        ) : (
          <p className="text-center py-12 text-gray-500">Vista de tarefas será implementada</p>
        )}
      </main>

      {showCreateModal && (
        <EventModal
          event={selectedEvent}
          initialDate={selectedDate}
          onClose={() => {
            setShowCreateModal(false)
            setSelectedEvent(null)
            setSelectedDate(null)
          }}
          onSave={() => {
            loadEvents()
            setShowCreateModal(false)
            setSelectedEvent(null)
          }}
          userId={user.id}
        />
      )}

      <div className="fixed bottom-4 right-4 bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        Sistema Ativo
      </div>
    </div>
  )
}

function EventModal({ event, initialDate, onClose, onSave, userId }: {
  event: CalendarEvent | null
  initialDate: Date | null
  onClose: () => void
  onSave: () => void
  userId: string
}) {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    event_type: event?.event_type || 'meeting',
    priority: event?.priority || 'medium',
    status: event?.status || 'scheduled',
    start_datetime: event?.start_datetime || (initialDate ? format(initialDate, "yyyy-MM-dd'T'HH:mm") : ''),
    end_datetime: event?.end_datetime || (initialDate ? format(new Date(initialDate.getTime() + 3600000), "yyyy-MM-dd'T'HH:mm") : ''),
    location: event?.location || '',
    all_day: event?.all_day || false,
    reminders: event?.reminders || [15, 60]
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (event) {
        await CalendarService.updateEvent(event.id, formData)
        toast.success('✅ Evento atualizado!')
      } else {
        await CalendarService.createEvent({
          ...formData,
          user_id: userId,
          created_by: userId,
          timezone: 'America/Sao_Paulo',
          is_recurring: false,
          notification_sent: false
        })
        toast.success('✅ Evento criado!')
      }
      onSave()
    } catch (error) {
      console.error('Error saving event:', error)
      toast.error('Erro ao salvar evento')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {event ? 'Editar Evento' : 'Novo Evento'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Título *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Ex: Reunião com cliente"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 h-24 resize-none"
                placeholder="Detalhes do evento..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <select
                  value={formData.event_type}
                  onChange={(e) => setFormData({ ...formData, event_type: e.target.value as any })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="meeting">👥 Reunião</option>
                  <option value="viewing">🏠 Visita</option>
                  <option value="call">📞 Ligação</option>
                  <option value="task">✅ Tarefa</option>
                  <option value="reminder">⏰ Lembrete</option>
                  <option value="appointment">📅 Compromisso</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Prioridade</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="low">🟢 Baixa</option>
                  <option value="medium">🟡 Média</option>
                  <option value="high">🟠 Alta</option>
                  <option value="urgent">🔴 Urgente</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Início *</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.start_datetime}
                  onChange={(e) => setFormData({ ...formData, start_datetime: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Fim *</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.end_datetime}
                  onChange={(e) => setFormData({ ...formData, end_datetime: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Local</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Ex: Escritório, Zoom, etc"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="all-day"
                checked={formData.all_day}
                onChange={(e) => setFormData({ ...formData, all_day: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="all-day" className="text-sm">Dia inteiro</label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {saving ? 'Salvando...' : event ? 'Atualizar' : 'Criar Evento'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

function getEventColor(type: string, priority: string): string {
  if (priority === 'urgent') return '#dc2626'
  const colors: Record<string, string> = {
    meeting: '#3b82f6',
    viewing: '#10b981',
    call: '#8b5cf6',
    task: '#f59e0b',
    reminder: '#ef4444',
    appointment: '#06b6d4',
    personal: '#ec4899',
    deadline: '#dc2626'
  }
  return colors[type] || '#6b7280'
}
