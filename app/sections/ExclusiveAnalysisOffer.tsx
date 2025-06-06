// components/ExclusiveAnalysisOffer.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface ExclusiveAnalysisOfferProps {
    onEngagement?: () => void;
    variant?: "executive" | "family";
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
                        <div className="lg:col-span-3 space-y-6">                            {/* Professional Indicator */}
                            <div className="flex items-center gap-4">
                                <div className="h-px bg-gray-300 flex-1 max-w-[60px]" />
                                <span className="text-sm tracking-wider text-gray-600 font-light">
                                    RELATÓRIO ESPECIALIZADO
                                </span>
                            </div>{/* Headline */}                            <div>
                                <h3 className="text-2xl md:text-3xl text-gray-900 font-light leading-tight">
                                    Guia Prático Guararema
                                    <span className="block text-gray-700 mt-1 font-medium">
                                        Imóveis Disponíveis 2025
                                    </span>
                                </h3>
                            </div>

                            {/* Value Prop */}
                            <p className="text-gray-600 text-lg font-light leading-relaxed max-w-2xl">
                                Informações práticas sobre imóveis disponíveis na região, selecionados
                                por nossa equipe. Dados simples e claros baseados em 15 anos de experiência
                                local para ajudar você na sua decisão de compra ou mudança.
                            </p>{/* Key Differentiators */}
                            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mt-8">                                <div className="space-y-3">
                                <h4 className="text-sm font-medium text-gray-700 tracking-wide">
                                    CONHECIMENTO DA REGIÃO
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-gray-400 mt-1">—</span>
                                        15 anos trabalhando em Guararema
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-gray-400 mt-1">—</span>
                                        Dados sobre vendas na região
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-gray-400 mt-1">—</span>
                                        Conhecimento dos melhores bairros
                                    </li>
                                </ul>
                            </div>

                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium text-gray-700 tracking-wide">
                                        O QUE VOCÊ RECEBE
                                    </h4>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-start gap-2">
                                            <span className="text-gray-400 mt-1">—</span>
                                            Lista de imóveis disponíveis
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-gray-400 mt-1">—</span>
                                            Lista de imóveis com bom custo-benefício
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-gray-400 mt-1">—</span>
                                            Conversa com nossa equipe
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
                                        + Informações
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Dados sobre preços praticados
                                        <span className="block text-xs text-gray-500 mt-1">
                                            Últimos 3 anos em Guararema
                                        </span>
                                    </div>
                                </div>

                                {/* Availability */}
                                <div className="space-y-3">
                                    <div className="text-sm text-gray-700">
                                        <span className="font-medium">Atendimento disponível:</span>
                                        <span className="block text-gray-600 mt-1">
                                            Agende sua conversa
                                        </span>
                                    </div>

                                    <div className="text-sm text-gray-700">
                                        <span className="font-medium">Faixa de preços:</span>
                                        <span className="block text-gray-600 mt-1">
                                            A partir de R$ 350.000
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
                                        <span className="relative z-10">SOLICITAR RELATÓRIO GRATUITO</span>
                                        <span className="absolute inset-0 bg-amber-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                                    </button>                                    <p className="text-xs text-gray-500 text-center mt-3">
                                        Sem compromisso • Atendimento personalizado
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Trust Bar */}
                    <div className="mt-10 pt-8 border-t border-gray-200">                        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-6">
                            <span>Nova Ipê Imóveis</span>
                            <span>•</span>
                            <span>Desde 2009</span>
                            <span>•</span>
                            <span>CRECI 24.073-J</span>
                        </div>
                        <div>
                            <span>Informações baseadas em transações reais</span>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}

// Versão especializada para famílias buscando orientação detalhada
export function FamilyConsultationAnalysis({
    onEngagement
}: ExclusiveAnalysisOfferProps) {
    return (
        <div className="bg-gray-900 text-white px-8 py-12 md:px-12 md:py-16">
            <div className="max-w-4xl">
                {/* Status */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    <span className="text-sm tracking-wider text-gray-400">
                        CONSULTORIA PERSONALIZADA
                    </span>
                </div>

                {/* Content */}
                <h3 className="text-3xl font-light mb-6">
                    Consultoria completa para sua família
                    <span className="block text-gray-400 text-2xl mt-2">
                        Encontre o imóvel ideal em Guararema
                    </span>
                </h3>

                <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-3xl">
                    Atendimento especializado com nossa equipe experiente, incluindo
                    avaliação detalhada de imóveis, orientação sobre documentação e
                    acompanhamento completo no processo de compra ou locação.
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-6 mb-10">
                    <div>
                        <div className="text-2xl font-light text-amber-500">15 anos</div>
                        <div className="text-sm text-gray-400 mt-1">de experiência</div>
                    </div>
                    <div>
                        <div className="text-2xl font-light text-amber-500">500+</div>
                        <div className="text-sm text-gray-400 mt-1">famílias atendidas</div>
                    </div>
                    <div>
                        <div className="text-2xl font-light text-amber-500">98%</div>
                        <div className="text-sm text-gray-400 mt-1">de satisfação</div>
                    </div>
                </div>

                {/* CTA */}
                <button
                    onClick={onEngagement}
                    className="bg-amber-500 text-gray-900 px-8 py-3.5 font-medium tracking-wide hover:bg-amber-400 transition-colors"
                >
                    AGENDAR CONSULTORIA GRATUITA
                </button>

                <p className="text-xs text-gray-500 mt-4">
                    Sem compromisso • Atendimento personalizado para sua família
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
    }; return { qualifyLead };
}

export default ExclusiveAnalysisOffer;