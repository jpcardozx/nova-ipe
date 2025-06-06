'use client';

import { useEffect, useState } from 'react';
import { motion, useAnimation } from "framer-motion"
import Image from 'next/image';
import Link from "next/link"
import { ShieldCheck, MessageSquare, ArrowRight, Clock, Star, MapPin } from "lucide-react"

interface BlocoCTAConversaoProps {
    titulo: string
    subtitulo: string
    ctaText: string
    ctaLink: string
}

export default function BlocoCTAConversao({ titulo, subtitulo, ctaText, ctaLink }: BlocoCTAConversaoProps) {
    const controls = useAnimation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const element = document.getElementById('cta-section');

            if (element) {
                const elementTop = element.offsetTop;
                const windowHeight = window.innerHeight;

                if (scrollY > elementTop - windowHeight / 1.5) {
                    setIsVisible(true);
                    controls.start('visible');
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [controls]);

    return (
        <section id="cta-section" className="w-full py-28 px-6 md:px-12 bg-[#0D1F2D] text-white relative overflow-hidden">
            {/* Fundo com padrão sutil */}
            <div className="absolute inset-0 bg-[url('/images/wood-pattern.png')] bg-center opacity-5 pointer-events-none" />

            {/* Gradiente decorativo */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-radial from-[#FFAD43]/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-radial from-blue-500/10 to-transparent rounded-full blur-3xl"></div>

            {/* Elemento decorativo */}
            <motion.div
                className="absolute -top-10 -right-10 w-48 h-48 md:w-64 md:h-64 opacity-10"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            >
                <Image
                    src="/images/circle.svg"
                    alt="Elemento decorativo"
                    width={256}
                    height={256}
                    className="w-full h-full"
                />
            </motion.div>

            <div className="container mx-auto max-w-[1200px] relative z-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={controls}
                        variants={{
                            visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
                        }}
                        className="md:w-1/2"
                    >
                        <div className="max-w-xl">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                                {titulo}
                            </h2>

                            <p className="text-base md:text-xl text-gray-300 mb-8 leading-relaxed">
                                {subtitulo}
                            </p>

                            <div className="flex flex-col sm:flex-row items-start gap-5 mb-8">
                                <Link
                                    href={ctaLink}
                                    className="bg-[#FFAD43] hover:bg-[#FF9F2B] text-[#0D1F2D] px-8 py-4 rounded-full text-base font-medium transition-all duration-300 inline-flex items-center gap-2 shadow-lg shadow-[#FFAD43]/20 hover:shadow-xl hover:shadow-[#FFAD43]/30 hover:-translate-y-1"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                    {ctaText}
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>                                <div className="flex items-center text-stone-300 mt-4 sm:mt-0">
                                    <ShieldCheck className="w-5 h-5 mr-2 text-green-400" />
                                    Consulta confidencial e sem compromisso
                                </div>
                            </div>

                            {/* Características adicionais */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-[#FFAD43]/20 flex items-center justify-center mr-3">
                                        <Clock className="w-5 h-5 text-[#FFAD43]" />
                                    </div>                                    <div>
                                        <h4 className="font-medium text-white">Resposta garantida</h4>
                                        <p className="text-sm text-gray-400">Em até 2 horas úteis</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-[#FFAD43]/20 flex items-center justify-center mr-3">
                                        <Star className="w-5 h-5 text-[#FFAD43]" />
                                    </div>                                    <div>
                                        <h4 className="font-medium text-white">Especialistas locais</h4>
                                        <p className="text-sm text-gray-400">15+ anos em Guararema</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Lado direito - Imagens flutuantes */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={controls}
                        variants={{
                            visible: { opacity: 1, x: 0, transition: { duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] } }
                        }}
                        className="md:w-1/2 relative h-80 md:h-auto"
                    >
                        <div className="relative h-full w-full">
                            <motion.div
                                className="absolute top-0 left-0 w-48 h-64 rounded-lg overflow-hidden shadow-2xl"
                                animate={{ y: [0, -15, 0], rotate: [-2, 0, -2] }}
                                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Image
                                    src="/images/hero-bg.jpg"
                                    alt="Imóvel em Guararema"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-amber-900 to-transparent">
                                    <div className="text-xs font-medium text-white flex items-center">
                                        <MapPin className="w-3 h-3 mr-1" /> Centro, Guararema
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                className="absolute bottom-0 right-0 w-56 h-48 rounded-lg overflow-hidden shadow-2xl"
                                animate={{ y: [0, 15, 0], rotate: [2, 0, 2] }}
                                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            >
                                <Image
                                    src="/images/escritorioInterior.jpg"
                                    alt="Interior de imóvel"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-0 left-0 right-0 p-2">
                                    <span className="text-xs font-medium text-white px-2 py-0.5 rounded-full bg-amber-500 inline-flex items-center">
                                        <Star className="w-3 h-3 mr-1" /> Destaque
                                    </span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
