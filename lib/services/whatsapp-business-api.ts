/**
 * WhatsApp Business API - Production Service
 * Meta Developer Integration with Official Credentials
 */

interface WhatsAppCredentials {
  phoneNumberId: string
  accessToken: string
  webhookToken?: string
  businessAccountId?: string
}

interface WhatsAppMessage {
  messaging_product: 'whatsapp'
  recipient_type: 'individual'
  to: string
  type: 'text' | 'template' | 'image' | 'document' | 'audio'
  text?: {
    body: string
    preview_url?: boolean
  }
  template?: {
    name: string
    language: {
      code: string
    }
    components?: Array<{
      type: string
      parameters: Array<{
        type: string
        text: string
      }>
    }>
  }
  image?: {
    link?: string
    id?: string
    caption?: string
  }
  document?: {
    link?: string
    id?: string
    caption?: string
    filename?: string
  }
}

interface WhatsAppResponse {
  messaging_product: string
  contacts: Array<{
    input: string
    wa_id: string
  }>
  messages: Array<{
    id: string
  }>
}

export class WhatsAppBusinessAPI {
  private static readonly BASE_URL = 'https://graph.facebook.com/v18.0'
  private static readonly PHONE_NUMBER_ID = process.env.META_WHATSAPP_PHONE_NUMBER_ID || ''
  private static readonly ACCESS_TOKEN = process.env.META_WHATSAPP_ACCESS_TOKEN || ''

  private static credentials: WhatsAppCredentials = {
    phoneNumberId: this.PHONE_NUMBER_ID,
    accessToken: this.ACCESS_TOKEN
  }

  /**
   * Verifica se as credenciais estão configuradas
   */
  static isConfigured(): boolean {
    return !!(this.credentials.phoneNumberId && this.credentials.accessToken)
  }

  /**
   * Atualiza as credenciais (para ambiente de produção)
   */
  static setCredentials(credentials: Partial<WhatsAppCredentials>): void {
    this.credentials = { ...this.credentials, ...credentials }
  }

  /**
   * Envia mensagem de texto via WhatsApp Business API
   */
  static async sendTextMessage(
    to: string,
    message: string,
    previewUrl: boolean = false
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isConfigured()) {
      return this.fallbackToWebWhatsApp(to, message)
    }

    try {
      const phoneNumber = this.formatPhoneNumber(to)

      const payload: WhatsAppMessage = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phoneNumber,
        type: 'text',
        text: {
          body: message,
          preview_url: previewUrl
        }
      }

      const response = await fetch(
        `${this.BASE_URL}/${this.credentials.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.credentials.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.error('WhatsApp API Error:', errorData)

        // Fallback para WhatsApp Web em caso de erro da API
        if (response.status >= 400) {
          return this.fallbackToWebWhatsApp(to, message)
        }

        return {
          success: false,
          error: errorData.error?.message || 'Erro desconhecido da API'
        }
      }

      const data: WhatsAppResponse = await response.json()

      return {
        success: true,
        messageId: data.messages?.[0]?.id
      }

    } catch (error) {
      console.error('Erro na requisição WhatsApp:', error)
      return this.fallbackToWebWhatsApp(to, message)
    }
  }

  /**
   * Envia template de mensagem (para mensagens em massa)
   */
  static async sendTemplate(
    to: string,
    templateName: string,
    languageCode: string = 'pt_BR',
    parameters?: Array<{ type: 'text'; text: string }>
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isConfigured()) {
      return { success: false, error: 'API não configurada' }
    }

    try {
      const phoneNumber = this.formatPhoneNumber(to)

      const payload: WhatsAppMessage = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phoneNumber,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: languageCode
          }
        }
      }

      if (parameters && parameters.length > 0) {
        payload.template!.components = [
          {
            type: 'body',
            parameters
          }
        ]
      }

      const response = await fetch(
        `${this.BASE_URL}/${this.credentials.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.credentials.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        return {
          success: false,
          error: errorData.error?.message || 'Erro ao enviar template'
        }
      }

      const data: WhatsAppResponse = await response.json()

      return {
        success: true,
        messageId: data.messages?.[0]?.id
      }

    } catch (error) {
      console.error('Erro ao enviar template:', error)
      return {
        success: false,
        error: 'Erro interno do servidor'
      }
    }
  }

  /**
   * Envia imagem via WhatsApp
   */
  static async sendImage(
    to: string,
    imageUrl: string,
    caption?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isConfigured()) {
      return { success: false, error: 'API não configurada' }
    }

    try {
      const phoneNumber = this.formatPhoneNumber(to)

      const payload: WhatsAppMessage = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phoneNumber,
        type: 'image',
        image: {
          link: imageUrl,
          caption
        }
      }

      const response = await fetch(
        `${this.BASE_URL}/${this.credentials.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.credentials.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        return {
          success: false,
          error: errorData.error?.message || 'Erro ao enviar imagem'
        }
      }

      const data: WhatsAppResponse = await response.json()

      return {
        success: true,
        messageId: data.messages?.[0]?.id
      }

    } catch (error) {
      console.error('Erro ao enviar imagem:', error)
      return {
        success: false,
        error: 'Erro interno do servidor'
      }
    }
  }

  /**
   * Envia documento via WhatsApp
   */
  static async sendDocument(
    to: string,
    documentUrl: string,
    filename?: string,
    caption?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isConfigured()) {
      return { success: false, error: 'API não configurada' }
    }

    try {
      const phoneNumber = this.formatPhoneNumber(to)

      const payload: WhatsAppMessage = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phoneNumber,
        type: 'document',
        document: {
          link: documentUrl,
          filename,
          caption
        }
      }

      const response = await fetch(
        `${this.BASE_URL}/${this.credentials.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.credentials.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        return {
          success: false,
          error: errorData.error?.message || 'Erro ao enviar documento'
        }
      }

      const data: WhatsAppResponse = await response.json()

      return {
        success: true,
        messageId: data.messages?.[0]?.id
      }

    } catch (error) {
      console.error('Erro ao enviar documento:', error)
      return {
        success: false,
        error: 'Erro interno do servidor'
      }
    }
  }

  /**
   * Obtém status da mensagem
   */
  static async getMessageStatus(messageId: string): Promise<{
    status?: 'sent' | 'delivered' | 'read' | 'failed'
    timestamp?: string
    error?: string
  }> {
    if (!this.isConfigured()) {
      return { error: 'API não configurada' }
    }

    try {
      const response = await fetch(
        `${this.BASE_URL}/${messageId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.credentials.accessToken}`
          }
        }
      )

      if (!response.ok) {
        return { error: 'Erro ao obter status da mensagem' }
      }

      const data = await response.json()

      return {
        status: data.status,
        timestamp: data.timestamp
      }

    } catch (error) {
      console.error('Erro ao obter status:', error)
      return { error: 'Erro interno do servidor' }
    }
  }

  /**
   * Formata número de telefone para WhatsApp (formato internacional)
   */
  private static formatPhoneNumber(phone: string): string {
    // Remove todos os caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '')

    // Se já tem código do país (55), retorna como está
    if (cleaned.startsWith('55') && cleaned.length >= 12) {
      return cleaned
    }

    // Se tem 11 dígitos (com DDD), adiciona código do país
    if (cleaned.length === 11) {
      return `55${cleaned}`
    }

    // Se tem 10 dígitos (sem 9 do celular), adiciona 9 e código do país
    if (cleaned.length === 10) {
      const ddd = cleaned.substring(0, 2)
      const number = cleaned.substring(2)
      return `55${ddd}9${number}`
    }

    // Fallback - retorna o número limpo com código do país
    return `55${cleaned}`
  }

  /**
   * Fallback para WhatsApp Web quando API não está disponível
   */
  private static fallbackToWebWhatsApp(
    to: string,
    message: string
  ): { success: boolean; messageId?: string; error?: string } {
    try {
      const phoneNumber = this.formatPhoneNumber(to)
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

      if (typeof window !== 'undefined') {
        window.open(whatsappUrl, '_blank')
        return {
          success: true,
          messageId: `web_${Date.now()}`, // ID mock para web
        }
      }

      return {
        success: false,
        error: 'Ambiente não suportado para fallback'
      }

    } catch (error) {
      console.error('Erro no fallback:', error)
      return {
        success: false,
        error: 'Erro no fallback para WhatsApp Web'
      }
    }
  }

  /**
   * Templates pré-definidos para Nova IPÊ
   */
  static readonly Templates = {
    WELCOME: {
      name: 'welcome_ipe',
      create: (clientName: string) => ({
        name: 'welcome_ipe',
        parameters: [
          { type: 'text' as const, text: clientName }
        ]
      })
    },

    PROPERTY_INFO: {
      name: 'property_info',
      create: (address: string, price: string, area: string, garage: string) => ({
        name: 'property_info',
        parameters: [
          { type: 'text' as const, text: address },
          { type: 'text' as const, text: price },
          { type: 'text' as const, text: area },
          { type: 'text' as const, text: garage }
        ]
      })
    },

    ALIQUOTAS_UPDATE: {
      name: 'aliquotas_update',
      create: (month: string, year: string, address: string, currentValue: string, newValue: string, percentage: string) => ({
        name: 'aliquotas_update',
        parameters: [
          { type: 'text' as const, text: month },
          { type: 'text' as const, text: year },
          { type: 'text' as const, text: address },
          { type: 'text' as const, text: currentValue },
          { type: 'text' as const, text: newValue },
          { type: 'text' as const, text: percentage }
        ]
      })
    }
  }

  /**
   * Utilitários para mensagens rápidas
   */
  static readonly QuickMessages = {
    /**
     * Envia mensagem de boas-vindas
     */
    sendWelcome: async (to: string, clientName: string) => {
      const message = `🏠 Olá ${clientName}! 👋

Bem-vindo(a) à *IPÊ IMÓVEIS*!

🏢 *Praça 9 de Julho, nº 65, Centro*

Como posso ajudá-lo(a) hoje? 😊`

      return WhatsAppBusinessAPI.sendTextMessage(to, message, false)
    },

    /**
     * Envia informações de imóvel
     */
    sendPropertyInfo: async (to: string, propertyData: {
      address: string
      price: string
      area: string
      garage: string
    }) => {
      const message = `🏠 *${propertyData.address}*

💰 *Valor:* ${propertyData.price}
📐 *Área:* ${propertyData.area}m²
🚗 *Garagem:* ${propertyData.garage}

📅 Gostaria de agendar uma visita?

_IPÊ IMÓVEIS - Seus imóveis, nossa expertise_ ✨`

      return WhatsAppBusinessAPI.sendTextMessage(to, message, false)
    },

    /**
     * Envia update de alíquotas
     */
    sendAliquotasUpdate: async (to: string, data: {
      month: string
      year: string
      address: string
      currentValue: string
      newValue: string
      percentage: string
    }) => {
      const message = `📋 *IPÊ IMÓVEIS - Comunicado de Reajuste*

📅 *Período:* ${data.month}/${data.year}
🏠 *Imóvel:* ${data.address}

💰 *Valor Atual:* ${data.currentValue}
💰 *Novo Valor:* ${data.newValue}
📈 *Reajuste:* ${data.percentage}%

📄 O relatório PDF será enviado em seguida.

🏢 *Praça 9 de Julho, nº 65, Centro*`

      return WhatsAppBusinessAPI.sendTextMessage(to, message, false)
    }
  }

  /**
   * Health check da API
   */
  static async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy'
    api: boolean
    credentials: boolean
    lastCheck: string
  }> {
    let result: {
      status: 'healthy' | 'unhealthy'
      api: boolean
      credentials: boolean
      lastCheck: string
    } = {
      status: 'healthy',
      api: false,
      credentials: this.isConfigured(),
      lastCheck: new Date().toISOString()
    }

    if (!this.isConfigured()) {
      result.status = 'unhealthy'
      return result
    }

    try {
      // Testa conexão com a API (endpoint de business profile)
      const response = await fetch(
        `${this.BASE_URL}/${this.credentials.phoneNumberId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.credentials.accessToken}`
          }
        }
      )

      result.api = response.ok
      if (!response.ok) {
        result.status = 'unhealthy'
      }

    } catch (error) {
      console.error('Health check failed:', error)
      result.api = false
      result.status = 'unhealthy'
    }

    return result
  }
}