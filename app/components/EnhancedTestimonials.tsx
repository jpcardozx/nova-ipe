'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, Building2, User2, MapPin, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

// Tipos
interface Testimonial {
    id: string;
    name: string;
    role?: string;
    content: string;
    rating: number;
    avatarUrl?: string;
    neighborhood?: string;
    propertyType?: string;
    featured?: boolean;
    transactionType?: 'compra' | 'venda' | 'aluguel';
}

interface EnhancedTestimonialsProps {
    title?: string;
    subtitle?: string;
    mode?: 'default' | 'minimal' | 'focused' | 'cards';
    theme?: 'light' | 'dark' | 'amber';
    testimonials?: Testimonial[];
}

// Depoimentos padrão em caso de não serem fornecidos
const DEFAULT_TESTIMONIALS: Testimonial[] = [
    {
        id: '2',
        name: 'Ricardo Oliveira',
        role: 'Investidor',
        content: 'Como investidor imobiliário, valorizo parceiros que compreendem o mercado local. A Ipê demonstrou conhecimento excepcional de Guararema e região, identificando oportunidades com excelente potencial de valorização.',
        rating: 5,
        avatarUrl: '/images/testimonials/mark-erixon.png',
        neighborhood: 'Vila Santo Antônio',
        propertyType: 'Terreno',
        featured: true,
        transactionType: 'compra'
    },
    {
        id: '3',
        name: 'Ana e Roberto Almeida',
        role: 'Família',
        content: 'Encontramos nossa casa dos sonhos com a Ipê Imóveis. O processo foi tranquilo e transparente, desde as visitas até a finalização do contrato. Estamos encantados com nossa nova casa em Guararema!',
        rating: 5,
        avatarUrl: '/images/testimonials/jim-bradley.png',
        neighborhood: 'Itapema',
        propertyType: 'Casa',
        transactionType: 'compra'
    },
    {
        id: '4',
        name: 'Márcia Santos',
        role: 'Empreendedora',
        content: 'A administração do meu imóvel comercial está em excelentes mãos. A equipe da Ipê cuida de tudo com eficiência e me mantém informada sobre cada detalhe importante.',
        rating: 5,
        avatarUrl: '/images/testimonials/jessica-saunders.png',
        neighborhood: 'Centro Comercial',
        propertyType: 'Loja',
        transactionType: 'aluguel'
    },
    {
        id: '5',
        name: 'Paulo Ribeiro',
        role: 'Aposentado',
        content: 'Quando decidi me mudar para Guararema, a Ipê não apenas encontrou o imóvel perfeito, mas também me ajudou a conhecer a cidade e me adaptar. Este nível de atenção faz toda diferença.',
        rating: 5,
        avatarUrl: '/images/testimonials/becky-snider.png',
        neighborhood: 'Parateí',
        propertyType: 'Chácara',
        transactionType: 'compra'
    }
];

// Componente principal
export default function EnhancedTestimonials({
    title = "O que nossos clientes dizem",
    subtitle = "Histórias reais de clientes que confiaram em nossa expertise para encontrar o imóvel ideal em Guararema",
    mode = 'default',
    theme = 'light',
    testimonials = DEFAULT_TESTIMONIALS
}: EnhancedTestimonialsProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState<'right' | 'left'>('right');
    const [autoplay, setAutoplay] = useState(true);
    const sectionRef = useRef<HTMLDivElement>(null);
    const maxIndex = testimonials.length - 1;
    const [isVisible, setIsVisible] = useState(false);

    // Monitorar visibilidade da seção para animações
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

    // Autoplay para o carrossel
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (autoplay && isVisible) {
            interval = setInterval(() => {
                setDirection('right');
                setCurrentIndex(prev => (prev === maxIndex ? 0 : prev + 1));
            }, 5000);
        }

        return () => clearInterval(interval);
    }, [autoplay, maxIndex, isVisible]);

    // Navegar pelos depoimentos
    const handlePrev = () => {
        setAutoplay(false);
        setDirection('left');
        setCurrentIndex(prev => (prev === 0 ? maxIndex : prev - 1));
    };

    const handleNext = () => {
        setAutoplay(false);
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
                stars.push(
                    <Star key={`star-${i}`} className="w-4 h-4 fill-amber-500 text-amber-500" />
                );
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <div key={`half-star-${i}`} className="relative">
                        <Star className="w-4 h-4 text-gray-300" />
                        <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        </div>
                    </div>
                );
            } else {
                stars.push(
                    <Star key={`empty-star-${i}`} className="w-4 h-4 text-gray-300" />
                );
            }
        }

        return stars;
    };

    // Configurações baseadas no tema
    const themeStyles = {
        light: {
            bg: 'bg-gradient-to-br from-white to-gray-50',
            headingText: 'text-gray-900',
            subText: 'text-gray-600',
            cardBg: 'bg-white',
            cardBorder: 'border border-gray-100',
            cardShadow: 'shadow-md shadow-gray-200/40',
            quoteColor: 'text-amber-500',
            contentText: 'text-gray-700',
            nameText: 'text-gray-900',
            roleText: 'text-gray-600',
            buttonBg: 'bg-white hover:bg-gray-50',
            buttonBorder: 'border border-gray-200',
            buttonText: 'text-gray-700'
        },
        dark: {
            bg: 'bg-gradient-to-br from-gray-900 to-gray-800',
            headingText: 'text-white',
            subText: 'text-gray-300',
            cardBg: 'bg-gray-800',
            cardBorder: 'border border-gray-700',
            cardShadow: 'shadow-md shadow-black/30',
            quoteColor: 'text-amber-400',
            contentText: 'text-gray-300',
            nameText: 'text-white',
            roleText: 'text-gray-400',
            buttonBg: 'bg-gray-700 hover:bg-gray-600',
            buttonBorder: 'border border-gray-600',
            buttonText: 'text-white'
        },
        amber: {
            bg: 'bg-gradient-to-br from-amber-900 to-amber-800',
            headingText: 'text-white',
            subText: 'text-amber-100',
            cardBg: 'bg-gradient-to-br from-amber-800/80 to-amber-950/80',
            cardBorder: 'border border-amber-700/50',
            cardShadow: 'shadow-md shadow-amber-950/30',
            quoteColor: 'text-amber-300',
            contentText: 'text-amber-100',
            nameText: 'text-white',
            roleText: 'text-amber-200',
            buttonBg: 'bg-amber-700 hover:bg-amber-600',
            buttonBorder: 'border border-amber-600',
            buttonText: 'text-white'
        }
    };

    const styles = themeStyles[theme];

    // Componente de indicador de transação
    const TransactionBadge = ({ type }: { type?: 'compra' | 'venda' | 'aluguel' }) => {
        if (!type) return null;

        let icon, label, bgColor;

        switch (type) {
            case 'compra':
                icon = <Building2 className="w-3 h-3 mr-1" />;
                label = 'Compra';
                bgColor = 'bg-emerald-500';
                break;
            case 'venda':
                icon = <Award className="w-3 h-3 mr-1" />;
                label = 'Venda';
                bgColor = 'bg-purple-500';
                break;
            case 'aluguel':
                icon = <MapPin className="w-3 h-3 mr-1" />;
                label = 'Aluguel';
                bgColor = 'bg-blue-500';
                break;
            default:
                return null;
        }

        return (
            <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full text-white ${bgColor}`}>
                {icon}
                {label}
            </div>
        );
    };

    // Renderização condicional baseada no modo
    if (mode === 'minimal') {
        return (
            <section
                ref={sectionRef}
                className={cn(
                    "py-16 px-4",
                    styles.bg
                )}
            >
                <div className="container mx-auto max-w-3xl">
                    <div className="text-center space-y-4 mb-8">
                        <h2 className={cn("text-3xl font-bold", styles.headingText)}>{title}</h2>
                        <p className={cn("text-lg", styles.subText)}>{subtitle}</p>
                    </div>

                    <div className="flex justify-center mb-8">
                        <div className="flex space-x-2">
                            {testimonials.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setAutoplay(false);
                                        setCurrentIndex(idx);
                                        setDirection(idx > currentIndex ? 'right' : 'left');
                                    }}
                                    className={`w-2.5 h-2.5 rounded-full transition-colors ${currentIndex === idx
                                        ? 'bg-amber-500'
                                        : theme === 'light'
                                            ? 'bg-gray-300'
                                            : 'bg-gray-700'
                                        }`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>                    <div className="relative overflow-hidden">
                        <AnimatePresence initial={false} mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: direction === 'right' ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: direction === 'right' ? -20 : 20 }}
                                transition={{ duration: 0.3 }}
                                className="text-center"
                            >
                                <div className="mb-5">
                                    <div className="flex justify-center mb-3">
                                        {renderStars(testimonials[currentIndex].rating)}
                                    </div>

                                    <div className={cn("relative italic text-lg px-8 mb-6", styles.contentText)}>
                                        <Quote className={cn("absolute top-0 left-0 w-5 h-5 -translate-x-1 -translate-y-1", styles.quoteColor)} />
                                        "{testimonials[currentIndex].content}"
                                        <Quote className={cn("absolute bottom-0 right-0 w-5 h-5 translate-x-1 translate-y-1 rotate-180", styles.quoteColor)} />
                                    </div>

                                    <div className="mt-4">
                                        <p className={cn("font-medium", styles.nameText)}>{testimonials[currentIndex].name}</p>
                                        {testimonials[currentIndex].role && (
                                            <p className={cn("text-sm", styles.roleText)}>{testimonials[currentIndex].role}</p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-center space-x-4 mt-8">
                        <button
                            onClick={handlePrev}
                            aria-label="Previous testimonial"
                            className={cn(
                                "p-2 rounded-full transition-all",
                                styles.buttonBg,
                                styles.buttonBorder,
                                styles.buttonText
                            )}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleNext}
                            aria-label="Next testimonial"
                            className={cn(
                                "p-2 rounded-full transition-all",
                                styles.buttonBg,
                                styles.buttonBorder,
                                styles.buttonText
                            )}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // Renderização para o modo cards
    if (mode === 'cards') {
        return (
            <section
                ref={sectionRef}
                className={cn("py-20 px-4", styles.bg)}
            >
                <div className="container mx-auto">
                    <div className="text-center space-y-3 mb-12">
                        <h2 className={cn("text-3xl md:text-4xl font-bold", styles.headingText)}>{title}</h2>
                        {subtitle && <p className={cn("text-lg max-w-3xl mx-auto", styles.subText)}>{subtitle}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                        {testimonials.map((testimonial) => (
                            <motion.div
                                key={testimonial.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true, margin: "-50px" }}
                                className={cn(
                                    "rounded-xl p-6",
                                    styles.cardBg,
                                    styles.cardBorder,
                                    styles.cardShadow
                                )}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center">
                                        <div className="flex gap-0.5 mb-3">
                                            {renderStars(testimonial.rating)}
                                        </div>
                                    </div>
                                    <Quote className={cn("w-8 h-8", styles.quoteColor)} />
                                </div>

                                <p className={cn("mb-4", styles.contentText)}>
                                    "{testimonial.content}"
                                </p>

                                <div className="flex items-center mt-6">
                                    {testimonial.avatarUrl ? (
                                        <div className="mr-4">                                        <Image
                                            src={testimonial.avatarUrl}
                                            alt={testimonial.name}
                                            width={48}
                                            height={48}
                                            className="rounded-full object-cover"
                                            priority={testimonial.featured}
                                        />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                                            <User2 className="w-6 h-6 text-gray-500" />
                                        </div>
                                    )}
                                    <div>
                                        <p className={cn("font-semibold", styles.nameText)}>
                                            {testimonial.name}
                                        </p>
                                        {testimonial.role && (
                                            <p className={cn("text-sm", styles.roleText)}>{testimonial.role}</p>
                                        )}
                                    </div>
                                    {testimonial.transactionType && (
                                        <div className="ml-auto">
                                            <TransactionBadge type={testimonial.transactionType} />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Modo padrão (default) ou focused
    return (
        <section
            ref={sectionRef}
            className={cn(
                "py-16 md:py-24 px-4 overflow-hidden",
                styles.bg
            )}
        >
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div className="md:max-w-2xl">
                        <motion.h2
                            initial={{ opacity: 0, y: -20 }}
                            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                            transition={{ duration: 0.6 }}
                            className={cn("text-3xl md:text-4xl font-bold mb-4", styles.headingText)}
                        >
                            {title}
                        </motion.h2>

                        {subtitle && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className={cn("text-lg", styles.subText)}
                            >
                                {subtitle}
                            </motion.p>
                        )}
                    </div>

                    {mode !== 'focused' && (
                        <div className="flex space-x-3 mt-6 md:mt-0">
                            <button
                                onClick={handlePrev}
                                aria-label="Previous testimonial"
                                className={cn(
                                    "p-3 rounded-full transition-colors",
                                    styles.buttonBg,
                                    styles.buttonBorder,
                                    styles.buttonText
                                )}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleNext}
                                aria-label="Next testimonial"
                                className={cn(
                                    "p-3 rounded-full transition-colors",
                                    styles.buttonBg,
                                    styles.buttonBorder,
                                    styles.buttonText
                                )}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="relative">
                    <AnimatePresence initial={false} mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: direction === 'right' ? 100 : -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: direction === 'right' ? -100 : 100 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30
                            }}
                            className={cn(
                                "rounded-2xl p-6 md:p-10",
                                styles.cardBg,
                                styles.cardBorder,
                                styles.cardShadow,
                                mode === 'focused' ? 'max-w-4xl mx-auto' : ''
                            )}
                        >
                            <Quote className={cn("w-12 h-12 mb-6", styles.quoteColor)} />

                            <p className={cn(
                                "text-lg md:text-xl mb-8 leading-relaxed",
                                styles.contentText
                            )}>
                                "{testimonials[currentIndex].content}"
                            </p>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center mb-4 sm:mb-0">
                                    {testimonials[currentIndex].avatarUrl ? (<Image
                                        src={testimonials[currentIndex].avatarUrl}
                                        alt={testimonials[currentIndex].name}
                                        width={56}
                                        height={56}
                                        className="rounded-full object-cover mr-4"
                                        priority={testimonials[currentIndex].featured}
                                    />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                                            <User2 className="w-7 h-7 text-gray-500" />
                                        </div>
                                    )}

                                    <div>
                                        <p className={cn("font-semibold text-lg", styles.nameText)}>
                                            {testimonials[currentIndex].name}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            {testimonials[currentIndex].role && (
                                                <p className={cn("text-sm", styles.roleText)}>
                                                    {testimonials[currentIndex].role}
                                                </p>
                                            )}

                                            {testimonials[currentIndex].transactionType && (
                                                <TransactionBadge type={testimonials[currentIndex].transactionType} />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    {renderStars(testimonials[currentIndex].rating)}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {mode === 'focused' && (
                    <div className="flex justify-center mt-8 space-x-3">
                        {testimonials.map((_, idx) => (
                            <button
                                key={`indicator-${idx}`}
                                onClick={() => {
                                    setAutoplay(false);
                                    setDirection(idx > currentIndex ? 'right' : 'left');
                                    setCurrentIndex(idx);
                                }}
                                className={`w-2.5 h-2.5 rounded-full transition-colors ${currentIndex === idx
                                    ? 'bg-amber-500'
                                    : theme === 'dark'
                                        ? 'bg-gray-700'
                                        : 'bg-gray-300'
                                    }`}
                                aria-label={`Ver depoimento ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
