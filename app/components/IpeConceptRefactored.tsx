'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { 
    Home, 
    Heart, 
    HandHeart, 
    MapPin, 
    Clock, 
    Star, 
    CheckCircle2, 
    ArrowRight,
    Users,
    Award,
    ShieldCheck
} from 'lucide-react';

interface IpeConceptRefactoredProps {
    className?: string;
}

export default function IpeConceptRefactored({ className }: IpeConceptRefactoredProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: '-50px' });

    const qualidades = [
        {
            icon: <Heart className="w-5 h-5" />,
            titulo: "Cuidado Pessoal",
            descricao: "Cada cliente é único, cada história importa. Dedicamos tempo para entender suas necessidades e sonhos."
        },
        {
            icon: <Home className="w-5 h-5" />,
            titulo: "Conhecimento Local",
            descricao: "Nascemos e crescemos em Guararema. Conhecemos cada rua, cada vizinhança, cada oportunidade."
        },
        {
            icon: <HandHeart className="w-5 h-5" />,
            titulo: "Transparência Total",
            descricao: "Processos claros, preços justos, sem surpresas. O que prometemos, cumprimos."
        },
        {
            icon: <ShieldCheck className="w-5 h-5" />,
            titulo: "Segurança Garantida",
            descricao: "Todos os documentos verificados, todos os passos acompanhados. Sua tranquilidade é nossa prioridade."
        }
    ];

    const numeros = [
        {
            valor: "12",
            unidade: "anos",
            descricao: "em Guararema"
        },
        {
            valor: "500+",
            unidade: "famílias",
            descricao: "realizaram sonhos"
        },
        {
            valor: "95%",
            unidade: "recomendam",
            descricao: "nosso trabalho"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <section 
            ref={containerRef}
            className={`py-20 lg:py-28 bg-gradient-to-b from-slate-50 via-white to-slate-50 ${className}`}
        >
            <div className="container mx-auto px-6">
                <motion.div 
                    className="max-w-7xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    {/* Header */}
                    <motion.div 
                        className="text-center mb-16"
                        variants={itemVariants}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-full mb-6">
                            <Star className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-medium text-amber-800">Tradição em Guararema</span>
                        </div>
                        
                        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                            A imobiliária que{' '}
                            <span className="text-transparent bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text">
                                você confia
                            </span>
                        </h2>
                        
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            Mais que uma transação imobiliária, oferecemos uma experiência humana e cuidadosa
                            para encontrar seu lugar ideal em Guararema.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Conteúdo Textual */}
                        <motion.div 
                            className="space-y-8"
                            variants={itemVariants}
                        >
                            {/* Qualidades */}
                            <div className="space-y-6">
                                {qualidades.map((qualidade, index) => (
                                    <motion.div
                                        key={index}
                                        variants={itemVariants}
                                        className="group flex items-start gap-4 p-6 bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center text-amber-600 group-hover:from-amber-500 group-hover:to-orange-500 group-hover:text-white transition-all duration-300">
                                            {qualidade.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                                {qualidade.titulo}
                                            </h3>
                                            <p className="text-slate-600 leading-relaxed">
                                                {qualidade.descricao}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Números */}
                            <motion.div 
                                className="grid grid-cols-3 gap-6 pt-8"
                                variants={itemVariants}
                            >
                                {numeros.map((numero, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-3xl font-bold text-amber-600 mb-1">
                                            {numero.valor}
                                        </div>
                                        <div className="text-sm font-medium text-slate-700">
                                            {numero.unidade}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            {numero.descricao}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>

                            {/* CTA */}
                            <motion.div 
                                className="pt-6"
                                variants={itemVariants}
                            >
                                <a
                                    href="/contato"
                                    className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    <Users className="w-5 h-5" />
                                    Conversar com nossa equipe
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </motion.div>
                        </motion.div>

                        {/* Imagem */}
                        <motion.div 
                            className="relative"
                            variants={itemVariants}
                        >
                            <div className="relative">
                                {/* Container da imagem principal */}
                                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                                    <Image
                                        src="/images/predioIpe.png"
                                        alt="Escritório Nova Ipê Imóveis no centro de Guararema"
                                        fill
                                        className="object-cover object-center scale-105 hover:scale-100 transition-transform duration-700"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        priority
                                    />
                                    
                                    {/* Overlay sutil para melhor contraste */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />
                                </div>

                                {/* Card flutuante de localização */}
                                <motion.div 
                                    className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 max-w-xs"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                    transition={{ delay: 0.8, duration: 0.6 }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 text-sm">
                                                Nossa sede
                                            </p>
                                            <p className="text-slate-600 text-sm">
                                                Praça 9 de Julho, 65
                                            </p>
                                            <p className="text-slate-500 text-xs">
                                                Centro • Guararema/SP
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Badge de certificação */}
                                <motion.div 
                                    className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                                    transition={{ delay: 1, duration: 0.5, type: "spring" }}
                                >
                                    <Award className="w-6 h-6" />
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Seção de confiança */}
                    <motion.div 
                        className="mt-20 text-center"
                        variants={itemVariants}
                    >
                        <div className="inline-flex items-center gap-6 px-8 py-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-600">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span className="text-sm font-medium">CRECI Regularizado</span>
                            </div>
                            <div className="w-px h-6 bg-slate-200" />
                            <div className="flex items-center gap-2 text-slate-600">
                                <Clock className="w-5 h-5 text-blue-500" />
                                <span className="text-sm font-medium">Atendimento Personalizado</span>
                            </div>
                            <div className="w-px h-6 bg-slate-200" />
                            <div className="flex items-center gap-2 text-slate-600">
                                <Star className="w-5 h-5 text-amber-500" />
                                <span className="text-sm font-medium">Tradição em Guararema</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
