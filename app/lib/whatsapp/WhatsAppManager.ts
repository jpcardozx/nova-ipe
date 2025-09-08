// Sistema de automação para WhatsApp Business
export class WhatsAppBusinessManager {
  private baseUrl = 'https://graph.facebook.com/v18.0'
  private phoneNumberId: string
  private accessToken: string

  constructor(phoneNumberId: string, accessToken: string) {
    this.phoneNumberId = phoneNumberId
    this.accessToken = accessToken
  }

  /**
   * Envia mensagem de texto
   */
  async sendTextMessage(to: string, message: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: this.formatPhoneNumber(to),
          type: 'text',
          text: { body: message }
        })
      })

      return response.ok
    } catch (error) {
      console.error('Erro ao enviar mensagem WhatsApp:', error)
      return false
    }
  }

  /**
   * Envia mensagem com template
   */
  async sendTemplateMessage(
    to: string, 
    templateName: string, 
    language: string = 'pt_BR',
    parameters?: string[]
  ): Promise<boolean> {
    try {
      const components = parameters ? [{
        type: 'body',
        parameters: parameters.map(param => ({ type: 'text', text: param }))
      }] : []

      const response = await fetch(`${this.baseUrl}/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: this.formatPhoneNumber(to),
          type: 'template',
          template: {
            name: templateName,
            language: { code: language },
            components
          }
        })
      })

      return response.ok
    } catch (error) {
      console.error('Erro ao enviar template WhatsApp:', error)
      return false
    }
  }

  /**
   * Envia imagem com legenda
   */
  async sendImageMessage(to: string, imageUrl: string, caption?: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: this.formatPhoneNumber(to),
          type: 'image',
          image: {
            link: imageUrl,
            caption: caption || ''
          }
        })
      })

      return response.ok
    } catch (error) {
      console.error('Erro ao enviar imagem WhatsApp:', error)
      return false
    }
  }

  /**
   * Envia documento
   */
  async sendDocumentMessage(to: string, documentUrl: string, filename: string, caption?: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: this.formatPhoneNumber(to),
          type: 'document',
          document: {
            link: documentUrl,
            filename,
            caption: caption || ''
          }
        })
      })

      return response.ok
    } catch (error) {
      console.error('Erro ao enviar documento WhatsApp:', error)
      return false
    }
  }

  /**
   * Envia botões interativos
   */
  async sendButtonMessage(
    to: string, 
    bodyText: string, 
    buttons: Array<{ id: string, title: string }>,
    headerText?: string,
    footerText?: string
  ): Promise<boolean> {
    try {
      const interactive: any = {
        type: 'button',
        body: { text: bodyText },
        action: {
          buttons: buttons.map(btn => ({
            type: 'reply',
            reply: { id: btn.id, title: btn.title }
          }))
        }
      }

      if (headerText) {
        interactive.header = { type: 'text', text: headerText }
      }

      if (footerText) {
        interactive.footer = { text: footerText }
      }

      const response = await fetch(`${this.baseUrl}/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: this.formatPhoneNumber(to),
          type: 'interactive',
          interactive
        })
      })

      return response.ok
    } catch (error) {
      console.error('Erro ao enviar botões WhatsApp:', error)
      return false
    }
  }

  /**
   * Formata número de telefone para padrão WhatsApp
   */
  private formatPhoneNumber(phone: string): string {
    // Remove caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '')
    
    // Se começar com 0, remove
    if (cleaned.startsWith('0')) {
      return cleaned.substring(1)
    }
    
    // Se não começar com código do país, adiciona +55 (Brasil)
    if (!cleaned.startsWith('55')) {
      return `55${cleaned}`
    }
    
    return cleaned
  }
}

// Templates de mensagens para imobiliária
export class RealEstateWhatsAppTemplates {
  /**
   * Primeiro contato com lead
   */
  static firstContact(clientName: string, propertyInterest: string): string {
    return `Olá ${clientName}! 👋

Obrigado pelo interesse em nossos imóveis! Vi que você está procurando ${propertyInterest}.

Sou especialista no mercado imobiliário da região e tenho algumas opções que podem interessar você.

Quando podemos conversar para entender melhor suas necessidades? 🏠✨`
  }

  /**
   * Confirmação de agendamento de visita
   */
  static appointmentConfirmation(
    clientName: string, 
    propertyAddress: string, 
    date: string, 
    time: string
  ): string {
    return `✅ *Agendamento Confirmado!*

Olá ${clientName}!

Sua visita está agendada:
📅 *Data:* ${date}
🕐 *Horário:* ${time}
📍 *Imóvel:* ${propertyAddress}

Vou te encontrar no local. Qualquer imprevisto, me avise!

*Dica:* Leve documento com foto 📄`
  }

  /**
   * Lembrete de visita
   */
  static visitReminder(clientName: string, time: string, address: string): string {
    return `🔔 *Lembrete de Visita*

Oi ${clientName}!

Sua visita é daqui a pouco (${time})!
📍 Local: ${address}

Estou a caminho. Nos vemos lá! 😊`
  }

  /**
   * Follow-up pós-visita
   */
  static postVisitFollowUp(clientName: string, propertyAddress: string): string {
    return `Oi ${clientName}! 😊

O que achou do imóvel em ${propertyAddress}?

Se tiver alguma dúvida ou quiser negociar, estou à disposição!

Tenho outras opções também, caso interesse. 🏠`
  }

  /**
   * Proposta de valor
   */
  static propertyProposal(
    clientName: string,
    propertyDetails: {
      address: string
      bedrooms: number
      price: string
      features: string[]
    }
  ): string {
    const featuresText = propertyDetails.features.join('\n• ')
    
    return `🏠 *Imóvel Perfeito para Você!*

${clientName}, encontrei esta opção que tem tudo a ver com o que você procura:

📍 *Endereço:* ${propertyDetails.address}
🛏️ *Quartos:* ${propertyDetails.bedrooms}
💰 *Valor:* ${propertyDetails.price}

✨ *Diferenciais:*
• ${featuresText}

Quer agendar uma visita? É rapidinho! 😉`
  }

  /**
   * Negociação - contra-proposta
   */
  static counterProposal(clientName: string, originalValue: string, counterValue: string): string {
    return `${clientName}, conversei com o proprietário sobre sua proposta de ${originalValue}.

Ele fez uma contra-proposta de ${counterValue}.

É um valor muito justo considerando a localização e condições do imóvel.

O que acha? Posso tentar melhorar mais um pouco... 🤝`
  }

  /**
   * Documentação necessária
   */
  static documentationRequest(clientName: string, documentList: string[]): string {
    const docs = documentList.join('\n• ')
    
    return `📄 *Documentação Necessária*

${clientName}, para darmos continuidade, preciso dos seguintes documentos:

• ${docs}

Pode me enviar por aqui mesmo (foto ou PDF).

Qualquer dúvida sobre algum documento, me fale! 😊`
  }

  /**
   * Avaliação de imóvel
   */
  static propertyEvaluation(clientName: string, estimatedValue: string): string {
    return `🏠 *Avaliação do seu Imóvel*

${clientName}, após análise do mercado e características do seu imóvel:

💰 *Valor estimado:* ${estimatedValue}

Esta avaliação considera:
• Localização e região
• Estado de conservação  
• Comparativo de mercado
• Demanda atual

Quer conversar sobre a estratégia de venda? 📞`
  }

  /**
   * Novidades do mercado
   */
  static marketUpdate(clientName: string, marketTrend: 'up' | 'stable' | 'down'): string {
    const trendEmoji = marketTrend === 'up' ? '📈' : marketTrend === 'down' ? '📉' : '➡️'
    const trendText = marketTrend === 'up' ? 'em alta' : 
                     marketTrend === 'down' ? 'em baixa' : 'estável'
    
    return `📊 *Update do Mercado*

${clientName}, o mercado imobiliário está ${trendText} ${trendEmoji}

${marketTrend === 'up' ? 
  'É um ótimo momento para vender! Os preços estão valorizando.' :
  marketTrend === 'down' ? 
  'Momento ideal para comprar! Mais opções e preços atrativos.' :
  'Mercado equilibrado, boa hora tanto para comprar quanto vender.'
}

Quer saber como isso impacta seus planos? 🤔`
  }

  /**
   * Urgência - oportunidade
   */
  static urgentOpportunity(clientName: string, propertyDetails: string, deadline: string): string {
    return `⚡ *Oportunidade Única!*

${clientName}, apareceu algo PERFEITO para você:

${propertyDetails}

❗ *ATENÇÃO:* O prazo para decidir é até ${deadline}

Tem interesse? Preciso saber rapidinho para não perder! 🏃‍♂️💨`
  }

  /**
   * Agradecimento e fidelização
   */
  static thankYouAndLoyalty(clientName: string): string {
    return `🎉 *Muito Obrigado!*

${clientName}, foi um prazer te ajudar nesta jornada!

Sua confiança é muito importante para mim. 

Se precisar de qualquer coisa relacionada a imóveis - para você, família ou amigos - estarei sempre aqui!

*Indique amigos e ganhe bônus especiais!* 🎁

Sucesso na sua nova conquista! 🏠❤️`
  }
}

// Automação de follow-up via WhatsApp
export class WhatsAppAutomation {
  private whatsapp: WhatsAppBusinessManager
  private automationRules: Map<string, AutomationRule> = new Map()

  constructor(whatsapp: WhatsAppBusinessManager) {
    this.whatsapp = whatsapp
    this.setupDefaultRules()
  }

  /**
   * Configuração de regras padrão
   */
  private setupDefaultRules(): void {
    // Primeiro contato após 1 hora
    this.automationRules.set('first-contact', {
      trigger: 'lead-created',
      delay: 60, // minutos
      condition: (data) => data.source !== 'walk-in',
      action: async (data) => {
        const message = RealEstateWhatsAppTemplates.firstContact(
          data.clientName,
          data.propertyInterest || 'imóveis na região'
        )
        return this.whatsapp.sendTextMessage(data.phone, message)
      }
    })

    // Lembrete de visita 1 hora antes
    this.automationRules.set('visit-reminder', {
      trigger: 'appointment-scheduled',
      delay: -60, // 1 hora antes
      condition: (data) => data.type === 'viewing',
      action: async (data) => {
        const message = RealEstateWhatsAppTemplates.visitReminder(
          data.clientName,
          data.time,
          data.address
        )
        return this.whatsapp.sendTextMessage(data.phone, message)
      }
    })

    // Follow-up pós-visita após 4 horas
    this.automationRules.set('post-visit-followup', {
      trigger: 'appointment-completed',
      delay: 240, // 4 horas
      condition: (data) => data.type === 'viewing',
      action: async (data) => {
        const message = RealEstateWhatsAppTemplates.postVisitFollowUp(
          data.clientName,
          data.propertyAddress
        )
        return this.whatsapp.sendTextMessage(data.phone, message)
      }
    })

    // Reativação após 7 dias sem contato
    this.automationRules.set('reactivation', {
      trigger: 'no-contact',
      delay: 7 * 24 * 60, // 7 dias
      condition: (data) => data.status !== 'closed' && data.status !== 'lost',
      action: async (data) => {
        const message = `Oi ${data.clientName}! 😊\n\nComo está a busca pelo imóvel ideal?\n\nTenho algumas novidades que podem interessar você!\n\nQuer conversar? 🏠✨`
        return this.whatsapp.sendTextMessage(data.phone, message)
      }
    })
  }

  /**
   * Executa automação baseada em trigger
   */
  async executeTrigger(triggerType: string, data: any): Promise<void> {
    for (const [ruleId, rule] of this.automationRules) {
      if (rule.trigger === triggerType && rule.condition(data)) {
        if (rule.delay > 0) {
          // Agenda para execução futura
          setTimeout(async () => {
            await rule.action(data)
          }, rule.delay * 60 * 1000)
        } else if (rule.delay < 0) {
          // Calcula tempo baseado em data futura (ex: lembrete antes do evento)
          const executeAt = new Date(data.eventTime.getTime() + (rule.delay * 60 * 1000))
          const now = new Date()
          const delayMs = executeAt.getTime() - now.getTime()
          
          if (delayMs > 0) {
            setTimeout(async () => {
              await rule.action(data)
            }, delayMs)
          }
        } else {
          // Executa imediatamente
          await rule.action(data)
        }
      }
    }
  }

  /**
   * Adiciona regra customizada
   */
  addAutomationRule(ruleId: string, rule: AutomationRule): void {
    this.automationRules.set(ruleId, rule)
  }

  /**
   * Remove regra
   */
  removeAutomationRule(ruleId: string): void {
    this.automationRules.delete(ruleId)
  }
}

interface AutomationRule {
  trigger: string
  delay: number // em minutos (negativo para antes do evento)
  condition: (data: any) => boolean
  action: (data: any) => Promise<boolean>
}
