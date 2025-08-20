"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    MessageCircle, Globe, Home, Star, Phone,
    MapPin, Calendar, Instagram, Linkedin,
    ArrowUpRight, Building2, Award, Shield, Heart, Sparkles
} from 'lucide-react';

const JuliaLinktreeProfessional: React.FC = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [clickFeedback, setClickFeedback] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleClick = (action: () => void, id: string) => {
        setClickFeedback(id);
        setTimeout(() => setClickFeedback(null), 200);
        action();
    };

    const handleWhatsApp = () => {
        const message = encodeURIComponent('Olá Julia! Vi seu perfil e tenho interesse em conversar sobre imóveis em Guararema.');
        window.open(`https://wa.me/5511981024749?text=${message}`, '_blank');
    };

    const handleWebsite = () => {
        window.open('https://imobiliariaipe.com.br', '_blank');
    };

    const handleCatalogo = () => {
        window.open('https://imobiliariaipe.com.br/catalogo', '_blank');
    };

    const primaryLinks = [
        {
            id: 'whatsapp',
            title: 'Conversar no WhatsApp',
            subtitle: 'Resposta rápida garantida',
            icon: MessageCircle,
            action: handleWhatsApp,
            gradient: 'from-green-500 to-green-600',
            primary: true
        },
        {
            id: 'website',
            title: 'Site da Ipê Imóveis',
            subtitle: 'Catálogo completo de imóveis',
            icon: Globe,
            action: handleWebsite,
            gradient: 'from-amber-500 to-amber-600',
            primary: false
        },
        {
            id: 'catalogo',
            title: 'Ver Imóveis Disponíveis',
            subtitle: 'Casas, terrenos e sítios',
            icon: Home,
            action: handleCatalogo,
            gradient: 'from-blue-500 to-blue-600',
            primary: false
        }
    ];

    const socialLinks = [
        {
            id: 'instagram',
            icon: Instagram,
            url: 'https://instagram.com/julia.ipeimoveis',
            gradient: 'from-pink-500 to-purple-600'
        },
        {
            id: 'linkedin',
            icon: Linkedin,
            url: 'https://linkedin.com/in/julia-mello-imoveis',
            gradient: 'from-blue-600 to-blue-700'
        }
    ];

    const stats = [
        { number: '2+', label: 'Anos de experiência', icon: Award },
        { number: '30+', label: 'Imóveis analisados', icon: Home },
        { number: '50+', label: 'Famílias atendidas', icon: Heart },
        { number: '4.9', label: 'Avaliação média', icon: Star }
    ];

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                >
                    <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 text-sm">Carregando...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">

            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-green-500/5" />
                <motion.div
                    className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-20 left-20 w-60 h-60 bg-gradient-to-tr from-green-500/8 to-emerald-500/8 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-md mx-auto px-6 py-12 min-h-screen flex flex-col justify-center">

                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8"
                >
                    {/* Profile Image */}
                    <motion.div
                        className="relative mb-6"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="relative w-32 h-32 mx-auto">
                            <motion.div
                                className="absolute inset-0 rounded-full p-1"
                                style={{
                                    background: 'conic-gradient(from 0deg, #f59e0b, #f97316, #ef4444, #8b5cf6, #06b6d4, #f59e0b)'
                                }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            >
                                <div className="w-full h-full rounded-full bg-slate-900 p-1">
                                    <div className="w-full h-full rounded-full overflow-hidden">
                                        <img
                                            src="/images/julia.png"
                                            alt="Julia de Mello"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Online Status */}
                            <motion.div
                                className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-slate-900"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1" />
                            </motion.div>

                            {/* Sparkle */}
                            <motion.div
                                className="absolute -top-1 -right-1"
                                animate={{
                                    y: [-5, 5, -5],
                                    rotate: [0, 180, 360]
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <Sparkles className="w-4 h-4 text-amber-400" />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Name and Title */}
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-3xl font-bold text-white mb-2"
                    >
                        Julia de Mello
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-slate-400 text-lg mb-6"
                    >
                        Corretora Imobiliária
                        <span className="block text-amber-400 text-sm mt-1">
                            Guararema & Região
                        </span>
                    </motion.p>

                    {/* Company Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-50/90 to-orange-50/90 border border-amber-200/50 rounded-full px-4 py-3 mb-8 shadow-xl"
                    >
                        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                            <img
                                src="/images/darkLogo.png"
                                alt="Ipê Imóveis"
                                className="w-4 h-4 object-contain"
                            />
                        </div>
                        <span className="text-amber-800 font-semibold text-sm">
                            Corretora Parceira Ipê Imóveis
                        </span>
                        <Star className="w-4 h-4 text-amber-500" />
                    </motion.div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="grid grid-cols-2 gap-4 mb-8"
                >
                    {stats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7 + index * 0.1 }}
                                whileHover={{ y: -3, scale: 1.02 }}
                                className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 text-center hover:border-amber-400/40 transition-all duration-300"
                            >
                                <div className="w-8 h-8 bg-amber-600/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                                    <IconComponent className="w-4 h-4 text-amber-400" />
                                </div>
                                <div className="text-lg font-bold text-white mb-1">{stat.number}</div>
                                <div className="text-xs text-slate-400">{stat.label}</div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Primary Links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="space-y-4 mb-8"
                >
                    {primaryLinks.map((link, index) => {
                        const IconComponent = link.icon;
                        const isHovered = hoveredCard === link.id;
                        const isClicked = clickFeedback === link.id;

                        return (
                            <motion.button
                                key={link.id}
                                onClick={() => handleClick(link.action, link.id)}
                                onMouseEnter={() => setHoveredCard(link.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.9 + index * 0.1 }}
                                whileHover={{ y: -3, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                            >
                                {/* Background */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${link.gradient}`} />

                                {/* Shine Effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                                    animate={{
                                        translateX: isHovered ? ['100%', '200%'] : '-100%'
                                    }}
                                    transition={{ duration: 0.6 }}
                                />

                                {/* Content */}
                                <div className="relative p-6 flex items-center gap-4">
                                    <motion.div
                                        className="p-3 rounded-xl bg-white/20 backdrop-blur-sm"
                                        animate={{
                                            scale: isClicked ? 0.9 : isHovered ? 1.1 : 1,
                                            rotate: isClicked ? -5 : isHovered ? 5 : 0
                                        }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <IconComponent className="w-6 h-6 text-white" />
                                    </motion.div>

                                    <div className="flex-1 text-left">
                                        <h3 className="font-bold text-lg text-white mb-1">
                                            {link.title}
                                        </h3>
                                        <p className="text-sm text-white/80">
                                            {link.subtitle}
                                        </p>
                                    </div>

                                    <motion.div
                                        animate={{
                                            x: isClicked ? 2 : isHovered ? 5 : 0,
                                            rotate: isClicked ? 90 : isHovered ? 45 : 0
                                        }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <ArrowUpRight className="w-5 h-5 text-white/80" />
                                    </motion.div>
                                </div>
                            </motion.button>
                        );
                    })}
                </motion.div>

                {/* Social Links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="flex justify-center gap-4 mb-8"
                >
                    {socialLinks.map((social, index) => {
                        const IconComponent = social.icon;
                        return (
                            <motion.a
                                key={social.id}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.3 + index * 0.1 }}
                                whileHover={{ y: -3, scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className={`p-3 rounded-xl bg-gradient-to-br ${social.gradient} shadow-lg hover:shadow-xl transition-all duration-300`}
                            >
                                <IconComponent className="w-5 h-5 text-white" />
                            </motion.a>
                        );
                    })}
                </motion.div>

                {/* Contact Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                    className="bg-slate-800/20 backdrop-blur-xl border border-slate-700/30 rounded-3xl p-6 text-center shadow-2xl"
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Shield className="w-4 h-4 text-amber-400" />
                        <span className="text-slate-300 font-semibold text-sm">
                            Corretora Certificada CRECI
                        </span>
                    </div>

                    <div className="space-y-2 text-slate-400 text-sm">
                        <div className="flex items-center justify-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>+55 11 98102-4749</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>Atendimento em Guararema e região</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Seg-Sex: 9h-18h | Sáb: 9h-14h</span>
                        </div>
                    </div>

                    <motion.div
                        className="mt-4 pt-4 border-t border-slate-700/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.6, duration: 0.6 }}
                    >
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Atendimento rápido no mercado imobiliário de Guararema.
                            Ajudo famílias a realizarem o sonho do imóvel ideal com transparência e dedicação.
                        </p>
                    </motion.div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                    className="absolute top-20 left-6 w-2 h-2 bg-amber-400 rounded-full opacity-40"
                    animate={{
                        y: [0, -10, 0],
                        opacity: [0.4, 0.8, 0.4]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                <motion.div
                    className="absolute bottom-32 right-8 w-1.5 h-1.5 bg-green-400 rounded-full opacity-30"
                    animate={{
                        y: [0, -8, 0],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                />
            </div>

        </div>
    );
};

export default JuliaLinktreeProfessional;