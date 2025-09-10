'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Cloud,
    Upload,
    Download,
    Folder,
    File,
    Search,
    Filter,
    Grid3X3,
    List,
    MoreVertical,
    Trash2,
    Share2,
    Edit,
    Eye,
    FileText,
    FileImage,
    FileVideo,
    Archive,
    HardDrive,
    Users,
    Settings,
    Plus,
    RefreshCw,
    Star,
    Clock,
    Tag
} from 'lucide-react'

interface CloudFile {
    id: string
    name: string
    type: 'file' | 'folder'
    size?: number
    mimeType?: string
    createdAt: string
    modifiedAt: string
    owner: string
    shared: boolean
    starred: boolean
    tags: string[]
    path: string
    url?: string
    thumbnail?: string
}

export default function CloudPage() {
    const [files, setFiles] = useState<CloudFile[]>([])
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedFiles, setSelectedFiles] = useState<string[]>([])
    const [currentPath, setCurrentPath] = useState('/')
    const [filterType, setFilterType] = useState<'all' | 'files' | 'folders' | 'images' | 'documents' | 'videos'>('all')
    const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('name')
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [storageStats, setStorageStats] = useState({
        used: 0,
        total: 0,
        files: 0,
        folders: 0
    })

    useEffect(() => {
        loadFiles()
        loadStorageStats()
    }, [currentPath, filterType, sortBy])

    const loadFiles = async () => {
        setLoading(true)
        try {
            // Mock data - replace with actual cloud storage service
            const mockFiles: CloudFile[] = [
                {
                    id: '1',
                    name: 'Documentos',
                    type: 'folder',
                    createdAt: '2025-01-01T10:00:00Z',
                    modifiedAt: '2025-01-09T15:30:00Z',
                    owner: 'João Pedro',
                    shared: false,
                    starred: true,
                    tags: ['trabalho'],
                    path: '/Documentos'
                },
                {
                    id: '2',
                    name: 'Fotos Imóveis',
                    type: 'folder',
                    createdAt: '2025-01-05T08:00:00Z',
                    modifiedAt: '2025-01-09T12:00:00Z',
                    owner: 'João Pedro',
                    shared: true,
                    starred: false,
                    tags: ['imóveis', 'fotos'],
                    path: '/Fotos Imóveis'
                },
                {
                    id: '3',
                    name: 'Contratos 2025.pdf',
                    type: 'file',
                    size: 2048576,
                    mimeType: 'application/pdf',
                    createdAt: '2025-01-08T14:20:00Z',
                    modifiedAt: '2025-01-09T16:45:00Z',
                    owner: 'João Pedro',
                    shared: false,
                    starred: true,
                    tags: ['contratos', 'legal'],
                    path: '/Contratos 2025.pdf',
                    url: '/files/contratos-2025.pdf'
                },
                {
                    id: '4',
                    name: 'Apresentação Nova IPE.pptx',
                    type: 'file',
                    size: 8192000,
                    mimeType: 'application/vnd.ms-powerpoint',
                    createdAt: '2025-01-07T11:15:00Z',
                    modifiedAt: '2025-01-09T09:30:00Z',
                    owner: 'Julia Silva',
                    shared: true,
                    starred: false,
                    tags: ['apresentação', 'marketing'],
                    path: '/Apresentação Nova IPE.pptx',
                    url: '/files/apresentacao-nova-ipe.pptx'
                },
                {
                    id: '5',
                    name: 'Casa Vila Madalena.jpg',
                    type: 'file',
                    size: 1536000,
                    mimeType: 'image/jpeg',
                    createdAt: '2025-01-06T16:30:00Z',
                    modifiedAt: '2025-01-06T16:30:00Z',
                    owner: 'João Pedro',
                    shared: false,
                    starred: false,
                    tags: ['fotos', 'vila-madalena'],
                    path: '/Casa Vila Madalena.jpg',
                    url: '/files/casa-vila-madalena.jpg',
                    thumbnail: '/thumbnails/casa-vila-madalena-thumb.jpg'
                }
            ]

            setFiles(mockFiles)
        } catch (error) {
            console.error('Error loading files:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadStorageStats = async () => {
        // Mock storage stats
        setStorageStats({
            used: 15 * 1024 * 1024 * 1024, // 15GB
            total: 100 * 1024 * 1024 * 1024, // 100GB
            files: 347,
            folders: 28
        })
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString('pt-BR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getFileIcon = (file: CloudFile) => {
        if (file.type === 'folder') {
            return <Folder className="h-6 w-6 text-blue-500" />
        }

        const mimeType = file.mimeType
        if (mimeType?.startsWith('image/')) {
            return <FileImage className="h-6 w-6 text-green-500" />
        }
        if (mimeType?.startsWith('video/')) {
            return <FileVideo className="h-6 w-6 text-purple-500" />
        }
        if (mimeType?.includes('pdf') || mimeType?.includes('document')) {
            return <FileText className="h-6 w-6 text-red-500" />
        }
        if (mimeType?.includes('zip') || mimeType?.includes('archive')) {
            return <Archive className="h-6 w-6 text-orange-500" />
        }
        return <File className="h-6 w-6 text-gray-500" />
    }

    const toggleFileSelection = (fileId: string) => {
        setSelectedFiles(prev =>
            prev.includes(fileId)
                ? prev.filter(id => id !== fileId)
                : [...prev, fileId]
        )
    }

    const filteredFiles = files.filter(file => {
        // Search filter
        if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false
        }

        // Type filter
        if (filterType !== 'all') {
            if (filterType === 'folders' && file.type !== 'folder') return false
            if (filterType === 'files' && file.type !== 'file') return false
            if (filterType === 'images' && !file.mimeType?.startsWith('image/')) return false
            if (filterType === 'documents' && !file.mimeType?.includes('pdf') && !file.mimeType?.includes('document')) return false
            if (filterType === 'videos' && !file.mimeType?.startsWith('video/')) return false
        }

        return true
    })

    const usagePercentage = (storageStats.used / storageStats.total) * 100

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-16 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                Cloud Storage
                            </h1>
                            <motion.div
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                {formatFileSize(storageStats.used)} de {formatFileSize(storageStats.total)}
                            </motion.div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowUploadModal(true)}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                            >
                                <Upload className="h-4 w-4 mr-2 inline" />
                                Upload
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Storage Stats */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ staggerChildren: 0.1 }}
                >
                    <motion.div
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">Armazenamento</h3>
                            <HardDrive className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Usado</span>
                                <span className="font-medium">{formatFileSize(storageStats.used)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <motion.div
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${usagePercentage}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                />
                            </div>
                            <div className="text-xs text-gray-500">
                                {usagePercentage.toFixed(1)}% de {formatFileSize(storageStats.total)}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">Arquivos</h3>
                            <File className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{storageStats.files}</div>
                        <div className="text-sm text-gray-600 mt-1">Total de arquivos</div>
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">Pastas</h3>
                            <Folder className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{storageStats.folders}</div>
                        <div className="text-sm text-gray-600 mt-1">Total de pastas</div>
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">Compartilhados</h3>
                            <Users className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                            {files.filter(f => f.shared).length}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Arquivos compartilhados</div>
                    </motion.div>
                </motion.div>

                {/* Toolbar */}
                <motion.div
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                        <div className="flex items-center space-x-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar arquivos..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                />
                            </div>

                            {/* Filters */}
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as any)}
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            >
                                <option value="all">Todos</option>
                                <option value="folders">Pastas</option>
                                <option value="files">Arquivos</option>
                                <option value="images">Imagens</option>
                                <option value="documents">Documentos</option>
                                <option value="videos">Vídeos</option>
                            </select>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            >
                                <option value="name">Nome</option>
                                <option value="date">Data</option>
                                <option value="size">Tamanho</option>
                                <option value="type">Tipo</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => loadFiles()}
                                className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                <RefreshCw className="h-4 w-4" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Files Grid/List */}
                <motion.div
                    className="bg-white rounded-xl shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Arquivos e Pastas
                            </h2>
                            {selectedFiles.length > 0 && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">
                                        {selectedFiles.length} selecionado(s)
                                    </span>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                    >
                                        <Share2 className="h-4 w-4" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </motion.button>
                                </div>
                            )}
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : filteredFiles.length === 0 ? (
                            <motion.div
                                className="text-center py-12"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Cloud className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Nenhum arquivo encontrado
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {searchQuery || filterType !== 'all'
                                        ? 'Tente ajustar os filtros ou busca.'
                                        : 'Faça upload do seu primeiro arquivo para começar.'
                                    }
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowUploadModal(true)}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                                >
                                    <Upload className="h-4 w-4 mr-2 inline" />
                                    Fazer Upload
                                </motion.button>
                            </motion.div>
                        ) : (
                            <div className={viewMode === 'grid'
                                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'
                                : 'space-y-2'
                            }>
                                <AnimatePresence>
                                    {filteredFiles.map((file, index) => (
                                        <motion.div
                                            key={file.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`group cursor-pointer ${viewMode === 'grid'
                                                    ? 'bg-gradient-to-br from-white to-gray-50/50 border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300'
                                                    : 'flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors'
                                                } ${selectedFiles.includes(file.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                                            onClick={() => toggleFileSelection(file.id)}
                                        >
                                            {viewMode === 'grid' ? (
                                                <div className="text-center">
                                                    <div className="flex justify-center mb-3">
                                                        {file.type === 'file' && file.thumbnail ? (
                                                            <img
                                                                src={file.thumbnail}
                                                                alt={file.name}
                                                                className="w-12 h-12 object-cover rounded-lg"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 flex items-center justify-center">
                                                                {getFileIcon(file)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h3 className="font-medium text-gray-900 text-sm truncate group-hover:text-blue-700 transition-colors">
                                                            {file.name}
                                                        </h3>
                                                        {file.size && (
                                                            <p className="text-xs text-gray-500">
                                                                {formatFileSize(file.size)}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center justify-center space-x-1">
                                                            {file.starred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                                                            {file.shared && <Users className="h-3 w-3 text-purple-500" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                                                        <div className="flex-shrink-0">
                                                            {getFileIcon(file)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-medium text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                                                                {file.name}
                                                            </h3>
                                                            <p className="text-sm text-gray-500">
                                                                {formatDate(file.modifiedAt)} • {file.owner}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-4">
                                                        {file.size && (
                                                            <span className="text-sm text-gray-500 w-20 text-right">
                                                                {formatFileSize(file.size)}
                                                            </span>
                                                        )}
                                                        <div className="flex items-center space-x-1">
                                                            {file.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                                                            {file.shared && <Users className="h-4 w-4 text-purple-500" />}
                                                        </div>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            className="p-1 text-gray-400 hover:text-gray-600 rounded"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                // Show context menu
                                                            }}
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </motion.button>
                                                    </div>
                                                </>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Upload Modal - Placeholder */}
            <AnimatePresence>
                {showUploadModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={(e) => e.target === e.currentTarget && setShowUploadModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Upload className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Upload de Arquivos
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Funcionalidade de upload em desenvolvimento. Em breve você poderá fazer upload de seus arquivos aqui.
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowUploadModal(false)}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all"
                                >
                                    Fechar
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}