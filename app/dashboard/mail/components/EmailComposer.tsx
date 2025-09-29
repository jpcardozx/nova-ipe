'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Edit,
  Eye,
  RefreshCw,
  FileText,
  Send,
  Save,
  Paperclip,
  Type,
  Bold,
  Italic,
  Underline,
  List,
  Link
} from 'lucide-react'

export interface EmailDraft {
  to: string
  subject: string
  message: string
  priority: 'low' | 'medium' | 'high'
  format: 'plain' | 'html'
}

interface EmailComposerProps {
  draft: EmailDraft
  onChange: (draft: EmailDraft) => void
  onSave: (autoSave?: boolean) => Promise<void>
  onSend: () => void
  isAutoSaving: boolean
  onTemplateSelect: () => void
}

export default function EmailComposer({
  draft,
  onChange,
  onSave,
  onSend,
  isAutoSaving,
  onTemplateSelect
}: EmailComposerProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [showToolbar, setShowToolbar] = useState(false)

  // Auto-save functionality
  useEffect(() => {
    if (draft.to || draft.subject || draft.message) {
      const timer = setTimeout(() => {
        onSave(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [draft, onSave])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta'
      case 'medium': return 'Média'
      case 'low': return 'Baixa'
      default: return 'Média'
    }
  }

  const insertText = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = draft.message.substring(start, end)
    const newText =
      draft.message.substring(0, start) +
      before + selectedText + after +
      draft.message.substring(end)

    onChange({ ...draft, message: newText })

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Edit className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Novo E-mail</h2>
              <p className="text-sm text-gray-600">Componha sua mensagem</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAutoSaving && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <RefreshCw className="h-3 w-3 animate-spin" />
                Salvando...
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`p-2 rounded-lg transition-colors ${
                isPreviewMode
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title={isPreviewMode ? 'Editar' : 'Visualizar'}
            >
              {isPreviewMode ? <Edit className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </motion.button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onTemplateSelect}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <FileText className="h-4 w-4" />
            Templates
          </motion.button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Prioridade:</span>
            <select
              value={draft.priority}
              onChange={(e) => onChange({
                ...draft,
                priority: e.target.value as 'low' | 'medium' | 'high'
              })}
              className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Formato:</span>
            <select
              value={draft.format}
              onChange={(e) => onChange({
                ...draft,
                format: e.target.value as 'plain' | 'html'
              })}
              className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="html">HTML</option>
              <option value="plain">Texto</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {isPreviewMode ? (
          /* Preview Mode */
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Preview do E-mail</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(draft.priority)}`}>
                  Prioridade {getPriorityLabel(draft.priority)}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Para: </span>
                  <span className="text-sm text-gray-900">{draft.to || 'destinatario@email.com'}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Assunto: </span>
                  <span className="text-sm text-gray-900 font-medium">{draft.subject || 'Sem assunto'}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="prose max-w-none">
                    {draft.format === 'html' ? (
                      <div
                        className="text-gray-800 leading-relaxed"
                        style={{ whiteSpace: 'pre-wrap' }}
                      >
                        {draft.message || 'Sua mensagem aparecerá aqui...'}
                      </div>
                    ) : (
                      <pre className="text-gray-800 leading-relaxed font-sans whitespace-pre-wrap">
                        {draft.message || 'Sua mensagem aparecerá aqui...'}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Para</label>
              <input
                type="email"
                placeholder="destinatario@email.com"
                value={draft.to}
                onChange={(e) => onChange({ ...draft, to: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Assunto</label>
              <input
                type="text"
                placeholder="Assunto do e-mail"
                value={draft.subject}
                onChange={(e) => onChange({ ...draft, subject: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">Mensagem</label>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowToolbar(!showToolbar)}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Type className="h-3 w-3" />
                  {showToolbar ? 'Ocultar' : 'Mostrar'} Formatação
                </motion.button>
              </div>

              {/* Formatting Toolbar */}
              {showToolbar && draft.format === 'html' && (
                <div className="mb-3 flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => insertText('**', '**')}
                    className="p-2 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800"
                    title="Negrito"
                  >
                    <Bold className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => insertText('*', '*')}
                    className="p-2 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800"
                    title="Itálico"
                  >
                    <Italic className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => insertText('- ', '')}
                    className="p-2 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800"
                    title="Lista"
                  >
                    <List className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => insertText('[texto](', ')')}
                    className="p-2 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800"
                    title="Link"
                  >
                    <Link className="h-4 w-4" />
                  </motion.button>
                </div>
              )}

              <textarea
                rows={12}
                placeholder="Escreva sua mensagem..."
                value={draft.message}
                onChange={(e) => onChange({ ...draft, message: e.target.value })}
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
                  onClick={() => onSave(false)}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  <Save className="h-4 w-4" />
                  Salvar Rascunho
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onSend}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                >
                  <Send className="h-4 w-4" />
                  Enviar
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}