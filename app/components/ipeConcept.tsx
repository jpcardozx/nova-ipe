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

    const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [0.6, 1, 0.8]); const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.02, 1]);
    const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);

    const achievements = [
        {
            value: '15',
            label: 'Anos de mercado',
            icon: <Clock className="w-4 h-4" />,
            accent: true
        },
        {
            value: '300+',
            label: 'Transações',
            icon: <Building className="w-4 h-4" />,
            accent: true
        },
        {
            value: 'CRECI',
            label: 'Certificado',
            icon: <Shield className="w-4 h-4" />,
            accent: false
        },
        {
            value: '100%',
            label: 'Guararema',
            icon: <MapPin className="w-4 h-4" />,
            accent: false
        }
    ];

    const coreValues = [
        {
            title: "Conhecimento Regional",
            description: "Experiência consolidada no mercado de Guararema, com conhecimento aprofundado das características e oportunidades locais.",
            icon: <MapPin className="w-4 h-4" />
        },
        {
            title: "Transparência Integral",
            description: "Processos claros e informações precisas em cada etapa, assegurando confiança e segurança em todas as negociações.",
            icon: <Shield className="w-4 h-4" />
        },
        {
            title: "Atendimento Dedicado",
            description: "Abordagem personalizada e consultoria especializada, alinhada aos objetivos específicos de cada cliente.",
            icon: <Award className="w-4 h-4" />
        }
    ]; return (
        <section
            ref={containerRef}
            className={cn(
                "relative py-24 lg:py-32 overflow-hidden bg-white",
                className
            )}
            id="quem-somos"
        >
            {/* Fundo minimalista */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Gradiente sutil no topo e base */}
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-neutral-50/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-neutral-50/50 to-transparent" />

                {/* Textura de fundo muito sutil */}
                <div className="absolute inset-0 opacity-[0.008]">
                    <div className="h-full w-full" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
                        backgroundSize: '24px 24px'
                    }} />
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8">                {/* Header minimalista */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20 lg:mb-24"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 mb-8">
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                        <span className="text-xs font-medium text-neutral-600 tracking-wide">ESTABELECIDA EM 2010</span>
                    </div>

                    <h2 className="text-4xl lg:text-5xl xl:text-6xl font-light text-neutral-900 leading-[1.1] mb-8 tracking-tight">
                        Excelência em <br className="hidden lg:block" />
                        <span className="font-normal text-neutral-700">
                            mercado imobiliário
                        </span>
                    </h2>

                    <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed font-light">
                        Quinze anos de experiência consolidada no mercado de Guararema,
                        oferecendo soluções imobiliárias com transparência e dedicação.
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
                                    transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }} className={cn(
                                        "relative p-4 rounded-xl border transition-all duration-300 hover:shadow-lg group backdrop-blur-sm",
                                        item.accent
                                            ? "bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-white"
                                            : "bg-white border-neutral-200 hover:border-neutral-300"
                                    )}
                                >                                    <div className={cn(
                                    "inline-flex p-2 rounded-lg mb-3 transition-colors",
                                    item.accent
                                        ? "bg-neutral-800 text-neutral-100"
                                        : "bg-neutral-100 text-neutral-600"
                                )}>
                                        {item.icon}
                                    </div>
                                    <div className={cn(
                                        "text-2xl font-bold mb-1",
                                        item.accent ? "text-white" : "text-neutral-900"
                                    )}>{item.value}</div>
                                    <div className={cn(
                                        "text-xs font-medium uppercase tracking-wider",
                                        item.accent ? "text-neutral-300" : "text-neutral-500"
                                    )}>{item.label}</div>
                                </motion.div>
                            ))}
                        </div>                        {/* Valores da empresa - Design minimalista */}
                        <div className="space-y-8">
                            <h3 className="text-xl font-normal text-neutral-900 mb-10">Nossa abordagem</h3>
                            {coreValues.map((value, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                    transition={{ delay: index * 0.15 + 0.5, duration: 0.6 }}
                                    className="group"
                                >
                                    <div className="flex items-start gap-4 p-6 rounded-lg border border-neutral-200/50 bg-white hover:border-neutral-300/70 hover:bg-neutral-50/30 transition-all duration-300">
                                        <div className="flex-shrink-0 p-2 rounded-md bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200 group-hover:text-neutral-700 transition-colors">
                                            {value.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-base font-medium text-neutral-900 mb-2 group-hover:text-neutral-800 transition-colors">
                                                {value.title}
                                            </h4>
                                            <p className="text-sm text-neutral-600 leading-relaxed font-light">
                                                {value.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>                    {/* Coluna da imagem - Design sofisticado */}
                    <motion.div
                        style={{ scale: imageScale, y: imageY }}
                        className="relative order-1 lg:order-2"
                    >
                        {/* Container principal da imagem */}
                        <div className="relative h-[700px] lg:h-[800px] rounded-lg overflow-hidden">
                            {/* Imagem principal com overlay sutil */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent z-10" />
                            <Image
                                src="/images/predioIpe.png"
                                alt="Sede da Ipê Imóveis - Tradição e Confiança"
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>

                        {/* Card principal - Minimalista */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="absolute bottom-6 left-6 right-6 lg:left-4 lg:right-auto lg:w-72 z-30"
                        >
                            <div className="relative p-6 rounded-lg bg-white/95 backdrop-blur-xl border border-white/30 shadow-xl">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="flex-shrink-0 p-2 rounded-md bg-neutral-900">
                                        <Building className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-medium text-neutral-900 mb-1">Ipê Imóveis</h3>
                                        <p className="text-xs text-neutral-600">Guararema, SP</p>
                                    </div>
                                </div>

                                <p className="text-sm text-neutral-600 leading-relaxed mb-4 font-light">
                                    Ambiente profissional projetado para oferecer atendimento personalizado
                                    e consultoria especializada.
                                </p>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs">
                                        <Shield className="w-3 h-3 text-green-600 flex-shrink-0" />
                                        <span className="text-neutral-700 font-medium">CRECI Regularizado</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Badge de certificação - Minimalista */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                            transition={{ delay: 1.0, duration: 0.6 }}
                            className="absolute top-4 right-4 z-30"
                        >
                            <div className="relative p-3 rounded-lg bg-white/95 backdrop-blur-xl border border-white/30 shadow-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <span className="text-xs font-medium text-neutral-700">Certificado</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Indicador de experiência - Refinado */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                            transition={{ delay: 1.2, duration: 0.6 }}
                            className="absolute top-1/3 -left-3 lg:-left-4 z-30"
                        >
                            <div className="relative p-4 rounded-lg bg-neutral-900 text-white shadow-xl">
                                <div className="text-center">
                                    <div className="text-2xl font-light text-white mb-1">15</div>
                                    <div className="text-xs font-medium text-neutral-300 uppercase tracking-wider">
                                        Anos
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
