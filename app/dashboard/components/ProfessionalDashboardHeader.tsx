/**
 * Professional Dashboard Header com dados reais do Supabase
 * Sistema completo de notificações, lembretes e informações do usuário
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser-simple'
import { supabase } from '@/lib/supabase'
import {
  Search,
  Settings,
  User,
  LogOut,
  Bell,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Menu,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Badge,
  Crown,
  Shield,
  Activity
} from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { format, isToday, isThisWeek, isPast } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ProfessionalDashboardHeaderProps {
  sidebarCollapsed?: boolean
  onToggleSidebar?: () => void
}

interface UserStats {
  totalLeads: number
  activeDeals: number
  monthlyGoal: number
  achievement: number
  lastActivity: Date
}

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  is_read: boolean
  actionUrl?: string
}

interface Reminder {
  id: string
  title: string
  time: Date
  type: 'meeting' | 'call' | 'task' | 'followup'
  priority: 'high' | 'medium' | 'low'
}

export default function ProfessionalDashboardHeader({
  sidebarCollapsed,
  onToggleSidebar
}: ProfessionalDashboardHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useCurrentUser()
  
  // Estados
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showReminders, setShowReminders] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  
  // Stats e dados em tempo real
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  
  // Refs
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const reminderRef = useRef<HTMLDivElement>(null)

  // Atualizar horário a cada minuto
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Carregar dados do usuário
  useEffect(() => {
    if (user) {
      loadUserStats()
      loadNotifications()
      loadReminders()
    }
  }, [user])

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (reminderRef.current && !reminderRef.current.contains(event.target as Node)) {
        setShowReminders(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadUserStats = async () => {
    try {
      // TODO: Conectar com Supabase para dados reais
      // const { data } = await supabase.from('user_stats').select('*').eq('user_id', user.id).single()
      
      setUserStats({
        totalLeads: 0,
        activeDeals: 0,
        monthlyGoal: 100,
        achievement: 0,
        lastActivity: new Date()
      })
    } catch (error) {
      console.error('Erro ao carregar stats:', error)
    }
  }

  const loadNotifications = async () => {
    try {
      if (!user?.id) {
        console.warn('⚠️ loadNotifications: user.id não disponível')
        return
      }
      
      console.log('📡 loadNotifications: Carregando para user:', user.id)
      
      // Verificar sessão ativa
      const { data: { session } } = await supabase.auth.getSession()
      console.log('🔐 Sessão ativa:', session ? 'Sim' : 'Não')
      if (session) {
        console.log('👤 Sessão user_id:', session.user.id)
      }
      
      // Conectar com Supabase para notificações reais
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) {
        console.error('❌ Erro ao carregar notifications:', error)
        console.error('❌ Error details:', JSON.stringify(error, null, 2))
        // Se tabela não existe ainda, usar array vazio
        setNotifications([])
        setUnreadCount(0)
        return
      }

      const notifications = (data || []).map(n => ({
        id: n.id,
        type: n.type as 'info' | 'success' | 'warning' | 'error',
        title: n.title,
        message: n.message,
        timestamp: new Date(n.created_at),
        is_read: n.is_read,
        actionUrl: n.action_url
      }))
      
      setNotifications(notifications)
      setUnreadCount(notifications.filter(n => !n.is_read).length)
    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
      // Em caso de erro, usar valores padrão
      setNotifications([])
      setUnreadCount(0)
    }
  }

  const loadReminders = async () => {
    try {
      // TODO: Conectar com calendario/agenda
      const mockReminders: Reminder[] = []
      
      setReminders(mockReminders)
    } catch (error) {
      console.error('Erro ao carregar lembretes:', error)
    }
  }

  const getPageInfo = () => {
    const pathSegments = pathname.split('/').filter(Boolean)
    const currentPage = pathSegments[pathSegments.length - 1] || 'dashboard'

    const pageMap: Record<string, { title: string; subtitle: string; icon: any }> = {
      'dashboard': { 
        title: 'Dashboard', 
        subtitle: 'Visão geral do seu negócio imobiliário',
        icon: TrendingUp
      },
      'agenda': { 
        title: 'Agenda', 
        subtitle: 'Calendário e compromissos',
        icon: Calendar
      },
      'clientes': { 
        title: 'CRM', 
        subtitle: 'Gestão de clientes e relacionamentos',
        icon: User
      },
      'imoveis': { 
        title: 'Imóveis', 
        subtitle: 'Portfólio e propriedades',
        icon: MapPin
      }
    }

    return pageMap[currentPage] || pageMap['dashboard']
  }

  const getUserRole = () => {
    if (user?.email?.includes('admin')) return 'Administrador'
    if (user?.email?.includes('gerente')) return 'Gerente'
    if (user?.email?.includes('corretor')) return 'Corretor'
    return 'Usuário'
  }

  const getUserBadge = () => {
    const role = getUserRole()
    if (role === 'Administrador') return { icon: Crown, color: 'text-yellow-600', bg: 'bg-yellow-50' }
    if (role === 'Gerente') return { icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50' }
    return { icon: Badge, color: 'text-gray-600', bg: 'bg-gray-50' }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const pageInfo = getPageInfo()
  const userBadge = getUserBadge()
  const firstName = user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Usuário'
  const todayReminders = reminders.filter(r => isToday(r.time))
  const overdueReminders = reminders.filter(r => isPast(r.time) && !isToday(r.time))

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-40 transition-colors duration-200">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center flex-1 min-w-0">
          {/* Mobile Menu Button */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mr-3"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          {/* Page Title & Breadcrumb */}
          <div className="flex items-center min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${userBadge.bg} dark:bg-opacity-20`}>
                <pageInfo.icon className={`h-5 w-5 ${userBadge.color} dark:opacity-90`} />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {pageInfo.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate hidden md:block">
                  {pageInfo.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden lg:block ml-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar clientes, imóveis..."
                className="pl-10 pr-4 py-2 w-80 
                          border border-gray-200 dark:border-gray-800 
                          bg-white dark:bg-gray-800 
                          text-gray-900 dark:text-gray-100
                          placeholder:text-gray-400 dark:placeholder:text-gray-500
                          rounded-lg 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                          focus:border-transparent 
                          text-sm transition-all duration-200
                          hover:border-gray-300 dark:hover:border-gray-700"
              />
            </div>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Current Time */}
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mr-4">
            <Clock className="h-4 w-4" />
            {format(currentTime, 'HH:mm', { locale: ptBR })}
          </div>

          {/* Reminders */}
          <div className="relative" ref={reminderRef}>
            <button
              onClick={() => setShowReminders(!showReminders)}
              className="relative p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Calendar className="h-5 w-5" />
              {todayReminders.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-blue-500 dark:bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                  {todayReminders.length}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showReminders && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 
                            bg-white dark:bg-gray-900 
                            border border-gray-200 dark:border-gray-800 
                            rounded-lg shadow-xl z-50"
                >
                  <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Lembretes de Hoje</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {todayReminders.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300 dark:text-gray-700" />
                        <p>Nenhum lembrete hoje</p>
                      </div>
                    ) : (
                      todayReminders.map((reminder) => (
                        <div key={reminder.id} className="p-3 border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className={`p-1.5 rounded ${
                              reminder.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                              reminder.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                              'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                            }`}>
                              <Clock className="h-3 w-3" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{reminder.title}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {format(reminder.time, 'HH:mm', { locale: ptBR })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 dark:bg-red-600 text-white text-xs rounded-full flex items-center justify-center"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 
                            bg-white dark:bg-gray-900 
                            border border-gray-200 dark:border-gray-800 
                            rounded-lg shadow-xl z-50"
                >
                  <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notificações</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300 dark:text-gray-700" />
                        <p>Nenhuma notificação</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div key={notification.id} className="p-3 border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className={`p-1.5 rounded ${
                              notification.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                              notification.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                              notification.type === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                              'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            }`}>
                              {notification.type === 'success' ? <CheckCircle2 className="h-3 w-3" /> :
                               notification.type === 'warning' ? <AlertCircle className="h-3 w-3" /> :
                               notification.type === 'error' ? <AlertCircle className="h-3 w-3" /> :
                               <Bell className="h-3 w-3" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{notification.title}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                {format(notification.timestamp, 'dd/MM HH:mm', { locale: ptBR })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Settings */}
          <button 
            onClick={() => router.push('/dashboard/settings')}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Settings className="h-5 w-5" />
          </button>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <motion.button
              onClick={() => setShowUserMenu(!showUserMenu)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                  {firstName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {firstName}
                    </p>
                    <div className={`p-1 rounded ${userBadge.bg} dark:bg-opacity-20`}>
                      <userBadge.icon className={`h-3 w-3 ${userBadge.color} dark:opacity-90`} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {getUserRole()}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
            </motion.button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-64 
                            bg-white dark:bg-gray-900 
                            border border-gray-200 dark:border-gray-800 
                            rounded-lg shadow-xl z-50"
                >
                  {/* User Info */}
                  <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-lg flex items-center justify-center text-white font-semibold shadow-sm">
                        {firstName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {user?.full_name || firstName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {user?.email}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <userBadge.icon className={`h-3 w-3 ${userBadge.color} dark:opacity-90`} />
                          <span className="text-xs text-gray-500 dark:text-gray-400">{getUserRole()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Stats */}
                  {userStats && (
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div>
                          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{userStats.activeDeals}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Negócios Ativos</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{userStats.achievement}%</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Meta do Mês</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Menu Items */}
                  <div className="py-2">
                    <motion.button
                      onClick={() => {
                        router.push('/dashboard/profile')
                        setShowUserMenu(false)
                      }}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <User className="h-4 w-4" />
                      Meu Perfil
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        router.push('/dashboard/settings')
                        setShowUserMenu(false)
                      }}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <Settings className="h-4 w-4" />
                      Configurações
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        router.push('/dashboard/analytics')
                        setShowUserMenu(false)
                      }}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <Activity className="h-4 w-4" />
                      Minha Performance
                    </motion.button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100 dark:border-gray-800 py-2">
                    <motion.button
                      onClick={handleSignOut}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="h-4 w-4" />
                      Sair
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchQuery && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden px-4 pb-3"
        >
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 w-full 
                          border border-gray-300 dark:border-gray-700 
                          bg-white dark:bg-gray-800 
                          text-gray-900 dark:text-gray-100
                          placeholder:text-gray-400 dark:placeholder:text-gray-500
                          rounded-lg 
                          focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                          focus:border-transparent text-sm
                          transition-colors"
              />
            </div>
          </form>
        </motion.div>
      )}
    </header>
  )
}