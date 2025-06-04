"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
    TrendingUp, Home, ChevronRight, BarChart3,
    Building2, MapPin, Check, Clock, Shield,
    Phone, Mail, User, Trees, Car, Sparkles, Award, X
} from 'lucide-react';

// Nova Ipê Premium Color Palette
const colors = {
    primary: {
        ipe: '#D4A574', // Amarelo Ipê
        ipeLight: '#E8C49A',
        ipeDark: '#B8904C',
    },
    earth: {
        brown: '#8B4513', // Marrom terroso
        brownLight: '#A0522D',
        brownDark: '#654321',
    },
    neutral: {
        black: '#1A1A1A',
        charcoal: '#2D2D2D',
        white: '#FFFFFF',
        cream: '#FAF7F0',
        gray: '#F5F5F5',
    },
    accent: {
        gold: '#FFD700',
        bronze: '#CD7F32',
        sage: '#9CAF88',
    }
};

// Enhanced particle system for premium feel
const ParticleSystem = React.memo(() => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: Array<{
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            opacity: number;
            color: string;
        }> = [];

        // Create premium particles
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.3 + 0.1,
                color: i % 3 === 0 ? colors.primary.ipe :
                    i % 3 === 1 ? colors.accent.gold :
                        colors.earth.brown
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };

        animate();
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-10"
            style={{ background: 'transparent' }}
        />
    );
});

// Premium contact form component
const PremiumContactForm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        interest: 'comprar'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        const message = `Olá! Sou ${formData.name}, interessado em ${formData.interest} um imóvel. Meu contato: ${formData.email}, ${formData.phone}`;
        const whatsappUrl = `https://wa.me/5511981845016?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        setIsOpen(false);
    };

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(true)}
                className="group bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:via-amber-700 hover:to-yellow-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Sparkles className="w-5 h-5" />
                Consulta Gratuita
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Consulta Gratuita</h3>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Seu nome completo"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Seu e-mail"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    required
                                />
                                <input
                                    type="tel"
                                    placeholder="Seu WhatsApp"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    required
                                />
                                <select
                                    value={formData.interest}
                                    onChange={e => setFormData({ ...formData, interest: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                >
                                    <option value="comprar">Quero comprar</option>
                                    <option value="alugar">Quero alugar</option>
                                    <option value="vender">Quero vender</option>
                                    <option value="investir">Quero investir</option>
                                </select>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold py-3 rounded-lg transition-all duration-300"
                                >
                                    Falar com Especialista
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

// Premium Nova Ipê Hero Component
export default function PremiumNovaIpeHero() {
    const heroRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(heroRef, { once: true, amount: 0.3 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    if (!mounted) {
        return (
            <section className="relative min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </section>
        );
    }

    return (
        <section
            ref={heroRef}
            className="relative min-h-screen overflow-hidden bg-gradient-to-br from-stone-900 via-amber-900 to-stone-800"
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/hero-bg.jpg"
                    alt="Nova Ipê - Imóveis Premium em Guararema"
                    fill
                    className="object-cover opacity-30"
                    priority
                    quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-amber-900/30 to-stone-900/50"></div>
            </div>

            {/* Particle System */}
            <ParticleSystem />

            {/* Main Content */}
            <div className="relative z-20 container mx-auto px-6 lg:px-8 pt-24 pb-16 min-h-screen flex items-center">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate={isInView ? "animate" : "initial"}
                    className="grid lg:grid-cols-2 gap-12 items-center w-full"
                >
                    {/* Left Column - Content */}
                    <div className="space-y-8">
                        {/* Badge */}
                        <motion.div
                            variants={fadeInUp}
                            className="inline-flex items-center bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-sm border border-amber-400/30 text-amber-200 px-6 py-3 rounded-full text-sm font-semibold"
                        >
                            <Award className="w-4 h-4 mr-2" />
                            #1 Imobiliária Premium de Guararema
                        </motion.div>

                        {/* Main Headline */}
                        <motion.div variants={fadeInUp} className="space-y-4">
                            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                                <span className="text-white">Encontre o</span>
                                <br />
                                <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent">
                                    Lar dos Sonhos
                                </span>
                                <br />
                                <span className="text-white">em Guararema</span>
                            </h1>

                            <p className="text-xl lg:text-2xl text-stone-200 leading-relaxed max-w-2xl">
                                Imóveis <strong className="text-amber-400">exclusivos</strong> e
                                oportunidades únicas com a <em className="text-yellow-300">confiança Nova Ipê</em>.
                                Há mais de 15 anos realizando sonhos em Guararema.
                            </p>
                        </motion.div>

                        {/* Key Benefits */}
                        <motion.div
                            variants={fadeInUp}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                            {[
                                { icon: Shield, text: "Processo 100% Seguro" },
                                { icon: Clock, text: "Atendimento 24/7" },
                                { icon: Check, text: "Imóveis Verificados" },
                                { icon: TrendingUp, text: "Melhor Valorização" }
                            ].map((benefit, index) => (
                                <div key={index} className="flex items-center gap-3 text-stone-200">
                                    <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center">
                                        <benefit.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="font-medium">{benefit.text}</span>
                                </div>
                            ))}
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div
                            variants={fadeInUp}
                            className="flex flex-col sm:flex-row gap-4 pt-4"
                        >
                            <PremiumContactForm />

                            <Link
                                href="/comprar"
                                className="group bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105"
                            >
                                <Home className="w-5 h-5" />
                                Ver Imóveis
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            variants={fadeInUp}
                            className="flex items-center gap-8 pt-8 border-t border-white/20"
                        >
                            <div className="text-center">
                                <div className="text-2xl font-bold text-amber-400">500+</div>
                                <div className="text-sm text-stone-300">Famílias Realizadas</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-amber-400">15+</div>
                                <div className="text-sm text-stone-300">Anos de Experiência</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-amber-400">95%</div>
                                <div className="text-sm text-stone-300">Satisfação</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Image/Visual */}
                    <motion.div
                        variants={fadeInUp}
                        className="relative hidden lg:block"
                    >
                        <div className="relative w-full h-[600px] rounded-2xl overflow-hidden">
                            <Image
                                src="/images/predioIpe.png"
                                alt="Empreendimento Nova Ipê"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/50 to-transparent"></div>

                            {/* Floating elements */}
                            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center">
                                        <Building2 className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">Novo Lançamento</div>
                                        <div className="text-sm text-gray-600">Residencial Premium</div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                        <TrendingUp className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">+12%</div>
                                        <div className="text-sm text-gray-600">Valorização/Ano</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
            >
                <div className="flex flex-col items-center gap-2 text-white/70">
                    <span className="text-sm font-medium">Explore mais</span>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
                    >
                        <motion.div
                            animate={{ y: [0, 16, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-1 h-3 bg-white/50 rounded-full mt-2"
                        />
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
