/**
 * Componente de Calendário Compacto
 * Usando react-day-picker (usado por shadcn/ui)
 */

'use client'

import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { useCalendar } from '@/hooks/useAgendaSystem'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import { format, startOfDay, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react'
import 'react-day-picker/dist/style.css'

export default function CompactCalendar() {
  const { user } = useCurrentUser()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const {
    events,
    loading,
    stats
  } = useCalendar({
    userId: user?.id || '',
    enableRealtime: true
  })

  // Dates que têm eventos
  const datesWithEvents = events.map(e => startOfDay(new Date(e.start_datetime)))

  // Eventos do dia selecionado
  const selectedDayEvents = events.filter(e =>
    isSameDay(new Date(e.start_datetime), selectedDate)
  )

  // Custom day renderer - adiciona indicador de evento
  const modifiers = {
    hasEvent: datesWithEvents
  }

  const modifiersStyles = {
    hasEvent: {
      fontWeight: 'bold',
      position: 'relative' as const,
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '2px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '4px',
        height: '4px',
        borderRadius: '50%',
        backgroundColor: '#3b82f6'
      }
    }
  }

  if (!user) return null

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Stats Summary */}
      <div className="mb-4 grid grid-cols-3 gap-2 text-center">
        <div className="bg-blue-50 rounded p-2">
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          <p className="text-xs text-gray-600">Total</p>
        </div>
        <div className="bg-green-50 rounded p-2">
          <p className="text-2xl font-bold text-green-600">{stats.today}</p>
          <p className="text-xs text-gray-600">Hoje</p>
        </div>
        <div className="bg-orange-50 rounded p-2">
          <p className="text-2xl font-bold text-orange-600">{stats.upcoming}</p>
          <p className="text-xs text-gray-600">Próximos</p>
        </div>
      </div>

      {/* Calendar Picker */}
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && setSelectedDate(date)}
        locale={ptBR}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        className="rdp-custom"
        showOutsideDays
        fixedWeeks
      />

      {/* Selected Day Events */}
      <div className="mt-4 border-t pt-4">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <CalendarIcon size={16} className="text-blue-600" />
          {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
        </h3>

        {loading ? (
          <div className="text-sm text-gray-500">Carregando...</div>
        ) : selectedDayEvents.length === 0 ? (
          <div className="text-sm text-gray-500 py-4 text-center">
            Nenhum evento agendado
          </div>
        ) : (
          <div className="space-y-2">
            {selectedDayEvents.map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        .rdp-custom {
          --rdp-cell-size: 38px;
          --rdp-accent-color: #3b82f6;
          --rdp-background-color: #eff6ff;
          font-size: 14px;
        }

        .rdp-day_selected {
          background-color: var(--rdp-accent-color);
          color: white;
          font-weight: bold;
        }

        .rdp-day_today {
          font-weight: bold;
          border: 2px solid var(--rdp-accent-color);
        }

        .rdp-day:has(.rdp-day_button[data-has-event='true'])::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: #3b82f6;
        }
      `}</style>
    </div>
  )
}

function EventItem({ event }: { event: any }) {
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      meeting: 'bg-blue-100 text-blue-800',
      viewing: 'bg-green-100 text-green-800',
      call: 'bg-purple-100 text-purple-800',
      task: 'bg-orange-100 text-orange-800',
      reminder: 'bg-red-100 text-red-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityEmoji = (priority: string) => {
    const emojis: Record<string, string> = {
      urgent: '🔴',
      high: '🟠',
      medium: '🟡',
      low: '🟢'
    }
    return emojis[priority] || ''
  }

  return (
    <div className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition">
      <div className="flex items-start gap-2 mb-1">
        <span>{getPriorityEmoji(event.priority)}</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{event.title}</h4>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {format(new Date(event.start_datetime), 'HH:mm')}
            </span>
            {event.location && (
              <span className="flex items-center gap-1 truncate">
                <MapPin size={12} />
                {event.location}
              </span>
            )}
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(event.event_type)}`}>
          {event.event_type}
        </span>
      </div>
    </div>
  )
}
