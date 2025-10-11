'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    FileText,
    Plus,
    Search,
    Filter,
    Download,
    Eye,
    Edit3,
    Trash2,
    Upload,
    Folder,
    Calendar,
    User,
    Building,
    AlertCircle,
    CheckCircle2,
    Clock,
    Archive,
    Star,
    Copy,
    File,
    Loader2,
    RefreshCw
} from 'lucide-react'
import { CloudStorageService, CloudFile } from '@/app/lib/supabase/cloud-storage-service'

interface Document {
    id: string
    title: string
    type: 'contract' | 'proposal' | 'deed' | 'certificate' | 'report' | 'other'
    status: 'draft' | 'pending' | 'signed' | 'completed' | 'expired'
    client_name?: string
    property_address?: string
    created_date: string
    updated_date: string
    file_size: string
    is_template: boolean
    is_favorite: boolean
    file_path: string
    original_file?: CloudFile
}

interface DocumentTemplate {
    id: string
    name: string
    description: string
    type: 'contract' | 'proposal' | 'deed' | 'certificate' | 'report'
    usage_count: number
    file_path?: string
}

// Utility functions
const inferDocumentType = (fileName: string): Document['type'] => {
    const name = fileName.toLowerCase()
    if (name.includes('contrato') || name.includes('contract')) return 'contract'
    if (name.includes('proposta') || name.includes('proposal')) return 'proposal'
    if (name.includes('escritura') || name.includes('deed')) return 'deed'
    if (name.includes('certidao') || name.includes('certificate')) return 'certificate'
    if (name.includes('laudo') || name.includes('relatorio') || name.includes('report')) return 'report'
    return 'other'
}

const inferDocumentStatus = (fileName: string): Document['status'] => {
    const name = fileName.toLowerCase()
    if (name.includes('rascunho') || name.includes('draft')) return 'draft'
    if (name.includes('pendente') || name.includes('pending')) return 'pending'
    if (name.includes('assinado') || name.includes('signed')) return 'signed'
    if (name.includes('concluido') || name.includes('completed')) return 'completed'
    if (name.includes('vencido') || name.includes('expired')) return 'expired'
    return 'draft'
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const documentTypes = [
    { value: 'all', label: 'Todos os tipos', color: 'text-gray-600' },
    { value: 'contract', label: 'Contratos', color: 'text-blue-600' },
    { value: 'proposal', label: 'Propostas', color: 'text-green-600' },
    { value: 'deed', label: 'Escrituras', color: 'text-purple-600' },
    { value: 'certificate', label: 'Certidões', color: 'text-orange-600' },
    { value: 'report', label: 'Laudos', color: 'text-red-600' },
    { value: 'other', label: 'Outros', color: 'text-gray-500' }
]

const statusConfig = {
    draft: { label: 'Rascunho', color: 'bg-gray-100 text-gray-800', icon: Edit3 },
    pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    signed: { label: 'Assinado', color: 'bg-blue-100 text-blue-800', icon: CheckCircle2 },
    completed: { label: 'Concluído', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
    expired: { label: 'Vencido', color: 'bg-red-100 text-red-800', icon: AlertCircle }
}

export default function DocumentsPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedType, setSelectedType] = useState('all')
    const [selectedStatus, setSelectedStatus] = useState('all')
    const [view, setView] = useState<'documents' | 'templates'>('documents')
    const [documents, setDocuments] = useState<Document[]>([])
    const [templates, setTemplates] = useState<DocumentTemplate[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    // Load documents from Supabase
    useEffect(() => {
        loadDocuments()
        loadTemplates()
    }, [])

    const loadDocuments = async () => {
        try {
            setLoading(true)
            const { files, error: filesError } = await CloudStorageService.getFiles('/documents')

            if (filesError) throw filesError

            const documentsData: Document[] = files.map(file => ({
                id: file.id,
                title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
                type: inferDocumentType(file.name),
                status: inferDocumentStatus(file.name),
                client_name: extractClientName(file.name),
                property_address: extractPropertyAddress(file.name),
                created_date: new Date(file.created_at).toISOString().split('T')[0],
                updated_date: new Date(file.updated_at).toISOString().split('T')[0],
                file_size: formatFileSize(file.size),
                is_template: file.path.includes('/templates/'),
                is_favorite: false, // TODO: Implement favorites system
                file_path: file.path,
                original_file: file
            }))

            setDocuments(documentsData)
            setError(null)
        } catch (err) {
            console.error('Erro ao carregar documentos:', err)
            setError('Erro ao carregar documentos. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    const loadTemplates = async () => {
        try {
            const { files } = await CloudStorageService.getFiles('/documents/templates')

            const templatesData: DocumentTemplate[] = files.map(file => ({
                id: file.id,
                name: file.name.replace(/\.[^/.]+$/, ''),
                description: `Template para ${inferDocumentType(file.name)}`,
                type: inferDocumentType(file.name) as 'contract' | 'proposal' | 'deed' | 'certificate' | 'report',
                usage_count: 0, // TODO: Implement usage tracking
                file_path: file.path
            }))

            setTemplates(templatesData)
        } catch (err) {
            console.error('Erro ao carregar templates:', err)
        }
    }

    const extractClientName = (fileName: string): string => {
        // Try to extract client name from filename patterns
        const patterns = [
            /cliente[_\s]+([^_\s]+)/i,
            /client[_\s]+([^_\s]+)/i,
            /-\s*([A-Za-z\s]+)\s*-/,
        ]

        for (const pattern of patterns) {
            const match = fileName.match(pattern)
            if (match) return match[1].trim()
        }

        return ''
    }

    const extractPropertyAddress = (fileName: string): string => {
        // Try to extract property info from filename
        const patterns = [
            /endereco[_\s]+([^_\s.]+)/i,
            /address[_\s]+([^_\s.]+)/i,
            /imovel[_\s]+([^_\s.]+)/i,
        ]

        for (const pattern of patterns) {
            const match = fileName.match(pattern)
            if (match) return match[1].trim()
        }

        return ''
    }

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message })
        setTimeout(() => setNotification(null), 3000)
    }

    const handleDownload = async (doc: Document) => {
        try {
            const { data, error } = await CloudStorageService.downloadFile(doc.file_path)

            if (error || !data) {
                throw new Error('Erro ao baixar arquivo')
            }

            // Create download link
            const url = window.URL.createObjectURL(data)
            const link = window.document.createElement('a')
            link.href = url
            link.download = doc.original_file?.name || doc.title
            window.document.body.appendChild(link)
            link.click()
            window.URL.revokeObjectURL(url)
            window.document.body.removeChild(link)

            showNotification('success', 'Download realizado com sucesso')
        } catch (err) {
            console.error('Erro no download:', err)
            showNotification('error', 'Erro ao baixar documento')
        }
    }

    const handleDelete = async (doc: Document) => {
        if (!confirm('Tem certeza que deseja excluir este documento?')) return

        try {
            const { success, error } = await CloudStorageService.deleteFile(doc.file_path)

            if (!success || error) {
                throw new Error('Erro ao excluir arquivo')
            }

            setDocuments(prev => prev.filter(document => document.id !== doc.id))
            showNotification('success', 'Documento excluído com sucesso')
        } catch (err) {
            console.error('Erro ao excluir:', err)
            showNotification('error', 'Erro ao excluir documento')
        }
    }

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.property_address?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = selectedType === 'all' || doc.type === selectedType
        const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus
        return matchesSearch && matchesType && matchesStatus
    })

    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = selectedType === 'all' || template.type === selectedType
        return matchesSearch && matchesType
    })

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'contract': return FileText
            case 'proposal': return Edit3
            case 'deed': return Archive
            case 'certificate': return CheckCircle2
            case 'report': return FileText
            default: return FileText
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'contract': return 'text-blue-600'
            case 'proposal': return 'text-green-600'
            case 'deed': return 'text-purple-600'
            case 'certificate': return 'text-orange-600'
            case 'report': return 'text-red-600'
            default: return 'text-gray-600'
        }
    }

    return (
        <div className="p-6 max-w-7xl mx-auto rounded-xl">
            {/* Notification */}
            {notification && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${notification.type === 'success'
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                        }`}
                >
                    {notification.message}
                </motion.div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center min-h-64">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        <p className="text-gray-600">Carregando documentos...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                        <div>
                            <h3 className="text-red-800 font-medium">Erro ao carregar documentos</h3>
                            <p className="text-red-600 text-sm mt-1">{error}</p>
                        </div>
                        <button
                            onClick={loadDocuments}
                            className="ml-auto bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors flex items-center gap-1"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Tentar novamente
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            {!loading && !error && (
                <>
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Documentos
                            </h1>
                            <p className="text-gray-600">
                                Gerencie contratos, propostas e documentos do seu portfólio
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setView('documents')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${view === 'documents'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <FileText className="h-4 w-4 inline mr-2" />
                                Documentos ({documents.length})
                            </button>
                            <button
                                onClick={() => setView('templates')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${view === 'templates'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <Folder className="h-4 w-4 inline mr-2" />
                                Templates ({templates.length})
                            </button>
                            <button
                                onClick={loadDocuments}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center gap-2"
                            >
                                <Upload className="h-4 w-4" />
                                Upload Documento
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total de Documentos</p>
                                    <p className="text-3xl font-bold text-gray-900">{documents.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <FileText className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Pendentes</p>
                                    <p className="text-3xl font-bold text-yellow-600">
                                        {documents.filter(doc => doc.status === 'pending').length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                                    <Clock className="h-6 w-6 text-yellow-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Assinados</p>
                                    <p className="text-3xl font-bold text-green-600">
                                        {documents.filter(doc => doc.status === 'signed').length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Templates</p>
                                    <p className="text-3xl font-bold text-purple-600">{templates.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                                    <Folder className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="text"
                                        placeholder="Buscar documentos, clientes ou endereços..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {documentTypes.map(type => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>

                                {view === 'documents' && (
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="all">Todos os status</option>
                                        <option value="draft">Rascunho</option>
                                        <option value="pending">Pendente</option>
                                        <option value="signed">Assinado</option>
                                        <option value="completed">Concluído</option>
                                        <option value="expired">Vencido</option>
                                    </select>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Documents List */}
                    {view === 'documents' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Documentos ({filteredDocuments.length})
                                </h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Documento
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Cliente/Imóvel
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Data
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ações
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredDocuments.map((document) => {
                                            const TypeIcon = getTypeIcon(document.type)
                                            const statusInfo = statusConfig[document.status]
                                            const StatusIcon = statusInfo.icon

                                            return (
                                                <motion.tr
                                                    key={document.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="hover:bg-gray-50 transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-2 rounded-lg bg-gray-50 ${getTypeColor(document.type)}`}>
                                                                <TypeIcon className="h-4 w-4" />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <p className="font-medium text-gray-900">{document.title}</p>
                                                                    {document.is_favorite && (
                                                                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-gray-500">{document.file_size}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className="font-medium text-gray-900">{document.client_name}</p>
                                                            <p className="text-sm text-gray-500">{document.property_address}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                                            <StatusIcon className="h-3 w-3" />
                                                            {statusInfo.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {new Date(document.created_date).toLocaleDateString('pt-BR')}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                title="Visualizar"
                                                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDownload(document)}
                                                                title="Download"
                                                                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            >
                                                                <Download className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                title="Editar"
                                                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                                            >
                                                                <Edit3 className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(document)}
                                                                title="Excluir"
                                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Templates Grid */}
                    {view === 'templates' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTemplates.map((template) => (
                                <motion.div
                                    key={template.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-xl bg-gray-50 ${getTypeColor(template.type)}`}>
                                            {React.createElement(getTypeIcon(template.type), { className: 'h-6 w-6' })}
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Copy className="h-4 w-4" />
                                            </button>
                                            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                                <Edit3 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                                    <p className="text-sm text-gray-600 mb-4">{template.description}</p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">
                                            Usado {template.usage_count} vezes
                                        </span>
                                        <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                                            Usar Template
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
