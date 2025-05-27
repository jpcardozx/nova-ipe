"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    TrendingUp, Home, ChevronRight, BarChart3,
    Building2, MapPin, Check, Clock, Shield,
    Phone, Mail, User, Trees, Car, X, Star, Award
} from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

// Types
interface MarketMetric {
    id: string;
    title: string;
    value: string;
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

// Constants
const MARKET_METRICS: MarketMetric[] = [
    {
        id: 'growth',
        title: 'Valorização Imóveis',
        value: '11.8%',
        subtitle: 'média anual em Guararema',
        icon: <TrendingUp className="w-5 h-5" />
    },
    {
        id: 'properties',
        title: 'Oportunidades Exclusivas',
        value: '23',
        subtitle: 'disponíveis agora',
        icon: <Building2 className="w-5 h-5" />
    },
    {
        id: 'time',
        title: 'Velocidade de Venda',
        value: '37d',
        subtitle: 'vs 120d do mercado',
        icon: <Clock className="w-5 h-5" />
    }
];

const NEIGHBORHOOD_DATA: Record<'invest' | 'live', NeighborhoodData[]> = {
    invest: [
        {
            name: 'Centro Histórico',
            priceRange: 'R$ 750K - R$ 1.2M',
            characteristics: 'ROI de 8.4% + valorização',
            distance: 'Centro da cidade',
            highlight: 'Liquidez imediata garantida'
        },
        {
            name: 'Residencial Ipiranga',
            priceRange: 'R$ 550K - R$ 780K',
            characteristics: 'Gateway SP em construção',
            distance: '6km do centro',
            highlight: 'Valorização de 11.2% em 2024'
        },
        {
            name: 'Parque Agrinco',
            priceRange: 'R$ 480K - R$ 690K',
            characteristics: 'Novos empreendimentos',
            distance: '8km do centro',
            highlight: 'ROI projetado de 9.8% a.a.'
        }
    ],
    live: [
        {
            name: 'Recanto Verde',
            priceRange: 'R$ 680K - R$ 950K',
            characteristics: 'Área verde preservada',
            distance: '5km do centro',
            highlight: 'Qualidade de vida superior'
        },
        {
            name: 'Centro Expandido',
            priceRange: 'R$ 620K - R$ 890K',
            characteristics: 'Infraestrutura premium',
            distance: 'Próximo ao centro',
            highlight: 'Conveniência completa'
        },
        {
            name: 'Vista Alegre',
            priceRange: 'R$ 580K - R$ 780K',
            characteristics: 'Condomínios fechados',
            distance: '7km do centro',
            highlight: 'Segurança familiar'
        }
    ]
};

// Enhanced animated counter
const AnimatedCounter: React.FC<{ value: number; suffix?: string; prefix?: string; duration?: number }> = ({
    value,
    suffix = '',
    prefix = '',
    duration = 2000
}) => {
    const [displayValue, setDisplayValue] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (!isInView) return;

        let startTime: number;
        const startValue = 0;
        const endValue = value;

        const updateCounter = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const current = startValue + (endValue - startValue) * easeOutCubic;

            setDisplayValue(Math.floor(current));

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                setDisplayValue(endValue);
            }
        };

        requestAnimationFrame(updateCounter);
    }, [isInView, value, duration]);

    return (
        <span ref={ref} aria-live="polite" aria-atomic="true" className="tabular-nums font-bold">
            {prefix}{displayValue.toLocaleString('pt-BR')}{suffix}
        </span>
    );
};

// Contact form modal
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

    useEffect(() => {
        setFormData(prev => ({ ...prev, intent: selectedIntent }));
    }, [selectedIntent]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || isSubmitting) return;

        setIsSubmitting(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Form submitted:', { ...formData });

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
        } finally {
            setIsSubmitting(false);
        }
    };

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

// Neighborhood card component
const NeighborhoodCard: React.FC<{
    neighborhood: NeighborhoodData;
    index: number;
}> = ({ neighborhood, index }) => {
    return (
        <motion.div
            key={neighborhood.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
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

// Main consolidated hero component
export default function ConsolidatedHero() {
    const [selectedIntent, setSelectedIntent] = useState<'invest' | 'live'>('invest');
    const [showContactForm, setShowContactForm] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const heroRef = useRef<HTMLElement>(null);
    const isInView = useInView(heroRef, { once: true });

    // Fix Suspense issue by ensuring component is mounted
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const bgImageUrl = "/images/hero-bg.png";

    // Prevent rendering until mounted to avoid hydration issues
    if (!isMounted) {
        return (
            <section className="relative min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando experiência premium...</p>
                </div>
            </section>
        );
    }

    return (
        <section
            ref={heroRef}
            className="relative min-h-screen bg-white overflow-hidden"
            aria-labelledby="hero-heading"
        >
            {/* Background with optimized image */}
            <div className="absolute inset-0">
                <div className="relative w-full h-full">
                    <Image
                        src={bgImageUrl}
                        alt=""
                        fill
                        className="object-cover opacity-20"
                        sizes="100vw"
                        quality={90}
                        priority
                        aria-hidden="true"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/60"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-100/30 rounded-full blur-3xl -translate-y-1/4 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-3xl translate-y-1/4 -translate-x-1/3"></div>
            </div>

            {/* Content - FIXED: Changed from opacity: 0 to opacity: 1 */}
            <div className="relative z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="pt-20 sm:pt-24 lg:pt-32 pb-16 sm:pb-20">
                        <motion.div
                            initial={{ opacity: 1 }} // FIXED: Was opacity: 0
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-5xl mx-auto"
                        >
                            {/* Header badge */}
                            <motion.div
                                initial={{ opacity: 1, y: 0 }} // FIXED: Was opacity: 0, y: -10
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="flex justify-center mb-8"
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-full">
                                    <MapPin className="w-4 h-4 text-amber-700" aria-hidden="true" />
                                    <span className="text-sm font-medium text-amber-900">
                                        Consultoria Imobiliária em Guararema
                                    </span>
                                </div>
                            </motion.div>

                            {/* Main headline */}
                            <motion.div
                                initial={{ opacity: 1, y: 0 }} // FIXED: Was opacity: 0, y: 20
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-center mb-12"
                            >                                <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                    Conquiste sua independência
                                    <span className="block bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-500">
                                        financeira com imóveis em Guararema
                                    </span>
                                </h1>

                                <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
                                    <span className="font-semibold text-blue-600">23 oportunidades exclusivas</span> selecionadas para investidores que buscam <span className="font-semibold">ROI superior a 8%</span> com{' '}
                                    <span className="font-semibold text-green-600">liquidez garantida</span> no mercado de maior crescimento da região.
                                </p>
                            </motion.div>

                            {/* Market metrics */}
                            <motion.div
                                initial={{ opacity: 1, y: 0 }} // FIXED: Was opacity: 0, y: 20
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto"
                            >
                                {MARKET_METRICS.map((metric, index) => (
                                    <motion.div
                                        key={metric.id}
                                        initial={{ opacity: 1, y: 0 }} // FIXED: Was opacity: 0, y: 20
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                                        className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-6 border border-amber-200/80 shadow-sm hover:border-amber-300 transition-all duration-300"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-2.5 bg-white text-amber-700 rounded-lg shadow-sm">
                                                {metric.icon}
                                            </div>
                                        </div>

                                        <h3 className="text-sm font-medium text-amber-800 mb-1">{metric.title}</h3>                                        <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1 flex items-baseline">
                                            {metric.id === 'properties' ? (
                                                <AnimatedCounter value={23} suffix="" />
                                            ) : metric.id === 'time' ? (
                                                <span className="tabular-nums">37<span className="text-lg">d</span></span>
                                            ) : (
                                                <AnimatedCounter value={11} suffix=".8%" />
                                            )}
                                        </div>

                                        <p className="text-sm text-amber-700/80">{metric.subtitle}</p>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Intent selector */}
                            <motion.div
                                initial={{ opacity: 1, y: 0 }} // FIXED: Was opacity: 0, y: 20
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="max-w-4xl mx-auto"
                            >
                                {/* Tabs */}
                                <div
                                    className="flex p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-inner mb-8 relative"
                                    role="tablist"
                                    aria-label="Escolha seu objetivo"
                                >
                                    <div
                                        className={`absolute top-3 bottom-3 ${selectedIntent === 'invest' ? 'left-3' : 'left-1/2 ml-1.5'} w-[calc(50%-6px)] bg-white rounded-lg shadow-md transition-all duration-300 ease-out`}
                                        aria-hidden="true"
                                    />
                                    <button
                                        onClick={() => setSelectedIntent('invest')}
                                        className={`
                                            relative z-10 flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg font-medium transition-all duration-200
                                            ${selectedIntent === 'invest' ? 'text-amber-700' : 'text-gray-500 hover:text-gray-700'}
                                        `}
                                        role="tab"
                                        aria-selected={selectedIntent === 'invest'}
                                        aria-controls="invest-panel"
                                        id="invest-tab"
                                    >
                                        <TrendingUp
                                            className={`w-5 h-5 ${selectedIntent === 'invest' ? 'text-amber-600' : 'text-gray-400'}`}
                                            aria-hidden="true"
                                        />
                                        <span className="font-semibold">Quero Investir</span>
                                    </button>
                                    <button
                                        onClick={() => setSelectedIntent('live')}
                                        className={`
                                            relative z-10 flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg font-medium transition-all duration-200
                                            ${selectedIntent === 'live' ? 'text-amber-700' : 'text-gray-500 hover:text-gray-700'}
                                        `}
                                        role="tab"
                                        aria-selected={selectedIntent === 'live'}
                                        aria-controls="live-panel"
                                        id="live-tab"
                                    >
                                        <Home
                                            className={`w-5 h-5 ${selectedIntent === 'live' ? 'text-amber-600' : 'text-gray-400'}`}
                                            aria-hidden="true"
                                        />
                                        <span className="font-semibold">Quero Morar</span>
                                    </button>
                                </div>

                                {/* Content */}
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={selectedIntent}
                                        initial={{ opacity: 1, x: 0 }} // FIXED: Was opacity: 0, x: selectedIntent === 'invest' ? -20 : 20
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 1, x: 0 }} // FIXED: Was opacity: 0
                                        transition={{ duration: 0.3 }}
                                        role="tabpanel"
                                        id={`${selectedIntent}-panel`}
                                        aria-labelledby={`${selectedIntent}-tab`}
                                    >
                                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                                            <h3 className="flex items-center text-2xl font-bold text-gray-900 mb-6">
                                                {selectedIntent === 'invest' ? (
                                                    <>
                                                        <TrendingUp className="w-6 h-6 text-amber-600 mr-2" aria-hidden="true" />
                                                        Oportunidades para Investidores
                                                    </>
                                                ) : (
                                                    <>
                                                        <Home className="w-6 h-6 text-green-600 mr-2" aria-hidden="true" />
                                                        Bairros Ideais para Morar
                                                    </>
                                                )}
                                            </h3>

                                            <p className="text-gray-600 mb-6 italic">
                                                {selectedIntent === 'invest'
                                                    ? "Selecionamos áreas com melhor potencial de valorização e retorno financeiro"
                                                    : "Conheça os bairros que oferecem melhor qualidade de vida em Guararema"}
                                            </p>

                                            {/* Neighborhood list */}
                                            <div className="space-y-4 mb-8">
                                                {NEIGHBORHOOD_DATA[selectedIntent].map((neighborhood, index) => (
                                                    <NeighborhoodCard
                                                        key={neighborhood.name}
                                                        neighborhood={neighborhood}
                                                        index={index}
                                                    />
                                                ))}
                                            </div>                                            {/* Urgency indicator */}
                                            <div className="mb-4 flex items-center justify-center gap-2 text-sm">
                                                <div className="flex items-center gap-1 px-3 py-1 bg-red-50 border border-red-200 rounded-full text-red-700">
                                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                                    <span className="font-medium">
                                                        Apenas <strong>23 oportunidades</strong> restantes
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Progress bar */}
                                            <div className="mb-6">
                                                <div className="flex justify-between text-xs text-gray-600 mb-2">
                                                    <span>37 já reservados</span>
                                                    <span>60 total</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                                                </div>
                                            </div>

                                            {/* Premium CTA */}
                                            <div className="rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-orange-500 p-0.5 shadow-lg animate-pulse">
                                                <button
                                                    onClick={() => setShowContactForm(true)}
                                                    className="w-full flex items-center justify-center gap-2 py-5 bg-gradient-to-b from-transparent to-black/10 text-white rounded-[10px] font-bold text-lg hover:from-transparent hover:to-black/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                                    aria-label="Reservar minha oportunidade de investimento"
                                                >
                                                    🔥 RESERVAR MINHA OPORTUNIDADE
                                                    <ChevronRight className="w-5 h-5 animate-bounce" aria-hidden="true" />
                                                </button>
                                            </div>

                                            {/* Secondary CTA */}
                                            <div className="mt-3">
                                                <button
                                                    onClick={() => setShowContactForm(true)}
                                                    className="w-full py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
                                                >
                                                    Ver análise de mercado gratuita
                                                </button>
                                            </div>                                            {/* Social Proof with ROI testimonials */}
                                            <div className="mt-6 flex flex-col items-center">
                                                {/* Quick testimonials */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 w-full">
                                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                                                        <div className="text-sm text-green-800">
                                                            <strong>"ROI de 17.2% em 18 meses"</strong>
                                                        </div>
                                                        <div className="text-xs text-green-600">- Maria C., investidora</div>
                                                    </div>
                                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                                                        <div className="text-sm text-blue-800">
                                                            <strong>"Vendeu em 15 dias"</strong>
                                                        </div>
                                                        <div className="text-xs text-blue-600">- Roberto S., casa Centro</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="flex -space-x-2" aria-label="Corretores disponíveis">
                                                        <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">JM</div>
                                                        <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs ml-[-5px]">LF</div>
                                                        <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs ml-[-5px]">JL</div>
                                                    </div>
                                                    <span className="text-sm text-gray-800 font-medium">3 especialistas disponíveis agora</span>
                                                </div>

                                                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Check className="w-3 h-3 text-green-600" aria-hidden="true" />
                                                        <strong>ROI médio 8.4%</strong>
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Check className="w-3 h-3 text-green-600" aria-hidden="true" />
                                                        <strong>Liquidez garantida</strong>
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Check className="w-3 h-3 text-green-600" aria-hidden="true" />
                                                        <strong>15 anos no mercado</strong>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Contact form modal */}
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
}