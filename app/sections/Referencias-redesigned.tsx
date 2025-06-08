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
    }, [currentIndex]);

    return (
        <section className="bg-white py-20 md:py-32 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-light/20 to-neutral-light/20"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12 md:mb-16">
                    <span className="inline-block bg-primary-light/20 text-primary-darkest px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        Histórias de Sucesso
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-neutral-darkest mb-4 font-heading">
                        {props.title || "Clientes que confiam na nossa expertise"}
                    </h2>
                    <p className="text-lg text-neutral-charcoal max-w-2xl mx-auto font-body">
                        {props.description || "Conheça histórias reais de quem encontrou sua oportunidade ideal com nossa consultoria especializada."}
                    </p>
                </div>

                {/* Testimonial Carousel */}
                <div
                    className="relative max-w-4xl mx-auto"
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
                            className="bg-white rounded-2xl p-8 md:p-10 border border-neutral-light shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            {/* Conteúdo principal */}
                            <div className="flex flex-col lg:flex-row gap-8 items-start">
                                {/* Texto do depoimento */}
                                <div className="flex-1">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="flex-shrink-0 w-12 h-12 bg-primary-light/20 rounded-full flex items-center justify-center">
                                            <Quote size={20} className="text-primary-darkest" />
                                        </div>
                                        <blockquote className="text-neutral-darkest text-lg md:text-xl font-medium leading-relaxed">
                                            "{currentTestimonial.quote}"
                                        </blockquote>
                                    </div>

                                    <div className="bg-neutral-lightest/50 rounded-lg p-4 border-l-4 border-primary-light">
                                        <div className="text-primary-darkest font-semibold text-base mb-1">
                                            {currentTestimonial.property}
                                        </div>
                                        <div className="text-neutral-charcoal text-sm">
                                            Cliente verificado • Transação realizada
                                        </div>
                                    </div>
                                </div>

                                {/* Informações do cliente */}
                                <div className="w-full lg:w-64 flex-shrink-0">
                                    <div className="flex lg:flex-col items-center lg:items-start gap-4">
                                        {/* Avatar com melhor visibilidade */}
                                        <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden border-3 border-primary-light/30 shadow-md">
                                            <Image
                                                src={currentTestimonial.image}
                                                alt={`Cliente ${currentTestimonial.name}`}
                                                fill
                                                sizes="(max-width: 1024px) 64px, 80px"
                                                className="object-cover"
                                                priority
                                            />
                                        </div>

                                        <div className="text-center lg:text-left">
                                            <h3 className="text-neutral-darkest font-bold text-lg">
                                                {currentTestimonial.name}
                                            </h3>
                                            <p className="text-primary-darkest font-medium text-sm mb-3">
                                                {currentTestimonial.role}
                                            </p>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-center lg:justify-start text-neutral-charcoal text-sm">
                                                    <MapPin size={14} className="mr-2 text-primary-darkest" />
                                                    {currentTestimonial.location}
                                                </div>

                                                <div className="flex items-center justify-center lg:justify-start text-neutral-charcoal text-sm">
                                                    <Calendar size={14} className="mr-2 text-primary-darkest" />
                                                    {currentTestimonial.date}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navegação redesenhada */}
                    <div className="flex justify-between items-center mt-10">
                        <div className="flex space-x-2">
                            {testimonials.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => !isTransitioning && setCurrentIndex(idx)}
                                    className={`transition-all duration-300 rounded-full ${idx === currentIndex
                                        ? 'w-8 h-3 bg-primary-darkest'
                                        : 'w-3 h-3 bg-neutral-light hover:bg-primary-light'
                                        }`}
                                    disabled={isTransitioning || idx === currentIndex}
                                    aria-label={`Ver depoimento ${idx + 1}`}
                                    aria-current={idx === currentIndex}
                                />
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleNavigation(-1)}
                                className="p-3 rounded-full bg-neutral-lightest hover:bg-primary-light text-neutral-darkest hover:text-primary-darkest transition-all duration-200 border border-neutral-light"
                                disabled={isTransitioning}
                                aria-label="Depoimento anterior"
                            >
                                <ArrowLeft size={18} />
                            </button>

                            <button
                                onClick={() => handleNavigation(1)}
                                className="p-3 rounded-full bg-neutral-lightest hover:bg-primary-light text-neutral-darkest hover:text-primary-darkest transition-all duration-200 border border-neutral-light"
                                disabled={isTransitioning}
                                aria-label="Próximo depoimento"
                            >
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* CTA Melhorado */}
                <div className="mt-16 text-center">
                    <a
                        href={props.ctaLink || "/imoveis"}
                        className="inline-flex items-center gap-2 bg-primary-darkest hover:bg-primary-dark text-white px-8 py-4 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        {props.ctaText || "Ver oportunidades disponíveis"}
                        <ArrowRight size={18} />
                    </a>
                    <p className="mt-4 text-neutral-charcoal text-sm">
                        Mais de 150 propriedades com rentabilidade comprovada
                    </p>
                </div>
            </div>
        </section>
    );
};

// Export with the correct name for dynamic import
export default TestimonialSection;
