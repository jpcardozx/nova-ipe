"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { novaIpeColors, novaIpeGradients } from '../utils/nova-ipe-gradients';

interface Testimonial {
    id: string;
    name: string;
    role?: string;
    content: string;
    rating: number;
    avatarUrl: string;
    neighborhood?: string;
    propertyType?: string;
    featured?: boolean;
}

interface PremiumTestimonialsSectionProps {
    title: string;
    subtitle?: string;
    testimonials: Testimonial[];
}

const PremiumTestimonialsSection: React.FC<PremiumTestimonialsSectionProps> = ({
    title,
    subtitle,
    testimonials
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState<'right' | 'left'>('right');
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);
    const maxIndex = testimonials.length - 1;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    const handlePrev = () => {
        setDirection('left');
        setCurrentIndex(prev => (prev === 0 ? maxIndex : prev - 1));
    };

    const handleNext = () => {
        setDirection('right');
        setCurrentIndex(prev => (prev === maxIndex ? 0 : prev + 1));
    };

    // Renderizar estrelas de avaliação
    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                // Estrela completa
                stars.push(
                    <Star
                        key={`star-${i}`}
                        className="w-4 h-4 fill-current"
                        style={{ color: novaIpeColors.primary.ipe }}
                    />
                );
            } else if (i === fullStars && hasHalfStar) {
                // Meia estrela (usamos a completa com opacidade)
                stars.push(
                    <div key={`half-star-${i}`} className="relative">
                        <Star
                            className="w-4 h-4 fill-current opacity-30"
                            style={{ color: novaIpeColors.primary.ipe }}
                        />
                        <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                            <Star
                                className="w-4 h-4 fill-current"
                                style={{ color: novaIpeColors.primary.ipe }}
                            />
                        </div>
                    </div>
                );
            } else {
                // Estrela vazia
                stars.push(
                    <Star
                        key={`empty-star-${i}`}
                        className="w-4 h-4 fill-current opacity-30"
                        style={{ color: novaIpeColors.primary.ipe }}
                    />
                );
            }
        }

        return stars;
    };

    // Depoimento atual
    const currentTestimonial = testimonials[currentIndex];

    return (
        <section
            ref={sectionRef}
            className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
            style={{
                background: novaIpeGradients.earthSoft,
            }}
        >
            {/* Formas decorativas de fundo */}
            <div className="absolute top-10 left-10 w-64 h-64 rounded-full opacity-20"
                style={{
                    background: `radial-gradient(circle, ${novaIpeColors.primary.ipe}30 0%, ${novaIpeColors.primary.ipe}00 70%)`,
                    filter: 'blur(40px)'
                }}
            />

            <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full opacity-10"
                style={{
                    background: `radial-gradient(circle, ${novaIpeColors.earth.brown}20 0%, ${novaIpeColors.earth.brown}00 70%)`,
                    filter: 'blur(60px)'
                }}
            />

            <div className="max-w-6xl mx-auto relative">
                {/* Cabeçalho da seção */}
                <div className="text-center mb-12">
                    <motion.h2
                        className="text-3xl font-bold mb-2"
                        style={{
                            color: novaIpeColors.neutral.black
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {title}
                    </motion.h2>

                    {subtitle && (
                        <motion.p
                            className="text-lg max-w-xl mx-auto"
                            style={{ color: novaIpeColors.neutral.charcoal }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {subtitle}
                        </motion.p>
                    )}
                </div>

                {/* Controles de navegação */}
                <div className="flex justify-center gap-3 mb-8">
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        onClick={handlePrev}
                        className="p-3 rounded-full border transition-all duration-300"
                        style={{
                            background: 'white',
                            borderColor: `${novaIpeColors.neutral.charcoal}15`,
                            boxShadow: `0 4px 12px ${novaIpeColors.neutral.charcoal}10`
                        }}
                        aria-label="Depoimento anterior"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ChevronLeft
                            className="w-5 h-5"
                            style={{ color: novaIpeColors.neutral.charcoal }}
                        />
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        onClick={handleNext}
                        className="p-3 rounded-full border transition-all duration-300"
                        style={{
                            background: 'white',
                            borderColor: `${novaIpeColors.neutral.charcoal}15`,
                            boxShadow: `0 4px 12px ${novaIpeColors.neutral.charcoal}10`
                        }}
                        aria-label="Próximo depoimento"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ChevronRight
                            className="w-5 h-5"
                            style={{ color: novaIpeColors.neutral.charcoal }}
                        />
                    </motion.button>
                </div>

                {/* Slider de testemunhos */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentTestimonial.id}
                            className="flex flex-col items-center"
                            initial={{
                                opacity: 0,
                                x: direction === 'right' ? 100 : -100
                            }}
                            animate={{
                                opacity: 1,
                                x: 0
                            }}
                            exit={{
                                opacity: 0,
                                x: direction === 'right' ? -100 : 100
                            }}
                            transition={{
                                duration: 0.5,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                        >
                            {/* Card de depoimento */}
                            <div
                                className="bg-white rounded-2xl p-8 md:p-10 max-w-3xl mx-auto shadow-xl relative"
                                style={{
                                    boxShadow: `0 20px 40px -10px ${novaIpeColors.neutral.black}10, 0 10px 20px -5px ${novaIpeColors.primary.ipe}10`,
                                }}
                            >
                                {/* Ícone de aspas */}
                                <div
                                    className="absolute -top-6 left-10 w-12 h-12 rounded-full flex items-center justify-center"
                                    style={{
                                        background: novaIpeGradients.primary,
                                        boxShadow: `0 8px 20px -4px ${novaIpeColors.primary.ipe}40`
                                    }}
                                >
                                    <Quote className="w-5 h-5 text-white" />
                                </div>

                                {/* Conteúdo do depoimento */}
                                <div className="mb-6">
                                    <p
                                        className="text-lg md:text-xl italic leading-relaxed mb-4"
                                        style={{ color: novaIpeColors.neutral.charcoal }}
                                    >
                                        "{currentTestimonial.content}"
                                    </p>

                                    {/* Rating */}
                                    <div className="flex gap-1 mb-6">
                                        {renderStars(currentTestimonial.rating)}
                                    </div>

                                    {/* Detalhes do imóvel */}
                                    {(currentTestimonial.neighborhood || currentTestimonial.propertyType) && (
                                        <div className="flex flex-wrap gap-3 mb-6">
                                            {currentTestimonial.neighborhood && (
                                                <span
                                                    className="text-sm px-3 py-1 rounded-full"
                                                    style={{
                                                        background: `${novaIpeColors.neutral.cream}50`,
                                                        color: novaIpeColors.neutral.charcoal
                                                    }}
                                                >
                                                    {currentTestimonial.neighborhood}
                                                </span>
                                            )}
                                            {currentTestimonial.propertyType && (
                                                <span
                                                    className="text-sm px-3 py-1 rounded-full"
                                                    style={{
                                                        background: `${novaIpeColors.primary.ipe}15`,
                                                        color: novaIpeColors.primary.ipeDark
                                                    }}
                                                >
                                                    {currentTestimonial.propertyType}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Autor */}
                                <div className="flex items-center">
                                    {/* Avatar */}
                                    <div className="relative mr-4">
                                        <div
                                            className="w-16 h-16 rounded-full overflow-hidden border-2"
                                            style={{ borderColor: novaIpeColors.primary.ipe }}
                                        >
                                            <Image
                                                src={currentTestimonial.avatarUrl}
                                                alt={currentTestimonial.name}
                                                fill
                                                className="object-cover"
                                                sizes="64px"
                                            />
                                        </div>

                                        {currentTestimonial.featured && (
                                            <div
                                                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                                                style={{
                                                    background: novaIpeGradients.primary,
                                                    boxShadow: `0 2px 6px ${novaIpeColors.primary.ipe}40`
                                                }}
                                            >
                                                <Star className="w-3 h-3 fill-current text-white" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Informações */}
                                    <div>
                                        <h4
                                            className="font-semibold text-lg"
                                            style={{ color: novaIpeColors.neutral.black }}
                                        >
                                            {currentTestimonial.name}
                                        </h4>

                                        {currentTestimonial.role && (
                                            <p className="text-sm" style={{ color: novaIpeColors.neutral.warmGray }}>
                                                {currentTestimonial.role}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Indicadores de página */}
                <div className="flex justify-center items-center gap-1.5 mt-8">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setDirection(index > currentIndex ? 'right' : 'left');
                                setCurrentIndex(index);
                            }}
                            className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                            style={{
                                background: currentIndex === index
                                    ? novaIpeColors.primary.ipe
                                    : `${novaIpeColors.neutral.charcoal}20`,
                                transform: currentIndex === index ? 'scale(1.2)' : 'scale(1)',
                                boxShadow: currentIndex === index
                                    ? `0 0 0 2px ${novaIpeColors.neutral.white}, 0 0 0 4px ${novaIpeColors.primary.ipe}30`
                                    : 'none'
                            }}
                            aria-label={`Depoimento ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PremiumTestimonialsSection;
