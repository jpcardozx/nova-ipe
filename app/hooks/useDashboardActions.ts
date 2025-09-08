'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'

interface QuickAction {
  type: 'call' | 'whatsapp' | 'email' | 'schedule' | 'note'
  leadId?: string
  propertyId?: string
  data: any
}

export function useDashboardActions() {
  const [isLoading, setIsLoading] = useState(false)

  const executeQuickAction = useCallback(async (action: QuickAction) => {
    setIsLoading(true)
    
    try {
      switch (action.type) {
        case 'call':
          // Integração com sistema de telefonia ou apenas registro
          await logActivity({
            type: 'call_attempt',
            leadId: action.leadId,
            timestamp: new Date().toISOString(),
            data: action.data
          })
          toast.success('Ligação registrada com sucesso!')
          break
          
        case 'whatsapp':
          // Abrir WhatsApp Web ou registrar tentativa
          const phone = action.data.phone?.replace(/\D/g, '')
          if (phone) {
            const whatsappUrl = `https://wa.me/55${phone}?text=${encodeURIComponent(action.data.message || 'Olá! Entrei em contato sobre o imóvel do seu interesse.')}`
            window.open(whatsappUrl, '_blank')
            
            await logActivity({
              type: 'whatsapp_sent',
              leadId: action.leadId,
              timestamp: new Date().toISOString(),
              data: { phone, message: action.data.message }
            })
            toast.success('WhatsApp aberto com sucesso!')
          }
          break
          
        case 'email':
          // Abrir cliente de email ou enviar via API
          const emailUrl = `mailto:${action.data.email}?subject=${encodeURIComponent(action.data.subject || 'Sobre seu interesse em imóvel')}&body=${encodeURIComponent(action.data.body || '')}`
          window.location.href = emailUrl
          
          await logActivity({
            type: 'email_sent',
            leadId: action.leadId,
            timestamp: new Date().toISOString(),
            data: action.data
          })
          toast.success('Email aberto com sucesso!')
          break
          
        case 'schedule':
          // Integração com calendário
          await scheduleAppointment(action.data)
          toast.success('Agendamento criado com sucesso!')
          break
          
        case 'note':
          // Salvar nota sobre o lead
          await saveNote({
            leadId: action.leadId,
            propertyId: action.propertyId,
            note: action.data.note,
            timestamp: new Date().toISOString()
          })
          toast.success('Nota salva com sucesso!')
          break
      }
    } catch (error) {
      console.error('Erro ao executar ação:', error)
      toast.error('Erro ao executar ação. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateLeadStatus = useCallback(async (leadId: string, newStatus: string) => {
    setIsLoading(true)
    try {
      // Aqui você faria a chamada para sua API
      await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      toast.success('Status do lead atualizado!')
    } catch (error) {
      toast.error('Erro ao atualizar status do lead')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const quickCall = useCallback((phone: string, leadId?: string) => {
    executeQuickAction({
      type: 'call',
      leadId,
      data: { phone }
    })
  }, [executeQuickAction])

  const quickWhatsApp = useCallback((phone: string, message?: string, leadId?: string) => {
    executeQuickAction({
      type: 'whatsapp',
      leadId,
      data: { phone, message }
    })
  }, [executeQuickAction])

  const quickEmail = useCallback((email: string, subject?: string, leadId?: string) => {
    executeQuickAction({
      type: 'email',
      leadId,
      data: { email, subject }
    })
  }, [executeQuickAction])

  return {
    isLoading,
    executeQuickAction,
    updateLeadStatus,
    quickCall,
    quickWhatsApp,
    quickEmail
  }
}

// Funções auxiliares (implementar conforme sua arquitetura)
async function logActivity(activity: any) {
  // Implementar logging de atividades
  console.log('Activity logged:', activity)
}

async function scheduleAppointment(appointmentData: any) {
  // Implementar agendamento
  console.log('Appointment scheduled:', appointmentData)
}

async function saveNote(noteData: any) {
  // Implementar salvamento de notas
  console.log('Note saved:', noteData)
}
