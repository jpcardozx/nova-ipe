'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    TrendingUp, Home, ChevronRight, BarChart3,
    Building2, MapPin, Check, Clock, Shield,
    Phone, Mail, User, Trees, Car
} from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Image from 'next/image';
import { logger } from '../../lib/logger';

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

// Smooth counter animation
const AnimatedCounter: React.FC<{ value: number; suffix?: string }> = ({
    value,
    suffix = ''
}) => {
    const [displayValue, setDisplayValue] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            const duration = 1500;
            const increment = value / 40;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= value) {
                    setDisplayValue(value);
                    clearInterval(timer);
                } else {
                    setDisplayValue(Math.floor(current));
                }
            }, duration / 40);

            return () => clearInterval(timer);
        }
    }, [value, isInView]);

    return (
        <span ref={ref}>
            {displayValue}{suffix}
        </span>
    );
};

const GuararemaHero: React.FC = () => {
    const [selectedIntent, setSelectedIntent] = useState<'invest' | 'live'>('invest');
    const [showContactForm, setShowContactForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        intent: 'invest'
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const heroRef = useRef(null);
    const isInView = useInView(heroRef, { once: true });    // Realistic market metrics - dados atualizados e mais relevantes    // Dados atualizados para maio de 2025
    const marketMetrics: MarketMetric[] = [
        {
            id: 'growth',
            title: 'Valorização Imóveis',
            value: '9.4%',
            subtitle: 'média anual em Guararema',
            icon: <TrendingUp className="w-5 h-5" />
        },
        {
            id: 'properties',
            title: 'Imóveis Selecionados',
            value: '62',
            subtitle: 'com exclusividade',
            icon: <Building2 className="w-5 h-5" />
        },
        {
            id: 'time',
            title: 'Corretores Certificados',
            value: '24h',
            subtitle: 'para atendimento',
            icon: <Clock className="w-5 h-5" />
        }
    ];    // Dados de bairros atualizados (maio 2025)
    const neighborhoodData: Record<'invest' | 'live', NeighborhoodData[]> = {
        invest: [
            {
                name: 'Centro Histórico',
                priceRange: 'R$ 750K - R$ 1.2M',
                characteristics: 'Alta liquidez garantida',
                distance: 'Centro da cidade',
                highlight: 'ROI de 7.8% a.a.'
            },
            {
                name: 'Residencial Ipiranga',
                priceRange: 'R$ 550K - R$ 780K',
                characteristics: 'Em expansão rápida',
                distance: '6km do centro',
                highlight: 'Valorização de 11.2% em 2024'
            },
            {
                name: 'Parque Agrinco',
                priceRange: 'R$ 480K - R$ 690K',
                characteristics: 'Novos empreendimentos',
                distance: '8km do centro',
                highlight: 'Potencial entrada Gateway'
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

    // Form validation
    const validateForm = (): boolean => {
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
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        logger.log('Form submitted:', { ...formData, intent: selectedIntent });
        setIsSubmitting(false);
        setShowContactForm(false);

        // Reset form
        setFormData({
            name: '',
            email: '',
            phone: '',
            intent: selectedIntent
        });
    };

    return (<section ref={heroRef} className="relative min-h-screen bg-white overflow-hidden">
        {/* Background com efeito visual aprimorado */}
        <div className="absolute inset-0">
            <Image
                src="/images/hero-bg.png"
                alt="Vista aérea de Guararema"
                fill
                style={{ objectFit: 'cover' }}
                className="absolute inset-0 w-full h-full object-cover opacity-10"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white/80"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-100/30 rounded-full blur-3xl -translate-y-1/4 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-3xl translate-y-1/4 -translate-x-1/3"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="pt-20 sm:pt-24 lg:pt-32 pb-16 sm:pb-20">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isInView ? 1 : 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-5xl mx-auto"
                    >
                        {/* Header badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex justify-center mb-8"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-full">
                                <MapPin className="w-4 h-4 text-amber-700" />
                                <span className="text-sm font-medium text-amber-900">
                                    Consultoria Imobiliária em Guararema
                                </span>
                            </div>
                        </motion.div>                            {/* Main headline - redesenhado para maior impacto */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-center mb-12"
                        >                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                Encontre seu refúgio
                                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-500">
                                    em Guararema
                                </span>
                            </h1>

                            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
                                Com mais de 15 anos conectando famílias aos melhores imóveis da região, com atendimento
                                personalizado para <span className="font-semibold">realizar sonhos</span> e <span className="font-semibold">garantir investimentos seguros</span>.
                            </p>
                        </motion.div>                            {/* Market metrics - visual aprimorado e dados atuais */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto"
                        >
                            {marketMetrics.map((metric, index) => (
                                <motion.div
                                    key={metric.id}
                                    initial={{ opacity: 0, y: 20 }}
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

                                    <h3 className="text-sm font-medium text-amber-800 mb-1">{metric.title}</h3>

                                    <div className="text-3xl font-bold text-gray-900 mb-1 flex items-baseline">
                                        {metric.id === 'properties' ? (
                                            <AnimatedCounter value={+50} />
                                        ) : metric.id === 'time' ? (
                                            metric.value
                                        ) : (
                                            <>
                                                <AnimatedCounter value={8.7} />%
                                            </>
                                        )}
                                    </div>

                                    <p className="text-sm text-amber-700/80">{metric.subtitle}</p>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Intent selector */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="max-w-4xl mx-auto"
                        >                                {/* Tabs redesenhados para melhor UX */}
                            <div className="flex p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-inner mb-8 relative">
                                <div
                                    className={`absolute top-3 bottom-3 ${selectedIntent === 'invest' ? 'left-3' : 'left-1/2 ml-1.5'} w-[calc(50%-6px)] bg-white rounded-lg shadow-md transition-all duration-300 ease-out`}
                                />
                                <button
                                    onClick={() => setSelectedIntent('invest')}
                                    className={`
                      relative z-10 flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg font-medium transition-all duration-200
                      ${selectedIntent === 'invest'
                                            ? 'text-amber-700'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }
                    `}
                                >
                                    <TrendingUp className={`w-5 h-5 ${selectedIntent === 'invest' ? 'text-amber-600' : 'text-gray-400'}`} />
                                    <span className="font-semibold">Quero Investir</span>
                                </button>
                                <button
                                    onClick={() => setSelectedIntent('live')}
                                    className={`
                      relative z-10 flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg font-medium transition-all duration-200
                      ${selectedIntent === 'live'
                                            ? 'text-amber-700'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }
                    `}
                                >
                                    <Home className={`w-5 h-5 ${selectedIntent === 'live' ? 'text-amber-600' : 'text-gray-400'}`} />
                                    <span className="font-semibold">Quero Morar</span>
                                </button>
                            </div>

                            {/* Content */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedIntent}
                                    initial={{ opacity: 0, x: selectedIntent === 'invest' ? -20 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: selectedIntent === 'invest' ? 20 : -20 }}
                                    transition={{ duration: 0.3 }}
                                >                                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                                        <h3 className="flex items-center text-2xl font-bold text-gray-900 mb-6">
                                            {selectedIntent === 'invest' ? (
                                                <>
                                                    <TrendingUp className="w-6 h-6 text-amber-600 mr-2" />
                                                    Oportunidades para Investidores
                                                </>
                                            ) : (
                                                <>
                                                    <Home className="w-6 h-6 text-green-600 mr-2" />
                                                    Bairros Ideais para Morar
                                                </>
                                            )}
                                        </h3>

                                        <p className="text-gray-600 mb-6 italic">
                                            {selectedIntent === 'invest'
                                                ? "Selecionamos áreas com melhor potencial de valorização e retorno financeiro"
                                                : "Conheça os bairros que oferecem melhor qualidade de vida em Guararema"}
                                        </p>

                                        {/* Neighborhood list com design aprimorado */}
                                        <div className="space-y-4 mb-8">
                                            {neighborhoodData[selectedIntent].map((neighborhood, index) => (
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
                                                                <MapPin className="w-5 h-5 text-amber-600" />
                                                                <h4 className="text-lg font-bold text-gray-900">{neighborhood.name}</h4>
                                                                <span className="px-3 py-1 text-xs font-semibold text-white bg-amber-600 rounded-full">
                                                                    {neighborhood.highlight}
                                                                </span>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="p-1.5 bg-amber-100 rounded-full">
                                                                        <BarChart3 className="w-3.5 h-3.5 text-amber-700" />
                                                                    </div>
                                                                    <p className="text-sm text-gray-700">
                                                                        <span className="font-medium">Faixa:</span> {neighborhood.priceRange}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="p-1.5 bg-green-100 rounded-full">
                                                                        <Trees className="w-3.5 h-3.5 text-green-700" />
                                                                    </div>
                                                                    <p className="text-sm text-gray-700">
                                                                        {neighborhood.characteristics}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="p-1.5 bg-blue-100 rounded-full">
                                                                        <Car className="w-3.5 h-3.5 text-blue-700" />
                                                                    </div>
                                                                    <p className="text-sm text-gray-700">
                                                                        {neighborhood.distance}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>                                            {/* CTA com elementos de confiança aprimorados */}
                                        <div className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 p-0.5 shadow-lg">
                                            <button
                                                onClick={() => setShowContactForm(true)}
                                                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-b from-transparent to-black/5 text-white rounded-[10px] font-semibold hover:from-transparent hover:to-black/10 transition-all"
                                            >
                                                Consulta Personalizada Gratuita
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* Trust elements aprimorados */}
                                        <div className="mt-6 flex flex-col items-center">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="flex -space-x-2">
                                                    <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">JM</div>
                                                    <div className="w-7 ml-[-5px] h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">LF</div>
                                                    <div className="w-7 ml-[-5px] h-7 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">JL</div>
                                                </div>
                                                <span className="text-sm text-gray-800 font-medium">3 corretores disponíveis agora</span>
                                            </div>

                                            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Check className="w-3 h-3 text-green-600" /> Atendimento personalizado
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Check className="w-3 h-3 text-green-600" /> Sem compromisso
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Check className="w-3 h-3 text-green-600" /> Experiência local desde 2010
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
        </div>            {/* Contact form modal aprimorado */}
        <AnimatePresence>
            {showContactForm && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
                    onClick={() => setShowContactForm(false)}
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
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Consultoria Personalizada
                                </h3>
                                <p className="text-gray-600 text-sm mt-1">Um especialista entrará em contato em até 24h</p>
                            </div>
                            <button
                                onClick={() => setShowContactForm(false)}
                                className="text-gray-400 hover:text-gray-600 p-1"
                                aria-label="Fechar"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>                            <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        <div className="flex items-center">
                                            <div className="p-1 bg-amber-100 rounded-md mr-2">
                                                <User className="w-3.5 h-3.5 text-amber-700" />
                                            </div>
                                            Nome completo
                                        </div>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all ${formErrors.name ? 'border-red-500' : 'border-gray-200'
                                            }`}
                                        placeholder="Digite seu nome completo"
                                    />                                    {formErrors.name && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                            <span className="w-4 h-4 text-white bg-red-500 rounded-full flex items-center justify-center text-[10px]">!</span>
                                            {formErrors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        <div className="flex items-center">
                                            <div className="p-1 bg-amber-100 rounded-md mr-2">
                                                <Phone className="w-3.5 h-3.5 text-amber-700" />
                                            </div>
                                            WhatsApp/Celular
                                        </div>
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all ${formErrors.phone ? 'border-red-500' : 'border-gray-200'
                                            }`}
                                        placeholder="(11) 99999-9999"
                                    />                                    {formErrors.phone && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                            <span className="w-4 h-4 text-white bg-red-500 rounded-full flex items-center justify-center text-[10px]">!</span>
                                            {formErrors.phone}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    <div className="flex items-center">
                                        <div className="p-1 bg-amber-100 rounded-md mr-2">
                                            <Mail className="w-3.5 h-3.5 text-amber-700" />
                                        </div>
                                        E-mail
                                    </div>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all ${formErrors.email ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                    placeholder="seu@email.com"
                                />                                {formErrors.email && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <span className="w-4 h-4 text-white bg-red-500 rounded-full flex items-center justify-center text-[10px]">!</span>
                                        {formErrors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                                    value={formData.message}
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
                                    onClick={() => setShowContactForm(false)}
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
            )}
        </AnimatePresence>
    </section>
    );
};

export default GuararemaHero;