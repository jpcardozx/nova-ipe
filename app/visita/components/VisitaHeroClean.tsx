'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Calendar, Clock, Shield, Award } from 'lucide-react'

interface VisitaHeroCleanProps {
    className?: string
}

export default function VisitaHeroClean({ className }: VisitaHeroCleanProps) {
    return (
        <section className={cn("relative bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600", className)}>
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)]" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
                <div className="text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
                        <Calendar className="w-4 h-4 text-white" />
                        <span className="text-sm font-medium text-white">
                            Agendamento Premium
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                        Agende sua
                        <span className="text-slate-900 block">
                            Visita
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Conheça pessoalmente o imóvel dos seus sonhos.
                        Agendamento rápido, fácil e totalmente gratuito.
                    </p>

                    {/* CTA Button */}
                    <div className="mb-12">
                        <button className="bg-white hover:bg-slate-50 text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
                            Agendar Visita Agora
                        </button>
                    </div>

                    {/* Benefits */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-white mb-1">Rápido e Fácil</h3>
                            <p className="text-sm text-white/80">Agendamento em 2 minutos</p>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-white mb-1">100% Seguro</h3>
                            <p className="text-sm text-white/80">Visitas acompanhadas</p>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-white mb-1">Especialistas</h3>
                            <p className="text-sm text-white/80">Corretores experientes</p>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-white mb-1">Flexível</h3>
                            <p className="text-sm text-white/80">Horários disponíveis</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
