"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
    Trees,
    Train,
    TrendingUp,
    Clock,
    Shield,
    MapPin,
    Home,
    ArrowRight,
    Mountain,
    Building
} from "lucide-react";
import { cn } from "@/lib/utils";

// Tipos
interface StrategicPoint {
    id: string;
    icon: React.ReactNode;
    title: string;
    value: string;
    description: string;
    highlight?: string;
}

interface LocationAdvantage {
    id: string;
    title: string;
    description: string;
    metric: string;
    visual: React.ReactNode;
}

// Pontos estratégicos selecionados
const strategicPoints: StrategicPoint[] = [
    {
        id: "natureza",
        icon: <Trees className="w-6 h-6" />,
        title: "Qualidade de Vida",
        value: "92%",
        description: "de satisfação dos moradores",
        highlight: "Natureza preservada e ar puro"
    },
    {
        id: "acesso",
        icon: <Train className="w-6 h-6" />,
        title: "Conexão com SP",
        value: "88km",
        description: "via Dutra ou trem direto",
        highlight: "Trabalhe em SP, viva em Guararema"
    },
    {
        id: "valorizacao",
        icon: <TrendingUp className="w-6 h-6" />,
        title: "Crescimento Estável",
        value: "5,2%",
        description: "valorização anual média",
        highlight: "Acima da inflação consistentemente"
    }
];

// Vantagens de localização
const locationAdvantages: LocationAdvantage[] = [
    {
        id: "centro-historico",
        title: "Centro Histórico Preservado",
        description: "Charme colonial com infraestrutura moderna",
        metric: "Patrimônio tombado",
        visual: <Building className="w-8 h-8 text-amber-600" />
    },
    {
        id: "serra-mar",
        title: "Entre a Serra e o Vale",
        description: "Clima ameno e paisagens deslumbrantes",
        metric: "19°C média anual",
        visual: <Mountain className="w-8 h-8 text-green-600" />
    },
    {
        id: "investimento",
        title: "Momento de Entrada",
        description: "Preços ainda acessíveis com alto potencial",
        metric: "Oportunidade única",
        visual: <Clock className="w-8 h-8 text-blue-600" />
    }
];

export function DestaquesEstrategicos() {
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);

    return (
        <section ref={containerRef} className="relative py-24 bg-white overflow-hidden">
            {/* Background pattern sutil */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 via-transparent to-amber-50/30" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-100/20 rounded-full blur-3xl" />
            </div>

            <motion.div
                style={{ opacity }}
                className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            >
                {/* Header estratégico */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Por que Guararema é diferente
                            <span className="block text-amber-600 mt-2">
                                do que você imagina
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Uma cidade que equilibra perfeitamente natureza preservada,
                            acesso estratégico e potencial de crescimento sustentável
                        </p>
                    </motion.div>
                </div>

                {/* Grid assimétrico de pontos estratégicos */}
                <div className="grid lg:grid-cols-3 gap-8 mb-24">
                    {strategicPoints.map((point, index) => (
                        <motion.div
                            key={point.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className="group"
                        >
                            <div className="bg-white rounded-2xl p-8 h-full border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="p-3 bg-amber-50 rounded-xl text-amber-700 group-hover:bg-amber-100 transition-colors">
                                        {point.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                            {point.title}
                                        </h3>
                                        <p className="text-3xl font-bold text-amber-600">
                                            {point.value}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-4">
                                    {point.description}
                                </p>
                                {point.highlight && (
                                    <p className="text-sm font-medium text-amber-700 bg-amber-50 rounded-lg px-4 py-2">
                                        {point.highlight}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Seção visual de localização */}
                <div className="mb-24">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="grid lg:grid-cols-2 gap-12 items-center"
                    >
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-8">
                                Localização estratégica que
                                <span className="text-amber-600"> faz a diferença</span>
                            </h3>

                            <div className="space-y-6">
                                {locationAdvantages.map((advantage) => (
                                    <motion.div
                                        key={advantage.id}
                                        className="flex gap-4 p-4 rounded-xl hover:bg-amber-50 transition-colors cursor-pointer"
                                        onClick={() => setActiveSection(advantage.id)}
                                        whileHover={{ x: 8 }}
                                    >
                                        <div className="flex-shrink-0">
                                            {advantage.visual}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 mb-1">
                                                {advantage.title}
                                            </h4>
                                            <p className="text-gray-600 text-sm mb-2">
                                                {advantage.description}
                                            </p>
                                            <p className="text-amber-600 font-medium text-sm">
                                                {advantage.metric}
                                            </p>
                                        </div>
                                        <ArrowRight className={cn(
                                            "w-5 h-5 transition-transform",
                                            activeSection === advantage.id ? "rotate-90 text-amber-600" : "text-gray-400"
                                        )} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Mapa visual ou imagem */}
                        <div className="relative h-96 lg:h-[500px] bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <MapPin className="w-16 h-16 text-amber-600 mx-auto mb-4" />
                                    <p className="text-gray-700 font-medium">
                                        Visualização do mapa
                                    </p>
                                </div>
                            </div>

                            {/* Pontos de interesse */}
                            <div className="absolute top-8 left-8 bg-white rounded-lg p-3 shadow-md">
                                <div className="flex items-center gap-2">
                                    <Train className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium">Estação CPTM</span>
                                </div>
                            </div>

                            <div className="absolute bottom-8 right-8 bg-white rounded-lg p-3 shadow-md">
                                <div className="flex items-center gap-2">
                                    <Home className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-medium">Bairros residenciais</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Proposta de valor final */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 text-white relative overflow-hidden">
                        {/* Pattern overlay */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            }} />
                        </div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                                <Shield className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                    Consultoria especializada desde 2010
                                </span>
                            </div>

                            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                                Guararema não é apenas uma cidade,
                                <span className="block text-amber-400 mt-2">
                                    é uma escolha inteligente e estratégica
                                </span>
                            </h3>

                            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
                                Nossa equipe local conhece cada oportunidade e pode
                                guiar você para a decisão certa no momento certo
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <a
                                    href="/contato"
                                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-all duration-300 transform hover:scale-105"
                                >
                                    Quero conhecer as oportunidades
                                    <ArrowRight className="w-5 h-5" />
                                </a>
                                <a
                                    href="/visita"
                                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20"
                                >
                                    Agendar visita presencial
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}

export default DestaquesEstrategicos;