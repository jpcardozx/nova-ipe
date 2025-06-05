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
    }, []); // Adicionado array de dependências vazio

    useEffect(() => {
        // Auto-play functionality
        timerRef.current = setTimeout(() => {
            handleNavigation(1);
        }, 5000); // Change slide every 5 seconds

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [currentIndex]); // Reset timer when currentIndex changes

    return (
        <section className="bg-gradient-to-br from-neutral-lightest to-primary-lightest/30 py-20 md:py-32 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
                {/* Subtle background pattern or SVG */}
            </div>
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-neutral-darkest mb-4 font-heading">
                        {props.title || "O que dizem nossos clientes"} {/* Use prop or default */}
                    </h2>
                    <p className="text-lg md:text-xl text-neutral-charcoal max-w-3xl mx-auto font-body">
                        {props.description || "Resultados reais e depoimentos de quem confia na Ipê Imóveis para seus investimentos e projetos de vida."}
                    </p>
                    {props.badge && (
                        <span className="mt-4 inline-block bg-primary-light text-primary-darkest px-4 py-2 rounded-full text-sm font-semibold">
                            {props.badge}
                        </span>
                    )}
                </div>

                {/* Testimonial Carousel */}
                <div
                    className="relative"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentTestimonial.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 shadow-xl"
                        >
                            {/* Conteúdo principal */}
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                {/* Marca de citação e texto */}
                                <div className="flex-1">
                                    <div className="flex items-start gap-3 mb-6">
                                        <Quote size={30} className="text-[#E6AA2C]/70 mt-1 flex-shrink-0" />
                                        <blockquote className="text-white/90 text-lg md:text-xl font-light leading-relaxed">
                                            "{currentTestimonial.quote}"
                                        </blockquote>
                                    </div>

                                    <div className="mt-8 pt-4 border-t border-white/10">
                                        <div className="text-[#E6AA2C] font-medium text-lg">
                                            {currentTestimonial.property}
                                        </div>
                                        <div className="text-white/70 text-sm mt-1">
                                            Avaliação verificada por nossa equipe
                                        </div>
                                    </div>
                                </div>

                                {/* Informações do cliente */}
                                <div className="w-full md:w-48 flex-shrink-0 flex flex-row md:flex-col gap-4 items-center md:items-start">                                    {/* Avatar discreto */}
                                    <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-[#E6AA2C]/30">
                                        <Image
                                            src={currentTestimonial.image}
                                            alt={`Cliente`}
                                            fill
                                            sizes="(max-width: 768px) 64px, 80px"
                                            className="object-cover"
                                            priority
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-white font-medium">
                                            {currentTestimonial.name}
                                        </h3>
                                        <p className="text-[#E6AA2C]/80 text-sm">
                                            {currentTestimonial.role}
                                        </p>

                                        <div className="flex mt-2 items-center text-white/60 text-sm">
                                            <MapPin size={12} className="mr-1" />
                                            {currentTestimonial.location}
                                        </div>

                                        <div className="flex mt-1 items-center text-white/60 text-sm">
                                            <Calendar size={12} className="mr-1" />
                                            {currentTestimonial.date}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navegação */}
                    <div className="flex justify-between items-center mt-8">
                        <div className="flex space-x-1.5">
                            {testimonials.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => !isTransitioning && setCurrentIndex(idx)}
                                    className={`transition-all duration-300 rounded-full ${idx === currentIndex
                                        ? 'w-8 h-2 bg-[#E6AA2C]'
                                        : 'w-2 h-2 bg-white/20 hover:bg-white/40'
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
                                className="p-3 rounded-full bg-[#2C4D68] hover:bg-[#E6AA2C] text-white transition-colors"
                                disabled={isTransitioning}
                                aria-label="Depoimento anterior"
                            >
                                <ArrowLeft size={18} />
                            </button>

                            <button
                                onClick={() => handleNavigation(1)}
                                className="p-3 rounded-full bg-[#2C4D68] hover:bg-[#E6AA2C] text-white transition-colors"
                                disabled={isTransitioning}
                                aria-label="Próximo depoimento"
                            >
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>                {/* CTA */}
                <div className="mt-16 text-center">
                    <a
                        href="/imoveis"
                        className="inline-flex items-center gap-2 bg-[#E6AA2C] hover:bg-[#d19720] text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        Explorar oportunidades de investimento
                        <ArrowRight size={16} />
                    </a>
                    <p className="mt-3 text-white/50 text-sm">
                        Mais de 150 ativos com ROI entre 7.2% e 12.5% ao ano
                    </p>
                </div>
            </div>        </section>
    );
};

// Export with the correct name for dynamic import
export default TestimonialSection;