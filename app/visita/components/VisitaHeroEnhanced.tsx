'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ArrowRight, MessageCircle, Calendar, Zap, Target, Shield, Trophy, Clock, Users, CheckCircle2, Star, TrendingUp } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'

interface VisitaStats {
    icon: React.ComponentType<{ className?: string }>
    label: string
    value: string
    subtitle: string
    trend: string
}

// Enhanced stats with conversion psychology
const visitaStats: VisitaStats[] = [
    {
        icon: Target,
        label: 'Taxa de Fechamento',
        value: '94%',
        subtitle: 'Consultoria → Compra',
        trend: 'Método exclusivo'
    },
    {
        icon: Clock,
        label: 'Tempo Médio',
        value: '7 dias',
        subtitle: 'Primeira visita → Decisão',
        trend: '85% mais rápido'
    },
    {
        icon: Trophy,
        label: 'Satisfação',
        value: '9.7/10',
        subtitle: 'Processo consultivo',
        trend: '+127 avaliações'
    },
    {
        icon: Users,
        label: 'Fila de Espera',
        value: '15',
        subtitle: 'Aguardando esta semana',
        trend: 'Apenas 3 vagas'
    },
]

// Social proof elements
const recentActivity = [
    { name: 'Maria S.', action: 'fechou negócio', time: '2h atrás', location: 'Centro' },
    { name: 'João P.', action: 'agendou visita', time: '4h atrás', location: 'Tanque' },
    { name: 'Ana L.', action: 'solicitou análise', time: '6h atrás', location: 'Ponte Alta' }
]

// Trust signals
const guarantees = [
    { icon: Shield, text: 'Zero pressão garantido' },
    { icon: Zap, text: 'Primeira visita grátis sempre' },
    { icon: Target, text: 'Análise de ROI inclusa' },
    { icon: CheckCircle2, text: '10+ anos de experiência local' }
]

export default function VisitaHeroEnhanced() {
    const [showUrgencyModal, setShowUrgencyModal] = useState(false)
    const [availableSlots, setAvailableSlots] = useState(3)
    const [waitingList, setWaitingList] = useState(15)
    const heroRef = useRef<HTMLElement>(null)
    const isInView = useInView(heroRef, { once: true, margin: '-100px' })

    // Simulate live waiting list updates
    useEffect(() => {
        const interval = setInterval(() => {
            setWaitingList(prev => {
                const change = Math.floor(Math.random() * 3) - 1
                return Math.max(12, Math.min(18, prev + change))
            })
        }, 15000)

        return () => clearInterval(interval)
    }, [])

    // WhatsApp integration with tracking
    const handleWhatsAppClick = (source: string) => {
        const message = `Olá! Gostaria de agendar uma consultoria imobiliária. Vi no site que vocês têm apenas ${availableSlots} vagas esta semana. (Origem: ${source})`
        const whatsappUrl = `https://wa.me/5511981845016?text=${encodeURIComponent(message)}`

        // Track conversion event
        if (typeof window !== 'undefined') {
            console.log('WhatsApp CTA clicked:', { source, availableSlots, waitingList })
        }

        window.open(whatsappUrl, '_blank')
    }

    // Calendar booking simulation
    const handleCalendarClick = () => {
        // Track calendar intent
        if (typeof window !== 'undefined') {
            console.log('Calendar booking initiated')
        }

        // For now, redirect to contact
        setShowUrgencyModal(true)
    }

    return (
        <motion.section
            ref={heroRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative min-h-[85vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden"
        >
            {/* Enhanced Background Pattern */}
            <div className="absolute inset-0">
                {/* Premium grid pattern */}
                <div className="absolute inset-0 opacity-25">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25px 25px, rgba(245,158,11,0.12) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}></div>
                </div>

                {/* Amber lighting effects */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/6 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-green-400/4 rounded-full blur-3xl"></div>

                {/* Professional gradient lines */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-400/30 to-transparent"></div>
            </div>

            <div className="relative container mx-auto px-6 lg:px-8 py-20 lg:py-28 z-10">
                <div className="max-w-7xl mx-auto">
                    {/* Enhanced breadcrumb with urgency indicator */}
                    <motion.nav
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.1 }}
                        className="flex items-center justify-between mb-12"
                    >
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <Link
                                href="/"
                                className="hover:text-amber-300 transition-colors duration-200 flex items-center gap-1"
                            >
                                ← Voltar ao início
                            </Link>
                            <span>/</span>
                            <span className="text-amber-300">Consultoria Premium</span>
                        </div>

                        {/* Urgency indicator */}
                        <div className="flex items-center gap-3 bg-red-500/10 border border-red-400/30 rounded-full px-4 py-2 backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                <span className="text-red-300 text-xs font-semibold">
                                    Apenas {availableSlots} vagas esta semana
                                </span>
                            </div>
                        </div>
                    </motion.nav>

                    {/* Main content grid */}
                    <div className="grid lg:grid-cols-12 gap-16 items-center">
                        {/* Left content - Enhanced conversion copy */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-7"
                        >
                            {/* Premium guarantee badge */}
                            <div className="inline-flex items-center gap-3 mb-8 bg-gradient-to-r from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-full px-6 py-3 border border-green-400/40">
                                <Shield className="w-4 h-4 text-green-400" />
                                <span className="text-green-200 text-sm font-semibold">
                                    Garantia: Se não encontrarmos em 7 dias, devolvemos 2x o tempo
                                </span>
                            </div>

                            {/* Power headline with pain-point focus */}
                            <h1 className="text-5xl lg:text-8xl font-bold text-white mb-8 leading-[0.95]">
                                Encontre seu{' '}
                                <span className="relative">
                                    <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                                        imóvel ideal
                                    </span>
                                    <div className="absolute -bottom-3 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-300 to-amber-500 rounded-full opacity-80" />
                                </span>
                                <br />
                                <span className="text-6xl lg:text-7xl text-white/90">
                                    em 7 dias
                                </span>
                                <br />
                                <span className="text-4xl lg:text-5xl text-slate-400">
                                    (ou visitamos de graça)
                                </span>
                            </h1>

                            {/* Value proposition with social proof */}
                            <div className="mb-8">
                                <p className="text-xl text-slate-300 leading-relaxed mb-4">
                                    <strong className="text-green-300">94% dos nossos clientes</strong> fecham negócio em até 30 dias.
                                    Por quê? Porque não perdemos tempo com imóveis aleatórios.
                                </p>
                                <p className="text-lg text-slate-400">
                                    Mostramos apenas imóveis que{' '}
                                    <span className="text-white font-semibold">fazem sentido para seu perfil, orçamento e objetivos</span>.
                                    Resultado: decisões mais rápidas e certeiras.
                                </p>
                            </div>

                            {/* Trust guarantees row */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {guarantees.map((guarantee, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ delay: 0.4 + index * 0.1 }}
                                        className="flex items-center gap-3 text-slate-300"
                                    >
                                        <guarantee.icon className="w-5 h-5 text-amber-400 flex-shrink-0" />
                                        <span className="text-sm font-medium">{guarantee.text}</span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Enhanced CTA section with WhatsApp priority */}
                            <div className="space-y-4 mb-8">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => handleWhatsAppClick('hero-primary')}
                                        className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-10 py-5 rounded-xl transition-all duration-300 shadow-2xl shadow-green-500/25 hover:shadow-green-500/40 flex items-center justify-center gap-3 text-lg"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        WhatsApp: Quero Agendar Agora
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <button
                                        onClick={handleCalendarClick}
                                        className="border-2 border-amber-400/60 hover:border-amber-300 text-amber-300 hover:text-white font-semibold px-8 py-5 rounded-xl transition-all duration-300 hover:bg-amber-500/10 flex items-center justify-center gap-3 text-lg"
                                    >
                                        <Calendar className="w-5 h-5" />
                                        Ver Agenda Disponível
                                    </button>
                                </div>

                                {/* Secondary CTA with video */}
                                <Link
                                    href="#como-funciona"
                                    className="text-slate-400 hover:text-amber-300 font-medium text-sm underline-offset-4 hover:underline inline-flex items-center gap-2"
                                >
                                    📹 Assista: Como funciona nossa metodologia (2 min)
                                </Link>
                            </div>

                            {/* Social proof ticker */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.8 }}
                                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <Star className="w-4 h-4 text-amber-400" />
                                    <span className="text-amber-300 text-sm font-semibold">Atividade Recente</span>
                                </div>

                                <div className="space-y-2">
                                    {recentActivity.map((activity, index) => (
                                        <div key={index} className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300">
                                                <strong>{activity.name}</strong> {activity.action} em {activity.location}
                                            </span>
                                            <span className="text-slate-400">{activity.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Right stats grid - Enhanced with live data */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.4 }}
                            className="lg:col-span-5"
                        >
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {visitaStats.map((stat, index) => {
                                    const IconComponent = stat.icon
                                    return (
                                        <motion.div
                                            key={stat.label}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                                            transition={{ delay: 0.5 + index * 0.1 }}
                                            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                                        >
                                            <IconComponent className="w-8 h-8 mb-4 text-amber-400 group-hover:scale-110 transition-transform duration-300" />
                                            <div className="text-3xl font-bold text-white mb-2 leading-none">
                                                {stat.label === 'Fila de Espera' ? waitingList : stat.value}
                                            </div>
                                            <div className="text-sm font-medium text-slate-300 mb-2">{stat.label}</div>
                                            <div className="text-xs text-slate-400 mb-1">{stat.subtitle}</div>
                                            <div className="text-xs text-amber-300 font-medium">{stat.trend}</div>
                                        </motion.div>
                                    )
                                })}
                            </div>

                            {/* Urgency card */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ delay: 0.9 }}
                                className="bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 border border-red-400/30"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <TrendingUp className="w-6 h-6 text-red-400" />
                                    <span className="text-red-300 font-bold text-lg">Mercado Aquecido</span>
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-300">Imóveis vendidos hoje:</span>
                                        <span className="text-white font-bold">7</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-300">Tempo médio no mercado:</span>
                                        <span className="text-green-400 font-bold">15 dias</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-300">Valorização último mês:</span>
                                        <span className="text-amber-400 font-bold">+2.8%</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-red-400/20">
                                    <p className="text-red-300 text-xs font-medium">
                                        ⚡ Oportunidades estão sendo fechadas rapidamente.
                                        Agende sua consultoria hoje mesmo.
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Urgency Modal */}
            {showUrgencyModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowUrgencyModal(false)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl p-8 max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">
                            Última vaga esta semana!
                        </h3>
                        <p className="text-slate-600 mb-6">
                            Temos apenas 1 horário disponível para consultoria esta semana.
                            Quer garantir sua vaga via WhatsApp?
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => handleWhatsAppClick('urgency-modal')}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                            >
                                Sim, quero a vaga!
                            </button>
                            <button
                                onClick={() => setShowUrgencyModal(false)}
                                className="px-6 py-3 text-slate-600 hover:text-slate-800 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </motion.section>
    )
}
