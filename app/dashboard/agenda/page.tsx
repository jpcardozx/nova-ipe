'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, TrendingUp, Users, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import CalendarView from '../components/CalendarView'
import { CRMService } from '@/lib/supabase/crm-service'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser-simple'

export default function AgendaPage() {
    const { user } = useCurrentUser()
    const [stats, setStats] = useState({
        todayEvents: 0,
        weekEvents: 0,
        monthEvents: 0,
        overdueEvents: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadAgendaStats()
    }, [user])

    const loadAgendaStats = async () => {
        setLoading(true)
        try {
            // Load tasks to calculate stats
            const { data: tasks } = await CRMService.getTasks({
                assigned_to: user?.id
            })

            if (tasks) {
                const today = new Date()
                const startOfWeek = new Date(today)
                startOfWeek.setDate(today.getDate() - today.getDay())
                const endOfWeek = new Date(startOfWeek)
                endOfWeek.setDate(startOfWeek.getDate() + 6)

                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
                const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

                const todayEvents = tasks.filter(task => {
                    if (!task.due_date) return false
                    const taskDate = new Date(task.due_date)
                    return taskDate.toDateString() === today.toDateString()
                }).length

                const weekEvents = tasks.filter(task => {
                    if (!task.due_date) return false
                    const taskDate = new Date(task.due_date)
                    return taskDate >= startOfWeek && taskDate <= endOfWeek
                }).length

                const monthEvents = tasks.filter(task => {
                    if (!task.due_date) return false
                    const taskDate = new Date(task.due_date)
                    return taskDate >= startOfMonth && taskDate <= endOfMonth
                }).length

                const overdueEvents = tasks.filter(task => {
                    if (!task.due_date || task.status === 'completed') return false
                    const taskDate = new Date(task.due_date)
                    return taskDate < today
                }).length

                setStats({
                    todayEvents,
                    weekEvents,
                    monthEvents,
                    overdueEvents
                })
            }
        } catch (error) {
            console.error('Error loading agenda stats:', error)
        } finally {
            setLoading(false)
        }
    }

    const statsCards = [
        {
            title: 'Hoje',
            value: stats.todayEvents,
            icon: Clock,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
        },
        {
            title: 'Esta Semana',
            value: stats.weekEvents,
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
        },
        {
            title: 'Este Mês',
            value: stats.monthEvents,
            icon: Calendar,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200'
        },
        {
            title: 'Em Atraso',
            value: stats.overdueEvents,
            icon: AlertTriangle,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200'
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg">
                            <Calendar className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Agenda Profissional</h1>
                            <p className="text-gray-600">Gerencie seus compromissos e tarefas</p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                                        <div className="h-8 bg-gray-200 rounded w-12"></div>
                                    </div>
                                    <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                    >
                        {statsCards.map((stat, index) => {
                            const Icon = stat.icon
                            return (
                                <motion.div
                                    key={stat.title}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`bg-white rounded-xl p-6 border ${stat.borderColor} hover:shadow-lg transition-all duration-200`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-600 text-sm font-medium mb-1">
                                                {stat.title}
                                            </p>
                                            <p className="text-3xl font-bold text-gray-900">
                                                {stat.value}
                                            </p>
                                        </div>
                                        <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                                            <Icon className={`h-6 w-6 ${stat.color}`} />
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                )}

                {/* Calendar View */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <CalendarView />
                </motion.div>
            </div>
        </div>
    )
}