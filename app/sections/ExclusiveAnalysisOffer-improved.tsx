// components/ExclusiveAnalysisOffer-improved.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface PropertyGuideOfferProps {
    onEngagement?: () => void;
    variant?: "executive" | "family";
}

export function PropertyGuideOffer({
    onEngagement,
    variant = "executive"
}: PropertyGuideOfferProps) {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
        >
            <div className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-lg shadow-md">
                <div className="px-8 py-10 md:px-12 md:py-14">
                    <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10 items-start">

                        {/* Main Content - 3 cols */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Service Indicator */}
                            <div className="flex items-center gap-4">
                                <div className="h-px bg-blue-300 flex-1 max-w-[60px]" />
                                <span className="text-sm tracking-wider text-blue-600 font-medium">
                                    CONSULTORIA GRATUITA
                                </span>
                            </div>

                            {/* Headline */}
                            <div>
                                <h3 className="text-2xl md:text-3xl text-gray-900 font-semibold leading-tight">
                                    Guia Prático de Imóveis
                                    <span className="block text-gray-700 mt-1 font-normal">
                                        Guararema e Região 2025
                                    </span>
                                </h3>
                            </div>

                            {/* Value Proposition */}
                            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                                Receba informações atualizadas sobre o mercado imobiliário local, 
                                incluindo preços praticados, melhores bairros e dicas práticas 
                                para sua decisão de compra ou locação.
                            </p>

                            {/* Key Benefits */}
                            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mt-8">
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-gray-700 tracking-wide">
                                        NOSSA EXPERIÊNCIA
                                    </h4>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-400 mt-1">•</span>
                                            Mais de 15 anos atuando na região
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-400 mt-1">•</span>
                                            Conhecimento detalhado dos bairros
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-400 mt-1">•</span>
                                            Acompanhamento de tendências de mercado
                                        </li>
                                    </ul>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-gray-700 tracking-wide">
                                        INFORMAÇÕES INCLUÍDAS
                                    </h4>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-400 mt-1">•</span>
                                            Lista de imóveis disponíveis
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-400 mt-1">•</span>
                                            Análise de preços por região
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-400 mt-1">•</span>
                                            Orientação personalizada
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Side Panel - 2 cols */}
                        <div className="lg:col-span-2 lg:pl-8 lg:border-l border-gray-200">
                            <div className="space-y-6">
                                {/* Information Box */}
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                    <div className="text-2xl font-semibold text-gray-900 mb-2">
                                        Material Gratuito
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Informações sobre preços e tendências
                                        <span className="block text-xs text-gray-500 mt-1">
                                            Baseado em dados dos últimos 3 anos
                                        </span>
                                    </div>
                                </div>

                                {/* Service Details */}
                                <div className="space-y-3">
                                    <div className="text-sm text-gray-700">
                                        <span className="font-semibold">Atendimento:</span>
                                        <span className="block text-gray-600 mt-1">
                                            Segunda à sexta, 8h às 18h
                                        </span>
                                    </div>

                                    <div className="text-sm text-gray-700">
                                        <span className="font-semibold">Foco de atuação:</span>
                                        <span className="block text-gray-600 mt-1">
                                            Guararema, Mogi das Cruzes e região
                                        </span>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="pt-4">
                                    <button
                                        onClick={onEngagement}
                                        onMouseEnter={() => setIsHovering(true)}
                                        onMouseLeave={() => setIsHovering(false)}
                                        className="w-full bg-blue-600 text-white px-6 py-3.5 text-sm font-semibold rounded-lg tracking-wide transition-all duration-300 hover:bg-blue-700 transform hover:scale-105"
                                    >
                                        SOLICITAR GUIA GRATUITO
                                    </button>
                                    
                                    <p className="text-xs text-gray-500 text-center mt-3">
                                        Sem compromisso • Informações por WhatsApp
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Trust Information */}
                    <div className="mt-10 pt-8 border-t border-gray-200">
                        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-6">
                                <span>Nova Ipê Imóveis</span>
                                <span>•</span>
                                <span>Desde 2009</span>
                                <span>•</span>
                                <span>CRECI 24.073-J</span>
                            </div>
                            <div>
                                <span>Informações baseadas em experiência local</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}

// Versão familiar para consultoria personalizada
export function FamilyPropertyConsultation({
    onEngagement
}: PropertyGuideOfferProps) {
    return (
        <div className="bg-gray-800 text-white px-8 py-12 md:px-12 md:py-16 rounded-lg">
            <div className="max-w-4xl">
                {/* Service Status */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm tracking-wider text-gray-300">
                        ATENDIMENTO PERSONALIZADO
                    </span>
                </div>

                {/* Content */}
                <h3 className="text-3xl font-semibold mb-6">
                    Consultoria para sua família
                    <span className="block text-gray-300 text-2xl mt-2 font-normal">
                        Encontre o imóvel ideal em Guararema
                    </span>
                </h3>

                <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-3xl">
                    Atendimento especializado com nossa equipe, incluindo orientação sobre 
                    documentação, avaliação de imóveis e acompanhamento no processo de 
                    compra ou locação.
                </p>

                {/* Service Highlights */}
                <div className="grid grid-cols-3 gap-6 mb-10">
                    <div>
                        <div className="text-2xl font-semibold text-blue-400">15 anos</div>
                        <div className="text-sm text-gray-400 mt-1">de experiência local</div>
                    </div>
                    <div>
                        <div className="text-2xl font-semibold text-blue-400">500+</div>
                        <div className="text-sm text-gray-400 mt-1">famílias atendidas</div>
                    </div>
                    <div>
                        <div className="text-2xl font-semibold text-blue-400">CRECI</div>
                        <div className="text-sm text-gray-400 mt-1">credenciado</div>
                    </div>
                </div>

                {/* CTA */}
                <button
                    onClick={onEngagement}
                    className="bg-blue-500 text-white px-8 py-3.5 font-semibold rounded-lg tracking-wide hover:bg-blue-600 transition-colors"
                >
                    AGENDAR CONVERSA GRATUITA
                </button>

                <p className="text-xs text-gray-400 mt-4">
                    Sem compromisso • Atendimento personalizado
                </p>
            </div>
        </div>
    );
}

// Hook para integração com sistema de leads
export function usePropertyInquiry() {
    const submitInquiry = (data: any) => {
        // Integração com sistema de leads
        console.log("Property inquiry submitted:", data);
    };

    return { submitInquiry };
}

export default PropertyGuideOffer;
