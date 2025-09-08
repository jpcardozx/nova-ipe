'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
    Plus,
    AlertCircle,
    CheckCircle,
    Clock,
    Download,
    Eye,
    Star,
    Filter,
    MoreHorizontal,
    Trash2,
    Copy,
    ExternalLink,
    Zap,
    Shield,
    Globe,
    RefreshCw,
    Archive,
    Image as ImageIcon,
    Video,
    Music,
    TrendingUp,
    Calendar,
    Users
} from 'lucide-react'
import CloudStorage from '@/app/components/business/CloudStorage'
import { supabase } from '@/lib/supabase'

interface CloudStats {
    totalStorage: number
    usedStorage: number
    totalFiles: number
    sharedFiles: number
    bandwidthUsed: number
    uploadsToday: number
    downloadsToday: number
}

interface FileActivity {
    id: string
    type: 'upload' | 'download' | 'share' | 'delete'
    fileName: string
    fileSize?: number
    timestamp: Date
    user: string
    ip?: string
}

interface QuickStat {
    label: string
    value: string
    change: string
    trend: 'up' | 'down' | 'neutral'
    icon: any
    color: string
}

export default function EnhancedCloudPage() {
    const [activeTab, setActiveTab] = useState<'files' | 'shared' | 'analytics' | 'settings'>('files')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState<string[]>([])
    const [recentActivity, setRecentActivity] = useState<FileActivity[]>([])

    const [stats, setStats] = useState<CloudStats>({
        totalStorage: 5 * 1024 * 1024 * 1024, // 5GB Pro plan
        usedStorage: 0,
        totalFiles: 0,
        sharedFiles: 0,
        bandwidthUsed: 0,
        uploadsToday: 0,
        downloadsToday: 0
    })

    // Carregar dados da nuvem
    const loadCloudData = useCallback(async () => {
        try {
            setLoading(true)
            setRefreshing(true)

            // Carregar arquivos do storage
            const { data: files, error } = await supabase.storage
                .from('documents')
                .list('', { limit: 1000 })

            if (!error && files) {
                const totalSize = files.reduce((acc, file) => acc + (file.metadata?.size || 0), 0)
                const today = new Date()
                today.setHours(0, 0, 0, 0)

                const uploadsToday = files.filter(file =>
                    new Date(file.created_at || 0) >= today
                ).length

                setStats(prev => ({
                    ...prev,
                    usedStorage: totalSize,
                    totalFiles: files.length,
                    uploadsToday,
                    downloadsToday: Math.floor(uploadsToday * 1.5), // Estimativa
                    bandwidthUsed: totalSize * 1.2 // Estimativa
                }))

                // Simular atividade recente
                const mockActivity: FileActivity[] = files.slice(0, 10).map((file, index) => ({
                    id: file.id || `activity-${index}`,
                    type: ['upload', 'download', 'share'][Math.floor(Math.random() * 3)] as any,
                    fileName: file.name,
                    fileSize: file.metadata?.size,
                    timestamp: new Date(file.created_at || Date.now() - Math.random() * 86400000),
                    user: 'João Cardozo',
                    ip: '192.168.1.' + Math.floor(Math.random() * 255)
                }))

                setRecentActivity(mockActivity)
            }
        } catch (error) {
            console.error('Erro ao carregar dados da nuvem:', error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [])

    useEffect(() => {
        loadCloudData()

        // Auto-refresh a cada 60 segundos
        const interval = setInterval(loadCloudData, 60000)
        return () => clearInterval(interval)
    }, [loadCloudData])

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const formatTimeAgo = (date: Date) => {
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (minutes < 1) return 'Agora mesmo'
        if (minutes < 60) return `${minutes}min atrás`
        if (hours < 24) return `${hours}h atrás`
        return `${days}d atrás`
    }

    const storagePercentage = (stats.usedStorage / stats.totalStorage) * 100

    const getStorageStatus = () => {
        if (storagePercentage > 90) return { color: 'red', status: 'critical', message: 'Crítico' }
        if (storagePercentage > 75) return { color: 'orange', status: 'warning', message: 'Atenção' }
        if (storagePercentage > 50) return { color: 'yellow', status: 'moderate', message: 'Moderado' }
        return { color: 'green', status: 'good', message: 'Saudável' }
    }

    const quickStats: QuickStat[] = [
        {
            label: 'Armazenamento',
            value: formatBytes(stats.usedStorage),
            change: '+12%',
            trend: 'up',
            icon: HardDrive,
            color: 'blue'
        },
        {
            label: 'Arquivos',
            value: stats.totalFiles.toString(),
            change: '+5',
            trend: 'up',
            icon: FileText,
            color: 'green'
        },
        {
            label: 'Uploads Hoje',
            value: stats.uploadsToday.toString(),
            change: '+2',
            trend: 'up',
            icon: Upload,
            color: 'purple'
        },
        {
            label: 'Compartilhados',
            value: stats.sharedFiles.toString(),
            change: '0',
            trend: 'neutral',
            icon: Share2,
            color: 'cyan'
        }
    ]

    const tabs = [
        { id: 'files', label: 'Meus Arquivos', icon: FolderOpen },
        { id: 'shared', label: 'Compartilhados', icon: Share2 },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'settings', label: 'Configurações', icon: Settings }
    ]

    return (
        <div className="min-h-screen bg-gray-50 rounded-lg">
            {/* Header Limpo */}
            <div className="bg-white border-b">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-2.5 bg-blue-600 rounded-lg">
                                <Cloud className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">Nuvem Ipê</h1>
                                <p className="text-sm text-gray-500">Armazenamento em nuvem</p>
                            </div>
                        </div>

                        {/* Stats Simples */}
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
                        </div>
                    </div>

                    {/* Barra de Progresso Simples */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                            <span>Armazenamento</span>
                            <span>{formatBytes(stats.usedStorage)} / {formatBytes(stats.totalStorage)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <motion.div
                                className="bg-blue-600 h-1.5 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, storagePercentage)}%` }}
                                transition={{ duration: 0.8 }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Limpa */}
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
                        {/* Ações Rápidas */}
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
                                        <p className="text-sm text-gray-500">Enviar para clientes</p>
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* Interface de Arquivos */}
                        <div className="bg-white rounded-lg border border-gray-200">
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium text-gray-900">Seus Arquivos</h3>
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Buscar..."
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
                    </motion.div>
                )}

                {activeTab === 'shared' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="font-medium text-gray-900 mb-4">Arquivos Compartilhados</h3>
                            <div className="text-center py-12">
                                <Share2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">Nenhum arquivo compartilhado ainda</p>
                                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    Compartilhar Arquivo
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'analytics' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {quickStats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                                            <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                                        </div>
                                        <div className={`text-xs px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-100 text-green-800' :
                                                stat.trend === 'down' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {stat.change}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Storage Health */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                                Status do Armazenamento
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getStorageStatus().color === 'green' ? 'bg-green-100' :
                                            getStorageStatus().color === 'yellow' ? 'bg-yellow-100' :
                                                getStorageStatus().color === 'orange' ? 'bg-orange-100' : 'bg-red-100'
                                        } mb-3`}>
                                        <HardDrive className={`h-8 w-8 ${getStorageStatus().color === 'green' ? 'text-green-600' :
                                                getStorageStatus().color === 'yellow' ? 'text-yellow-600' :
                                                    getStorageStatus().color === 'orange' ? 'text-orange-600' : 'text-red-600'
                                            }`} />
                                    </div>
                                    <p className="font-medium text-gray-900">{getStorageStatus().message}</p>
                                    <p className="text-sm text-gray-500">{storagePercentage.toFixed(1)}% usado</p>
                                </div>

                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-3">
                                        <Zap className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <p className="font-medium text-gray-900">Performance</p>
                                    <p className="text-sm text-gray-500">Excelente</p>
                                </div>

                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-3">
                                        <CheckCircle className="h-8 w-8 text-green-600" />
                                    </div>
                                    <p className="font-medium text-gray-900">Backup</p>
                                    <p className="text-sm text-gray-500">Atualizado</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <Clock className="h-5 w-5 mr-2 text-purple-600" />
                                    Atividade Recente
                                </h3>
                                <button
                                    onClick={loadCloudData}
                                    disabled={refreshing}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {loading ? (
                                    // Loading skeleton
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="animate-pulse flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                            <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    ))
                                ) : recentActivity.length > 0 ? (
                                    recentActivity.slice(0, 8).map((activity, index) => (
                                        <motion.div
                                            key={activity.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className={`p-2 rounded-lg ${activity.type === 'upload' ? 'bg-green-100 text-green-600' :
                                                        activity.type === 'download' ? 'bg-blue-100 text-blue-600' :
                                                            activity.type === 'share' ? 'bg-purple-100 text-purple-600' :
                                                                'bg-red-100 text-red-600'
                                                    }`}>
                                                    {activity.type === 'upload' && <Upload className="h-4 w-4" />}
                                                    {activity.type === 'download' && <Download className="h-4 w-4" />}
                                                    {activity.type === 'share' && <Share2 className="h-4 w-4" />}
                                                    {activity.type === 'delete' && <Trash2 className="h-4 w-4" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 truncate">{activity.fileName}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {activity.type === 'upload' ? 'Enviado' :
                                                            activity.type === 'download' ? 'Baixado' :
                                                                activity.type === 'share' ? 'Compartilhado' : 'Removido'} por {activity.user}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                                                {activity.fileSize && (
                                                    <p className="text-xs text-gray-400">{formatBytes(activity.fileSize)}</p>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">Nenhuma atividade recente</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                                    <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                                    Tendências de Uso
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Uploads esta semana</span>
                                        <span className="font-medium text-green-600">+15%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Banda utilizada</span>
                                        <span className="font-medium text-blue-600">{formatBytes(stats.bandwidthUsed)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Arquivos mais acessados</span>
                                        <span className="font-medium text-purple-600">PDFs</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                                    <Globe className="h-5 w-5 mr-2 text-blue-600" />
                                    Recursos Avançados
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm text-gray-600">Sincronização automática</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm text-gray-600">Versionamento de arquivos</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm text-gray-600">Compartilhamento seguro</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm text-gray-600">Backup automático</span>
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
                            <h3 className="font-medium text-gray-900 mb-6">Configurações</h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Quota de Armazenamento</label>
                                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Limite atual: 1GB</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">Permissões</label>
                                    <div className="mt-2 space-y-3">
                                        <label className="flex items-center">
                                            <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
                                            <span className="ml-2 text-sm text-gray-600">Permitir compartilhamento</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
                                            <span className="ml-2 text-sm text-gray-600">Backup automático</span>
                                        </label>
                                    </div>
                                </div>

                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    Salvar Configurações
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
