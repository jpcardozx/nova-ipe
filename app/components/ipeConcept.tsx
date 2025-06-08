'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { MapPin, Shield, Award, Clock, Building, Users, TrendingUp, CheckCircle } from 'lucide-react';
import SectionWrapper from '@/app/components/ui/SectionWrapper';

interface IpeConceptProps {
    className?: string;
}

export default function IpeConcept({ className }: IpeConceptProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: false, margin: '-100px' });

    const achievements = [
        {
            icon: <Clock className="w-5 h-5" />,
            value: '15+',
            label: 'Anos',
            description: 'de experiência'
        },
        {
            icon: <Building className="w-5 h-5" />,
            value: '500+',
            label: 'Transações',
            description: 'bem-sucedidas'
        },
        {
            icon: <TrendingUp className="w-5 h-5" />,
            value: '98%',
            label: 'Satisfação',
            description: 'dos clientes'
        },
        {
            icon: <Users className="w-5 h-5" />,
            value: '1000+',
            label: 'Clientes',
            description: 'atendidos'
        }
    ];

    const differentials = [
        {
            title: "Expertise Regional",
            description: "Conhecimento especializado do mercado imobiliário de Guararema e região, proporcionando análises precisas e oportunidades estratégicas.",
            icon: <MapPin className="w-5 h-5" />
        },
        {
            title: "Segurança Jurídica",
            description: "Rigoroso acompanhamento documental e jurídico em todas as etapas da transação, garantindo total segurança e conformidade legal.",
            icon: <Shield className="w-5 h-5" />
        },
        {
            title: "Excelência no Atendimento",
            description: "Consultoria personalizada e acompanhamento profissional em todo o processo, com foco na satisfação e tranquilidade do cliente.",
            icon: <Award className="w-5 h-5" />
        }
    ];

    const certifications = [
        "CRECI regularizado",
        "Equipe qualificada",
        "Conformidade legal",
        "Análise técnica"
    ];

    return (
        <SectionWrapper
            id="quem-somos"
            className={className}
            background="gradient"
            badge="TRADIÇÃO E CONFIANÇA"
            title="Referência no mercado imobiliário"
            subtitle="Consolidada expertise em Guararema, oferecendo soluções imobiliárias com segurança e profissionalismo."
        >
            <div ref={containerRef} className="relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                    {/* Coluna da imagem - 6/12 em desktop */}
                    <div className="lg:col-span-6 relative order-2 lg:order-1">
                        <div className="relative rounded-2xl overflow-hidden">
                            <div className="relative h-[400px] md:h-[500px] lg:h-[580px] rounded-2xl overflow-hidden shadow-xl">
                                <div className="absolute inset-0 border-2 border-primary/10 rounded-2xl z-20 pointer-events-none" />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-darkest/30 via-transparent to-transparent z-10" />

                                <Image
                                    src="/images/predioIpe.png"
                                    alt="Sede Ipê Imóveis - Praça 9 de Julho, Guararema"
                                    fill
                                    className="object-cover object-center"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />

                                <div className="absolute bottom-6 left-0 right-0 mx-6 z-20">
                                    <div className="bg-white/95 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-primary/10">
                                        <div className="flex items-start gap-4">
                                            <div className="bg-primary p-3 rounded-lg flex-shrink-0">
                                                <MapPin className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-primary-darkest mb-1">Sede Ipê Imóveis</h3>
                                                <p className="text-sm text-neutral-600 mb-3">Praça 9 de Julho, 65 - Centro, Guararema/SP</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {certifications.map((cert, i) => (
                                                        <div key={i} className="flex items-center gap-1.5 text-xs">
                                                            <CheckCircle className="w-3.5 h-3.5 text-primary" />
                                                            <span className="text-neutral-700">{cert}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Coluna de conteúdo - 6/12 em desktop */}
                    <div className="lg:col-span-6 space-y-10 order-1 lg:order-2">
                        {/* Grid de métricas */}
                        <div className="grid grid-cols-2 gap-4 sm:gap-6">
                            {achievements.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                                    className="group p-5 rounded-xl border border-primary/10 bg-white hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="bg-gradient-to-br from-primary-light to-primary/10 p-3 rounded-lg text-primary group-hover:text-primary-dark transition-colors">
                                            {item.icon}
                                        </div>
                                        <div className="text-2xl font-bold text-primary-darkest group-hover:text-primary-dark transition-colors">
                                            {item.value}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm font-semibold text-neutral-800">{item.label}</div>
                                        <div className="text-xs text-neutral-600">{item.description}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Diferenciais */}
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                                <span className="text-xs font-medium text-primary">NOSSOS DIFERENCIAIS</span>
                            </div>

                            <div className="space-y-6">
                                {differentials.map((differential, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                        transition={{ delay: index * 0.15 + 0.5, duration: 0.5 }}
                                    >
                                        <div className="flex items-start gap-4 p-5 rounded-xl border border-primary/10 bg-white hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                                            <div className="flex-shrink-0 p-3 rounded-lg bg-gradient-to-br from-primary to-primary-dark text-white">
                                                {differential.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-semibold text-primary-darkest mb-2">
                                                    {differential.title}
                                                </h4>
                                                <p className="text-neutral-600 leading-relaxed text-sm">
                                                    {differential.description}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}
