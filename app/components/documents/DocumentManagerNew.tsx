'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Upload, FileText, Download, Eye, Edit, Trash2, Plus, Search,
    Filter, Calendar, User, Tag, AlertTriangle, CheckCircle,
    Clock, Archive, Share2, MessageSquare, Star, MoreVertical,
    Folder, FolderOpen, Image, FileIcon, Camera, Paperclip,
    ChevronDown, ChevronRight, X, RefreshCw, Bell, Zap,
    Send, Check, AlertCircle, Copy, ExternalLink, Settings
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

interface Document {
    id: string
    title: string
    description?: string
    file_name?: string
    file_size?: number
    file_type?: string
    file_path?: string
    status: 'draft' | 'pending_review' | 'under_review' | 'approved' | 'rejected' | 'expired' | 'archived'
    version: number
    requires_signature: boolean
    expiry_date?: string
    lead_id?: string
    property_id?: string
    contract_id?: string
    document_type_id?: string
    created_by: string
    created_at: string
    updated_at: string
    document_type?: {
        name: string
        category: string
    }
    pending_tasks?: number
    comments_count?: number
}

interface DocumentTask {
    id: string
    document_id: string
    title: string
    task_type: string
    assigned_to?: string
    priority: 'low' | 'medium' | 'high' | 'urgent'
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
    due_date?: string
}

interface DocumentManagerProps {
    leadId?: string
    propertyId?: string
    contractId?: string
    readonly?: boolean
    onDocumentChange?: (documents: Document[]) => void
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'approved': return 'bg-green-100 text-green-800 border-green-200'
        case 'pending_review': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
        case 'under_review': return 'bg-blue-100 text-blue-800 border-blue-200'
        case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
        case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200'
        case 'draft': return 'bg-gray-100 text-gray-600 border-gray-200'
        default: return 'bg-gray-100 text-gray-600 border-gray-200'
    }
}

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'approved': return <CheckCircle className="w-4 h-4" />
        case 'pending_review': return <Clock className="w-4 h-4" />
        case 'under_review': return <Eye className="w-4 h-4" />
        case 'rejected': return <X className="w-4 h-4" />
        case 'expired': return <AlertTriangle className="w-4 h-4" />
        default: return <FileText className="w-4 h-4" />
    }
}

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'urgent': return 'text-red-600'
        case 'high': return 'text-orange-600'
        case 'medium': return 'text-yellow-600'
        case 'low': return 'text-green-600'
        default: return 'text-gray-600'
    }
}

export function DocumentManager({
    leadId,
    propertyId,
    contractId,
    readonly = false,
    onDocumentChange
}: DocumentManagerProps) {
    // Estados principais
    const [documents, setDocuments] = useState<Document[]>([])
    const [tasks, setTasks] = useState<DocumentTask[]>([])
    const [documentTypes, setDocumentTypes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)

    // Estados de UI
    const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('list')
    const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [typeFilter, setTypeFilter] = useState('')
    const [sortBy, setSortBy] = useState('created_at')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

    // Estados de modais e painéis
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [showTaskPanel, setShowTaskPanel] = useState(false)
    const [showFilters, setShowFilters] = useState(false)
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
    const [expandedDocument, setExpandedDocument] = useState<string | null>(null)

    // Estados de drag and drop
    const [dragOver, setDragOver] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Carregamento inicial
    useEffect(() => {
        loadData()
    }, [leadId, propertyId, contractId])

    useEffect(() => {
        onDocumentChange?.(documents)
    }, [documents, onDocumentChange])

    const loadData = async () => {
        setLoading(true)
        try {
            await Promise.all([
                loadDocuments(),
                loadTasks(),
                loadDocumentTypes()
            ])
        } catch (error) {
            console.error('Erro ao carregar dados:', error)
            toast.error('Erro ao carregar documentos')
        } finally {
            setLoading(false)
        }
    }

    const loadDocuments = async () => {
        let query = supabase
            .from('documents')
            .select(`
                *,
                document_type:document_types(name, category)
            `)
            .is('deleted_at', null)
            .eq('is_latest_version', true)

        if (leadId) query = query.eq('lead_id', leadId)
        if (propertyId) query = query.eq('property_id', propertyId)
        if (contractId) query = query.eq('contract_id', contractId)

        const { data, error } = await query.order(sortBy, { ascending: sortOrder === 'asc' })

        if (error) throw error
        setDocuments(data || [])
    }

    const loadTasks = async () => {
        if (!leadId && !propertyId && !contractId) return

        const { data, error } = await supabase
            .from('document_tasks')
            .select('*')
            .in('status', ['pending', 'in_progress'])
            .order('due_date', { ascending: true })

        if (error) throw error
        setTasks(data || [])
    }

    const loadDocumentTypes = async () => {
        const { data, error } = await supabase
            .from('document_types')
            .select('*')
            .order('category', { ascending: true })

        if (error) throw error
        setDocumentTypes(data || [])
    }

    // Filtros e busca
    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = !searchTerm ||
            doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.file_name?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = !statusFilter || doc.status === statusFilter
        const matchesType = !typeFilter || doc.document_type_id === typeFilter

        return matchesSearch && matchesStatus && matchesType
    })

    // Upload de arquivos
    const handleFileUpload = useCallback(async (files: FileList) => {
        if (!files.length || readonly) return

        setUploading(true)

        try {
            for (const file of Array.from(files)) {
                // Validações
                if (file.size > 50 * 1024 * 1024) { // 50MB
                    toast.error(`Arquivo ${file.name} é muito grande (máx 50MB)`)
                    continue
                }

                // Upload para Supabase Storage
                const fileExt = file.name.split('.').pop()
                const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
                const filePath = `documents/${fileName}`

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('documents')
                    .upload(filePath, file)

                if (uploadError) throw uploadError

                // Criar registro do documento
                const { data: document, error: docError } = await supabase
                    .from('documents')
                    .insert({
                        title: file.name.replace(/\.[^/.]+$/, ''), // Remove extensão
                        file_name: file.name,
                        original_file_name: file.name,
                        file_size: file.size,
                        file_type: file.type,
                        file_path: uploadData.path,
                        lead_id: leadId,
                        property_id: propertyId,
                        contract_id: contractId,
                        status: 'draft',
                        created_by: (await supabase.auth.getUser()).data.user?.id
                    })
                    .select()
                    .single()

                if (docError) throw docError

                toast.success(`${file.name} enviado com sucesso`)
            }

            await loadDocuments()
            setShowUploadModal(false)

        } catch (error) {
            console.error('Erro no upload:', error)
            toast.error('Erro ao enviar arquivo')
        } finally {
            setUploading(false)
        }
    }, [leadId, propertyId, contractId, readonly])

    // Drag and drop
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)

        if (e.dataTransfer.files) {
            handleFileUpload(e.dataTransfer.files)
        }
    }, [handleFileUpload])

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
    }, [])

    // Ações de documento
    const updateDocumentStatus = async (documentId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('documents')
                .update({
                    status: newStatus,
                    updated_by: (await supabase.auth.getUser()).data.user?.id
                })
                .eq('id', documentId)

            if (error) throw error

            await loadDocuments()
            toast.success('Status atualizado')

        } catch (error) {
            console.error('Erro ao atualizar status:', error)
            toast.error('Erro ao atualizar status')
        }
    }

    const deleteDocument = async (documentId: string) => {
        if (!confirm('Tem certeza que deseja excluir este documento?')) return

        try {
            const { error } = await supabase
                .from('documents')
                .update({
                    deleted_at: new Date().toISOString(),
                    updated_by: (await supabase.auth.getUser()).data.user?.id
                })
                .eq('id', documentId)

            if (error) throw error

            await loadDocuments()
            toast.success('Documento excluído')

        } catch (error) {
            console.error('Erro ao excluir documento:', error)
            toast.error('Erro ao excluir documento')
        }
    }

    const downloadDocument = async (document: Document) => {
        if (!document.file_path) return

        try {
            const { data, error } = await supabase.storage
                .from('documents')
                .download(document.file_path)

            if (error) throw error

            const url = URL.createObjectURL(data)
            const a = window.document.createElement('a')
            a.href = url
            a.download = document.file_name || document.title
            a.click()
            URL.revokeObjectURL(url)

            // Log da atividade
            await supabase
                .from('document_activities')
                .insert({
                    document_id: document.id,
                    user_id: (await supabase.auth.getUser()).data.user?.id,
                    activity_type: 'downloaded'
                })

        } catch (error) {
            console.error('Erro no download:', error)
            toast.error('Erro ao baixar documento')
        }
    }

    // Componentes de UI
    const DocumentCard = ({ document }: { document: Document }) => (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`bg-white rounded-lg border-2 p-4 hover:shadow-md transition-all duration-200 ${selectedDocuments.includes(document.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1">
                    <div className="flex-shrink-0">
                        {document.file_type?.includes('image') ? (
                            <Image className="w-8 h-8 text-blue-500" />
                        ) : document.file_type?.includes('pdf') ? (
                            <FileText className="w-8 h-8 text-red-500" />
                        ) : (
                            <FileIcon className="w-8 h-8 text-gray-500" />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                            {document.title}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                            {document.document_type?.name || 'Sem tipo'}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(document.status)}`}>
                                {getStatusIcon(document.status)}
                                <span className="ml-1 capitalize">{document.status.replace('_', ' ')}</span>
                            </span>
                            {document.requires_signature && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                    <Edit className="w-3 h-3 mr-1" />
                                    Assinatura
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-1">
                    {document.pending_tasks && document.pending_tasks > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            {document.pending_tasks} tarefas
                        </span>
                    )}

                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setExpandedDocument(expandedDocument === document.id ? null : document.id)
                            }}
                            className="p-1 rounded-md hover:bg-gray-100"
                        >
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                </div>
            </div>

            {document.description && (
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {document.description}
                </p>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500">
                <span>v{document.version}</span>
                <span>{new Date(document.created_at).toLocaleDateString('pt-BR')}</span>
                <span>{document.file_size ? `${(document.file_size / 1024).toFixed(1)} KB` : '-'}</span>
            </div>

            {expandedDocument === document.id && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200 space-y-3"
                >
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => downloadDocument(document)}
                            className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200"
                        >
                            <Download className="w-3 h-3 mr-1" />
                            Baixar
                        </button>

                        {!readonly && (
                            <>
                                <select
                                    value={document.status}
                                    onChange={(e) => updateDocumentStatus(document.id, e.target.value)}
                                    className="px-3 py-1 text-xs border border-gray-300 rounded-md"
                                >
                                    <option value="draft">Rascunho</option>
                                    <option value="pending_review">Pendente Revisão</option>
                                    <option value="under_review">Em Revisão</option>
                                    <option value="approved">Aprovado</option>
                                    <option value="rejected">Rejeitado</option>
                                </select>

                                <button
                                    onClick={() => deleteDocument(document.id)}
                                    className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200"
                                >
                                    <Trash2 className="w-3 h-3 mr-1" />
                                    Excluir
                                </button>
                            </>
                        )}
                    </div>

                    {tasks.filter(t => t.document_id === document.id).length > 0 && (
                        <div className="space-y-2">
                            <h5 className="text-xs font-medium text-gray-700">Tarefas Pendentes:</h5>
                            {tasks.filter(t => t.document_id === document.id).map(task => (
                                <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <span className="text-xs text-gray-600">{task.title}</span>
                                    <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                        {task.priority}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}
        </motion.div>
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Documentos
                        </h2>
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                            {filteredDocuments.length} documentos
                        </span>
                    </div>

                    <div className="flex items-center space-x-2">
                        {!readonly && (
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Adicionar
                            </button>
                        )}

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Filtros
                        </button>

                        <button
                            onClick={loadData}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Barra de busca e filtros */}
                <div className={`mt-4 space-y-4 ${showFilters ? 'block' : 'hidden'}`}>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-64">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Buscar documentos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todos os status</option>
                            <option value="draft">Rascunho</option>
                            <option value="pending_review">Pendente Revisão</option>
                            <option value="under_review">Em Revisão</option>
                            <option value="approved">Aprovado</option>
                            <option value="rejected">Rejeitado</option>
                        </select>

                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todos os tipos</option>
                            {documentTypes.map(type => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Drag and Drop Area */}
            {!readonly && (
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`px-6 py-8 border-2 border-dashed transition-colors ${dragOver
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-gray-300 bg-gray-50'
                        } ${filteredDocuments.length === 0 ? 'block' : 'hidden'}`}
                >
                    <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                            <p className="text-sm text-gray-600">
                                Arraste arquivos aqui ou{' '}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-blue-600 hover:text-blue-500 font-medium"
                                >
                                    clique para selecionar
                                </button>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Máximo 50MB por arquivo
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Lista de documentos */}
            <div className="p-6">
                {filteredDocuments.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-sm font-medium text-gray-900">
                            Nenhum documento encontrado
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                            {!readonly ? 'Comece adicionando um novo documento.' : 'Não há documentos para exibir.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence>
                            {filteredDocuments.map((document) => (
                                <DocumentCard key={document.id} document={document} />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Modal de Upload */}
            <AnimatePresence>
                {showUploadModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        onClick={() => setShowUploadModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Adicionar Documento</h3>
                                <button
                                    onClick={() => setShowUploadModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                                    }`}
                            >
                                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-600">
                                    Arraste arquivos aqui ou{' '}
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-blue-600 hover:text-blue-500 font-medium"
                                    >
                                        clique para selecionar
                                    </button>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    PDF, DOC, DOCX, JPG, PNG (máx 50MB)
                                </p>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                className="hidden"
                                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />

                            {uploading && (
                                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                        <span className="text-sm text-blue-700">Enviando documentos...</span>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
