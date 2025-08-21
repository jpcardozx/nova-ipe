"use client";

import React, { useState, useEffect } from 'react';
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

const JuliaLinktreeSimple: React.FC = () => {
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
        { number: '-45min', label: 'Tempo médio de resposta', icon: Award },
        { number: '4.9', label: 'Avaliação média', icon: Star }
    ];

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 text-sm">Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">

            {/* Simple Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-green-500/5" />

            {/* Main Content */}
            <div className="relative z-10 max-w-md mx-auto px-4 sm:px-6 py-8 sm:py-12 min-h-screen flex flex-col justify-center">

                {/* Profile Header */}
                <div className="text-center mb-8">
                    {/* Profile Image */}
                    <div className="relative mb-6">
                        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto">
                            <div className="absolute inset-0 rounded-full p-1 bg-gradient-to-r from-amber-500 to-orange-500">
                                <div className="w-full h-full rounded-full bg-slate-900 p-1">
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
                            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-slate-900">
                                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1" />
                            </div>
                        </div>
                    </div>

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
                    <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-amber-50/90 to-orange-50/90 border border-amber-200/50 rounded-full px-3 sm:px-4 py-2 sm:py-3 mb-6 sm:mb-8 shadow-xl">
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
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    {stats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <div
                                key={index}
                                className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center hover:border-amber-400/40 transition-all duration-300"
                            >
                                <div className="w-8 h-8 bg-amber-600/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                                    <IconComponent className="w-4 h-4 text-amber-400" />
                                </div>
                                <div className="text-base sm:text-lg font-bold text-white mb-1">{stat.number}</div>
                                <div className="text-xs text-slate-400 leading-tight">{stat.label}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Primary Links */}
                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    {primaryLinks.map((link) => {
                        const IconComponent = link.icon;

                        return (
                            <button
                                key={link.id}
                                onClick={link.action}
                                className="w-full group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                            >
                                {/* Background */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${link.gradient}`} />

                                {/* Content */}
                                <div className="relative p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
                                    <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
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

                                    <ArrowUpRight className="w-5 h-5 text-white/80 group-hover:rotate-45 transition-transform duration-300" />
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-4 mb-6 sm:mb-8">
                    {socialLinks.map((social) => {
                        const IconComponent = social.icon;
                        return (
                            <a
                                key={social.id}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-3 rounded-xl bg-gradient-to-br ${social.gradient} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110`}
                            >
                                <IconComponent className="w-5 h-5 text-white" />
                            </a>
                        );
                    })}
                </div>

                {/* Contact Info */}
                <div className="bg-slate-800/20 backdrop-blur-xl border border-slate-700/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center shadow-2xl">
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

                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Especializada no mercado imobiliário de Guararema.
                            Ajudo famílias a realizarem o sonho do imóvel ideal com transparência e dedicação.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JuliaLinktreeSimple;