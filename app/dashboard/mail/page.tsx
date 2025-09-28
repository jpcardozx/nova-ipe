'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Plus,
  Send,
  Edit,
  Inbox,
  Archive,
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
  AlertCircle
} from 'lucide-react'

interface Email {
  id: string
  from: string
  subject: string
  preview: string
  timestamp: string
  isRead: boolean
  isStarred: boolean
  hasAttachment: boolean
}

const mockEmails: Email[] = [
  {
    id: '1',
    from: 'cliente@email.com',
    subject: 'Interesse em imóvel na região central',
    preview: 'Olá, gostaria de mais informações sobre o apartamento anunciado...',
    timestamp: '10:30',
    isRead: false,
    isStarred: true,
    hasAttachment: false
  },
  {
    id: '2',
    from: 'fornecedor@empresa.com',
    subject: 'Proposta de parceria comercial',
    preview: 'Prezados, gostaríamos de apresentar nossa proposta...',
    timestamp: '09:15',
    isRead: true,
    isStarred: false,
    hasAttachment: true
  },
  {
    id: '3',
    from: 'leads@jetimob.com',
    subject: 'Novo lead: Apartamento 2 dormitórios',
    preview: 'Cliente interessado em apartamento de 2 dormitórios...',
    timestamp: '08:45',
    isRead: false,
    isStarred: false,
    hasAttachment: false
  }
]

interface Draft {
  id: string
  to: string
  subject: string
  message: string
  savedAt: string
}

export default function DashboardMail() {
  const [view, setView] = useState<'inbox' | 'compose'>('inbox')
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFolder, setSelectedFolder] = useState('inbox')
  
  // Draft functionality
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [currentDraft, setCurrentDraft] = useState({
    to: '',
    subject: '',
    message: ''
  })

  const saveDraft = () => {
    if (!currentDraft.to && !currentDraft.subject && !currentDraft.message) return
    
    const draft: Draft = {
      id: Date.now().toString(),
      ...currentDraft,
      savedAt: new Date().toLocaleTimeString()
    }
    
    setDrafts(prev => [draft, ...prev])
    // Reset form after saving
    setCurrentDraft({ to: '', subject: '', message: '' })
    // Show success message (you can add toast here)
    alert('Rascunho salvo com sucesso!')
  }

  const filteredEmails = useMemo(() => {
    return mockEmails.filter(email => 
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  const unreadCount = mockEmails.filter(email => !email.isRead).length

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
      className="p-6 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur-xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
                <Mail className="h-7 w-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Central de E-mails
              </h1>
              <p className="text-gray-600 mt-1">Gerencie comunicações e mantenha relacionamentos</p>
              {unreadCount > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-red-600 font-medium">
                    {unreadCount} mensagens não lidas
                  </span>
                </div>
              )}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setView('compose')}
            className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Novo E-mail
            </div>
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Sidebar */}
        <motion.div
          variants={itemVariants}
          className="xl:col-span-1"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="space-y-3">
              {[
                { key: 'inbox', icon: Inbox, label: 'Caixa de Entrada', count: unreadCount, active: true },
                { key: 'sent', icon: Send, label: 'Enviados', count: 0 },
                { key: 'drafts', icon: Edit, label: 'Rascunhos', count: 2 },
                { key: 'starred', icon: Star, label: 'Favoritos', count: 0 },
                { key: 'archived', icon: Archive, label: 'Arquivados', count: 0 },
              ].map((folder) => {
                const IconComponent = folder.icon
                const isActive = selectedFolder === folder.key
                
                return (
                  <motion.button
                    key={folder.key}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedFolder(folder.key)
                      if (folder.key === 'inbox') setView('inbox')
                    }}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-300 group ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                        : 'hover:bg-blue-50 text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    <IconComponent className={`h-5 w-5 transition-colors ${
                      isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-500'
                    }`} />
                    <span className="font-medium flex-1">{folder.label}</span>
                    {folder.count > 0 && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          isActive 
                            ? 'bg-white/20 text-white' 
                            : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        {folder.count}
                      </motion.span>
                    )}
                  </motion.button>
                )
              })}
            </div>
            
            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Ações Rápidas
              </h3>
              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-gray-50 text-gray-600 hover:text-gray-800 transition-all duration-200"
                >
                  <Filter className="h-4 w-4" />
                  <span className="text-sm">Filtros Avançados</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-gray-50 text-gray-600 hover:text-gray-800 transition-all duration-200"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Marcar como Lidas</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Conteúdo Principal */}
        <motion.div
          variants={itemVariants}
          className="xl:col-span-4"
        >
          <AnimatePresence mode="wait">
            {view === 'inbox' ? (
              <motion.div
                key="inbox"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
              >
                {/* Header da lista */}
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Caixa de Entrada</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {filteredEmails.length} mensagens • {unreadCount} não lidas
                      </p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Buscar e-mails..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full sm:w-80 pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <Filter className="h-4 w-4 text-gray-600" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Lista de emails */}
                <div className="overflow-hidden">
                  <AnimatePresence>
                    {filteredEmails.length > 0 ? (
                      filteredEmails.map((email, index) => (
                        <motion.div
                          key={email.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ x: 4, scale: 1.01 }}
                          onClick={() => setSelectedEmail(email)}
                          className={`relative p-6 cursor-pointer transition-all duration-300 border-b border-gray-100 last:border-b-0 group ${
                            !email.isRead 
                              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100' 
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          {/* Indicador de não lida */}
                          {!email.isRead && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"
                            />
                          )}
                          
                          <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              !email.isRead 
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' 
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              <User className="h-5 w-5" />
                            </div>
                            
                            {/* Conteúdo do email */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`font-semibold truncate ${
                                  !email.isRead ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                  {email.from}
                                </span>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Clock className="h-3 w-3" />
                                    {email.timestamp}
                                  </div>
                                  {email.isStarred && (
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                  )}
                                  {email.hasAttachment && (
                                    <Paperclip className="h-4 w-4 text-gray-400" />
                                  )}
                                </div>
                              </div>
                              <h3 className={`text-base mb-2 truncate ${
                                !email.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-800'
                              }`}>
                                {email.subject}
                              </h3>
                              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                {email.preview}
                              </p>
                            </div>
                            
                            {/* Ações */}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 hover:bg-gray-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              onClick={(e) => {
                                e.stopPropagation()
                              }}
                            >
                              <MoreVertical className="h-4 w-4 text-gray-500" />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-12 text-center"
                      >
                        <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Nenhum e-mail encontrado
                        </h3>
                        <p className="text-gray-600">
                          {searchTerm ? 'Tente ajustar sua busca' : 'Sua caixa de entrada está vazia'}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              /* Composer de Email */
              <motion.div
                key="compose"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Novo E-mail</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setView('inbox')}
                    className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    ✕
                  </motion.button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Para</label>
                    <input
                      type="email"
                      placeholder="destinatario@email.com"
                      value={currentDraft.to}
                      onChange={(e) => setCurrentDraft(prev => ({ ...prev, to: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Assunto</label>
                    <input
                      type="text"
                      placeholder="Assunto do e-mail"
                      value={currentDraft.subject}
                      onChange={(e) => setCurrentDraft(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mensagem</label>
                    <textarea
                      rows={12}
                      placeholder="Escreva sua mensagem..."
                      value={currentDraft.message}
                      onChange={(e) => setCurrentDraft(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
                      >
                        <Paperclip className="h-4 w-4" />
                        Anexar arquivo
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
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                      >
                        <Send className="h-4 w-4" />
                        Enviar
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal de detalhes do email */}
      <AnimatePresence>
        {selectedEmail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedEmail(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header do modal */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedEmail.subject}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-medium">De: {selectedEmail.from}</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {selectedEmail.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {[
                      { icon: Reply, label: 'Responder', color: 'text-blue-600' },
                      { icon: Forward, label: 'Encaminhar', color: 'text-green-600' },
                      { icon: Star, label: 'Favoritar', color: 'text-yellow-500' },
                      { icon: Trash2, label: 'Excluir', color: 'text-red-600' },
                    ].map((action, index) => {
                      const IconComponent = action.icon
                      return (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.9 }}
                          className={`p-3 hover:bg-white rounded-xl transition-all duration-200 ${action.color}`}
                          title={action.label}
                        >
                          <IconComponent className="h-5 w-5" />
                        </motion.button>
                      )
                    })}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedEmail(null)}
                      className="p-3 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </motion.button>
                  </div>
                </div>
              </div>
              
              {/* Conteúdo do email */}
              <div className="p-8 overflow-y-auto max-h-[60vh]">
                <div className="prose max-w-none">
                  <p className="text-gray-800 leading-relaxed text-base mb-6">
                    {selectedEmail.preview}
                  </p>
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <p className="text-gray-700 leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p className="text-gray-700 leading-relaxed mt-4">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                  </div>
                  <div className="text-gray-600">
                    <p>Atenciosamente,</p>
                    <p className="font-semibold mt-2">{selectedEmail.from.split('@')[0]}</p>
                  </div>
                </div>
              </div>
              
              {/* Footer com ações rápidas */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Reply className="h-4 w-4" />
                      Responder
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    >
                      <Forward className="h-4 w-4" />
                      Encaminhar
                    </motion.button>
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedEmail.hasAttachment && (
                      <div className="flex items-center gap-1">
                        <Paperclip className="h-4 w-4" />
                        <span>1 anexo</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}