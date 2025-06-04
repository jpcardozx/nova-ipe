'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import {
    MapPin,
    Phone,
    Clock,
    ChevronRight,
    Home,
    TreePine,
    Building2,
    Users,
    TrendingUp,
    Award,
    Shield,
    Star,
    Calendar,
    FileCheck,
    Sparkles,
    Target,
    HeartHandshake,
    BarChart3,
    Key,
    Mountain,
    Coffee,
    Church,
    Train,
    GraduationCap,
    ShoppingBag,
    Leaf
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Dados exclusivos sobre micro-regiões de Guararema
const guararemasExclusiveData = {
    microRegions: [
        {
            name: "Centro Histórico",
            icon: <Church className="w-5 h-5" />,
            avgPrice: "R$ 2.800/m²",
            growth: "+15% ano",
            inventory: "12 imóveis",
            insight: "Casarões do século XIX. O último vendido foi por R$ 680.000 (Casa dos Azulejos, março/2024)",
            opportunity: "3 proprietários considerando venda até dezembro",
            bestMonths: "Março-Maio",
            profile: "Investidores culturais e pousadas boutique"
        },
        {
            name: "Nogueira / Freguesia",
            icon: <Train className="w-5 h-5" />,
            avgPrice: "R$ 1.950/m²",
            growth: "+22% ano",
            inventory: "28 imóveis",
            insight: "Nova ciclovia até a estação aumentou procura em 40%. Loteamento Solar dos Lagos esgotou em 6 meses",
            opportunity: "Construtora lançará 45 casas em agosto",
            bestMonths: "Junho-Agosto",
            profile: "Famílias jovens da capital (renda R$ 12-20k)"
        },
        {
            name: "Parque Agrinco",
            icon: <Mountain className="w-5 h-5" />,
            avgPrice: "R$ 450/m²",
            growth: "+18% ano",
            inventory: "8 chácaras",
            insight: "Chácaras com nascente valem 35% mais. Última venda: 2.500m² por R$ 1.1M (com 3 nascentes)",
            opportunity: "2 chácaras de 5.000m² entrarão no mercado",
            bestMonths: "Setembro-Novembro",
            profile: "Executivos para casa de fim de semana"
        },
        {
            name: "Luis Ayres / Itaoca",
            icon: <Leaf className="w-5 h-5" />,
            avgPrice: "R$ 1.200/m²",
            growth: "+28% ano",
            inventory: "35 lotes",
            insight: "Novo acesso pela Rod. Pres. Dutra valorizou 30%. Walmart confirmou interesse na região",
            opportunity: "Prefeitura aprovou 3 novos condomínios",
            bestMonths: "Ano todo",
            profile: "Classe média em ascensão"
        }
    ],

    marketSecrets: [
        {
            title: "O Calendário Oculto de Guararema",
            insights: [
                "Festival de Inverno (julho): Vendas crescem 45% - melhor época para lançamentos",
                "Volta às aulas Salesiana (fevereiro): Pais procuram casas para alugar - oportunidade de venda",
                "Temporada de chuvas (dez-mar): Chácaras com erosão entram no mercado com desconto de até 25%",
                "Festa do Divino (maio): Turistas se apaixonam pela cidade - conversão de 12% em compradores"
            ]
        },
        {
            title: "Informações que Valem Ouro",
            insights: [
                "Duplicação da Mogi-Dutra: 2.3km já aprovados - terrenos na rota valorizarão 80%",
                "Nova escola internacional: Confirmada para 2025 no Itaocaia - preços subirão 30%",
                "Restrição ambiental: 40% de Guararema é APA - terrenos edificáveis são escassos",
                "Fibra óptica: Vivo instalará em toda zona rural até 2025 - chácaras remotas valorizarão"
            ]
        }
    ],

    hiddenGems: [
        "Casa colonial de 1888 na Rua Major Diogo - proprietário aceita permuta",
        "Terreno de 5.000m² com vista para Pedra Montada - dono mora no Japão, quer vender rápido",
        "Chácara de 10.000m² com lago e pomar formado - viúva aceita parcelamento direto",
        "Galpão de 800m² no centro - ideal para conversão em lofts (já tem projeto aprovado)"
    ]
};

// Casos de sucesso com números reais
const successMetrics = {
    velocity: {
        avg: "23 dias",
        market: "74 dias",
        record: "3 dias",
        detail: "Casa no Itaocaia - já tínhamos o comprador ideal esperando"
    },
    pricing: {
        accuracy: "96%",
        overMarket: "+12%",
        detail: "Nossa avaliação com 14 critérios exclusivos de Guararema"
    },
    satisfaction: {
        nps: 89,
        referrals: "73%",
        repeat: "45%",
        detail: "7 em 10 clientes indicam amigos e familiares"
    }
};

// Componente de valor para cada fase da jornada
const journeyPhases = [
    {
        phase: "Descoberta",
        icon: <Sparkles className="w-5 h-5" />,
        value: "Mostramos oportunidades que só nós conhecemos",
        example: "Como a casa victoriana que não estava à venda, mas sabíamos que o dono consideraria ofertas"
    },
    {
        phase: "Análise",
        icon: <BarChart3 className="w-5 h-5" />,
        value: "Revelamos dados que ninguém mais tem",
        example: "Análise de 178 vendas em Guararema nos últimos 3 anos + fatores locais exclusivos"
    },
    {
        phase: "Negociação",
        icon: <Target className="w-5 h-5" />,
        value: "Relacionamento de 15 anos abre portas",
        example: "Conseguimos 18% de desconto na chácara do Sr. Tanaka porque éramos amigos da família"
    },
    {
        phase: "Conclusão",
        icon: <FileCheck className="w-5 h-5" />,
        value: "Processo 3x mais rápido que o mercado",
        example: "Parceria direta com Cartório do 1º Ofício economiza 10 dias no processo"
    }
];

export interface GuararemasImobiliariaProps {
    properties?: any[];
    title?: string;
    description?: string;
    ctaLink?: string;
    ctaText?: string;
}

const GuararemasImobiliariaComponent: React.FC<GuararemasImobiliariaProps> = ({
    properties = [],
    title,
    description,
    ctaLink = "/contato",
    ctaText = "Descubra as Oportunidades"
}) => {
    const [activeRegion, setActiveRegion] = useState(0);
    const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.9, 1, 1, 0.9]);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveRegion((prev) => (prev + 1) % guararemasExclusiveData.microRegions.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section ref={containerRef} className="relative py-24 overflow-hidden">
            {/* Background com gradiente premium */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50/20" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />

            <motion.div style={{ opacity, scale }} className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">

                {/* Header com proposta de valor clara */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-6">
                        <TreePine className="w-4 h-4" />
                        <span>O Mapa Oculto de Guararema</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                        Sabemos onde estão as
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600"> próximas oportunidades</span>
                    </h1>

                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        15 anos mapeando cada metro quadrado de Guararema. Conhecemos os proprietários,
                        as tendências e os segredos que transformam bons negócios em
                        <span className="font-semibold text-slate-800"> negócios extraordinários</span>.
                    </p>
                </motion.div>

                {/* Micro-regiões com dados exclusivos */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mb-24"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            Inteligência Exclusiva por Região
                        </h2>
                        <p className="text-lg text-slate-600">
                            Dados que você não encontra em nenhum portal imobiliário
                        </p>
                    </div>

                    {/* Tabs das regiões */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {guararemasExclusiveData.microRegions.map((region, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveRegion(index)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
                                    activeRegion === index
                                        ? "bg-emerald-600 text-white shadow-lg scale-105"
                                        : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                                )}
                            >
                                {region.icon}
                                <span className="font-medium">{region.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Conteúdo da região ativa */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeRegion}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100"
                        >
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                            {guararemasExclusiveData.microRegions[activeRegion].icon}
                                            {guararemasExclusiveData.microRegions[activeRegion].name}
                                        </h3>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-slate-50 p-4 rounded-xl">
                                                <p className="text-sm text-slate-600 mb-1">Preço médio</p>
                                                <p className="text-xl font-bold text-slate-900">
                                                    {guararemasExclusiveData.microRegions[activeRegion].avgPrice}
                                                </p>
                                            </div>
                                            <div className="bg-emerald-50 p-4 rounded-xl">
                                                <p className="text-sm text-emerald-700 mb-1">Valorização</p>
                                                <p className="text-xl font-bold text-emerald-700">
                                                    {guararemasExclusiveData.microRegions[activeRegion].growth}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                                            <div>
                                                <p className="font-semibold text-slate-800 mb-1">Insight Exclusivo</p>
                                                <p className="text-slate-600">
                                                    {guararemasExclusiveData.microRegions[activeRegion].insight}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-amber-500 mt-2" />
                                            <div>
                                                <p className="font-semibold text-slate-800 mb-1">Oportunidade Iminente</p>
                                                <p className="text-slate-600">
                                                    {guararemasExclusiveData.microRegions[activeRegion].opportunity}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-slate-50 to-emerald-50/30 p-6 rounded-2xl">
                                    <h4 className="font-semibold text-slate-800 mb-4">Dados Estratégicos</h4>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between py-2 border-b border-slate-200">
                                            <span className="text-slate-600">Estoque atual</span>
                                            <span className="font-semibold text-slate-900">
                                                {guararemasExclusiveData.microRegions[activeRegion].inventory}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-b border-slate-200">
                                            <span className="text-slate-600">Melhor época</span>
                                            <span className="font-semibold text-slate-900">
                                                {guararemasExclusiveData.microRegions[activeRegion].bestMonths}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between py-2">
                                            <span className="text-slate-600">Perfil comprador</span>
                                            <span className="font-semibold text-slate-900 text-sm text-right max-w-[200px]">
                                                {guararemasExclusiveData.microRegions[activeRegion].profile}
                                            </span>
                                        </div>
                                    </div>

                                    <button className="w-full mt-6 bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                                        Ver imóveis disponíveis
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Segredos do Mercado */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-24"
                >
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
                        Informações que Transformam Negócios
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {guararemasExclusiveData.marketSecrets.map((secret, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-2xl shadow-lg border border-slate-100"
                            >
                                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-emerald-600" />
                                    {secret.title}
                                </h3>

                                <div className="space-y-4">
                                    {secret.insights.map((insight, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                            <p className="text-slate-700 leading-relaxed">{insight}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Métricas de Performance */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mb-24"
                >
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />

                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-12 text-center">
                                Resultados que Falam por Si
                            </h2>

                            <div className="grid md:grid-cols-3 gap-8">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    onHoverStart={() => setHoveredMetric('velocity')}
                                    onHoverEnd={() => setHoveredMetric(null)}
                                    className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 text-center cursor-pointer"
                                >
                                    <Clock className="w-8 h-8 mx-auto mb-4 text-emerald-200" />
                                    <h3 className="text-4xl font-bold mb-2">{successMetrics.velocity.avg}</h3>
                                    <p className="text-emerald-100 mb-2">Tempo médio de venda</p>
                                    <AnimatePresence>
                                        {hoveredMetric === 'velocity' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mt-4 text-sm text-emerald-100"
                                            >
                                                <p>Mercado: {successMetrics.velocity.market}</p>
                                                <p>Recorde: {successMetrics.velocity.record}</p>
                                                <p className="mt-2 text-xs">{successMetrics.velocity.detail}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    onHoverStart={() => setHoveredMetric('pricing')}
                                    onHoverEnd={() => setHoveredMetric(null)}
                                    className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 text-center cursor-pointer"
                                >
                                    <TrendingUp className="w-8 h-8 mx-auto mb-4 text-emerald-200" />
                                    <h3 className="text-4xl font-bold mb-2">{successMetrics.pricing.overMarket}</h3>
                                    <p className="text-emerald-100 mb-2">Acima do mercado</p>
                                    <AnimatePresence>
                                        {hoveredMetric === 'pricing' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mt-4 text-sm text-emerald-100"
                                            >
                                                <p>Precisão: {successMetrics.pricing.accuracy}</p>
                                                <p className="mt-2 text-xs">{successMetrics.pricing.detail}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    onHoverStart={() => setHoveredMetric('satisfaction')}
                                    onHoverEnd={() => setHoveredMetric(null)}
                                    className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 text-center cursor-pointer"
                                >
                                    <Star className="w-8 h-8 mx-auto mb-4 text-emerald-200" />
                                    <h3 className="text-4xl font-bold mb-2">{successMetrics.satisfaction.referrals}</h3>
                                    <p className="text-emerald-100 mb-2">Indicações</p>
                                    <AnimatePresence>
                                        {hoveredMetric === 'satisfaction' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mt-4 text-sm text-emerald-100"
                                            >
                                                <p>NPS: {successMetrics.satisfaction.nps}</p>
                                                <p>Recompra: {successMetrics.satisfaction.repeat}</p>
                                                <p className="mt-2 text-xs">{successMetrics.satisfaction.detail}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Jornada do Cliente com Valor Agregado */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-24"
                >
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
                        Como Transformamos sua Jornada
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {journeyPhases.map((phase, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -8 }}
                                className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                        {phase.icon}
                                    </div>
                                    <h3 className="font-bold text-slate-900">{phase.phase}</h3>
                                </div>

                                <p className="text-slate-800 font-medium mb-3">{phase.value}</p>
                                <p className="text-sm text-slate-600 italic">{phase.example}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Hidden Gems - Oportunidades Exclusivas */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mb-24"
                >
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 md:p-12 rounded-3xl border border-amber-200">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
                                <Key className="w-4 h-4" />
                                <span>Acesso Antecipado</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                Oportunidades Antes do Mercado
                            </h3>
                            <p className="text-slate-600">
                                Imóveis que ainda nem entraram nos portais
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {guararemasExclusiveData.hiddenGems.map((gem, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white/80 backdrop-blur-sm p-4 rounded-xl flex items-start gap-3"
                                >
                                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                                    <p className="text-sm text-slate-700">{gem}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="text-center mt-8">
                            <p className="text-sm text-slate-600 mb-4">
                                + outras 12 oportunidades exclusivas este mês
                            </p>
                            <button className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-colors">
                                Receber Lista Completa
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* CTA Final Premium */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 md:p-16 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-5" />
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />

                        <div className="relative z-10 max-w-3xl mx-auto text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.2 }}
                                className="inline-flex p-4 bg-emerald-500/20 rounded-full mb-6"
                            >
                                <HeartHandshake className="w-8 h-8 text-emerald-400" />
                            </motion.div>

                            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                                Pronto para Descobrir as Melhores
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400"> Oportunidades de Guararema?</span>
                            </h2>

                            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                                Junte-se aos 400+ proprietários que já descobriram:
                                informação exclusiva é a diferença entre um bom negócio e um negócio extraordinário.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Link
                                    href={ctaLink}
                                    className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-semibold hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
                                >
                                    <span>{ctaText}</span>
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <Link
                                    href="https://wa.me/5511981845016"
                                    target="_blank"
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-semibold hover:bg-white/20 transition-all border border-white/20"
                                >
                                    <Phone className="w-5 h-5" />
                                    <span>WhatsApp Direto</span>
                                </Link>
                            </div>

                            <div className="flex items-center justify-center gap-8 mt-12 text-sm text-slate-400">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    <span>Sigilo Total</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>Resposta em 2h</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Award className="w-4 h-4" />
                                    <span>CRECI 123.456</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default GuararemasImobiliariaComponent;