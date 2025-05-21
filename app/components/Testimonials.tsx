'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

// Dados de depoimentos
const testimonials = [
    {
        id: 1,
        name: 'Carolina Silva',
        role: 'Nova moradora',
        avatar: '/images/avatars/woman-1.jpg',
        content: 'O atendimento foi excepcional do início ao fim. Encontramos nossa casa dos sonhos em Guararema em tempo recorde, com todo suporte nas negociações.',
        rating: 5,
        highlight: true,
    },
    {
        id: 2,
        name: 'Roberto Mendes',
        role: 'Investidor',
        avatar: '/images/avatars/man-1.jpg',
        content: 'Como investidor, aprecio a transparência e conhecimento de mercado que a equipe demonstrou. Os imóveis em Guararema têm se valorizado exatamente como me orientaram.',
        rating: 5,
        highlight: false,
    },
    {
        id: 3,
        name: 'Ana Beatriz e Carlos',
        role: 'Família',
        avatar: '/images/avatars/family-1.jpg',
        content: 'Mudamos para Guararema buscando qualidade de vida para nossa família. O processo foi tranquilo e nos sentimos apoiados em cada etapa da compra de nossa casa.',
        rating: 5,
        highlight: true,
    },
    {
        id: 4,
        name: 'Paulo Rodrigues',
        role: 'Empresário',
        avatar: '/images/avatars/man-2.jpg',
        content: 'A equipe entendeu exatamente o que eu precisava para meu negócio em Guararema. Recomendo fortemente pela agilidade e profissionalismo.',
        rating: 4,
        highlight: false,
    },
    {
        id: 5,
        name: 'Márcia Oliveira',
        role: 'Aposentada',
        avatar: '/images/avatars/woman-2.jpg',
        content: 'Realizei o sonho de ter minha casa de campo em Guararema. O conhecimento da região e a paciência durante todo o processo fizeram toda a diferença.',
        rating: 5,
        highlight: true,
    }
];

// Componente de estrelas para avaliação
const RatingStars = ({ rating }: { rating: number }) => {
    return (
        <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, index) => (
                <Star
                    key={index}
                    size={18}
                    className={cn(
                        "mr-0.5",
                        index < rating
                            ? "fill-primary-500 text-primary-500"
                            : "fill-neutral-200 text-neutral-200"
                    )}
                />
            ))}
        </div>
    );
};

// Card de depoimento individual
const TestimonialCard = ({
    testimonial,
    isActive
}: {
    testimonial: typeof testimonials[0],
    isActive: boolean
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isActive ? 1 : 0.4, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
                "bg-white rounded-2xl shadow-lg p-6 md:p-8 relative",
                "transition-all duration-300 transform",
                isActive ? "scale-100 shadow-xl" : "scale-95 hover:scale-98",
                testimonial.highlight && "border-l-4 border-primary-500"
            )}
        >
            {/* Avatar e informações */}
            <div className="flex items-center mb-6">
                <div className="relative h-16 w-16 rounded-full overflow-hidden border-4 border-white shadow-inner mr-4">
                    <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 64px, 64px" onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                            // Fallback para avatar padrão em caso de erro
                            e.currentTarget.src = '/images/avatars/placeholder.jpg';
                        }}
                    />
                </div>
                <div>
                    <h4 className="text-lg font-semibold text-neutral-800">{testimonial.name}</h4>
                    <p className="text-sm text-neutral-500">{testimonial.role}</p>
                    <RatingStars rating={testimonial.rating} />
                </div>
            </div>

            {/* Conteúdo do depoimento */}
            <blockquote className="relative">
                <div className="absolute -top-8 -left-2 text-5xl text-primary-100">"</div>
                <p className="text-neutral-600 relative z-10 leading-relaxed">
                    {testimonial.content}
                </p>
            </blockquote>
        </motion.div>
    );
};

// Componente principal de depoimentos
export const Testimonials = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-play de depoimentos para melhor engajamento
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isAutoPlaying) {
            interval = setInterval(() => {
                setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
            }, 7000);
        }

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    // Pausar autoplay quando usuário interage
    const pauseAutoplay = () => {
        setIsAutoPlaying(false);
        // Retomar autoplay após 15 segundos de inatividade
        setTimeout(() => setIsAutoPlaying(true), 15000);
    };

    // Lógica de navegação pelos depoimentos
    const handleNext = () => {
        if (isTransitioning) return;

        pauseAutoplay();
        setIsTransitioning(true);
        setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
        setTimeout(() => setIsTransitioning(false), 500);
    };

    const handlePrev = () => {
        if (isTransitioning) return;

        pauseAutoplay();
        setIsTransitioning(true);
        setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
        setTimeout(() => setIsTransitioning(false), 500);
    };

    const handleDotClick = (index: number) => {
        if (isTransitioning || index === activeIndex) return;

        pauseAutoplay();
        setIsTransitioning(true);
        setActiveIndex(index);
        setTimeout(() => setIsTransitioning(false), 500);
    };

    // Determinar quais depoimentos mostrar (responsivamente)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const displayTestimonials = isMobile
        ? [testimonials[activeIndex]]
        : [
            testimonials[activeIndex],
            testimonials[(activeIndex + 1) % testimonials.length],
            testimonials[(activeIndex + 2) % testimonials.length]
        ];

    return (
        <div className="relative overflow-hidden">
            {/* Elemento decorativo */}
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary-500/5"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary-500/5"></div>

            {/* Carrossel de depoimentos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {displayTestimonials.map((testimonial, index) => (
                    <motion.div
                        key={testimonial.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.15 }}
                    >
                        <TestimonialCard
                            testimonial={testimonial}
                            isActive={index === 0}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Controles de navegação */}
            <div className="flex flex-col items-center gap-6">
                {/* Indicadores de progresso */}
                <div className="w-full max-w-xs bg-neutral-200 h-1 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-primary-500"
                        initial={{ width: "0%" }}
                        animate={{
                            width: isAutoPlaying ? "100%" : `${(activeIndex / (testimonials.length - 1)) * 100}%`
                        }}
                        transition={isAutoPlaying ? {
                            duration: 7,
                            repeat: Infinity,
                            repeatType: "loop",
                            ease: "linear"
                        } : { duration: 0.3 }}
                        key={activeIndex} // Reiniciar animação quando activeIndex muda
                    />
                </div>

                <div className="flex justify-center items-center gap-4">
                    {/* Botão anterior */}
                    <button
                        onClick={handlePrev}
                        disabled={isTransitioning}
                        className="p-3 rounded-full bg-white shadow-md hover:bg-neutral-50 hover:shadow-lg transition-all duration-300 disabled:opacity-50 transform hover:-translate-y-1"
                        aria-label="Depoimento anterior"
                    >
                        <ChevronLeft size={20} className="text-neutral-700" />
                    </button>

                    {/* Indicadores de paginação */}
                    <div className="flex space-x-3">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleDotClick(index)}
                                className={cn(
                                    "w-3 h-3 rounded-full transition-all duration-300",
                                    index === activeIndex
                                        ? "bg-primary-500 scale-125 shadow-md shadow-primary-500/30"
                                        : "bg-neutral-300 hover:bg-neutral-400"
                                )}
                                aria-label={`Ver depoimento ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Botão próximo */}
                    <button
                        onClick={handleNext}
                        disabled={isTransitioning}
                        className="p-3 rounded-full bg-white shadow-md hover:bg-neutral-50 hover:shadow-lg transition-all duration-300 disabled:opacity-50 transform hover:-translate-y-1"
                        aria-label="Próximo depoimento"
                    >
                        <ChevronRight size={20} className="text-neutral-700" />
                    </button>
                </div>
            </div>
        </div>
    );
};
