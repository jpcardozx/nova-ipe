'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedIcons } from '@/app/utils/optimized-icons';
import { cn } from '@/lib/utils';

// Hook para animação de números quando visível com otimização de performance
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

interface DifferentialCard {
    id: string;
    icon: keyof typeof OptimizedIcons;
    title: string;
    description: string;
    highlights: string[];
    color: 'amber' | 'emerald' | 'blue' | 'purple';
}

interface MarketInsight {
    id: string;
    metric: number;
    unit: string;
    context: string;
    trend: 'up' | 'down' | 'stable';
}

const ValorUnified: React.FC<{ className?: string }> = ({ className = '' }) => {
    const [activeCard, setActiveCard] = useState<string | null>(null);
    const [selectedInsight, setSelectedInsight] = useState(0);

    // Contadores animados
    const [experienceRef, experienceCount] = useCountUp(15, 1500);
    const [clientsRef, clientsCount] = useCountUp(850, 2000);
    const [satisfactionRef, satisfactionCount] = useCountUp(98, 1800);

    // Insights de mercado
    const marketInsights: MarketInsight[] = [
        {
            id: 'growth',
            metric: 47,
            unit: '% crescimento',
            context: 'nas buscas por imóveis em Guararema',
            trend: 'up'
        },
        {
            id: 'time',
            metric: 34,
            unit: 'dias médios',
            context: 'para venda de imóveis com a Nova Ipê',
            trend: 'down'
        },
        {
            id: 'value',
            metric: 850,
            unit: 'reais/m²',
            context: 'valorização média nos últimos 2 anos',
            trend: 'up'
        }
    ];

    // Diferenciais competitivos
    const differentials: DifferentialCard[] = [
        {
            id: 'experience',
            icon: 'Award',
            title: 'Experiência Comprovada',
            description: 'Mais de 15 anos de atuação exclusiva no mercado de Guararema e região',
            highlights: [
                'Especialistas locais com conhecimento profundo',
                'Rede de contatos consolidada',
                'Mais de 850 famílias atendidas'
            ],
            color: 'amber'
        },
        {
            id: 'technology',
            icon: 'Building2',
            title: 'Abordagem Premium',
            description: 'Tecnologia avançada e atendimento personalizado para resultados superiores',
            highlights: [
                'Avaliação precisa com inteligência de mercado',
                'Marketing digital estratégico',
                'Acompanhamento em tempo real'
            ],
            color: 'blue'
        },
        {
            id: 'results',
            icon: 'AreaChart',
            title: 'Resultados Excepcionais',
            description: 'Histórico comprovado de vendas rápidas e valores otimizados',
            highlights: [
                '98% de satisfação dos clientes',
                '34 dias médios para venda',
                'Preços 15% acima da média local'
            ],
            color: 'emerald'
        }, {
            id: 'support',
            icon: 'UserCheck',
            title: 'Suporte Completo',
            description: 'Acompanhamento total desde a avaliação até a entrega das chaves',
            highlights: [
                'Documentação verificada e segura',
                'Assessoria jurídica especializada',
                'Pós-venda com garantias'
            ],
            color: 'purple' as const
        }
    ];

    const colorClasses = {
        amber: {
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            text: 'text-amber-800',
            icon: 'text-amber-600',
            button: 'bg-amber-500 hover:bg-amber-600'
        },
        emerald: {
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            text: 'text-emerald-800',
            icon: 'text-emerald-600',
            button: 'bg-emerald-500 hover:bg-emerald-600'
        },
        blue: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-800',
            icon: 'text-blue-600',
            button: 'bg-blue-500 hover:bg-blue-600'
        },
        purple: {
            bg: 'bg-purple-50',
            border: 'border-purple-200',
            text: 'text-purple-800',
            icon: 'text-purple-600',
            button: 'bg-purple-500 hover:bg-purple-600'
        }
    }; return (
        <section className={cn("py-24 bg-gradient-to-b from-white via-neutral-50/50 to-white relative overflow-hidden", className)}>
            {/* Background Decorativo */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 max-w-7xl relative">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 rounded-full text-amber-800 font-semibold mb-8">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        >
                            <OptimizedIcons.Star className="w-5 h-5" />
                        </motion.div>
                        <span>Por que escolher a Nova Ipê</span>
                    </div>                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
                        <span className="block text-2xl md:text-3xl lg:text-4xl font-semibold text-amber-600 mb-2">
                            Descubra o valor do seu imóvel
                        </span>
                        Por que agora é
                        <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                            diferente
                        </span>
                    </h2>                    <p className="text-lg md:text-xl text-neutral-600 leading-relaxed max-w-4xl mx-auto mb-8">
                        O mercado imobiliário de Guararema vive um momento único de crescimento e valorização.
                        <span className="block mt-2 font-semibold text-amber-600">
                            Nossa experiência e abordagem premium garantem os melhores resultados.
                        </span>
                    </p>

                    {/* CTA Principal */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                        >
                            <OptimizedIcons.AreaChart className="w-5 h-5" />
                            Avalie seu imóvel gratuitamente
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 border-2 border-amber-300 text-amber-700 font-semibold rounded-full hover:bg-amber-50 transition-all duration-300 flex items-center gap-3"
                        >
                            <OptimizedIcons.Phone className="w-5 h-5" />
                            Falar com especialista
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Métricas de Mercado */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {marketInsights.map((insight, index) => (
                        <motion.div
                            key={insight.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className={cn(
                                "relative p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
                                selectedInsight === index
                                    ? "border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg scale-105"
                                    : "border-neutral-200 bg-white hover:border-amber-200 hover:shadow-md"
                            )}
                            onClick={() => setSelectedInsight(index)}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn(
                                    "text-4xl font-bold",
                                    insight.trend === 'up' ? 'text-emerald-600' :
                                        insight.trend === 'down' ? 'text-blue-600' : 'text-neutral-700'
                                )}>
                                    {insight.trend === 'up' && '+'}
                                    {insight.metric}
                                </div>
                                <OptimizedIcons.AreaChart className={cn(
                                    "w-6 h-6",
                                    insight.trend === 'up' ? 'text-emerald-500' :
                                        insight.trend === 'down' ? 'text-blue-500' : 'text-neutral-500'
                                )} />
                            </div>
                            <div className="text-sm font-medium text-neutral-700 mb-2">
                                {insight.unit}
                            </div>
                            <div className="text-sm text-neutral-600">
                                {insight.context}
                            </div>

                            {selectedInsight === index && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-4 pt-4 border-t border-amber-200"
                                >
                                    <p className="text-sm text-amber-800 font-medium">
                                        Dado atualizado com base no mercado local dos últimos 12 meses
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>                {/* Estatísticas da Empresa */}
                <div className="relative mb-20">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-100/40 via-orange-100/40 to-amber-100/40 rounded-3xl -rotate-1" />
                    <div className="relative bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30 border border-amber-200/50 rounded-3xl p-12 shadow-xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                            <div ref={experienceRef}>
                                <div className="text-5xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent mb-2">
                                    {experienceCount}+
                                </div>
                                <div className="text-xl font-medium mb-2 text-neutral-800">Anos de Experiência</div>
                                <div className="text-neutral-600">
                                    Atuação exclusiva em Guararema
                                </div>
                            </div>

                            <div ref={clientsRef}>
                                <div className="text-5xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent mb-2">
                                    {clientsCount}+
                                </div>
                                <div className="text-xl font-medium mb-2 text-neutral-800">Famílias Atendidas</div>
                                <div className="text-neutral-600">
                                    Realizando sonhos desde 2009
                                </div>
                            </div>

                            <div ref={satisfactionRef}>
                                <div className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent mb-2">
                                    {satisfactionCount}%
                                </div>
                                <div className="text-xl font-medium mb-2 text-neutral-800">Satisfação</div>
                                <div className="text-neutral-600">
                                    Clientes recomendam nossos serviços
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Diferenciais Competitivos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {differentials.map((differential, index) => {
                        const IconComponent = OptimizedIcons[differential.icon];
                        const colors = colorClasses[differential.color];
                        const isActive = activeCard === differential.id;

                        return (
                            <motion.div
                                key={differential.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={cn(
                                    "relative p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
                                    isActive
                                        ? `${colors.border} ${colors.bg} shadow-xl scale-105`
                                        : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-lg"
                                )}
                                onMouseEnter={() => setActiveCard(differential.id)}
                                onMouseLeave={() => setActiveCard(null)}
                            >
                                {/* Ícone */}
                                <div className={cn(
                                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300",
                                    isActive ? colors.bg : 'bg-neutral-100'
                                )}>
                                    <IconComponent className={cn(
                                        "w-8 h-8 transition-colors duration-300",
                                        isActive ? colors.icon : 'text-neutral-600'
                                    )} />
                                </div>

                                {/* Conteúdo */}
                                <h3 className={cn(
                                    "text-2xl font-bold mb-4 transition-colors duration-300",
                                    isActive ? colors.text : 'text-neutral-900'
                                )}>
                                    {differential.title}
                                </h3>

                                <p className={cn(
                                    "text-neutral-600 mb-6 leading-relaxed",
                                    isActive && 'text-neutral-700'
                                )}>
                                    {differential.description}
                                </p>

                                {/* Highlights */}
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-3"
                                        >
                                            {differential.highlights.map((highlight, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="flex items-center gap-3"
                                                >
                                                    <div className={cn(
                                                        "w-2 h-2 rounded-full",
                                                        colors.button.replace('bg-', 'bg-').replace(' hover:bg-amber-600', '').replace(' hover:bg-emerald-600', '').replace(' hover:bg-blue-600', '').replace(' hover:bg-purple-600', '')
                                                    )} />
                                                    <span className={cn(
                                                        "text-sm font-medium",
                                                        colors.text
                                                    )}>
                                                        {highlight}
                                                    </span>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>                {/* Call to Action Enhanced */}
                <div className="text-center mt-20">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 border border-amber-200 rounded-3xl p-12 shadow-xl"
                        >
                            <h3 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                                Descubra o valor real do seu imóvel
                                <span className="block text-xl md:text-2xl font-medium text-amber-600 mt-2">
                                    em apenas 24 horas
                                </span>
                            </h3>

                            <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
                                Receba uma avaliação gratuita e personalizada com base no mercado atual de Guararema.
                                <span className="block mt-2 font-semibold text-amber-700">
                                    ✓ Sem compromisso ✓ Totalmente gratuito ✓ Relatório detalhado
                                </span>
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 text-lg"
                                >
                                    <OptimizedIcons.AreaChart className="w-6 h-6" />
                                    Avalie seu imóvel gratuitamente
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 border-2 border-amber-300 text-amber-700 font-semibold rounded-full hover:bg-amber-50 transition-all duration-300 flex items-center gap-3 text-lg"
                                >
                                    <OptimizedIcons.Phone className="w-6 h-6" />
                                    (11) 4693-7702
                                </motion.button>
                            </div>

                            {/* Trust indicators */}
                            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-amber-700">
                                <div className="flex items-center gap-2">
                                    <OptimizedIcons.Shield className="w-4 h-4" />
                                    <span>CRECI SP 184.752</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <OptimizedIcons.Clock className="w-4 h-4" />
                                    <span>Resposta em 24h</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <OptimizedIcons.Star className="w-4 h-4" />
                                    <span>15+ anos Guararema</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ValorUnified;
