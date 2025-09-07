'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, LogOut, Building2, Home, BarChart3, Settings, User } from 'lucide-react'

interface UserProfile {
    email: string
    full_name?: string
    department?: string
    role?: string
    created_at?: string
}

interface DashboardStats {
    totalProperties: number
    activeListings: number
    pendingRequests: number
    recentActivity: number
    monthlyViews: number
    conversionRate: number
    avgResponseTime: string
    customerSatisfaction: number
}

interface DashboardHeaderProps {
    user: UserProfile | null
    stats: DashboardStats | null
    onSignOut: () => void
}

export function DashboardHeader({ user, stats, onSignOut }: DashboardHeaderProps) {
    const getDepartmentBadgeColor = (department?: string) => {
        switch (department?.toLowerCase()) {
            case 'vendas': return 'bg-blue-500'
            case 'locacao': return 'bg-green-500'
            case 'marketing': return 'bg-purple-500'
            case 'admin': return 'bg-orange-500'
            default: return 'bg-gray-500'
        }
    }

    const getDepartmentIcon = (department?: string) => {
        switch (department?.toLowerCase()) {
            case 'vendas': return <Building2 className="h-4 w-4" />
            case 'locacao': return <Home className="h-4 w-4" />
            case 'marketing': return <BarChart3 className="h-4 w-4" />
            case 'admin': return <Settings className="h-4 w-4" />
            default: return <User className="h-4 w-4" />
        }
    }

    return (
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-amber-200/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center space-x-4"
                    >
                        <div className="relative">
                            <Image
                                src="/logo-nova-ipe.png"
                                alt="Ipê Imóveis"
                                width={44}
                                height={44}
                                className="rounded-xl shadow-md"
                            />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-amber-800 bg-clip-text text-transparent">
                                Dashboard
                            </h1>
                            <p className="text-sm text-gray-600">Ipê Imóveis • Sistema Integrado</p>
                        </div>
                    </motion.div>

                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <Button variant="ghost" size="sm" className="relative">
                            <Bell className="h-5 w-5" />
                            {stats && stats.pendingRequests > 0 && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {stats.pendingRequests}
                                </span>
                            )}
                        </Button>

                        {/* User Profile */}
                        {user && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center space-x-3"
                            >
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900">
                                        {user.full_name?.split(' ')[0] || user.email.split('@')[0]}
                                    </p>
                                    <div className="flex items-center justify-end space-x-2">
                                        {user.department && (
                                            <Badge className={`${getDepartmentBadgeColor(user.department)} text-white text-xs`}>
                                                <span className="flex items-center space-x-1">
                                                    {getDepartmentIcon(user.department)}
                                                    <span>{user.department}</span>
                                                </span>
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                                        {(user.full_name?.charAt(0) || user.email.charAt(0)).toUpperCase()}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onSignOut}
                                    className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Sair</span>
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}