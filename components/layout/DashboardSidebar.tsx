'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import { isAdmin } from '@/lib/auth/role-utils'
import {
    Home,
    Building2,
    Users,
    Calendar,
    FileText,
    BarChart3,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Search,
    UserCircle,
    DollarSign,
    Target,
    CheckSquare,
    Calculator,
    Percent,
    Cloud,
    Network
} from 'lucide-react'

interface MenuItem {
    icon: any;
    label: string;
    href: string;
    color: string;
    badge?: string | number;
    adminOnly?: boolean;
    premium?: boolean;
    description?: string;
}

interface MenuCategory {
    category: string;
    icon: any;
    items: MenuItem[];
    expanded?: boolean;
}

const menuCategories: MenuCategory[] = [
    {
        category: 'Principal',
        icon: Home,
        items: [
            {
                icon: Home,
                label: 'Dashboard',
                href: '/dashboard',
                color: 'text-blue-600',
                description: 'Visão geral do sistema'
            },
            {
                icon: BarChart3,
                label: 'Analytics',
                href: '/dashboard/analytics',
                color: 'text-purple-600',
                description: 'Métricas e relatórios'
            }
        ]
    },
    {
        category: 'Integração Jetimob',
        icon: Network,
        items: [
            {
                icon: Network,
                label: 'Jetimob API',
                href: '/dashboard/jetimob',
                color: 'text-emerald-600',
                description: 'Sincronização com portais imobiliários'
            }
        ]
    },
    {
        category: 'CRM',
        icon: Users,
        items: [
            {
                icon: Users,
                label: 'Clientes',
                href: '/dashboard/clients',
                color: 'text-blue-600',
                description: 'Gestão de clientes'
            },
            {
                icon: Target,
                label: 'Leads',
                href: '/dashboard/leads',
                color: 'text-green-600',
                description: 'Captação de leads'
            },
            {
                icon: BarChart3,
                label: 'Funil',
                href: '/dashboard/funil',
                color: 'text-indigo-600',
                description: 'Pipeline de conversão'
            },
            {
                icon: Calendar,
                label: 'Agendamentos',
                href: '/dashboard/appointments',
                color: 'text-orange-600',
                description: 'Visitas agendadas'
            }
        ]
    },
    {
        category: 'Gestão',
        icon: CheckSquare,
        items: [
            {
                icon: CheckSquare,
                label: 'Tarefas',
                href: '/dashboard/tasks',
                color: 'text-red-600',
                badge: 5,
                description: 'Tarefas e demandas'
            },
            {
                icon: Building2,
                label: 'Imóveis',
                href: '/studio',
                color: 'text-green-600',
                description: 'Gestão de imóveis'
            },
            {
                icon: Calculator,
                label: 'Simulador',
                href: '/dashboard/calculator',
                color: 'text-purple-600',
                description: 'Calculadora financeira'
            }
        ]
    },
    {
        category: 'Financeiro',
        icon: DollarSign,
        items: [
            {
                icon: DollarSign,
                label: 'Financeiro',
                href: '/dashboard/finance',
                color: 'text-green-600',
                description: 'Controle financeiro'
            },
            {
                icon: Percent,
                label: 'Comissões',
                href: '/dashboard/commissions',
                color: 'text-emerald-600',
                description: 'Gestão de comissões'
            },
            {
                icon: BarChart3,
                label: 'Relatórios',
                href: '/dashboard/reports',
                color: 'text-blue-600',
                description: 'Relatórios detalhados'
            }
        ]
    },
    {
        category: 'Sistema',
        icon: Settings,
        items: [
            {
                icon: Cloud,
                label: 'Cloud Storage',
                href: '/dashboard/cloud',
                color: 'text-blue-600',
                description: 'Armazenamento na nuvem'
            },
            {
                icon: FileText,
                label: 'Documentos',
                href: '/dashboard/documents',
                color: 'text-gray-600',
                description: 'Gestão de documentos'
            },
            {
                icon: Settings,
                label: 'Configurações',
                href: '/dashboard/settings',
                color: 'text-gray-600',
                description: 'Configurações do sistema'
            }
        ]
    }
]

interface DashboardSidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

export default function DashboardSidebar({ collapsed, onToggle }: DashboardSidebarProps) {
    const pathname = usePathname()
    const { user } = useCurrentUser()
    const [searchQuery, setSearchQuery] = useState('')

    const allItems = menuCategories.flatMap(category => category.items)

    const filteredItems = allItems.filter(item => {
        if (item.adminOnly && !isAdmin(user)) return false
        if (searchQuery) {
            return item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchQuery.toLowerCase())
        }
        return true
    })

    return (
        <div
            className={`
                bg-white border-r border-gray-200 shadow-lg flex flex-col relative z-30 transition-all duration-300 ease-in-out
                ${collapsed ? 'w-20' : 'w-80'}
                ${collapsed && typeof window !== 'undefined' && window.innerWidth < 1024 ? 'hidden' : ''}
                lg:relative lg:translate-x-0
                ${!collapsed ? 'fixed lg:relative inset-y-0 left-0' : ''}
            `}
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    {!collapsed && (
                        <div className="flex items-center justify-center transition-opacity duration-200">
                            <Image
                                src="/images/ipeLogoWritten.png"
                                alt="Nova Ipê"
                                width={140}
                                height={35}
                                className="object-contain"
                                priority
                            />
                        </div>
                    )}
                    <button
                        onClick={onToggle}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                    >
                        {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                    </button>
                </div>

                {/* Search */}
                {!collapsed && (
                    <div className="mt-4 relative transition-opacity duration-200">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar funcionalidades..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-gray-900"
                        />
                    </div>
                )}
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <div className="space-y-1 px-2">
                    {filteredItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group relative ${isActive
                                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-l-4 border-blue-500 shadow-sm'
                                    : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                                    } ${collapsed ? 'justify-center' : ''}`}
                                title={collapsed ? `${item.label}${item.description ? ` - ${item.description}` : ''}` : undefined}
                            >
                                <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : item.color} group-hover:scale-110 transition-transform flex-shrink-0`} />

                                {!collapsed && (
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium truncate">
                                                {item.label}
                                            </span>
                                            {item.premium && (
                                                <span className="px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold rounded">
                                                    PRO
                                                </span>
                                            )}
                                            {item.badge && (
                                                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${typeof item.badge === 'number'
                                                    ? 'bg-red-500 text-white'
                                                    : 'bg-green-500 text-white'
                                                    }`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                        </div>
                                        {item.description && (
                                            <p className="text-xs text-gray-500 truncate mt-0.5">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {collapsed && item.badge && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                                )}
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
                {!collapsed && (
                    <div className="space-y-2 transition-opacity duration-200">
                        <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                            <UserCircle className="h-8 w-8 text-gray-500" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user?.full_name || 'Usuário'}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {user?.role?.name || 'Corretor'}
                                </p>
                            </div>
                        </div>
                        <button className="w-full flex items-center space-x-2 p-2 text-gray-500 hover:text-red-500 transition-colors">
                            <LogOut className="h-4 w-4" />
                            <span className="text-sm">Sair</span>
                        </button>
                    </div>
                )}
                {collapsed && (
                    <button className="w-full flex justify-center p-2 text-gray-500 hover:text-red-500 transition-colors">
                        <LogOut className="h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
    )
}
