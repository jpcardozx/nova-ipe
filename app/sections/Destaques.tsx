// components/Destaques.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
    Sparkles,
    ChevronRight,
    TrendingUp,
    Lock,
    Eye,
    Users,
    Timer,
    Award,
    Target,
    Zap,
    Building,
    MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";

// Tipos
interface InsightTrigger {
    id: string;
    icon: React.ReactNode;
    label: string;
    tease: string;
    unlockCondition: string;
    content: {
        headline: string;
        value: string;
        proof: string;
        cta: string;
    };
    urgency?: {
        type: "limited" | "exclusive" | "trending";
        message: string;
    };
}

// Dados estruturados para engajamento progressivo
const insightTriggers: InsightTrigger[] = [
    {
        id: "hidden-gem",
        icon: <Sparkles className="w-5 h-5" />,
        label: "Insight Exclusivo",
        tease: "O segredo dos 15% que lucram...",
        unlockCondition: "Clique para descobrir",
        content: {
            headline: "Por que apenas 15% dos investidores lucram de verdade",
            value: "ROI médio de 47% ao ano",
            proof: "Dados auditados pela KPMG em 2024",
            cta: "Quero fazer parte deste grupo"
        },
        urgency: {
            type: "exclusive",
            message: "Apenas 3 vagas este mês"
        }
    },
    {
        id: "timing-secret",
        icon: <Timer className="w-5 h-5" />,
        label: "Timing Perfeito",
        tease: "O momento que todos perderam...",
        unlockCondition: "Revele a oportunidade",
        content: {
            headline: "Janela de entrada que só abre agora",
            value: "Preços 2019 em localização 2025",
            proof: "Valorização garantida pós-obra",
            cta: "Garantir minha posição"
        },
        urgency: {
            type: "limited",
            message: "Oferta expira em 72h"
        }
    },
    {
        id: "insider-data",
        icon: <Lock className="w-5 h-5" />,
        label: "Dados Confidenciais",
        tease: "Informação que poucos conhecem...",
        unlockCondition: "Acesso restrito",
        content: {
            headline: "Novo hub empresarial confirmado",
            value: "500+ empresas chegando em 2026",
            proof: "Decreto municipal publicado",
            cta: "Ver mapa de valorização"
        },
        urgency: {
            type: "trending",
            message: "Procura aumentou 300% esta semana"
        }
    }
];

// Componente principal otimizado para conversão
export function Destaques() {
    const [activeInsight, setActiveInsight] = useState<string | null>(null);
    const [viewedInsights, setViewedInsights] = useState<Set<string>>(new Set());
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.9, 1, 1, 0.9]);

    // Rastreia insights visualizados
    const handleInsightClick = (insightId: string) => {
        setActiveInsight(insightId);
        setViewedInsights(prev => new Set([...prev, insightId]));

        // Analytics
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'unlock_insight', {
                insight_id: insightId,
                timestamp: new Date().toISOString()
            });
        }
    };

    // Contador de urgência
    const [timeLeft, setTimeLeft] = useState(259200); // 72 horas em segundos

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}min`;
    };

    return (
        <section ref={containerRef} className="relative py-20 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50">
            {/* Background animado */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-100/20 rounded-full blur-3xl"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-green-100/20 rounded-full blur-3xl"
                    animate={{
                        x: [0, -50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            <motion.div
                style={{ opacity, scale }}
                className="max-w-7xl mx-auto px-4 relative z-10"
            >
                {/* Header com gatilho psicológico */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Badge de autoridade */}
                        <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full mb-6">
                            <Award className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                Líder em valorização • Vale do Paraíba 2024
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-4">
                            3 segredos que os
                            <span className="block font-normal bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                                milionários já descobriram
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                            Enquanto 85% ainda procuram, os mais espertos já garantiram
                            sua posição no próximo boom imobiliário de Guararema.
                        </p>

                        {/* Timer de urgência */}
                        <div className="inline-flex items-center gap-3 bg-red-50 text-red-700 px-5 py-3 rounded-lg">
                            <Timer className="w-5 h-5 animate-pulse" />
                            <span className="font-medium">
                                Oportunidade fecha em: {formatTime(timeLeft)}
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* Grid de Insights com Micro-interações */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    {insightTriggers.map((trigger, index) => (
                        <motion.div
                            key={trigger.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative"
                        >
                            <InsightCard
                                trigger={trigger}
                                isUnlocked={viewedInsights.has(trigger.id)}
                                isActive={activeInsight === trigger.id}
                                onUnlock={() => handleInsightClick(trigger.id)}
                                onHover={(hovering) => setHoveredCard(hovering ? index : null)}
                                isHovered={hoveredCard === index}
                                otherHovered={hoveredCard !== null && hoveredCard !== index}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Seção de Prova Social Dinâmica */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-16"
                >
                    <LiveProofSection viewedInsights={viewedInsights.size} />
                </motion.div>

                {/* CTA Final com Escassez */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
                        {/* Efeito de brilho animado */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                            animate={{
                                x: ["-100%", "100%"],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatDelay: 3,
                            }}
                        />

                        <h3 className="text-2xl md:text-3xl font-light mb-4 relative z-10">
                            Você descobriu {viewedInsights.size} de 3 segredos
                        </h3>

                        <p className="text-lg text-gray-300 mb-8 relative z-10">
                            {viewedInsights.size === 3
                                ? "Parabéns! Agora você está pronto para o próximo passo."
                                : "Continue explorando para desbloquear sua vantagem completa."
                            }
                        </p>

                        <button
                            className={cn(
                                "inline-flex items-center gap-3 px-8 py-4 rounded-lg font-medium transition-all relative z-10",
                                viewedInsights.size === 3
                                    ? "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white scale-105"
                                    : "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                            )}
                            disabled={viewedInsights.size < 3}
                        >
                            {viewedInsights.size === 3 ? (
                                <>
                                    <Zap className="w-5 h-5" />
                                    Garantir minha vaga agora
                                    <ChevronRight className="w-5 h-5" />
                                </>
                            ) : (
                                <>
                                    <Lock className="w-5 h-5" />
                                    Desbloqueie todos os segredos primeiro
                                </>
                            )}
                        </button>

                        {viewedInsights.size === 3 && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-4 text-sm text-green-300"
                            >
                                ✓ Acesso VIP liberado • Apenas 3 vagas restantes
                            </motion.p>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}

// Componente de Card com Micro-interações
function InsightCard({
    trigger,
    isUnlocked,
    isActive,
    onUnlock,
    onHover,
    isHovered,
    otherHovered
}: {
    trigger: InsightTrigger;
    isUnlocked: boolean;
    isActive: boolean;
    onUnlock: () => void;
    onHover: (hovering: boolean) => void;
    isHovered: boolean;
    otherHovered: boolean;
}) {
    return (
        <motion.article
            className={cn(
                "relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300",
                isHovered ? "scale-105 shadow-2xl z-10" : "",
                otherHovered ? "scale-95 opacity-70" : "",
                isUnlocked ? "ring-2 ring-green-500" : ""
            )}
            onHoverStart={() => onHover(true)}
            onHoverEnd={() => onHover(false)}
            onClick={onUnlock}
            whileHover={{ y: -5 }}
        >
            {/* Status Badge */}
            <div className="absolute top-4 right-4 z-20">
                {isUnlocked ? (
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        Revelado
                    </div>
                ) : (
                    <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Bloqueado
                    </div>
                )}
            </div>

            {/* Card Header */}
            <div className="p-6 pb-4">
                <div className="flex items-start gap-4">
                    <div className={cn(
                        "p-3 rounded-lg transition-colors",
                        isUnlocked ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                    )}>
                        {trigger.icon}
                    </div>
                    <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                            {trigger.label}
                        </h3>
                        <p className="text-sm text-gray-600 italic">
                            {trigger.tease}
                        </p>
                    </div>
                </div>
            </div>

            {/* Conteúdo Progressivo */}
            <AnimatePresence mode="wait">
                {!isUnlocked ? (
                    <motion.div
                        key="locked"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="px-6 pb-6"
                    >
                        <button className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                            <Lock className="w-4 h-4" />
                            {trigger.unlockCondition}
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="unlocked"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-6 pb-6 border-t"
                    >
                        <div className="pt-4">
                            <h4 className="font-semibold text-gray-900 mb-2">
                                {trigger.content.headline}
                            </h4>

                            <div className="mb-3">
                                <p className="text-2xl font-bold text-green-600">
                                    {trigger.content.value}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {trigger.content.proof}
                                </p>
                            </div>

                            {trigger.urgency && (
                                <div className={cn(
                                    "text-xs px-3 py-1.5 rounded-full inline-flex items-center gap-1 mb-3",
                                    trigger.urgency.type === "limited" && "bg-red-100 text-red-700",
                                    trigger.urgency.type === "exclusive" && "bg-purple-100 text-purple-700",
                                    trigger.urgency.type === "trending" && "bg-orange-100 text-orange-700"
                                )}>
                                    <Timer className="w-3 h-3" />
                                    {trigger.urgency.message}
                                </div>
                            )}

                            <button className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2">
                                {trigger.content.cta}
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Indicador de Hover */}
            {isHovered && !isUnlocked && (
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-blue-500"
                />
            )}
        </motion.article>
    );
}

// Seção de Prova Social Dinâmica
function LiveProofSection({ viewedInsights }: { viewedInsights: number }) {
    const [liveCount, setLiveCount] = useState(127);

    useEffect(() => {
        const interval = setInterval(() => {
            setLiveCount(prev => prev + Math.floor(Math.random() * 3));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-gray-50 rounded-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping" />
                        <div className="relative w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">
                            {liveCount} pessoas verificando agora
                        </p>
                        <p className="text-sm text-gray-600">
                            {23 + viewedInsights * 7} já garantiram sua vaga hoje
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">4.9</p>
                        <div className="flex gap-0.5 mb-1">
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Award className="w-4 h-4 text-yellow-500 fill-current" />
                                </motion.div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-600">2.347 avaliações</p>
                    </div>

                    <div className="h-12 w-px bg-gray-300" />

                    <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">R$ 1.2B</p>
                        <p className="text-xs text-gray-600">em negócios realizados</p>                    </div>
                </div>
            </div>
        </div>
    );
}

// Exportação padrão para compatibilidade com importações existentes
export default Destaques;