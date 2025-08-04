'use client'

import React from 'react'
import { Home, Users, Clock, MapPin, Shield, Handshake } from 'lucide-react'
import Link from 'next/link'

interface CompetitiveAdvantage {
    icon: React.ComponentType<{ className?: string }>
    title: string
    description: string
    metric: string
    detail: string
}

const advantages: CompetitiveAdvantage[] = [
    {
        icon: Home,
        title: "Conhecemos a cidade",
        description: "Nascemos e crescemos em Guararema. Conhecemos cada bairro, cada rua, e sabemos onde vale a pena investir.",
        metric: "Local",
        detail: "Desde sempre"
    },
    {
        icon: Users,
        title: "Atendimento pessoal",
        description: "Você não vai falar com call center. Aqui você conversa direto conosco, e conhecemos sua história.",
        metric: "Pessoal",
        detail: "Sempre disponível"
    },
    {
        icon: Clock,
        title: "Sem pressa, sem pressão",
        description: "Não temos meta de vendas maluca. Queremos que você encontre a casa certa, no seu tempo.",
        metric: "Seu ritmo",
        detail: "Sem pressão"
    },
    {
        icon: MapPin,
        title: "Só trabalhamos aqui",
        description: "Focamos apenas em Guararema e região. Não vendemos em São Paulo ou outros lugares. Aqui é nossa especialidade.",
        metric: "Guararema",
        detail: "Nossa especialidade"
    },
    {
        icon: Shield,
        title: "Documentação em ordem",
        description: "Verificamos tudo direitinho antes de mostrar o imóvel. Sem surpresas desagradáveis depois.",
        metric: "Verificado",
        detail: "Tudo conferido"
    },
    {
        icon: Handshake,
        title: "Estamos aqui depois",
        description: "Comprou ou alugou conosco? Continuamos aqui para o que precisar. Somos vizinhos, afinal.",
        metric: "Sempre",
        detail: "Somos daqui"
    }
]

export default function DiferenciacaoCompetitiva() {
    return (
        <section className="py-24 bg-gradient-to-br from-slate-50 to-amber-50 relative overflow-hidden">
            {/* Background Elements - aligned with homepage amber theme */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-slate-100/40 rounded-full blur-3xl"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50/60 rounded-full blur-2xl"></div>
            </div>

            <div className="container mx-auto px-6 lg:px-8 relative z-10">
                <div className="max-w-7xl mx-auto">
                    {/* Header aligned with homepage style */}
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-3 mb-8 bg-gradient-to-r from-amber-100 to-slate-100 rounded-full px-8 py-4 border border-amber-200">
                            <Shield className="w-5 h-5 text-amber-600" />
                            <span className="text-slate-700 text-sm font-semibold uppercase tracking-wide">
                                Quem somos
                            </span>
                        </div>

                        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                            Somos de{' '}
                            <span className="relative">
                                <span className="bg-gradient-to-r from-amber-600 to-slate-600 bg-clip-text text-transparent">
                                    Guararema
                                </span>
                                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-slate-400 rounded-full opacity-60"></div>
                            </span>
                        </h2>

                        <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            Uma imobiliária local que conhece cada cantinho da cidade.
                            Trabalhamos com simplicidade, honestidade e carinho.
                        </p>
                    </div>                    {/* Advantages Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {advantages.map((advantage, index) => {
                            const IconComponent = advantage.icon
                            return (
                                <div
                                    key={index}
                                    className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50 hover:bg-white transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl relative overflow-hidden"
                                >
                                    {/* Amber-themed background gradient */}
                                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${index % 3 === 0 ? 'bg-gradient-to-br from-amber-50/60 to-amber-100/60' :
                                        index % 3 === 1 ? 'bg-gradient-to-br from-slate-50/60 to-slate-100/60' :
                                            'bg-gradient-to-br from-amber-50/40 to-slate-50/40'
                                        }`}></div>

                                    <div className="relative z-10">
                                        {/* Icon with amber theme */}
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 ${index % 3 === 0 ? 'bg-amber-100 group-hover:bg-amber-200' :
                                            index % 3 === 1 ? 'bg-slate-100 group-hover:bg-slate-200' :
                                                'bg-amber-50 group-hover:bg-amber-100'
                                            }`}>
                                            <IconComponent className={`w-8 h-8 ${index % 3 === 0 ? 'text-amber-600' :
                                                index % 3 === 1 ? 'text-slate-600' :
                                                    'text-amber-700'
                                                }`} />
                                        </div>

                                        {/* Metric Badge with amber theme */}
                                        <div className={`inline-block text-white text-xs font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-wide ${index % 3 === 0 ? 'bg-amber-600' :
                                            index % 3 === 1 ? 'bg-slate-600' :
                                                'bg-amber-700'
                                            }`}>
                                            {advantage.metric}
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight">
                                            {advantage.title}
                                        </h3>

                                        <p className="text-slate-600 leading-relaxed mb-4 text-sm">
                                            {advantage.description}
                                        </p>

                                        <div className={`text-sm font-medium ${index % 3 === 0 ? 'text-amber-600' :
                                            index % 3 === 1 ? 'text-slate-600' :
                                                'text-amber-700'
                                            }`}>
                                            {advantage.detail}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* CTA Section with amber theme */}
                    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-12 lg:p-16 shadow-2xl relative overflow-hidden">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                                backgroundSize: '50px 50px'
                            }}></div>
                        </div>

                        <div className="relative z-10 max-w-4xl mx-auto text-center">
                            <h3 className="text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
                                Que tal conhecer{' '}
                                <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                                    nosso trabalho?
                                </span>
                            </h3>

                            <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-3xl mx-auto">
                                Oferecemos consultoria personalizada e acompanhamento completo para
                                encontrar o imóvel ideal em Guararema.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                                <Link
                                    href="/visita"
                                    className="group bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold px-10 py-5 rounded-xl transition-all duration-300 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 flex items-center justify-center gap-2"
                                >
                                    Agendar Consultoria
                                    <Handshake className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </Link>

                                <Link
                                    href="#imoveis"
                                    className="border-2 border-slate-600 hover:border-amber-400 text-slate-300 hover:text-white font-semibold px-10 py-5 rounded-xl transition-all duration-300 hover:bg-amber-500/10 text-center"
                                >
                                    Ver Imóveis Disponíveis
                                </Link>
                            </div>

                            <div className="text-center">
                                <p className="text-slate-400 text-sm">
                                    <span className="inline-flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-amber-400" />
                                        <strong className="text-slate-300">Consultoria gratuita</strong>
                                    </span>
                                    {' • '}
                                    <span className="inline-flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-amber-400" />
                                        Resposta rápida
                                    </span>
                                    {' • '}
                                    Atendimento personalizado
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
