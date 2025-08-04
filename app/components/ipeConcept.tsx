'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
    MapPin,
    Clock,
    Star,
    CheckCircle2,
    ArrowRight,
    Users,
    Award,
    ShieldCheck,
    FileText,
    Phone,
    Calendar,
    Building2,
    Search,
    Scale,
    Eye,
    Target,
    Briefcase,
    Home,
    ChevronRight,
    ExternalLink
} from 'lucide-react';

interface UXOptimizedSectionProps {
    className?: string;
}

export default function UXOptimizedNovaIpeSection({ className }: UXOptimizedSectionProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [hoveredDifferential, setHoveredDifferential] = useState<number | null>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        // Auto-advance through steps
        const interval = setInterval(() => {
            setActiveStep(prev => (prev + 1) % 3);
        }, 4000);

        return () => {
            observer.disconnect();
            clearInterval(interval);
        };
    }, []);

    const processos = [
        {
            numero: "01",
            titulo: "Análise de Mercado",
            descricao: "Avaliamos seu imóvel baseado em dados históricos de vendas na região, características específicas e tendências atuais.",
            tempo: "2-3 dias úteis",
            icon: <Search className="w-5 h-5" />,
            details: ["Comparação com vendas recentes", "Análise de potencial de valorização", "Relatório de precificação"]
        },
        {
            numero: "02",
            titulo: "Estratégia de Venda",
            descricao: "Definimos preço competitivo, plano de marketing direcionado e cronograma realista para seu imóvel.",
            tempo: "1 semana",
            icon: <Target className="w-5 h-5" />,
            details: ["Plano de marketing personalizado", "Definição de público-alvo", "Cronograma de ações"]
        },
        {
            numero: "03",
            titulo: "Execução e Acompanhamento",
            descricao: "Coordenamos visitas qualificadas, negociações e toda documentação necessária até a conclusão.",
            tempo: "Até a conclusão",
            icon: <ShieldCheck className="w-5 h-5" />,
            details: ["Agendamento de visitas", "Suporte nas negociações", "Acompanhamento jurídico"]
        }
    ];

    const diferenciais = [
        {
            titulo: "Conhecimento Local Profundo",
            descricao: "15 anos mapeando Guararema. Conhecemos histórico de preços, características de cada bairro e tendências de valorização.",
            metric: "15 bairros mapeados",
            icon: <MapPin className="w-5 h-5" />
        },
        {
            titulo: "Rede Qualificada de Contatos",
            descricao: "Base consolidada de compradores pré-aprovados e parcerias com construtoras, facilitando transações mais rápidas.",
            metric: "300+ contatos ativos",
            icon: <Users className="w-5 h-5" />
        },
        {
            titulo: "Processos Documentais Seguros",
            descricao: "Verificação completa por advogado especializado. Checklist detalhado para eliminar riscos jurídicos.",
            metric: "0 problemas legais",
            icon: <FileText className="w-5 h-5" />
        },
        {
            titulo: "Transparência Total",
            descricao: "Relatórios semanais de atividades, feedback de visitas e comunicação clara sobre cada etapa do processo.",
            metric: "Relatórios semanais",
            icon: <Eye className="w-5 h-5" />
        }
    ];

    return (
        <section ref={sectionRef} className={`py-24 lg:py-32 bg-gradient-to-b from-white via-amber-50/20 to-white relative overflow-hidden ${className}`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.02]">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgb(251 191 36)" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                </svg>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-7xl mx-auto">

                    {/* Enhanced Header */}
                    <div className="text-center mb-20">
                        {/* Animated Badge */}
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-full mb-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                            <Building2 className="w-4 h-4 text-amber-600" />
                            <span className="text-sm text-amber-800 font-semibold">Especialistas em Guararema • 16 anos</span>
                        </div>

                        {/* Improved Typography */}
                        <h2 className="text-4xl lg:text-6xl font-light text-slate-900 mb-6 leading-[1.1] tracking-tight">
                            Como trabalhamos
                            <span className="block font-medium bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                com seu imóvel
                            </span>
                        </h2>

                        <p className="text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
                            Metodologia estruturada desenvolvida ao longo de <strong className="text-amber-700">16 anos</strong> para
                            maximizar o valor do seu imóvel e minimizar o tempo de venda.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-16 xl:gap-20 items-start">

                        {/* Enhanced Content Column */}
                        <div className="lg:col-span-7 space-y-12">

                            {/* Interactive Process Steps */}
                            <div>
                                <div className="flex items-center gap-4 mb-12">
                                    <h3 className="text-2xl font-bold text-slate-900">
                                        Nosso processo estruturado
                                    </h3>
                                    <div className="flex-1 h-px bg-amber-200" />
                                </div>

                                <div className="space-y-6">
                                    {processos.map((processo, index) => (
                                        <div
                                            key={index}
                                            className={`group relative transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                                } ${activeStep === index ? 'scale-[1.02]' : ''
                                                }`}
                                            style={{ transitionDelay: `${index * 200}ms` }}
                                            onMouseEnter={() => setActiveStep(index)}
                                        >
                                            {/* Enhanced Card */}
                                            <div className={`bg-white rounded-2xl p-8 border-2 transition-all duration-300 cursor-pointer relative overflow-hidden ${activeStep === index
                                                    ? 'border-amber-300 shadow-xl bg-gradient-to-br from-amber-50/50 to-orange-50/30'
                                                    : 'border-slate-100 hover:border-amber-200 hover:shadow-lg'
                                                }`}>
                                                {/* Progress Indicator */}
                                                {activeStep === index && (
                                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
                                                )}

                                                <div className="flex items-start gap-6">
                                                    {/* Enhanced Number Badge */}
                                                    <div className={`relative flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg transition-all duration-300 ${activeStep === index
                                                            ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white scale-110'
                                                            : 'bg-amber-100 text-amber-700 group-hover:bg-amber-200'
                                                        }`}>
                                                        {activeStep === index ? processo.icon : processo.numero}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h4 className="text-xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                                                                {processo.titulo}
                                                            </h4>
                                                            <span className={`text-sm font-semibold px-3 py-1 rounded-full transition-colors ${activeStep === index
                                                                    ? 'bg-amber-500 text-white'
                                                                    : 'bg-amber-100 text-amber-700'
                                                                }`}>
                                                                {processo.tempo}
                                                            </span>
                                                        </div>

                                                        <p className="text-slate-600 leading-relaxed text-lg mb-4">
                                                            {processo.descricao}
                                                        </p>

                                                        {/* Expandable Details */}
                                                        {activeStep === index && (
                                                            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                                                                {processo.details.map((detail, detailIndex) => (
                                                                    <div key={detailIndex} className="flex items-center gap-2 text-sm text-slate-500">
                                                                        <CheckCircle2 className="w-4 h-4 text-amber-500" />
                                                                        {detail}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Connection Line */}
                                            {index < processos.length - 1 && (
                                                <div className="flex justify-center mt-4 mb-2">
                                                    <ChevronRight className={`w-6 h-6 transition-colors duration-300 ${activeStep === index ? 'text-amber-500' : 'text-slate-300'
                                                        }`} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Enhanced Differentials */}
                            <div>
                                <div className="flex items-center gap-4 mb-10">
                                    <h3 className="text-2xl font-bold text-slate-900">
                                        Nossos diferenciais
                                    </h3>
                                    <div className="flex-1 h-px bg-amber-200" />
                                </div>

                                <div className="grid gap-4">
                                    {diferenciais.map((diferencial, index) => (
                                        <div
                                            key={index}
                                            className={`group bg-white rounded-xl p-6 border transition-all duration-300 cursor-pointer ${hoveredDifferential === index
                                                    ? 'border-amber-300 shadow-lg bg-gradient-to-r from-amber-50/50 to-orange-50/50'
                                                    : 'border-amber-100 hover:border-amber-200 hover:shadow-md'
                                                }`}
                                            onMouseEnter={() => setHoveredDifferential(index)}
                                            onMouseLeave={() => setHoveredDifferential(null)}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${hoveredDifferential === index
                                                        ? 'bg-amber-500 text-white'
                                                        : 'bg-amber-100 text-amber-600'
                                                    }`}>
                                                    {diferencial.icon}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="text-lg font-semibold text-slate-900 group-hover:text-amber-700 transition-colors">
                                                            {diferencial.titulo}
                                                        </h4>
                                                        <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                                                            {diferencial.metric}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-600 leading-relaxed">
                                                        {diferencial.descricao}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Enhanced Guarantees */}
                            <div className="relative bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 rounded-2xl p-8 text-white overflow-hidden">
                                <div className="absolute inset-0 bg-black/10" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <ShieldCheck className="w-6 h-6 text-amber-100" />
                                        <h3 className="text-xl font-bold">
                                            Nossas garantias
                                        </h3>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {[
                                            "Avaliação gratuita sem compromisso",
                                            "Documentação verificada por advogado",
                                            "Relatórios semanais de atividades",
                                            "Suporte até a escritura final"
                                        ].map((garantia, index) => (
                                            <div key={index} className="flex items-start gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                                                <CheckCircle2 className="w-5 h-5 text-amber-100 mt-0.5 flex-shrink-0" />
                                                <span className="text-amber-50 text-sm leading-relaxed">{garantia}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced CTAs */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="group flex-1 bg-amber-600 hover:bg-amber-700 text-white px-8 py-5 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl">
                                    <div className="flex items-center justify-center gap-3">
                                        <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        Solicitar avaliação gratuita
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </button>
                                <button className="group bg-white border-2 border-amber-200 hover:border-amber-300 text-amber-700 px-8 py-5 rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-lg">
                                    <div className="flex items-center justify-center gap-3">
                                        <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        (11) 98184-5016
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Enhanced Image Column */}
                        <div className="lg:col-span-5">
                            <div className="sticky top-8">
                                <div className="relative group">
                                    {/* Refined Neon Effect */}
                                    <div className="absolute -inset-2 bg-gradient-to-r from-amber-400/30 via-orange-400/30 to-amber-400/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-lg" />
                                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-300/40 via-orange-300/40 to-amber-300/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-md" />

                                    {/* Image Container */}
                                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 shadow-xl group-hover:shadow-2xl transition-shadow duration-500">
                                        <Image
                                            src="/images/predioIpe.png"
                                            alt="Nova Ipê Imóveis - Escritório em Guararema"
                                            fill
                                            className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                                            sizes="(max-width: 768px) 100vw, 42vw"
                                            priority
                                        />

                                        {/* Interactive Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        {/* Floating Badge */}
                                        <div className="absolute top-6 right-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg">
                                            ⭐ CRECI 152.847-F
                                        </div>
                                    </div>

                                    {/* Enhanced Location Card */}
                                    <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-amber-100 max-w-sm">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                                                <MapPin className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-base mb-1">
                                                    Praça 9 de Julho, 65
                                                </p>
                                                <p className="text-slate-600 text-sm font-medium mb-2">
                                                    Centro • Guararema/SP
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                                    <span className="text-xs text-green-600 font-semibold">Seg-Sex: 8h às 18h</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Stats */}
                                <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                                    <div className="grid grid-cols-3 gap-6 text-center">
                                        <div className="group cursor-pointer">
                                            <div className="text-2xl font-bold text-amber-700 mb-1 group-hover:scale-110 transition-transform">16</div>
                                            <div className="text-xs text-slate-600 font-medium">Anos</div>
                                        </div>
                                        <div className="group cursor-pointer">
                                            <div className="text-2xl font-bold text-amber-700 mb-1 group-hover:scale-110 transition-transform">4.8</div>
                                            <div className="text-xs text-slate-600 font-medium">Rating</div>
                                        </div>
                                        <div className="group cursor-pointer">
                                            <div className="text-2xl font-bold text-amber-700 mb-1 group-hover:scale-110 transition-transform">340+</div>
                                            <div className="text-xs text-slate-600 font-medium">Vendas</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Testimonial */}
                                <div className="mt-6 bg-white border border-amber-100 rounded-2xl p-6 hover:shadow-md transition-shadow duration-300">
                                    <div className="flex items-center gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                                        ))}
                                        <span className="ml-2 text-sm font-semibold text-slate-700">5.0</span>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-4 leading-relaxed italic">
                                        "Processo transparente e profissional. Venderam nossa casa dentro do prazo estimado sem complicações."
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                                            <Users className="w-4 h-4 text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-900">Roberto S.</p>
                                            <p className="text-xs text-slate-500">Cliente 2024</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}