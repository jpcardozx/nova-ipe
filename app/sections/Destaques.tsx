"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils"; // Suponho que você tenha uma função de utilidade para concatenar classes

// Definição da fonte com preload para melhor performance
const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-montserrat",
    display: "swap", // Melhora LCP (Largest Contentful Paint)
});

// Interfaces tipadas
interface BuyerProfile {
    id: string;
    title: string;
    description: string;
    benefit: string;
    icon: string;
    imagePath: string; // Adicionado caminho da imagem para facilitar manutenção
}

interface Statistic {
    id: string; // Adicionado ID único para melhor acessibilidade e rastreamento
    value: string;
    label: string;
    detail: string;
    color: string;
}

// Componentes internos para melhor organização
const StatisticCard = ({ stat, index, isInView }: {
    stat: Statistic;
    index: number;
    isInView: boolean;
}) => (
    <motion.div
        key={stat.id}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{
            duration: 0.7,
            delay: index * 0.15,
            ease: [0.165, 0.84, 0.44, 1]
        }}
        className="relative py-16 px-8 text-center"
        style={{
            borderLeft: index > 0 ? "1px solid rgba(229, 231, 235, 0.5)" : "none"
        }}
    >
        <div
            className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full shadow-md z-10"
            style={{ backgroundColor: stat.color }}
            aria-hidden="true"
        />

        <motion.span
            className="text-5xl md:text-6xl font-light mb-5 block tracking-tight"
            initial={{ scale: 0.9 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{
                duration: 0.5,
                delay: 0.3 + index * 0.15,
                ease: [0.175, 0.885, 0.32, 1.275]
            }}
            style={{ color: stat.color }}
        >
            {stat.value}
        </motion.span>

        <h3 className="text-xl font-medium text-gray-900 mb-3">
            {stat.label}
        </h3>

        <p className="text-gray-600 text-sm max-w-xs mx-auto">
            {stat.detail}
        </p>
    </motion.div>
);

const ProfileButton = ({
    profile,
    isActive,
    onClick
}: {
    profile: BuyerProfile;
    isActive: boolean;
    onClick: () => void;
}) => (
    <button
        onClick={onClick}
        className={cn(
            "px-7 py-3.5 rounded-lg text-base font-medium transition-all duration-300",
            isActive
                ? "bg-gray-900 text-white shadow-lg scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
        )}
        aria-pressed={isActive}
        aria-label={`Ver perfil de ${profile.title}`}
    >
        {profile.title}
    </button>
);

// Constantes movidas para fora do componente para evitar recriações
const BUYER_PROFILES: BuyerProfile[] = [
    {
        id: "families",
        title: "Famílias",
        description: "Espaço, segurança e educação de qualidade para seus filhos crescerem em um ambiente saudável.",
        benefit: "Redução de 60% em ocorrências criminais e escolas com índices de aprovação 23% acima da média estadual.",
        icon: "/images/family.png",
        imagePath: "/images/families-lifestyle.jpg"
    },
    {
        id: "executives",
        title: "Executivos",
        description: "Tranquilidade após o expediente sem abrir mão da proximidade com a capital.",
        benefit: "Acesso direto pela Rodovia Ayrton Senna com 55 minutos até o centro expandido de São Paulo.",
        icon: "/images/traffic.png",
        imagePath: "/images/executives-lifestyle.jpg"
    },
    {
        id: "retirees",
        title: "Aposentados",
        description: "Qualidade de vida e tranquilidade com acesso completo a serviços essenciais.",
        benefit: "Centro médico integrado com 16 especialidades e custo de vida 33% menor que na capital.",
        icon: "/icons/retirement.png",
        imagePath: "/images/retirees-lifestyle.jpg"
    }
];

const STATISTICS: Statistic[] = [
    {
        id: "pollution",
        value: "65%",
        label: "Menos poluentes",
        detail: "que a capital segundo medições da CETESB",
        color: "#4CAF50"
    },
    {
        id: "cost",
        value: "33%",
        label: "Custo reduzido",
        detail: "para manter o mesmo padrão de vida da capital",
        color: "#E6AA2C"
    },
    {
        id: "safety",
        value: "60%",
        label: "Maior segurança",
        detail: "com redução expressiva em crimes contra pessoa e patrimônio",
        color: "#2196F3"
    }
];

// Variantes de animação para reutilização
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.165, 0.84, 0.44, 1] }
    }
};

export default function GuararemaShowcase() {
    const [activeProfile, setActiveProfile] = useState<string>("families");
    const [isInView, setIsInView] = useState<boolean>(false);

    // Obter o perfil atual com useMemo para evitar recálculos desnecessários
    const currentProfile = React.useMemo(() =>
        BUYER_PROFILES.find(profile => profile.id === activeProfile) || BUYER_PROFILES[0],
        [activeProfile]
    );

    // Usar IntersectionObserver para animações baseadas em scroll
    // em vez de simplesmente ativar todas as animações ao montar
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsInView(true);
                    observer.disconnect(); // Só precisamos saber quando entra em view uma vez
                }
            },
            { threshold: 0.1 } // 10% visível já dispara
        );

        const section = document.getElementById('guararema-showcase');
        if (section) {
            observer.observe(section);
        }

        return () => {
            if (section) observer.unobserve(section);
        };
    }, []);

    return (
        <section
            id="guararema-showcase"
            className={cn(
                "bg-white py-16 md:py-24 overflow-hidden font-sans",
                montserrat.variable
            )}
        >
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Cabeçalho com propósito claro */}
                <motion.div
                    className="text-center mb-16 md:mb-20"
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={fadeInUp}
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-light text-gray-900 mb-6 tracking-tight">
                        <span className="font-semibold">Guararema.</span> Um investimento em qualidade de vida.
                    </h2>

                    <div className="w-24 h-1 bg-amber-500 mx-auto mb-8" aria-hidden="true"></div>

                    <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
                        Uma decisão que equilibra inteligentemente seu patrimônio financeiro e bem-estar.
                        A apenas 55 minutos de São Paulo.
                    </p>
                </motion.div>

                {/* Seção 1: Dados estatísticos com visualização refinada de impacto */}
                <div className="mb-24 md:mb-32">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
                        {/* Linha conectora horizontal - só visível em desktop */}
                        <div
                            className="absolute top-0 left-0 right-0 h-px bg-gray-200 md:block hidden"
                            aria-hidden="true"
                        >
                            <div className="absolute left-1/2 transform -translate-x-1/2 top-0 h-4 w-px bg-gray-300"></div>
                        </div>

                        {STATISTICS.map((stat, index) => (
                            <StatisticCard
                                key={stat.id}
                                stat={stat}
                                index={index}
                                isInView={isInView}
                            />
                        ))}
                    </div>

                    <div className="mt-8 text-right">
                        <span className="text-gray-500 text-xs italic">
                            Dados: CETESB 2024, SSP-SP, Pesquisa Mercadológica Ipê Imóveis 2025
                        </span>
                    </div>
                </div>

                {/* Seção 2: Perfis de compradores com seleção contextual */}
                <div className="mb-24 md:mb-32">
                    <motion.h3
                        className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-900 text-center mb-12 md:mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <span className="font-medium">Guararema</span> foi pensada para você.
                    </motion.h3>

                    <motion.div
                        className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12 md:mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        role="tablist"
                        aria-label="Perfis de compradores"
                    >
                        {BUYER_PROFILES.map((profile) => (
                            <ProfileButton
                                key={profile.id}
                                profile={profile}
                                isActive={activeProfile === profile.id}
                                onClick={() => setActiveProfile(profile.id)}
                            />
                        ))}
                    </motion.div>

                    <div
                        role="tabpanel"
                        aria-labelledby={`tab-${currentProfile.id}`}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentProfile.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.4, ease: [0.165, 0.84, 0.44, 1] }}
                                className="bg-gray-50 rounded-2xl p-8 md:p-12 shadow-lg"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
                                    <div className="md:col-span-7">
                                        <span className="inline-block text-amber-600 text-sm font-semibold uppercase tracking-wide mb-3">
                                            Perfil
                                        </span>

                                        <h4 className="text-2xl md:text-3xl font-medium text-gray-900 mb-6">
                                            {currentProfile.title}
                                        </h4>

                                        <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                                            {currentProfile.description}
                                        </p>

                                        <div className="bg-white rounded-lg p-6 border-l-4 border-amber-500 shadow-sm">
                                            <p className="text-gray-700 leading-relaxed">
                                                <span className="font-semibold text-gray-900">Benefício concreto:</span> {currentProfile.benefit}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="md:col-span-5">
                                        <div className="aspect-[4/3] relative rounded-xl overflow-hidden shadow-2xl transform md:rotate-1 transition-transform duration-500 hover:rotate-0 group">
                                            <Image
                                                src={currentProfile.imagePath}
                                                alt={`Estilo de vida para ${currentProfile.title} em Guararema`}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 40vw"
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                priority={activeProfile === BUYER_PROFILES[0].id}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/30"></div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* CTA Seção - Design premium */}
                <motion.div
                    className="bg-gray-900 rounded-2xl p-8 sm:p-10 md:p-14 relative overflow-hidden shadow-2xl"
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.165, 0.84, 0.44, 1] }}
                >
                    <div className="absolute inset-0 opacity-10" aria-hidden="true">
                        <Image
                            src="/images/guararema-map-outline.svg"
                            alt=""
                            fill
                            sizes="100vw"
                            className="object-contain object-center"
                        />
                    </div>

                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-14 items-center">
                        <div>
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-light text-white mb-6 tracking-tight">
                                Experimente Guararema <span className="font-medium">sem compromisso</span>
                            </h3>

                            <p className="text-white/80 mb-8 md:mb-10 text-lg leading-relaxed">
                                Visite a cidade, conheça os bairros e converse com moradores locais. Oferecemos um tour personalizado para você e sua família descobrirem se Guararema é o lugar ideal para seu próximo capítulo.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 md:gap-5">
                                <a
                                    href="/agendar-visita"
                                    className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base font-medium rounded-lg shadow-lg text-gray-900 bg-amber-500 hover:bg-amber-400 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-gray-900"
                                >
                                    Agendar visita guiada
                                </a>

                                <a
                                    href="/contato"
                                    className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base font-medium rounded-lg text-white border border-white/30 hover:bg-white/10 transition-all duration-300 hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-gray-900"
                                >
                                    Falar com um consultor
                                </a>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 sm:p-8 md:p-10 border border-white/10 shadow-lg">
                            <h4 className="text-amber-400 font-medium text-lg mb-6">
                                O que você vai descobrir:
                            </h4>

                            <ul className="space-y-4 md:space-y-5 text-white/90">
                                {[
                                    "Os bairros mais adequados para seu perfil e necessidades",
                                    "As facilidades e serviços disponíveis (escolas, saúde, comércio)",
                                    "Rotas de acesso à capital e tempo médio de deslocamento",
                                    "Oportunidades de investimento com valorização acima da média"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start gap-4">
                                        <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8 pt-6 border-t border-white/10 text-white/60 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <span>Duração média: 3h30min</span>
                                <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-medium">
                                    Inclui almoço em restaurante local
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}