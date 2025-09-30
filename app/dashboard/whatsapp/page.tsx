'use client'

import React, { useState, useEffect, useRef } from 'react'
import WhatsAppStatus from './components/WhatsAppStatus'
import Tabs from './components/Tabs'
import BotConfiguration from './components/BotConfiguration'
import UserManagement from './components/UserManagement'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle,
  Send,
  Phone,
  Video,
  Paperclip,
  Smile,
  Search,
  MoreVertical,
  Pin,
  CheckCheck,
  Check,
  Plus,
  Users,
  Settings,
  Bot,
  Zap,
  QrCode,
  Building2,
  Calculator,
  ChevronLeft,
  Mic,
  ImageIcon
} from 'lucide-react'

interface Contact {
  id: string
  name: string
  phone: string
  avatar?: string
  lastSeen: string
  isOnline: boolean
  unreadCount: number
  lastMessage: string
  isPinned: boolean
  isBlocked: boolean
  tags: string[]
  type: 'client' | 'lead' | 'property_owner' | 'other'
}

interface Message {
  id: string
  contactId: string
  content: string
  type: 'text' | 'image' | 'file' | 'audio' | 'location'
  timestamp: string
  isFromMe: boolean
  status: 'sent' | 'delivered' | 'read'
  replyTo?: string
  attachment?: {
    name: string
    size: string
    url: string
    type: string
  }
}

interface Template {
  id: string
  name: string
  content: string
  category: 'greeting' | 'property' | 'aliquotas' | 'follow_up' | 'closing'
  variables: string[]
}

// Contacts will be loaded from API or WhatsApp Business integration
const loadContacts = async (): Promise<Contact[]> => {
  // TODO: Integrate with WhatsApp Business API
  // For now, return empty array for clean start
  return []
}

const templates: Template[] = [
  {
    id: '1',
    name: 'Boas-vindas IPÊ',
    content: '🏠 Olá {nome}! 👋\\n\\nBem-vindo(a) à *IPÊ IMÓVEIS*!\\n\\n🏢 *Praça 9 de Julho, nº 65, Centro*\\n\\nComo posso ajudá-lo(a) hoje? 😊',
    category: 'greeting',
    variables: ['nome']
  },
  {
    id: '2',
    name: 'Informações Completas do Imóvel',
    content: '🏠 *{endereco}*\\n\\n💰 *Valor:* R$ {valor}\\n📐 *Área:* {area}m²\\n🚗 *Garagem:* {garagem}\\n🏊 *Lazer:* {lazer}\\n📍 *Bairro:* {bairro}\\n\\n📅 Gostaria de agendar uma visita?\\n\\n_IPÊ IMÓVEIS - Seus imóveis, nossa expertise_ ✨',
    category: 'property',
    variables: ['endereco', 'valor', 'area', 'garagem', 'lazer', 'bairro']
  },
  {
    id: '3',
    name: 'Comunicado de Reajuste',
    content: '📋 *IPÊ IMÓVEIS - Comunicado de Reajuste*\\n\\n📅 *Período:* {mes}/{ano}\\n🏠 *Imóvel:* {endereco}\\n\\n💰 *Valor Atual:* R$ {valorAtual}\\n💰 *Novo Valor:* R$ {novoValor}\\n📈 *Reajuste:* {percentual}%\\n\\n📄 O relatório PDF detalhado será enviado em seguida.\\n\\n🏢 *Praça 9 de Julho, nº 65, Centro*',
    category: 'aliquotas',
    variables: ['mes', 'ano', 'endereco', 'valorAtual', 'novoValor', 'percentual']
  },
  {
    id: '4',
    name: 'Follow-up Visita',
    content: '👋 Olá {nome}!\\n\\nComo foi a visita ao imóvel em *{endereco}*?\\n\\n😊 Gostou? Tem alguma dúvida?\\n\\n💬 Estou aqui para ajudar com qualquer informação adicional!',
    category: 'follow_up',
    variables: ['nome', 'endereco']
  }
]

export default function WhatsAppPage() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Load contacts on component mount
  useEffect(() => {
    const initializeContacts = async () => {
      try {
        setLoading(true)
        const loadedContacts = await loadContacts()
        setContacts(loadedContacts)
      } catch (error) {
        console.error('Error loading contacts:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeContacts()
  }, [])
  const [showTemplates, setShowTemplates] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showContactList, setShowContactList] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState('conversations')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      setShowContactList(window.innerWidth >= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery) ||
    contact.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return

    const message: Message = {
      id: Date.now().toString(),
      contactId: selectedContact.id,
      content: newMessage,
      type: 'text',
      timestamp: new Date().toISOString(),
      isFromMe: true,
      status: 'sent'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Simulate typing and delivery
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => prev.map(msg =>
        msg.id === message.id ? { ...msg, status: 'delivered' } : msg
      ))
    }, 2000)

    // Simulate read status
    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === message.id ? { ...msg, status: 'read' } : msg
      ))
    }, 5000)
  }

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact)
    if (isMobile) setShowContactList(false)

    // Mark as read
    setContacts(prev => prev.map(c =>
      c.id === contact.id ? { ...c, unreadCount: 0 } : c
    ))

    // Load real messages for the contact from WhatsApp Business API
    // TODO: Implement real message loading
    setMessages([])
  }

  const handleUseTemplate = (template: Template) => {
    setNewMessage(template.content)
    setShowTemplates(false)
  }

  const getContactTypeColor = (type: string) => {
    switch (type) {
      case 'client': return 'from-blue-400 to-blue-600'
      case 'lead': return 'from-orange-400 to-orange-600'
      case 'property_owner': return 'from-purple-400 to-purple-600'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  const totalContacts = contacts.length
  const unreadCount = contacts.filter(c => c.unreadCount > 0).length
  const onlineCount = contacts.filter(c => c.isOnline).length

  // Tab configuration
  const tabs = [
    {
      id: 'conversations',
      label: 'Conversas',
      icon: <MessageCircle className="h-4 w-4" />,
      badge: unreadCount
    },
    {
      id: 'bot',
      label: 'Bot & API',
      icon: <Bot className="h-4 w-4" />
    },
    {
      id: 'users',
      label: 'Usuários',
      icon: <Users className="h-4 w-4" />
    }
  ]

  return (
    <div className="space-y-6">
      {/* WhatsApp API Status */}
      <WhatsAppStatus />

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
        <Tabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          className="px-6"
        />
      </div>

      {/* Tab Content */}
      {activeTab === 'conversations' && (
        <div className="h-[calc(100vh-16rem)] bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex rounded-xl overflow-hidden shadow-2xl">
      
      {/* Mobile Header */}
      {isMobile && !showContactList && selectedContact && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 p-4 flex items-center gap-3 z-10 shadow-sm"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowContactList(true)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </motion.button>
          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              <div className={`w-10 h-10 bg-gradient-to-r ${getContactTypeColor(selectedContact.type)} rounded-full flex items-center justify-center text-white font-semibold shadow-lg`}>
                {selectedContact.name.charAt(0)}
              </div>
              {selectedContact.isOnline && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{selectedContact.name}</h3>
              <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                {selectedContact.isOnline ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Online
                  </>
                ) : (
                  selectedContact.lastSeen
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Phone className="h-5 w-5 text-gray-600" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Video className="h-5 w-5 text-gray-600" />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Contact List */}
      <AnimatePresence>
        {(showContactList || !isMobile) && (
          <motion.div
            initial={{ x: isMobile ? -300 : 0, opacity: isMobile ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isMobile ? -300 : 0, opacity: isMobile ? 0 : 1 }}
            className={`bg-white/95 backdrop-blur-md border-r border-gray-200/60 flex flex-col shadow-xl ${
              isMobile ? 'w-full absolute inset-y-0 z-20' : 'w-96 relative'
            }`}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200/60 bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg"
                  >
                    <MessageCircle className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">WhatsApp</h1>
                    <p className="text-sm text-gray-600">Business Central</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2.5 hover:bg-white/60 rounded-xl transition-colors shadow-md hover:shadow-lg"
                  >
                    <Settings className="h-5 w-5 text-gray-600" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2.5 hover:bg-white/60 rounded-xl transition-colors shadow-md hover:shadow-lg"
                  >
                    <Plus className="h-5 w-5 text-gray-600" />
                  </motion.button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white/80 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-gray-900">{totalContacts}</div>
                  <div className="text-xs text-gray-600">Contatos</div>
                </div>
                <div className="bg-white/80 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-orange-600">{unreadCount}</div>
                  <div className="text-xs text-gray-600">Não lidas</div>
                </div>
                <div className="bg-white/80 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-green-600">{onlineCount}</div>
                  <div className="text-xs text-gray-600">Online</div>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar conversas, telefones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/90 border border-gray-200/60 rounded-2xl text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-500 shadow-md focus:shadow-lg transition-all duration-200"
                />
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white border border-gray-200/60 rounded-xl text-sm font-medium text-gray-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Bot className="h-4 w-4 text-green-600" />
                  Templates
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white border border-gray-200/60 rounded-xl text-sm font-medium text-gray-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <QrCode className="h-4 w-4 text-blue-600" />
                  QR Code
                </motion.button>
              </div>
            </div>

            {/* Contact List */}
            <div className="flex-1 overflow-y-auto p-2">
              <div className="space-y-2">
                {filteredContacts.map((contact, index) => (
                  <motion.button
                    key={contact.id}
                    onClick={() => handleSelectContact(contact)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 rounded-2xl text-left transition-all duration-300 relative group ${
                      selectedContact?.id === contact.id
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 shadow-lg'
                        : 'hover:bg-white/80 border border-transparent hover:shadow-md'
                    }`}
                  >
                    {/* Pin indicator */}
                    {contact.isPinned && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 right-3"
                      >
                        <Pin className="h-3 w-3 text-green-600" />
                      </motion.div>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className={`w-14 h-14 bg-gradient-to-r ${getContactTypeColor(contact.type)} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                          {contact.name.charAt(0)}
                        </div>
                        {contact.isOnline && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-3 border-white rounded-full shadow-md"
                          />
                        )}
                        {contact.unreadCount > 0 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md"
                          >
                            {contact.unreadCount}
                          </motion.div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-gray-900 truncate text-base">{contact.name}</h3>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {contact.lastSeen}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 truncate leading-relaxed">
                          {contact.lastMessage}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex gap-1">
                            {contact.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                            {contact.tags.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{contact.tags.length - 2}
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-gray-500">{contact.phone}</div>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${isMobile && showContactList ? 'hidden' : ''}`}>
        {selectedContact ? (
          <>
            {/* Chat Header - Desktop Only */}
            {!isMobile && (
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white/95 backdrop-blur-md border-b border-gray-200/60 p-6 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className={`w-12 h-12 bg-gradient-to-r ${getContactTypeColor(selectedContact.type)} rounded-2xl flex items-center justify-center text-white font-bold shadow-lg`}>
                      {selectedContact.name.charAt(0)}
                    </div>
                    {selectedContact.isOnline && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-3 border-white rounded-full"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{selectedContact.name}</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500">
                        {selectedContact.isOnline ? 'Online agora' : selectedContact.lastSeen}
                      </p>
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-1 text-xs text-green-600"
                        >
                          <div className="flex gap-1">
                            <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce" />
                            <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                          digitando...
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 hover:bg-gray-100 rounded-xl transition-colors shadow-md hover:shadow-lg"
                  >
                    <Phone className="h-5 w-5 text-gray-600" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 hover:bg-gray-100 rounded-xl transition-colors shadow-md hover:shadow-lg"
                  >
                    <Video className="h-5 w-5 text-gray-600" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 hover:bg-gray-100 rounded-xl transition-colors shadow-md hover:shadow-lg"
                  >
                    <MoreVertical className="h-5 w-5 text-gray-600" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Messages */}
            <div className={`flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white/50 ${isMobile ? 'pt-24' : ''}`}>
              <AnimatePresence>
                {messages.filter(msg => msg.contactId === selectedContact.id).map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${message.isFromMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl shadow-lg ${
                      message.isFromMe
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white rounded-br-md'
                        : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <div className={`flex items-center gap-2 mt-2 ${
                        message.isFromMe ? 'justify-end' : 'justify-start'
                      }`}>
                        <span className={`text-xs ${
                          message.isFromMe ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {message.isFromMe && (
                          <div className="text-green-100">
                            {message.status === 'read' && <CheckCheck className="h-3 w-3" />}
                            {message.status === 'delivered' && <CheckCheck className="h-3 w-3 opacity-60" />}
                            {message.status === 'sent' && <Check className="h-3 w-3 opacity-60" />}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Templates Modal */}
            <AnimatePresence>
              {showTemplates && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 p-4"
                  onClick={() => setShowTemplates(false)}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 20 }}
                    className="bg-white rounded-3xl p-8 w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900">Templates IPÊ</h3>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowTemplates(false)}
                        className="p-2 hover:bg-gray-100 rounded-xl"
                      >
                        ✕
                      </motion.button>
                    </div>

                    <div className="space-y-4">
                      {templates.map((template, index) => (
                        <motion.button
                          key={template.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleUseTemplate(template)}
                          className="w-full p-4 bg-gradient-to-r from-gray-50 to-green-50 hover:from-green-50 hover:to-emerald-50 rounded-2xl text-left transition-all duration-200 border border-gray-200 hover:border-green-200 shadow-md hover:shadow-lg group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                                {template.name}
                              </h4>
                              <p className="text-sm text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                                {template.content.replace(/\\n/g, ' ').replace(/\*/g, '')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                              {template.category}
                            </span>
                            <span className="text-xs text-gray-500">
                              {template.variables.length} variáveis
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message Input */}
            <div className="bg-white/95 backdrop-blur-md border-t border-gray-200/60 p-6 shadow-xl">
              <div className="flex items-end gap-4">
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 hover:bg-gray-100 rounded-xl transition-colors shadow-md hover:shadow-lg"
                  >
                    <Paperclip className="h-5 w-5 text-gray-600" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 hover:bg-gray-100 rounded-xl transition-colors shadow-md hover:shadow-lg"
                  >
                    <ImageIcon className="h-5 w-5 text-gray-600" />
                  </motion.button>
                </div>

                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Mensagem para ${selectedContact.name}...`}
                    className="w-full max-h-32 p-4 pr-14 border border-gray-300 rounded-2xl resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-md focus:shadow-lg transition-all duration-200 bg-white/90"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <Smile className="h-5 w-5 text-gray-600" />
                  </motion.button>
                </div>

                <div className="flex gap-2">
                  {newMessage.trim() ? (
                    <motion.button
                      onClick={handleSendMessage}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Send className="h-5 w-5" />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-4 hover:bg-gray-100 rounded-2xl transition-colors shadow-md hover:shadow-lg"
                    >
                      <Mic className="h-5 w-5 text-gray-600" />
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="flex items-center justify-center gap-4 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTemplates(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl transition-colors shadow-md"
                >
                  <Bot className="h-4 w-4" />
                  Templates
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-colors shadow-md"
                >
                  <Building2 className="h-4 w-4" />
                  Imóveis
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-xl transition-colors shadow-md"
                >
                  <Calculator className="h-4 w-4" />
                  Alíquotas
                </motion.button>
              </div>
            </div>
          </>
        ) : (
          // Welcome Screen Tier S
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex items-center justify-center bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-sm"
          >
            <div className="text-center max-w-md mx-auto">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-32 h-32 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
              >
                <MessageCircle className="h-16 w-16 text-white" />
              </motion.div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-gray-900 mb-3"
              >
                WhatsApp Business
              </motion.h2>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 mb-8 leading-relaxed"
              >
                Central de comunicação profissional.<br />
                Selecione uma conversa para começar.
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 gap-4 text-sm"
              >
                <div className="flex items-center justify-center gap-3 p-4 bg-white/80 rounded-2xl shadow-md">
                  <Zap className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700 font-medium">Respostas automáticas</span>
                </div>
                <div className="flex items-center justify-center gap-3 p-4 bg-white/80 rounded-2xl shadow-md">
                  <Bot className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-700 font-medium">Templates personalizados</span>
                </div>
                <div className="flex items-center justify-center gap-3 p-4 bg-white/80 rounded-2xl shadow-md">
                  <Users className="h-5 w-5 text-purple-500" />
                  <span className="text-gray-700 font-medium">Gestão inteligente de contatos</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
        </div>
      )}

      {activeTab === 'bot' && (
        <BotConfiguration />
      )}

      {activeTab === 'users' && (
        <UserManagement />
      )}
    </div>
  )
}