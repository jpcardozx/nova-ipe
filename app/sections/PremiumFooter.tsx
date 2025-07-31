'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    MapPin,
    Phone,
    Mail,
    Instagram,
    Facebook,
    Linkedin,
    Clock,
    Award,
    ArrowUp,
    Home,
    Building2,
    Users,
    Star,
    ChevronRight,
    MessageSquare,
    Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import { designSystem } from '../../lib/design-system';

interface FooterSection {
    title: string;
    links: Array<{
        name: string;
        href: string;
        icon?: any;
        external?: boolean;
    }>;
}

const footerSections: FooterSection[] = [
    {
        title: "Imóveis",
        links: [
            { name: "Casas à Venda", href: "/comprar?tipo=casa", icon: Home },
            { name: "Apartamentos", href: "/comprar?tipo=apartamento", icon: Building2 },
            { name: "Terrenos", href: "/comprar?tipo=terreno", icon: MapPin },
            { name: "Imóveis para Aluguel", href: "/alugar", icon: Home },
            { name: "Imóveis Comerciais", href: "/comprar?tipo=comercial", icon: Briefcase },
        ]
    },
    {
        title: "Serviços",
        links: [
            { name: "Avaliação Gratuita", href: "/contato?servico=avaliacao" },
            { name: "Consultoria Imobiliária", href: "/contato?servico=consultoria" },
            { name: "Documentação Completa", href: "/servicos/documentacao" },
            { name: "Financiamento", href: "/servicos/financiamento" },
            { name: "Visitas Agendadas", href: "/contato?servico=visitas" },
        ]
    },
    {
        title: "Empresa",
        links: [
            { name: "Sobre a Ipê Imóveis", href: "/sobre" },
            { name: "Nossa Equipe", href: "/equipe" },
            { name: "15 Anos de História", href: "/historia" },
            { name: "Depoimentos", href: "/depoimentos" },
            { name: "Trabalhe Conosco", href: "/carreira" },
        ]
    },
    {
        title: "Suporte",
        links: [
            { name: "Central de Ajuda", href: "/ajuda" },
            { name: "Política de Privacidade", href: "/privacidade" },
            { name: "Termos de Uso", href: "/termos" },
            { name: "Contato", href: "/contato" },
        ]
    }
];

const socialLinks = [
    {
        name: "Instagram",
        href: "https://instagram.com/ipeimoveis",
        icon: Instagram,
        color: "hover:text-pink-500"
    },
    {
        name: "Facebook",
        href: "https://facebook.com/ipeimoveis",
        icon: Facebook,
        color: "hover:text-blue-600"
    },
    {
        name: "LinkedIn",
        href: "https://linkedin.com/company/ipeimoveis",
        icon: Linkedin,
        color: "hover:text-blue-700"
    }
];

const quickStats = [
    { number: "500+", label: "Famílias Atendidas", icon: Users },
    { number: "15", label: "Anos de Experiência", icon: Award },
    { number: "4.9", label: "Avaliação Média", icon: Star },
];

export default function PremiumFooter() {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const { scrollY } = useScroll();
    
    const footerY = useTransform(scrollY, [0, 500], [50, 0]);
    const footerOpacity = useTransform(scrollY, [0, 300], [0.8, 1]);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleWhatsAppContact = () => {
        const message = "Olá! Gostaria de mais informações sobre os serviços da Ipê Imóveis.";
        window.open(`https://wa.me/5511981845016?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <>
            {/* Newsletter Section */}
            <section className="bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Receba novos imóveis primeiro
                            </h2>
                            <p className="text-xl text-white/90 mb-8">
                                Cadastre-se e seja o primeiro a conhecer as melhores oportunidades em Guararema
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="Seu melhor e-mail"
                                    className="flex-1 px-6 py-4 rounded-xl border-0 text-neutral-800 placeholder:text-neutral-500 focus:ring-4 focus:ring-white/20 outline-none"
                                />
                                <button className="bg-white text-primary-600 font-semibold px-8 py-4 rounded-xl hover:bg-neutral-50 transition-colors duration-200 flex items-center justify-center gap-2">
                                    Cadastrar
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Main Footer */}
            <motion.footer 
                className="bg-neutral-900 text-white"
                style={{ y: footerY, opacity: footerOpacity }}
            >
                {/* Quick Stats Bar */}
                <div className="border-b border-neutral-800">
                    <div className="container mx-auto px-4 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            {quickStats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex items-center justify-center gap-4"
                                >
                                    <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center">
                                        <stat.icon size={24} className="text-primary-400" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-3xl font-bold text-white">{stat.number}</div>
                                        <div className="text-neutral-400">{stat.label}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="container mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Brand Section */}
                        <div className="lg:col-span-4">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold mb-2">Ipê Imóveis</h3>
                                    <p className="text-neutral-300 text-lg leading-relaxed">
                                        Há 15 anos conectando famílias aos seus lares ideais em Guararema e região. 
                                        Experiência, confiança e atendimento personalizado.
                                    </p>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-3 text-neutral-300">
                                        <MapPin size={20} className="text-primary-400 flex-shrink-0" />
                                        <span>Guararema, São Paulo - SP</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-neutral-300">
                                        <Phone size={20} className="text-primary-400 flex-shrink-0" />
                                        <span>(11) 98184-5016</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-neutral-300">
                                        <Mail size={20} className="text-primary-400 flex-shrink-0" />
                                        <span>contato@ipeimoveis.com.br</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-neutral-300">
                                        <Clock size={20} className="text-primary-400 flex-shrink-0" />
                                        <span>Seg à Sex: 8h às 18h | Sáb: 8h às 14h</span>
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div>
                                    <h4 className="font-semibold mb-4">Siga-nos</h4>
                                    <div className="flex gap-4">
                                        {socialLinks.map((social) => (
                                            <Link
                                                key={social.name}
                                                href={social.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={cn(
                                                    "w-12 h-12 bg-neutral-800 hover:bg-neutral-700 rounded-full flex items-center justify-center transition-all duration-300",
                                                    social.color
                                                )}
                                            >
                                                <social.icon size={20} />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Footer Links */}
                        <div className="lg:col-span-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {footerSections.map((section, index) => (
                                    <motion.div
                                        key={section.title}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                    >
                                        <h4 className="font-semibold text-white mb-6 tracking-wider">
                                            {section.title}
                                        </h4>
                                        <ul className="space-y-3">
                                            {section.links.map((link) => (
                                                <li key={link.name}>
                                                    <Link
                                                        href={link.href}
                                                        className="text-neutral-300 hover:text-primary-400 transition-colors duration-200 flex items-center gap-2 group"
                                                    >
                                                        {link.icon && (
                                                            <link.icon size={16} className="group-hover:translate-x-1 transition-transform" />
                                                        )}
                                                        <span>{link.name}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-neutral-800">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="text-neutral-400 text-sm">
                                © 2024 Ipê Imóveis. Todos os direitos reservados.
                            </div>
                            
                            <div className="flex items-center gap-6 text-sm">
                                <Link href="/privacidade" className="text-neutral-400 hover:text-primary-400 transition-colors">
                                    Privacidade
                                </Link>
                                <Link href="/termos" className="text-neutral-400 hover:text-primary-400 transition-colors">
                                    Termos
                                </Link>
                                <Link href="/cookies" className="text-neutral-400 hover:text-primary-400 transition-colors">
                                    Cookies
                                </Link>
                            </div>

                            <div className="text-neutral-400 text-sm">
                                CRECI: 123456-SP
                            </div>
                        </div>
                    </div>
                </div>
            </motion.footer>

            {/* WhatsApp Float Button */}
            <motion.button
                onClick={handleWhatsAppContact}
                className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 }}
            >
                <MessageSquare size={24} className="group-hover:scale-110 transition-transform" />
            </motion.button>

            {/* Scroll to Top Button */}
            <motion.button
                onClick={scrollToTop}
                className={cn(
                    "fixed bottom-24 right-6 w-12 h-12 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-all duration-300",
                    showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <ArrowUp size={20} />
            </motion.button>
        </>
    );
}