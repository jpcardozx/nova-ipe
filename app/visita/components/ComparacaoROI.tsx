'use client'

import React from 'react'
import { Clock, Users, MapPin, Heart, CheckCircle, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

interface ProcessComparison {
    method: string
    time: string
    satisfaction: string
    support: string
    complexity: string
    outcome: string
    color: string
    description: string
}

const searchMethods: ProcessComparison[] = [
    {
        method: "Sozinho",
        time: "Demorado",
        satisfaction: "Cansativo",
        support: "Nenhum",
        complexity: "Confuso",
        outcome: "Incerto",
        color: "from-slate-400 to-slate-500",
        description: "Visitar tudo sozinho, sem saber direito o que procurar"
    },
    {
        method: "Sites de imóveis",
        time: "Rápido online",
        satisfaction: "Superficial",
        support: "Básico",
        complexity: "Médio",
        outcome: "Limitado",
        color: "from-slate-500 to-slate-600",
        description: "Fotos bonitas, mas falta conhecer pessoalmente"
    },
    {
        method: "Com a Nova Ipê",
        time: "No seu ritmo",
        satisfaction: "Tranquilo",
        support: "Presente",
        complexity: "Simples",
        outcome: "Organizado",
        color: "from-amber-500 to-amber-600",
        description: "Alguém que conhece te acompanha e explica tudo"
    }
]

const processFactors = [
    {
        icon: Clock,
        title: "Organização do tempo",
        description: "Agendamento estruturado evita visitas desnecessárias e otimiza seu tempo",
        impact: "Mais eficiente"
    },
    {
        icon: Users,
        title: "Acompanhamento profissional",
        description: "Corretor experiente presente em cada etapa do processo",
        impact: "Suporte contínuo"
    },
    {
        icon: MapPin,
        title: "Conhecimento local",
        description: "10 anos de experiência exclusiva em Guararema e região",
        impact: "Insights valiosos"
    },
    {
        icon: Heart,
        title: "Atendimento personalizado",
        description: "Cada cliente recebe atenção individual e orientação personalizada",
        impact: "Relacionamento próximo"
    }
]

export default function ComparacaoROI() {
    return (
        <section className="py-24 bg-gradient-to-br from-slate-50 to-amber-50 relative overflow-hidden">
            {/* Background Elements - amber theme */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-slate-100/40 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-6 lg:px-8 relative z-10">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-3 mb-8 bg-gradient-to-r from-amber-100 to-slate-100 rounded-full px-8 py-4 border border-amber-200">
                            <Clock className="w-5 h-5 text-amber-600" />
                            <span className="text-slate-700 text-sm font-semibold uppercase tracking-wide">
                                Como funciona
                            </span>
                        </div>

                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-8 leading-tight">
                            Três jeitos de{' '}
                            <span className="relative">
                                <span className="bg-gradient-to-r from-amber-600 to-slate-600 bg-clip-text text-transparent">
                                    procurar casa
                                </span>
                                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-slate-400 rounded-full opacity-60"></div>
                            </span>
                        </h2>

                        <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            Cada um tem sua forma de procurar imóvel. Aqui você vê as diferenças e
                            escolhe o que faz mais sentido pra você.
                        </p>
                    </div>                    {/* Comparison Table with amber theme */}
                    <div className="mb-20">
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-amber-100 to-slate-100 border-b border-slate-200">
                                            <th className="text-left p-8 font-bold text-slate-900 text-lg">Método de Busca</th>
                                            <th className="text-center p-8 font-bold text-slate-900">Tempo Médio</th>
                                            <th className="text-center p-8 font-bold text-slate-900">Satisfação</th>
                                            <th className="text-center p-8 font-bold text-slate-900">Suporte</th>
                                            <th className="text-center p-8 font-bold text-slate-900">Complexidade</th>
                                            <th className="text-center p-8 font-bold text-slate-900">Resultado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchMethods.map((method, index) => (
                                            <tr key={index} className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${index === 2 ? 'bg-gradient-to-r from-emerald-50 to-blue-50' : ''}`}>
                                                <td className="p-8">
                                                    <div>
                                                        <div className={`font-bold mb-2 text-lg ${index === 2 ? 'text-emerald-700' : 'text-slate-900'}`}>
                                                            {method.method}
                                                            {index === 2 && <span className="ml-2 text-emerald-600">⭐</span>}
                                                        </div>
                                                        <div className="text-sm text-slate-600 leading-relaxed">{method.description}</div>
                                                    </div>
                                                </td>
                                                <td className="text-center p-8">
                                                    <span className={`font-bold text-lg ${index === 2 ? 'text-emerald-600' : 'text-slate-700'}`}>
                                                        {method.time}
                                                    </span>
                                                </td>
                                                <td className="text-center p-8">
                                                    <span className={`font-bold text-lg ${index === 2 ? 'text-emerald-600' : 'text-slate-700'}`}>
                                                        {method.satisfaction}
                                                    </span>
                                                </td>
                                                <td className="text-center p-8">
                                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${method.support === 'Completo' ? 'bg-emerald-100 text-emerald-700' :
                                                        method.support === 'Limitado' ? 'bg-orange-100 text-orange-700' :
                                                            'bg-red-100 text-red-700'
                                                        }`}>
                                                        {method.support}
                                                    </span>
                                                </td>
                                                <td className="text-center p-8">
                                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${method.complexity === 'Baixa' ? 'bg-emerald-100 text-emerald-700' :
                                                        method.complexity === 'Alta' ? 'bg-orange-100 text-orange-700' :
                                                            'bg-red-100 text-red-700'
                                                        }`}>
                                                        {method.complexity}
                                                    </span>
                                                </td>
                                                <td className="text-center p-8">
                                                    {method.outcome === 'Previsível' ? (
                                                        <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" />
                                                    ) : (
                                                        <AlertTriangle className="w-6 h-6 text-orange-500 mx-auto" />
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Process Benefits */}
                    <div className="mb-20">
                        <h3 className="text-4xl font-bold text-slate-900 text-center mb-16">
                            Como tornamos o processo{' '}
                            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                                mais eficiente
                            </span>
                        </h3>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {processFactors.map((factor, index) => {
                                const IconComponent = factor.icon
                                return (
                                    <div key={index} className="group">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 ${index % 2 === 0 ? 'bg-emerald-100 group-hover:bg-emerald-200' : 'bg-blue-100 group-hover:bg-blue-200'
                                            }`}>
                                            <IconComponent className={`w-8 h-8 ${index % 2 === 0 ? 'text-emerald-600' : 'text-blue-600'
                                                }`} />
                                        </div>

                                        <div className={`inline-block text-white text-xs font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-wide ${index % 2 === 0 ? 'bg-emerald-600' : 'bg-blue-600'
                                            }`}>
                                            {factor.impact}
                                        </div>

                                        <h4 className="text-xl font-bold text-slate-900 mb-4 leading-tight">
                                            {factor.title}
                                        </h4>

                                        <p className="text-slate-600 leading-relaxed">
                                            {factor.description}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Enhanced CTA */}
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
                                Pronto para acelerar{' '}
                                <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                                    sua busca?
                                </span>
                            </h3>

                            <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-3xl mx-auto">
                                Pare de perder tempo com processos ineficientes. Nossa consultoria especializada
                                transforma semanas de busca em uma experiência focada e produtiva.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                                <Link
                                    href="#agendar"
                                    className="group bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold px-10 py-5 rounded-xl transition-all duration-300 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 flex items-center justify-center gap-2"
                                >
                                    Iniciar Processo Otimizado
                                    <Clock className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </Link>

                                <Link
                                    href="/catalogo"
                                    className="border-2 border-slate-600 hover:border-emerald-400 text-slate-300 hover:text-white font-semibold px-10 py-5 rounded-xl transition-all duration-300 hover:bg-emerald-500/10 text-center"
                                >
                                    Ver Propriedades Disponíveis
                                </Link>
                            </div>

                            <div className="text-center">
                                <p className="text-slate-400 text-sm">
                                    <span className="inline-flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                                        <strong className="text-slate-300">Primeira consulta gratuita</strong>
                                    </span>
                                    {' • '}
                                    <span className="inline-flex items-center gap-2">
                                        <Users className="w-4 h-4 text-blue-400" />
                                        Acompanhamento personalizado
                                    </span>
                                    {' • '}
                                    Resultados em 3-6 semanas
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
