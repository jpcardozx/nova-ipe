'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  X,
  Search,
  Tag,
  Star,
  Eye,
  Copy,
  Edit3
} from 'lucide-react'

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  category: 'formal' | 'followup' | 'property' | 'contract'
  isFavorite?: boolean
  usageCount?: number
}

interface EmailTemplatesProps {
  isOpen: boolean
  onClose: () => void
  templates: EmailTemplate[]
  onApplyTemplate: (template: EmailTemplate) => void
}

const templateCategories = {
  formal: { label: 'Formal', color: 'blue', icon: '🏢' },
  followup: { label: 'Follow-up', color: 'green', icon: '📞' },
  property: { label: 'Imóveis', color: 'purple', icon: '🏠' },
  contract: { label: 'Contratos', color: 'orange', icon: '📋' }
}

export default function EmailTemplates({
  isOpen,
  onClose,
  templates,
  onApplyTemplate
}: EmailTemplatesProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category: string) => {
    const colors = {
      formal: 'bg-blue-100 text-blue-800 border-blue-200',
      followup: 'bg-green-100 text-green-800 border-green-200',
      property: 'bg-purple-100 text-purple-800 border-purple-200',
      contract: 'bg-orange-100 text-orange-800 border-orange-200'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left Panel - Template List */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Templates de E-mail</h3>
                    <p className="text-sm text-gray-600">{filteredTemplates.length} templates disponíveis</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Category Filters */}
              <div className="flex gap-2 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    !selectedCategory
                      ? 'bg-gray-800 text-white border-gray-800'
                      : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  Todos
                </motion.button>
                {Object.entries(templateCategories).map(([key, category]) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      selectedCategory === key
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {category.icon} {category.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Template List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {filteredTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 4, scale: 1.02 }}
                    onClick={() => setSelectedTemplate(template)}
                    className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedTemplate?.id === template.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm">{template.name}</h4>
                      <div className="flex items-center gap-1">
                        {template.isFavorite && (
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(template.category)}`}>
                          {templateCategories[template.category].icon}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 font-medium">
                      Assunto: {template.subject}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {template.content.substring(0, 100)}...
                    </p>
                    {template.usageCount && (
                      <div className="mt-2 text-xs text-gray-400">
                        Usado {template.usageCount} vezes
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Template Preview */}
          <div className="w-1/2 flex flex-col">
            {selectedTemplate ? (
              <>
                {/* Preview Header */}
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{selectedTemplate.name}</h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(selectedTemplate.category)}`}>
                        {templateCategories[selectedTemplate.category].icon} {templateCategories[selectedTemplate.category].label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Copiar template"
                      >
                        <Copy className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Editar template"
                      >
                        <Edit3 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Assunto</label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                        <p className="text-sm text-gray-900">{selectedTemplate.subject}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Conteúdo</label>
                      <div className="mt-1 p-4 bg-gray-50 rounded-lg border max-h-64 overflow-y-auto">
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
                            {selectedTemplate.content}
                          </pre>
                        </div>
                      </div>
                    </div>

                    {/* Variables Help */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h5 className="text-sm font-medium text-blue-900 mb-2">Variáveis disponíveis:</h5>
                      <div className="text-xs text-blue-700 space-y-1">
                        <div><code>{'{CLIENT_NAME}'}</code> - Nome do cliente</div>
                        <div><code>{'{PROPERTY_ADDRESS}'}</code> - Endereço do imóvel</div>
                        <div><code>{'{PROPERTY_VALUE}'}</code> - Valor do imóvel</div>
                        <div><code>{'{AGENT_NAME}'}</code> - Nome do corretor</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-end gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClose}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        onApplyTemplate(selectedTemplate)
                        onClose()
                      }}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                    >
                      <FileText className="h-4 w-4" />
                      Usar Template
                    </motion.button>
                  </div>
                </div>
              </>
            ) : (
              /* No Template Selected */
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Selecione um template</h4>
                  <p className="text-gray-600">Escolha um template da lista para visualizar o conteúdo</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}