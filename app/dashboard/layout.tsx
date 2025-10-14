
'use client'

import { useState, useEffect } from 'react'
import { useCurrentUser } from '@/lib/hooks/useSession' // ✅ Usando novo hook com SSR fix
import { redirect } from 'next/navigation'
import DashboardSidebar from '@/components/layout/DashboardSidebar'
import ProfessionalDashboardHeader from './components/ProfessionalDashboardHeader'
import QuickActions from './components/QuickActions'
import { SessionDebugPanel } from '@/components/SessionDebugPanel'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useCurrentUser()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true) // Iniciar colapsado por padrão
  const [redirecting, setRedirecting] = useState(false)
  const [mounted, setMounted] = useState(false)

  // ✅ Garantir hydration antes de renderizar conteúdo dinâmico
  useEffect(() => {
    setMounted(true)
  }, [])

  // Controlar sidebar baseado no tamanho da tela
  useEffect(() => {
    if (!mounted) return

    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setSidebarCollapsed(false)
      } else {
        setSidebarCollapsed(true)
      }
    }

    // Executar na montagem
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mounted])

  // ✅ CORREÇÃO: Apenas redirecionar após loading terminar E se não houver user
  // Não usar redirect() do Next.js - causa problemas em Client Components
  useEffect(() => {
    if (!mounted || loading || redirecting) return

    if (!user) {
      console.log('🔴 [Dashboard Layout] Sem usuário autenticado - redirecionando para /login')
      setRedirecting(true)
      
      // Usar window.location para redirect mais confiável em Client Component
      const currentPath = window.location.pathname
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`
    }
  }, [mounted, loading, user, redirecting])

  // ✅ Aguardar hydration completa antes de renderizar
  if (!mounted || loading || redirecting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {redirecting ? 'Redirecionando...' : 'Carregando dashboard...'}
          </p>
        </div>
      </div>
    )
  }

  // ✅ Apenas renderizar se temos user confirmado
  if (!user) {
    return null // Não renderizar nada, redirect já foi acionado no useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex relative transition-colors duration-300">
      {/* Padrão de fundo sutil */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(0 0 0 / 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(0 0 0 / 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Mobile Overlay para sidebar */}
      {!sidebarCollapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative z-10 min-w-0">
        <ProfessionalDashboardHeader
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto p-3 md:p-5 lg:p-6 xl:p-8 bg-transparent">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
        <QuickActions />
      </div>

      {/* Session Debug Panel (dev only) */}
      <SessionDebugPanel />
    </div>
  )
}