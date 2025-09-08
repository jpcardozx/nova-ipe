'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Cloud,
    Upload,
    FolderOpen,
    Share2,
    Settings,
    HardDrive,
    FileText,
    BarChart3,
    Search,
    Grid3X3,
    List,
    Download,
    Eye,
    Trash2,
    Star,
    Clock,
    Link as LinkIcon,
    Shield,
    Zap,
    RefreshCw,
    AlertTriangle,
    CheckCircle,
    Copy,
    ExternalLink
} from 'lucide-react'
import CloudStorage from '@/app/components/business/CloudStorage'
import { supabase } from '@/lib/supabase'

interface CloudStats {
    totalStorage: number
    usedStorage: number
    totalFiles: number
    sharedFiles: number
    bandwidthUsed: number
    lastBackup: Date | null
}

interface RecentFile {
    id: string
    name: string
    size: number
    type: string
    uploadedAt: Date
    isShared: boolean
    downloadCount: number
}

export default function CloudPage() {
    const [activeTab, setActiveTab] = useState<'files' | 'shared' | 'stats' | 'settings'>('files')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const [stats, setStats] = useState<CloudStats>({
        totalStorage: 1024 * 1024 * 1024, // 1GB
        usedStorage: 0,
        totalFiles: 0,
        sharedFiles: 0,
        bandwidthUsed: 0,
        lastBackup: null
    })

    const [recentFiles, setRecentFiles] = useState<RecentFile[]>([])

    useEffect(() => {
        loadCloudData()
    }, [])

    const loadCloudData = async () => {
        try {
            setLoading(true)
            setRefreshing(true)

            // Carregar arquivos do storage
            const { data: files, error } = await supabase.storage
                .from('documents')
                .list('', { limit: 1000 })

            if (!error && files) {
                const totalSize = files.reduce((acc, file) => acc + (file.metadata?.size || 0), 0)

                setStats(prev => ({
                    ...prev,
                    usedStorage: totalSize,
                    totalFiles: files.length,
                    lastBackup: new Date() // Simular último backup
                }))

                // Simular arquivos recentes
                const mockRecentFiles: RecentFile[] = files.slice(0, 5).map((file, index) => ({
                    id: file.id || `file-${index}`,
                    name: file.name,
                    size: file.metadata?.size || 1024,
                    type: file.metadata?.mimetype || 'application/octet-stream',
                    uploadedAt: new Date(file.created_at || Date.now()),
                    isShared: Math.random() > 0.7,
                    downloadCount: Math.floor(Math.random() * 10)
                }))

                setRecentFiles(mockRecentFiles)
            }
        } catch (error) {
            console.error('Erro ao carregar dados da nuvem:', error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date)
    }

    const storagePercentage = (stats.usedStorage / stats.totalStorage) * 100

    const tabs = [
        { id: 'files', label: 'Arquivos', icon: FolderOpen },
        { id: 'shared', label: 'Compartilhados', icon: Share2 },
        { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
        { id: 'settings', label: 'Configurações', icon: Settings }
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-2.5 bg-blue-600 rounded-lg">
                                <Cloud className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">Ipê Cloud</h1>
                                <p className="text-sm text-gray-500">Armazenamento seguro na nuvem</p>
                            </div>
                        </div>

                        {/* Stats Header */}
                        <div className="flex items-center space-x-8">
                            <div className="text-center">
                                <p className="text-lg font-medium text-gray-900">
                                    {loading ? '...' : formatBytes(stats.usedStorage)}
                                </p>
                                <p className="text-xs text-gray-500">Usado</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-medium text-blue-600">
                                    {loading ? '...' : stats.totalFiles}
                                </p>
                                <p className="text-xs text-gray-500">Arquivos</p>
                            </div>
                            <button
                                onClick={loadCloudData}
                                disabled={refreshing}
                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                            <span>Armazenamento utilizado</span>
                            <span>{formatBytes(stats.usedStorage)} / {formatBytes(stats.totalStorage)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <motion.div
                                className={`h-1.5 rounded-full ${storagePercentage > 80 ? 'bg-red-500' :
                                        storagePercentage > 60 ? 'bg-yellow-500' : 'bg-blue-600'
                                    }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, storagePercentage)}%` }}
                                transition={{ duration: 0.8 }}
                            />
                        </div>
                        {storagePercentage > 80 && (
                            <div className="flex items-center mt-2 text-sm text-red-600">
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Armazenamento quase esgotado
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="bg-white border-b">
                <div className="max-w-6xl mx-auto px-6">
                    <nav className="flex space-x-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <tab.icon className="h-4 w-4" />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="max-w-6xl mx-auto px-6 py-6">
                {activeTab === 'files' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Quick Actions */}
                        <div className="grid grid-cols-3 gap-4">
                            <button className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors group">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                        <Upload className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900">Upload</p>
                                        <p className="text-sm text-gray-500">Adicionar arquivos</p>
                                    </div>
                                </div>
                            </button>

                            <button className="p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors group">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                                        <FolderOpen className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900">Nova Pasta</p>
                                        <p className="text-sm text-gray-500">Organizar arquivos</p>
                                    </div>
                                </div>
                            </button>

                            <button className="p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors group">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                                        <Share2 className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900">Compartilhar</p>
                                        <p className="text-sm text-gray-500">Gerar links</p>
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* Interface de Arquivos */}
                        <div className="bg-white rounded-lg border border-gray-200">
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium text-gray-900">Gerenciador de Arquivos</h3>
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Buscar arquivos..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div className="flex border border-gray-200 rounded-lg">
                                            <button
                                                onClick={() => setViewMode('grid')}
                                                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                                            >
                                                <Grid3X3 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => setViewMode('list')}
                                                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                                            >
                                                <List className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="min-h-[500px]">
                                <CloudStorage
                                    maxFileSize={100}
                                    allowedTypes={['image/*', 'application/pdf', 'text/*', 'video/*', '.doc', '.docx', '.xls', '.xlsx']}
                                />
                            </div>
                        </div>

                        {/* Arquivos Recentes */}
                        {recentFiles.length > 0 && (
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h3 className="font-medium text-gray-900 mb-4">Arquivos Recentes</h3>
                                <div className="space-y-3">
                                    {recentFiles.map((file) => (
                                        <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <FileText className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="font-medium text-gray-900">{file.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {formatBytes(file.size)} • {formatDate(file.uploadedAt)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {file.isShared && (
                                                    <Share2 className="h-4 w-4 text-blue-600" />
                                                )}
                                                <button className="p-1 text-gray-400 hover:text-gray-600">
                                                    <Download className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'shared' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="font-medium text-gray-900 mb-4">Links Compartilhados</h3>
                            <div className="text-center py-12">
                                <LinkIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 mb-4">Nenhum link compartilhado ainda</p>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    Criar Link de Compartilhamento
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'stats' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <HardDrive className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-gray-600">Armazenamento</p>
                                        <p className="text-xl font-semibold text-gray-900">{formatBytes(stats.usedStorage)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <FileText className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-gray-600">Total de Arquivos</p>
                                        <p className="text-xl font-semibold text-gray-900">{stats.totalFiles}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Share2 className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-gray-600">Compartilhados</p>
                                        <p className="text-xl font-semibold text-gray-900">{stats.sharedFiles}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recursos da Nuvem */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="font-medium text-gray-900 mb-6">Recursos da Nuvem Ipê</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="flex items-start space-x-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Shield className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Segurança</h4>
                                        <p className="text-sm text-gray-600 mt-1">Criptografia de ponta a ponta</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Zap className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Acesso Rápido</h4>
                                        <p className="text-sm text-gray-600 mt-1">CDN global para velocidade</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Clock className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Backup Automático</h4>
                                        <p className="text-sm text-gray-600 mt-1">Backup contínuo e versionamento</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'settings' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="font-medium text-gray-900 mb-6">Configurações da Nuvem</h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Quota de Armazenamento</label>
                                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Plano atual: 1GB</span>
                                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                                Fazer Upgrade
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">Configurações de Sincronização</label>
                                    <div className="mt-2 space-y-3">
                                        <label className="flex items-center">
                                            <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
                                            <span className="ml-2 text-sm text-gray-600">Sincronização automática</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
                                            <span className="ml-2 text-sm text-gray-600">Backup incremental</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                                            <span className="ml-2 text-gray-600">Compartilhamento público</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">Notificações</label>
                                    <div className="mt-2 space-y-3">
                                        <label className="flex items-center">
                                            <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
                                            <span className="ml-2 text-sm text-gray-600">Notificar sobre uploads</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                                            <span className="ml-2 text-gray-600">Alertas de quota</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        Salvar Configurações
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
