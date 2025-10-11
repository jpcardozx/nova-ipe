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
      {/* Header de Boas-vindas - Melhorado com melhor legibilidade */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 dark:from-blue-900/90 dark:via-blue-800/90 dark:to-purple-900/90 rounded-2xl p-8 text-white shadow-2xl border border-blue-400/20 dark:border-blue-700/30"
      >
        {/* Padrão de fundo decorativo */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 dark:via-white/3 dark:to-white/5" />
        <div 
          className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 dark:bg-white/5 rounded-full blur-3xl"
        />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-3xl lg:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 dark:from-white dark:to-blue-200"
            >
              {greeting()}, {firstName}! 👋
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-blue-50 dark:text-blue-100 font-medium text-lg"
            >
              {format(currentTime, 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: ptBR })}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex items-center gap-2 mt-2"
            >
              <Clock className="h-4 w-4 text-blue-200 dark:text-blue-300" />
              <span className="text-blue-100 dark:text-blue-200 text-sm font-mono">
                {format(currentTime, 'HH:mm:ss')}
              </span>
            </motion.div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {unreadCount > 0 && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
                className="relative flex items-center gap-3 bg-white/15 dark:bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20 dark:border-white/10 shadow-lg"
              >
                <div className="relative">
                  <Bell className="h-5 w-5 text-blue-100" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-400 rounded-full animate-pulse" />
                </div>
                <div>
                  <div className="text-xs text-blue-100 opacity-80">Notificações</div>
                  <div className="text-lg font-bold">{unreadCount}</div>
                </div>
              </motion.div>
            )}
            
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="flex items-center gap-3 bg-white/15 dark:bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20 dark:border-white/10 shadow-lg"
            >
              <Target className="h-5 w-5 text-blue-100" />
              <div>
                <div className="text-xs text-blue-100 opacity-80">Meta do Mês</div>
                <div className="text-2xl font-bold">
                  {stats?.targetAchievement.toFixed(1)}%
                </div>
              </div>
            </motion.div>
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
        {/* Ações Rápidas - Design Melhorado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
                Ações Rápidas
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <motion.a
                  key={action.title}
                  href={action.href}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="group block"
                >
                  <div className="relative overflow-hidden border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-xl dark:hover:shadow-black/30 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600 bg-gradient-to-br from-white via-gray-50 to-gray-100/50 dark:from-gray-800 dark:via-gray-800/80 dark:to-gray-900">
                    {/* Efeito hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 dark:group-hover:from-blue-500/10 dark:group-hover:to-purple-500/10 transition-all duration-300" />
                    
                    <div className="relative flex items-center gap-4">
                      <motion.div 
                        whileHover={{ rotate: 8, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className={`p-3.5 rounded-xl ${getActionColors(action.color)} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                      >
                        <action.icon className="h-5 w-5" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base text-gray-900 dark:text-gray-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
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

        {/* Performance e Métricas - Design Melhorado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-900/30 dark:to-purple-900/30 p-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-gray-900 dark:text-gray-50">Performance</h3>
              </div>
            </div>
            {stats && <PerformanceMetrics stats={stats} />}
          </div>
        </motion.div>
      </div>

      {/* Próximas Tarefas e Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas Tarefas - Design Melhorado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-6 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
              Próximas Tarefas
            </h2>
          </div>
          
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

        {/* Atividade Recente - Design Melhorado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
              Atividade Recente
            </h2>
          </div>
          
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

      {/* Lembretes do Sistema - Design Melhorado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-900/30 dark:via-yellow-900/20 dark:to-orange-900/30 border-2 border-amber-200 dark:border-amber-800/50 rounded-2xl p-6 shadow-xl"
      >
        {/* Padrão de fundo */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(251,191,36,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_50%,rgba(251,191,36,0.05),transparent_50%)]" />
        
        <div className="relative flex items-start gap-5">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-600 dark:to-orange-700 rounded-xl flex items-center justify-center shadow-lg">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-amber-900 dark:text-amber-300 mb-2">
              💡 Lembrete Importante
            </h3>
            <p className="text-amber-800 dark:text-amber-200 text-sm leading-relaxed">
              Execute a migração do banco de dados para ativar o sistema completo de notificações. 
              Acesse o painel do Supabase e execute o arquivo migration disponível na documentação.
            </p>
            <motion.a 
              href="/dashboard/documentation" 
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-amber-600 dark:bg-amber-700 text-white rounded-lg hover:bg-amber-700 dark:hover:bg-amber-600 font-medium transition-all duration-200 shadow-md hover:shadow-lg"
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
