'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Building, MapPin, Shield, Users, Award, Clock, Check, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IpeConceptProps {
    className?: string;
}

export default function IpeConcept({ className }: IpeConceptProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: false, margin: '-100px' });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [0.6, 1, 0.8]);
    const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1]); const achievements = [
        {
            value: '15+',
            label: 'Anos de experiência',
            icon: <Clock className="w-5 h-5" />,
            highlight: true
        },
        {
            value: '500+',
            label: 'Famílias realizadas',
            icon: <Users className="w-5 h-5" />,
            highlight: true
        },
        {
            value: '98%',
            label: 'Satisfação cliente',
            icon: <Star className="w-5 h-5" />,
            highlight: false
        },
        {
            value: 'CRECI',
            label: 'Registro oficial',
            icon: <Shield className="w-5 h-5" />,
            highlight: false
        }
    ];

    const coreValues = [
        {
            title: "Expertise Local Incomparável",
            description: "Mais de uma década de conhecimento profundo do mercado imobiliário em Guararema e região, com insights exclusivos que fazem a diferença.",
            icon: <MapPin className="w-5 h-5" />
        },
        {
            title: "Transparência Total",
            description: "Processos cristalinos e informações precisas em cada etapa. Você sempre sabe exatamente onde está sua negociação.",
            icon: <Shield className="w-5 h-5" />
        },
        {
            title: "Atendimento Excepcional",
            description: "Cada cliente é único. Personalizamos nossa abordagem para atender suas necessidades específicas com excelência.",
            icon: <Award className="w-5 h-5" />
        }
    ]; return (
        <section
            ref={containerRef}
            className={cn(
                "relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white",
                className
            )}
            id="quem-somos"
        >
            {/* Elementos de fundo refinados */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />

                {/* Grid sutil de fundo */}
                <div className="absolute inset-0 opacity-[0.02]">
                    <div className="h-full w-full" style={{
                        backgroundImage: `
                            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '32px 32px'
                    }} />
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8">
                {/* Header da seção */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16 lg:mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200/50 mb-6">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-sm font-medium text-amber-800">Desde 2010 em Guararema</span>
                    </div>

                    <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 leading-tight mb-6">
                        Experiência que <br className="hidden lg:block" />
                        <span className="relative">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800">
                                transforma sonhos
                            </span>
                            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full opacity-20" />
                        </span>
                        <br className="hidden lg:block" />
                        em realidade
                    </h2>

                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Há mais de uma década transformando vidas através do mercado imobiliário em Guararema.
                        Nossa expertise local e compromisso com a excelência garantem que cada cliente encontre
                        exatamente o que procura.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                    {/* Coluna de conteúdo */}
                    <motion.div
                        style={{ opacity: textOpacity }}
                        className="space-y-10 order-2 lg:order-1"
                    >
                        {/* Métricas de credibilidade */}
                        <div className="grid grid-cols-2 gap-6">
                            {achievements.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                    transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                                    className={cn(
                                        "relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg group",
                                        item.highlight
                                            ? "bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200 hover:border-amber-300"
                                            : "bg-white border-slate-200 hover:border-slate-300"
                                    )}
                                >
                                    <div className={cn(
                                        "inline-flex p-3 rounded-xl mb-4 transition-colors",
                                        item.highlight
                                            ? "bg-amber-200 text-amber-700 group-hover:bg-amber-300"
                                            : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                                    )}>
                                        {item.icon}
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900 mb-1">{item.value}</div>
                                    <div className="text-sm font-medium text-slate-600">{item.label}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Valores da empresa */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-slate-900 mb-8">Por que escolher a Ipê?</h3>
                            {coreValues.map((value, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                                    transition={{ delay: index * 0.2 + 0.5, duration: 0.6 }}
                                    className="group"
                                >
                                    <div className="flex items-start gap-4 p-6 rounded-2xl border border-slate-200 bg-white hover:border-amber-200 hover:bg-amber-50/30 transition-all duration-300">
                                        <div className="flex-shrink-0 p-3 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors">
                                            {value.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-amber-900 transition-colors">
                                                {value.title}
                                            </h4>
                                            <p className="text-slate-600 leading-relaxed">
                                                {value.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>                    {/* Coluna da imagem - Otimizada para imagem vertical */}
                    <motion.div
                        style={{ scale: imageScale }}
                        className="relative order-1 lg:order-2"
                    >
                        {/* Container principal da imagem */}
                        <div className="relative h-[600px] lg:h-[800px] rounded-3xl overflow-hidden">
                            {/* Imagem principal */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent z-10" />
                            <Image
                                src="/images/predioIpe.png"
                                alt="Sede da Ipê Imóveis em Guararema - Tradição e Confiança"
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />

                            {/* Overlay sutil para realçar os cards */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent z-20" />
                        </div>

                        {/* Card principal - Informações da empresa */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="absolute bottom-8 left-8 right-8 lg:left-6 lg:right-auto lg:w-80 z-30"
                        >
                            <div className="relative p-8 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl">
                                {/* Linha decorativa no topo */}
                                <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full" />

                                <div className="flex items-start gap-4 mb-6">
                                    <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
                                        <Building className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-1">Ipê Imóveis</h3>
                                        <p className="text-sm text-amber-600 font-medium">Tradição em Guararema</p>
                                    </div>
                                </div>

                                <p className="text-slate-600 leading-relaxed mb-6">
                                    Nossa sede foi projetada para oferecer um ambiente acolhedor e profissional,
                                    onde cada cliente se sente verdadeiramente em casa.
                                </p>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                        <span className="text-slate-700 font-medium">Centro de Guararema - SP</span>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm">
                                        <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
                                        <span className="text-slate-700">CRECI Regularizado</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Badge de credibilidade */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                            transition={{ delay: 1.0, duration: 0.6 }}
                            className="absolute top-6 right-6 z-30"
                        >
                            <div className="relative p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <Award className="w-5 h-5 text-emerald-100" />
                                    <span className="text-sm font-semibold">Certificado</span>
                                </div>
                                <div className="text-xs text-emerald-100">
                                    Empresa verificada
                                </div>

                                {/* Selo de verificação */}
                                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-lg">
                                    <Check className="w-4 h-4 text-emerald-600" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Indicador de anos de experiência */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                            transition={{ delay: 1.2, duration: 0.6 }}
                            className="absolute top-1/4 -left-4 lg:-left-6 z-30"
                        >
                            <div className="relative p-6 rounded-2xl bg-white shadow-2xl border border-slate-200">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-amber-600 mb-1">15+</div>
                                    <div className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                                        Anos de<br />Experiência
                                    </div>
                                </div>

                                {/* Decoração */}
                                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 animate-pulse" />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
