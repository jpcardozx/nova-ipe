'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
    MapPin,
    Phone,
    Clock,
    ChevronRight,
    TrendingUp,
    Award,
    Shield,
    Star,
    HeartHandshake,
    Building2,
    Users,
    TreePine,
    Coffee,
    Train,
    Key,
    Sparkles,
    Target,
    BarChart3,
    CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Dados simplificados e mais envolventes
const marketInsights = {
    quickFacts: [
        {
            title: "Centro Histórico",
            icon: <Coffee className="w-5 h-5" />,
            insight: "Casarões do século XIX estão sendo restaurados. Última venda: R$ 680.000 (Casa dos Azulejos)",
            opportunity: "3 proprietários considerando venda até dezembro"
        },
        {
            title: "Nogueira / Estação",
            icon: <Train className="w-5 h-5" />,
            insight: "Nova ciclovia aumentou procura em 40%. Loteamento Solar dos Lagos esgotou em 6 meses",
            opportunity: "45 casas novas serão lançadas em agosto"
        },
        {
            title: "Chácaras Premium",
            icon: <TreePine className="w-5 h-5" />,
            insight: "Propriedades com nascente valem 35% mais. Executivos buscam casa de fim de semana",
            opportunity: "2 chácaras de 5.000m² entrarão no mercado"
        }
    ],

    marketSecrets: [
        "Festival de Inverno (julho): Vendas crescem 45% - melhor época para lançamentos",
        "Volta às aulas Salesiana: Famílias procuram casas - oportunidade de venda",
        "Temporada de chuvas: Chácaras com desconto de até 25% aparecem no mercado"
    ],

    valueProposition: [
        {
            title: "Conhecimento Local",
            description: "15 anos mapeando cada oportunidade em Guararema",
            icon: <MapPin className="w-6 h-6" />
        },
        {
            title: "Rede de Relacionamentos",
            description: "Acesso a imóveis antes mesmo de serem anunciados",
            icon: <Users className="w-6 h-6" />
        },
        {
            title: "Processo Transparente",
            description: "Acompanhamento em cada etapa com total clareza",
            icon: <Shield className="w-6 h-6" />
        }
    ]
};

const successStats = {
    timeToSell: "32 dias",
    marketAverage: "75 dias",
    satisfactionRate: "96%",
    referralRate: "68%"
};

export interface ValorAprimoradoProps {
    title?: string;
    description?: string;
    ctaLink?: string;
    ctaText?: string;
}

const ValorAprimoradoImproved: React.FC<ValorAprimoradoProps> = ({
    title = "O que sabemos sobre Guararema",
    description = "Informações exclusivas que fazem a diferença nos seus negócios",
    ctaLink = "/contato",
    ctaText = "Quero saber mais"
}) => {
    const [activeInsight, setActiveInsight] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveInsight((prev) => (prev + 1) % marketInsights.quickFacts.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section ref={containerRef} className="relative py-20 bg-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-amber-50/20" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />

            <motion.div style={{ opacity }} className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-medium mb-6">
                        <TreePine className="w-4 h-4" />
                        <span>Insights Exclusivos</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        {title}
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        {description}
                    </p>
                </motion.div>

                {/* Market Insights Rotativo */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">
                            Intel de Mercado
                        </h3>
                        <p className="text-slate-600">
                            Dados que você não encontra em portais imobiliários
                        </p>
                    </div>

                    {/* Navegação dos insights */}
                    <div className="flex justify-center gap-2 mb-8">
                        {marketInsights.quickFacts.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveInsight(index)}
                                className={cn(
                                    "px-4 py-2 rounded-full transition-all duration-300",
                                    activeInsight === index
                                        ? "bg-amber-500 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                )}
                            >
                                {marketInsights.quickFacts[index].icon}
                            </button>
                        ))}
                    </div>

                    {/* Conteúdo do insight ativo */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeInsight}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto border border-slate-100"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                    {marketInsights.quickFacts[activeInsight].icon}
                                </div>
                                <h4 className="text-xl font-bold text-slate-900">
                                    {marketInsights.quickFacts[activeInsight].title}
                                </h4>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h5 className="font-semibold text-slate-800 mb-2">Insight Exclusivo</h5>
                                    <p className="text-slate-600 leading-relaxed">
                                        {marketInsights.quickFacts[activeInsight].insight}
                                    </p>
                                </div>
                                <div>
                                    <h5 className="font-semibold text-slate-800 mb-2">Oportunidade</h5>
                                    <p className="text-slate-600 leading-relaxed">
                                        {marketInsights.quickFacts[activeInsight].opportunity}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Calendário do Mercado */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <div className="bg-gradient-to-br from-slate-50 to-amber-50 rounded-2xl p-8">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-amber-600" />
                            O Calendário Oculto de Guararema
                        </h3>

                        <div className="space-y-3">
                            {marketInsights.marketSecrets.map((secret, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                                    <p className="text-slate-700 leading-relaxed">{secret}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Nossa Vantagem */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h3 className="text-2xl font-bold text-slate-900 text-center mb-8">
                        Por que escolher a Nova Ipê?
                    </h3>

                    <div className="grid md:grid-cols-3 gap-8">
                        {marketInsights.valueProposition.map((prop, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -5 }}
                                className="text-center bg-white p-6 rounded-xl shadow-sm border border-slate-100"
                            >
                                <div className="flex justify-center mb-4 text-amber-600">
                                    {prop.icon}
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2">{prop.title}</h4>
                                <p className="text-slate-600 text-sm leading-relaxed">{prop.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Resultados */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-8 text-center">
                            Resultados que Impressionam
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                            <div>
                                <div className="text-3xl font-bold mb-1">{successStats.timeToSell}</div>
                                <div className="text-amber-100 text-sm">Tempo médio de venda</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold mb-1">{successStats.marketAverage}</div>
                                <div className="text-amber-100 text-sm">Média do mercado</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold mb-1">{successStats.satisfactionRate}</div>
                                <div className="text-amber-100 text-sm">Satisfação</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold mb-1">{successStats.referralRate}</div>
                                <div className="text-amber-100 text-sm">Indicações</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* CTA Final */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />

                        <div className="relative z-10 max-w-2xl mx-auto">
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.2 }}
                                className="inline-flex p-4 bg-amber-500/20 rounded-full mb-6"
                            >
                                <HeartHandshake className="w-8 h-8 text-amber-400" />
                            </motion.div>

                            <h3 className="text-2xl md:text-3xl font-bold mb-4">
                                Pronto para descobrir as melhores oportunidades?
                            </h3>

                            <p className="text-lg text-slate-300 mb-8">
                                Junte-se aos 1.200+ proprietários que já descobriram:
                                informação exclusiva faz toda a diferença.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href={ctaLink}
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                                >
                                    <span>{ctaText}</span>
                                    <ChevronRight className="w-5 h-5" />
                                </Link>

                                <Link
                                    href="https://wa.me/5511981845016"
                                    target="_blank"
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
                                >
                                    <Phone className="w-5 h-5" />
                                    <span>WhatsApp</span>
                                </Link>
                            </div>

                            <div className="flex items-center justify-center gap-8 mt-8 text-sm text-slate-400">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    <span>Consulta gratuita</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>Resposta em 2h</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Award className="w-4 h-4" />
                                    <span>CRECI ativo</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default ValorAprimoradoImproved;
