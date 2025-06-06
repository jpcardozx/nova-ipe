"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, MapPin, Calendar } from "lucide-react";

// Definição de tipos
interface Testimonial {
    id: string;
    name: string;
    role: string;
    location: string;
    property: string;
    quote: string;
    image: string;
    date: string;
}

interface ReferenciasProps {
    title?: string;
    description?: string;
    ctaLink?: string;
    ctaText?: string;
    badge?: string;
}

// Dados dos depoimentos
const testimonials: Testimonial[] = [
    {
        id: "t1",
        name: "Elvira Mendes",
        role: "Proprietária satisfeita",
        location: "Guararema, SP",
        property: "Condomínio Portal das Araucárias - Casa 3 quartos",
        quote: "A equipe da Ipê foi fundamental para encontrar nossa casa ideal. Nos orientaram sobre o melhor bairro para nossa família e hoje estamos muito felizes com a mudança para Guararema. As crianças adoram o espaço e a tranquilidade.",
        image: "/images/cliente1.png",
        date: "Março 2025"
    },
    {
        id: "t2",
        name: "José Luiz Ferreira",
        role: "Cliente fidelizado - Várias transações",
        location: "Guararema, SP",
        property: "Centro Histórico - Casa reformada",
        quote: "Trabalho com a Ipê há mais de 10 anos. Compramos nossa primeira casa aqui e depois ajudaram minha filha a encontrar o dela também. Conhecem muito bem a região e sempre nos orientaram da melhor forma.",
        image: "/images/cliente2.png",
        date: "Janeiro 2025"
    },
    {
        id: "t3",
        name: "Marcelo Andrade",
        role: "Mudança de São Paulo",
        location: "Mogi das Cruzes, SP",
        property: "Quinta dos Ipês - Casa com piscina",
        quote: "Saímos de São Paulo em busca de qualidade de vida. A Ipê nos mostrou exatamente o que estávamos procurando: uma casa com espaço para as crianças, natureza ao redor e ainda assim perto de tudo. Foi a melhor decisão que tomamos.",
        image: "/images/cliente3.png",
        date: "Fevereiro 2025"
    },
    {
        id: "t4",
        name: "Ricardo e Ana Silva",
        role: "Primeira casa própria",
        location: "Guararema, SP",
        property: "Chácara Monte Sereno - Terreno com casa",
        quote: "Era nossa primeira compra de imóvel e tínhamos muitas dúvidas. A Ipê nos explicou tudo com paciência, nos mostrou diferentes opções e nos ajudou a negociar um preço justo. Recomendamos para quem busca honestidade.",
        image: "/images/cliente4.png",
        date: "Dezembro 2024"
    }
];

const TestimonialSection: React.FC<ReferenciasProps> = (props) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
    const touchStartX = useRef<number>(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const currentTestimonial = testimonials[currentIndex];

    const handleNavigation = (direction: number): void => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        const newIndex = (currentIndex + direction + testimonials.length) % testimonials.length;
        setCurrentIndex(newIndex);

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setIsTransitioning(false), 600);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>): void => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>): void => {
        if (isTransitioning) return;

        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX;

        if (Math.abs(diff) > 50) {
            handleNavigation(diff > 0 ? 1 : -1);
        }
    };

    // Cleanup ao desmontar o componente
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    useEffect(() => {
        // Auto-play functionality
        timerRef.current = setTimeout(() => {
            handleNavigation(1);
        }, 5000);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [currentIndex]); return (
        <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-20 md:py-32 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-slate-100/30"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12 md:mb-16">
                    <span className="inline-block bg-blue-600/10 text-blue-800 px-6 py-3 rounded-full text-sm font-bold mb-6 border border-blue-200">
                        ⭐ Histórias de Sucesso Verificadas
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-heading leading-tight">
                        {props.title || "Clientes que confiam na nossa expertise"}
                    </h2>
                    <p className="text-xl text-slate-700 max-w-3xl mx-auto font-body leading-relaxed">
                        {props.description || "Conheça histórias reais de quem encontrou sua oportunidade ideal com nossa consultoria especializada."}
                    </p>
                </div>

                {/* Testimonial Carousel */}
                <div
                    className="relative max-w-5xl mx-auto"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentTestimonial.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-white rounded-3xl p-10 md:p-12 border-2 border-blue-100 shadow-2xl hover:shadow-3xl transition-all duration-500"
                        >
                            {/* Conteúdo principal */}
                            <div className="flex flex-col lg:flex-row gap-10 items-start">
                                {/* Texto do depoimento */}
                                <div className="flex-1">
                                    <div className="flex items-start gap-6 mb-8">
                                        <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                            <Quote size={28} className="text-white" />
                                        </div>
                                        <blockquote className="text-slate-800 text-xl md:text-2xl font-semibold leading-relaxed tracking-wide">
                                            "{currentTestimonial.quote}"
                                        </blockquote>
                                    </div>

                                    <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl p-6 border-l-6 border-blue-500 shadow-sm">
                                        <div className="text-blue-800 font-bold text-lg mb-2">
                                            📍 {currentTestimonial.property}
                                        </div>
                                        <div className="text-slate-600 font-medium">
                                            ✅ Cliente verificado • Transação realizada com sucesso
                                        </div>
                                    </div>
                                </div>

                                {/* Informações do cliente */}
                                <div className="w-full lg:w-72 flex-shrink-0">
                                    <div className="flex lg:flex-col items-center lg:items-start gap-6">
                                        {/* Avatar com melhor visibilidade */}
                                        <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden border-4 border-blue-200 shadow-xl">
                                            <Image
                                                src={currentTestimonial.image}
                                                alt={`Cliente ${currentTestimonial.name}`}
                                                fill
                                                sizes="(max-width: 1024px) 80px, 96px"
                                                className="object-cover"
                                                priority
                                            />
                                        </div>

                                        <div className="text-center lg:text-left">
                                            <h3 className="text-slate-900 font-bold text-xl mb-1">
                                                {currentTestimonial.name}
                                            </h3>
                                            <p className="text-blue-700 font-bold text-base mb-4">
                                                {currentTestimonial.role}
                                            </p>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-center lg:justify-start text-slate-600 font-medium">
                                                    <MapPin size={16} className="mr-3 text-blue-600" />
                                                    {currentTestimonial.location}
                                                </div>

                                                <div className="flex items-center justify-center lg:justify-start text-slate-600 font-medium">
                                                    <Calendar size={16} className="mr-3 text-blue-600" />
                                                    {currentTestimonial.date}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>                    {/* Navegação redesenhada com melhor contraste */}
                    <div className="flex justify-between items-center mt-12">
                        <div className="flex space-x-3">
                            {testimonials.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => !isTransitioning && setCurrentIndex(idx)}
                                    className={`transition-all duration-300 rounded-full ${idx === currentIndex
                                        ? 'w-12 h-4 bg-blue-600 shadow-lg'
                                        : 'w-4 h-4 bg-slate-300 hover:bg-blue-400'
                                        }`}
                                    disabled={isTransitioning || idx === currentIndex}
                                    aria-label={`Ver depoimento ${idx + 1}`}
                                    aria-current={idx === currentIndex}
                                />
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => handleNavigation(-1)}
                                className="p-4 rounded-2xl bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-all duration-200 border-2 border-slate-200 hover:border-blue-300 shadow-lg hover:shadow-xl"
                                disabled={isTransitioning}
                                aria-label="Depoimento anterior"
                            >
                                <ArrowLeft size={20} />
                            </button>

                            <button
                                onClick={() => handleNavigation(1)}
                                className="p-4 rounded-2xl bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-all duration-200 border-2 border-slate-200 hover:border-blue-300 shadow-lg hover:shadow-xl"
                                disabled={isTransitioning}
                                aria-label="Próximo depoimento"
                            >
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* CTA com melhor visibilidade */}
                <div className="mt-20 text-center">
                    <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-blue-100">
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">
                            ✨ Quer ser nosso próximo caso de sucesso?
                        </h3>
                        <p className="text-slate-600 mb-6 text-lg">
                            Mais de 150 propriedades com rentabilidade comprovada esperando por você
                        </p>
                        <a
                            href={props.ctaLink || "/imoveis"}
                            className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl transition-all duration-200 font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1"
                        >
                            {props.ctaText || "Ver oportunidades disponíveis"}
                            <ArrowRight size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Export with the correct name for dynamic import
export default TestimonialSection;
