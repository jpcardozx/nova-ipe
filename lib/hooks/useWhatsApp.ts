'use client'

import { useState, useCallback } from 'react'
import { WhatsAppBusinessAPI } from '@/lib/services/whatsapp-business-api'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'

interface SendMessageOptions {
  to: string
  message: string
  type?: 'text' | 'welcome' | 'property' | 'aliquotas'
  data?: Record<string, any>
}

interface WhatsAppStatus {
  isConfigured: boolean
  isOnline: boolean
  lastCheck?: string
  error?: string
}

export const useWhatsApp = () => {
  const [isSending, setIsSending] = useState(false)

  // Health check query
  const {
    data: status,
    isLoading: isCheckingStatus,
    refetch: checkStatus
  } = useQuery({
    queryKey: ['whatsapp-health'],
    queryFn: WhatsAppBusinessAPI.healthCheck,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  })

  // Send text message mutation
  const sendTextMutation = useMutation({
    mutationFn: async ({ to, message }: { to: string; message: string }) => {
      return WhatsAppBusinessAPI.sendTextMessage(to, message)
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Mensagem enviada com sucesso!')
      } else {
        toast.error(data.error || 'Erro ao enviar mensagem')
      }
    },
    onError: (error) => {
      console.error('Send error:', error)
      toast.error('Erro ao enviar mensagem')
    }
  })

  // Send image mutation
  const sendImageMutation = useMutation({
    mutationFn: async ({ to, imageUrl, caption }: { to: string; imageUrl: string; caption?: string }) => {
      return WhatsAppBusinessAPI.sendImage(to, imageUrl, caption)
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Imagem enviada com sucesso!')
      } else {
        toast.error(data.error || 'Erro ao enviar imagem')
      }
    },
    onError: () => {
      toast.error('Erro ao enviar imagem')
    }
  })

  // Send document mutation
  const sendDocumentMutation = useMutation({
    mutationFn: async ({ to, documentUrl, filename, caption }: {
      to: string
      documentUrl: string
      filename?: string
      caption?: string
    }) => {
      return WhatsAppBusinessAPI.sendDocument(to, documentUrl, filename, caption)
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Documento enviado com sucesso!')
      } else {
        toast.error(data.error || 'Erro ao enviar documento')
      }
    },
    onError: () => {
      toast.error('Erro ao enviar documento')
    }
  })

  // Send quick message function
  const sendQuickMessage = useCallback(async (options: SendMessageOptions) => {
    setIsSending(true)

    try {
      let result

      switch (options.type) {
        case 'welcome':
          result = await WhatsAppBusinessAPI.QuickMessages.sendWelcome(
            options.to,
            options.data?.clientName || 'Cliente'
          )
          break

        case 'property':
          result = await WhatsAppBusinessAPI.QuickMessages.sendPropertyInfo(
            options.to,
            options.data as { address: string; price: string; area: string; garage: string }
          )
          break

        case 'aliquotas':
          result = await WhatsAppBusinessAPI.QuickMessages.sendAliquotasUpdate(
            options.to,
            options.data as { month: string; year: string; address: string; currentValue: string; newValue: string; percentage: string }
          )
          break

        case 'text':
        default:
          result = await WhatsAppBusinessAPI.sendTextMessage(options.to, options.message)
          break
      }

      if (result.success) {
        toast.success('Mensagem enviada com sucesso!')
      } else {
        toast.error(result.error || 'Erro ao enviar mensagem')
      }

      return result

    } catch (error) {
      console.error('Quick message error:', error)
      toast.error('Erro ao enviar mensagem')
      return { success: false, error: 'Erro interno' }

    } finally {
      setIsSending(false)
    }
  }, [])

  // Bulk send function for campaigns
  const sendBulkMessages = useCallback(async (
    contacts: Array<{ phone: string; name: string }>,
    message: string,
    delay: number = 1000 // Delay entre mensagens em ms
  ) => {
    const results = []

    toast.loading(`Enviando mensagens para ${contacts.length} contatos...`, {
      id: 'bulk-send'
    })

    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i]

      try {
        const personalizedMessage = message.replace('{nome}', contact.name)
        const result = await WhatsAppBusinessAPI.sendTextMessage(contact.phone, personalizedMessage)

        results.push({
          contact: contact.name,
          success: result.success,
          messageId: result.messageId,
          error: result.error
        })

        // Delay between messages to avoid rate limiting
        if (i < contacts.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delay))
        }

      } catch (error) {
        console.error(`Error sending to ${contact.name}:`, error)
        results.push({
          contact: contact.name,
          success: false,
          error: 'Erro interno'
        })
      }
    }

    const successful = results.filter(r => r.success).length
    const failed = results.length - successful

    toast.dismiss('bulk-send')

    if (failed === 0) {
      toast.success(`Todas as ${successful} mensagens foram enviadas!`)
    } else {
      toast.error(`${successful} enviadas, ${failed} falharam`)
    }

    return results
  }, [])

  // Get message status
  const getMessageStatus = useCallback(async (messageId: string) => {
    try {
      return await WhatsAppBusinessAPI.getMessageStatus(messageId)
    } catch (error) {
      console.error('Status error:', error)
      return { error: 'Erro ao obter status' }
    }
  }, [])

  // Format phone number
  const formatPhoneNumber = useCallback((phone: string): string => {
    return phone.replace(/\D/g, '').replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3')
  }, [])

  // Validate phone number
  const isValidPhoneNumber = useCallback((phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '')
    return cleaned.length >= 10 && cleaned.length <= 13
  }, [])

  return {
    // Status
    status: status || { isConfigured: false, isOnline: false },
    isCheckingStatus,

    // Actions
    sendText: sendTextMutation.mutate,
    sendImage: sendImageMutation.mutate,
    sendDocument: sendDocumentMutation.mutate,
    sendQuickMessage,
    sendBulkMessages,
    getMessageStatus,
    checkStatus,

    // State
    isSending: isSending || sendTextMutation.isPending || sendImageMutation.isPending || sendDocumentMutation.isPending,

    // Utils
    formatPhoneNumber,
    isValidPhoneNumber,

    // Raw API access
    api: WhatsAppBusinessAPI
  }
}