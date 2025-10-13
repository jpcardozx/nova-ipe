'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import {
    MapPin, Star, CheckCircle2, Users, Award, FileText, Building2, Home, Briefcase, ClipboardSignature, Megaphone, Handshake, Compass, Network, ShieldCheck, TrendingUp, Sparkles
} from 'lucide-react';

// --- DATA (Elevated & Final) ---
const processos = [
    {
        icon: <ClipboardSignature className="w-7 h-7 text-amber-700" />,
        titulo: "Análise e Estratégia",
        descricao: "Avaliamos seu imóvel e definimos um plano de marketing e divulgação direcionado."
    },
    {
        icon: <Megaphone className="w-7 h-7 text-amber-700" />,
        titulo: "Divulgação e Visitas",
        descricao: "Coordenamos a apresentação do seu imóvel a compradores qualificados em nossa rede."
    },
    {
        icon: <Handshake className="w-7 h-7 text-amber-700" />,
        titulo: "Negociação e Fechamento",
        descricao: "Conduzimos as negociações e a documentação necessária até a conclusão da venda."
    },
    {
        icon: <Sparkles className="w-7 h-7 text-amber-700" />,
        titulo: "Pós-Venda e Relacionamento",
        descricao: "Oferecemos suporte para a transição pós-venda e mantemos um relacionamento para futuras oportunidades."
    }
];

const diferenciais = [
    {
        icon: <Compass className="w-8 h-8 text-amber-600" />,
        metrica: "Conhecimento Local",
        descricao: "Atuação focada em Guararema com histórico de preços e análise de mercado regional."
    },
    {
        icon: <Network className="w-8 h-8 text-amber-600" />,
        metrica: "Rede Estabelecida",
        descricao: "Base de compradores qualificados e parceiros locais para agilizar negociações."
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-amber-600" />,
        metrica: "Orientação Técnica",
        descricao: "Suporte em avaliação, documentação e aspectos legais das transações imobiliárias."
    },
    {
        icon: <TrendingUp className="w-8 h-8 text-amber-600" />,
        metrica: "Experiência Regional",
        descricao: "15 anos de atuação no mercado imobiliário de Guararema e cidades próximas."
    }
];

const garantias = [
    "Análise de mercado detalhada.",
    "Estratégia de divulgação personalizada.",
    "Filtro de compradores qualificados.",
    "Comunicação clara e contínua.",
    "Suporte profissional em todas as etapas."
];

// --- SUB-COMPONENTS (Elevated & Final) ---
const ProcessStep = ({ step, isActive, onHover }: { step: any; isActive: any; onHover: any }) => {
    return (
        <motion.div
            className={`flex items-start gap-6 transition-all duration-500 ease-in-out ${isActive ? 'filter-none' : 'filter saturate-50 opacity-70'}`}
            onMouseEnter={onHover}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
            <motion.div
                className={`flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${isActive ? 'bg-gradient-to-br from-amber-500 to-orange-500 transform scale-100' : 'bg-gray-100 transform scale-90'}`}
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                {step.icon}
            </motion.div>
            <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">{step.titulo}</h4>
                <p className="text-slate-600 leading-relaxed">{step.descricao}</p>
            </div>
        </motion.div>
    );
};

const DifferentialCard = ({ item }: { item: any }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div 
            layout
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
            className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-amber-300 transition-colors duration-300 cursor-pointer overflow-hidden shadow-sm hover:shadow-xl"
            transition={{ layout: { duration: 0.4, type: "spring", stiffness: 300, damping: 30 } }}
        >
            <motion.div layout="position" className="flex flex-col items-center text-center">
                {item.icon}
                <h4 className="text-lg font-bold text-slate-800 mt-3">{item.metrica}</h4>
            </motion.div>
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        <p className="text-sm text-slate-600 text-center">{item.descricao}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// --- MAIN COMPONENT (Elevated & Final) ---
export default function UXOptimizedNovaIpeSection({ className }: { className?: string }) {
    const [activeStep, setActiveStep] = useState(0);
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
    const imageRef = useRef<HTMLDivElement>(null);

    // Parallax effect for image
    const { scrollYProgress } = useScroll({
        target: imageRef,
        offset: ["start end", "end start"]
    });
    const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
    const ySmooth = useSpring(y, { stiffness: 100, damping: 30 });

    useEffect(() => {
        const observers: IntersectionObserver[] = [];
        stepRefs.current.forEach((ref, index) => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveStep(index);
                    }
                },
                { threshold: 0.6, rootMargin: '-45% 0px -45% 0px' }
            );
            if (ref) observer.observe(ref);
            observers.push(observer);
        });
        return () => observers.forEach(observer => observer.disconnect());
    }, []);

    return (
        <section className={`py-20 lg:py-28 bg-white relative overflow-x-hidden ${className}`}>
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'url(/grid-pattern.svg)', backgroundSize: '60px' }} />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-20"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <motion.div
                            className="inline-flex items-center gap-3 px-5 py-2 bg-amber-100/60 border border-amber-200/80 rounded-full mb-6 shadow-sm"
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Award className="w-5 h-5 text-amber-700" />
                            <span className="text-sm text-amber-800 font-semibold">Como Trabalhamos</span>
                        </motion.div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight tracking-tight">
                            Processo de <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Atendimento</span>
                        </h2>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            Etapas claras para segurança e transparência em cada transação imobiliária.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 xl:gap-24">
                        <div className="lg:col-span-7 space-y-12 lg:space-y-16">
                            <div className="relative pl-0 sm:pl-12 mb-12 lg:mb-24">
                                <div className="hidden sm:block absolute left-[48px] top-0 h-full w-1 bg-amber-100 rounded-full" />
                                <motion.div
                                    className="hidden sm:block absolute left-[48px] top-0 h-full w-1 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full"
                                    style={{ scaleY: 0, originY: 0 }}
                                    animate={{ scaleY: activeStep / (processos.length - 1) }}
                                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:space-y-0 sm:gap-6 lg:block lg:space-y-20 lg:gap-0">
                                    {processos.map((step, index) => (
                                        <div key={index} ref={el => { if (stepRefs.current) stepRefs.current[index] = el; }} onMouseEnter={() => setActiveStep(index)}>
                                            <ProcessStep step={step} isActive={activeStep >= index} onHover={() => setActiveStep(index)} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-80px" }}
                                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8 text-center px-4 sm:px-0">Nossos Diferenciais</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    {diferenciais.map((item, index) => (
                                        <DifferentialCard key={index} item={item} />
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-2xl border-t-4 border-amber-500"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <Award className="w-8 h-8 text-amber-400" />
                                    <h3 className="text-2xl font-bold">Nossas Garantias</h3>
                                </div>
                                <ul className="space-y-4">
                                    {garantias.map((garantia, index) => (
                                        <motion.li
                                            key={index}
                                            className="flex items-start gap-3"
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: index * 0.1 }}
                                        >
                                            <CheckCircle2 className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                                            <span className="text-gray-300 leading-relaxed">{garantia}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>

                            <motion.div
                                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <Link href="/contato?assunto=avaliacao" className="group flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 sm:gap-3">
                                    <Home className="w-5 h-5 flex-shrink-0" />
                                    <span>Solicitar Avaliação</span>
                                </Link>
                                <Link href="/contato?assunto=venda" className="group flex-1 bg-white hover:bg-amber-50 border-2 border-amber-200 hover:border-amber-400 text-amber-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 sm:gap-3">
                                    <Briefcase className="w-5 h-5 flex-shrink-0" />
                                    <span>Vender Imóvel</span>
                                </Link>
                            </motion.div>
                        </div>

                        <div className="lg:col-span-5">
                            <div className="sticky top-24 pb-12">
                                <motion.div
                                    ref={imageRef}
                                    style={{ y: ySmooth }}
                                    className="relative group"
                                >
                                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 opacity-80 blur-md group-hover:opacity-100 transition-all duration-500" />
                                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white p-1">
                                        <Image
                                            src="/images/predioIpe.png"
                                            alt="Nova Ipê Imóveis - Escritório em Guararema"
                                            fill
                                            className="object-cover object-center rounded-xl"
                                            sizes="(max-width: 1024px) 100vw, 40vw"
                                            priority
                                        />
                                    </div>
                                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-lg border border-white/20">
                                        CRECI 32.933-J
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}