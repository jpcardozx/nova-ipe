"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";

// Definição da fonte com preload para melhor performance
const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-montserrat",
    display: "swap",
});

// Interfaces tipadas
interface BuyerProfile {
    id: string;
    title: string;
    description: string;
    painPoints: string[];
    solutions: string[];
    roi: string;
    icon: string;
    imagePath: string;
}

interface Statistic {
    id: string;
    value: string;
    label: string;
    detail: string;
    color: string;
    highlight?: boolean;
}

interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    image: string;
    rating: number;
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
        className={cn(
            "relative py-16 px-6 md:px-8 text-center",
            stat.highlight ? "bg-amber-50 rounded-xl shadow-sm" : ""
        )}
        style={{
            borderLeft: index > 0 && !stat.highlight ? "1px solid rgba(229, 231, 235, 0.5)" : "none"
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

const TestimonialCard = ({ testimonial, isInView }: {
    testimonial: Testimonial;
    isInView: boolean;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
    >
        <div className="flex items-center mb-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                />
            </div>
            <div>
                <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
            </div>
        </div>
        <div className="flex mb-4">
            {[...Array(5)].map((_, i) => (
                <svg
                    key={i}
                    className={cn(
                        "w-4 h-4",
                        i < testimonial.rating ? "text-amber-400" : "text-gray-300"
                    )}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
        <p className="text-gray-700 italic">"{testimonial.content}"</p>
    </motion.div>
);

// Constantes movidas para fora do componente para evitar recriações
const BUYER_PROFILES: BuyerProfile[] = [
    {
        id: "investors",
        title: "Investidores",
        description: "O momento perfeito para investir em Guararema, com valorização imobiliária comprovada de 22% ao ano nos últimos 3 anos.",
        painPoints: [
            "Retornos decepcionantes em áreas saturadas da capital",
            "Dificuldade em encontrar ativos com margem real de crescimento",
            "Insegurança sobre o potencial de novas regiões"
        ],
        solutions: [
            "Terrenos com valorização projetada de 22% para 2026",
            "Zoneamento comercial-residencial com flexibilidade de uso",
            "Baixo custo de entrada comparado às capitais"
        ],
        roi: "ROI médio de 28% em 18 meses nos empreendimentos da fase 1, com liquidez garantida por demanda crescente.",
        icon: "/images/investment.png",
        imagePath: "/images/investment-growth.jpg"
    },
    {
        id: "families",
        title: "Famílias",
        description: "Transforme a vida da sua família com um ambiente seguro, espaços amplos e qualidade educacional premiada nacionalmente.",
        painPoints: [
            "Insegurança persistente nos bairros urbanos",
            "Falta de espaço adequado para crianças brincarem",
            "Preocupação com a qualidade do ensino público"
        ],
        solutions: [
            "Comunidades planejadas com segurança integrada",
            "Média de 280m² de área verde por residência",
            "Escolas com metodologia finlandesa e 96% de aprovação em universidades"
        ],
        roi: "Economia de R$4.200/mês em gastos com escola particular, segurança privada e lazer em comparação com São Paulo.",
        icon: "/images/family.png",
        imagePath: "/images/families-lifestyle.jpg"
    },
    {
        id: "executives",
        title: "Executivos",
        description: "Equilibre seu sucesso profissional com qualidade de vida real – sem comprometer seu acesso aos centros empresariais.",
        painPoints: [
            "Burnout causado pela rotina urbana estressante",
            "Tempo excessivo perdido em deslocamentos",
            "Custo de vida elevado sem retorno em bem-estar"
        ],
        solutions: [
            "Acesso direto à capital em 55 minutos pela Rodovia Ayrton Senna",
            "Infraestrutura para home office com internet de fibra ótica",
            "Ambiente natural que reduz estresse e melhora produtividade"
        ],
        roi: "Aumento médio de 18% em produtividade e redução de 35% em custos fixos comprovados por pesquisa com 156 executivos residentes.",
        icon: "/images/traffic.png",
        imagePath: "/images/executives-lifestyle.jpg"
    }
];

const STATISTICS: Statistic[] = [
    {
        id: "valuation",
        value: "22%",
        label: "Valorização anual",
        detail: "média nos últimos 3 anos, superando em 3x o índice nacional",
        color: "#4CAF50",
        highlight: true
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

const TESTIMONIALS: Testimonial[] = [
    {
        id: "testimonial1",
        name: "Marcelo Almeida",
        role: "Investidor e morador há 2 anos",
        content: "Investi em um lote por R$180 mil em 2023 que hoje já vale R$245 mil. A infraestrutura evolui rapidamente e a demanda só cresce.",
        image: "/images/testimonial-1.jpg",
        rating: 5
    },
    {
        id: "testimonial2",
        name: "Fernanda Ribeiro",
        role: "Gerente de Marketing, moradora há 3 anos",
        content: "Trabalho em São Paulo 3 vezes por semana e consigo equilibrar minha carreira com qualidade de vida real para minha família.",
        image: "/images/testimonial-2.jpg",
        rating: 5
    },
    {
        id: "testimonial3",
        name: "Carlos e Patrícia Silva",
        role: "Família com 2 filhos, moradores há 1 ano",
        content: "Nossos filhos estudam em escolas excelentes, brincam ao ar livre e fizemos amigos verdadeiros na comunidade. Escolha que mudou nossas vidas.",
        image: "/images/testimonial-3.jpg",
        rating: 5
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
    const [activeProfile, setActiveProfile] = useState<string>("investors");
    const [isInView, setIsInView] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);

    // Obter o perfil atual com useMemo para evitar recálculos desnecessários
    const currentProfile = useMemo(() =>
        BUYER_PROFILES.find(profile => profile.id === activeProfile) || BUYER_PROFILES[0],
        [activeProfile]
    );

    // Usar IntersectionObserver para animações baseadas em scroll
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
                {/* Cabeçalho com proposta de valor clara */}
                <motion.div
                    className="text-center mb-16 md:mb-20"
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={fadeInUp}
                >
                    <span className="inline-block text-amber-600 text-sm font-semibold uppercase tracking-wide mb-3">
                        Oportunidade Exclusiva
                    </span>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-light text-gray-900 mb-6 tracking-tight">
                        <span className="font-semibold">Guararema.</span> O novo epicentro de valorização imobiliária.
                    </h2>

                    <div className="w-24 h-1 bg-amber-500 mx-auto mb-8" aria-hidden="true"></div>

                    <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
                        Descubra por que empresários, investidores e famílias estão migrando para a região
                        com maior potencial de valorização no estado de São Paulo.
                    </p>
                </motion.div>

                {/* Seção 1: Dados estatísticos com visualização refinada de impacto */}
                <div className="mb-24 md:mb-32">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 relative">
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

                    <motion.div
                        className="mt-10 text-center"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <span className="bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-medium inline-flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Últimas 12 unidades disponíveis na Fase 1 do empreendimento com estas condições
                        </span>

                        <div className="mt-4 text-right">
                            <span className="text-gray-500 text-xs italic">
                                Dados: SECOVI-SP 2024, SSP-SP, Pesquisa Exclusiva Ipê Imóveis 2025
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* Seção 2: Perfis de investidores com seleção contextual */}
                <div className="mb-24 md:mb-32">
                    <motion.h3
                        className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-900 text-center mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <span className="font-medium">O investimento inteligente</span> para o seu perfil.
                    </motion.h3>

                    <motion.p
                        className="text-center text-gray-700 max-w-3xl mx-auto mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.15 }}
                    >
                        Identifique como Guararema resolve precisamente suas necessidades atuais
                        e entrega um retorno substancial para seu futuro.
                    </motion.p>

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
                                            Solução Personalizada
                                        </span>

                                        <h4 className="text-2xl md:text-3xl font-medium text-gray-900 mb-4">
                                            {currentProfile.title}
                                        </h4>

                                        <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                                            {currentProfile.description}
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                                                    <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                    Seus desafios atuais
                                                </h5>
                                                <ul className="space-y-2 text-gray-700">
                                                    {currentProfile.painPoints.map((point, idx) => (
                                                        <li key={idx} className="flex items-start">
                                                            <svg className="w-4 h-4 text-gray-400 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                            </svg>
                                                            {point}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div>
                                                <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                                                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Nossa solução
                                                </h5>
                                                <ul className="space-y-2 text-gray-700">
                                                    {currentProfile.solutions.map((solution, idx) => (
                                                        <li key={idx} className="flex items-start">
                                                            <svg className="w-4 h-4 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                            {solution}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-lg p-6 border-l-4 border-green-500 shadow-sm">
                                            <h5 className="font-semibold text-gray-900 mb-2">ROI Comprovado:</h5>
                                            <p className="text-gray-700 leading-relaxed">
                                                {currentProfile.roi}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="md:col-span-5">
                                        <div className="aspect-[4/3] relative rounded-xl overflow-hidden shadow-2xl transform md:rotate-1 transition-transform duration-500 hover:rotate-0 group">
                                            <Image
                                                src={currentProfile.imagePath}
                                                alt={`Investimento em Guararema para ${currentProfile.title}`}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 40vw"
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                priority={activeProfile === BUYER_PROFILES[0].id}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/30"></div>

                                            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                                                <span className="inline-block bg-amber-500 text-gray-900 px-3 py-1 rounded text-sm font-medium">
                                                    {activeProfile === "investors"
                                                        ? "Últimas unidades"
                                                        : activeProfile === "families"
                                                            ? "Alta demanda"
                                                            : "Acesso premium"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Seção 3: Testimonials para prova social */}
                <motion.div
                    className="mb-24 md:mb-32"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.3 }}
                >
                    <h3 className="text-2xl md:text-3xl font-light text-gray-900 text-center mb-6">
                        <span className="font-medium">Histórias reais</span> de sucesso em Guararema
                    </h3>

                    <p className="text-center text-gray-700 max-w-3xl mx-auto mb-12">
                        Descubra como nossos clientes transformaram suas vidas e patrimônio através dos nossos empreendimentos.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map((testimonial) => (
                            <TestimonialCard
                                key={testimonial.id}
                                testimonial={testimonial}
                                isInView={isInView}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* CTA Seção - Design premium com foco em valor e urgência */}
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
                            <span className="inline-block bg-amber-500 text-gray-900 px-3 py-1 rounded text-sm font-medium mb-4">
                                Oferta por tempo limitado
                            </span>

                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-light text-white mb-6 tracking-tight">
                                Análise de investimento <span className="font-medium">exclusiva e personalizada</span>
                            </h3>

                            <p className="text-white/80 mb-8 md:mb-10 text-lg leading-relaxed">
                                Receba um estudo completo sobre como investir em Guararema pode multiplicar seu patrimônio nos próximos 5 anos. Inclui análise comparativa com outros mercados e projeção financeira personalizada.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 md:gap-5">
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base font-medium rounded-lg shadow-lg text-gray-900 bg-amber-500 hover:bg-amber-400 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-gray-900"
                                >
                                    Solicitar análise gratuita
                                </button>

                                <a
                                    href="/catalogo-premium"
                                    className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base font-medium rounded-lg text-white border border-white/30 hover:bg-white/10 transition-all duration-300 hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-gray-900"
                                >
                                    Ver catálogo exclusivo
                                </a>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 sm:p-8 md:p-10 border border-white/10 shadow-lg">
                            <h4 className="text-amber-400 font-medium text-lg mb-6">
                                Sua análise personalizada inclui:
                            </h4>

                            <ul className="space-y-4 md:space-y-5 text-white/90">
                                {[
                                    "Projeção financeira baseada em dados históricos e tendências de mercado",
                                    "Comparativo de custo-benefício entre Guararema e regiões similares",
                                    "Estratégias de alocação e diversificação para maximizar retornos",
                                    "Análise de risco e oportunidades específicas para seu perfil"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start gap-4">
                                        <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8 pt-6 border-t border-white/10 text-white/60">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                        <span>Entrega em até 48 horas</span>
                                    </div>
                                    <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-medium">
                                        100% gratuito e sem compromisso
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Modal para formulário de captura */}
                <AnimatePresence>
                    {showModal && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                                onClick={() => setShowModal(false)}
                            >
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.95, opacity: 0 }}
                                    transition={{ type: "spring", damping: 20 }}
                                    className="bg-white rounded-xl p-6 sm:p-8 max-w-lg w-full shadow-2xl"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="text-2xl font-medium text-gray-900">
                                            Solicite sua análise exclusiva
                                        </h4>
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="text-gray-500 hover:text-gray-700"
                                            aria-label="Fechar"
                                        >
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <form className="space-y-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                Nome completo
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                                placeholder="Seu nome completo"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                E-mail
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                                placeholder="Seu melhor e-mail"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                                Telefone / WhatsApp
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                                placeholder="(00) 00000-0000"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="investment" className="block text-sm font-medium text-gray-700 mb-1">
                                                Faixa de investimento
                                            </label>
                                            <select
                                                id="investment"
                                                name="investment"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                                required
                                            >
                                                <option value="">Selecione uma opção</option>
                                                <option value="até 200k">Até R$ 200.000</option>
                                                <option value="200k-500k">R$ 200.000 - R$ 500.000</option>
                                                <option value="500k-1m">R$ 500.000 - R$ 1.000.000</option>
                                                <option value="acima-1m">Acima de R$ 1.000.000</option>
                                            </select>
                                        </div>

                                        <div className="flex items-start">
                                            <input
                                                type="checkbox"
                                                id="consent"
                                                name="consent"
                                                className="h-5 w-5 text-amber-500 border-gray-300 rounded focus:ring-amber-500 mt-1"
                                                required
                                            />
                                            <label htmlFor="consent" className="ml-2 block text-sm text-gray-600">
                                                Concordo em receber comunicações sobre oportunidades de investimento em Guararema.
                                            </label>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full px-6 py-4 bg-amber-500 text-gray-900 rounded-lg font-medium shadow-lg hover:bg-amber-400 transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2"
                                        >
                                            Receber minha análise personalizada
                                        </button>
                                    </form>

                                    <p className="text-xs text-gray-500 mt-4 text-center">
                                        Seus dados estão seguros e não serão compartilhados com terceiros.
                                        Ao solicitar, você receberá sua análise em até 48 horas.
                                    </p>
                                </motion.div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Nova seção de urgência */}
                <motion.div
                    className="mt-16 mb-8 flex flex-col md:flex-row items-center justify-between p-6 bg-amber-50 rounded-xl border border-amber-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className="flex items-center mb-4 md:mb-0">
                        <svg className="w-10 h-10 text-amber-500 mr-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <h4 className="text-gray-900 font-medium">Oportunidade com prazo definido</h4>
                            <p className="text-gray-700">Última fase com preços atuais. Reajuste previsto para 15/06/2025.</p>
                        </div>
                    </div>
                    <div className="text-amber-700 font-medium bg-amber-200 px-4 py-2 rounded-lg">
                        Unidades limitadas disponíveis
                    </div>
                </motion.div>
            </div>
        </section>
    );
}