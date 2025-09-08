'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Cloud,
    CloudUpload,
    HardDrive,
    Users,
    Share2,
    Shield,
    Zap,
    Building,
    FileText,
    Image as ImageIcon,
    Video,
    Archive,
    Download,
    Upload,
    FolderOpen,
    Clock,
    Eye,
    UserCheck,
    Globe,
    Lock,
    AlertTriangle,
    CheckCircle,
    BarChart3,
    TrendingUp
} from 'lucide-react'
import CloudStorage from '@/app/components/business/CloudStorage'
import { supabase } from '@/lib/supabase'

interface CloudStats {
    totalStorage: number
    usedStorage: number
    totalFiles: number
    sharedFiles: number
    activeUsers: number
    uploadsThisMonth: number
}

export default function CloudPage() {
    const [activeTab, setActiveTab] = useState<'files' | 'stats' | 'shared' | 'settings'>('files')
    const [stats, setStats] = useState<CloudStats>({
        totalStorage: 1024 * 1024 * 1024, // 1GB
        usedStorage: 0,
        totalFiles: 0,
        sharedFiles: 0,
        activeUsers: 1,
        uploadsThisMonth: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadCloudStats()
        const interval = setInterval(loadCloudStats, 30000) // Atualiza a cada 30s
        return () => clearInterval(interval)
    }, [])

    const loadCloudStats = async () => {
        try {
            // Buscar estatísticas do storage
            const { data: files, error } = await supabase.storage
                .from('documents')
                .list()

            if (!error && files) {
                const totalFiles = files.length
                const usedStorage = files.reduce((acc, file) => {
                    return acc + (file.metadata?.size || 0)
                }, 0)

                setStats(prev => ({
                    ...prev,
                    totalFiles,
                    usedStorage,
                    uploadsThisMonth: Math.floor(totalFiles * 0.7)
                }))
            }
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const storagePercentage = (stats.usedStorage / stats.totalStorage) * 100

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
            {/* Header Principal */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl shadow-lg">
                                <Cloud className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Nuvem Ipê</h1>
                                <p className="text-gray-600 mt-1">Armazenamento seguro para sua imobiliária</p>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-4 text-white">
                                <div className="flex items-center space-x-2">
                                    <HardDrive className="h-5 w-5" />
                                    <span className="text-sm font-medium">Armazenamento</span>
                                </div>
                                <div className="mt-2">
                                    <div className="text-2xl font-bold">{formatBytes(stats.usedStorage)}</div>
                                    <div className="text-blue-100 text-sm">de {formatBytes(stats.totalStorage)}</div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white">
                                <div className="flex items-center space-x-2">
                                    <FileText className="h-5 w-5" />
                                    <span className="text-sm font-medium">Arquivos</span>
                                </div>
                                <div className="mt-2">
                                    <div className="text-2xl font-bold">{stats.totalFiles}</div>
                                    <div className="text-green-100 text-sm">Total</div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
                                <div className="flex items-center space-x-2">
                                    <Share2 className="h-5 w-5" />
                                    <span className="text-sm font-medium">Compartilhados</span>
                                </div>
                                <div className="mt-2">
                                    <div className="text-2xl font-bold">{stats.sharedFiles}</div>
                                    <div className="text-purple-100 text-sm">Arquivos</div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white">
                                <div className="flex items-center space-x-2">
                                    <TrendingUp className="h-5 w-5" />
                                    <span className="text-sm font-medium">Este Mês</span>
                                </div>
                                <div className="mt-2">
                                    <div className="text-2xl font-bold">{stats.uploadsThisMonth}</div>
                                    <div className="text-orange-100 text-sm">Uploads</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Barra de Progresso de Armazenamento */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                            <span>Armazenamento utilizado</span>
                            <span>{formatBytes(stats.usedStorage)} / {formatBytes(stats.totalStorage)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all duration-500 ${storagePercentage > 80
                                    ? 'bg-red-500'
                                    : storagePercentage > 60
                                        ? 'bg-yellow-500'
                                        : 'bg-gradient-to-r from-cyan-500 to-blue-600'
                                    }`}
                                style={{ width: `${Math.min(100, storagePercentage)}%` }}
                            ></div>
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

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8">
                        {[
                            { id: 'files', label: 'Meus Arquivos', icon: FolderOpen },
                            { id: 'shared', label: 'Compartilhados', icon: Share2 },
                            { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
                            { id: 'settings', label: 'Configurações', icon: Shield }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                    ? 'border-cyan-500 text-cyan-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <tab.icon className="h-4 w-4" />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {activeTab === 'files' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <CloudUpload className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">Upload de Arquivos</h3>
                                        <p className="text-sm text-gray-500">Envie documentos e imagens</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Share2 className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">Compartilhar Pasta</h3>
                                        <p className="text-sm text-gray-500">Crie links de compartilhamento</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Archive className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">Organizar</h3>
                                        <p className="text-sm text-gray-500">Criar pastas e organizar</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CloudStorage Component */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <CloudStorage />
                        </div>
                    </motion.div>
                )}

                {activeTab === 'shared' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                            <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Arquivos Compartilhados</h3>
                            <p className="text-gray-500 mb-6">
                                Visualize e gerencie todos os arquivos que você compartilhou com outros usuários.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <FileText className="h-5 w-5 text-blue-500" />
                                        <span className="font-medium text-gray-900">Contrato_Silva.pdf</span>
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <span className="flex items-center space-x-1">
                                            <UserCheck className="h-4 w-4" />
                                            <span>3 usuários</span>
                                        </span>
                                        <span className="flex items-center space-x-1">
                                            <Clock className="h-4 w-4" />
                                            <span>2 dias atrás</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <ImageIcon className="h-5 w-5 text-green-500" />
                                        <span className="font-medium text-gray-900">Fotos_Apartamento.zip</span>
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <span className="flex items-center space-x-1">
                                            <Globe className="h-4 w-4" />
                                            <span>Link público</span>
                                        </span>
                                        <span className="flex items-center space-x-1">
                                            <Eye className="h-4 w-4" />
                                            <span>15 visualizações</span>
                                        </span>
                                    </div>
                                </div>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Uploads Hoje</p>
                                        <p className="text-2xl font-bold text-gray-900">12</p>
                                    </div>
                                    <div className="p-3 bg-blue-100 rounded-full">
                                        <Upload className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center text-sm">
                                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                        <span className="text-green-500 font-medium">+15%</span>
                                        <span className="text-gray-500 ml-1">vs ontem</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Downloads</p>
                                        <p className="text-2xl font-bold text-gray-900">89</p>
                                    </div>
                                    <div className="p-3 bg-green-100 rounded-full">
                                        <Download className="h-6 w-6 text-green-600" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center text-sm">
                                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                        <span className="text-green-500 font-medium">+8%</span>
                                        <span className="text-gray-500 ml-1">esta semana</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                                    </div>
                                    <div className="p-3 bg-purple-100 rounded-full">
                                        <Users className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                        <span className="text-green-500 font-medium">Online agora</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Storage Usage Chart */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Uso de Armazenamento por Tipo</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <span className="text-sm text-gray-600">Documentos</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">45%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="text-sm text-gray-600">Imagens</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">30%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                        <span className="text-sm text-gray-600">Vídeos</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">20%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                        <span className="text-sm text-gray-600">Outros</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">5%</span>
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
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Configurações de Armazenamento</h3>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Backup Automático</h4>
                                        <p className="text-sm text-gray-500">Backup diário dos arquivos importantes</p>
                                    </div>
                                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2">
                                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Notificações de Quota</h4>
                                        <p className="text-sm text-gray-500">Avisar quando atingir 80% da capacidade</p>
                                    </div>
                                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-cyan-600 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2">
                                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Sincronização</h4>
                                        <p className="text-sm text-gray-500">Sincronizar arquivos em tempo real</p>
                                    </div>
                                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-cyan-600 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2">
                                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                                    </button>
                                </div>

                                <div className="border-t border-gray-200 pt-6">
                                    <h4 className="font-medium text-gray-900 mb-4">Plano de Armazenamento</h4>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-sm text-gray-600">Plano Atual:</span>
                                            <span className="ml-2 font-medium text-gray-900">Básico (1GB)</span>
                                        </div>
                                        <button className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors">
                                            Fazer Upgrade
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <button className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors">
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
