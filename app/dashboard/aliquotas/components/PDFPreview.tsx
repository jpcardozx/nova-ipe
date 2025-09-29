'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye,
  Download,
  Send,
  X,
  FileText,
  Calendar,
  Building2,
  DollarSign,
  User,
  Phone,
  Mail,
  MapPin,
  Printer,
  Share2,
  CheckCircle,
  MessageSquare
} from 'lucide-react'

interface Property {
  id: string
  address: string
  tenant: string
  currentRent: number
  iptu: number
  referenceRate: number
  newRent: number
  status: 'pending' | 'approved' | 'sent'
  lastUpdate: string
}

interface Client {
  id: string
  name: string
  email: string
  phone: string
  document?: string
  address?: string
  city?: string
  state?: string
}

interface PDFPreviewProps {
  isOpen: boolean
  onClose: () => void
  properties: Property[]
  client?: Client | null
  onDownload: () => void
  onSend: () => void
  isGenerating?: boolean
}

export default function PDFPreview({
  isOpen,
  onClose,
  properties,
  client,
  onDownload,
  onSend,
  isGenerating = false
}: PDFPreviewProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(properties.length / 3) + 1 // 3 properties per page + cover

  if (!isOpen) return null

  const currentDate = new Date()
  const month = currentDate.toLocaleString('pt-BR', { month: 'long' })
  const year = currentDate.getFullYear()

  const totalCurrentRent = properties.reduce((sum, p) => sum + p.currentRent, 0)
  const totalNewRent = properties.reduce((sum, p) => sum + p.newRent, 0)
  const totalIncrease = totalNewRent - totalCurrentRent

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
          className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left Panel - Controls */}
          <div className="w-80 border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Preview PDF</h3>
                    <p className="text-sm text-gray-600">Reajuste de Aluguel</p>
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

              {/* Document Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-600" />
                  <span className="text-gray-700">Período: {month}/{year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-orange-600" />
                  <span className="text-gray-700">{properties.length} imóveis</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-orange-600" />
                  <span className="text-gray-700">+R$ {totalIncrease.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </div>

            {/* Client Info */}
            {client && (
              <div className="p-6 border-b border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Destinatário
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="font-medium text-gray-900">{client.name}</div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-3 w-3" />
                    {client.email}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-3 w-3" />
                    {client.phone}
                  </div>
                  {client.address && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span className="text-xs">{client.address}, {client.city}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Page Navigation */}
            <div className="p-6 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Navegação</h4>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">
                  Página {currentPage} de {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ←
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    →
                  </motion.button>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentPage / totalPages) * 100}%` }}
                  className="bg-orange-500 h-1 rounded-full"
                />
              </div>
            </div>

            {/* Properties Summary */}
            <div className="flex-1 p-6 overflow-y-auto">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Imóveis Inclusos</h4>
              <div className="space-y-3">
                {properties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-50 rounded-lg p-3 text-xs"
                  >
                    <div className="font-medium text-gray-900 mb-1">
                      {property.address}
                    </div>
                    <div className="text-gray-600">
                      Inquilino: {property.tenant}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-500">
                        R$ {property.currentRent.toLocaleString('pt-BR')}
                      </span>
                      <span className="text-green-600 font-medium">
                        → R$ {property.newRent.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onDownload}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Baixar PDF
                    </>
                  )}
                </motion.button>

                {client && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onSend}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Enviar via WhatsApp
                  </motion.button>
                )}

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                  >
                    <Printer className="h-4 w-4" />
                    Imprimir
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                  >
                    <Share2 className="h-4 w-4" />
                    Compartilhar
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - PDF Preview */}
          <div className="flex-1 bg-gray-100 flex flex-col">
            {/* Preview Header */}
            <div className="p-4 bg-white border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">
                  {currentPage === 1 ? 'Capa do Documento' : `Página ${currentPage} - Imóveis`}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Zoom:</span>
                  <select className="text-sm border border-gray-300 rounded px-2 py-1">
                    <option>100%</option>
                    <option>125%</option>
                    <option>150%</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-auto p-8 flex justify-center">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white shadow-xl rounded-lg w-full max-w-[210mm] min-h-[297mm] p-8"
                style={{ aspectRatio: '210/297' }}
              >
                {currentPage === 1 ? (
                  /* Cover Page with Official Letterhead */
                  <div className="h-full flex flex-col">
                    {/* Official Letterhead Header */}
                    <div className="relative mb-8">
                      {/* Orange Header Bar */}
                      <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-r from-orange-400 to-yellow-400"></div>

                      {/* Main Header Content */}
                      <div className="relative pt-16 pb-6 border-b border-gray-300">
                        <div className="flex items-center justify-between">
                          {/* Logo and Company Name */}
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-full flex items-center justify-center">
                              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L2 7v10c0 5.55 3.84 9.95 9 11 5.16-1.05 9-5.45 9-11V7l-10-5z"/>
                                <circle cx="12" cy="10" r="3"/>
                                <path d="M12 13c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/>
                              </svg>
                            </div>
                            <div>
                              <h1 className="text-3xl font-bold text-gray-900">IPÊ</h1>
                              <h2 className="text-2xl font-bold text-gray-700">IMÓVEIS</h2>
                            </div>
                          </div>

                          {/* Address */}
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">CONHEÇA NOSSA SEDE:</div>
                            <div className="text-gray-700">Praça 9 de Julho, nº 65, Centro</div>
                          </div>
                        </div>

                        {/* Document Title */}
                        <div className="mt-6 text-center">
                          <h3 className="text-xl font-bold text-gray-900">
                            COMUNICADO DE REAJUSTE DE ALUGUEL
                          </h3>
                          <p className="text-gray-600 mt-2">{month}/{year}</p>
                        </div>
                      </div>
                    </div>

                    {/* Document Info */}
                    <div className="flex-1 space-y-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                          Reajuste de Aluguel - {month}/{year}
                        </h2>
                      </div>

                      {client && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-900 mb-3">Destinatário:</h3>
                          <div className="space-y-1 text-sm">
                            <div><strong>Nome:</strong> {client.name}</div>
                            <div><strong>Email:</strong> {client.email}</div>
                            <div><strong>Telefone:</strong> {client.phone}</div>
                            {client.address && (
                              <div><strong>Endereço:</strong> {client.address}, {client.city}</div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                        <h3 className="font-semibold text-orange-900 mb-3">Resumo do Reajuste:</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-600">Imóveis:</div>
                            <div className="font-semibold text-gray-900">{properties.length}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Valor Total Atual:</div>
                            <div className="font-semibold text-gray-900">
                              R$ {totalCurrentRent.toLocaleString('pt-BR')}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600">Novo Valor Total:</div>
                            <div className="font-semibold text-green-600">
                              R$ {totalNewRent.toLocaleString('pt-BR')}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600">Aumento Total:</div>
                            <div className="font-semibold text-green-600">
                              +R$ {totalIncrease.toLocaleString('pt-BR')}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 leading-relaxed">
                        <p>
                          Este documento apresenta os detalhes do reajuste de aluguel conforme
                          as taxas de referência vigentes e valores de IPTU atualizados.
                        </p>
                        <p className="mt-2">
                          Para mais informações ou esclarecimentos, entre em contato conosco.
                        </p>
                      </div>
                    </div>

                    {/* Footer with Official Letterhead */}
                    <div className="relative">
                      {/* Orange Footer Bar */}
                      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-r from-orange-400 to-yellow-400"></div>

                      <div className="border-t border-gray-300 pt-4 pb-12 text-center text-sm text-gray-600">
                        <div className="mb-2">
                          <p className="font-semibold">IPÊ IMÓVEIS</p>
                          <p>Praça 9 de Julho, nº 65, Centro</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          Documento gerado em {new Date().toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Properties Page with Letterhead */
                  <div className="h-full flex flex-col">
                    {/* Page Header with Mini Letterhead */}
                    <div className="relative mb-6">
                      <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-orange-400 to-yellow-400"></div>

                      <div className="pt-6 pb-4 border-b border-gray-300 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2L2 7v10c0 5.55 3.84 9.95 9 11 5.16-1.05 9-5.45 9-11V7l-10-5z"/>
                              <circle cx="12" cy="10" r="3"/>
                              <path d="M12 13c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/>
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">IPÊ IMÓVEIS</div>
                            <div className="text-xs text-gray-600">Praça 9 de Julho, nº 65, Centro</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <h2 className="text-lg font-bold text-gray-900">
                            Detalhamento - Página {currentPage - 1}
                          </h2>
                          <p className="text-gray-600 text-sm">{month}/{year}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 space-y-6">
                      {properties.slice((currentPage - 2) * 3, (currentPage - 1) * 3).map((property, index) => (
                        <div key={property.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{property.address}</h3>
                              <p className="text-sm text-gray-600">Inquilino: {property.tenant}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500">Código</div>
                              <div className="font-mono text-sm">{property.id}</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-600">Aluguel Atual:</div>
                              <div className="font-semibold">R$ {property.currentRent.toLocaleString('pt-BR')}</div>
                            </div>
                            <div>
                              <div className="text-gray-600">IPTU:</div>
                              <div className="font-semibold">R$ {property.iptu.toLocaleString('pt-BR')}</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Taxa de Referência:</div>
                              <div className="font-semibold">{(property.referenceRate * 100).toFixed(2)}%</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Novo Aluguel:</div>
                              <div className="font-semibold text-green-600">
                                R$ {property.newRent.toLocaleString('pt-BR')}
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Aumento:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-green-600">
                                  +R$ {(property.newRent - property.currentRent).toLocaleString('pt-BR')}
                                </span>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  {(((property.newRent - property.currentRent) / property.currentRent) * 100).toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-300 pt-4 text-center text-xs text-gray-500">
                      <p>Página {currentPage} de {totalPages}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}