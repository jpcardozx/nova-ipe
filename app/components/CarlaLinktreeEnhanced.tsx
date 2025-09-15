"use client";

import React from 'react';
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

const CarlaLinktreeEnhanced: React.FC = () => {

    const handleWhatsApp = () => {
        const message = encodeURIComponent('Olá Carla! Vi seu perfil e tenho interesse em conversar sobre imóveis.');
        window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
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
            title: 'Catálogo de Imóveis',
            subtitle: 'Veja todos os imóveis disponíveis',
            icon: Home,
            action: handleCatalogo,
            gradient: 'from-blue-500 to-blue-600',
            primary: true
        },
        {
            id: 'site',
            title: 'Site da Imobiliária',
            subtitle: 'Conheça nossa empresa',
            icon: Globe,
            action: handleWebsite,
            gradient: 'from-purple-500 to-purple-600',
            primary: false
        }
    ];

    const socialLinks: SocialItem[] = [
        {
            id: 'instagram',
            icon: Instagram,
            url: 'https://instagram.com/carla.imobiliaria',
            gradient: 'from-pink-500 to-orange-500'
        },
        {
            id: 'linkedin',
            icon: Linkedin,
            url: 'https://linkedin.com/in/carla-imobiliaria',
            gradient: 'from-blue-600 to-blue-700'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md mx-auto"
            >
                {/* Profile Section */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <div className="relative mb-6">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-1 shadow-xl"
                        >
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                    <Building2 size={40} className="text-blue-600" />
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                            className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-2 shadow-lg"
                        >
                            <Shield size={16} />
                        </motion.div>
                    </div>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-3xl font-bold text-gray-800 mb-2"
                    >
                        Carla
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-gray-600 mb-4 text-lg"
                    >
                        Corretora de Imóveis
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6"
                    >
                        <MapPin size={16} />
                        <span>Especialista em Imóveis</span>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="grid grid-cols-3 gap-4 mb-8"
                    >
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">50+</div>
                            <div className="text-xs text-gray-500">Imóveis Vendidos</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">100+</div>
                            <div className="text-xs text-gray-500">Clientes Satisfeitos</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">5★</div>
                            <div className="text-xs text-gray-500">Avaliação</div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Links Section */}
                <motion.div className="space-y-4 mb-8">
                    {primaryLinks.map((link, index) => (
                        <motion.button
                            key={link.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={link.action}
                            className={`w-full p-4 rounded-2xl bg-gradient-to-r ${link.gradient} text-white shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden ${link.primary ? 'shadow-2xl ring-2 ring-white ring-opacity-50' : ''
                                }`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white/20 rounded-xl">
                                        <link.icon size={24} />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold text-lg">{link.title}</div>
                                        <div className="text-sm opacity-90">{link.subtitle}</div>
                                    </div>
                                </div>
                                <ArrowUpRight size={20} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </motion.button>
                    ))}
                </motion.div>

                {/* Social Links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex justify-center gap-4 mb-8"
                >
                    {socialLinks.map((social, index) => (
                        <motion.a
                            key={social.id}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.9 + index * 0.1, type: "spring" }}
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-14 h-14 rounded-full bg-gradient-to-r ${social.gradient} flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                        >
                            <social.icon size={24} />
                        </motion.a>
                    ))}
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-center text-sm text-gray-500"
                >
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Heart size={16} className="text-red-500" />
                        <span>Feito com carinho para você</span>
                    </div>
                    <div className="text-xs">
                        © 2024 Imobiliária IPÊ • Todos os direitos reservados
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default CarlaLinktreeEnhanced;