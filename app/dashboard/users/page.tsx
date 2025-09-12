'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Users,
    UserPlus,
    Search,
    Filter,
    MoreVertical,
    Lock,
    Shield,
    Edit,
    Trash2,
    Eye,
    UserCheck,
    UserX,
    AlertTriangle
} from 'lucide-react'
import { UserProfile } from '@/lib/auth/types'
import { RBACManager } from '@/lib/auth/rbac'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import PasswordChangeForm from '../components/PasswordChangeForm'

interface UserManagementState {
    users: UserProfile[]
    filteredUsers: UserProfile[]
    loading: boolean
    searchTerm: string
    statusFilter: 'all' | 'active' | 'inactive' | 'suspended'
    selectedUser: UserProfile | null
    showPasswordForm: boolean
    showUserModal: boolean
}

export default function UsersPage() {
    const { user: currentUser } = useCurrentUser()
    const [state, setState] = useState<UserManagementState>({
        users: [],
        filteredUsers: [],
        loading: true,
        searchTerm: '',
        statusFilter: 'all',
        selectedUser: null,
        showPasswordForm: false,
        showUserModal: false
    })

    const rbacManager = RBACManager.getInstance()

    // TODO: Replace with actual API call to fetch users from backend
    // Mock data removed for production - connect to real user management API
    const mockUsers: UserProfile[] = []

    useEffect(() => {
        // Carregar usuários do backend
        const loadUsers = async () => {
            try {
                // TODO: Implement actual API call to fetch users
                // const response = await fetch('/api/users')
                // const users = await response.json()

                setState(prev => ({
                    ...prev,
                    users: mockUsers, // Will be empty until real API is connected
                    filteredUsers: mockUsers,
                    loading: false
                }))
            } catch (error) {
                console.error('Erro ao carregar usuários:', error)
                setState(prev => ({ ...prev, loading: false }))
            }
        }

        loadUsers()
    }, [])

    // Filtrar usuários baseado na pesquisa e status
    useEffect(() => {
        let filtered = state.users

        // Filtro por texto
        if (state.searchTerm) {
            const search = state.searchTerm.toLowerCase()
            filtered = filtered.filter(user =>
                user.full_name.toLowerCase().includes(search) ||
                user.email.toLowerCase().includes(search) ||
                user.department?.toLowerCase().includes(search)
            )
        }

        // Filtro por status
        if (state.statusFilter !== 'all') {
            filtered = filtered.filter(user => user.status === state.statusFilter)
        }

        setState(prev => ({ ...prev, filteredUsers: filtered }))
    }, [state.searchTerm, state.statusFilter, state.users])

    const handlePasswordChange = (user: UserProfile) => {
        setState(prev => ({
            ...prev,
            selectedUser: user,
            showPasswordForm: true
        }))
    }

    const handleClosePasswordForm = () => {
        setState(prev => ({
            ...prev,
            selectedUser: null,
            showPasswordForm: false
        }))
    }

    const canChangePassword = async (targetUser: UserProfile) => {
        if (!currentUser) return false

        // Própria senha sempre pode alterar
        if (targetUser.id === currentUser.id) return true

        // Verificar permissão e hierarquia
        const hasPermission = await rbacManager.hasPermission(
            currentUser.id,
            'users',
            'update_password'
        )

        return hasPermission && targetUser.role.hierarchy_level < currentUser.role.hierarchy_level
    }

    const getStatusBadge = (status: UserProfile['status']) => {
        const styles = {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-gray-100 text-gray-800',
            suspended: 'bg-red-100 text-red-800'
        }

        const labels = {
            active: 'Ativo',
            inactive: 'Inativo',
            suspended: 'Suspenso'
        }

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
                {labels[status]}
            </span>
        )
    }

    const getRoleColor = (hierarchyLevel: number) => {
        if (hierarchyLevel >= 90) return 'text-purple-600 bg-purple-100'
        if (hierarchyLevel >= 70) return 'text-blue-600 bg-blue-100'
        if (hierarchyLevel >= 50) return 'text-green-600 bg-green-100'
        return 'text-gray-600 bg-gray-100'
    }

    if (state.loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h1>
                    <p className="text-gray-600">Administre usuários e permissões do sistema</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
                    <UserPlus className="h-4 w-4" />
                    Novo Usuário
                </button>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg border p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Busca */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Buscar usuários..."
                            value={state.searchTerm}
                            onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Filtro de Status */}
                    <div className="sm:w-48">
                        <select
                            value={state.statusFilter}
                            onChange={(e) => setState(prev => ({
                                ...prev,
                                statusFilter: e.target.value as typeof state.statusFilter
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">Todos os Status</option>
                            <option value="active">Ativo</option>
                            <option value="inactive">Inativo</option>
                            <option value="suspended">Suspenso</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Lista de Usuários */}
            <div className="bg-white rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Usuário
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cargo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Departamento
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Último Login
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {state.filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                                                    {user.full_name.charAt(0).toUpperCase()}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.full_name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role.hierarchy_level)}`}>
                                            {user.role.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.department || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(user.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.last_login ? new Date(user.last_login).toLocaleDateString('pt-BR') : 'Nunca'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handlePasswordChange(user)}
                                                className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                                title="Alterar Senha"
                                            >
                                                <Lock className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="text-gray-600 hover:text-gray-900 p-1 rounded"
                                                title="Editar Usuário"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="text-gray-600 hover:text-gray-900 p-1 rounded"
                                                title="Ver Detalhes"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            {user.status === 'active' ? (
                                                <button
                                                    className="text-red-600 hover:text-red-900 p-1 rounded"
                                                    title="Suspender Usuário"
                                                >
                                                    <UserX className="h-4 w-4" />
                                                </button>
                                            ) : (
                                                <button
                                                    className="text-green-600 hover:text-green-900 p-1 rounded"
                                                    title="Ativar Usuário"
                                                >
                                                    <UserCheck className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {state.filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum usuário encontrado</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Tente ajustar os filtros ou adicionar novos usuários.
                        </p>
                    </div>
                )}
            </div>

            {/* Modal de Alteração de Senha */}
            {state.showPasswordForm && state.selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">
                                Alterar Senha - {state.selectedUser.full_name}
                            </h2>
                            <button
                                onClick={handleClosePasswordForm}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        </div>

                        <PasswordChangeForm
                            targetUserId={state.selectedUser.id}
                            isAdminChange={state.selectedUser.id !== currentUser?.id}
                            onSuccess={handleClosePasswordForm}
                            onCancel={handleClosePasswordForm}
                        />
                    </div>
                </div>
            )}

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                            <p className="text-lg font-semibold text-gray-900">{state.users.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <UserCheck className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {state.users.filter(u => u.status === 'active').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Shield className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">Administradores</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {state.users.filter(u => u.role.hierarchy_level >= 90).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">Suspensos</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {state.users.filter(u => u.status === 'suspended').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
