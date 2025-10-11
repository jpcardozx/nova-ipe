'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
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
    Plus,
    Bell,
    UserCircle,
    MapPin,
    DollarSign,
    TrendingUp,
    Phone,
    Mail,
    Filter,
    Target,
    Briefcase,
    Clock,
    Star,
    Activity,
    CheckSquare,
    Calculator,
    Folder,
    Percent,
    BookOpen,
    Cloud,
    StarOff,
    BarChart2,
    Network,
    MessageCircle
} from 'lucide-react'

interface MenuItem {
    icon: any;
    label: string;
    href: string;
    color: string;
    badge?: string;
    adminOnly?: boolean;
}

interface MenuCategory {
    category: string;
    items: MenuItem[];
}

const menuItems: MenuCategory[] = [
    {
        category: 'Início',
        items: [
            { icon: Home, label: 'Início', href: '/dashboard', color: 'text-blue-600' }
        ]
    },
    {
        category: 'Integração Jetimob',
        items: [
            { icon: Network, label: 'Jetimob API', href: '/dashboard/jetimob', color: 'text-emerald-600' }
        ]
    },
    {
        category: 'Documentos & Armazenamento',
        items: [
            { icon: Cloud, label: 'Nuvem Ipé', href: '/dashboard/cloud', color: 'text-blue-600' },
        ]
    },
    {
        category: 'Principal',
        items: [
            { icon: Calendar, label: 'Agenda', href: '/dashboard/agenda', color: 'text-indigo-600' },
            { icon: CheckSquare, label: 'Tarefas', href: '/dashboard/tasks', color: 'text-red-600' },
            { icon: Building2, label: 'Estúdio', href: '/studio', color: 'text-green-600' },
            { icon: Users, label: 'Clientes (CRM)', href: '/dashboard/clients', color: 'text-purple-600' }
        ]
    },
    {
        category: 'Comunicação',
        items: [
            { icon: Mail, label: 'E-mail', href: '/dashboard/mail', color: 'text-blue-600' },
            { icon: MessageCircle, label: 'WhatsApp', href: '/dashboard/whatsapp', color: 'text-green-600' }
        ]
    },
    {
        category: 'Vendas',
        items: [
            { icon: TrendingUp, label: 'Funil de Vendas', href: '/dashboard/funil', color: 'text-emerald-600' },
            { icon: BarChart2, label: 'Leads', href: '/dashboard/leads', color: 'text-blue-600' },
            { icon: Target, label: 'Campanhas', href: '/dashboard/campaigns', color: 'text-pink-600' },
            { icon: Calculator, label: 'Calculadora', href: '/dashboard/calculator', color: 'text-blue-600' }
        ]
    },
    {
        category: 'Administração',
        items: [
            { icon: Percent, label: 'Alíquotas', href: '/dashboard/aliquotas', color: 'text-orange-600' },
            { icon: UserCircle, label: 'Meu Perfil', href: '/dashboard/profile', color: 'text-blue-600' },
            { icon: Settings, label: 'Configurações', href: '/dashboard/settings', color: 'text-gray-500' }
        ]
    }
]

interface DashboardSidebarProps {
    collapsed?: boolean
    onToggle?: () => void
}

export default function DashboardSidebar({ collapsed = false, onToggle }: DashboardSidebarProps) {
    const pathname = usePathname()
    const { user, signOut } = useCurrentUser()
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)

    const handleSignOut = async () => {
        try {
            await signOut()
            window.location.href = '/login'
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    const isAdminUser = isAdmin(user) || user?.email === 'admin@ipeimoveis.com.br' // Verificação melhorada de admin

    return (
        <motion.div
            initial={false}
            animate={{
                width: collapsed ? '80px' : '280px',
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-white border-r border-grey-300 shadow-lg flex flex-col relative z-10 rounded-md"
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-3"
                    >
                        <Link href="/" className="flex flex-1 items-center justify-center group">
                            <Image
                                src="/images/ipeLogoWritten.png"
                                alt="Ipê Imóveis"
                                width={140}
                                height={42}
                                className="object-contain transition-all duration-300 group-hover:scale-105"
                                priority
                            />
                        </Link>
                    </motion.div>
                )}

                {collapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center justify-center w-full"
                    >
                        <Link href="/" className="group">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105">
                                <Building2 className="h-6 w-6 text-white" />
                            </div>
                        </Link>
                    </motion.div>
                )}

                <button
                    onClick={onToggle}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    {collapsed ? (
                        <ChevronRight className="h-5 w-5 text-gray-600" />
                    ) : (
                        <ChevronLeft className="h-5 w-5 text-gray-600" />
                    )}
                </button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                {menuItems.map((category) => (
                    <div key={category.category}>
                        {!collapsed && (
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                {category.category}
                            </h3>
                        )}

                        <div className="space-y-1">
                            {category.items
                                .filter(item => !item.adminOnly || isAdminUser)
                                .map((item) => {
                                    const IconComponent = item.icon
                                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative ${isActive
                                                ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                            onMouseEnter={() => setHoveredItem(item.href)}
                                            onMouseLeave={() => setHoveredItem(null)}
                                        >
                                            <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-white shadow-sm' : 'group-hover:bg-white'
                                                }`}>
                                                <IconComponent className={`h-4 w-4 ${isActive ? item.color : ''}`} />
                                            </div>

                                            {!collapsed && (
                                                <>
                                                    <span className="font-medium text-sm flex-1">
                                                        {item.label}
                                                    </span>

                                                    {item.badge && (
                                                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${isActive
                                                            ? 'bg-amber-200 text-amber-800'
                                                            : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                                                            }`}>
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </>
                                            )}

                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeIndicator"
                                                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 to-orange-500 rounded-r-full"
                                                />
                                            )}
                                        </Link>
                                    )
                                })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-100 space-y-2">
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
                >
                    <div className="p-1.5 rounded-lg group-hover:bg-red-100 transition-colors">
                        <LogOut className="h-4 w-4" />
                    </div>
                    {!collapsed && <span className="font-medium text-sm">Sair</span>}
                </button>
            </div>

            {/* Tooltip for collapsed state */}
            {collapsed && hoveredItem && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap"
                >
                    {menuItems.flatMap(cat => cat.items).find(item => item.href === hoveredItem)?.label}
                </motion.div>
            )}
        </motion.div>
    )
}