/**
 * WhatsApp Integration Scripts
 * Funcionalidades avançadas para o sistema WhatsApp Business
 */

export interface WhatsAppContact {
  id: string
  name: string
  phone: string
  tags: string[]
  lastSeen: string
  isOnline: boolean
}

export interface WhatsAppMessage {
  id: string
  from: string
  to: string
  content: string
  timestamp: Date
  type: 'text' | 'image' | 'file' | 'audio'
  status: 'sent' | 'delivered' | 'read'
}

export class WhatsAppBusinessAPI {
  private static readonly BASE_URL = 'https://graph.facebook.com/v18.0'
  private static readonly PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
  private static readonly ACCESS_TOKEN = process.env.WHATSAPP_BUSINESS_TOKEN

  /**
   * Envia mensagem de texto via WhatsApp Business API
   */
  static async sendTextMessage(to: string, message: string): Promise<boolean> {
    if (!this.PHONE_NUMBER_ID || !this.ACCESS_TOKEN) {
      console.warn('WhatsApp Business API não configurado')
      return this.fallbackToWebWhatsApp(to, message)
    }

    try {
      const response = await fetch(`${this.BASE_URL}/${this.PHONE_NUMBER_ID}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to.replace(/\D/g, ''),
          type: 'text',
          text: {
            body: message
          }
        })
      })

      return response.ok
    } catch (error) {
      console.error('Erro ao enviar via WhatsApp Business API:', error)
      return this.fallbackToWebWhatsApp(to, message)
    }
  }

  /**
   * Fallback para WhatsApp Web quando API não está disponível
   */
  private static fallbackToWebWhatsApp(to: string, message: string): boolean {
    const phone = to.replace(/\D/g, '')
    const whatsappUrl = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`

    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank')
      return true
    }

    return false
  }

  /**
   * Envia template de mensagem personalizado
   */
  static async sendTemplate(
    to: string,
    templateName: string,
    variables: Record<string, string>
  ): Promise<boolean> {
    // Templates pré-definidos
    const templates = {
      'welcome_ipe': '🏠 Olá {nome}! 👋\n\nBem-vindo(a) à *IPÊ IMÓVEIS*!\n\n🏢 *Praça 9 de Julho, nº 65, Centro*\n\nComo posso ajudá-lo(a) hoje? 😊',
      'property_info': '🏠 *{endereco}*\n\n💰 *Valor:* R$ {valor}\n📐 *Área:* {area}m²\n🚗 *Garagem:* {garagem}\n\n📅 Gostaria de agendar uma visita?\n\n_IPÊ IMÓVEIS - Seus imóveis, nossa expertise_ ✨',
      'aliquotas_update': '📋 *IPÊ IMÓVEIS - Comunicado de Reajuste*\n\n📅 *Período:* {mes}/{ano}\n🏠 *Imóvel:* {endereco}\n\n💰 *Valor Atual:* R$ {valorAtual}\n💰 *Novo Valor:* R$ {novoValor}\n📈 *Reajuste:* {percentual}%\n\n📄 O relatório PDF será enviado em seguida.\n\n🏢 *Praça 9 de Julho, nº 65, Centro*'
    }

    let message = templates[templateName as keyof typeof templates]
    if (!message) {
      throw new Error(`Template ${templateName} não encontrado`)
    }

    // Substitui variáveis
    Object.entries(variables).forEach(([key, value]) => {
      message = message.replace(new RegExp(`{${key}}`, 'g'), value)
    })

    return this.sendTextMessage(to, message)
  }

  /**
   * Obtém status da mensagem
   */
  static async getMessageStatus(messageId: string): Promise<string> {
    if (!this.ACCESS_TOKEN) return 'unknown'

    try {
      const response = await fetch(`${this.BASE_URL}/${messageId}`, {
        headers: {
          'Authorization': `Bearer ${this.ACCESS_TOKEN}`
        }
      })

      const data = await response.json()
      return data.status || 'unknown'
    } catch (error) {
      console.error('Erro ao obter status da mensagem:', error)
      return 'unknown'
    }
  }
}

/**
 * Sistema de automação para WhatsApp
 */
export class WhatsAppAutomation {
  /**
   * Auto-resposta baseada em palavras-chave
   */
  static processIncomingMessage(message: string): string | null {
    const lowerMessage = message.toLowerCase()

    // Respostas automáticas
    if (lowerMessage.includes('oi') || lowerMessage.includes('olá')) {
      return '👋 Olá! Bem-vindo(a) à IPÊ IMÓVEIS!\n\nComo posso ajudá-lo(a) hoje?\n\n🏠 Imóveis para venda/locação\n💰 Consultoria financeira\n📋 Serviços imobiliários'
    }

    if (lowerMessage.includes('preço') || lowerMessage.includes('valor')) {
      return '💰 Para informações sobre valores, preciso de mais detalhes:\n\n📍 Qual região te interessa?\n🏠 Que tipo de imóvel?\n📐 Quantos quartos?\n\nAssim posso te ajudar melhor!'
    }

    if (lowerMessage.includes('visita') || lowerMessage.includes('agendar')) {
      return '📅 Claro! Vamos agendar sua visita.\n\n🕐 Horários disponíveis:\n• Manhã: 9h às 12h\n• Tarde: 14h às 17h\n\nQual dia e horário prefere?'
    }

    if (lowerMessage.includes('aluguel') || lowerMessage.includes('locação')) {
      return '🏠 Temos ótimas opções de aluguel!\n\n📋 Para te ajudar melhor:\n• Qual bairro prefere?\n• Quantos quartos?\n• Faixa de valor?\n\nVou buscar as melhores opções!'
    }

    return null
  }

  /**
   * Agenda follow-up automático
   */
  static scheduleFollowUp(contactId: string, delayHours: number = 24): void {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        console.log(`Follow-up agendado para contato ${contactId}`)
        // Implementar lógica de follow-up
      }, delayHours * 60 * 60 * 1000)
    }
  }

  /**
   * Classifica automaticamente o contato
   */
  static classifyContact(message: string): string[] {
    const tags: string[] = []
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes('comprar') || lowerMessage.includes('venda')) {
      tags.push('comprador')
    }

    if (lowerMessage.includes('alugar') || lowerMessage.includes('locação')) {
      tags.push('locatário')
    }

    if (lowerMessage.includes('vender') || lowerMessage.includes('proprietário')) {
      tags.push('proprietário')
    }

    if (lowerMessage.includes('apartamento') || lowerMessage.includes('ap')) {
      tags.push('apartamento')
    }

    if (lowerMessage.includes('casa') || lowerMessage.includes('residência')) {
      tags.push('casa')
    }

    if (lowerMessage.includes('comercial') || lowerMessage.includes('loja')) {
      tags.push('comercial')
    }

    // Tag padrão se nenhuma específica for identificada
    if (tags.length === 0) {
      tags.push('interessado')
    }

    return tags
  }
}

/**
 * Utilitários para formatação de mensagens
 */
export class WhatsAppFormatter {
  /**
   * Formata número de telefone para WhatsApp
   */
  static formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '')

    // Adiciona código do país se não tiver
    if (!cleaned.startsWith('55')) {
      return `55${cleaned}`
    }

    return cleaned
  }

  /**
   * Formata mensagem para envio
   */
  static formatMessage(template: string, data: Record<string, any>): string {
    let formatted = template

    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `{${key}}`
      formatted = formatted.replace(new RegExp(placeholder, 'g'), String(value))
    })

    return formatted
  }

  /**
   * Formata valor monetário para mensagem
   */
  static formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  /**
   * Formata data para mensagem
   */
  static formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  }
}

/**
 * Sistema de métricas para WhatsApp
 */
export class WhatsAppMetrics {
  /**
   * Calcula taxa de resposta
   */
  static calculateResponseRate(sent: number, replied: number): number {
    return sent > 0 ? (replied / sent) * 100 : 0
  }

  /**
   * Analisa horários de maior engajamento
   */
  static analyzeBestTimeToSend(messages: WhatsAppMessage[]): { hour: number, engagement: number }[] {
    const hourlyStats = new Map<number, { sent: number, read: number }>()

    messages.forEach(msg => {
      const hour = msg.timestamp.getHours()
      const stats = hourlyStats.get(hour) || { sent: 0, read: 0 }

      stats.sent++
      if (msg.status === 'read') stats.read++

      hourlyStats.set(hour, stats)
    })

    return Array.from(hourlyStats.entries()).map(([hour, stats]) => ({
      hour,
      engagement: stats.sent > 0 ? (stats.read / stats.sent) * 100 : 0
    })).sort((a, b) => b.engagement - a.engagement)
  }

  /**
   * Gera relatório de performance
   */
  static generateReport(messages: WhatsAppMessage[]): {
    totalSent: number
    totalRead: number
    responseRate: number
    avgResponseTime: number
    bestHour: number
  } {
    const totalSent = messages.length
    const totalRead = messages.filter(m => m.status === 'read').length
    const responseRate = this.calculateResponseRate(totalSent, totalRead)

    const bestTimes = this.analyzeBestTimeToSend(messages)
    const bestHour = bestTimes.length > 0 ? bestTimes[0].hour : 9

    return {
      totalSent,
      totalRead,
      responseRate,
      avgResponseTime: 0, // Implementar cálculo de tempo médio de resposta
      bestHour
    }
  }
}