import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface WhatsAppContact {
  id: string
  name: string
  phone: string
  avatar?: string
  tags: string[]
  lastSeen: string
  isOnline: boolean
  unreadCount: number
  lastMessage?: string
  lastMessageTime?: Date
  isBlocked?: boolean
  isPinned?: boolean
  isArchived?: boolean
}

export interface WhatsAppMessage {
  id: string
  contactId: string
  content: string
  timestamp: Date
  type: 'text' | 'image' | 'file' | 'audio' | 'template'
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed'
  isFromMe: boolean
  replyTo?: string
  metadata?: {
    fileName?: string
    fileSize?: number
    fileUrl?: string
    templateName?: string
  }
}

export interface WhatsAppConversation {
  contactId: string
  messages: WhatsAppMessage[]
  isTyping: boolean
  draftMessage: string
}

interface WhatsAppStore {
  // State
  contacts: WhatsAppContact[]
  conversations: Map<string, WhatsAppConversation>
  activeContactId: string | null
  searchQuery: string
  selectedContacts: string[]
  isLoading: boolean

  // UI State
  sidebarCollapsed: boolean
  selectedTags: string[]
  sortBy: 'name' | 'lastMessage' | 'unread'
  viewMode: 'list' | 'grid'

  // Filters
  showOnlineOnly: boolean
  showUnreadOnly: boolean
  showArchivedContacts: boolean

  // Actions
  setContacts: (contacts: WhatsAppContact[]) => void
  addContact: (contact: WhatsAppContact) => void
  updateContact: (contactId: string, updates: Partial<WhatsAppContact>) => void
  removeContact: (contactId: string) => void

  // Message Actions
  addMessage: (contactId: string, message: WhatsAppMessage) => void
  updateMessageStatus: (messageId: string, status: WhatsAppMessage['status']) => void
  markConversationAsRead: (contactId: string) => void

  // Conversation Actions
  setActiveContact: (contactId: string | null) => void
  setDraftMessage: (contactId: string, message: string) => void
  setTyping: (contactId: string, isTyping: boolean) => void

  // UI Actions
  setSearchQuery: (query: string) => void
  toggleSidebar: () => void
  setSelectedTags: (tags: string[]) => void
  setSortBy: (sortBy: 'name' | 'lastMessage' | 'unread') => void
  setViewMode: (mode: 'list' | 'grid') => void

  // Filter Actions
  toggleShowOnlineOnly: () => void
  toggleShowUnreadOnly: () => void
  toggleShowArchivedContacts: () => void

  // Bulk Actions
  setSelectedContacts: (contactIds: string[]) => void
  addToSelectedContacts: (contactId: string) => void
  removeFromSelectedContacts: (contactId: string) => void
  clearSelectedContacts: () => void

  // Contact Management
  pinContact: (contactId: string) => void
  unpinContact: (contactId: string) => void
  archiveContact: (contactId: string) => void
  unarchiveContact: (contactId: string) => void
  blockContact: (contactId: string) => void
  unblockContact: (contactId: string) => void

  // Utility
  getFilteredContacts: () => WhatsAppContact[]
  getConversation: (contactId: string) => WhatsAppConversation | null
  getUnreadCount: () => number
}

const useWhatsAppStore = create<WhatsAppStore>()(
  persist(
    immer((set, get) => ({
      // Initial State
      contacts: [],
      conversations: new Map(),
      activeContactId: null,
      searchQuery: '',
      selectedContacts: [],
      isLoading: false,

      // UI State
      sidebarCollapsed: false,
      selectedTags: [],
      sortBy: 'lastMessage',
      viewMode: 'list',

      // Filters
      showOnlineOnly: false,
      showUnreadOnly: false,
      showArchivedContacts: false,

      // Actions
      setContacts: (contacts) => {
        set((state) => {
          state.contacts = contacts
          state.isLoading = false
        })
      },

      addContact: (contact) => {
        set((state) => {
          state.contacts.push(contact)
          // Initialize conversation
          state.conversations.set(contact.id, {
            contactId: contact.id,
            messages: [],
            isTyping: false,
            draftMessage: ''
          })
        })
      },

      updateContact: (contactId, updates) => {
        set((state) => {
          const index = state.contacts.findIndex(c => c.id === contactId)
          if (index !== -1) {
            Object.assign(state.contacts[index], updates)
          }
        })
      },

      removeContact: (contactId) => {
        set((state) => {
          state.contacts = state.contacts.filter(c => c.id !== contactId)
          state.conversations.delete(contactId)
          if (state.activeContactId === contactId) {
            state.activeContactId = null
          }
        })
      },

      // Message Actions
      addMessage: (contactId, message) => {
        set((state) => {
          let conversation = state.conversations.get(contactId)
          if (!conversation) {
            conversation = {
              contactId,
              messages: [],
              isTyping: false,
              draftMessage: ''
            }
            state.conversations.set(contactId, conversation)
          }

          conversation.messages.push(message)

          // Update contact last message
          const contact = state.contacts.find(c => c.id === contactId)
          if (contact) {
            contact.lastMessage = message.content
            contact.lastMessageTime = message.timestamp
            if (!message.isFromMe) {
              contact.unreadCount = (contact.unreadCount || 0) + 1
            }
          }
        })
      },

      updateMessageStatus: (messageId, status) => {
        set((state) => {
          for (const conversation of state.conversations.values()) {
            const message = conversation.messages.find(m => m.id === messageId)
            if (message) {
              message.status = status
              break
            }
          }
        })
      },

      markConversationAsRead: (contactId) => {
        set((state) => {
          const contact = state.contacts.find(c => c.id === contactId)
          if (contact) {
            contact.unreadCount = 0
          }
        })
      },

      // Conversation Actions
      setActiveContact: (contactId) => {
        set((state) => {
          state.activeContactId = contactId
          if (contactId) {
            // Mark as read when opening conversation
            const contact = state.contacts.find(c => c.id === contactId)
            if (contact) {
              contact.unreadCount = 0
            }

            // Ensure conversation exists
            if (!state.conversations.has(contactId)) {
              state.conversations.set(contactId, {
                contactId,
                messages: [],
                isTyping: false,
                draftMessage: ''
              })
            }
          }
        })
      },

      setDraftMessage: (contactId, message) => {
        set((state) => {
          const conversation = state.conversations.get(contactId)
          if (conversation) {
            conversation.draftMessage = message
          }
        })
      },

      setTyping: (contactId, isTyping) => {
        set((state) => {
          const conversation = state.conversations.get(contactId)
          if (conversation) {
            conversation.isTyping = isTyping
          }
        })
      },

      // UI Actions
      setSearchQuery: (query) => {
        set((state) => {
          state.searchQuery = query
        })
      },

      toggleSidebar: () => {
        set((state) => {
          state.sidebarCollapsed = !state.sidebarCollapsed
        })
      },

      setSelectedTags: (tags) => {
        set((state) => {
          state.selectedTags = tags
        })
      },

      setSortBy: (sortBy) => {
        set((state) => {
          state.sortBy = sortBy
        })
      },

      setViewMode: (mode) => {
        set((state) => {
          state.viewMode = mode
        })
      },

      // Filter Actions
      toggleShowOnlineOnly: () => {
        set((state) => {
          state.showOnlineOnly = !state.showOnlineOnly
        })
      },

      toggleShowUnreadOnly: () => {
        set((state) => {
          state.showUnreadOnly = !state.showUnreadOnly
        })
      },

      toggleShowArchivedContacts: () => {
        set((state) => {
          state.showArchivedContacts = !state.showArchivedContacts
        })
      },

      // Bulk Actions
      setSelectedContacts: (contactIds) => {
        set((state) => {
          state.selectedContacts = contactIds
        })
      },

      addToSelectedContacts: (contactId) => {
        set((state) => {
          if (!state.selectedContacts.includes(contactId)) {
            state.selectedContacts.push(contactId)
          }
        })
      },

      removeFromSelectedContacts: (contactId) => {
        set((state) => {
          state.selectedContacts = state.selectedContacts.filter(id => id !== contactId)
        })
      },

      clearSelectedContacts: () => {
        set((state) => {
          state.selectedContacts = []
        })
      },

      // Contact Management
      pinContact: (contactId) => {
        set((state) => {
          const contact = state.contacts.find(c => c.id === contactId)
          if (contact) {
            contact.isPinned = true
          }
        })
      },

      unpinContact: (contactId) => {
        set((state) => {
          const contact = state.contacts.find(c => c.id === contactId)
          if (contact) {
            contact.isPinned = false
          }
        })
      },

      archiveContact: (contactId) => {
        set((state) => {
          const contact = state.contacts.find(c => c.id === contactId)
          if (contact) {
            contact.isArchived = true
          }
        })
      },

      unarchiveContact: (contactId) => {
        set((state) => {
          const contact = state.contacts.find(c => c.id === contactId)
          if (contact) {
            contact.isArchived = false
          }
        })
      },

      blockContact: (contactId) => {
        set((state) => {
          const contact = state.contacts.find(c => c.id === contactId)
          if (contact) {
            contact.isBlocked = true
          }
        })
      },

      unblockContact: (contactId) => {
        set((state) => {
          const contact = state.contacts.find(c => c.id === contactId)
          if (contact) {
            contact.isBlocked = false
          }
        })
      },

      // Utility Functions
      getFilteredContacts: () => {
        const state = get()
        let filtered = [...state.contacts]

        // Search filter
        if (state.searchQuery.trim()) {
          const query = state.searchQuery.toLowerCase()
          filtered = filtered.filter(contact =>
            contact.name.toLowerCase().includes(query) ||
            contact.phone.includes(query) ||
            contact.tags.some(tag => tag.toLowerCase().includes(query))
          )
        }

        // Tag filter
        if (state.selectedTags.length > 0) {
          filtered = filtered.filter(contact =>
            state.selectedTags.some(tag => contact.tags.includes(tag))
          )
        }

        // Online filter
        if (state.showOnlineOnly) {
          filtered = filtered.filter(contact => contact.isOnline)
        }

        // Unread filter
        if (state.showUnreadOnly) {
          filtered = filtered.filter(contact => (contact.unreadCount || 0) > 0)
        }

        // Archive filter
        if (!state.showArchivedContacts) {
          filtered = filtered.filter(contact => !contact.isArchived)
        }

        // Sorting
        filtered.sort((a, b) => {
          // Pinned contacts first
          if (a.isPinned && !b.isPinned) return -1
          if (!a.isPinned && b.isPinned) return 1

          switch (state.sortBy) {
            case 'name':
              return a.name.localeCompare(b.name)
            case 'lastMessage':
              const aTime = a.lastMessageTime?.getTime() || 0
              const bTime = b.lastMessageTime?.getTime() || 0
              return bTime - aTime
            case 'unread':
              const aUnread = a.unreadCount || 0
              const bUnread = b.unreadCount || 0
              return bUnread - aUnread
            default:
              return 0
          }
        })

        return filtered
      },

      getConversation: (contactId) => {
        return get().conversations.get(contactId) || null
      },

      getUnreadCount: () => {
        return get().contacts.reduce((sum, contact) => sum + (contact.unreadCount || 0), 0)
      },
    })),
    {
      name: 'whatsapp-store',
      storage: createJSONStorage(() => localStorage),
      // Only persist essential data
      partialize: (state) => ({
        contacts: state.contacts,
        conversations: Array.from(state.conversations.entries()),
        sidebarCollapsed: state.sidebarCollapsed,
        selectedTags: state.selectedTags,
        sortBy: state.sortBy,
        viewMode: state.viewMode,
        showOnlineOnly: state.showOnlineOnly,
        showUnreadOnly: state.showUnreadOnly,
        showArchivedContacts: state.showArchivedContacts,
      }),
      // Custom serialization for Map
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray((state as any).conversations)) {
          state.conversations = new Map((state as any).conversations)
        }
      },
    }
  )
)

export default useWhatsAppStore