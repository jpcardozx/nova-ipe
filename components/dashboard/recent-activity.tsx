'use client'

import { motion } from 'framer-motion'
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Activity,
    Eye,
    Mail,
    Calendar,
    DollarSign,
    Home,
    Clock,
    ArrowUpRight
} from 'lucide-react'

interface RecentActivity {
    id: string
    type: 'property_view' | 'inquiry' | 'appointment' | 'sale' | 'rental'
    title: string
    description: string
    timestamp: Date
    status: 'success' | 'pending' | 'warning'
    value?: string
}

interface RecentActivityProps {
    activities: RecentActivity[]
}

export function RecentActivityCard({ activities }: RecentActivityProps) {
    const getActivityIcon = (type: RecentActivity['type']) => {
        switch (type) {
            case 'property_view': return <Eye className="h-4 w-4" />
            case 'inquiry': return <Mail className="h-4 w-4" />
            case 'appointment': return <Calendar className="h-4 w-4" />
            case 'sale': return <DollarSign className="h-4 w-4" />
            case 'rental': return <Home className="h-4 w-4" />
            default: return <Activity className="h-4 w-4" />
        }
    }

    const getActivityColor = (status: RecentActivity['status']) => {
        switch (status) {
            case 'success': return 'text-green-600 bg-green-50 border-green-200'
            case 'pending': return 'text-orange-600 bg-orange-50 border-orange-200'
            case 'warning': return 'text-red-600 bg-red-50 border-red-200'
            default: return 'text-gray-600 bg-gray-50 border-gray-200'
        }
    }

    const getStatusBadgeColor = (status: RecentActivity['status']) => {
        switch (status) {
            case 'success': return 'bg-green-100 text-green-800 border-green-200'
            case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200'
            case 'warning': return 'bg-red-100 text-red-800 border-red-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const formatTimeAgo = (date: Date) => {
        const now = new Date()
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

        if (diffInMinutes < 60) {
            return `${diffInMinutes}min atrás`
        } else if (diffInMinutes < 1440) {
            return `${Math.floor(diffInMinutes / 60)}h atrás`
        } else {
            return `${Math.floor(diffInMinutes / 1440)}d atrás`
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
        >
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                        <span>Atividade Recente</span>
                    </CardTitle>
                    <CardDescription>
                        Últimas ações no sistema
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {activities.map((activity, index) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                                className="group relative p-4 rounded-lg border hover:shadow-md transition-all duration-200 cursor-pointer"
                            >
                                <div className="flex items-start space-x-3">
                                    <div className={`p-2 rounded-lg ${getActivityColor(activity.status)} group-hover:scale-110 transition-transform`}>
                                        {getActivityIcon(activity.type)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {activity.title}
                                            </h4>
                                            <ArrowUpRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>

                                        <p className="text-sm text-gray-600 mb-2">
                                            {activity.description}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Badge variant="outline" className={`text-xs ${getStatusBadgeColor(activity.status)}`}>
                                                    {activity.status === 'success' ? 'Concluído' :
                                                        activity.status === 'pending' ? 'Pendente' : 'Atenção'}
                                                </Badge>

                                                {activity.value && (
                                                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                                        {activity.value}
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex items-center text-xs text-gray-500">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {formatTimeAgo(activity.timestamp)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {activities.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Nenhuma atividade recente</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}