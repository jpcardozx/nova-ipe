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
    Tag,
    AlertCircle,
    CheckCircle,
    X
} from 'lucide-react'
import {
    Card,
    MetricCard,
    Button,
    PageHeader,
    EmptyState,
    Skeleton,
    MetricsGrid
} from '@/lib/design-system/components'
import { CloudStorageService, CloudFile as CloudServiceFile, CloudFolder } from '@/app/lib/supabase/cloud-storage-service'

// Local interface for compatibility
interface CloudFile {
    id: string
    name: string
    type: 'file' | 'folder'
    size: number
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
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [dragOver, setDragOver] = useState(false)
    const [storageStats, setStorageStats] = useState({
        used: 0,
        total: 0,
        files: 0,
        folders: 0
    })
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    useEffect(() => {
        loadFiles()
        loadStorageStats()
    }, [currentPath, filterType, sortBy])

    const loadFiles = async () => {
        setLoading(true)
        try {
            const { files, error } = await CloudStorageService.getFiles(currentPath)

            if (error) {
                throw new Error('Erro ao carregar arquivos')
            }

            // Convert API files to local interface
            const convertedFiles: CloudFile[] = files.map(file => ({
                id: file.id,
                name: file.name,
                type: 'file',
                size: file.size,
                mimeType: file.type,
                createdAt: file.created_at,
                modifiedAt: file.updated_at,
                owner: 'Usuário Atual',
                shared: false,
                starred: false,
                tags: [],
                path: file.path,
                url: file.path,
                thumbnail: undefined
            }))

            setFiles(convertedFiles)
            showNotification('success', 'Arquivos carregados com sucesso')
        } catch (error) {
            console.error('Erro ao carregar arquivos:', error)
            showNotification('error', 'Erro ao carregar arquivos')
        } finally {
            setLoading(false)
        }
    }

    const loadStorageStats = async () => {
        try {
            // Use real stats based on current files
            const totalSize = files.reduce((sum, file) => sum + file.size, 0)
            setStorageStats({
                used: totalSize,
                total: 5 * 1024 * 1024 * 1024, // 5GB limit
                files: files.length,
                folders: 0 // TODO: Implement folder counting
            })
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error)
        }
    }

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message })
        setTimeout(() => setNotification(null), 3000)
    }

    const handleUpload = async (uploadFiles: FileList) => {
        if (!uploadFiles || uploadFiles.length === 0) return

        setUploading(true)
        setUploadProgress(0)

        try {
            const totalFiles = uploadFiles.length
            let uploadedFiles = 0

            for (const file of Array.from(uploadFiles)) {
                console.log(`Uploading file: ${file.name}`)

                const { path, error } = await CloudStorageService.uploadFile(file, currentPath)

                if (error) {
                    console.error(`Error uploading ${file.name}:`, error)
                    throw new Error(`Erro ao fazer upload de ${file.name}: ${error}`)
                }

                uploadedFiles++
                setUploadProgress((uploadedFiles / totalFiles) * 100)

                console.log(`Successfully uploaded: ${file.name} to ${path}`)
            }

            await loadFiles()
            await loadStorageStats()
            showNotification('success', `${uploadFiles.length} arquivo(s) enviado(s) com sucesso`)
            setShowUploadModal(false)
        } catch (error) {
            console.error('Erro no upload:', error)
            showNotification('error', error instanceof Error ? error.message : 'Erro ao fazer upload dos arquivos')
        } finally {
            setUploading(false)
            setUploadProgress(0)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)

        const droppedFiles = e.dataTransfer.files
        if (droppedFiles.length > 0) {
            handleUpload(droppedFiles)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
    }

    const handleDelete = async (id: string) => {
        const file = files.find(f => f.id === id)
        if (!file) return

        try {
            const deleteResult = await CloudStorageService.deleteFile(file.path)

            if (deleteResult && deleteResult.success) {
                setFiles(prev => prev.filter(f => f.id !== id))
                await loadStorageStats()
                showNotification('success', `"${file.name}" foi excluído`)
            } else {
                throw new Error('Erro ao excluir arquivo')
            }
        } catch (error) {
            console.error('Erro ao excluir:', error)
            showNotification('error', 'Erro ao excluir arquivo')
        }
    }

    const handleToggleStar = async (id: string) => {
        // TODO: Implement star/favorite functionality
        setFiles(prev => prev.map(f =>
            f.id === id ? { ...f, starred: !f.starred } : f
        ))
        const file = files.find(f => f.id === id)
        showNotification('success', file?.starred ? 'Removido dos favoritos' : 'Adicionado aos favoritos')
    }

    // Funções auxiliares
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
            return <Folder className="h-8 w-8 text-primary-600" />
        }

        const mimeType = file.mimeType || ''
        if (mimeType.startsWith('image/')) {
            return <FileImage className="h-8 w-8 text-success-600" />
        }
        if (mimeType.includes('pdf')) {
            return <FileText className="h-8 w-8 text-error-600" />
        }
        if (mimeType.startsWith('video/')) {
            return <FileVideo className="h-8 w-8 text-info-600" />
        }
        if (mimeType.includes('zip') || mimeType.includes('rar')) {
            return <Archive className="h-8 w-8 text-warning-600" />
        }
        return <File className="h-8 w-8 text-neutral-500" />
    }

    const handleSelectFile = (id: string) => {
        setSelectedFiles(prev =>
            prev.includes(id)
                ? prev.filter(fileId => fileId !== id)
                : [...prev, id]
        )
    }

    const toggleFileSelection = (fileId: string) => {
        setSelectedFiles(prev =>
            prev.includes(fileId)
                ? prev.filter(id => id !== fileId)
                : [...prev, fileId]
        )
    }

    const filteredFiles = files.filter(file => {
        // Filtro por busca
        if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false
        }

        // Filtro por tipo
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
        <div className="min-h-screen bg-neutral-50">
            {/* Page Header with Design System */}
            <PageHeader
                title="Cloud Storage"
                subtitle="Gerencie documentos, imagens e arquivos da imobiliária"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Cloud Storage' }
                ]}
            >
                <motion.div className="text-sm text-neutral-600 bg-primary-50 px-3 py-1 rounded-full font-medium">
                    {formatFileSize(storageStats.used)} / {formatFileSize(storageStats.total)}
                </motion.div>
                <Button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-2"
                >
                    <Upload className="h-4 w-4" />
                    Upload
                </Button>
            </PageHeader>

            <div className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Storage Stats com Design System */}
                <MetricsGrid>
                    <MetricCard
                        title="Armazenamento"
                        value={`${formatFileSize(storageStats.used)} / ${formatFileSize(storageStats.total)}`}
                        description={`${usagePercentage.toFixed(1)}% utilizado`}
                        status={usagePercentage > 80 ? 'warning' : 'default'}
                        icon={<HardDrive className="h-5 w-5" />}
                    />

                    <MetricCard
                        title="Arquivos"
                        value={storageStats.files.toString()}
                        description="Total de arquivos"
                        icon={<File className="h-5 w-5" />}
                    />

                    <MetricCard
                        title="Pastas"
                        value={storageStats.folders.toString()}
                        description="Total de pastas"
                        icon={<Folder className="h-5 w-5" />}
                    />

                    <MetricCard
                        title="Compartilhados"
                        value={files.filter(f => f.shared).length.toString()}
                        description="Arquivos compartilhados"
                        icon={<Users className="h-5 w-5" />}
                    />
                </MetricsGrid>

                {/* Toolbar com Design System */}
                <Card padding="md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            {/* Search */}
                            <div className="relative min-w-0">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 text-neutral-400 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Buscar arquivos..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full sm:w-64 border border-neutral-200 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                                />
                            </div>

                            {/* Filters */}
                            <div className="flex gap-2">
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value as any)}
                                    className="px-3 py-2 border border-neutral-200 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-sm"
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
                                    className="px-3 py-2 border border-neutral-200 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-sm"
                                >
                                    <option value="name">Nome</option>
                                    <option value="date">Data</option>
                                    <option value="size">Tamanho</option>
                                    <option value="type">Tipo</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => loadFiles()}
                                title="Atualizar"
                            >
                                <RefreshCw className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                title={`Mudar para visão em ${viewMode === 'grid' ? 'lista' : 'grade'}`}
                            >
                                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Files Grid/List */}
                <Card padding="md">
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
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-neutral-600">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-200 border-t-primary-600"></div>
                                Carregando arquivos...
                            </div>
                            {/* Loading Skeletons */}
                            <div className={viewMode === 'grid'
                                ? 'grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'
                                : 'space-y-3'
                            }>
                                {Array.from({ length: viewMode === 'grid' ? 12 : 6 }).map((_, i) => (
                                    <div key={i} className={viewMode === 'grid'
                                        ? 'space-y-3'
                                        : 'flex items-center gap-3'
                                    }>
                                        <Skeleton className={viewMode === 'grid' ? 'h-12 w-12 rounded-lg mx-auto' : 'h-8 w-8 rounded'} />
                                        <div className={viewMode === 'grid' ? 'space-y-2 text-center' : 'flex-1 space-y-2'}>
                                            <Skeleton className={viewMode === 'grid' ? 'h-4 w-20 mx-auto' : 'h-4 w-40'} />
                                            <Skeleton className={viewMode === 'grid' ? 'h-3 w-16 mx-auto' : 'h-3 w-24'} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : filteredFiles.length === 0 ? (
                        <EmptyState
                            icon={<Cloud />}
                            title="Nenhum arquivo encontrado"
                            description={
                                searchQuery || filterType !== 'all'
                                    ? 'Tente ajustar os filtros ou termo de busca.'
                                    : 'Faça upload do seu primeiro arquivo para começar a usar o Cloud Storage.'
                            }
                            action={
                                !searchQuery && filterType === 'all' ? (
                                    <Button onClick={() => setShowUploadModal(true)}>
                                        <Upload className="h-4 w-4 mr-2" />
                                        Fazer Upload
                                    </Button>
                                ) : null
                            }
                        />
                    ) : (
                        <div className={viewMode === 'grid'
                            ? 'grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'
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
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            // Show context menu
                                                        }}
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </Card>
            </div>

            {/* Upload Modal com Design System */}
            <AnimatePresence>
                {showUploadModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={(e) => e.target === e.currentTarget && !uploading && setShowUploadModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        >
                            <Card className="w-full max-w-lg" padding="lg">
                                <div className="space-y-6">
                                    <div className="text-center space-y-2">
                                        <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                                            <Upload className="h-8 w-8 text-primary-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-neutral-900">
                                            Upload de Arquivos
                                        </h3>
                                        <p className="text-neutral-600">
                                            {uploading ? 'Enviando arquivos...' : 'Selecione os arquivos que deseja enviar para o cloud storage'}
                                        </p>
                                    </div>

                                    {/* Progress Bar */}
                                    {uploading && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-neutral-600">Progresso</span>
                                                <span className="text-neutral-900 font-medium">{Math.round(uploadProgress)}%</span>
                                            </div>
                                            <div className="w-full bg-neutral-200 rounded-full h-2">
                                                <div
                                                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${uploadProgress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* File Upload Area */}
                                    {!uploading && (
                                        <div className="space-y-4">
                                            <label className="block">
                                                <input
                                                    type="file"
                                                    multiple
                                                    className="sr-only"
                                                    onChange={(e) => {
                                                        if (e.target.files) {
                                                            handleUpload(e.target.files)
                                                        }
                                                    }}
                                                />
                                                <div
                                                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer
                                                        ${dragOver
                                                            ? 'border-primary-500 bg-primary-50'
                                                            : 'border-neutral-300 hover:border-primary-400 hover:bg-primary-50/50'
                                                        }`}
                                                    onDrop={handleDrop}
                                                    onDragOver={handleDragOver}
                                                    onDragLeave={handleDragLeave}
                                                >
                                                    <Upload className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
                                                    <div className="space-y-2">
                                                        <p className="text-sm font-medium text-neutral-900">
                                                            Clique para selecionar arquivos
                                                        </p>
                                                        <p className="text-xs text-neutral-500">
                                                            Ou arraste e solte aqui
                                                        </p>
                                                        <p className="text-xs text-neutral-400">
                                                            PNG, JPG, PDF, DOC, MP4 até 50MB
                                                        </p>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    )}

                                    <div className="flex gap-3 justify-end pt-2">
                                        <Button
                                            variant="secondary"
                                            onClick={() => setShowUploadModal(false)}
                                            disabled={uploading}
                                        >
                                            {uploading ? 'Aguarde...' : 'Cancelar'}
                                        </Button>
                                        {!uploading && (
                                            <Button
                                                onClick={() => {
                                                    const input = document.createElement('input')
                                                    input.type = 'file'
                                                    input.multiple = true
                                                    input.onchange = (e) => {
                                                        const target = e.target as HTMLInputElement
                                                        if (target.files) {
                                                            handleUpload(target.files)
                                                        }
                                                    }
                                                    input.click()
                                                }}
                                            >
                                                Selecionar Arquivos
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Notification */}
            {notification && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-4 right-4 z-50"
                >
                    <Card padding="md" className={`flex items-center gap-3 ${notification.type === 'success' ? 'bg-success-50 border-success-200' : 'bg-error-50 border-error-200'
                        }`}>
                        {notification.type === 'success' ? (
                            <CheckCircle className="h-5 w-5 text-success-600" />
                        ) : (
                            <AlertCircle className="h-5 w-5 text-error-600" />
                        )}
                        <span className={`text-sm font-medium ${notification.type === 'success' ? 'text-success-800' : 'text-error-800'
                            }`}>
                            {notification.message}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setNotification(null)}
                            className="h-6 w-6"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </Card>
                </motion.div>
            )}
        </div>
    )
}