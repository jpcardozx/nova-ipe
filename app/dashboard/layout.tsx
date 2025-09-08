'use client'

import { useState } from 'react'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import { redirect } from 'next/navigation'
import DashboardSidebar from './components/DashboardSidebar'
import DashboardHeader from './components/DashboardHeader'
import QuickActions from './components/QuickActions'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useCurrentUser()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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
    <div className="min-h-screen bg-gray-100 flex relative">
      <div
        className="absolute inset-0 bg-repeat opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'url(/images/dashboard/texture.png)',
          backgroundSize: '400px 400px'
        }}
      />

      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-2 md:p-6 lg:p-8 rounded-lg">
          {children}
        </main>
        <QuickActions />
      </div>
    </div>
  )
}