'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X,
    Share2,
    Users,
    Search,
    UserPlus,
    Check,
    Mail,
    User,
    Shield,
    Eye,
    Edit3,
    Trash2,
    Clock
} from 'lucide-react'
import { User as SystemUser, UserService } from '@/lib/supabase/user-service'

interface ShareModalProps {
    isOpen: boolean
    onClose: () => void
    item: {
        id: string
        type: 'task' | 'document' | 'event' | 'appointment'
        title: string
    }
    onShare: (userIds: string[], permissions: 'view' | 'edit') => Promise<void>
}

interface SharedUser {
    id: string
    name: string
    email: string
    avatar?: string
    permissions: 'view' | 'edit'
    shared_at: string
}

export function ShareModal({ isOpen, onClose, item, onShare }: ShareModalProps) {
    const [users, setUsers] = useState<SystemUser[]>([])
    const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [permissions, setPermissions] = useState<'view' | 'edit'>('view')
    const [loading, setLoading] = useState(false)
    const [loadingUsers, setLoadingUsers] = useState(false)

    useEffect(() => {
        if (isOpen) {
            loadUsers()
            loadSharedUsers()
        }
    }, [isOpen, item.id])

    const loadUsers = async () => {
        setLoadingUsers(true)
        try {
            const allUsers = await UserService.getAllUsers()
            setUsers(allUsers)
        } catch (error) {
            console.error('Erro ao carregar usuários:', error)
        } finally {
            setLoadingUsers(false)
        }
    }

    const loadSharedUsers = async () => {
        // TODO: Implementar carregamento de usuários já compartilhados
        // Simular dados por enquanto
        setSharedUsers([])
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch = !searchQuery ||
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())

        const notAlreadyShared = !sharedUsers.some(shared => shared.id === user.id)

        return matchesSearch && notAlreadyShared
    })

    const handleUserToggle = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        )
    }

    const handleShare = async () => {
        if (selectedUsers.length === 0) return

        setLoading(true)
        try {
            await onShare(selectedUsers, permissions)

            // Adicionar usuários à lista de compartilhados
            const newSharedUsers = selectedUsers.map(userId => {
                const user = users.find(u => u.id === userId)!
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    permissions,
                    shared_at: new Date().toISOString()
                }
            })

            setSharedUsers(prev => [...prev, ...newSharedUsers])
            setSelectedUsers([])
            setSearchQuery('')
        } catch (error) {
            console.error('Erro ao compartilhar:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveShare = async (userId: string) => {
        // TODO: Implementar remoção de compartilhamento
        setSharedUsers(prev => prev.filter(user => user.id !== userId))
    }

    const getItemTypeLabel = () => {
        const labels = {
            task: 'Tarefa',
            document: 'Documento',
            event: 'Evento',
            appointment: 'Agendamento'
        }
        return labels[item.type]
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={(e) => e.target === e.currentTarget && onClose()}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Share2 className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Compartilhar {getItemTypeLabel()}
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {item.title}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="max-h-[70vh] overflow-y-auto">
                            {/* Usuários já compartilhados */}
                            {sharedUsers.length > 0 && (
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Compartilhado com ({sharedUsers.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {sharedUsers.map(user => (
                                            <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                                        <User className="h-4 w-4 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{user.name}</p>
                                                        <p className="text-sm text-gray-500">{user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        user.permissions === 'edit'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {user.permissions === 'edit' ? (
                                                            <><Edit3 className="h-3 w-3 inline mr-1" />Editar</>
                                                        ) : (
                                                            <><Eye className="h-3 w-3 inline mr-1" />Visualizar</>
                                                        )}
                                                    </span>
                                                    <button
                                                        onClick={() => handleRemoveShare(user.id)}
                                                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                        title="Remover compartilhamento"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Compartilhar com novos usuários */}
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                    <UserPlus className="h-5 w-5" />
                                    Compartilhar com
                                </h3>

                                {/* Busca de usuários */}
                                <div className="mb-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            placeholder="Buscar usuários por nome ou email..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Seleção de permissões */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Shield className="h-4 w-4 inline mr-1" />
                                        Permissões
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setPermissions('view')}
                                            className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                                                permissions === 'view'
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            <Eye className="h-4 w-4 inline mr-2" />
                                            Visualizar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPermissions('edit')}
                                            className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                                                permissions === 'edit'
                                                    ? 'border-green-500 bg-green-50 text-green-700'
                                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            <Edit3 className="h-4 w-4 inline mr-2" />
                                            Editar
                                        </button>
                                    </div>
                                </div>

                                {/* Lista de usuários */}
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {loadingUsers ? (
                                        <div className="flex items-center justify-center py-8">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                            <span className="ml-2 text-gray-600">Carregando usuários...</span>
                                        </div>
                                    ) : filteredUsers.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            {searchQuery ? 'Nenhum usuário encontrado' : 'Nenhum usuário disponível para compartilhar'}
                                        </div>
                                    ) : (
                                        filteredUsers.map(user => (
                                            <div
                                                key={user.id}
                                                onClick={() => handleUserToggle(user.id)}
                                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                                    selectedUsers.includes(user.id)
                                                        ? 'bg-blue-50 border border-blue-200'
                                                        : 'hover:bg-gray-50 border border-transparent'
                                                }`}
                                            >
                                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                                    <User className="h-4 w-4 text-gray-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">{user.name}</p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </div>
                                                {selectedUsers.includes(user.id) && (
                                                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                                        <Check className="h-3 w-3 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    {selectedUsers.length > 0 && (
                                        <span>{selectedUsers.length} usuário(s) selecionado(s)</span>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        disabled={selectedUsers.length === 0 || loading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                    >
                                        {loading ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                        ) : (
                                            <Share2 className="h-4 w-4" />
                                        )}
                                        Compartilhar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}