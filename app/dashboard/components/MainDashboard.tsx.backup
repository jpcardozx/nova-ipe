'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Users,
  Building2,
  Calendar,
  Phone,
  MessageSquare,
  Plus,
  ArrowUpRight,
  Clock,
  Target,
  MapPin,
  Star,
  Activity,
  Eye,
  Rocket,
  Zap,
  Globe,
  Briefcase,
  PieChart,
  Settings
} from 'lucide-react'

// Importar design system
import {
  Card,
  MetricCard,
  Button,
  PageHeader,
  EmptyState,
  MetricsGrid,
  Badge
} from '@/lib/design-system/components'
import {
  MetricsLoading,
  useLoadingState
} from '@/lib/design-system/loading'
import { useToastHelpers, ToastProvider } from '@/lib/design-system/toast'

// Hooks do Supabase e Services
import { useCurrentUser } from '@/lib/hooks/useCurrentUser-simple'
import { dashboardService, type DashboardMetrics as ServiceMetrics } from '@/lib/services/dashboard-service'


function MainDashboardContent() {
  const { user, loading: userLoading } = useCurrentUser()
  const { loading, startLoading, stopLoading } = useLoadingState()
  const toast = useToastHelpers()

  // Estados para dados do Supabase
  const [metrics, setMetrics] = useState<ServiceMetrics | null>(null)
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [properties, setProperties] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Carregar dados reais do Supabase
  useEffect(() => {
    if (!user) return

    loadDashboardData()
  }, [user])

  const loadDashboardData = async () => {
    if (!user) return;
    
    startLoading()

    try {
      const dashboardData = await dashboardService.getDashboardData(user.id)

      // Definir dados do dashboard
      setMetrics(dashboardData.metrics)
      setRecentActivities(dashboardData.activities)
      setLeads(dashboardData.leads)
      setProperties(dashboardData.properties)
      setTasks(dashboardData.tasks)
      setAppointments(dashboardData.appointments)
      setLastUpdated(new Date(dashboardData.lastUpdated))

      toast.success('Dashboard atualizado')
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar dados do dashboard')
    } finally {
      stopLoading()
    }
  }

  // Ações estratégicas para crescimento do negócio
  const strategicActions = [
    {
      id: 'mail-service',
      label: 'Email Marketing',
      subtitle: 'Comunicação',
      icon: MessageSquare,
      color: 'from-indigo-500 to-indigo-600',
      action: () => {
        window.location.href = '/dashboard/mail'
        toast.info('Acessando sistema de email profissional...')
      }
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp Business',
      subtitle: 'Atendimento',
      icon: Phone,
      color: 'from-green-500 to-green-600',
      action: () => {
        window.location.href = '/dashboard/whatsapp'
        toast.info('Gerenciando conversas no WhatsApp...')
      }
    },
    {
      id: 'jetimob',
      label: 'Integrar Portais',
      subtitle: 'Jetimob',
      icon: Globe,
      color: 'from-blue-500 to-blue-600',
      action: () => {
        window.location.href = '/dashboard/jetimob'
        toast.info('Conectando com principais portais imobiliários...')
      }
    },
    {
      id: 'first-lead',
      label: 'Primeiro Lead',
      subtitle: 'Comece aqui',
      icon: Users,
      color: 'from-cyan-500 to-cyan-600',
      action: () => {
        window.location.href = '/dashboard/leads?action=create'
        toast.info('Criando seu primeiro lead...')
      }
    }
  ]

  // Oportunidades de crescimento (em vez de métricas zeradas)
  const growthOpportunities = [
    {
      title: 'Email Marketing Profissional',
      description: 'Envie campanhas personalizadas e newsletters para clientes',
      action: 'Configurar Email',
      href: '/dashboard/mail',
      icon: MessageSquare,
      progress: 0,
      benefit: 'Até 40% mais conversões'
    },
    {
      title: 'WhatsApp Business',
      description: 'Automatize atendimento e campanhas via WhatsApp',
      action: 'Conectar WhatsApp',
      href: '/dashboard/whatsapp',
      icon: Phone,
      progress: 0,
      benefit: 'Resposta 24/7 automatizada'
    },
    {
      title: 'Conecte-se aos Portais',
      description: 'Publique em Viva Real, ZAP e OLX automaticamente',
      action: 'Configurar Jetimob',
      href: '/dashboard/jetimob',
      icon: Globe,
      progress: 0,
      benefit: 'Até 80% mais visualizações'
    },
    {
      title: 'Organize seu CRM',
      description: 'Tenha controle total sobre leads e follow-ups',
      action: 'Cadastrar Leads',
      href: '/dashboard/leads',
      icon: Users,
      progress: 0,
      benefit: 'Conversão 5x maior'
    }
  ]

  // Função para cumprimentar baseada no horário
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  const getUserName = () => {
    return user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Corretor'
  }

  if (userLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <PageHeader
          title="Dashboard"
          subtitle="Carregando..."
        />
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          <MetricsLoading count={4} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 rounded-lg shadow-xl">
      {/* Header com Design System */}
      <PageHeader
        title={`${getGreeting()}, ${getUserName()}!`}
        subtitle="Sua central de crescimento imobiliário"
        breadcrumbs={[
          { label: 'IPÊ Imóveis' },
          { label: 'Dashboard' }
        ]}
      >
        <div className="flex items-center gap-3">
          <Badge variant="success">
            <Rocket className="h-3 w-3 mr-1" />
            Pronto para crescer
          </Badge>
          <Button variant="outline" size="sm" onClick={loadDashboardData}>
            <Activity className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Ações Estratégicas Principais */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Acelere seu Crescimento
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Configure as ferramentas essenciais para multiplicar seus resultados no mercado imobiliário
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {strategicActions.map((action) => {
              const Icon = action.icon
              return (
                <motion.div
                  key={action.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card padding="lg" className="cursor-pointer group h-full" onClick={action.action}>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                      {action.label}
                    </h3>
                    <p className="text-sm text-neutral-600 mb-4">
                      {action.subtitle}
                    </p>
                    <Button variant="ghost" size="sm" className="p-0 h-auto font-medium text-primary-600 group-hover:text-primary-700">
                      Começar agora
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Central de Comunicação */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Central de Comunicação
              </h2>
              <p className="text-neutral-600 text-sm mt-1">
                Gerencie toda comunicação com clientes em um só lugar
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Email Marketing */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card padding="lg" className="cursor-pointer group h-full bg-white hover:shadow-lg transition-all" 
                    onClick={() => window.location.href = '/dashboard/mail'}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                  Email Marketing
                </h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Templates profissionais, campanhas automáticas e relatórios detalhados
                </p>
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" className="p-0 h-auto font-medium text-primary-600 group-hover:text-primary-700">
                    Compor Email
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                  <Badge variant="success">Ativo</Badge>
                </div>
              </Card>
            </motion.div>

            {/* WhatsApp Business */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card padding="lg" className="cursor-pointer group h-full bg-white hover:shadow-lg transition-all" 
                    onClick={() => window.location.href = '/dashboard/whatsapp'}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                  WhatsApp Business
                </h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Atendimento automatizado, campanhas e gestão de contatos
                </p>
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" className="p-0 h-auto font-medium text-primary-600 group-hover:text-primary-700">
                    Abrir Conversas
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                  <Badge variant="success">Conectado</Badge>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Oportunidades de Crescimento */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">
                Próximos Passos Estratégicos
              </h2>
              <p className="text-neutral-600 text-sm mt-1">
                Implemente essas funcionalidades para maximizar seus resultados
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {growthOpportunities.map((opportunity, index) => {
              const Icon = opportunity.icon
              return (
                <Card key={index} padding="md" className="group hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-neutral-900">
                          {opportunity.title}
                        </h3>
                        <Badge variant="success">
                          {opportunity.benefit}
                        </Badge>
                      </div>
                      <p className="text-neutral-600 text-sm mb-4">
                        {opportunity.description}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = opportunity.href}
                        className="group-hover:bg-primary-50 group-hover:border-primary-200"
                      >
                        {opportunity.action}
                        <ArrowUpRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Status Atual e Progresso */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Coluna Principal - Progresso */}
          <div className="lg:col-span-2">
            <Card padding="md">
              <div className="flex items-center gap-2 mb-6">
                <PieChart className="h-5 w-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-neutral-900">Configuração do Sistema</h3>
                <Badge variant="info">0% completo</Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Globe className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">Integração com Portais</p>
                      <p className="text-sm text-neutral-600">Conecte-se ao Viva Real, ZAP e OLX</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => window.location.href = '/dashboard/jetimob'}
                  >
                    Configurar
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">Base de Leads</p>
                      <p className="text-sm text-neutral-600">Organize seus contatos e prospects</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.location.href = '/dashboard/leads'}
                  >
                    Começar
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">Portfólio de Imóveis</p>
                      <p className="text-sm text-neutral-600">Cadastre e gerencie propriedades</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.location.href = '/dashboard/jetimob'}
                  >
                    Adicionar
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar - Recursos e Dicas */}
          <div className="space-y-6">
            {/* Dica do Dia */}
            <Card padding="md">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-warning-600" />
                <h3 className="text-lg font-semibold text-neutral-900">Dica Estratégica</h3>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-neutral-700">
                  <strong>Publique em múltiplos portais:</strong> Imóveis com presença em 3+ portais recebem
                  até 80% mais visualizações.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => window.location.href = '/dashboard/jetimob'}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar Portais
                </Button>
              </div>
            </Card>

            {/* Suporte Rápido */}
            <Card padding="md">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="h-5 w-5 text-info-600" />
                <h3 className="text-lg font-semibold text-neutral-900">Suporte</h3>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-neutral-700">
                  Precisa de ajuda? Nossa equipe está pronta para acelerar sua implementação.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Ligar
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Acesso Rápido - Reformulado */}
        <Card padding="md">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Ferramentas Disponíveis</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Jetimob', description: 'Portais', href: '/dashboard/jetimob', icon: Globe },
              { label: 'CRM', description: 'Leads', href: '/dashboard/leads', icon: Users },
              { label: 'Agenda', description: 'Visitas', href: '/dashboard/appointments', icon: Calendar },
              { label: 'Arquivos', description: 'Cloud', href: '/dashboard/cloud', icon: Building2 }
            ].map((link) => {
              const Icon = link.icon
              return (
                <Button
                  key={link.href}
                  variant="ghost"
                  className="h-20 flex-col gap-2 text-center"
                  onClick={() => window.location.href = link.href}
                >
                  <Icon className="h-5 w-5" />
                  <div>
                    <div className="text-sm font-medium">{link.label}</div>
                    <div className="text-xs text-neutral-500">{link.description}</div>
                  </div>
                </Button>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

// Componente principal com Provider
export default function MainDashboard() {
  return (
    <ToastProvider>
      <MainDashboardContent />
    </ToastProvider>
  )
}