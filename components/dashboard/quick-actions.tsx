'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Plus,
    Building2,
    Users,
    BarChart3,
    Settings,
    Headphones,
    ArrowRight,
    Zap
} from 'lucide-react'

interface QuickAction {
    id: string
    title: string
    description: string
    icon: React.ReactNode
    href: string
    color: string
    badge?: string
}

interface QuickActionsProps {
    pendingRequests?: number
}

export function QuickActions({ pendingRequests }: QuickActionsProps) {
    const router = useRouter()

    const quickActions: QuickAction[] = [
        {
            id: 'add-property',
            title: 'Adicionar Imóvel',
            description: 'Cadastre um novo imóvel no sistema',
            icon: <Plus className="h-5 w-5" />,
            href: '/admin/properties/new',
            color: 'from-blue-500 to-blue-600',
            badge: 'Novo'
        },
        {
            id: 'view-catalog',
            title: 'Ver Catálogo',
            description: 'Explore todos os imóveis disponíveis',
            icon: <Building2 className="h-5 w-5" />,
            href: '/catalogo',
            color: 'from-green-500 to-green-600'
        },
        {
            id: 'manage-requests',
            title: 'Solicitações',
            description: 'Gerencie solicitações de acesso',
            icon: <Users className="h-5 w-5" />,
            href: '/admin/access-requests',
            color: 'from-purple-500 to-purple-600',
            badge: pendingRequests?.toString()
        },
        {
            id: 'analytics',
            title: 'Relatórios',
            description: 'Visualize métricas e relatórios',
            icon: <BarChart3 className="h-5 w-5" />,
            href: '/admin/analytics',
            color: 'from-orange-500 to-orange-600'
        },
        {
            id: 'studio',
            title: 'Sanity Studio',
            description: 'Gerencie conteúdo do site',
            icon: <Settings className="h-5 w-5" />,
            href: '/studio',
            color: 'from-gray-500 to-gray-600'
        },
        {
            id: 'support',
            title: 'Suporte',
            description: 'Central de ajuda e suporte',
            icon: <Headphones className="h-5 w-5" />,
            href: '/support',
            color: 'from-red-500 to-red-600'
        }
    ]

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
        >
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Zap className="h-5 w-5 text-amber-600" />
                        <span>Ações Rápidas</span>
                    </CardTitle>
                    <CardDescription>
                        Acesse rapidamente as funcionalidades mais utilizadas
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {quickActions.map((action, index) => (
                            <motion.div
                                key={action.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                onClick={() => router.push(action.href)}
                                className={`relative p-4 rounded-xl bg-gradient-to-r ${action.color} text-white cursor-pointer hover:shadow-lg transform hover:scale-105 transition-all duration-300 group`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                                        {action.icon}
                                    </div>
                                    {action.badge && (
                                        <Badge className="bg-white/20 text-white border-white/30 group-hover:bg-white/30 transition-colors">
                                            {action.badge}
                                        </Badge>
                                    )}
                                </div>
                                <h3 className="font-semibold mb-1">{action.title}</h3>
                                <p className="text-sm text-white/80 group-hover:text-white/90 transition-colors">
                                    {action.description}
                                </p>
                                <ArrowRight className="h-4 w-4 absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}