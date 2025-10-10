/**
 * Sistema de Agenda Moderno com FullCalendar
 * Usando bibliotecas open source maduras
 */

'use client'

import { useState, useCallback } from 'react'
import { useCalendar } from '@/hooks/useAgendaSystem'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { toast, Toaster } from 'sonner'
import { Calendar as CalendarIcon, Bell, Plus, Settings } from 'lucide-react'
import type { EventClickArg, DateSelectArg } from '@fullcalendar/core'

export default function ModernAgendaPage() {
  const { user } = useCurrentUser()
  const [view, setView] = useState<'month' | 'week' | 'day' | 'list'>('month')

  const {
    events,
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    stats
  } = useCalendar({
    userId: user?.id || '',
    enableRealtime: true,
    autoRefresh: true
  })

  // Converter eventos para formato FullCalendar
  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.start_datetime,
    end: event.end_datetime,
    allDay: event.all_day,
    backgroundColor: getEventColor(event.event_type, event.priority),
    borderColor: getEventColor(event.event_type, event.priority),
    extendedProps: {
      description: event.description,
      location: event.location,
      type: event.event_type,
      priority: event.priority,
      status: event.status
    }
  }))

  // Handler: Criar evento ao selecionar período
  const handleDateSelect = useCallback(async (selectInfo: DateSelectArg) => {
    const title = prompt('Título do evento:')
    if (!title) return

    const calendarApi = selectInfo.view.calendar
    calendarApi.unselect() // Limpar seleção

    try {
      await createEvent({
        title,
        start_datetime: selectInfo.startStr,
        end_datetime: selectInfo.endStr,
        all_day: selectInfo.allDay,
        event_type: 'meeting',
        priority: 'medium',
        status: 'scheduled',
        user_id: user?.id || '',
        created_by: user?.id || '',
        timezone: 'America/Sao_Paulo',
        is_recurring: false,
        notification_sent: false,
        reminders: [15, 60]
      })

      toast.success('✅ Evento criado com sucesso!')
    } catch (error) {
      toast.error('❌ Erro ao criar evento')
      console.error(error)
    }
  }, [createEvent, user?.id])

  // Handler: Clicar em evento
  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
    const event = clickInfo.event
    
    if (confirm(`Deseja excluir "${event.title}"?`)) {
      deleteEvent(event.id)
      toast.success('🗑️ Evento excluído')
    }
  }, [deleteEvent])

  // Handler: Arrastar evento (reagendar)
  const handleEventDrop = useCallback(async (dropInfo: any) => {
    try {
      await updateEvent(dropInfo.event.id, {
        start_datetime: dropInfo.event.startStr,
        end_datetime: dropInfo.event.endStr
      })
      toast.success('📅 Evento reagendado')
    } catch (error) {
      toast.error('❌ Erro ao reagendar')
      dropInfo.revert() // Reverter se falhar
    }
  }, [updateEvent])

  if (!user) {
    return <div className="p-8">Carregando usuário...</div>
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <CalendarIcon className="text-blue-600" size={32} />
          <div>
            <h1 className="text-2xl font-bold">Agenda</h1>
            <p className="text-sm text-gray-600">
              {stats.today} eventos hoje • {stats.upcoming} próximos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Selector */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {(['month', 'week', 'day', 'list'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1 rounded text-sm font-medium transition ${
                  view === v
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {v === 'month' ? 'Mês' : v === 'week' ? 'Semana' : v === 'day' ? 'Dia' : 'Lista'}
              </button>
            ))}
          </div>

          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Bell size={20} className="text-gray-600" />
          </button>

          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Settings size={20} className="text-gray-600" />
          </button>
        </div>
      </header>

      {/* Calendar */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="bg-white rounded-lg shadow-sm h-full">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView={`${view === 'month' ? 'dayGrid' : view === 'week' ? 'timeGrid' : view === 'day' ? 'timeGrid' : 'list'}${view === 'month' ? 'Month' : view === 'week' ? 'Week' : view === 'day' ? 'Day' : 'Week'}`}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
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
            eventResize={handleEventDrop}
            height="100%"
            locale="pt-br"
            buttonText={{
              today: 'Hoje',
              month: 'Mês',
              week: 'Semana',
              day: 'Dia',
              list: 'Lista'
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
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
          />
        </div>
      </main>

      {/* Realtime Indicator */}
      <div className="fixed bottom-4 right-4 bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        Tempo Real
      </div>
    </div>
  )
}

// Helper: Cores por tipo de evento
function getEventColor(type: string, priority: string) {
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

  const priorityModifier = priority === 'urgent' ? '!important' : ''
  return colors[type] || '#6b7280'
}
