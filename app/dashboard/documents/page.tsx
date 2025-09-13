'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DocumentsService } from '@/lib/supabase/documents-service'
import type { Document as DocumentType, DocumentTemplate as DocumentTemplateType } from '@/lib/supabase/documents-service'
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
    File
} from 'lucide-react'

// Mock data removed - using Supabase integration

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
    const [documents, setDocuments] = useState<DocumentType[]>([])
    const [templates, setTemplates] = useState<DocumentTemplateType[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadDocuments()
        loadTemplates()
    }, [])

    const loadDocuments = async () => {
        setLoading(true)
        try {
            const { documents: docsData, error } = await DocumentsService.getDocuments()
            if (error) {
                console.error('Error loading documents:', error)
                setDocuments([])
            } else {
                setDocuments(docsData)
            }
        } catch (error) {
            console.error('Error loading documents:', error)
            setDocuments([])
        } finally {
            setLoading(false)
        }
    }

    const loadTemplates = async () => {
        try {
            const { templates: templatesData, error } = await DocumentsService.getDocumentTemplates()
            if (error) {
                console.error('Error loading templates:', error)
                setTemplates([])
            } else {
                setTemplates(templatesData)
            }
        } catch (error) {
            console.error('Error loading templates:', error)
            setTemplates([])
        }
    }

    const handleToggleFavorite = async (documentId: string, currentFavorite: boolean) => {
        try {
            const { error } = await DocumentsService.toggleFavorite(documentId, !currentFavorite)
            if (error) {
                console.error('Error toggling favorite:', error)
            } else {
                // Recarregar documentos para atualizar o estado
                loadDocuments()
            }
        } catch (error) {
            console.error('Error toggling favorite:', error)
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
                        Documentos
                    </button>
                    <button
                        onClick={() => setView('templates')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${view === 'templates'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <Folder className="h-4 w-4 inline mr-2" />
                        Templates
                    </button>
                    <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Novo Documento
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total de Documentos</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {loading ? '...' : documents.length}
                            </p>
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
                            <p className="text-3xl font-bold text-yellow-600">8</p>
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
                            <p className="text-3xl font-bold text-green-600">45</p>
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
                            <p className="text-3xl font-bold text-purple-600">12</p>
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
                                                {new Date(document.created_at).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Visualizar"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Download"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        className={`p-1.5 transition-colors rounded-lg ${document.is_favorite
                                                                ? 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50'
                                                                : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                                                            }`}
                                                        title={document.is_favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                                                        onClick={() => handleToggleFavorite(document.id, document.is_favorite)}
                                                    >
                                                        <Star className={`h-4 w-4 ${document.is_favorite ? 'fill-current' : ''}`} />
                                                    </button>
                                                    <button
                                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Excluir"
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
        </div>
    )
}
