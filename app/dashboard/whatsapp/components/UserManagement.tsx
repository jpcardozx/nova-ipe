import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  UserCheck,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  Crown,
  User,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'agent' | 'viewer'
  status: 'active' | 'inactive' | 'pending'
  lastLogin: string
  permissions: string[]
  avatar?: string
}

interface UserManagementProps {
  className?: string
}

const ROLES = {
  admin: { label: 'Administrador', color: 'text-red-600 bg-red-100', icon: Crown },
  manager: { label: 'Gerente', color: 'text-purple-600 bg-purple-100', icon: Shield },
  agent: { label: 'Corretor', color: 'text-blue-600 bg-blue-100', icon: User },
  viewer: { label: 'Visualizador', color: 'text-gray-600 bg-gray-100', icon: Eye }
}

const STATUS = {
  active: { label: 'Ativo', color: 'text-green-600 bg-green-100', icon: CheckCircle },
  inactive: { label: 'Inativo', color: 'text-red-600 bg-red-100', icon: XCircle },
  pending: { label: 'Pendente', color: 'text-yellow-600 bg-yellow-100', icon: Clock }
}

export default function UserManagement({ className = '' }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'João Admin',
      email: 'joao@imobiliariaipe.com.br',
      role: 'admin',
      status: 'active',
      lastLogin: '2025-09-29T10:30:00Z',
      permissions: ['all'],
      avatar: undefined
    },
    {
      id: '2',
      name: 'Maria Gerente',
      email: 'maria@imobiliariaipe.com.br',
      role: 'manager',
      status: 'active',
      lastLogin: '2025-09-29T09:15:00Z',
      permissions: ['whatsapp', 'email', 'reports', 'users_view']
    },
    {
      id: '3',
      name: 'Carlos Corretor',
      email: 'carlos@ipeimoveis.com',
      role: 'agent',
      status: 'active',
      lastLogin: '2025-09-28T16:45:00Z',
      permissions: ['whatsapp', 'email']
    },
    {
      id: '4',
      name: 'Ana Suporte',
      email: 'ana@ipeimoveis.com',
      role: 'viewer',
      status: 'pending',
      lastLogin: 'Nunca logou',
      permissions: ['whatsapp_view']
    }
  ])
  
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'agent' as User['role'],
    permissions: [] as string[]
  })

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return

    const user: User = {
      id: Date.now().toString(),
      ...newUser,
      status: 'pending',
      lastLogin: 'Nunca logou'
    }

    setUsers(prev => [...prev, user])
    setNewUser({ name: '', email: '', role: 'agent', permissions: [] })
    setShowAddUser(false)
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm('Tem certeza que deseja remover este usuário?')) {
      setUsers(prev => prev.filter(user => user.id !== userId))
    }
  }

  const handleToggleStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ))
  }

  const formatLastLogin = (lastLogin: string) => {
    if (lastLogin === 'Nunca logou') return lastLogin
    
    const date = new Date(lastLogin)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Agora há pouco'
    if (diffHours < 24) return `${diffHours}h atrás`
    if (diffHours < 168) return `${Math.floor(diffHours / 24)}d atrás`
    
    return date.toLocaleDateString('pt-BR')
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Search and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Usuários</h2>
          <p className="text-gray-600">Controle de acesso e permissões do sistema</p>
        </div>
        
        <button
          onClick={() => setShowAddUser(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Adicionar Usuário
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar usuários..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="all">Todos os Cargos</option>
          <option value="admin">Administrador</option>
          <option value="manager">Gerente</option>
          <option value="agent">Corretor</option>
          <option value="viewer">Visualizador</option>
        </select>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="all">Todos os Status</option>
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
          <option value="pending">Pendente</option>
        </select>
      </div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cargo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Login
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user, index) => {
                const RoleIcon = ROLES[user.role].icon
                const StatusIcon = STATUS[user.status].icon
                
                return (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full" />
                          ) : (
                            <span className="text-sm font-medium text-gray-600">
                              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLES[user.role].color}`}>
                        <RoleIcon className="h-3 w-3" />
                        {ROLES[user.role].label}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS[user.status].color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {STATUS[user.status].label}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatLastLogin(user.lastLogin)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-gray-400 hover:text-blue-600 transition-colors">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(user.id)}
                          className="text-gray-400 hover:text-green-600 transition-colors"
                        >
                          {user.status === 'active' ? <Lock className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add User Modal */}
      {showAddUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Usuário</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Nome completo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="email@exemplo.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as User['role'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="agent">Corretor</option>
                  <option value="manager">Gerente</option>
                  <option value="admin">Administrador</option>
                  <option value="viewer">Visualizador</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleAddUser}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Adicionar
              </button>
              <button
                onClick={() => setShowAddUser(false)}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}