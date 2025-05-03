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

// Dados dos depoimentos
const testimonials: Testimonial[] = [
    {
        id: "t1",
        name: "Elvira Mendes",
        role: "Funcionária Pública",
        location: "Guararema, SP",
        property: "Condomínio Portal das Araucárias",
        quote: "Trabalho há 15 anos em Guararema e para nós o que fez diferença foi entender que na Ipê eles buscavam mais que uma casa - queriam um lugar onde pudessem receber amigos e ainda manter contato com a natureza.",
        image: "/images/cliente1.png",
        date: "Março 2025"
    },
    {
        id: "t2",
        name: "José Luiz Ferreira",
        role: "Cliente há mais de 10 anos",
        location: "Guararema, SP",
        property: "Investimentos Imobiliários",
        quote: "[Redigir depoimento aqui]",
        image: "/images/cliente2.png",
        date: "Janeiro 2025"
    },
    {
        id: "t3",
        name: "Marcelo Andrade",
        role: "Consultora Imobiliária",
        location: "Mogi das Cruzes, SP",
        property: "Quinta dos Ipês",
        quote: "Um dos desafios do nosso trabalho é filtrar o que realmente importa para cada cliente. Quando atendi o Sr. Ricardo, percebi que ele dispensava luxos desnecessários, mas era inflexível quanto à qualidade da construção e localização. Visitamos apenas quatro imóveis em duas semanas.",
        image: "/images/cliente3.png",
        date: "Fevereiro 2025"
    },
    {
        id: "t4",
        name: "Ricardo e Ana Silva",
        role: "Clientes",
        location: "Guararema, SP",
        property: "Chácara Monte Sereno",
        quote: "Precisávamos de um lugar que acomodasse nossas necessidades de home office mas também fosse confortável para nossos dois filhos. Depois de uma experiência frustrante com outra imobiliária, a Ipê realmente ouviu o que precisávamos.",
        image: "/images/cliente4.png",
        date: "Dezembro 2024"
    }
];

const TestimonialSection: React.FC = () => {
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

    return (
        <section className="bg-gradient-to-b from-[#0D2638] to-[#18344A] py-20 md:py-28 relative overflow-hidden">
            {/* Elementos de fundo */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg width="100%" height="100%" className="absolute inset-0">
                    <pattern id="pattern-circles" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                        <circle id="pattern-circle" cx="10" cy="10" r="1.6257413380501518" fill="#E6AA2C" />
                    </pattern>
                    <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
                </svg>
            </div>

            <div className="container max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
                {/* Cabeçalho */}
                <div className="max-w-3xl mx-auto mb-16 text-center">
                    <h2 className="text-[#E6AA2C] text-3xl md:text-4xl font-light mb-4">
                        O que dizem nossos <span className="font-medium">clientes</span>
                    </h2>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto">
                        Histórias reais de pessoas que encontraram o imóvel ideal para suas necessidades.
                    </p>
                </div>

                {/* Container do depoimento */}
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
                                <div className="w-full md:w-48 flex-shrink-0 flex flex-row md:flex-col gap-4 items-center md:items-start">
                                    {/* Avatar discreto */}
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
                </div>

                {/* CTA */}
                <div className="mt-16 text-center">
                    <a
                        href="/imoveis"
                        className="inline-flex items-center gap-2 bg-[#E6AA2C] hover:bg-[#d19720] text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        Ver imóveis disponíveis
                        <ArrowRight size={16} />
                    </a>
                    <p className="mt-3 text-white/50 text-sm">
                        Mais de 150 opções em nossa região
                    </p>
                </div>
            </div>
        </section>
    );
};

export default TestimonialSection;