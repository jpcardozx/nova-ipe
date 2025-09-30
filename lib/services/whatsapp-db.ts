/**
 * WhatsApp Database Integration
 * Supabase integration for persistent storage
 */

import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export interface DBWhatsAppContact {
  id: string
  phone: string
  name?: string
  avatar?: string
  tags: string[]
  source: string
  first_contact: string
  last_seen: string
  is_online: boolean
  is_blocked: boolean
  is_archived: boolean
  is_pinned: boolean
  unread_count: number
  last_message?: string
  last_message_time?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface DBWhatsAppMessage {
  id: string
  contact_id: string
  conversation_id: string
  content: string
  type: 'text' | 'image' | 'document' | 'audio' | 'video' | 'template'
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed'
  is_from_me: boolean
  timestamp: string
  reply_to?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface DBWhatsAppConversation {
  id: string
  contact_id: string
  status: 'active' | 'archived' | 'closed'
  last_message_at: string
  message_count: number
  unread_count: number
  tags: string[]
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface DBCampaign {
  id: string
  name: string
  type: 'broadcast' | 'drip' | 'auto_response'
  target_tags: string[]
  message_template: string
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused'
  scheduled_at?: string
  started_at?: string
  completed_at?: string
  metrics: {
    sent: number
    delivered: number
    read: number
    replied: number
    failed: number
  }
  created_by: string
  created_at: string
  updated_at: string
}

export class WhatsAppDB {
  /**
   * CONTACTS MANAGEMENT
   */

  static async createContact(contact: Partial<DBWhatsAppContact>): Promise<DBWhatsAppContact | null> {
    try {
      const { data, error } = await supabase
        .from('whatsapp_contacts')
        .insert({
          ...contact,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating contact:', error)
      return null
    }
  }

  static async getContact(phone: string): Promise<DBWhatsAppContact | null> {
    try {
      const { data, error } = await supabase
        .from('whatsapp_contacts')
        .select('*')
        .eq('phone', phone)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data
    } catch (error) {
      console.error('Error getting contact:', error)
      return null
    }
  }

  static async updateContact(id: string, updates: Partial<DBWhatsAppContact>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('whatsapp_contacts')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating contact:', error)
      return false
    }
  }

  static async getAllContacts(): Promise<DBWhatsAppContact[]> {
    try {
      const { data, error } = await supabase
        .from('whatsapp_contacts')
        .select('*')
        .order('last_message_time', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting contacts:', error)
      return []
    }
  }

  static async searchContacts(query: string): Promise<DBWhatsAppContact[]> {
    try {
      const { data, error } = await supabase
        .from('whatsapp_contacts')
        .select('*')
        .or(`name.ilike.%${query}%,phone.ilike.%${query}%`)
        .order('last_message_time', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error searching contacts:', error)
      return []
    }
  }

  static async getContactsByTags(tags: string[]): Promise<DBWhatsAppContact[]> {
    try {
      const { data, error } = await supabase
        .from('whatsapp_contacts')
        .select('*')
        .contains('tags', tags)
        .order('last_message_time', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting contacts by tags:', error)
      return []
    }
  }

  /**
   * MESSAGES MANAGEMENT
   */

  static async createMessage(message: Partial<DBWhatsAppMessage>): Promise<DBWhatsAppMessage | null> {
    try {
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .insert({
          ...message,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // Update conversation
      if (data) {
        await this.updateConversationLastMessage(data.conversation_id, data)
      }

      return data
    } catch (error) {
      console.error('Error creating message:', error)
      return null
    }
  }

  static async updateMessageStatus(messageId: string, status: DBWhatsAppMessage['status']): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('whatsapp_messages')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating message status:', error)
      return false
    }
  }

  static async getConversationMessages(conversationId: string, limit = 50, offset = 0): Promise<DBWhatsAppMessage[]> {
    try {
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting conversation messages:', error)
      return []
    }
  }

  /**
   * CONVERSATIONS MANAGEMENT
   */

  static async createConversation(contactId: string): Promise<DBWhatsAppConversation | null> {
    try {
      const { data, error } = await supabase
        .from('whatsapp_conversations')
        .insert({
          contact_id: contactId,
          status: 'active',
          last_message_at: new Date().toISOString(),
          message_count: 0,
          unread_count: 0,
          tags: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating conversation:', error)
      return null
    }
  }

  static async getOrCreateConversation(contactId: string): Promise<DBWhatsAppConversation | null> {
    try {
      // Try to get existing conversation
      const { data: existing, error: getError } = await supabase
        .from('whatsapp_conversations')
        .select('*')
        .eq('contact_id', contactId)
        .eq('status', 'active')
        .single()

      if (existing) return existing

      // Create new conversation if not exists
      return await this.createConversation(contactId)
    } catch (error) {
      console.error('Error getting or creating conversation:', error)
      return null
    }
  }

  static async updateConversationLastMessage(conversationId: string, message: DBWhatsAppMessage): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('whatsapp_conversations')
        .update({
          last_message_at: message.timestamp,
          message_count: `message_count + 1`,
          unread_count: message.is_from_me ?
            `unread_count` :
            `unread_count + 1`,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId)

      if (error) throw error

      // Also update contact
      const contact = await supabase
        .from('whatsapp_contacts')
        .select('id')
        .eq('id', message.contact_id)
        .single()

      if (contact.data) {
        await this.updateContact(contact.data.id, {
          last_message: message.content,
          last_message_time: message.timestamp,
          unread_count: message.is_from_me ? 0 : undefined
        } as Partial<DBWhatsAppContact>)
      }

      return true
    } catch (error) {
      console.error('Error updating conversation:', error)
      return false
    }
  }

  static async markConversationAsRead(conversationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('whatsapp_conversations')
        .update({
          unread_count: 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error marking conversation as read:', error)
      return false
    }
  }

  /**
   * CAMPAIGNS MANAGEMENT
   */

  static async createCampaign(campaign: Partial<DBCampaign>): Promise<DBCampaign | null> {
    try {
      const { data, error } = await supabase
        .from('whatsapp_campaigns')
        .insert({
          ...campaign,
          metrics: campaign.metrics || {
            sent: 0,
            delivered: 0,
            read: 0,
            replied: 0,
            failed: 0
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating campaign:', error)
      return null
    }
  }

  static async updateCampaignMetrics(campaignId: string, metrics: Partial<DBCampaign['metrics']>): Promise<boolean> {
    try {
      const { data: current } = await supabase
        .from('whatsapp_campaigns')
        .select('metrics')
        .eq('id', campaignId)
        .single()

      const updatedMetrics = {
        ...current?.metrics,
        ...metrics
      }

      const { error } = await supabase
        .from('whatsapp_campaigns')
        .update({
          metrics: updatedMetrics,
          updated_at: new Date().toISOString()
        })
        .eq('id', campaignId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating campaign metrics:', error)
      return false
    }
  }

  static async getCampaigns(): Promise<DBCampaign[]> {
    try {
      const { data, error } = await supabase
        .from('whatsapp_campaigns')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting campaigns:', error)
      return []
    }
  }

  /**
   * ANALYTICS & REPORTS
   */

  static async getAnalytics(dateFrom: string, dateTo: string) {
    try {
      const [
        messagesStats,
        contactsStats,
        campaignsStats
      ] = await Promise.all([
        // Messages analytics
        supabase
          .from('whatsapp_messages')
          .select('type, status, is_from_me, created_at')
          .gte('created_at', dateFrom)
          .lte('created_at', dateTo),

        // Contacts analytics
        supabase
          .from('whatsapp_contacts')
          .select('source, tags, created_at')
          .gte('created_at', dateFrom)
          .lte('created_at', dateTo),

        // Campaigns analytics
        supabase
          .from('whatsapp_campaigns')
          .select('metrics, status, created_at')
          .gte('created_at', dateFrom)
          .lte('created_at', dateTo)
      ])

      return {
        messages: messagesStats.data || [],
        contacts: contactsStats.data || [],
        campaigns: campaignsStats.data || []
      }
    } catch (error) {
      console.error('Error getting analytics:', error)
      return {
        messages: [],
        contacts: [],
        campaigns: []
      }
    }
  }

  /**
   * REAL-TIME SUBSCRIPTIONS
   */

  static subscribeToMessages(conversationId: string, callback: (message: DBWhatsAppMessage) => void) {
    return supabase
      .channel('whatsapp-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'whatsapp_messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => callback(payload.new as DBWhatsAppMessage)
      )
      .subscribe()
  }

  static subscribeToContacts(callback: (contact: DBWhatsAppContact) => void) {
    return supabase
      .channel('whatsapp-contacts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'whatsapp_contacts'
        },
        (payload) => callback(payload.new as DBWhatsAppContact)
      )
      .subscribe()
  }

  /**
   * UTILITY METHODS
   */

  static async cleanupOldMessages(daysOld = 90): Promise<number> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysOld)

      const { data, error } = await supabase
        .from('whatsapp_messages')
        .delete()
        .lt('created_at', cutoffDate.toISOString())
        .select('id')

      if (error) throw error
      return data?.length || 0
    } catch (error) {
      console.error('Error cleaning up old messages:', error)
      return 0
    }
  }

  static async exportConversation(conversationId: string): Promise<DBWhatsAppMessage[]> {
    try {
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error exporting conversation:', error)
      return []
    }
  }
}