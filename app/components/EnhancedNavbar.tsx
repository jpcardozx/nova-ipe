"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, Clock, ChevronDown } from "lucide-react";

const navigation = [
    {
        name: "Início",
        href: "/",
        description: "Página inicial"
    },
    {
        name: "Comprar",
        href: "/comprar",
        description: "Imóveis para compra"
    },
    {
        name: "Alugar",
        href: "/alugar",
        description: "Imóveis para locação"
    },
    {
        name: "Sobre",
        href: "/sobre",
        description: "Nossa história e equipe"
    },
    {
        name: "Contato",
        href: "#contato",
        description: "Fale conosco"
    },
];

const contactInfo = [
    { icon: Phone, text: "(11) 98184-5016", href: "tel:+5511981845016" },
    { icon: Mail, text: "contato@ipeimobiliaria.com.br", href: "mailto:contato@ipeimobiliaria.com.br" },
    { icon: MapPin, text: "São Paulo, SP", href: "#" },
];

export default function EnhancedNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsMounted(true);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Loading skeleton for SSR
    if (!isMounted) {
        return (
            <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
                <div className="bg-gray-50 py-2">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex justify-end space-x-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="py-4">
                    <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                        <div className="w-40 h-12 bg-gray-200 rounded animate-pulse" />
                        <div className="hidden md:flex space-x-8">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                            ))}
                        </div>
                        <div className="w-36 h-10 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Top Contact Bar */}
            <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className={`bg-stone-900 text-white transition-all duration-300 ${isScrolled ? "py-1" : "py-2"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 text-amber-400" />
                            <span className="text-stone-300">
                                Seg-Sex: 8h-18h | Sáb: 8h-14h
                            </span>
                        </div>

                        <div className="hidden md:flex items-center space-x-6">
                            {contactInfo.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className="flex items-center space-x-2 text-stone-300 hover:text-amber-400 transition-colors"
                                >
                                    <item.icon className="h-3 w-3" />
                                    <span className="text-xs">{item.text}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Navigation */}
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`fixed top-0 left-0 w-full z-40 bg-white shadow-sm transition-all duration-300 ${isScrolled
                    ? "shadow-lg backdrop-blur-md bg-white/95"
                    : "shadow-sm"
                    } ${isScrolled ? "mt-8" : "mt-12"}`}
            >
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0 group">
                            <Image
                                src="/images/ipeLogoWritten.png"
                                alt="Ipê Imobiliária"
                                width={isScrolled ? 140 : 160}
                                height={isScrolled ? 44 : 50}
                                className="object-contain transition-all duration-300 group-hover:scale-105"
                                priority
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg group ${pathname === item.href
                                        ? "text-amber-700 bg-amber-50"
                                        : "text-stone-700 hover:text-amber-700 hover:bg-stone-50"
                                        }`}
                                >
                                    {item.name}

                                    {/* Active indicator */}
                                    {pathname === item.href && (
                                        <motion.div
                                            layoutId="activeNavItem"
                                            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-amber-600 rounded-full"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <div className="flex items-center space-x-4">
                            <motion.a
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                href="https://wa.me/5511981845016?text=Olá! Tenho interesse em conhecer os imóveis da Ipê Imobiliária."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515" />
                                </svg>
                                Falar Agora
                            </motion.a>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                                aria-label="Toggle mobile menu"
                            >
                                <motion.div
                                    animate={isMobileMenuOpen ? "open" : "closed"}
                                    variants={{
                                        closed: { rotate: 0 },
                                        open: { rotate: 180 }
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {isMobileMenuOpen ? (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    )}
                                </motion.div>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
                        />

                        {/* Mobile Menu Panel */}
                        <motion.div
                            initial={{ x: "100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "100%", opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 right-0 z-40 w-80 h-full bg-white shadow-2xl md:hidden"
                        >
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-8">
                                    <Image
                                        src="/images/ipeLogoWritten.png"
                                        alt="Ipê Imobiliária"
                                        width={120}
                                        height={38}
                                        className="object-contain"
                                    />
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-2 rounded-lg text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Navigation Links */}
                                <nav className="space-y-2 mb-8">
                                    {navigation.map((item, index) => (
                                        <motion.div
                                            key={item.name}
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`block px-4 py-3 text-base font-medium rounded-xl transition-all ${pathname === item.href
                                                    ? "text-amber-700 bg-amber-50 border-l-4 border-amber-600"
                                                    : "text-stone-700 hover:text-amber-700 hover:bg-stone-50"
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span>{item.name}</span>
                                                    <ChevronDown className="w-4 h-4 rotate-[-90deg] text-stone-400" />
                                                </div>
                                                <span className="text-xs text-stone-500 mt-1 block">
                                                    {item.description}
                                                </span>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </nav>

                                {/* Contact Info */}
                                <div className="space-y-4 mb-6">
                                    <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wide">
                                        Contato
                                    </h3>
                                    {contactInfo.map((item, index) => (
                                        <Link
                                            key={index}
                                            href={item.href}
                                            className="flex items-center space-x-3 text-stone-600 hover:text-amber-600 transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <item.icon className="h-4 w-4" />
                                            <span className="text-sm">{item.text}</span>
                                        </Link>
                                    ))}
                                </div>

                                {/* CTA Button */}
                                <motion.a
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    href="https://wa.me/5511981845016?text=Olá! Tenho interesse em conhecer os imóveis da Ipê Imobiliária."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515" />
                                    </svg>
                                    Falar no WhatsApp
                                </motion.a>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
