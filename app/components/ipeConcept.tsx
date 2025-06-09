'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import {
    Building2,
    Users,
    MapPin,
    Shield,
    TrendingUp,
    CheckCircle2,
    ArrowRight,
    Award,
    Target,
    Clock,
    Star,
    Compass,
    ChevronRight
} from 'lucide-react';

interface IpeInstitutionalProps {
    className?: string;
}

export default function IpeInstitutional({ className }: IpeInstitutionalProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: '-80px' }); const diferenciais = [
        {
            icon: <Target className="w-6 h-6" />,
            titulo: "Inteligência de Mercado",
            descricao: "Análise técnica aprofundada com dados proprietários e insights estratégicos para decisões fundamentadas e timing preciso."
        },
        {
            icon: <Compass className="w-6 h-6" />,
            titulo: "Expertise Territorial",
            descricao: "Conhecimento consolidado em microregiões, ciclos de valorização e oportunidades de crescimento em Guararema e entorno."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            titulo: "Compliance & Segurança",
            descricao: "Metodologia rigorosa com due diligence completa, verificações jurídicas e protocolo de transparência total."
        },
        {
            icon: <TrendingUp className="w-6 h-6" />,
            titulo: "Execução Otimizada",
            descricao: "Processos digitais integrados, automações inteligentes e gestão ativa para resultados acelerados e previsíveis."
        }
    ]; const indicadores = [
        {
            valor: "15+",
            label: "Anos",
            descricao: "de liderança consolidada"
        },
        {
            valor: "650+",
            label: "Negócios",
            descricao: "estruturados com sucesso"
        },
        {
            valor: "97%",
            label: "Excelência",
            descricao: "em satisfação e resultados"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 1.2,
                staggerChildren: 0.15,
                ease: [0.25, 0.25, 0.25, 0.75]
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 32 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.25, 0.25, 0.75]
            }
        }
    };

    const floatingVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.9,
                ease: [0.25, 0.25, 0.25, 0.75]
            }
        }
    }; return (
        <section
            id="ipe-concept"
            ref={containerRef}
            className={`relative py-32 lg:py-40 overflow-hidden ${className}`}
            aria-labelledby="ipe-concept-heading"
        >
            {/* Sophisticated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-white to-amber-50/40" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.04),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(120,113,108,0.03),transparent_50%)]" />

            {/* Subtle texture overlay */}
            <div className="absolute inset-0 opacity-[0.02] bg-gradient-to-br from-stone-900/5 via-transparent to-amber-900/5"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)',
                    backgroundSize: '20px 20px'
                }} />

            <div className="container mx-auto px-6 relative">
                <motion.div
                    className="max-w-7xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    {/* Refined Header */}
                    <motion.div
                        className="text-center mb-24"
                        variants={itemVariants}
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-white/80 to-amber-50/60 backdrop-blur-sm border border-amber-100/50 rounded-full mb-10 shadow-sm">
                            <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" />
                            <span className="text-sm font-medium text-stone-700 tracking-wide">CONHEÇA A IPÊ</span>
                        </div>                        <h2 id="ipe-concept-heading" className="text-5xl lg:text-7xl font-light text-stone-900 mb-8 leading-[0.95] tracking-tight">
                            Expertise que{' '}
                            <span className="font-medium text-transparent bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 bg-clip-text">
                                transforma decisões
                            </span>
                        </h2>

                        <p className="text-xl text-stone-600 max-w-4xl mx-auto leading-relaxed font-light">
                            Desenvolvemos soluções imobiliárias estratégicas através de inteligência de mercado,
                            análise técnica avançada e metodologia proprietária para resultados consistentes e mensuráveis.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-12 gap-16 items-start">
                        {/* Content Grid */}
                        <motion.div
                            className="lg:col-span-7 space-y-12"
                            variants={itemVariants}
                        >
                            {/* Enhanced Diferenciais */}
                            <div className="space-y-6">
                                {diferenciais.map((diferencial, index) => (
                                    <motion.div
                                        key={index}
                                        variants={itemVariants}
                                        className="group relative"
                                    >
                                        {/* Background card with sophisticated hover */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white to-stone-50/30 rounded-3xl border border-stone-100/60 group-hover:border-amber-200/60 transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-amber-500/5" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-amber-500/[0.02] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                        <div className="relative flex items-start gap-6 p-8">
                                            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-stone-100 to-amber-50 rounded-2xl flex items-center justify-center text-stone-600 group-hover:from-amber-100 group-hover:to-amber-200 group-hover:text-amber-700 group-hover:scale-105 transition-all duration-500 shadow-sm group-hover:shadow-md">
                                                {diferencial.icon}
                                            </div>

                                            <div className="flex-1 pt-1">
                                                <h3 className="text-xl font-medium text-stone-900 mb-3 group-hover:text-amber-900 transition-colors duration-300">
                                                    {diferencial.titulo}
                                                </h3>
                                                <p className="text-stone-600 leading-relaxed font-light">
                                                    {diferencial.descricao}
                                                </p>
                                            </div>

                                            <ChevronRight className="w-5 h-5 text-stone-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all duration-300 mt-2" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Refined Indicadores */}
                            <motion.div
                                className="grid grid-cols-3 gap-8 pt-8"
                                variants={itemVariants}
                            >
                                {indicadores.map((indicador, index) => (
                                    <div key={index} className="group text-center">
                                        <div className="relative">
                                            <div className="text-5xl font-light text-transparent bg-gradient-to-br from-amber-600 via-amber-500 to-yellow-600 bg-clip-text mb-2 group-hover:from-amber-500 group-hover:to-amber-600 transition-all duration-500">
                                                {indicador.valor}
                                            </div>
                                            <div className="absolute inset-0 text-5xl font-light text-amber-600/5 blur-sm">
                                                {indicador.valor}
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium text-stone-700 uppercase tracking-wider mb-1">
                                            {indicador.label}
                                        </div>
                                        <div className="text-xs text-stone-500 font-light">
                                            {indicador.descricao}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>

                            {/* Sophisticated CTA */}
                            <motion.div
                                className="pt-12"
                                variants={itemVariants}
                            >
                                <a
                                    href="/contato"
                                    className="group relative inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white font-medium rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-stone-900/20 hover:-translate-y-1"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <Users className="w-5 h-5 relative z-10" />
                                    <span className="relative z-10">Explorar oportunidades estratégicas</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
                                </a>
                            </motion.div>
                        </motion.div>

                        {/* Visual Showcase */}
                        <motion.div
                            className="lg:col-span-5 relative"
                            variants={itemVariants}
                        >
                            <div className="relative">
                                {/* Layered image container */}
                                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                                    {/* Background gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-stone-100 to-amber-50" />

                                    <Image
                                        src="/images/predioIpe.png"
                                        alt="Sede da Nova Ipê Imóveis - Praça 9 de Julho, Guararema"
                                        fill
                                        className="object-cover object-center scale-110 hover:scale-105 transition-transform duration-1000 filter contrast-105 saturate-95"
                                        sizes="(max-width: 768px) 100vw, 45vw"
                                        priority
                                    />

                                    {/* Sophisticated overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/15 via-transparent to-transparent" />
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-stone-500/5" />
                                </div>

                                {/* Floating elements with depth */}
                                <motion.div
                                    className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/40 max-w-xs"
                                    variants={floatingVariants}
                                    initial="hidden"
                                    animate={isInView ? "visible" : "hidden"}
                                    transition={{ delay: 1.0 }}
                                >
                                    <div className="flex items-start gap-5">
                                        <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                            <MapPin className="w-6 h-6 text-amber-700" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-stone-900 mb-2 text-sm">
                                                Localização Estratégica
                                            </p>
                                            <p className="text-stone-700 text-sm font-medium">
                                                Praça 9 de Julho, 65
                                            </p>
                                            <p className="text-stone-500 text-sm">
                                                Centro • Guararema/SP
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Performance badge */}
                                <motion.div
                                    className="absolute -top-4 -right-4 bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-4 rounded-2xl shadow-xl shadow-emerald-500/20"
                                    initial={{ opacity: 0, scale: 0.8, rotate: -12 }}
                                    animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.8, rotate: -12 }}
                                    transition={{ delay: 1.2, duration: 0.8, type: "spring", bounce: 0.25 }}
                                >
                                    <Award className="w-7 h-7" />
                                </motion.div>

                                {/* Performance indicator */}
                                <motion.div
                                    className="absolute top-6 -right-8 bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg border border-white/30"
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                                    transition={{ delay: 1.4, duration: 0.6 }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-sm font-medium text-stone-700">Performance consolidada</span>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Trust Indicators */}
                    <motion.div
                        className="mt-32 text-center"
                        variants={itemVariants}
                    >                        <div className="inline-flex flex-wrap items-center gap-8 px-12 py-6 bg-gradient-to-r from-white/60 via-white/80 to-white/60 backdrop-blur-sm rounded-3xl border border-stone-100/60 shadow-sm">
                            <div className="flex items-center gap-3 text-stone-600">
                                <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" />
                                <span className="text-sm font-medium">Certificação CRECI</span>
                            </div>
                            <div className="w-px h-6 bg-stone-200/60" />
                            <div className="flex items-center gap-3 text-stone-600">
                                <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" />
                                <span className="text-sm font-medium">Assessoria Técnica</span>
                            </div>
                            <div className="w-px h-6 bg-stone-200/60" />
                            <div className="flex items-center gap-3 text-stone-600">
                                <div className="w-2 h-2 bg-gradient-to-r from-stone-400 to-stone-500 rounded-full" />
                                <span className="text-sm font-medium">Liderança Regional</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}