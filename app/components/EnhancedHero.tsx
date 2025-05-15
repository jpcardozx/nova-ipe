'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    TrendingUp, Home, ChevronRight, BarChart3,
    Building2, MapPin, Check, Clock, Shield,
    Phone, Mail, User, Trees, Car
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
    const isInView = useInView(heroRef, { once: true });

    // Realistic market metrics
    const marketMetrics: MarketMetric[] = [
        {
            id: 'growth',
            title: 'Valorização Média',
            value: '9.3%',
            subtitle: 'ao ano (2024)',
            icon: <TrendingUp className="w-5 h-5" />
        },
        {
            id: 'properties',
            title: 'Imóveis Analisados',
            value: '47',
            subtitle: 'oportunidades',
            icon: <Building2 className="w-5 h-5" />
        },
        {
            id: 'time',
            title: 'Tempo Médio',
            value: '65',
            subtitle: 'dias no mercado',
            icon: <Clock className="w-5 h-5" />
        }
    ];

    // Realistic neighborhood data
    const neighborhoodData: Record<'invest' | 'live', NeighborhoodData[]> = {
        invest: [
            {
                name: 'Centro',
                priceRange: 'R$ 600K - R$ 900K',
                characteristics: 'Comércio desenvolvido',
                distance: '0-5km do centro',
                highlight: 'Alta liquidez'
            },
            {
                name: 'Parque Agrinco',
                priceRange: 'R$ 450K - R$ 650K',
                characteristics: 'Área em crescimento',
                distance: '8km do centro',
                highlight: 'Potencial valorização'
            },
            {
                name: 'Itapema',
                priceRange: 'R$ 380K - R$ 550K',
                characteristics: 'Residencial',
                distance: '10km do centro',
                highlight: 'Entrada acessível'
            }
        ],
        live: [
            {
                name: 'Centro',
                priceRange: 'R$ 550K - R$ 850K',
                characteristics: 'Infraestrutura completa',
                distance: 'Centro da cidade',
                highlight: 'Tudo perto'
            },
            {
                name: 'Nogueira',
                priceRange: 'R$ 650K - R$ 950K',
                characteristics: 'Área verde',
                distance: '5km do centro',
                highlight: 'Natureza preservada'
            },
            {
                name: 'Lagoa Nova',
                priceRange: 'R$ 500K - R$ 750K',
                characteristics: 'Tranquilidade',
                distance: '7km do centro',
                highlight: 'Bairro familiar'
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

        console.log('Form submitted:', { ...formData, intent: selectedIntent });
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

    return (
        <section ref={heroRef} className="relative min-h-screen bg-white">
            {/* Background with image */}
            <div className="absolute inset-0">
                <img
                    src="/images/hero-bg.png"
                    alt="Vista aérea de Guararema"
                    className="absolute inset-0 w-full h-full object-cover opacity-10"
                />
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
                            </motion.div>

                            {/* Main headline */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-center mb-12"
                            >
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                    Encontre o imóvel ideal
                                    <span className="block text-amber-600">
                                        em Guararema
                                    </span>
                                </h1>

                                <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
                                    Análise personalizada do mercado local para ajudar você a
                                    tomar a melhor decisão, seja para morar ou investir.
                                </p>
                            </motion.div>

                            {/* Market metrics - realistic numbers */}
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
                                        className="bg-amber-50 rounded-xl p-6 border border-amber-200"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-2 bg-white text-amber-700 rounded-lg">
                                                {metric.icon}
                                            </div>
                                        </div>

                                        <h3 className="text-sm font-medium text-gray-700 mb-1">{metric.title}</h3>

                                        <div className="text-3xl font-bold text-gray-900 mb-1">
                                            {metric.id === 'properties' ? (
                                                <AnimatedCounter value={+50} />
                                            ) : metric.id === 'time' ? (
                                                <AnimatedCounter value={65} />
                                            ) : (
                                                metric.value
                                            )}
                                        </div>

                                        <p className="text-sm text-gray-600">{metric.subtitle}</p>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Intent selector */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="max-w-4xl mx-auto"
                            >
                                {/* Tabs */}
                                <div className="flex p-2 bg-gray-100 rounded-xl mb-8">
                                    <button
                                        onClick={() => setSelectedIntent('invest')}
                                        className={`
                      flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium transition-all duration-200
                      ${selectedIntent === 'invest'
                                                ? 'bg-amber-600 text-white'
                                                : 'text-gray-700 hover:text-gray-900'
                                            }
                    `}
                                    >
                                        <TrendingUp className="w-5 h-5" />
                                        <span>Quero Investir</span>
                                    </button>
                                    <button
                                        onClick={() => setSelectedIntent('live')}
                                        className={`
                      flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium transition-all duration-200
                      ${selectedIntent === 'live'
                                                ? 'bg-amber-600 text-white'
                                                : 'text-gray-700 hover:text-gray-900'
                                            }
                    `}
                                    >
                                        <Home className="w-5 h-5" />
                                        <span>Quero Morar</span>
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
                                    >
                                        <div className="bg-amber-50 rounded-2xl p-8 border border-amber-100">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-8">
                                                {selectedIntent === 'invest'
                                                    ? 'Oportunidades de Investimento'
                                                    : 'Melhores Bairros para Morar'
                                                }
                                            </h3>

                                            {/* Neighborhood list */}
                                            <div className="space-y-4 mb-8">
                                                {neighborhoodData[selectedIntent].map((neighborhood, index) => (
                                                    <motion.div
                                                        key={neighborhood.name}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        className="bg-white rounded-xl p-6 border border-amber-200"
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3 mb-3">
                                                                    <h4 className="text-lg font-bold text-gray-900">{neighborhood.name}</h4>
                                                                    <span className="px-3 py-1 text-xs font-semibold text-amber-800 bg-amber-100 rounded-full">
                                                                        {neighborhood.highlight}
                                                                    </span>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <p className="text-sm text-gray-700">
                                                                        <strong>Faixa de preço:</strong> {neighborhood.priceRange}
                                                                    </p>
                                                                    <p className="text-sm text-gray-700">
                                                                        <Trees className="inline w-4 h-4 text-amber-600 mr-1" />
                                                                        {neighborhood.characteristics}
                                                                    </p>
                                                                    <p className="text-sm text-gray-700">
                                                                        <Car className="inline w-4 h-4 text-amber-600 mr-1" />
                                                                        {neighborhood.distance}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>

                                            {/* CTA */}
                                            <button
                                                onClick={() => setShowContactForm(true)}
                                                className="w-full flex items-center justify-center gap-2 py-4 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors"
                                            >
                                                Falar com Consultor
                                                <ChevronRight className="w-5 h-5" />
                                            </button>

                                            {/* Trust text */}
                                            <p className="text-center text-sm text-gray-600 mt-6">
                                                Atendimento personalizado • Sem compromisso •
                                                Conhecimento local desde 2010
                                            </p>
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
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50"
                        onClick={() => setShowContactForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                Entre em Contato
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <User className="inline w-4 h-4 mr-1" />
                                        Nome
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${formErrors.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Seu nome"
                                    />
                                    {formErrors.name && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Mail className="inline w-4 h-4 mr-1" />
                                        E-mail
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${formErrors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="seu@email.com"
                                    />
                                    {formErrors.email && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Phone className="inline w-4 h-4 mr-1" />
                                        Telefone
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${formErrors.phone ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="(11) 99999-9999"
                                    />
                                    {formErrors.phone && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mensagem (opcional)
                                    </label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        rows={3}
                                        placeholder="Conte o que procura..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowContactForm(false)}
                                        className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 py-3 px-4 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-70"
                                    >
                                        {isSubmitting ? 'Enviando...' : 'Enviar'}
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