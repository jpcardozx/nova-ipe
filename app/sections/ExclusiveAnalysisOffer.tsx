// components/ExclusiveAnalysisOffer.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface ExclusiveAnalysisOfferProps {
    onEngagement?: () => void;
    variant?: "executive" | "investor";
}

export function ExclusiveAnalysisOffer({
    onEngagement,
    variant = "executive"
}: ExclusiveAnalysisOfferProps) {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
        >
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-sm shadow-sm">
                <div className="px-8 py-10 md:px-12 md:py-14">
                    <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10 items-start">

                        {/* Main Content - 3 cols */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Exclusivity Indicator */}
                            <div className="flex items-center gap-4">
                                <div className="h-px bg-gray-300 flex-1 max-w-[60px]" />
                                <span className="text-sm tracking-wider text-gray-600 font-light">
                                    ACESSO RESTRITO
                                </span>
                            </div>

                            {/* Headline */}                            <div>
                                <h3 className="text-2xl md:text-3xl text-gray-900 font-light leading-tight">
                                    Guia definitivo de investimentos
                                    <span className="block text-gray-700 mt-1 font-medium">
                                        Guararema 2025-2030: Alta Rentabilidade
                                    </span>
                                </h3>
                            </div>

                            {/* Value Prop */}
                            <p className="text-gray-600 text-lg font-light leading-relaxed max-w-2xl">
                                Análise estratégica exclusiva desenvolvida por nossa equipe de especialistas,
                                com tecnologia preditiva e modelagem financeira avançada para identificar
                                oportunidades premium com potencial de valorização acima do mercado.
                            </p>

                            {/* Key Differentiators */}
                            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mt-8">                                <div className="space-y-3">
                                <h4 className="text-sm font-medium text-gray-700 tracking-wide">
                                    METODOLOGIA AVANÇADA
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-gray-400 mt-1">—</span>
                                        Análise comparativa com 18 mercados premium
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-gray-400 mt-1">—</span>
                                        Machine learning para projeção de tendências
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-gray-400 mt-1">—</span>
                                        Simulação avançada com 5 cenários econômicos
                                    </li>
                                </ul>
                            </div>

                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium text-gray-700 tracking-wide">
                                        BENEFÍCIOS EXCLUSIVOS
                                    </h4>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-start gap-2">
                                            <span className="text-gray-400 mt-1">—</span>
                                            Relatório estratégico personalizado
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-gray-400 mt-1">—</span>
                                            Acesso antecipado a lançamentos exclusivos
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-gray-400 mt-1">—</span>
                                            Assessoria executiva com nosso diretor
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Side Panel - 2 cols */}
                        <div className="lg:col-span-2 lg:pl-8 lg:border-l border-gray-200">
                            <div className="space-y-6">                                {/* Performance Metric */}
                                <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
                                    <div className="text-3xl font-light text-gray-900 mb-1">
                                        27.6% a.a.
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Taxa potencial de valorização
                                        <span className="block text-xs text-gray-500 mt-1">
                                            Projeção 2025-2027 (áreas selecionadas)
                                        </span>
                                    </div>
                                </div>

                                {/* Availability */}
                                <div className="space-y-3">
                                    <div className="text-sm text-gray-700">
                                        <span className="font-medium">Disponibilidade:</span>
                                        <span className="block text-gray-600 mt-1">
                                            Apenas 5 apresentações disponíveis em maio
                                        </span>
                                    </div>

                                    <div className="text-sm text-gray-700">
                                        <span className="font-medium">Oportunidade de entrada:</span>
                                        <span className="block text-gray-600 mt-1">
                                            A partir de R$ 450.000 (portfólio premium)
                                        </span>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="pt-4">
                                    <button
                                        onClick={onEngagement}
                                        onMouseEnter={() => setIsHovering(true)}
                                        onMouseLeave={() => setIsHovering(false)}
                                        className="w-full bg-gray-900 text-white px-6 py-3.5 text-sm font-medium tracking-wide transition-all duration-300 hover:bg-gray-800 relative overflow-hidden group"
                                    >
                                        <span className="relative z-10">RESERVAR APRESENTAÇÃO EXECUTIVA</span>
                                        <span className="absolute inset-0 bg-amber-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                                    </button>

                                    <p className="text-xs text-gray-500 text-center mt-3">
                                        Confidencialidade garantida • Consultoria gratuita
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Trust Bar */}
                    <div className="mt-10 pt-8 border-t border-gray-200">
                        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-6">
                                <span>IPÊ RESEARCH™</span>
                                <span>•</span>
                                <span>Desde 2009</span>
                                <span>•</span>
                                <span>CRECI 24.073-J</span>
                            </div>
                            <div>
                                <span>Dados auditados por terceiros independentes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}

// Versão ainda mais exclusiva para investidores qualificados
export function QualifiedInvestorAnalysis({
    onEngagement
}: ExclusiveAnalysisOfferProps) {
    return (
        <div className="bg-gray-900 text-white px-8 py-12 md:px-12 md:py-16">
            <div className="max-w-4xl">
                {/* Status */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    <span className="text-sm tracking-wider text-gray-400">
                        INVESTIDOR QUALIFICADO
                    </span>
                </div>

                {/* Content */}
                <h3 className="text-3xl font-light mb-6">
                    Acesso ao relatório institucional
                    <span className="block text-gray-400 text-2xl mt-2">
                        Oportunidades off-market em Guararema
                    </span>
                </h3>

                <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-3xl">
                    Documento confidencial com pipeline exclusivo de ativos pré-lançamento,
                    estruturação fiscal otimizada e modelagem de exit strategies para
                    horizontes de 18-60 meses.
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-6 mb-10">
                    <div>
                        <div className="text-2xl font-light text-amber-500">R$ 2.4M</div>
                        <div className="text-sm text-gray-400 mt-1">Ticket médio</div>
                    </div>
                    <div>
                        <div className="text-2xl font-light text-amber-500">3.2x</div>
                        <div className="text-sm text-gray-400 mt-1">Múltiplo médio (5a)</div>
                    </div>
                    <div>
                        <div className="text-2xl font-light text-amber-500">87%</div>
                        <div className="text-sm text-gray-400 mt-1">Taxa de sucesso</div>
                    </div>
                </div>

                {/* CTA */}
                <button
                    onClick={onEngagement}
                    className="bg-amber-500 text-gray-900 px-8 py-3.5 font-medium tracking-wide hover:bg-amber-400 transition-colors"
                >
                    SOLICITAR CREDENCIAMENTO
                </button>

                <p className="text-xs text-gray-500 mt-4">
                    Sujeito à verificação de elegibilidade CVM 539/13
                </p>
            </div>
        </div>
    );
}

// Hook para integração com CRM
export function useLeadQualification() {
    const qualifyLead = (data: any) => {
        // Integração com CRM/automação
        console.log("Lead qualification:", data);
    };

    return { qualifyLead };
}