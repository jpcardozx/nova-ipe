// Sistema de CRM para Imobiliária
export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  source: 'website' | 'facebook' | 'google' | 'referral' | 'walk-in' | 'phone'
  status: 'new' | 'contacted' | 'qualified' | 'viewing' | 'negotiating' | 'closed' | 'lost'
  interest: 'buy' | 'sell' | 'rent-tenant' | 'rent-owner'
  budget?: {
    min: number
    max: number
  }
  preferences?: {
    location: string[]
    propertyType: string[]
    bedrooms?: number
    parking?: boolean
    furnished?: boolean
  }
  assignedTo?: string
  notes: Array<{
    id: string
    date: Date
    content: string
    author: string
    type: 'call' | 'email' | 'meeting' | 'viewing' | 'note'
  }>
  activities: Array<{
    id: string
    date: Date
    type: 'call' | 'email' | 'whatsapp' | 'meeting' | 'viewing' | 'proposal'
    description: string
    outcome?: string
  }>
  createdAt: Date
  updatedAt: Date
  lastContact?: Date
  nextFollowUp?: Date
  priority: 'low' | 'medium' | 'high'
  score: number // Lead scoring
}

export class CRMSystem {
  private leads: Map<string, Lead> = new Map()
  private nextId = 1

  /**
   * Adiciona novo lead
   */
  addLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'score' | 'notes' | 'activities'>): Lead {
    const lead: Lead = {
      ...leadData,
      id: `lead-${this.nextId++}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      score: this.calculateLeadScore(leadData),
      notes: [],
      activities: []
    }

    this.leads.set(lead.id, lead)
    return lead
  }

  /**
   * Calcula pontuação do lead baseado em diversos fatores
   */
  private calculateLeadScore(lead: Partial<Lead>): number {
    let score = 0

    // Pontuação por fonte
    const sourceScores = {
      'referral': 30,
      'website': 25,
      'walk-in': 20,
      'google': 15,
      'facebook': 10,
      'phone': 15
    }
    score += sourceScores[lead.source!] || 0

    // Pontuação por orçamento definido
    if (lead.budget && lead.budget.min > 0 && lead.budget.max > 0) {
      score += 25
    }

    // Pontuação por preferências detalhadas
    if (lead.preferences) {
      if (lead.preferences.location && lead.preferences.location.length > 0) score += 10
      if (lead.preferences.propertyType && lead.preferences.propertyType.length > 0) score += 10
      if (lead.preferences.bedrooms !== undefined) score += 5
    }

    // Pontuação por interesse
    if (lead.interest === 'buy') score += 20
    else if (lead.interest === 'sell') score += 25
    else score += 10

    return Math.min(score, 100)
  }

  /**
   * Atualiza status do lead
   */
  updateLeadStatus(leadId: string, status: Lead['status'], note?: string): boolean {
    const lead = this.leads.get(leadId)
    if (!lead) return false

    lead.status = status
    lead.updatedAt = new Date()

    if (note) {
      this.addNote(leadId, note, 'Sistema', 'note')
    }

    // Atualiza pontuação baseado no status
    this.updateLeadScore(lead)
    
    return true
  }

  /**
   * Atualiza pontuação do lead baseado no progresso
   */
  private updateLeadScore(lead: Lead): void {
    const statusBonus = {
      'new': 0,
      'contacted': 10,
      'qualified': 20,
      'viewing': 30,
      'negotiating': 40,
      'closed': 50,
      'lost': -20
    }

    lead.score = Math.max(0, this.calculateLeadScore(lead) + statusBonus[lead.status])
  }

  /**
   * Adiciona nota ao lead
   */
  addNote(leadId: string, content: string, author: string, type: Lead['notes'][0]['type']): boolean {
    const lead = this.leads.get(leadId)
    if (!lead) return false

    const note = {
      id: `note-${Date.now()}`,
      date: new Date(),
      content,
      author,
      type
    }

    lead.notes.push(note)
    lead.updatedAt = new Date()
    lead.lastContact = new Date()

    return true
  }

  /**
   * Adiciona atividade ao lead
   */
  addActivity(leadId: string, type: Lead['activities'][0]['type'], description: string, outcome?: string): boolean {
    const lead = this.leads.get(leadId)
    if (!lead) return false

    const activity = {
      id: `activity-${Date.now()}`,
      date: new Date(),
      type,
      description,
      outcome
    }

    lead.activities.push(activity)
    lead.updatedAt = new Date()
    lead.lastContact = new Date()

    return true
  }

  /**
   * Define próximo follow-up
   */
  scheduleFollowUp(leadId: string, date: Date): boolean {
    const lead = this.leads.get(leadId)
    if (!lead) return false

    lead.nextFollowUp = date
    lead.updatedAt = new Date()

    return true
  }

  /**
   * Busca leads por filtros
   */
  searchLeads(filters: {
    status?: Lead['status'][]
    source?: Lead['source'][]
    interest?: Lead['interest'][]
    assignedTo?: string
    priority?: Lead['priority'][]
    minScore?: number
    dateRange?: {
      start: Date
      end: Date
    }
  }): Lead[] {
    const leads = Array.from(this.leads.values())

    return leads.filter(lead => {
      if (filters.status && !filters.status.includes(lead.status)) return false
      if (filters.source && !filters.source.includes(lead.source)) return false
      if (filters.interest && !filters.interest.includes(lead.interest)) return false
      if (filters.assignedTo && lead.assignedTo !== filters.assignedTo) return false
      if (filters.priority && !filters.priority.includes(lead.priority)) return false
      if (filters.minScore && lead.score < filters.minScore) return false
      
      if (filters.dateRange) {
        const leadDate = lead.createdAt
        if (leadDate < filters.dateRange.start || leadDate > filters.dateRange.end) return false
      }

      return true
    })
  }

  /**
   * Leads que precisam de follow-up
   */
  getLeadsNeedingFollowUp(): Lead[] {
    const now = new Date()
    return Array.from(this.leads.values()).filter(lead => {
      if (lead.status === 'closed' || lead.status === 'lost') return false
      
      // Leads com follow-up agendado vencido
      if (lead.nextFollowUp && lead.nextFollowUp <= now) return true
      
      // Leads sem contato há mais de 3 dias
      if (lead.lastContact) {
        const daysSinceContact = (now.getTime() - lead.lastContact.getTime()) / (1000 * 60 * 60 * 24)
        return daysSinceContact > 3
      }
      
      // Leads novos há mais de 1 dia sem contato
      const daysSinceCreated = (now.getTime() - lead.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      return daysSinceCreated > 1 && lead.status === 'new'
    })
  }

  /**
   * Estatísticas do pipeline
   */
  getPipelineStats(): {
    total: number
    byStatus: Record<Lead['status'], number>
    bySource: Record<Lead['source'], number>
    averageScore: number
    conversionRate: number
    needingFollowUp: number
  } {
    const leads = Array.from(this.leads.values())
    
    const byStatus = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1
      return acc
    }, {} as Record<Lead['status'], number>)
    
    const bySource = leads.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1
      return acc
    }, {} as Record<Lead['source'], number>)
    
    const totalScore = leads.reduce((sum, lead) => sum + lead.score, 0)
    const averageScore = leads.length > 0 ? totalScore / leads.length : 0
    
    const closedLeads = byStatus.closed || 0
    const conversionRate = leads.length > 0 ? (closedLeads / leads.length) * 100 : 0
    
    const needingFollowUp = this.getLeadsNeedingFollowUp().length

    return {
      total: leads.length,
      byStatus,
      bySource,
      averageScore: Math.round(averageScore * 100) / 100,
      conversionRate: Math.round(conversionRate * 100) / 100,
      needingFollowUp
    }
  }

  /**
   * Leads de alta prioridade
   */
  getHighPriorityLeads(): Lead[] {
    return Array.from(this.leads.values())
      .filter(lead => 
        lead.priority === 'high' || 
        lead.score >= 80 || 
        lead.status === 'negotiating'
      )
      .sort((a, b) => b.score - a.score)
  }

  /**
   * Atualiza prioridade automaticamente baseado na pontuação e atividade
   */
  updateLeadPriorities(): void {
    this.leads.forEach(lead => {
      if (lead.status === 'closed' || lead.status === 'lost') {
        lead.priority = 'low'
        return
      }

      if (lead.score >= 80 || lead.status === 'negotiating') {
        lead.priority = 'high'
      } else if (lead.score >= 60 || lead.status === 'viewing') {
        lead.priority = 'medium'
      } else {
        lead.priority = 'low'
      }
    })
  }

  /**
   * Relatório de performance do corretor
   */
  getBrokerPerformance(brokerId: string, startDate: Date, endDate: Date) {
    const brokerLeads = Array.from(this.leads.values())
      .filter(lead => 
        lead.assignedTo === brokerId &&
        lead.createdAt >= startDate &&
        lead.createdAt <= endDate
      )

    const totalLeads = brokerLeads.length
    const closedLeads = brokerLeads.filter(lead => lead.status === 'closed').length
    const qualifiedLeads = brokerLeads.filter(lead => 
      ['qualified', 'viewing', 'negotiating', 'closed'].includes(lead.status)
    ).length

    const averageScore = brokerLeads.length > 0 
      ? brokerLeads.reduce((sum, lead) => sum + lead.score, 0) / brokerLeads.length 
      : 0

    const conversionRate = totalLeads > 0 ? (closedLeads / totalLeads) * 100 : 0
    const qualificationRate = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0

    return {
      brokerId,
      period: { startDate, endDate },
      metrics: {
        totalLeads,
        closedLeads,
        qualifiedLeads,
        averageScore: Math.round(averageScore * 100) / 100,
        conversionRate: Math.round(conversionRate * 100) / 100,
        qualificationRate: Math.round(qualificationRate * 100) / 100
      },
      leads: brokerLeads
    }
  }
}

// Sistema de automação de follow-up
export class FollowUpAutomation {
  /**
   * Gera templates de mensagem personalizados
   */
  static generateFollowUpMessage(lead: Lead, type: 'first-contact' | 'follow-up' | 'viewing-reminder' | 'post-viewing'): string {
    const templates = {
      'first-contact': `Olá ${lead.name}! Obrigado pelo interesse em nossos imóveis. Vi que você está procurando ${this.getInterestText(lead.interest)} na região de ${lead.preferences?.location?.[0] || 'sua preferência'}. Quando podemos conversar para encontrar a opção perfeita para você?`,
      
      'follow-up': `Oi ${lead.name}! Como está a busca pelo imóvel? Temos algumas opções novas que podem interessar você. Que tal agendarmos uma conversa rápida?`,
      
      'viewing-reminder': `${lead.name}, só lembrando da nossa visita hoje! Estou animado para mostrar este imóvel que tem tudo a ver com o que você procura. Qualquer coisa, me chame!`,
      
      'post-viewing': `${lead.name}, o que achou do imóvel que visitamos? Ficou com alguma dúvida? Estou aqui para ajudar no que precisar!`
    }

    return templates[type]
  }

  private static getInterestText(interest: Lead['interest']): string {
    const texts = {
      'buy': 'comprar um imóvel',
      'sell': 'vender seu imóvel',
      'rent-tenant': 'alugar um imóvel',
      'rent-owner': 'alugar seu imóvel'
    }
    return texts[interest] || 'imóveis'
  }

  /**
   * Sugere próximas ações para um lead
   */
  static suggestNextActions(lead: Lead): Array<{
    action: string
    priority: 'high' | 'medium' | 'low'
    description: string
    dueDate?: Date
  }> {
    const actions = []
    const now = new Date()

    switch (lead.status) {
      case 'new':
        actions.push({
          action: 'first-contact',
          priority: 'high' as const,
          description: 'Fazer primeiro contato com o lead',
          dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24h
        })
        break

      case 'contacted':
        actions.push({
          action: 'qualify-lead',
          priority: 'high' as const,
          description: 'Qualificar interesse e orçamento do lead',
          dueDate: new Date(now.getTime() + 48 * 60 * 60 * 1000) // 48h
        })
        break

      case 'qualified':
        actions.push({
          action: 'send-options',
          priority: 'high' as const,
          description: 'Enviar opções de imóveis compatíveis',
          dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000)
        })
        actions.push({
          action: 'schedule-viewing',
          priority: 'medium' as const,
          description: 'Agendar visita aos imóveis de interesse'
        })
        break

      case 'viewing':
        actions.push({
          action: 'follow-up-viewing',
          priority: 'high' as const,
          description: 'Fazer follow-up pós-visita',
          dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000)
        })
        break

      case 'negotiating':
        actions.push({
          action: 'close-deal',
          priority: 'high' as const,
          description: 'Finalizar negociação',
          dueDate: new Date(now.getTime() + 72 * 60 * 60 * 1000) // 72h
        })
        break
    }

    // Ações baseadas em tempo sem contato
    if (lead.lastContact) {
      const daysSinceContact = (now.getTime() - lead.lastContact.getTime()) / (1000 * 60 * 60 * 24)
      
      if (daysSinceContact > 7) {
        actions.push({
          action: 'reactivation-call',
          priority: 'medium' as const,
          description: 'Ligação de reativação - sem contato há mais de 7 dias'
        })
      }
    }

    return actions
  }
}
