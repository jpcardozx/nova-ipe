'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, TrendingUp, Clock, Target, BarChart3, Eye, ChevronRight, Shield, LucideIcon } from 'lucide-react';

// Type definitions
interface RegionMetrics {
    price: number;
    growth: number;
    velocity: number;
    inventory: number;
}

interface Region {
    id: string;
    name: string;
    metrics: RegionMetrics;
    insight: string;
}

interface MetricCardProps {
    label: string;
    value: string | number;
    comparison: string;
    icon: LucideIcon;
    delay?: number;
}

interface RegionSelectorProps {
    regions: Region[];
    active: number;
    onChange: (index: number) => void;
}

// Consolidated market intelligence with strategic data architecture
const marketData = {
    regions: [
        {
            id: 'centro',
            name: 'Centro Histórico',
            metrics: { price: 2800, growth: 15.2, velocity: 18, inventory: 12 },
            insight: 'Patrimônio histórico com liquidez premium. Últimas transações 22% acima da região.'
        },
        {
            id: 'freguesias',
            name: 'Freguesia/Nogueira',
            metrics: { price: 1950, growth: 22.1, velocity: 25, inventory: 28 },
            insight: 'Conectividade ferroviária impulsiona demanda residencial de alto padrão.'
        },
        {
            id: 'rural',
            name: 'Zona Rural Premium',
            metrics: { price: 450, growth: 18.7, velocity: 35, inventory: 8 },
            insight: 'Chácaras com recursos hídricos apresentam valorização 40% superior.'
        }
    ],
    performance: {
        velocity: { value: 23, benchmark: 74, unit: 'dias' },
        precision: { value: 94.2, benchmark: 67.8, unit: '%' },
        premium: { value: 18.3, benchmark: 0, unit: '%' }
    }
};

// Advanced UI state management
const useMarketIntelligence = () => {
    const [activeRegion, setActiveRegion] = useState(0);
    const [viewportIntersection, setViewportIntersection] = useState(false);
    const observerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setViewportIntersection(entry.isIntersecting),
            { threshold: 0.2, rootMargin: '-50px' }
        );

        if (observerRef.current) observer.observe(observerRef.current);

        const rotationTimer = setInterval(() => {
            setActiveRegion(prev => (prev + 1) % marketData.regions.length);
        }, 6000);

        return () => {
            observer.disconnect();
            clearInterval(rotationTimer);
        };
    }, []);

    return { activeRegion, setActiveRegion, viewportIntersection, observerRef };
};

// Professional metric component with advanced styling
const MetricCard: React.FC<MetricCardProps> = ({ label, value, comparison, icon: Icon, delay = 0 }) => (
    <div
        className="group relative overflow-hidden"
        style={{ animationDelay: `${delay}ms` }}
    >
        {/* Layered background system */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute inset-0 border border-amber-200/60 group-hover:border-amber-300/80 transition-colors duration-500" />

        {/* Content layer */}
        <div className="relative z-10 p-8 h-full">
            <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200/50 group-hover:shadow-lg group-hover:shadow-amber-500/20 transition-all duration-500">
                    <Icon className="w-6 h-6 text-amber-700" />
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
                    <div className="text-sm text-amber-700 font-medium">{comparison}</div>
                </div>
            </div>

            <div className="border-t border-slate-200/60 pt-4">
                <p className="text-slate-700 font-medium leading-tight">{label}</p>
            </div>
        </div>
    </div>
);

// Sophisticated region selector with professional interactions
const RegionSelector: React.FC<RegionSelectorProps> = ({ regions, active, onChange }) => (
    <div className="flex gap-1 p-1 bg-slate-100/80 backdrop-blur-sm border border-slate-200/60">
        {regions.map((region: Region, index: number) => (
            <button
                key={region.id}
                onClick={() => onChange(index)}
                className={`
          relative px-6 py-3 font-medium text-sm transition-all duration-300
          ${active === index
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }
        `}
            >
                <span className="relative z-10">{region.name}</span>
                {active === index && (
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-amber-600/20 blur-sm" />
                )}
            </button>
        ))}
    </div>
);

// Main component with enterprise-grade architecture
function ValorAprimorado() {
    const { activeRegion, setActiveRegion, viewportIntersection, observerRef } = useMarketIntelligence();
    const currentRegion = marketData.regions[activeRegion];

    return (
        <section
            ref={observerRef}
            className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 overflow-hidden"
        >
            {/* Advanced background architecture */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.1),transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(120,53,15,0.05),transparent_60%)]" />
                <svg className="absolute inset-0 w-full h-full opacity-[0.015]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="professional-grid" width="80" height="80" patternUnits="userSpaceOnUse">
                            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="1" />
                            <circle cx="40" cy="40" r="1" fill="currentColor" opacity="0.3" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#professional-grid)" />
                </svg>
            </div>

            <div className={`
        relative z-10 container mx-auto px-6 py-32 max-w-7xl
        transition-all duration-1000 ease-out
        ${viewportIntersection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
      `}>

                {/* Strategic header with professional hierarchy */}
                <header className="max-w-4xl mx-auto text-center mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-amber-50 border border-amber-200/60 text-amber-800 text-sm font-semibold mb-8">
                        <MapPin className="w-4 h-4" />
                        INTELIGÊNCIA DE MERCADO GUARAREMA
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-[0.85] tracking-tight">
                        Dados que definem
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700">
                            oportunidades reais
                        </span>
                    </h1>

                    <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        Quinze anos de mercado consolidados em análises preditivas e
                        <strong className="text-slate-900"> inteligência proprietária de precificação</strong>.
                    </p>
                </header>

                {/* Performance metrics with sophisticated design */}
                <section className="grid md:grid-cols-3 gap-6 mb-24">
                    <MetricCard
                        label="Velocidade média de comercialização"
                        value={`${marketData.performance.velocity.value} dias`}
                        comparison={`${marketData.performance.velocity.benchmark - marketData.performance.velocity.value} dias menor que mercado`}
                        icon={Clock}
                        delay={0}
                    />
                    <MetricCard
                        label="Precisão de avaliação patrimonial"
                        value={`${marketData.performance.precision.value}%`}
                        comparison={`+${(marketData.performance.precision.value - marketData.performance.precision.benchmark).toFixed(1)}% vs concorrência`}
                        icon={Target}
                        delay={150}
                    />
                    <MetricCard
                        label="Valorização média obtida"
                        value={`+${marketData.performance.premium.value}%`}
                        comparison="acima do valor inicial"
                        icon={TrendingUp}
                        delay={300}
                    />
                </section>

                {/* Market intelligence interface */}
                <section className="mb-24">
                    <div className="bg-white/70 backdrop-blur-xl border border-slate-200/60 shadow-2xl shadow-slate-900/5 overflow-hidden">
                        <div className="p-12">
                            <header className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                                    Análise Territorial Estratégica
                                </h2>
                                <p className="text-slate-600 max-w-2xl mx-auto">
                                    Segmentação micro-regional com dados de performance e tendências
                                </p>
                            </header>

                            <div className="mb-12 flex justify-center">
                                <RegionSelector
                                    regions={marketData.regions}
                                    active={activeRegion}
                                    onChange={setActiveRegion}
                                />
                            </div>

                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-8">
                                            {currentRegion.name}
                                        </h3>

                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 p-6 border border-slate-200/60">
                                                <div className="text-2xl font-bold text-slate-900 mb-1">
                                                    R$ {currentRegion.metrics.price.toLocaleString()}/m²
                                                </div>
                                                <div className="text-sm text-slate-600">Preço médio</div>
                                            </div>
                                            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-6 border border-amber-200/60">
                                                <div className="text-2xl font-bold text-amber-700 mb-1">
                                                    +{currentRegion.metrics.growth}%
                                                </div>
                                                <div className="text-sm text-amber-700">Valorização anual</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
                                        <div className="relative z-10">
                                            <div className="flex items-start gap-3 mb-4">
                                                <Shield className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-semibold mb-2">Análise Estratégica</h4>
                                                    <p className="text-slate-300 leading-relaxed text-sm">
                                                        {currentRegion.insight}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Advanced data visualization */}
                                <div className="relative">
                                    <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-12 text-white relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />

                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-8">
                                                <BarChart3 className="w-8 h-8" />
                                                <div>
                                                    <h4 className="text-xl font-bold">Performance Comparativa</h4>
                                                    <p className="text-amber-100 text-sm">Últimos 12 meses</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="bg-white/15 backdrop-blur-sm p-4 border border-white/20">
                                                    <div className="text-2xl font-bold mb-1">{currentRegion.metrics.velocity}</div>
                                                    <div className="text-amber-100 text-sm">Dias médios venda</div>
                                                </div>
                                                <div className="bg-white/15 backdrop-blur-sm p-4 border border-white/20">
                                                    <div className="text-2xl font-bold mb-1">{currentRegion.metrics.inventory}</div>
                                                    <div className="text-amber-100 text-sm">Oportunidades ativas</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Value proposition with professional messaging */}
                <section className="max-w-4xl mx-auto text-center mb-24">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12">
                        Diferencial Competitivo Estrutural
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Eye,
                                title: 'Acesso Antecipado',
                                description: 'Pipeline exclusivo pré-mercado com propriedades qualificadas'
                            },
                            {
                                icon: Target,
                                title: 'Avaliação Técnica',
                                description: 'Metodologia proprietária com variáveis de análise local'
                            },
                            {
                                icon: TrendingUp,
                                title: 'Network Qualificado',
                                description: 'Base ativa de 400+ investidores com perfis segmentados'
                            }
                        ].map(({ icon: Icon, title, description }, index) => (
                            <div key={index} className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative p-8">
                                    <div className="inline-flex p-4 bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200/60 mb-6 group-hover:shadow-lg group-hover:shadow-amber-500/20 transition-all duration-500">
                                        <Icon className="w-8 h-8 text-amber-700" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4">{title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Professional CTA with sophisticated design */}
                <section className="relative">
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 via-transparent to-amber-600/10" />
                        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-700/5 rounded-full blur-3xl" />

                        <div className="relative z-10 p-16 text-center text-white">
                            <h2 className="text-4xl font-bold mb-8 max-w-3xl mx-auto leading-tight">
                                Acesse Inteligência de Mercado Proprietária
                            </h2>

                            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                                Análises exclusivas e oportunidades qualificadas para
                                decisões patrimoniais estratégicas.
                            </p>

                            <button className="group inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-amber-500 to-amber-600 font-semibold text-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/30">
                                Solicitar Análise Personalizada
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <div className="flex items-center justify-center mt-12 text-sm text-slate-400 gap-8">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    Confidencialidade Garantida
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />                        Resposta em 2h Úteis
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </section>);
}

export default ValorAprimorado;