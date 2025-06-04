"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    TrendingUp, Home, ChevronRight, BarChart3,
    Building2, MapPin, Check, Clock, Shield,
    Phone, Mail, User, Trees, Car, X, Loader2
} from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

// Types
interface MarketMetric {
    id: string;
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ReactNode;
}

interface NeighborhoodData {
    name: string;
    priceRange: string;
    characteristics: string;
    distance: string;
    highlight: string;
}

interface FormData {
    name: string;
    email: string;
    phone: string;
    intent: 'invest' | 'live';
    message?: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
}

interface LoadingState {
    isImageLoaded: boolean;
    isContentReady: boolean;
    isAnimationComplete: boolean;
}

interface HeroPerformance {
    loadStartTime: number;
    firstContentfulPaint?: number;
    interactionReady?: number;
}

// Smart loading hook for progressive enhancement
const useProgressiveLoading = () => {
    const [loadingState, setLoadingState] = useState<LoadingState>({
        isImageLoaded: false,
        isContentReady: false,
        isAnimationComplete: false,
    });
    const [performance] = useState<HeroPerformance>({
        loadStartTime: Date.now(),
    });

    const markContentReady = useCallback(() => {
        setLoadingState(prev => ({ ...prev, isContentReady: true }));
        if (!performance.firstContentfulPaint) {
            performance.firstContentfulPaint = Date.now() - performance.loadStartTime;
            // Log performance in development
            if (process.env.NODE_ENV === 'development') {
                console.log(`🎯 Hero FCP: ${performance.firstContentfulPaint}ms`);
            }
        }
    }, [performance]);

    const markImageLoaded = useCallback(() => {
        setLoadingState(prev => ({ ...prev, isImageLoaded: true }));
    }, []);

    const markInteractionReady = useCallback(() => {
        setLoadingState(prev => ({ ...prev, isAnimationComplete: true }));
        if (!performance.interactionReady) {
            performance.interactionReady = Date.now() - performance.loadStartTime;
            // Log interaction timing in development
            if (process.env.NODE_ENV === 'development') {
                console.log(`⚡ Hero TTI: ${performance.interactionReady}ms`);
            }
        }
    }, [performance]);

    const isFullyLoaded = useMemo(() =>
        loadingState.isImageLoaded && loadingState.isContentReady && loadingState.isAnimationComplete,
        [loadingState]
    );

    return {
        loadingState,
        performance,
        markContentReady,
        markImageLoaded,
        markInteractionReady,
        isFullyLoaded,
    };
};

// Premium loading skeleton component
const HeroSkeleton: React.FC = () => (
    <div className="relative min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/60" />

        {/* Animated particles for premium feel */}
        <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-amber-200/40 rounded-full"
                    style={{
                        left: `${20 + i * 15}%`,
                        top: `${30 + i * 8}%`,
                    }}
                    animate={{
                        y: [-10, 10, -10],
                        opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                        duration: 3 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                    }}
                />
            ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="pt-20 sm:pt-24 lg:pt-32 pb-16 sm:pb-20">
                <div className="max-w-5xl mx-auto">
                    {/* Badge skeleton */}
                    <div className="flex justify-center mb-8">
                        <motion.div
                            className="h-8 w-64 bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 rounded-full"
                            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>

                    {/* Title skeleton */}
                    <div className="text-center mb-12 space-y-4">
                        <motion.div
                            className="h-12 w-3/4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg mx-auto"
                            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <motion.div
                            className="h-12 w-1/2 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 rounded-lg mx-auto"
                            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                            transition={{ duration: 1.8, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                            className="h-6 w-5/6 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded mx-auto mt-6"
                            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                            transition={{ duration: 2.2, repeat: Infinity, delay: 0.4 }}
                        />
                        <motion.div
                            className="h-6 w-2/3 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded mx-auto"
                            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                            transition={{ duration: 2.5, repeat: Infinity, delay: 0.6 }}
                        />
                    </div>

                    {/* Metrics skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
                        {[1, 2, 3].map(i => (
                            <motion.div
                                key={i}
                                className="bg-amber-50 rounded-xl p-6 border border-amber-200/50"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <motion.div
                                        className="w-10 h-10 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 rounded-lg relative"
                                        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                        style={{
                                            transform: 'translate3d(0, 0, 0)',
                                            backfaceVisibility: 'hidden',
                                            willChange: 'background-position'
                                        }}
                                    />
                                </div>
                                <motion.div
                                    className="h-4 w-24 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 rounded mb-2"
                                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                                    transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.15 }}
                                />
                                <motion.div
                                    className="h-8 w-16 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded mb-1"
                                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                                />
                                <motion.div
                                    className="h-3 w-20 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 rounded"
                                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                                    transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.2 }}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Enhanced loading indicator */}
        <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }} // Added duration: 0.3
        >
            <div className="flex items-center gap-3 px-6 py-3 bg-white/95 backdrop-blur-md rounded-full shadow-xl border border-white/20">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <Loader2 className="w-5 h-5 text-amber-600" />
                </motion.div>
                <span className="text-sm font-semibold text-gray-800">
                    Carregando experiência premium...
                </span>
                <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                        <motion.div
                            key={i}
                            className="w-1.5 h-1.5 bg-amber-500 rounded-full"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    </div>
);

// New component: HeroContentSkeleton (derived from HeroSkeleton's inner parts)
const HeroContentSkeleton: React.FC = () => (
    <div className="max-w-5xl mx-auto"> {/* Matches structure of actual content container */}
        {/* Badge skeleton */}
        <div className="flex justify-center mb-8">
            <motion.div
                className="h-8 w-64 bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 rounded-full"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 2, repeat: Infinity }}
            />
        </div>

        {/* Title skeleton */}
        <div className="text-center mb-12 space-y-4">
            <motion.div
                className="h-12 w-3/4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg mx-auto"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
                className="h-12 w-1/2 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 rounded-lg mx-auto"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
                className="h-6 w-5/6 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded mx-auto mt-6"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: 0.4 }}
            />
            <motion.div
                className="h-6 w-2/3 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded mx-auto"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.6 }}
            />
        </div>

        {/* Metrics skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
            {[1, 2, 3].map(i => (
                <motion.div
                    key={i}
                    className="bg-amber-50 rounded-xl p-6 border border-amber-200/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                    <div className="flex items-start justify-between mb-4">
                        <motion.div
                            className="w-10 h-10 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 rounded-lg relative"
                            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                            style={{
                                transform: 'translate3d(0, 0, 0)',
                                backfaceVisibility: 'hidden',
                                willChange: 'background-position'
                            }}
                        />
                    </div>
                    <motion.div
                        className="h-4 w-24 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 rounded mb-2"
                        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                        transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.15 }}
                    />
                    <motion.div
                        className="h-8 w-16 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded mb-1"
                        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                    />
                    <motion.div
                        className="h-3 w-20 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 rounded"
                        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                        transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.2 }}
                    />
                </motion.div>
            ))}
        </div>
    </div>
);

// Métricas mais realistas e tradicionais para uma imobiliária local
const MARKET_METRICS: MarketMetric[] = [
    {
        id: 'experience',
        title: 'Anos de Experiência',
        value: 15,
        subtitle: 'atendendo Guararema',
        icon: <Building2 className="w-5 h-5" />
    },
    {
        id: 'satisfied',
        title: 'Famílias Atendidas',
        value: '280+',
        subtitle: 'satisfeitas com o serviço',
        icon: <Home className="w-5 h-5" />
    },
    {
        id: 'local',
        title: 'Conhecimento Local',
        value: '100%',
        subtitle: 'de todos os bairros',
        icon: <MapPin className="w-5 h-5" />
    }
];

// Dados de bairros mais realistas e locais
const NEIGHBORHOOD_DATA: Record<'invest' | 'live', NeighborhoodData[]> = {
    invest: [
        {
            name: 'Centro Histórico',
            priceRange: 'R$ 280K - R$ 450K',
            characteristics: 'Comércio consolidado',
            distance: 'Centro da cidade',
            highlight: 'Valorização constante'
        },
        {
            name: 'Jardim São José',
            priceRange: 'R$ 220K - R$ 380K',
            characteristics: 'Área residencial em crescimento',
            distance: '2km do centro',
            highlight: 'Boa demanda por aluguel'
        },
        {
            name: 'Vila Nova',
            priceRange: 'R$ 180K - R$ 320K',
            characteristics: 'Novos loteamentos',
            distance: '3km do centro',
            highlight: 'Potencial de crescimento'
        }
    ],
    live: [
        {
            name: 'Centro',
            priceRange: 'R$ 300K - R$ 480K',
            characteristics: 'Toda infraestrutura próxima',
            distance: 'Centro da cidade',
            highlight: 'Comodidade do dia a dia'
        },
        {
            name: 'Jardim Florestal',
            priceRange: 'R$ 350K - R$ 520K',
            characteristics: 'Área verde e tranquila',
            distance: '1.5km do centro',
            highlight: 'Ideal para famílias'
        },
        {
            name: 'Ponte Grande',
            priceRange: 'R$ 280K - R$ 420K',
            characteristics: 'Bairro tradicional',
            distance: '2km do centro',
            highlight: 'Comunidade estabelecida'
        }
    ]
};

// Nova Ipê Premium Color Palette - Brand Aligned
const novaIpeColors = {
    primary: { ipe: '#E6AA2C', ipeLight: '#F7D660', ipeDark: '#B8841C' },
    earth: { brown: '#8B4513', brownLight: '#A0522D', brownDark: '#654321' },
    neutral: { black: '#1A1A1A', charcoal: '#2D2D2D', white: '#FFFFFF', cream: '#F8F4E3', softWhite: '#FEFEFE' }
};

// Enhanced animated counter with premium smooth easing and loading states
const AnimatedCounter: React.FC<{
    value: number;
    suffix?: string;
    prefix?: string;
    duration?: number;
    isReady?: boolean;
}> = ({
    value,
    suffix = '',
    prefix = '',
    duration = 2500,
    isReady = true
}) => {
        const [displayValue, setDisplayValue] = useState(0);
        const [isAnimating, setIsAnimating] = useState(false);
        const ref = useRef<HTMLSpanElement>(null);
        const isInView = useInView(ref, { once: true, margin: "-100px" });

        useEffect(() => {
            if (!isInView || !isReady) return;

            setIsAnimating(true);
            let startTime: number;
            const startValue = 0;
            const endValue = value;

            const updateCounter = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);

                // Premium easing function - ease-out-expo for sophisticated feel
                const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const current = startValue + (endValue - startValue) * easeOutExpo;

                setDisplayValue(Math.floor(current));

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    setDisplayValue(endValue);
                    setIsAnimating(false);
                }
            };

            const animationId = requestAnimationFrame(updateCounter);
            return () => cancelAnimationFrame(animationId);
        }, [isInView, value, duration, isReady]);

        if (!isReady) {
            return (
                <span className="inline-block">
                    <div className="w-12 h-8 bg-gray-200 rounded animate-pulse" />
                </span>
            );
        }

        return (
            <span
                ref={ref}
                aria-live="polite"
                aria-atomic="true"
                className={`tabular-nums font-bold transition-all duration-300 ${isAnimating ? 'text-amber-600' : 'text-gray-900'
                    }`}
            >
                {prefix}{displayValue.toLocaleString('pt-BR')}{suffix}
            </span>
        );
    };

// Smart metrics component with progressive loading
const MetricsGrid: React.FC<{ isContentReady: boolean }> = ({ isContentReady }) => {
    const [metricsLoaded, setMetricsLoaded] = useState(false);

    useEffect(() => {
        if (isContentReady) {
            // Simulate data loading with realistic delay
            const timer = setTimeout(() => setMetricsLoaded(true), 300);
            return () => clearTimeout(timer);
        }
    }, [isContentReady]);

    if (!isContentReady) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-amber-50 rounded-xl p-6 border border-amber-200/50 animate-pulse">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 bg-amber-200 rounded-lg" />
                        </div>
                        <div className="h-4 w-24 bg-amber-200 rounded mb-2" />
                        <div className="h-8 w-16 bg-gray-300 rounded mb-1" />
                        <div className="h-3 w-20 bg-amber-200 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto"
        >
            {MARKET_METRICS.map((metric, index) => (
                <motion.div
                    key={metric.id}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                            delay: 0.4 + index * 0.15,
                            duration: 0.6,
                            type: "spring",
                            stiffness: 100
                        }
                    }}
                    whileHover={{
                        y: -8,
                        scale: 1.02,
                        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.15)",
                        transition: { duration: 0.2 }
                    }}
                    className="bg-gradient-to-br from-amber-50 via-white to-amber-50/30 rounded-xl p-6 border border-amber-200/60 shadow-sm hover:border-amber-300/80 transition-all duration-300 relative overflow-hidden group"
                >
                    {/* Animated background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-100/0 via-amber-50/0 to-amber-100/0 group-hover:from-amber-100/30 group-hover:via-amber-50/20 group-hover:to-amber-100/30 transition-all duration-500" />

                    <div className="relative">
                        <div className="flex items-start justify-between mb-4">                            <motion.div
                            className="p-3 bg-white text-amber-700 rounded-xl shadow-sm border border-amber-100 group-hover:shadow-md transition-all duration-300 relative"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            {metric.icon}
                        </motion.div>
                        </div>

                        <h3 className="text-sm font-semibold text-amber-800/90 mb-2 uppercase tracking-wide">
                            {metric.title}
                        </h3>

                        <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1 flex items-baseline relative"> {/* MODIFIED: Added relative class */}
                            {typeof metric.value === 'number' ? (
                                metric.id === 'growth' ? (
                                    <>
                                        <AnimatedCounter
                                            value={metric.value}
                                            suffix="%"
                                            isReady={metricsLoaded}
                                            duration={2000 + index * 500}
                                        />
                                    </>
                                ) : (
                                    <AnimatedCounter
                                        value={metric.value}
                                        suffix="+"
                                        isReady={metricsLoaded}
                                        duration={2500 + index * 300}
                                    />
                                )
                            ) : (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: metricsLoaded ? 1 : 0 }}
                                    transition={{ delay: 0.8 + index * 0.2, duration: 0.5 }} // MODIFIED: Added duration: 0.5
                                    className="tabular-nums"
                                >
                                    {metric.value}
                                </motion.span>
                            )}
                        </div>

                        <p className="text-sm text-amber-700/70 font-medium">{metric.subtitle}</p>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};
const ContactFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    selectedIntent: 'invest' | 'live';
}> = ({ isOpen, onClose, selectedIntent }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        intent: selectedIntent
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    // Reset form when intent changes
    useEffect(() => {
        setFormData(prev => ({ ...prev, intent: selectedIntent }));
    }, [selectedIntent]);

    // Form validation
    const validateForm = useCallback((): boolean => {
        const errors: FormErrors = {};

        if (!formData.name.trim()) {
            errors.name = 'Nome é obrigatório';
        }

        if (!formData.email.trim()) {
            errors.email = 'E-mail é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'E-mail inválido';
        }

        if (!formData.phone.trim()) {
            errors.phone = 'Telefone é obrigatório';
        } else if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(formData.phone)) {
            errors.phone = 'Formato inválido. Use (99) 99999-9999';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }, [formData]);

    // Form submission with debounce to prevent double submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || isSubmitting) return;

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Form submitted:', { ...formData });

            // Success - reset and close
            setFormData({
                name: '',
                email: '',
                phone: '',
                intent: selectedIntent,
                message: ''
            });
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
            // Would handle error appropriately here
        } finally {
            setIsSubmitting(false);
        }
    };

    // Format phone number as user types
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';

        if (value.length <= 2) {
            formattedValue = value;
        } else if (value.length <= 7) {
            formattedValue = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        } else {
            formattedValue = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
        }

        setFormData({ ...formData, phone: formattedValue });
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }} // Added explicit transition
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }} // Added explicit transition
                className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl border border-gray-100"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full mb-2">
                            Atendimento prioritário
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900" id="modal-title">
                            Consultoria Personalizada
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">Um especialista entrará em contato em até 24h</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1"
                        aria-label="Fechar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                                <div className="flex items-center">
                                    <div className="p-1 bg-amber-100 rounded-md mr-2">
                                        <User className="w-3.5 h-3.5 text-amber-700" />
                                    </div>
                                    Nome completo
                                </div>
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all ${formErrors.name ? 'border-red-500' : 'border-gray-200'}`}
                                placeholder="Digite seu nome completo"
                                aria-invalid={!!formErrors.name}
                                aria-describedby={formErrors.name ? "name-error" : undefined}
                            />

                            {formErrors.name && (
                                <p id="name-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <span className="w-4 h-4 text-white bg-red-500 rounded-full flex items-center justify-center text-[10px]">!</span>
                                    {formErrors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                                <div className="flex items-center">
                                    <div className="p-1 bg-amber-100 rounded-md mr-2">
                                        <Phone className="w-3.5 h-3.5 text-amber-700" />
                                    </div>
                                    WhatsApp/Celular
                                </div>
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all ${formErrors.phone ? 'border-red-500' : 'border-gray-200'}`}
                                placeholder="(11) 99999-9999"
                                aria-invalid={!!formErrors.phone}
                                aria-describedby={formErrors.phone ? "phone-error" : undefined}
                            />

                            {formErrors.phone && (
                                <p id="phone-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <span className="w-4 h-4 text-white bg-red-500 rounded-full flex items-center justify-center text-[10px]">!</span>
                                    {formErrors.phone}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                            <div className="flex items-center">
                                <div className="p-1 bg-amber-100 rounded-md mr-2">
                                    <Mail className="w-3.5 h-3.5 text-amber-700" />
                                </div>
                                E-mail
                            </div>
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all ${formErrors.email ? 'border-red-500' : 'border-gray-200'}`}
                            placeholder="seu@email.com"
                            aria-invalid={!!formErrors.email}
                            aria-describedby={formErrors.email ? "email-error" : undefined}
                        />

                        {formErrors.email && (
                            <p id="email-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                <span className="w-4 h-4 text-white bg-red-500 rounded-full flex items-center justify-center text-[10px]">!</span>
                                {formErrors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                            <div className="flex items-center">
                                <div className="p-1 bg-amber-100 rounded-md mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-amber-700">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
                                    </svg>
                                </div>
                                O que você procura? (opcional)
                            </div>
                        </label>
                        <textarea
                            id="message"
                            value={formData.message || ''}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all"
                            rows={3}
                            placeholder="Ex.: Procuro uma casa com 3 dormitórios próxima ao centro..."
                        />
                    </div>

                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-xs text-amber-800">
                        <p className="flex items-center gap-1.5">
                            <Shield className="w-4 h-4 text-amber-600" />
                            <span>Seus dados estão seguros e serão usados apenas para contato.</span>
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors order-2 md:order-1 md:flex-1"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="py-3.5 px-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-lg font-semibold hover:from-amber-700 hover:to-amber-600 shadow-md hover:shadow-lg transition-all disabled:opacity-70 order-1 md:order-2 md:flex-1"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Enviando...
                                </span>
                            ) : 'Receber atendimento prioritário'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

// Neighborhood card as a separate component
const NeighborhoodCard: React.FC<{
    neighborhood: NeighborhoodData;
    index: number;
}> = ({ neighborhood, index }) => {
    return (
        <motion.div
            key={neighborhood.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }} // MODIFIED: Added duration: 0.5
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 mb-4"
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <MapPin className="w-5 h-5 text-amber-600" aria-hidden="true" />
                        <h4 className="text-lg font-bold text-gray-900">{neighborhood.name}</h4>
                        <span className="px-3 py-1 text-xs font-semibold text-white bg-amber-600 rounded-full">
                            {neighborhood.highlight}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-amber-100 rounded-full">
                                <BarChart3 className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
                            </div>
                            <p className="text-sm text-gray-700">
                                <span className="font-medium">Faixa:</span> {neighborhood.priceRange}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-green-100 rounded-full">
                                <Trees className="w-3.5 h-3.5 text-green-700" aria-hidden="true" />
                            </div>
                            <p className="text-sm text-gray-700">
                                {neighborhood.characteristics}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-100 rounded-full">
                                <Car className="w-3.5 h-3.5 text-blue-700" aria-hidden="true" />
                            </div>
                            <p className="text-sm text-gray-700">
                                {neighborhood.distance}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Main component with progressive loading and enhanced UX
const GuararemaHero: React.FC = () => {
    const [selectedIntent, setSelectedIntent] = useState<'invest' | 'live'>('invest');
    const [showContactForm, setShowContactForm] = useState(false);
    const heroRef = useRef<HTMLElement>(null);
    const isInView = useInView(heroRef, { once: true, amount: 0.1 });

    // Progressive loading system
    const {
        loadingState,
        markContentReady,
        markImageLoaded,
        markInteractionReady,
    } = useProgressiveLoading();

    // Mark content as ready when component mounts
    useEffect(() => {
        const timer = setTimeout(markContentReady, 100); // Adjust timeout as needed
        return () => clearTimeout(timer);
    }, [markContentReady]);

    // Mark interaction ready when animations complete
    useEffect(() => {
        if (isInView && loadingState.isContentReady) {
            const timer = setTimeout(markInteractionReady, 1000); // Adjust as needed
            return () => clearTimeout(timer);
        }
    }, [isInView, loadingState.isContentReady, markInteractionReady]);

    // Optimized background image handling
    const bgImageUrl = "/images/hero-bg.jpg";

    return (
        <section
            ref={heroRef}
            className="relative min-h-screen bg-gradient-to-br from-amber-50/90 via-white to-blue-50/80 overflow-hidden"
            aria-labelledby="hero-heading"
        >
            {/* Background Image and Overlays - Rendered Unconditionally */}
            <div className="absolute inset-0">
                <div className="relative w-full h-full">
                    <Image
                        src={bgImageUrl}
                        alt="Vista panorâmica de Guararema ao amanhecer, com névoa suave sobre as colinas e o rio Paraíba do Sul em destaque, simbolizando oportunidades imobiliárias."
                        fill
                        className={`object-cover transition-opacity duration-1000 ${loadingState.isImageLoaded ? 'opacity-30' : 'opacity-0'}`}
                        sizes="100vw"
                        quality={90} /* Adjusted quality for LCP */
                        priority
                        onLoad={markImageLoaded}
                        aria-hidden={false} /* Made true if alt is descriptive, false if decorative and alt="" */
                    />
                </div>
                <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/50 to-white/95"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                />
                <motion.div
                    className="absolute inset-0"
                    style={{
                        background: `linear-gradient(135deg, 
                            ${novaIpeColors.neutral.cream}/95 0%, 
                            ${novaIpeColors.neutral.white}/85 30%, 
                            ${novaIpeColors.primary.ipe}/5 70%, 
                            ${novaIpeColors.neutral.softWhite}/95 100%)`
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                />
                <motion.div
                    className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl"
                    style={{ backgroundColor: `${novaIpeColors.primary.ipe}15` }}
                    initial={{ scale: 0, x: 200, y: -200 }}
                    animate={{ scale: 1, x: 100, y: -100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <motion.div
                    className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl"
                    style={{ backgroundColor: `${novaIpeColors.earth.brown}10` }}
                    initial={{ scale: 0, x: -200, y: 200 }}
                    animate={{ scale: 1, x: -100, y: 100 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                />
            </div>

            {/* Content Area */}
            <div className="relative z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="pt-20 sm:pt-24 lg:pt-32 pb-16 sm:pb-20">
                        {!loadingState.isContentReady ? (
                            <HeroContentSkeleton />
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: (isInView && loadingState.isContentReady) ? 1 : 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="max-w-5xl mx-auto"
                            >                                {/* Badge tradicional e respeitoso */}
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            delay: 0.2,
                                            duration: 0.5
                                        }
                                    }}
                                    className="flex justify-center mb-8"
                                >
                                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-lg shadow-sm border border-gray-200">
                                        <Building2
                                            className="w-5 h-5 text-amber-700"
                                            aria-hidden="true"
                                        />
                                        <span className="text-sm font-semibold text-gray-800">
                                            Imobiliária Ipê • Guararema desde 2009
                                        </span>
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    </div>
                                </motion.div>                                {/* Título mais sóbrio e tradicional */}
                                <motion.h1
                                    id="hero-heading"
                                    className="text-center text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{
                                        opacity: 1, y: 0,
                                        transition: { delay: 0.3, duration: 0.6 }
                                    }}
                                >
                                    <span className="block text-gray-900 mb-2">
                                        Seu próximo imóvel em Guararema
                                    </span>
                                    <span className="block text-amber-700 text-3xl sm:text-4xl lg:text-5xl font-semibold">
                                        com quem conhece cada rua da cidade
                                    </span>
                                </motion.h1>

                                <motion.p
                                    className="max-w-2xl mx-auto text-center text-lg text-gray-600 mb-12"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{
                                        opacity: 1, y: 0,
                                        transition: { delay: 0.4, duration: 0.6 }
                                    }}
                                >
                                    Há 15 anos ajudamos famílias a encontrar o lar ideal em Guararema.
                                    Conhecimento local, atendimento pessoal e toda documentação em ordem.
                                </motion.p>

                                {/* Metrics Grid - Pass isContentReady for its internal loading state */}
                                <MetricsGrid isContentReady={loadingState.isContentReady} />

                                {/* Intent Selection */}
                                <motion.div
                                    className="max-w-2xl mx-auto mb-12"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{
                                        opacity: 1, y: 0,
                                        transition: { delay: 0.5, duration: 0.6 }
                                    }}
                                >
                                    <div className="flex justify-center mb-8">
                                        <div className="inline-flex rounded-lg shadow-md bg-white p-1 border border-gray-200">
                                            {(['invest', 'live'] as const).map((intent) => (
                                                <button
                                                    key={intent}
                                                    onClick={() => setSelectedIntent(intent)}
                                                    className={`px-6 py-3 text-sm font-semibold rounded-md transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500
                                                        ${selectedIntent === intent
                                                            ? 'bg-amber-500 text-white shadow-sm'
                                                            : 'text-gray-700 hover:bg-amber-50'
                                                        }`}
                                                >
                                                    {intent === 'invest' ? 'Quero Investir' : 'Quero Morar'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <AnimatePresence mode="wait">                                        <motion.div
                                        key={selectedIntent}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
                                        exit={{ opacity: 0, y: -15, transition: { duration: 0.3 } }}
                                        className="mb-10"
                                    >
                                        <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">
                                            {selectedIntent === 'invest' ? 'Bairros com Potencial de Valorização' : 'Melhores Locais para Sua Família'}
                                        </h3>
                                        <p className="text-center text-gray-600 mb-8 max-w-xl mx-auto">
                                            {selectedIntent === 'invest'
                                                ? 'Baseado em nossos 15 anos de experiência no mercado local.'
                                                : 'Locais que oferecem qualidade de vida e infraestrutura completa.'}
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                                            {NEIGHBORHOOD_DATA[selectedIntent].map((neighborhood, idx) => (
                                                <NeighborhoodCard key={neighborhood.name} neighborhood={neighborhood} index={idx} />
                                            ))}
                                        </div>
                                    </motion.div>
                                    </AnimatePresence>
                                </motion.div> {/* End of Intent Selection motion.div */}                                <motion.div
                                    className="text-center mt-16"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0, transition: { delay: 0.7, duration: 0.6 } }}
                                >
                                    <button
                                        onClick={() => setShowContactForm(true)}
                                        className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg text-white bg-amber-600 hover:bg-amber-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                                    >
                                        <Phone className="w-5 h-5 mr-2" />
                                        Falar com um Corretor
                                    </button>
                                    <p className="mt-4 text-sm text-gray-600">
                                        Atendimento personalizado e visita agendada.
                                    </p>
                                </motion.div>
                            </motion.div> // End of the main content motion.div
                        )}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showContactForm && (
                    <ContactFormModal
                        isOpen={showContactForm}
                        onClose={() => setShowContactForm(false)}
                        selectedIntent={selectedIntent}
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

// Enhanced Hero with Suspense boundary for optimal loading
const EnhancedHero: React.FC = () => {
    // Preload critical image for better performance
    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = '/images/hero-bg.jpg';
        link.as = 'image';
        document.head.appendChild(link);

        return () => {
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
        };
    }, []);

    return (
        <Suspense fallback={<HeroSkeleton />}>
            <GuararemaHero />
        </Suspense>
    );
};

export default GuararemaHero;