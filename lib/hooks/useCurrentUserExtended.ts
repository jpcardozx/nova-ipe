// lib/hooks/useCurrentUserExtended.ts
'use client'

import { useState, useEffect } from 'react'
import { UserProfileExtended, ZohoUserData, UserEvent, UserNote } from '@/types/user-profile'
import { UserProfileService } from '@/lib/services/user-profile-service'

export interface UseCurrentUserExtended {
  user: UserProfileExtended | null
  loading: boolean
  error: string | null
  
  // User management
  updateProfile: (updates: Partial<UserProfileExtended>) => Promise<void>
  refreshProfile: () => Promise<void>
  
  // Events management
  events: UserEvent[]
  eventsLoading: boolean
  createEvent: (event: Omit<UserEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<UserEvent>
  loadEvents: (filters?: Parameters<typeof UserProfileService.getUserEvents>[1]) => Promise<void>
  
  // Notes management
  notes: UserNote[]
  notesLoading: boolean
  createNote: (note: Omit<UserNote, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<UserNote>
  loadNotes: (filters?: Parameters<typeof UserProfileService.getUserNotes>[1]) => Promise<void>
  
  // Quick actions
  addReminder: (title: string, scheduledAt: string, description?: string) => Promise<UserEvent>
  addNote: (title: string, content: string, type?: UserNote['type']) => Promise<UserNote>
  
  // Auth helpers
  logout: () => Promise<void>
}

export function useCurrentUserExtended(): UseCurrentUserExtended {
  const [user, setUser] = useState<UserProfileExtended | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [events, setEvents] = useState<UserEvent[]>([])
  const [eventsLoading, setEventsLoading] = useState(false)
  
  const [notes, setNotes] = useState<UserNote[]>([])
  const [notesLoading, setNotesLoading] = useState(false)

  // Initialize user from localStorage and sync with Zoho
  useEffect(() => {
    const initializeUser = async () => {
      try {
        setLoading(true)
        setError(null)

        // Check if user is stored in localStorage (from Zoho auth)
        const storedUser = localStorage.getItem('currentUser')
        if (!storedUser) {
          setLoading(false)
          return
        }

        const zohoData: ZohoUserData = JSON.parse(storedUser)
        console.log('👤 Inicializando usuário:', zohoData.email)

        // Sync with extended profile in database
        const profile = await UserProfileService.syncUser(zohoData)
        setUser(profile)

        // Load initial data
        loadEvents()
        loadNotes({ limit: 10 })

      } catch (err) {
        console.error('❌ Erro ao inicializar usuário:', err)
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    initializeUser()
  }, [])

  const updateProfile = async (updates: Partial<UserProfileExtended>) => {
    if (!user) return
    
    try {
      const updatedProfile = await UserProfileService.updateUserProfile(user.email, updates)
      setUser(updatedProfile)
      
      // Log activity
      await UserProfileService.logUserActivity(user.id, {
        action: 'profile_updated',
        details: { fields: Object.keys(updates) }
      })
    } catch (err) {
      console.error('❌ Erro ao atualizar perfil:', err)
      throw err
    }
  }

  const refreshProfile = async () => {
    if (!user) return
    
    try {
      const profile = await UserProfileService.getUserProfile(user.email)
      if (profile) {
        setUser(profile)
      }
    } catch (err) {
      console.error('❌ Erro ao recarregar perfil:', err)
      throw err
    }
  }

  const createEvent = async (eventData: Omit<UserEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('Usuário não autenticado')
    
    try {
      const event = await UserProfileService.createUserEvent(user.id, eventData)
      setEvents(prev => [event, ...prev])
      
      // Log activity
      await UserProfileService.logUserActivity(user.id, {
        action: 'event_created',
        details: { type: event.type, title: event.title }
      })
      
      return event
    } catch (err) {
      console.error('❌ Erro ao criar evento:', err)
      throw err
    }
  }

  const loadEvents = async (filters?: Parameters<typeof UserProfileService.getUserEvents>[1]) => {
    if (!user) return
    
    try {
      setEventsLoading(true)
      const userEvents = await UserProfileService.getUserEvents(user.id, filters)
      setEvents(userEvents)
    } catch (err) {
      console.error('❌ Erro ao carregar eventos:', err)
    } finally {
      setEventsLoading(false)
    }
  }

  const createNote = async (noteData: Omit<UserNote, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('Usuário não autenticado')
    
    try {
      const note = await UserProfileService.createUserNote(user.id, noteData)
      setNotes(prev => [note, ...prev])
      
      // Log activity
      await UserProfileService.logUserActivity(user.id, {
        action: 'note_created',
        details: { type: note.type, title: note.title }
      })
      
      return note
    } catch (err) {
      console.error('❌ Erro ao criar nota:', err)
      throw err
    }
  }

  const loadNotes = async (filters?: Parameters<typeof UserProfileService.getUserNotes>[1]) => {
    if (!user) return
    
    try {
      setNotesLoading(true)
      const userNotes = await UserProfileService.getUserNotes(user.id, filters)
      setNotes(userNotes)
    } catch (err) {
      console.error('❌ Erro ao carregar notas:', err)
    } finally {
      setNotesLoading(false)
    }
  }

  // Quick helper functions
  const addReminder = async (title: string, scheduledAt: string, description?: string) => {
    return createEvent({
      type: 'reminder',
      title,
      description,
      scheduled_at: scheduledAt,
      status: 'pending',
      notifications: {
        before_minutes: [15, 60],
        sent: [false, false]
      }
    })
  }

  const addNote = async (title: string, content: string, type: UserNote['type'] = 'personal') => {
    return createNote({
      title,
      content,
      type,
      tags: [],
      is_private: true
    })
  }

  const logout = async () => {
    try {
      if (user) {
        await UserProfileService.logUserActivity(user.id, {
          action: 'logout',
          details: { timestamp: new Date().toISOString() }
        })
      }
      
      // Clear localStorage
      localStorage.removeItem('currentUser')
      
      // Clear studio session
      await fetch('/api/studio/session', { method: 'DELETE' })
      
      // Reset state
      setUser(null)
      setEvents([])
      setNotes([])
      
      console.log('👋 Logout realizado com sucesso')
    } catch (err) {
      console.error('❌ Erro no logout:', err)
    }
  }

  return {
    user,
    loading,
    error,
    
    // User management
    updateProfile,
    refreshProfile,
    
    // Events
    events,
    eventsLoading,
    createEvent,
    loadEvents,
    
    // Notes
    notes,
    notesLoading,
    createNote,
    loadNotes,
    
    // Quick actions
    addReminder,
    addNote,
    
    // Auth
    logout
  }
}