'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FiCloud,
    FiFolder,
    FiFolderPlus,
    FiUpload,
    FiDownload,
    FiFileText,
    FiImage,
    FiFile,
    FiTrash2,
    FiEdit3,
    FiShare2,
    FiCopy,
    FiMoreVertical,
    FiSearch,
    FiFilter,
    FiGrid,
    FiList,
    FiChevronRight,
    FiArrowLeft,
    FiPlus,
    FiX,
    FiCheck,
    FiEye,
    FiMove
} from 'react-icons/fi'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

interface CloudFile {
    id: string
    name: string
    path: string
    size: number
    type: string
    created_at: string
    updated_at: string
    folder_path?: string
    metadata?: {
        mimetype?: string
        lastModified?: string
        width?: number
        height?: number
    }
}

interface CloudFolder {
    id: string
    name: string
    path: string
    parent_path?: string
    created_at: string
    file_count?: number
    total_size?: number
}

interface CloudStorageProps {
    readonly?: boolean
    maxFileSize?: number // em MB
    allowedTypes?: string[]
}

export default function CloudStorage({
    readonly = false,
    maxFileSize = 50,
    allowedTypes = ['*']
}: CloudStorageProps) {
    const [files, setFiles] = useState<CloudFile[]>([])
    const [folders, setFolders] = useState<CloudFolder[]>([])
    const [currentPath, setCurrentPath] = useState<string>('/')
    const [pathHistory, setPathHistory] = useState<string[]>(['/'])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [showCreateFolder, setShowCreateFolder] = useState(false)
    const [newFolderName, setNewFolderName] = useState('')
    const [dragActive, setDragActive] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const dropZoneRef = useRef<HTMLDivElement>(null)

    // Carregar arquivos e pastas
    const loadContent = useCallback(async () => {
        try {
            setLoading(true)

            // Carregar pastas
            const { data: foldersData, error: foldersError } = await supabase
                .from('cloud_folders')
                .select('*')
                .eq('parent_path', currentPath)
                .order('name')

            if (foldersError) throw foldersError

            // Carregar arquivos
            const { data: filesData, error: filesError } = await supabase
                .storage
                .from('documents')
                .list(currentPath === '/' ? '' : currentPath, {
                    limit: 100,
                    offset: 0
                })

            if (filesError) throw filesError

            // Processar dados dos arquivos
            const processedFiles: CloudFile[] = filesData
                .filter(item => !item.name?.endsWith('/'))
                .map(file => ({
                    id: file.id || crypto.randomUUID(),
                    name: file.name,
                    path: `${currentPath}${currentPath.endsWith('/') ? '' : '/'}${file.name}`,
                    size: file.metadata?.size || 0,
                    type: file.metadata?.mimetype || 'application/octet-stream',
                    created_at: file.created_at || new Date().toISOString(),
                    updated_at: file.updated_at || new Date().toISOString(),
                    folder_path: currentPath,
                    metadata: file.metadata
                }))

            setFolders(foldersData || [])
            setFiles(processedFiles)
        } catch (error) {
            console.error('Erro ao carregar conteúdo:', error)
            toast.error('Erro ao carregar arquivos')
        } finally {
            setLoading(false)
        }
    }, [currentPath])

    useEffect(() => {
        loadContent()
    }, [loadContent])

    // Criar pasta
    const createFolder = async () => {
        if (!newFolderName.trim()) return

        try {
            const folderPath = `${currentPath}${currentPath.endsWith('/') ? '' : '/'}${newFolderName}`

            const { error } = await supabase
                .from('cloud_folders')
                .insert({
                    name: newFolderName,
                    path: folderPath,
                    parent_path: currentPath
                })

            if (error) throw error

            toast.success('Pasta criada com sucesso')
            setNewFolderName('')
            setShowCreateFolder(false)
            loadContent()
        } catch (error) {
            console.error('Erro ao criar pasta:', error)
            toast.error('Erro ao criar pasta')
        }
    }

    // Upload de arquivo
    const uploadFiles = async (fileList: FileList) => {
        if (readonly) {
            toast.error('Modo somente leitura')
            return
        }

        setUploading(true)
        const uploadPromises = []

        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i]

            // Validar tamanho
            if (file.size > maxFileSize * 1024 * 1024) {
                toast.error(`Arquivo ${file.name} excede o limite de ${maxFileSize}MB`)
                continue
            }

            // Validar tipo
            if (allowedTypes[0] !== '*' && !allowedTypes.some(type =>
                file.type.includes(type) || file.name.toLowerCase().endsWith(type)
            )) {
                toast.error(`Tipo de arquivo ${file.name} não permitido`)
                continue
            }

            const filePath = `${currentPath}${currentPath.endsWith('/') ? '' : '/'}${file.name}`

            uploadPromises.push(
                supabase.storage
                    .from('documents')
                    .upload(filePath, file, {
                        cacheControl: '3600',
                        upsert: false
                    })
            )
        }

        try {
            const results = await Promise.all(uploadPromises)
            const successCount = results.filter(result => !result.error).length
            const errorCount = results.filter(result => result.error).length

            if (successCount > 0) {
                toast.success(`${successCount} arquivo(s) enviado(s) com sucesso`)
                loadContent()
            }

            if (errorCount > 0) {
                toast.error(`${errorCount} arquivo(s) falharam no upload`)
            }
        } catch (error) {
            console.error('Erro no upload:', error)
            toast.error('Erro no upload dos arquivos')
        } finally {
            setUploading(false)
        }
    }

    // Download de arquivo
    const downloadFile = async (file: CloudFile) => {
        try {
            const { data, error } = await supabase.storage
                .from('documents')
                .download(file.path)

            if (error) throw error

            const url = URL.createObjectURL(data)
            const a = document.createElement('a')
            a.href = url
            a.download = file.name
            a.click()
            URL.revokeObjectURL(url)

            toast.success('Download iniciado')
        } catch (error) {
            console.error('Erro no download:', error)
            toast.error('Erro ao fazer download')
        }
    }

    // Deletar item
    const deleteItem = async (item: CloudFile | CloudFolder, type: 'file' | 'folder') => {
        if (readonly) {
            toast.error('Modo somente leitura')
            return
        }

        try {
            if (type === 'file') {
                const { error } = await supabase.storage
                    .from('documents')
                    .remove([item.path])

                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('cloud_folders')
                    .delete()
                    .eq('id', item.id)

                if (error) throw error
            }

            toast.success(`${type === 'file' ? 'Arquivo' : 'Pasta'} deletado com sucesso`)
            loadContent()
        } catch (error) {
            console.error('Erro ao deletar:', error)
            toast.error('Erro ao deletar item')
        }
    }

    // Navegar para pasta
    const navigateToFolder = (folderPath: string) => {
        setCurrentPath(folderPath)
        setPathHistory(prev => [...prev, folderPath])
    }

    // Voltar na navegação
    const navigateBack = () => {
        if (pathHistory.length > 1) {
            const newHistory = pathHistory.slice(0, -1)
            setPathHistory(newHistory)
            setCurrentPath(newHistory[newHistory.length - 1])
        }
    }

    // Drag and Drop
    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            uploadFiles(e.dataTransfer.files)
        }
    }, [])

    // Filtrar itens por busca
    const filteredFiles = files.filter(file =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const filteredFolders = folders.filter(folder =>
        folder.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Renderizar ícone do arquivo
    const getFileIcon = (file: CloudFile) => {
        if (file.type.startsWith('image/')) return <FiImage className="h-8 w-8" />
        if (file.type.includes('pdf')) return <FiFileText className="h-8 w-8" />
        return <FiFile className="h-8 w-8" />
    }

    // Formatar tamanho do arquivo
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <FiCloud className="h-6 w-6 text-blue-600" />
                        <h1 className="text-2xl font-bold text-gray-900">Nuvem de Documentos</h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                            className="p-2 text-gray-400 hover:text-gray-600"
                        >
                            {viewMode === 'grid' ? <FiList /> : <FiGrid />}
                        </button>
                        {!readonly && (
                            <>
                                <button
                                    onClick={() => setShowCreateFolder(true)}
                                    className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                    <FiFolderPlus className="h-4 w-4 mr-2" />
                                    Nova Pasta
                                </button>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    disabled={uploading}
                                >
                                    <FiUpload className="h-4 w-4 mr-2" />
                                    {uploading ? 'Enviando...' : 'Upload'}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Breadcrumb e Busca */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <button
                            onClick={navigateBack}
                            disabled={pathHistory.length <= 1}
                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                        >
                            <FiArrowLeft className="h-4 w-4" />
                        </button>
                        <span className="font-medium">{currentPath}</span>
                    </div>

                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar arquivos..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div
                ref={dropZoneRef}
                className={`flex-1 p-6 ${dragActive ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Pastas */}
                        {filteredFolders.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Pastas</h3>
                                <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4' : 'space-y-2'}>
                                    {filteredFolders.map((folder) => (
                                        <FolderCard
                                            key={folder.id}
                                            folder={folder}
                                            viewMode={viewMode}
                                            onOpen={() => navigateToFolder(folder.path)}
                                            onDelete={() => deleteItem(folder, 'folder')}
                                            readonly={readonly}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Arquivos */}
                        {filteredFiles.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Arquivos</h3>
                                <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4' : 'space-y-2'}>
                                    {filteredFiles.map((file) => (
                                        <FileCard
                                            key={file.id}
                                            file={file}
                                            viewMode={viewMode}
                                            onDownload={() => downloadFile(file)}
                                            onDelete={() => deleteItem(file, 'file')}
                                            readonly={readonly}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {filteredFiles.length === 0 && filteredFolders.length === 0 && !loading && (
                            <div className="text-center py-12">
                                <FiCloud className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {searchTerm ? 'Nenhum resultado encontrado' : 'Pasta vazia'}
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    {searchTerm
                                        ? 'Tente ajustar os termos de busca'
                                        : 'Comece enviando seus primeiros arquivos'
                                    }
                                </p>
                                {!readonly && !searchTerm && (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        <FiUpload className="h-4 w-4 mr-2" />
                                        Enviar Arquivos
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Drag Drop Overlay */}
                        {dragActive && (
                            <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-90 border-2 border-dashed border-blue-300 rounded-lg">
                                <div className="text-center">
                                    <FiUpload className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                                    <p className="text-lg font-medium text-blue-900">Solte os arquivos aqui</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                    if (e.target.files) {
                        uploadFiles(e.target.files)
                    }
                }}
                accept={allowedTypes[0] === '*' ? undefined : allowedTypes.join(',')}
            />

            {/* Create Folder Modal */}
            <AnimatePresence>
                {showCreateFolder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        onClick={() => setShowCreateFolder(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nova Pasta</h3>
                            <input
                                type="text"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                placeholder="Nome da pasta"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                                onKeyPress={(e) => e.key === 'Enter' && createFolder()}
                                autoFocus
                            />
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowCreateFolder(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={createFolder}
                                    disabled={!newFolderName.trim()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Criar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// Componente para Card de Pasta
const FolderCard = ({ folder, viewMode, onOpen, onDelete, readonly }: {
    folder: CloudFolder
    viewMode: 'grid' | 'list'
    onOpen: () => void
    onDelete: () => void
    readonly: boolean
}) => {
    const [showMenu, setShowMenu] = useState(false)

    if (viewMode === 'list') {
        return (
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50">
                <div className="flex items-center space-x-3" onClick={onOpen} className="cursor-pointer flex-1">
                    <FiFolder className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">{folder.name}</span>
                </div>
                {!readonly && (
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                    >
                        <FiMoreVertical className="h-4 w-4" />
                    </button>
                )}
            </div>
        )
    }

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={onOpen}
        >
            <div className="text-center">
                <FiFolder className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 truncate">{folder.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                    {folder.file_count || 0} arquivo(s)
                </p>
            </div>
            {!readonly && (
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete()
                    }}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <FiTrash2 className="h-4 w-4" />
                </button>
            )}
        </motion.div>
    )
}

// Componente para Card de Arquivo
const FileCard = ({ file, viewMode, onDownload, onDelete, readonly }: {
    file: CloudFile
    viewMode: 'grid' | 'list'
    onDownload: () => void
    onDelete: () => void
    readonly: boolean
}) => {
    const getFileIcon = (file: CloudFile) => {
        if (file.type.startsWith('image/')) return <FiImage className="h-5 w-5 text-green-600" />
        if (file.type.includes('pdf')) return <FiFileText className="h-5 w-5 text-red-600" />
        return <FiFile className="h-5 w-5 text-gray-600" />
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    if (viewMode === 'list') {
        return (
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50">
                <div className="flex items-center space-x-3 flex-1">
                    {getFileIcon(file)}
                    <div className="flex-1">
                        <p className="font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={onDownload}
                        className="p-2 text-gray-400 hover:text-blue-600"
                    >
                        <FiDownload className="h-4 w-4" />
                    </button>
                    {!readonly && (
                        <button
                            onClick={onDelete}
                            className="p-2 text-gray-400 hover:text-red-600"
                        >
                            <FiTrash2 className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow group"
        >
            <div className="text-center">
                <div className="flex justify-center mb-2">
                    {file.type.startsWith('image/') ? (
                        <FiImage className="h-12 w-12 text-green-600" />
                    ) : file.type.includes('pdf') ? (
                        <FiFileText className="h-12 w-12 text-red-600" />
                    ) : (
                        <FiFile className="h-12 w-12 text-gray-600" />
                    )}
                </div>
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">{formatFileSize(file.size)}</p>
            </div>

            <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={onDownload}
                    className="p-1 bg-white shadow-sm rounded text-gray-400 hover:text-blue-600"
                >
                    <FiDownload className="h-4 w-4" />
                </button>
                {!readonly && (
                    <button
                        onClick={onDelete}
                        className="p-1 bg-white shadow-sm rounded text-gray-400 hover:text-red-600"
                    >
                        <FiTrash2 className="h-4 w-4" />
                    </button>
                )}
            </div>
        </motion.div>
    )
}
