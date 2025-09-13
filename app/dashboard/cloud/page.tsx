'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CloudStorageService, type CloudFile, type StorageStats } from '@/lib/supabase/cloud-storage-service'
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
    Tag,
    AlertCircle,
    CheckCircle,
    X
} from 'lucide-react'

export default function CloudPage() {
    const [files, setFiles] = useState<CloudFile[]>([])
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedFiles, setSelectedFiles] = useState<string[]>([])
    const [currentPath, setCurrentPath] = useState('')
    const [filterType, setFilterType] = useState<'all' | 'files' | 'folders' | 'images' | 'documents' | 'videos'>('all')
    const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('name')
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [storageStats, setStorageStats] = useState<StorageStats>({
        used: 0,
        total: 0,
        files: 0,
        folders: 0
    })
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        loadFiles()
        loadStorageStats()
    }, [currentPath])

    const loadFiles = async () => {
        setLoading(true)
        try {
            const { files: filesData, error } = await CloudStorageService.listFiles(currentPath)
            if (error) {
                console.error('Error loading files:', error)
                setFiles([])
                showNotification('error', 'Erro ao carregar arquivos')
            } else {
                setFiles(filesData)
            }
        } catch (error) {
            console.error('Error loading files:', error)
            setFiles([])
            showNotification('error', 'Erro ao carregar arquivos')
        } finally {
            setLoading(false)
        }
    }

    const loadStorageStats = async () => {
        try {
            const stats = await CloudStorageService.getStorageStats()
            setStorageStats(stats)
        } catch (error) {
            console.error('Error loading storage stats:', error)
        }
    }

    const handleFileUpload = async (uploadedFiles: FileList) => {
        for (let i = 0; i < uploadedFiles.length; i++) {
            const file = uploadedFiles[i]
            try {
                const { data, error } = await CloudStorageService.uploadFile(file, currentPath)
                if (error) {
                    showNotification('error', `Erro ao fazer upload de ${file.name}`)
                } else {
                    showNotification('success', `${file.name} enviado com sucesso!`)
                }
            } catch (error) {
                console.error('Upload error:', error)
                showNotification('error', `Erro ao fazer upload de ${file.name}`)
            }
        }

        // Recarregar arquivos e estatísticas
        loadFiles()
        loadStorageStats()
        setShowUploadModal(false)
    }

    const handleDeleteFile = async (filePath: string) => {
        try {
            const { error } = await CloudStorageService.deleteFile(filePath)
            if (error) {
                showNotification('error', 'Erro ao deletar arquivo')
            } else {
                showNotification('success', 'Arquivo deletado com sucesso!')
                loadFiles()
                loadStorageStats()
            }
        } catch (error) {
            console.error('Delete error:', error)
            showNotification('error', 'Erro ao deletar arquivo')
        }
    }

    const handleDownloadFile = async (filePath: string, fileName: string) => {
        try {
            const { data, error } = await CloudStorageService.downloadFile(filePath)
            if (error || !data) {
                showNotification('error', 'Erro ao baixar arquivo')
                return
            }

            // Criar URL temporária e fazer download
            const url = window.URL.createObjectURL(data)
            const link = document.createElement('a')
            link.href = url
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(link)

            showNotification('success', 'Download iniciado!')
        } catch (error) {
            console.error('Download error:', error)
            showNotification('error', 'Erro ao baixar arquivo')
        }
    }

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message })
        setTimeout(() => setNotification(null), 3000)
    }

    const formatFileSize = (bytes: number) => {
        return CloudStorageService.formatFileSize(bytes)
    }

    const getFileIcon = (mimeType: string = '') => {
        if (mimeType.startsWith('image/')) return <FileImage className="h-8 w-8 text-blue-500" />
        if (mimeType.startsWith('video/')) return <FileVideo className="h-8 w-8 text-purple-500" />
        if (mimeType.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />
        return <File className="h-8 w-8 text-gray-500" />
    }

    const filteredFiles = files.filter(file => {
        // Search filter
        if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false
        }

        // Type filter
        if (filterType !== 'all') {
            if (filterType === 'files' && file.type !== 'file') return false
            if (filterType === 'folders' && file.type !== 'folder') return false
            if (filterType === 'images' && !file.mimeType?.startsWith('image/')) return false
            if (filterType === 'documents' && !file.mimeType?.includes('pdf') && !file.mimeType?.includes('doc')) return false
            if (filterType === 'videos' && !file.mimeType?.startsWith('video/')) return false
        }

        return true
    })

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Notification */}
            <AnimatePresence>
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
                        <div className="flex items-center gap-2">
                            {notification.type === 'success' ? (
                                <CheckCircle className="h-5 w-5" />
                            ) : (
                                <AlertCircle className="h-5 w-5" />
                            )}
                            {notification.message}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Cloud Storage
                    </h1>
                    <p className="text-gray-600">
                        Gerencie seus arquivos na nuvem com facilidade e segurança
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => loadFiles()}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Atualizar"
                    >
                        <RefreshCw className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title={`Mudar para ${viewMode === 'grid' ? 'lista' : 'grade'}`}
                    >
                        {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid3X3 className="h-5 w-5" />}
                    </button>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center gap-2"
                    >
                        <Upload className="h-4 w-4" />
                        Upload
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Espaço Usado</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatFileSize(storageStats.used)}
                            </p>
                            <p className="text-xs text-gray-500">
                                de {formatFileSize(storageStats.total)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                            <HardDrive className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-4 bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{
                                width: `${Math.min((storageStats.used / storageStats.total) * 100, 100)}%`
                            }}
                        />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Arquivos</p>
                            <p className="text-2xl font-bold text-gray-900">{storageStats.files}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                            <File className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Pastas</p>
                            <p className="text-2xl font-bold text-gray-900">{storageStats.folders}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                            <Folder className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Compartilhados</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {files.filter(f => f.shared).length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                            <Share2 className="h-6 w-6 text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar arquivos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex gap-2">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as any)}
                            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Todos os tipos</option>
                            <option value="files">Arquivos</option>
                            <option value="folders">Pastas</option>
                            <option value="images">Imagens</option>
                            <option value="documents">Documentos</option>
                            <option value="videos">Vídeos</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="name">Nome</option>
                            <option value="date">Data</option>
                            <option value="size">Tamanho</option>
                            <option value="type">Tipo</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Files Display */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
                            <p className="text-gray-600">Carregando arquivos...</p>
                        </div>
                    </div>
                ) : filteredFiles.length === 0 ? (
                    <div className="text-center py-12">
                        <Cloud className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Nenhum arquivo encontrado
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Faça upload de seus primeiros arquivos para começar
                        </p>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                        >
                            <Upload className="h-4 w-4" />
                            Fazer Upload
                        </button>
                    </div>
                ) : (
                    <div className={viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
                        : 'space-y-2'
                    }>
                        {filteredFiles.map((file) => (
                            <motion.div
                                key={file.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={viewMode === 'grid'
                                    ? "bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer"
                                    : "flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                }
                            >
                                {viewMode === 'grid' ? (
                                    <>
                                        <div className="text-center">
                                            <div className="flex justify-center mb-3">
                                                {file.type === 'folder' ? (
                                                    <Folder className="h-12 w-12 text-blue-500" />
                                                ) : (
                                                    getFileIcon(file.mimeType)
                                                )}
                                            </div>
                                            <p className="font-medium text-gray-900 text-sm truncate mb-1">
                                                {file.name}
                                            </p>
                                            {file.size && (
                                                <p className="text-xs text-gray-500">
                                                    {formatFileSize(file.size)}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex justify-center gap-1 mt-3">
                                            <button
                                                onClick={() => handleDownloadFile(file.path, file.name)}
                                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                title="Download"
                                            >
                                                <Download className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteFile(file.path)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Excluir"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3">
                                            {file.type === 'folder' ? (
                                                <Folder className="h-8 w-8 text-blue-500" />
                                            ) : (
                                                getFileIcon(file.mimeType)
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900">{file.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {file.size ? formatFileSize(file.size) : 'Pasta'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleDownloadFile(file.path, file.name)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                title="Download"
                                            >
                                                <Download className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteFile(file.path)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Excluir"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Upload Modal */}
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
                            className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6"
                        >
                            <div className="text-center space-y-4">
                                <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                                    <Upload className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Upload de Arquivos
                                    </h3>
                                    <p className="text-gray-600">
                                        Selecione os arquivos que deseja enviar para o cloud storage
                                    </p>
                                </div>

                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        onChange={(e) => {
                                            if (e.target.files) {
                                                handleFileUpload(e.target.files)
                                            }
                                        }}
                                        className="hidden"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full text-center space-y-2"
                                    >
                                        <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                                        <p className="text-sm text-gray-600">
                                            Clique para selecionar arquivos ou arraste aqui
                                        </p>
                                    </button>
                                </div>

                                <div className="flex gap-3 justify-center pt-2">
                                    <button
                                        onClick={() => setShowUploadModal(false)}
                                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Selecionar Arquivos
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
