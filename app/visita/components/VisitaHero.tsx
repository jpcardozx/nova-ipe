'use client'

import React from 'react'
import { ArrowRight, ChevronRight, Calendar, UserCheck, MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface HeroFeature {
    icon: React.ReactNode
    title: string
    desc: string
    stat: string
}

const heroFeatures: HeroFeature[] = [
    {
        icon: <Calendar className="h-6 w-6 text-amber-400" />,
        title: "Horário que funciona pra você",
        desc: "Marcamos as visitas no seu tempo livre, sem pressa.",
        stat: "Flexível"
    },
    {
        icon: <UserCheck className="h-6 w-6 text-amber-400" />,
        title: "Alguém vai com você",
        desc: "Sempre tem alguém da equipe junto pra tirar suas dúvidas na hora.",
        stat: "Acompanhado"
    },
    {
        icon: <MapPin className="h-6 w-6 text-amber-400" />,
        title: "Conhecemos os vizinhos",
        desc: "Sabemos contar sobre cada rua, cada bairro, e como é morar ali.",
        stat: "Local"
    }
]

export default function VisitaHero() {
    return (
        <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
            {/* Background aligned with homepage */}
            <div className="absolute inset-0">
                {/* Geometric pattern matching homepage */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-0 w-full h-full"
                        style={{
                            backgroundImage: `
                                linear-gradient(90deg, rgba(251,191,36,0.1) 1px, transparent 1px),
                                linear-gradient(rgba(251,191,36,0.1) 1px, transparent 1px)
                             `,
                        }}>
                    </div>
                </div>

                {/* Amber floating elements */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-amber-400/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-slate-500/10 rounded-full blur-2xl"></div>

                {/* Subtle border elements with amber theme */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
            </div>

            <div className="container mx-auto px-6 lg:px-8 relative z-10">
                <div className="max-w-7xl mx-auto pt-20 pb-32">
                    <div className="grid lg:grid-cols-12 gap-16 items-center min-h-[80vh]">
                        {/* Content section */}
                        <div className="lg:col-span-7 space-y-8">
                            {/* Service badge with amber theme */}
                            <div className="inline-flex items-center gap-3 bg-amber-500/10 backdrop-blur-sm border border-amber-400/30 rounded-full px-6 py-3">
                                <div className="relative">
                                    <div className="w-2.5 h-2.5 bg-amber-400 rounded-full"></div>
                                    <div className="absolute inset-0 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></div>
                                </div>
                                <span className="text-amber-300 text-sm font-medium uppercase tracking-wider">
                                    Consultoria Imobiliária Especializada
                                </span>
                            </div>

                            <div className="space-y-6">
                                <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                                    Vamos visitar{' '}
                                    <span className="relative">
                                        <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                                            juntos?
                                        </span>
                                        <div className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-amber-300 to-amber-500 rounded-full opacity-70"></div>
                                    </span>
                                </h1>

                                <p className="text-lg lg:text-xl text-slate-300 leading-relaxed max-w-2xl">
                                    Visitamos os imóveis junto com você. Sem pressa, sem pressão.
                                    Só mostramos o que faz sentido pro que você está procurando.
                                </p>
                            </div>                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link
                                    href="#agendar"
                                    className="group bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 flex items-center justify-center gap-2"
                                >
                                    Vamos marcar uma visita
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="/catalogo"
                                    className="border-2 border-slate-600 hover:border-amber-400 text-slate-300 hover:text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:bg-amber-500/10 text-center"
                                >
                                    Ver imóveis primeiro
                                </Link>
                            </div>

                            {/* Features grid with amber theme */}
                            <div className="grid sm:grid-cols-3 gap-6 pt-8">
                                {heroFeatures.map((feature, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-amber-400/30 transition-all duration-300 group"
                                    >
                                        <div className="flex items-center justify-center w-12 h-12 bg-amber-500/20 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                                            {feature.icon}
                                        </div>
                                        <div className="text-amber-400 font-bold text-sm mb-2">{feature.stat}</div>
                                        <h3 className="text-white font-semibold text-lg mb-3">{feature.title}</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Visual section */}
                        <div className="lg:col-span-5">
                            <div className="relative">
                                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/50 border border-white/10">
                                    <Image
                                        src="/bg3.jpg"
                                        alt="Consultoria imobiliária em Guararema"
                                        fill
                                        priority
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                                </div>

                                {/* Floating info card with amber accents */}
                                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20 max-w-sm">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                                        <span className="text-slate-700 font-semibold text-sm">Consultoria Ativa</span>
                                    </div>
                                    <p className="text-slate-600 text-sm mb-3">
                                        <strong>João Silva</strong> visitando imóveis selecionados em Guararema
                                    </p>
                                    <div className="text-xs text-slate-500">
                                        Acompanhamento: Nova Ipê Imóveis
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
