'use client'

import { usePathname } from 'next/navigation'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import NotificationBell from './NotificationBell'
import {
    Search,
    Settings,
    User,
    LogOut,
    ChevronDown
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

interface DashboardHeaderProps {
    title?: string
    subtitle?: string
}

export default function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
    const pathname = usePathname()
    const { user, signOut } = useCurrentUser()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const userMenuRef = useRef<HTMLDivElement>(null)

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false)
            }
        }

        if (showUserMenu) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showUserMenu])

    const getPageTitle = () => {
        if (title) return title

        const pathSegments = pathname.split('/').filter(Boolean)
        const lastSegment = pathSegments[pathSegments.length - 1]

        const pageTitles: { [key: string]: string } = {
            'dashboard': 'Dashboard',
            'properties': 'Imóveis',
            'clients': 'Clientes (CRM)',
            'appointments': 'Agendamentos',
            'leads': 'Oportunidades',
            'campaigns': 'Campanhas',
            'reviews': 'Avaliações',
            'reports': 'Relatórios',
            'finance': 'Financeiro',
            'analytics': 'Performance',
            'documents': 'Documentos',
            'settings': 'Configurações'
        }

        return pageTitles[lastSegment] || 'Dashboard'
    }

    const getPageSubtitle = () => {
        if (subtitle) return subtitle

        const pathSegments = pathname.split('/').filter(Boolean)
        const lastSegment = pathSegments[pathSegments.length - 1]

        const pageSubtitles: { [key: string]: string } = {
            'dashboard': 'Visão geral do seu negócio imobiliário',
            'properties': 'Gerencie seu portfólio de imóveis',
            'clients': 'Gerencie relacionamentos com clientes',
            'appointments': 'Agende e acompanhe visitas',
            'leads': 'Converta oportunidades em vendas',
            'campaigns': 'Gerencie suas campanhas de marketing',
            'reviews': 'Acompanhe avaliações e feedback',
            'reports': 'Análises e relatórios detalhados',
            'finance': 'Controle financeiro e comissões',
            'analytics': 'Métricas e indicadores de performance',
            'documents': 'Organize e gerencie documentos',
            'settings': 'Configurações da conta e sistema'
        }

        return pageSubtitles[lastSegment] || ''
    }

    const handleSignOut = async () => {
        try {
            await signOut()
            window.location.href = '/login'
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm p-1">
            <div className="flex items-center justify-between h-16 px-6">
                {/* Page Title */}
                <div className="flex-1">
                    <h1 className="text-xl font-semibold text-gray-900">
                        {getPageTitle()}
                    </h1>
                    {getPageSubtitle() && (
                        <p className="text-sm text-gray-600 mt-0.5">
                            {getPageSubtitle()}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="hidden md:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-50"
                            />
                        </div>
                    </div>

                    {/* Notifications */}
                    <NotificationBell />

                    {/* Settings */}
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Settings className="h-5 w-5 text-gray-600" />
                    </button>

                    {/* User Menu */}
                    <div className="relative" ref={userMenuRef}>
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                                {user?.email?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-gray-900">
                                    {user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Usuário'}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {user?.email}
                                </p>
                            </div>
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                        </button>

                        {/* User Dropdown */}
                        {showUserMenu && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            window.location.href = '/dashboard/settings'
                                            setShowUserMenu(false)
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <User className="h-4 w-4" />
                                        Meu Perfil
                                    </button>
                                    <button
                                        onClick={() => {
                                            window.location.href = '/dashboard/settings'
                                            setShowUserMenu(false)
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <Settings className="h-4 w-4" />
                                        Configurações
                                    </button>
                                    <hr className="my-1 border-gray-100" />
                                    <button
                                        onClick={handleSignOut}
                                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sair
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
