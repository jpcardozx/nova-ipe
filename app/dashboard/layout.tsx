
'use client'

import { useState, useEffect } from 'react'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser-simple'
import { redirect } from 'next/navigation'
import DashboardSidebar from '@/components/layout/DashboardSidebar'
import ProfessionalDashboardHeader from './components/ProfessionalDashboardHeader'
import QuickActions from './components/QuickActions'
import UserStatsService from './components/UserStatsService'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useCurrentUser()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true) // Iniciar colapsado por padrão

  // Controlar sidebar baseado no tamanho da tela
  useEffect(() => {
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
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex relative rounded-xl shadow-md transition-colors duration-200">
      <div
        className="absolute inset-0 bg-repeat opacity-30 dark:opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'url(/images/dashboard/texture.png)',
          backgroundSize: '400px 400px'
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
        <main className="flex-1 overflow-y-auto p-2 md:p-4 lg:p-6 xl:p-8 rounded-lg">
          <UserStatsService />
          {children}
        </main>
        <QuickActions />
      </div>
    </div>
  )
}