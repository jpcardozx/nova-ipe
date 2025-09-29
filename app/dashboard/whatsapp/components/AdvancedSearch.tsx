'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Calendar,
  User,
  MessageSquare,
  Tag,
  Clock,
  X,
  ChevronDown
} from 'lucide-react'

interface SearchFilters {
  query: string
  dateRange: {
    start: string
    end: string
  }
  contactType: string[]
  messageType: string[]
  tags: string[]
  status: string[]
}

interface AdvancedSearchProps {
  isOpen: boolean
  onClose: () => void
  onSearch: (filters: SearchFilters) => void
  contacts: any[]
}

export default function AdvancedSearch({ isOpen, onClose, onSearch, contacts }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    dateRange: { start: '', end: '' },
    contactType: [],
    messageType: [],
    tags: [],
    status: []
  })

  const [activeTab, setActiveTab] = useState<'search' | 'filters' | 'advanced'>('search')

  const contactTypes = ['client', 'lead', 'property_owner', 'other']
  const messageTypes = ['text', 'image', 'file', 'audio']
  const availableTags = [...new Set(contacts.flatMap(c => c.tags))]
  const statusOptions = ['sent', 'delivered', 'read']

  const handleSearch = () => {
    onSearch(filters)
    onClose()
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      dateRange: { start: '', end: '' },
      contactType: [],
      messageType: [],
      tags: [],
      status: []
    })
  }

  const toggleFilter = (category: keyof SearchFilters, value: string) => {
    if (category === 'query') return

    setFilters(prev => ({
      ...prev,
      [category]: Array.isArray(prev[category])
        ? (prev[category] as string[]).includes(value)
          ? (prev[category] as string[]).filter(item => item !== value)
          : [...(prev[category] as string[]), value]
        : prev[category]
    }))
  }

  const getFilterColor = (category: string) => {
    switch (category) {
      case 'client': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'lead': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'property_owner': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'text': return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'image': return 'bg-green-100 text-green-700 border-green-200'
      case 'file': return 'bg-red-100 text-red-700 border-red-200'
      case 'audio': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'sent': return 'bg-blue-50 text-blue-600 border-blue-200'
      case 'delivered': return 'bg-yellow-50 text-yellow-600 border-yellow-200'
      case 'read': return 'bg-green-50 text-green-600 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Search className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Busca Avançada</h2>
                  <p className="text-sm text-gray-600">Encontre conversas e mensagens específicas</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-white rounded-xl transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </motion.button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-4">
              {[
                { id: 'search', label: 'Busca', icon: Search },
                { id: 'filters', label: 'Filtros', icon: Filter },
                { id: 'advanced', label: 'Avançado', icon: MessageSquare }
              ].map(tab => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-md border border-blue-200'
                      : 'text-gray-600 hover:bg-white/60'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <AnimatePresence mode="wait">
              {activeTab === 'search' && (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Main Search */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Buscar por mensagem ou contato
                    </label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Digite sua busca..."
                        value={filters.query}
                        onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all text-lg"
                      />
                    </div>
                  </div>

                  {/* Quick Filters */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Filtros Rápidos</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFilters(prev => ({ ...prev, query: 'não lidas' }))}
                        className="p-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl text-red-700 font-medium transition-colors"
                      >
                        📬 Não Lidas
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFilters(prev => ({ ...prev, query: 'hoje' }))}
                        className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-blue-700 font-medium transition-colors"
                      >
                        📅 Hoje
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFilters(prev => ({ ...prev, contactType: ['client'] }))}
                        className="p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl text-green-700 font-medium transition-colors"
                      >
                        👤 Clientes
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFilters(prev => ({ ...prev, contactType: ['lead'] }))}
                        className="p-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl text-orange-700 font-medium transition-colors"
                      >
                        🎯 Leads
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'filters' && (
                <motion.div
                  key="filters"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Período
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Data Inicial</label>
                        <input
                          type="date"
                          value={filters.dateRange.start}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            dateRange: { ...prev.dateRange, start: e.target.value }
                          }))}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Data Final</label>
                        <input
                          type="date"
                          value={filters.dateRange.end}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            dateRange: { ...prev.dateRange, end: e.target.value }
                          }))}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Types */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Tipo de Contato
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {contactTypes.map(type => (
                        <motion.button
                          key={type}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleFilter('contactType', type)}
                          className={`px-3 py-2 rounded-xl border font-medium transition-all ${
                            filters.contactType.includes(type)
                              ? getFilterColor(type)
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {type === 'client' && '👤 Cliente'}
                          {type === 'lead' && '🎯 Lead'}
                          {type === 'property_owner' && '🏠 Proprietário'}
                          {type === 'other' && '📝 Outro'}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Message Types */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Tipo de Mensagem
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {messageTypes.map(type => (
                        <motion.button
                          key={type}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleFilter('messageType', type)}
                          className={`px-3 py-2 rounded-xl border font-medium transition-all ${
                            filters.messageType.includes(type)
                              ? getFilterColor(type)
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {type === 'text' && '💬 Texto'}
                          {type === 'image' && '🖼️ Imagem'}
                          {type === 'file' && '📎 Arquivo'}
                          {type === 'audio' && '🎵 Áudio'}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'advanced' && (
                <motion.div
                  key="advanced"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Tags dos Contatos
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {availableTags.map(tag => (
                        <motion.button
                          key={tag}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleFilter('tags', tag)}
                          className={`px-3 py-1.5 rounded-full text-sm border font-medium transition-all ${
                            filters.tags.includes(tag)
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          #{tag}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Message Status */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Status da Mensagem
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {statusOptions.map(status => (
                        <motion.button
                          key={status}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleFilter('status', status)}
                          className={`px-3 py-2 rounded-xl border font-medium transition-all ${
                            filters.status.includes(status)
                              ? getFilterColor(status)
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {status === 'sent' && '📤 Enviado'}
                          {status === 'delivered' && '📨 Entregue'}
                          {status === 'read' && '👁️ Lido'}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Advanced Options */}
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Opções Avançadas</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                        <span className="text-sm text-gray-600">Incluir mensagens arquivadas</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                        <span className="text-sm text-gray-600">Busca sensível a maiúsculas</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                        <span className="text-sm text-gray-600">Incluir anexos na busca</span>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Limpar Filtros
              </motion.button>
              <span className="text-sm text-gray-500">
                {Object.values(filters).flat().filter(Boolean).length} filtros ativos
              </span>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearch}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                Buscar
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}