'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ChevronRight, Building, MapPin, Shield, Users, Award, Clock } from 'lucide-react';
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
    const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1]);

    const achievements = [
        {
            value: '15+',
            label: 'Anos de experiência',
            icon: <Clock className="w-5 h-5 text-amber-500" />
        },
        {
            value: '500+',
            label: 'Famílias atendidas',
            icon: <Users className="w-5 h-5 text-amber-500" />
        },
        {
            value: 'CRECI',
            label: 'Registro oficial',
            icon: <Shield className="w-5 h-5 text-amber-500" />
        },
        {
            value: '100%',
            label: 'Foco em Guararema',
            icon: <MapPin className="w-5 h-5 text-amber-500" />
        }
    ];

    const coreValues = [
        {
            title: "Expertise Local",
            description: "Conhecimento profundo do mercado imobiliário em Guararema e região."
        },
        {
            title: "Transparência",
            description: "Processos claros e informações precisas em todas as etapas da negociação."
        },
        {
            title: "Personalização",
            description: "Atendimento individualizado conforme as necessidades específicas de cada cliente."
        }
    ];
    return (
        <section
            ref={containerRef}
            className={cn(
                "relative py-24 overflow-hidden bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-100",
                className
            )}
            id="quem-somos"
        >
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent" />
                <div className="absolute h-full w-full bg-[url('/images/bg-outlines.svg')] bg-repeat opacity-10" />
            </div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
                    {/* Coluna de texto - Reduzida para dar mais espaço à imagem */}
                    <motion.div
                        style={{ opacity: textOpacity }}
                        className="space-y-6 order-2 lg:order-1 lg:col-span-5"
                    >
                        <span className="text-sm font-medium px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 inline-block mb-2">
                            Desde 2010
                        </span>

                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
                            atuando em Guararema, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-700"> investimentos imobiliários</span> inteligentes
                        </h2>

                        <p className="text-gray-600 text-lg">
                            A Ipê nasceu da visão de transformar a experiência imobiliária em Guararema,
                            combinando conhecimento profundo do mercado local com atendimento personalizado
                            que prioriza as necessidades específicas de cada família.
                        </p>

                        {/* Valores da empresa */}
                        <div className="mt-8 space-y-4">
                            {coreValues.map((value, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                    transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
                                    className="flex items-start gap-3"
                                >
                                    <div className="min-w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                                        <ChevronRight className="w-4 h-4 text-amber-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">{value.title}</h3>
                                        <p className="text-gray-600">{value.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Conquistas */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 py-6 border-t border-amber-200/50">
                            {achievements.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0 }}
                                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                                    transition={{ delay: index * 0.1 + 0.6, duration: 0.5 }}
                                    className="text-center"
                                >
                                    <div className="flex justify-center mb-2">{item.icon}</div>
                                    <div className="text-xl font-bold text-amber-700">{item.value}</div>
                                    <div className="text-sm text-gray-500">{item.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Coluna da imagem - Expandida para dar destaque à imagem vertical */}
                    <motion.div
                        style={{ scale: imageScale }}
                        className="relative h-[550px] lg:h-[700px] order-1 lg:order-2 lg:col-span-7"
                    >
                        <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl">
                            <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/30 to-transparent mix-blend-overlay z-10" />
                            <Image
                                src="/images/predioIpe.png"
                                alt="Sede da Ipê Imóveis em Guararema"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>

                        {/* Card flutuante com informações */}
                        <div className="absolute bottom-8 -left-4 right-auto w-80 p-6 rounded-xl bg-white/95 backdrop-blur-sm shadow-2xl border border-amber-100">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-amber-100 p-2 rounded-full">
                                    <Building className="w-5 h-5 text-amber-700" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">Ipê Imóveis</h3>
                            </div>
                            <p className="text-gray-600 text-sm">
                                Nosso escritório em Guararema foi planejada para proporcionar um ambiente
                                acolhedor, onde cada cliente se sinta à vontade.
                            </p>
                            <div className="flex items-center gap-2 mt-3 text-sm text-amber-700 font-medium">
                                <MapPin className="w-4 h-4" />
                                <span>Centro, Guararema - SP</span>
                            </div>
                        </div>

                        {/* Card flutuante secundário */}
                        <div className="absolute top-10 -right-6 w-64 p-5 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-2xl rotate-3">
                            <div className="flex items-start gap-3 mb-2">
                                <Award className="w-6 h-6 text-amber-200 mt-1" />
                                <div>
                                    <h4 className="font-medium text-white">Equipe reconhecida</h4>
                                    <p className="text-xs text-amber-100">Compromisso com a qualidade em cada negociação</p>
                                </div>
                            </div>
                            <div className="w-full h-px bg-amber-400/30 my-3"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-amber-200">CRECI 12345</span>
                                <span className="text-xs text-amber-200">Desde 2010</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
