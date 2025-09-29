'use client'

import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef, useMemo } from 'react'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
// import { Checkbox } from '@/components/ui/checkbox'
import {
  Pin,
  Archive,
  MoreVertical,
  MessageCircle,
  Phone,
  Video,
  Clock
} from 'lucide-react'
import { motion } from 'framer-motion'
import useWhatsAppStore, { WhatsAppContact } from '@/lib/stores/whatsapp-store'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface VirtualContactListProps {
  height: number
  onContactSelect?: (contact: WhatsAppContact) => void
  multiSelect?: boolean
}

export default function VirtualContactList({
  height,
  onContactSelect,
  multiSelect = false
}: VirtualContactListProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const {
    getFilteredContacts,
    activeContactId,
    setActiveContact,
    selectedContacts,
    addToSelectedContacts,
    removeFromSelectedContacts,
    pinContact,
    unpinContact,
    archiveContact,
    viewMode
  } = useWhatsAppStore()

  const contacts = useMemo(() => getFilteredContacts(), [getFilteredContacts])

  const virtualizer = useVirtualizer({
    count: contacts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (viewMode === 'grid' ? 120 : 80),
    overscan: 10, // Render 10 items outside viewport for smooth scrolling
  })

  const handleContactClick = (contact: WhatsAppContact) => {
    if (multiSelect) {
      if (selectedContacts.includes(contact.id)) {
        removeFromSelectedContacts(contact.id)
      } else {
        addToSelectedContacts(contact.id)
      }
    } else {
      setActiveContact(contact.id)
      onContactSelect?.(contact)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  const formatLastSeen = (lastSeen: string) => {
    try {
      const date = new Date(lastSeen)
      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: ptBR
      })
    } catch {
      return lastSeen
    }
  }

  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <MessageCircle className="w-16 h-16 mb-4 text-gray-300" />
        <h3 className="text-lg font-medium mb-2">Nenhum contato encontrado</h3>
        <p className="text-sm text-center">
          Ajuste seus filtros ou adicione novos contatos
        </p>
      </div>
    )
  }

  return (
    <div
      ref={parentRef}
      className="overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      style={{ height }}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const contact = contacts[virtualItem.index]
          const isSelected = multiSelect
            ? selectedContacts.includes(contact.id)
            : activeContactId === contact.id

          return (
            <motion.div
              key={contact.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: virtualItem.size,
                transform: `translateY(${virtualItem.start}px)`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className={`
                  flex items-center gap-3 p-3 cursor-pointer transition-colors
                  hover:bg-gray-50 border-b border-gray-100
                  ${isSelected ? 'bg-blue-50 border-blue-200' : ''}
                  ${contact.isPinned ? 'bg-yellow-50' : ''}
                `}
                onClick={() => handleContactClick(contact)}
              >
                {/* Selection Checkbox */}
                {multiSelect && (
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={() => {}}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                  />
                )}

                {/* Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    {contact.avatar ? (
                      <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-semibold text-sm">
                        {getInitials(contact.name)}
                      </span>
                    )}
                  </div>

                  {/* Online Status */}
                  {contact.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  )}

                  {/* Pinned Indicator */}
                  {contact.isPinned && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Pin className="w-2 h-2 text-white" />
                    </div>
                  )}
                </div>

                {/* Contact Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900 truncate">
                      {contact.name}
                    </h4>
                    {contact.lastMessageTime && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatLastSeen(contact.lastMessageTime.toISOString())}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate max-w-[200px]">
                      {contact.lastMessage || contact.phone}
                    </p>

                    <div className="flex items-center gap-2">
                      {/* Unread Count */}
                      {contact.unreadCount > 0 && (
                        <Badge
                          variant="secondary"
                          className="bg-green-500 text-white text-xs min-w-[1.25rem] h-5 flex items-center justify-center"
                        >
                          {contact.unreadCount > 99 ? '99+' : contact.unreadCount}
                        </Badge>
                      )}

                      {/* Action Buttons */}
                      <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Phone call action
                          }}
                        >
                          <Phone className="w-3 h-3" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Video call action
                          }}
                        >
                          <Video className="w-3 h-3" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            // More options
                          }}
                        >
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {contact.tags.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {contact.tags.slice(0, 3).map(tag => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs py-0 px-2 h-5"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {contact.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs py-0 px-2 h-5">
                          +{contact.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Loading Skeleton for Virtual Items */}
      {contacts.length === 0 && (
        <div className="space-y-3 p-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}