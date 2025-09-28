'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle,
  Plus,
  Send,
  Edit,
  Search,
  Star,
  Paperclip,
  MoreVertical,
  Reply,
  Forward,
  Trash2,
  Filter,
  ChevronDown,
  Clock,
  User,
  AlertCircle,
  Phone,
  Video,
  Smile
} from 'lucide-react'

interface WhatsAppMessage {
  id: string
  contact: string
  phone: string
  lastMessage: string
  timestamp: string
  isRead: boolean
  isOnline: boolean
  avatar?: string
}

interface Draft {
  id: string
  contact: string
  phone: string
  message: string
  savedAt: string
}

const mockContacts: WhatsAppMessage[] = [
  {
    id: '1',
    contact: 'Maria Silva',
    phone: '(11) 99999-1234',
    lastMessage: 'Olá, gostaria de mais informações sobre o apartamento...',
    timestamp: '10:30',
    isRead: false,
    isOnline: true
  },
  {
    id: '2',
    contact: 'João Santos',
    phone: '(11) 98888-5678',
    lastMessage: 'Quando posso agendar uma visita?',
    timestamp: '09:15',
    isRead: true,
    isOnline: false
  },
  {
    id: '3',
    contact: 'Ana Costa',
    phone: '(11) 97777-9012',
    lastMessage: 'Obrigada pelas informações!',
    timestamp: '08:45',
    isRead: true,
    isOnline: true
  }
]

const messageTemplates = [
  'Olá! Como posso ajudá-lo hoje?',
  'Temos várias opções de imóveis que podem interessar você.',
  'Gostaria de agendar uma visita ao imóvel?',
  'Obrigado pelo interesse! Vou verificar a disponibilidade.',
  'Posso enviar mais detalhes sobre o imóvel por aqui mesmo.'
]

export default function DashboardWhatsApp() {
  const [view, setView] = useState<'contacts' | 'compose'>('contacts')
  const [selectedContact, setSelectedContact] = useState<WhatsAppMessage | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Draft functionality
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [currentDraft, setCurrentDraft] = useState({
    contact: '',
    phone: '',
    message: ''
  })

  const filteredContacts = useMemo(() => {
    return mockContacts.filter(contact => 
      contact.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      contact.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  const unreadCount = mockContacts.filter(contact => !contact.isRead).length

  const saveDraft = () => {
    if (!currentDraft.contact && !currentDraft.phone && !currentDraft.message) return
    
    const draft: Draft = {
      id: Date.now().toString(),
      ...currentDraft,
      savedAt: new Date().toLocaleTimeString()
    }
    
    setDrafts(prev => [draft, ...prev])
    setCurrentDraft({ contact: '', phone: '', message: '' })
    alert('Rascunho de WhatsApp salvo com sucesso!')
  }

  const sendWhatsApp = () => {
    if (!currentDraft.phone || !currentDraft.message) return
    
    const phone = currentDraft.phone.replace(/\D/g, '')
    const whatsappUrl = `https://wa.me/55${phone}?text=${encodeURIComponent(currentDraft.message)}`
    window.open(whatsappUrl, '_blank')
    
    // Reset form after sending
    setCurrentDraft({ contact: '', phone: '', message: '' })
  }

  const openWhatsAppChat = (contact: WhatsAppMessage) => {
    const phone = contact.phone.replace(/\D/g, '')
    const whatsappUrl = `https://wa.me/55${phone}`
    window.open(whatsappUrl, '_blank')
  }

  // Animações
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur-xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-xl">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                WhatsApp Business
              </h1>
              <p className="text-gray-600 mt-1">
                Gerencie conversas e envie mensagens para clientes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
              >
                {unreadCount} não lidas
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView(view === 'contacts' ? 'compose' : 'contacts')}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
            >
              {view === 'contacts' ? (
                <>
                  <Plus className="h-4 w-4" />
                  Nova Mensagem
                </>
              ) : (
                <>
                  <MessageCircle className="h-4 w-4" />
                  Ver Conversas
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Search bar */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="relative max-w-lg">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar contatos ou mensagens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder-gray-500"
          />
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <AnimatePresence mode="wait">
          {view === 'contacts' ? (
            /* Lista de Contatos */
            <motion.div
              key="contacts"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="divide-y divide-gray-100"
            >
              {/* Header da lista */}
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Conversas Recentes</h2>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Filtrar</span>
                  </div>
                </div>
              </div>

              {/* Lista de contatos */}
              <div className="max-h-[600px] overflow-y-auto">
                {filteredContacts.map((contact, index) => (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => openWhatsAppChat(contact)}
                    className="p-4 hover:bg-green-50 cursor-pointer transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          {contact.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                              {contact.contact}
                            </h3>
                            {!contact.isRead && (
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate max-w-md">{contact.lastMessage}</p>
                          <p className="text-xs text-gray-500 mt-1">{contact.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{contact.timestamp}</span>
                        <Phone className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Rascunhos salvos */}
              {drafts.length > 0 && (
                <div className="p-6 bg-yellow-50 border-t border-yellow-100">
                  <h3 className="font-semibold text-gray-900 mb-4">Rascunhos Salvos</h3>
                  <div className="space-y-2">
                    {drafts.map((draft, index) => (
                      <div key={draft.id} className="p-3 bg-white rounded-lg border border-yellow-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{draft.contact || draft.phone}</p>
                            <p className="text-sm text-gray-600 truncate max-w-md">{draft.message}</p>
                          </div>
                          <span className="text-xs text-gray-500">{draft.savedAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            /* Composer de WhatsApp */
            <motion.div
              key="compose"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Nova Mensagem WhatsApp</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setView('contacts')}
                  className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </motion.button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nome do Contato</label>
                  <input
                    type="text"
                    placeholder="Nome do cliente"
                    value={currentDraft.contact}
                    onChange={(e) => setCurrentDraft(prev => ({ ...prev, contact: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone</label>
                  <input
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={currentDraft.phone}
                    onChange={(e) => setCurrentDraft(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mensagem</label>
                  <textarea
                    rows={8}
                    placeholder="Digite sua mensagem..."
                    value={currentDraft.message}
                    onChange={(e) => setCurrentDraft(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all duration-200 resize-none"
                  />
                </div>

                {/* Templates de mensagem */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Templates Rápidos</label>
                  <div className="grid grid-cols-1 gap-2">
                    {messageTemplates.map((template, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentDraft(prev => ({ ...prev, message: template }))}
                        className="text-left p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg text-sm text-gray-700 transition-colors"
                      >
                        {template}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
                    >
                      <Smile className="h-4 w-4" />
                      Emoji
                    </motion.button>
                  </div>

                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={saveDraft}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    >
                      Salvar Rascunho
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={sendWhatsApp}
                      className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                    >
                      <Send className="h-4 w-4" />
                      Enviar WhatsApp
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}