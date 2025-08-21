"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle, Globe, Home, Star, Phone,
    MapPin, Calendar, Instagram, Linkedin,
    ArrowUpRight, Building2, Award, Shield, Heart
} from 'lucide-react';

interface LinkItem {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ComponentType<any>;
    action: () => void;
    gradient: string;
    primary: boolean;
}

interface SocialItem {
    id: string;
    icon: React.ComponentType<any>;
    url: string;
    gradient: string;
}

const JuliaLinktreeEnhanced: React.FC = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

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

    const primaryLinks: LinkItem[] = [
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

    const socialLinks: SocialItem[] = [
        {
            id: 'instagram',
            icon: Instagram,
            url: 'https://instagram.com/juliapcmello',
            gradient: 'from-pink-500 to-purple-600'
        },
    ];

    const stats = [
        { number: '<45min', label: 'Tempo médio de resposta', icon: Award },
        { number: '4.9', label: 'Avaliação média', icon: Star }
    ];

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{
                background: `linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)`
            }}>
                <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div 
                        className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <p className="text-slate-400 text-sm">Carregando...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div 
            className="min-h-screen relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{
                background: `
                    radial-gradient(circle at 20% 50%, rgba(245, 158, 11, 0.12) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
                    radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
                    linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)
                `
            }}
        >
            {/* Textured Overlay - Teoria da Cartolina */}
            <div 
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
            />
            
            {/* Atmospheric Light Effects */}
            <motion.div 
                className="absolute top-0 left-1/4 w-96 h-96 blur-3xl"
                style={{ background: `radial-gradient(circle, rgba(245, 158, 11, 0.04) 0%, transparent 70%)` }}
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.4, 0.6, 0.4]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div 
                className="absolute bottom-0 right-1/4 w-96 h-96 blur-3xl"
                style={{ background: `radial-gradient(circle, rgba(59, 130, 246, 0.04) 0%, transparent 70%)` }}
                animate={{
                    scale: [1.1, 1, 1.1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Main Content */}
            <div className="relative z-10 max-w-md mx-auto px-4 sm:px-6 py-8 sm:py-12 min-h-screen flex flex-col justify-center">

                {/* Profile Header */}
                <motion.div 
                    className="text-center mb-8"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {/* Profile Image */}
                    <motion.div 
                        className="relative mb-6"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto">
                            <div 
                                className="absolute inset-0 rounded-full p-1 shadow-2xl"
                                style={{
                                    background: `
                                        linear-gradient(45deg, #f59e0b, #f97316, #dc2626, #f59e0b),
                                        linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)
                                    `,
                                    boxShadow: `
                                        0 0 0 1px rgba(245, 158, 11, 0.3),
                                        0 8px 32px -4px rgba(245, 158, 11, 0.4),
                                        inset 0 1px 0 rgba(255, 255, 255, 0.2)
                                    `
                                }}
                            >
                                <div 
                                    className="w-full h-full rounded-full p-1"
                                    style={{
                                        background: `linear-gradient(145deg, #0f172a, #1e293b)`,
                                        boxShadow: `inset 0 2px 4px rgba(0, 0, 0, 0.3)`
                                    }}
                                >
                                    <div className="w-full h-full rounded-full overflow-hidden">
                                        <img
                                            src="/images/julia.png"
                                            alt="Julia de Mello"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Online Status */}
                            <motion.div 
                                className="absolute bottom-2 right-2 w-6 h-6 rounded-full border-4"
                                style={{
                                    background: `linear-gradient(135deg, #10b981, #059669)`,
                                    borderColor: `#0f172a`,
                                    boxShadow: `
                                        0 0 0 2px rgba(16, 185, 129, 0.3),
                                        0 4px 12px rgba(16, 185, 129, 0.4)
                                    `
                                }}
                                animate={{ 
                                    scale: [1, 1.1, 1],
                                    boxShadow: [
                                        '0 0 0 2px rgba(16, 185, 129, 0.3), 0 4px 12px rgba(16, 185, 129, 0.4)',
                                        '0 0 0 6px rgba(16, 185, 129, 0.2), 0 4px 12px rgba(16, 185, 129, 0.4)',
                                        '0 0 0 2px rgba(16, 185, 129, 0.3), 0 4px 12px rgba(16, 185, 129, 0.4)'
                                    ]
                                }}
                                transition={{ 
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut" 
                                }}
                            >
                                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1 shadow-sm" />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Name and Title */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        Julia de Mello
                    </h1>

                    <p className="text-slate-400 text-base sm:text-lg mb-6">
                        Corretora Imobiliária
                        <span className="block text-amber-400 text-sm mt-1">
                            Guararema & Região
                        </span>
                    </p>

                    {/* Company Badge */}
                    <motion.div 
                        className="inline-flex items-center gap-2 sm:gap-3 rounded-full px-3 sm:px-4 py-2 sm:py-3 mb-6 sm:mb-8 backdrop-blur-sm"
                        style={{
                            background: `
                                linear-gradient(135deg, rgba(254, 243, 199, 0.9), rgba(255, 237, 213, 0.9)),
                                linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%)
                            `,
                            border: `1px solid rgba(245, 158, 11, 0.3)`,
                            boxShadow: `
                                0 8px 32px -8px rgba(245, 158, 11, 0.3),
                                inset 0 1px 0 rgba(255, 255, 255, 0.4),
                                0 1px 3px rgba(0, 0, 0, 0.1)
                            `
                        }}
                        whileHover={{ scale: 1.02, y: -1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                            <img
                                src="/images/ipeLogo.png"
                                alt="Ipê Imóveis"
                                className="w-4 h-4 object-contain"
                            />
                        </div>
                        <span className="text-amber-800 font-semibold text-xs sm:text-sm">
                            Corretora Parceira Ipê Imóveis
                        </span>
                        <Star className="w-4 h-4 text-amber-500" />
                    </motion.div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div 
                    className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    {stats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <motion.div
                                key={index}
                                className="text-center backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 group cursor-default"
                                style={{
                                    background: `
                                        linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(51, 65, 85, 0.4)),
                                        linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)
                                    `,
                                    border: `1px solid rgba(71, 85, 105, 0.5)`,
                                    boxShadow: `
                                        0 4px 24px -4px rgba(0, 0, 0, 0.3),
                                        inset 0 1px 0 rgba(255, 255, 255, 0.1)
                                    `
                                }}
                                whileHover={{
                                    scale: 1.02,
                                    y: -2,
                                    boxShadow: `
                                        0 8px 32px -4px rgba(0, 0, 0, 0.4),
                                        inset 0 1px 0 rgba(255, 255, 255, 0.1),
                                        0 0 0 1px rgba(245, 158, 11, 0.3)
                                    `
                                }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            >
                                <div 
                                    className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300"
                                    style={{
                                        background: `linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.3))`,
                                        boxShadow: `inset 0 1px 2px rgba(245, 158, 11, 0.3)`
                                    }}
                                >
                                    <IconComponent className="w-4 h-4 text-amber-400" />
                                </div>
                                <div className="text-base sm:text-lg font-bold text-white mb-1">{stat.number}</div>
                                <div className="text-xs text-slate-400 leading-tight">{stat.label}</div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Primary Links */}
                <motion.div 
                    className="space-y-3 sm:space-y-4 mb-6 sm:mb-8"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    {primaryLinks.map((link, index) => {
                        const IconComponent = link.icon;

                        return (
                            <motion.button
                                key={link.id}
                                onClick={link.action}
                                className="w-full group relative overflow-hidden rounded-2xl shadow-xl backdrop-blur-sm"
                                style={{
                                    background: link.id === 'whatsapp' 
                                        ? `linear-gradient(135deg, #10b981, #059669)`
                                        : link.id === 'website'
                                        ? `linear-gradient(135deg, #f59e0b, #d97706)`
                                        : `linear-gradient(135deg, #3b82f6, #1d4ed8)`,
                                    boxShadow: `
                                        0 8px 32px -8px ${
                                            link.id === 'whatsapp' ? 'rgba(16, 185, 129, 0.4)'
                                            : link.id === 'website' ? 'rgba(245, 158, 11, 0.4)'
                                            : 'rgba(59, 130, 246, 0.4)'
                                        },
                                        inset 0 1px 0 rgba(255, 255, 255, 0.2)
                                    `
                                }}
                                whileHover={{
                                    scale: 1.02,
                                    y: -2,
                                    boxShadow: `
                                        0 12px 40px -8px ${
                                            link.id === 'whatsapp' ? 'rgba(16, 185, 129, 0.5)'
                                            : link.id === 'website' ? 'rgba(245, 158, 11, 0.5)'
                                            : 'rgba(59, 130, 246, 0.5)'
                                        },
                                        inset 0 1px 0 rgba(255, 255, 255, 0.3)
                                    `
                                }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ 
                                    duration: 0.6, 
                                    delay: 0.7 + index * 0.1,
                                    type: "spring", 
                                    stiffness: 300, 
                                    damping: 30 
                                }}
                            >
                                {/* Content */}
                                <div className="relative p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
                                    <div 
                                        className="p-3 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300"
                                        style={{
                                            background: `rgba(255, 255, 255, 0.2)`,
                                            boxShadow: `inset 0 1px 2px rgba(255, 255, 255, 0.3)`
                                        }}
                                    >
                                        <IconComponent className="w-6 h-6 text-white" />
                                    </div>

                                    <div className="flex-1 text-left">
                                        <h3 className="font-bold text-base sm:text-lg text-white mb-1">
                                            {link.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-white/80">
                                            {link.subtitle}
                                        </p>
                                    </div>

                                    <ArrowUpRight className="w-5 h-5 text-white/80 group-hover:rotate-45 group-hover:scale-110 transition-all duration-300" />
                                </div>
                            </motion.button>
                        );
                    })}
                </motion.div>

                {/* Social Links */}
                <motion.div 
                    className="flex justify-center gap-4 mb-6 sm:mb-8"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.0 }}
                >
                    {socialLinks.map((social) => {
                        const IconComponent = social.icon;
                        return (
                            <motion.a
                                key={social.id}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-xl shadow-lg backdrop-blur-sm"
                                style={{
                                    background: `linear-gradient(135deg, #ec4899, #8b5cf6)`,
                                    boxShadow: `
                                        0 8px 32px -8px rgba(236, 72, 153, 0.4),
                                        inset 0 1px 0 rgba(255, 255, 255, 0.2)
                                    `
                                }}
                                whileHover={{ 
                                    scale: 1.1, 
                                    y: -2,
                                    boxShadow: `
                                        0 12px 40px -8px rgba(236, 72, 153, 0.5),
                                        inset 0 1px 0 rgba(255, 255, 255, 0.3)
                                    `
                                }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            >
                                <IconComponent className="w-5 h-5 text-white" />
                            </motion.a>
                        );
                    })}
                </motion.div>

                {/* Contact Info */}
                <motion.div 
                    className="backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center"
                    style={{
                        background: `
                            linear-gradient(135deg, rgba(30, 41, 59, 0.3), rgba(51, 65, 85, 0.2)),
                            linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.03) 50%, transparent 70%)
                        `,
                        border: `1px solid rgba(71, 85, 105, 0.3)`,
                        boxShadow: `
                            0 8px 32px -8px rgba(0, 0, 0, 0.4),
                            inset 0 1px 0 rgba(255, 255, 255, 0.1)
                        `
                    }}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Shield className="w-4 h-4 text-amber-400" />
                        <span className="text-slate-300 font-semibold text-sm">
                            CRECI 282864-F
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

                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Especializada no mercado imobiliário de Guararema.
                            Ajudo famílias a realizarem o sonho do imóvel ideal com transparência e dedicação.
                        </p>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default JuliaLinktreeEnhanced;