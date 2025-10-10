/**
 * Dashboard principal com métricas profissionais e dados reais
 * Substitui o dashboard básico com informações relevantes do negócio
 */

'use client'

import { useEffect, useState } from 'react'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser-simple'
import { UserStatsDisplay, PerformanceMetrics, useUserStats } from './components/UserStatsService'
import { useRealTimeNotifications } from './components/RealTimeNotifications'
import { 
  Calendar,
  Users,
  Home,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  Activity,
  Bell,
  Target,
  Award,
  Briefcase,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'
import { format, isToday, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { motion } from 'framer-motion'

interface QuickAction {
  title: string
  description: string
  icon: any
  href: string
  color: string
  urgent?: boolean
}

interface UpcomingTask {
  id: string
  title: string
  description: string
  dueDate: Date
  priority: 'high' | 'medium' | 'low'
  type: 'meeting' | 'followup' | 'task'
}

export default function DashboardPage() {
  const { user } = useCurrentUser()
  const { stats, loading } = useUserStats()
  const { unreadCount } = useRealTimeNotifications()
  
  const [currentTime, setCurrentTime] = useState(new Date())
  const [upcomingTasks, setUpcomingTasks] = useState<UpcomingTask[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  // Atualizar hora
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Carregar tarefas e atividades
  useEffect(() => {
    loadUpcomingTasks()
    loadRecentActivity()
  }, [])

  const loadUpcomingTasks = () => {
    // TODO: Conectar com Supabase
    const mockTasks: UpcomingTask[] = []
    setUpcomingTasks(mockTasks)
  }

  const loadRecentActivity = () => {
    // TODO: Conectar com Supabase user_activities
    const mockActivity: any[] = []
    setRecentActivity(mockActivity)
  }

  const quickActions: QuickAction[] = [
    {
      title: 'Nova Reunião',
      description: 'Agendar compromisso',
      icon: Calendar,
      href: '/dashboard/agenda?action=new',
      color: 'blue',
    },
    {
      title: 'Adicionar Cliente',
      description: 'Cadastrar novo cliente',
      icon: Users,
      href: '/dashboard/clientes?action=new',
      color: 'green',
    },
    {
      title: 'Cadastrar Imóvel',
      description: 'Novo imóvel no portfólio',
      icon: Home,
      href: '/dashboard/imoveis?action=new',
      color: 'purple',
    },
    {
      title: 'Relatório de Vendas',
      description: 'Gerar relatório',
      icon: TrendingUp,
      href: '/dashboard/relatorios/vendas',
      color: 'yellow',
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getActionColors = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 hover:bg-blue-600 text-white',
      green: 'bg-green-500 hover:bg-green-600 text-white',
      purple: 'bg-purple-500 hover:bg-purple-600 text-white',
      yellow: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const firstName = user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Usuário'
  const greeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header de Boas-vindas */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-700 dark:to-purple-800 rounded-xl p-6 text-white shadow-lg"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-2xl font-bold mb-2"
            >
              {greeting()}, {firstName}! 👋
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-blue-100 dark:text-blue-200"
            >
              {format(currentTime, 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: ptBR })}
            </motion.p>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-blue-100 dark:text-blue-200 text-sm mt-1"
            >
              {format(currentTime, 'HH:mm:ss')}
            </motion.p>
          </div>
          
          <div className="text-left lg:text-right w-full lg:w-auto">
            <div className="flex flex-row lg:items-center gap-3">
              {unreadCount > 0 && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                  className="flex items-center gap-2 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2"
                >
                  <Bell className="h-4 w-4" />
                  <span className="text-sm font-medium">{unreadCount} notificações</span>
                </motion.div>
              )}
              
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2"
              >
                <div className="text-sm opacity-90">Meta do Mês</div>
                <div className="text-2xl font-bold">
                  {stats?.targetAchievement.toFixed(1)}%
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Estatísticas Principais */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <UserStatsDisplay stats={stats} />
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ações Rápidas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Ações Rápidas
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <motion.a
                  key={action.title}
                  href={action.href}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group block"
                >
                  <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:shadow-md dark:hover:shadow-gray-900/50 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-700 bg-gradient-to-br from-gray-50 to-transparent dark:from-gray-800/50 dark:to-transparent">
                    <div className="flex items-center gap-3">
                      <motion.div 
                        whileHover={{ rotate: 5 }}
                        className={`p-3 rounded-lg ${getActionColors(action.color)} shadow-sm`}
                      >
                        <action.icon className="h-5 w-5" />
                      </motion.div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Performance e Métricas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            {stats && <PerformanceMetrics stats={stats} />}
          </div>
        </motion.div>
      </div>

      {/* Próximas Tarefas e Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas Tarefas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Próximas Tarefas
          </h2>
          
          {upcomingTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-700" />
              <p className="font-medium">Tudo em dia!</p>
              <p className="text-sm">Nenhuma tarefa pendente</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`p-4 rounded-xl border ${getPriorityColor(task.priority)} dark:border-opacity-30 dark:bg-opacity-10 hover:shadow-sm transition-all duration-200`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{task.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{task.description}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-500">
                        <Clock className="h-4 w-4" />
                        {format(task.dueDate, 'dd/MM HH:mm', { locale: ptBR })}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)} font-medium shadow-sm`}>
                      {task.priority === 'high' ? 'Alta' : 
                       task.priority === 'medium' ? 'Média' : 'Baixa'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <motion.a
              href="/dashboard/agenda"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="block text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
            >
              Ver todas as tarefas
            </motion.a>
          </div>
        </motion.div>

        {/* Atividade Recente */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Atividade Recente
          </h2>
          
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-700" />
              <p className="font-medium">Nenhuma atividade</p>
              <p className="text-sm">Suas atividades aparecerão aqui</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 cursor-pointer"
                >
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{activity.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {format(new Date(activity.timestamp), 'dd/MM HH:mm', { locale: ptBR })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <motion.a
              href="/dashboard/activity"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="block text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
            >
              Ver toda atividade
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Lembretes do Sistema */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-800/50 rounded-xl p-6 shadow-sm"
      >
        <div className="flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-2">Lembrete Importante</h3>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm leading-relaxed">
              Execute a migração do banco de dados para ativar o sistema completo de notificações. 
              Acesse o painel do Supabase e execute o arquivo migration disponível na documentação.
            </p>
            <motion.a 
              href="/dashboard/documentation" 
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center gap-2 mt-4 text-sm text-yellow-700 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 font-medium transition-colors duration-200"
            >
              Ver documentação
              <Activity className="h-4 w-4" />
            </motion.a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
