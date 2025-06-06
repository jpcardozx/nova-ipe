'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, Users, MapPin, Home, Calendar, ArrowRight, Info, ChevronDown, Leaf, Building } from 'lucide-react';

// Hook para animação de números quando visível
const useCountUp = (end: number, duration = 2000) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.5 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let startTime: number;
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            setCount(Math.floor(end * progress));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [isVisible, end, duration]);

    return [ref, count] as const;
};

export default function MarketIntelligence() {
    const [activeInsight, setActiveInsight] = useState<number | null>(null);
    const [selectedTimeframe, setSelectedTimeframe] = useState<'now' | 'soon' | 'future'>('now');
    const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

    const [demandRef, demandCount] = useCountUp(847, 1500);
    const [daysRef, daysCount] = useCountUp(34, 1500);    // Conteúdo substancial sobre o mercado
    const marketInsights = {
        currentDemand: {
            title: "Por que agora é diferente",
            subtitle: "O mercado de Guararema vive um momento único",
            metrics: {
                searchIncrease: { value: 847, unit: "buscas/mês", context: "por imóveis em Guararema" },
                averageDays: { value: 34, unit: "dias", context: "tempo médio até a venda" },
                priceEvolution: { before: "R$ 1.200/m²", now: "R$ 1.850/m²", period: "2019-2024" }
            },
            factors: [
                {
                    icon: Users,
                    title: "Novo perfil de morador",
                    detail: "Profissionais de tecnologia e famílias jovens da capital buscando qualidade de vida. Trabalho remoto viabilizou a mudança permanente."
                },
                {
                    icon: Building,
                    title: "Infraestrutura em expansão",
                    detail: "Novo hospital particular, ampliação da rede de fibra óptica e projetos de saneamento em andamento valorizam a região."
                },
                {
                    icon: Leaf,
                    title: "Sustentabilidade como ativo",
                    detail: "APA do Alto Tietê garante preservação permanente. Imóveis com vista para serra ou próximos a nascentes têm ágio de até 40%."
                }
            ]
        },

        audienceSpecific: [
            {
                id: 'primeira-casa',
                audience: "Primeira casa própria",
                message: "O momento do financiamento ainda é favorável",
                insights: [
                    "Taxa Selic em queda torna financiamento mais acessível",
                    "Programa Minha Casa Minha Vida ampliado para renda até R$ 8.000",
                    "Construtoras oferecem subsídio de até R$ 30.000 em lançamentos"
                ],
                warning: "Estoque de casas prontas abaixo de 2 meses de vendas"
            },
            {
                id: 'investidor',
                audience: "Investidores",
                message: "Rentabilidade supera fundos imobiliários",
                insights: [
                    "Aluguel de temporada: R$ 800-1.200/diária em feriados",
                    "Yield anual médio de 7.2% em locação tradicional",
                    "Valorização acumulada superior ao CDI nos últimos 5 anos"
                ],
                warning: "Regulamentação de Airbnb em discussão na câmara"
            },
            {
                id: 'upgrade',
                audience: "Mudança de vida",
                message: "Seu imóvel na capital vale mais aqui",
                insights: [
                    "Apartamento de 80m² em SP = Casa de 300m² com terreno em Guararema",
                    "Economia mensal de R$ 3-5 mil comparado ao custo de vida na capital",
                    "Escolas particulares com mensalidades 40% menores que SP"
                ],
                warning: "Melhores terrenos em bairros estabelecidos cada vez mais raros"
            }
        ],

        timeline: {
            now: {
                label: "Hoje",
                description: "Mercado aquecido com estoque reduzido",
                details: [
                    "Fila de espera em lançamentos",
                    "Múltiplas ofertas em imóveis bem localizados",
                    "Negociação média de apenas 3-5% do valor pedido"
                ]
            },
            soon: {
                label: "Próximos 12 meses",
                description: "Novos lançamentos e infraestrutura",
                details: [
                    "4 novos condomínios com 380 unidades total",
                    "Conclusão do novo acesso ao Rodoanel",
                    "Inauguração do shopping (primeiro da cidade)"
                ]
            },
            future: {
                label: "2-3 anos",
                description: "Consolidação como cidade dormitório premium",
                details: [
                    "População projetada: 35.000 habitantes",
                    "Nova regulamentação de gabarito (até 4 andares)",
                    "Possível saturação levando preços ao patamar de Atibaia"
                ]
            }
        }
    } as const;

    return (
        <section className="py-20 bg-gradient-to-b from-amber-50/30 to-white">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header com contexto imediato */}
                <header className="mb-16">
                    <div className="max-w-4xl">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            {marketInsights.currentDemand.title}
                        </h1>
                        <p className="text-xl text-gray-700 leading-relaxed">
                            {marketInsights.currentDemand.subtitle}
                        </p>
                    </div>

                    {/* Métricas principais com animação */}
                    <div className="grid md:grid-cols-3 gap-8 mt-12">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
                            <div className="flex items-start justify-between mb-4">
                                <TrendingUp className="w-8 h-8 text-amber-600" />
                                <span className="text-xs text-gray-500 bg-amber-50 px-2 py-1 rounded-full">
                                    vs 2023
                                </span>
                            </div>
                            <div ref={demandRef} className="text-3xl font-bold text-gray-900 mb-1">
                                +{demandCount}
                            </div>
                            <div className="text-sm text-gray-600">
                                {marketInsights.currentDemand.metrics.searchIncrease.unit}
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                                {marketInsights.currentDemand.metrics.searchIncrease.context}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
                            <div className="flex items-start justify-between mb-4">
                                <Calendar className="w-8 h-8 text-amber-600" />
                                <span className="text-xs text-gray-500 bg-green-50 px-2 py-1 rounded-full">
                                    recorde
                                </span>
                            </div>
                            <div ref={daysRef} className="text-3xl font-bold text-gray-900 mb-1">
                                {daysCount}
                            </div>
                            <div className="text-sm text-gray-600">
                                {marketInsights.currentDemand.metrics.averageDays.unit}
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                                {marketInsights.currentDemand.metrics.averageDays.context}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
                            <div className="flex items-start justify-between mb-4">
                                <Home className="w-8 h-8 text-amber-600" />
                                <span className="text-xs text-gray-500 bg-amber-50 px-2 py-1 rounded-full">
                                    {marketInsights.currentDemand.metrics.priceEvolution.period}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm text-gray-500 line-through">
                                    {marketInsights.currentDemand.metrics.priceEvolution.before}
                                </div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {marketInsights.currentDemand.metrics.priceEvolution.now}
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                                preço médio do m² construído
                            </div>
                        </div>
                    </div>
                </header>

                {/* Fatores de valorização */}
                <section className="mb-20">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">
                        O que está transformando Guararema
                    </h2>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {marketInsights.currentDemand.factors.map((factor, idx) => {
                            const Icon = factor.icon;
                            return (
                                <div
                                    key={idx}
                                    className="group cursor-pointer"
                                    onClick={() => setActiveInsight(activeInsight === idx ? null : idx)}
                                >
                                    <div className={`
                    bg-white rounded-2xl p-6 border-2 transition-all duration-300
                    ${activeInsight === idx
                                            ? 'border-amber-500 shadow-xl'
                                            : 'border-stone-200 hover:border-stone-300 hover:shadow-md'
                                        }
                  `}>
                                        <Icon className={`w-10 h-10 mb-4 transition-colors ${activeInsight === idx ? 'text-amber-600' : 'text-stone-600'
                                            }`} />

                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            {factor.title}
                                        </h3>

                                        <p className={`text-sm leading-relaxed transition-all duration-300 ${activeInsight === idx
                                            ? 'text-gray-700'
                                            : 'text-gray-600 line-clamp-2 group-hover:line-clamp-none'
                                            }`}>
                                            {factor.detail}
                                        </p>

                                        {activeInsight !== idx && (
                                            <button className="mt-3 text-sm text-amber-600 font-medium group-hover:underline">
                                                Entender impacto →
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Insights por público */}
                <section className="mb-20">
                    <div className="bg-gradient-to-br from-stone-100 to-stone-50 rounded-3xl p-8 md:p-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Encontre sua oportunidade
                        </h2>
                        <p className="text-gray-600 mb-10">
                            Cada momento do mercado favorece perfis diferentes
                        </p>

                        <div className="space-y-6">
                            {marketInsights.audienceSpecific.map((segment) => (
                                <div
                                    key={segment.id}
                                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    <button
                                        onClick={() => setExpandedTopic(expandedTopic === segment.id ? null : segment.id)}
                                        className="w-full px-8 py-6 flex items-center justify-between group"
                                    >
                                        <div className="text-left">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {segment.audience}
                                            </h3>
                                            <p className="text-gray-600">
                                                {segment.message}
                                            </p>
                                        </div>

                                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${expandedTopic === segment.id ? 'rotate-180' : ''
                                            }`} />
                                    </button>

                                    {expandedTopic === segment.id && (
                                        <div className="px-8 pb-8 border-t">
                                            <div className="pt-6 space-y-3">
                                                {segment.insights.map((insight, idx) => (
                                                    <div key={idx} className="flex items-start gap-3">
                                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                                                        <p className="text-gray-700">{insight}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {segment.warning && (
                                                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                                                    <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                                    <p className="text-sm text-amber-800">
                                                        <span className="font-semibold">Atenção:</span> {segment.warning}
                                                    </p>
                                                </div>
                                            )}

                                            <button className="mt-6 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors inline-flex items-center gap-2">
                                                Quero saber mais sobre meu perfil
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Timeline do mercado */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">
                        Cenários e projeções
                    </h2>

                    <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
                        {/* Seletor de período */}                        <div className="flex border-b">
                            {Object.entries(marketInsights.timeline).map(([key, period]) => (
                                <button
                                    key={key}
                                    onClick={() => setSelectedTimeframe(key as 'now' | 'soon' | 'future')}
                                    className={`flex-1 px-6 py-4 font-medium transition-colors ${selectedTimeframe === key
                                        ? 'bg-amber-500 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {period.label}
                                </button>
                            ))}
                        </div>

                        {/* Conteúdo do período selecionado */}
                        <div className="p-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                {marketInsights.timeline[selectedTimeframe].description}
                            </h3>                            <div className="space-y-4">
                                {marketInsights.timeline[selectedTimeframe].details.map((detail: string, idx: number) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-bold text-amber-700">{idx + 1}</span>
                                        </div>
                                        <p className="text-gray-700 pt-1">{detail}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl">
                                <p className="text-gray-800 font-medium mb-2">
                                    {selectedTimeframe === 'now' && "Ação recomendada: Não espere a próxima alta"}
                                    {selectedTimeframe === 'soon' && "Prepare-se: Oportunidades em pré-lançamento"}
                                    {selectedTimeframe === 'future' && "Planeje: Investimento de longo prazo"}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Análise baseada em dados históricos e projetos aprovados pela prefeitura.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    );
}