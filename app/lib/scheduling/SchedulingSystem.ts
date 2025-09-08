// Sistema de agenda e agendamentos para imobiliária
export interface Appointment {
  id: string
  type: 'viewing' | 'meeting' | 'call' | 'evaluation' | 'contract-signing'
  title: string
  description?: string
  startDateTime: Date
  endDateTime: Date
  location?: string
  propertyId?: string
  leadId?: string
  clientName: string
  clientPhone: string
  clientEmail?: string
  brokerId: string
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'
  reminders: Array<{
    type: 'email' | 'sms' | 'whatsapp'
    minutesBefore: number
    sent: boolean
  }>
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface TimeSlot {
  startTime: string // HH:MM
  endTime: string // HH:MM
  available: boolean
  brokerId?: string
}

export interface WorkingHours {
  [key: string]: TimeSlot[] // dayOfWeek: TimeSlot[]
}

export class SchedulingSystem {
  private appointments: Map<string, Appointment> = new Map()
  private brokerSchedules: Map<string, WorkingHours> = new Map()
  private nextId = 1

  /**
   * Define horário de trabalho do corretor
   */
  setBrokerWorkingHours(brokerId: string, workingHours: WorkingHours): void {
    this.brokerSchedules.set(brokerId, workingHours)
  }

  /**
   * Obtém horários disponíveis para agendamento
   */
  getAvailableSlots(
    brokerId: string, 
    date: Date, 
    durationMinutes: number = 60
  ): Array<{ startTime: string, endTime: string }> {
    const dayOfWeek = this.getDayOfWeek(date)
    const brokerSchedule = this.brokerSchedules.get(brokerId)
    
    if (!brokerSchedule || !brokerSchedule[dayOfWeek]) {
      return []
    }

    const workingSlots = brokerSchedule[dayOfWeek].filter(slot => slot.available)
    const existingAppointments = this.getBrokerAppointments(brokerId, date, date)

    const availableSlots = []

    for (const slot of workingSlots) {
      const slotStart = this.parseTime(slot.startTime)
      const slotEnd = this.parseTime(slot.endTime)
      
      // Gera slots de tempo baseado na duração
      let currentTime = slotStart
      
      while (currentTime + durationMinutes <= slotEnd) {
        const slotEndTime = currentTime + durationMinutes
        
        // Verifica se não conflita com agendamentos existentes
        const hasConflict = existingAppointments.some(appointment => {
          const appointmentStart = appointment.startDateTime.getHours() * 60 + appointment.startDateTime.getMinutes()
          const appointmentEnd = appointment.endDateTime.getHours() * 60 + appointment.endDateTime.getMinutes()
          
          return (
            (currentTime >= appointmentStart && currentTime < appointmentEnd) ||
            (slotEndTime > appointmentStart && slotEndTime <= appointmentEnd) ||
            (currentTime <= appointmentStart && slotEndTime >= appointmentEnd)
          )
        })

        if (!hasConflict) {
          availableSlots.push({
            startTime: this.formatTime(currentTime),
            endTime: this.formatTime(slotEndTime)
          })
        }

        currentTime += 30 // Incrementa de 30 em 30 minutos
      }
    }

    return availableSlots
  }

  /**
   * Agenda novo compromisso
   */
  scheduleAppointment(appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Appointment | null {
    // Verifica disponibilidade
    const isAvailable = this.isTimeSlotAvailable(
      appointmentData.brokerId,
      appointmentData.startDateTime,
      appointmentData.endDateTime
    )

    if (!isAvailable) {
      return null // Horário não disponível
    }

    const appointment: Appointment = {
      ...appointmentData,
      id: `appointment-${this.nextId++}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.appointments.set(appointment.id, appointment)
    return appointment
  }

  /**
   * Verifica se horário está disponível
   */
  private isTimeSlotAvailable(brokerId: string, startDateTime: Date, endDateTime: Date): boolean {
    const conflictingAppointments = Array.from(this.appointments.values()).filter(appointment => 
      appointment.brokerId === brokerId &&
      appointment.status !== 'cancelled' &&
      (
        (startDateTime >= appointment.startDateTime && startDateTime < appointment.endDateTime) ||
        (endDateTime > appointment.startDateTime && endDateTime <= appointment.endDateTime) ||
        (startDateTime <= appointment.startDateTime && endDateTime >= appointment.endDateTime)
      )
    )

    return conflictingAppointments.length === 0
  }

  /**
   * Atualiza status do agendamento
   */
  updateAppointmentStatus(appointmentId: string, status: Appointment['status'], notes?: string): boolean {
    const appointment = this.appointments.get(appointmentId)
    if (!appointment) return false

    appointment.status = status
    appointment.updatedAt = new Date()
    
    if (notes) {
      appointment.notes = (appointment.notes || '') + '\n' + notes
    }

    return true
  }

  /**
   * Reagenda compromisso
   */
  rescheduleAppointment(
    appointmentId: string, 
    newStartDateTime: Date, 
    newEndDateTime: Date
  ): boolean {
    const appointment = this.appointments.get(appointmentId)
    if (!appointment) return false

    // Verifica disponibilidade do novo horário
    const isAvailable = this.isTimeSlotAvailable(
      appointment.brokerId,
      newStartDateTime,
      newEndDateTime
    )

    if (!isAvailable) return false

    appointment.startDateTime = newStartDateTime
    appointment.endDateTime = newEndDateTime
    appointment.updatedAt = new Date()

    return true
  }

  /**
   * Obtém agendamentos de um corretor
   */
  getBrokerAppointments(brokerId: string, startDate: Date, endDate: Date): Appointment[] {
    return Array.from(this.appointments.values()).filter(appointment =>
      appointment.brokerId === brokerId &&
      appointment.startDateTime >= startDate &&
      appointment.startDateTime <= endDate
    ).sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime())
  }

  /**
   * Obtém agendamentos do dia
   */
  getTodayAppointments(brokerId?: string): Appointment[] {
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)

    let appointments = Array.from(this.appointments.values()).filter(appointment =>
      appointment.startDateTime >= startOfDay &&
      appointment.startDateTime <= endOfDay
    )

    if (brokerId) {
      appointments = appointments.filter(appointment => appointment.brokerId === brokerId)
    }

    return appointments.sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime())
  }

  /**
   * Obtém próximos agendamentos
   */
  getUpcomingAppointments(brokerId?: string, hours: number = 24): Appointment[] {
    const now = new Date()
    const futureTime = new Date(now.getTime() + hours * 60 * 60 * 1000)

    let appointments = Array.from(this.appointments.values()).filter(appointment =>
      appointment.startDateTime >= now &&
      appointment.startDateTime <= futureTime &&
      appointment.status === 'scheduled'
    )

    if (brokerId) {
      appointments = appointments.filter(appointment => appointment.brokerId === brokerId)
    }

    return appointments.sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime())
  }

  /**
   * Obtém agendamentos que precisam de confirmação
   */
  getAppointmentsNeedingConfirmation(): Appointment[] {
    const now = new Date()
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    return Array.from(this.appointments.values()).filter(appointment =>
      appointment.status === 'scheduled' &&
      appointment.startDateTime >= now &&
      appointment.startDateTime <= next24Hours
    )
  }

  /**
   * Marca lembrete como enviado
   */
  markReminderSent(appointmentId: string, reminderType: 'email' | 'sms' | 'whatsapp'): boolean {
    const appointment = this.appointments.get(appointmentId)
    if (!appointment) return false

    const reminder = appointment.reminders.find(r => r.type === reminderType)
    if (reminder) {
      reminder.sent = true
      appointment.updatedAt = new Date()
      return true
    }

    return false
  }

  /**
   * Obtém estatísticas de agendamentos
   */
  getAppointmentStats(brokerId?: string, startDate?: Date, endDate?: Date) {
    let appointments = Array.from(this.appointments.values())

    if (brokerId) {
      appointments = appointments.filter(a => a.brokerId === brokerId)
    }

    if (startDate && endDate) {
      appointments = appointments.filter(a => 
        a.startDateTime >= startDate && a.startDateTime <= endDate
      )
    }

    const total = appointments.length
    const byStatus = appointments.reduce((acc, appointment) => {
      acc[appointment.status] = (acc[appointment.status] || 0) + 1
      return acc
    }, {} as Record<Appointment['status'], number>)

    const byType = appointments.reduce((acc, appointment) => {
      acc[appointment.type] = (acc[appointment.type] || 0) + 1
      return acc
    }, {} as Record<Appointment['type'], number>)

    const completionRate = total > 0 
      ? ((byStatus.completed || 0) / total) * 100 
      : 0

    const noShowRate = total > 0 
      ? ((byStatus['no-show'] || 0) / total) * 100 
      : 0

    return {
      total,
      byStatus,
      byType,
      completionRate: Math.round(completionRate * 100) / 100,
      noShowRate: Math.round(noShowRate * 100) / 100
    }
  }

  /**
   * Busca agendamentos
   */
  searchAppointments(query: {
    clientName?: string
    propertyId?: string
    status?: Appointment['status'][]
    type?: Appointment['type'][]
    brokerId?: string
    dateRange?: { start: Date, end: Date }
  }): Appointment[] {
    return Array.from(this.appointments.values()).filter(appointment => {
      if (query.clientName && !appointment.clientName.toLowerCase().includes(query.clientName.toLowerCase())) {
        return false
      }

      if (query.propertyId && appointment.propertyId !== query.propertyId) {
        return false
      }

      if (query.status && !query.status.includes(appointment.status)) {
        return false
      }

      if (query.type && !query.type.includes(appointment.type)) {
        return false
      }

      if (query.brokerId && appointment.brokerId !== query.brokerId) {
        return false
      }

      if (query.dateRange) {
        if (appointment.startDateTime < query.dateRange.start || 
            appointment.startDateTime > query.dateRange.end) {
          return false
        }
      }

      return true
    })
  }

  // Métodos auxiliares
  private getDayOfWeek(date: Date): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return days[date.getDay()]
  }

  private parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number)
    return hours * 60 + minutes
  }

  private formatTime(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }
}

// Sistema de notificações para agendamentos
export class AppointmentNotifications {
  /**
   * Gera mensagem de confirmação de agendamento
   */
  static generateConfirmationMessage(appointment: Appointment): {
    whatsapp: string
    email: { subject: string, body: string }
    sms: string
  } {
    const dateStr = appointment.startDateTime.toLocaleDateString('pt-BR')
    const timeStr = appointment.startDateTime.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })

    const whatsapp = `Olá ${appointment.clientName}! ✅ Seu agendamento foi confirmado:
📅 Data: ${dateStr}
🕐 Horário: ${timeStr}
📍 Local: ${appointment.location || 'A definir'}
📋 Tipo: ${this.getAppointmentTypeText(appointment.type)}

Qualquer dúvida, entre em contato! 😊`

    const email = {
      subject: `Agendamento Confirmado - ${dateStr} às ${timeStr}`,
      body: `
        <h2>Agendamento Confirmado</h2>
        <p>Olá <strong>${appointment.clientName}</strong>,</p>
        <p>Seu agendamento foi confirmado com sucesso!</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Detalhes do Agendamento:</h3>
          <ul>
            <li><strong>Data:</strong> ${dateStr}</li>
            <li><strong>Horário:</strong> ${timeStr}</li>
            <li><strong>Tipo:</strong> ${this.getAppointmentTypeText(appointment.type)}</li>
            <li><strong>Local:</strong> ${appointment.location || 'A definir'}</li>
          </ul>
        </div>
        
        <p>Se precisar reagendar ou tiver alguma dúvida, entre em contato conosco.</p>
        <p>Aguardamos você!</p>
      `
    }

    const sms = `${appointment.clientName}, seu agendamento foi confirmado para ${dateStr} às ${timeStr}. Local: ${appointment.location || 'A definir'}. Qualquer dúvida, nos contate!`

    return { whatsapp, email, sms }
  }

  /**
   * Gera lembrete de agendamento
   */
  static generateReminderMessage(appointment: Appointment, hoursBeforeEvent: number): {
    whatsapp: string
    email: { subject: string, body: string }
    sms: string
  } {
    const dateStr = appointment.startDateTime.toLocaleDateString('pt-BR')
    const timeStr = appointment.startDateTime.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })

    const timeText = hoursBeforeEvent < 1 ? 'em alguns minutos' : 
                    hoursBeforeEvent === 1 ? 'em 1 hora' : 
                    `em ${hoursBeforeEvent} horas`

    const whatsapp = `🔔 Lembrete: ${appointment.clientName}, seu agendamento é ${timeText}!
📅 ${dateStr} às ${timeStr}
📍 ${appointment.location || 'Conforme combinado'}
📋 ${this.getAppointmentTypeText(appointment.type)}

Nos vemos em breve! 😊`

    const email = {
      subject: `Lembrete: Agendamento ${timeText}`,
      body: `
        <h2>Lembrete de Agendamento</h2>
        <p>Olá <strong>${appointment.clientName}</strong>,</p>
        <p>Este é um lembrete do seu agendamento ${timeText}.</p>
        
        <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Detalhes:</h3>
          <ul>
            <li><strong>Data:</strong> ${dateStr}</li>
            <li><strong>Horário:</strong> ${timeStr}</li>
            <li><strong>Tipo:</strong> ${this.getAppointmentTypeText(appointment.type)}</li>
            <li><strong>Local:</strong> ${appointment.location || 'Conforme combinado'}</li>
          </ul>
        </div>
        
        <p>Nos vemos em breve!</p>
      `
    }

    const sms = `Lembrete: ${appointment.clientName}, seu agendamento é ${timeText} (${dateStr} às ${timeStr}). Local: ${appointment.location || 'Conforme combinado'}.`

    return { whatsapp, email, sms }
  }

  private static getAppointmentTypeText(type: Appointment['type']): string {
    const types = {
      'viewing': 'Visita ao imóvel',
      'meeting': 'Reunião',
      'call': 'Ligação',
      'evaluation': 'Avaliação de imóvel',
      'contract-signing': 'Assinatura de contrato'
    }
    return types[type] || type
  }
}
