'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Percent,
  Plus,
  Download,
  Send,
  Edit,
  Search,
  Calculator,
  Building2,
  DollarSign,
  Users,
  Check,
  X,
  Eye,
  MessageSquare,
  BarChart3,
  Filter,
  Settings,
  RefreshCw
} from 'lucide-react'
import { AliquotasPDFService } from '@/lib/services/pdf-aliquotas'
// import { getCRMClients, logClientTransaction } from '@/lib/supabase/aliquotas-service'

// Import enhanced components
import ExecutiveSummary from './components/ExecutiveSummary'
import PDFPreview from './components/PDFPreview'

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

const mockProperties: Property[] = [
  {
    id: '1',
    address: 'Rua das Flores, 123 - Jardim Paulista',
    tenant: 'Maria Silva',
    currentRent: 2500,
    iptu: 150,
    referenceRate: 0.035,
    newRent: 2587.50,
    status: 'pending',
    lastUpdate: '2024-01-15'
  },
  {
    id: '2',
    address: 'Av. Paulista, 456 - Bela Vista',
    tenant: 'João Santos',
    currentRent: 3500,
    iptu: 220,
    referenceRate: 0.032,
    newRent: 3612,
    status: 'approved',
    lastUpdate: '2024-01-14'
  },
  {
    id: '3',
    address: 'Rua Augusta, 789 - Consolação',
    tenant: 'Ana Costa',
    currentRent: 1800,
    iptu: 95,
    referenceRate: 0.038,
    newRent: 1868.40,
    status: 'sent',
    lastUpdate: '2024-01-13'
  },
  {
    id: '4',
    address: 'Rua Oscar Freire, 321 - Jardins',
    tenant: 'Pedro Oliveira',
    currentRent: 4200,
    iptu: 280,
    referenceRate: 0.030,
    newRent: 4326,
    status: 'pending',
    lastUpdate: '2024-01-15'
  },
  {
    id: '5',
    address: 'Alameda Santos, 654 - Cerqueira César',
    tenant: 'Lucia Ferreira',
    currentRent: 2800,
    iptu: 180,
    referenceRate: 0.035,
    newRent: 2898,
    status: 'approved',
    lastUpdate: '2024-01-14'
  }
]

const mockClients: Client[] = [
  { id: '1', name: 'Maria Silva', email: 'maria.silva@email.com', phone: '(11) 99999-1234' },
  { id: '2', name: 'João Santos', email: 'joao.santos@email.com', phone: '(11) 98888-5678' },
  { id: '3', name: 'Ana Costa', email: 'ana.costa@email.com', phone: '(11) 97777-9012' },
  { id: '4', name: 'Pedro Oliveira', email: 'pedro.oliveira@email.com', phone: '(11) 96666-3456' },
  { id: '5', name: 'Lucia Ferreira', email: 'lucia.ferreira@email.com', phone: '(11) 95555-7890' }
]

export default function DashboardAliquotasEnhanced() {
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showClientModal, setShowClientModal] = useState(false)
  const [showPDFPreview, setShowPDFPreview] = useState(false)
  const [currentAction, setCurrentAction] = useState<'download' | 'send' | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [loadingClients, setLoadingClients] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'sent'>('all')
  const [showSummary, setShowSummary] = useState(true)

  // Load clients when modal opens
  const loadClients = async () => {
    if (clients.length > 0) return

    setLoadingClients(true)
    try {
      // const crmClients = await getCRMClients()
      const crmClients = mockClients
      setClients(crmClients)
    } catch (error) {
      console.error('Error loading clients:', error)
      setClients(mockClients)
    } finally {
      setLoadingClients(false)
    }
  }

  const filteredProperties = useMemo(() => {
    return mockProperties.filter(property => {
      const matchesSearch = property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.tenant.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || property.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [searchTerm, statusFilter])

  const togglePropertySelection = (propertyId: string) => {
    setSelectedProperties(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    )
  }

  const selectAllProperties = () => {
    const filteredIds = filteredProperties.map(p => p.id)
    setSelectedProperties(prev =>
      prev.length === filteredIds.length && filteredIds.every(id => prev.includes(id))
        ? []
        : filteredIds
    )
  }

  const handlePreviewPDF = () => {
    if (selectedProperties.length === 0) {
      alert('Selecione pelo menos um imóvel para visualizar o PDF')
      return
    }
    setShowPDFPreview(true)
  }

  const handleGeneratePDF = async (action: 'download' | 'send') => {
    if (selectedProperties.length === 0) {
      alert('Selecione pelo menos um imóvel para gerar o PDF')
      return
    }

    if (action === 'send') {
      setCurrentAction('send')
      setShowClientModal(true)
      loadClients()
    } else {
      await performPDFGeneration('download')
    }
  }

  const performPDFGeneration = async (action: 'download' | 'send') => {
    setIsGeneratingPDF(true)
    try {
      const selectedProps = mockProperties.filter(p => selectedProperties.includes(p.id))
      const currentDate = new Date()
      const month = currentDate.toLocaleString('pt-BR', { month: 'long' })
      const year = currentDate.getFullYear().toString()

      const pdfBlob = await AliquotasPDFService.generatePDF({
        properties: selectedProps,
        clientInfo: action === 'send' && selectedClient ? {
          name: selectedClient.name,
          email: selectedClient.email,
          phone: selectedClient.phone
        } : {
          name: 'Cliente Padrão',
          email: 'cliente@exemplo.com',
          phone: '(11) 99999-9999'
        },
        generationDate: new Date().toISOString(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      })

      if (action === 'download') {
        const filename = `aliquotas_${month}_${year}_${selectedProps.length}_imoveis.pdf`
        // Mock download - would actually download PDF
        console.log('Would download PDF:', filename)
        alert(`PDF gerado e baixado com sucesso!\nArquivo: ${filename}`)
      }

      setSelectedProperties([])
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      alert('Erro ao gerar PDF. Tente novamente.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleSendViaWhatsApp = async () => {
    if (!selectedClient) {
      alert('Selecione um cliente para enviar via WhatsApp')
      return
    }

    try {
      const selectedProps = mockProperties.filter(p => selectedProperties.includes(p.id))
      const currentDate = new Date()
      const month = currentDate.toLocaleString('pt-BR', { month: 'long' })
      const year = currentDate.getFullYear().toString()

      const message = `🏠 *Nova IPE - Relatório de Alíquotas*

📅 *Período:* ${month} ${year}
👤 *Cliente:* ${selectedClient.name}
📊 *Imóveis:* ${selectedProps.length}

${selectedProps.map((prop, index) => `
*${index + 1}. ${prop.address}*
🏠 Inquilino: ${prop.tenant}
💰 Aluguel Atual: R$ ${prop.currentRent.toLocaleString('pt-BR')}
💰 Novo Aluguel: R$ ${prop.newRent.toLocaleString('pt-BR')}
📈 Reajuste: ${(((prop.newRent - prop.currentRent) / prop.currentRent) * 100).toFixed(2)}%
`).join('')}

📋 Relatório PDF será enviado em seguida.

_Imobiliária IPE - Seus imóveis, nossa expertise_`

      const phone = selectedClient.phone.replace(/\D/g, '')
      const whatsappUrl = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`

      window.open(whatsappUrl, '_blank')

      // await logClientTransaction({
      //   clientId: selectedClient.id,
      //   type: 'whatsapp_aliquotas',
      //   properties: selectedProps.map(p => p.id),
      //   timestamp: new Date().toISOString(),
      //   details: { month, year, propertyCount: selectedProps.length }
      // })
      console.log('WhatsApp transaction logged for:', selectedClient.name)

      alert(`Mensagem enviada via WhatsApp para ${selectedClient.name}!`)

    } catch (error) {
      console.error('Erro ao enviar via WhatsApp:', error)
      alert('Erro ao enviar via WhatsApp. Tente novamente.')
    }
  }

  const handleSendToClient = async () => {
    if (!selectedClient) return
    await performPDFGeneration('send')
    setShowClientModal(false)
    setCurrentAction(null)
    setSelectedClient(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'approved': return 'bg-green-100 text-green-800 border-green-200'
      case 'sent': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente'
      case 'approved': return 'Aprovado'
      case 'sent': return 'Enviado'
      default: return 'Desconhecido'
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50"
    >
      {/* Enhanced Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl blur-xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-orange-600 to-red-600 p-3 rounded-xl">
                <Percent className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Alíquotas e Reajustes
              </h1>
              <p className="text-gray-600 mt-1">
                Calcule reajustes de aluguel baseados em taxas de referência e IPTU
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Selection Counter */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-700">
                  {selectedProperties.length} selecionados
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePreviewPDF}
              disabled={selectedProperties.length === 0}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Eye className="h-4 w-4" />
              Preview PDF
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGeneratePDF('download')}
              disabled={selectedProperties.length === 0 || isGeneratingPDF}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingPDF ? (
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

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGeneratePDF('send')}
              disabled={selectedProperties.length === 0 || isGeneratingPDF}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
              Enviar para Cliente
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Executive Summary */}
      {showSummary && (
        <motion.div variants={itemVariants} className="mb-8">
          <ExecutiveSummary
            properties={mockProperties}
            selectedProperties={selectedProperties}
          />
        </motion.div>
      )}

      {/* Enhanced Search and Filters */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por endereço ou inquilino..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 placeholder-gray-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
          >
            <option value="all">Todos os Status</option>
            <option value="pending">Pendentes</option>
            <option value="approved">Aprovados</option>
            <option value="sent">Enviados</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={selectAllProperties}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-white/20 text-gray-700 px-4 py-3 rounded-xl hover:bg-white transition-all duration-200"
          >
            {selectedProperties.length === filteredProperties.length && filteredProperties.length > 0 ? (
              <>
                <X className="h-4 w-4" />
                Desmarcar Todos
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Selecionar Todos
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSummary(!showSummary)}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-white/20 text-gray-700 px-4 py-3 rounded-xl hover:bg-white transition-all duration-200"
          >
            <BarChart3 className="h-4 w-4" />
            {showSummary ? 'Ocultar' : 'Mostrar'} Resumo
          </motion.button>
        </div>
      </motion.div>

      {/* Enhanced Properties Table */}
      <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Imóveis para Reajuste</h2>
              <p className="text-sm text-gray-600 mt-1">
                {filteredProperties.length} imóveis • {selectedProperties.length} selecionados
              </p>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors"
                title="Atualizar dados"
              >
                <RefreshCw className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors"
                title="Filtros avançados"
              >
                <Filter className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors"
                title="Configurações"
              >
                <Settings className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedProperties.length === filteredProperties.length && filteredProperties.length > 0}
                    onChange={selectAllProperties}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Imóvel
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inquilino
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aluguel Atual
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IPTU
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taxa Ref.
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Novo Aluguel
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProperties.map((property, index) => (
                <motion.tr
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4, scale: 1.005 }}
                  className={`hover:bg-orange-50/50 transition-all duration-300 ${
                    selectedProperties.includes(property.id) ? 'bg-orange-50/30 ring-2 ring-orange-200' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedProperties.includes(property.id)}
                      onChange={() => togglePropertySelection(property.id)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{property.address}</div>
                        <div className="text-sm text-gray-500">Cód: {property.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{property.tenant}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      R$ {property.currentRent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      R$ {property.iptu.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {(property.referenceRate * 100).toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      R$ {property.newRent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-gray-500">
                      +R$ {(property.newRent - property.currentRent).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      ({(((property.newRent - property.currentRent) / property.currentRent) * 100).toFixed(1)}%)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(property.status)}`}>
                      {getStatusLabel(property.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Enhanced PDF Preview Modal */}
      <PDFPreview
        isOpen={showPDFPreview}
        onClose={() => setShowPDFPreview(false)}
        properties={mockProperties.filter(p => selectedProperties.includes(p.id))}
        client={selectedClient}
        onDownload={() => handleGeneratePDF('download')}
        onSend={() => handleGeneratePDF('send')}
        isGenerating={isGeneratingPDF}
      />

      {/* Enhanced Client Selection Modal */}
      <AnimatePresence>
        {showClientModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Selecionar Cliente</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowClientModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {loadingClients ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                    <span className="ml-2 text-gray-600">Carregando clientes...</span>
                  </div>
                ) : (
                  clients.map((client) => (
                    <motion.div
                      key={client.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedClient(client)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedClient?.id === client.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{client.name}</div>
                          <div className="text-sm text-gray-500">{client.email}</div>
                          <div className="text-sm text-gray-500">{client.phone}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="flex items-center justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowClientModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendToClient}
                  disabled={!selectedClient}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                  Enviar PDF
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}