'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageCircle } from 'lucide-react';

const navigationLinks = [
    { label: "Início", href: "/" },
    { label: "Comprar", href: "/comprar" },
    { label: "Alugar", href: "/alugar" },
    { label: "Contato", href: "/contato" },
];

interface CleanNavbarProps {
    transparent?: boolean;
}

export default function CleanNavbar({ transparent = false }: CleanNavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsMounted(true);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Previne hydration mismatch
    if (!isMounted) {
        return (
            <div className="h-20" /> // Espaçador para evitar salto no conteúdo
        );
    } const navBgClass = transparent && !isScrolled && !isMobileMenuOpen
        ? 'bg-transparent'
        : isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-md border-b border-stone-200/50'
            : 'bg-white/90 backdrop-blur-lg';

    const linkColorClass = transparent && !isScrolled && !isMobileMenuOpen
        ? 'text-white hover:text-amber-200'
        : 'text-stone-700 hover:text-amber-700';

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${navBgClass}`}
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className={`flex justify-between items-center transition-all duration-300 ${isScrolled ? 'py-3' : 'py-4'}`}>
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0 group">
                            <Image
                                src={transparent && !isScrolled ? "/images/ipeLogoWrittenWhite.png" : "/images/ipeLogoWritten.png"}
                                alt="Ipê Imobiliária"
                                width={isScrolled ? 140 : 160}
                                height={isScrolled ? 35 : 40}
                                className="object-contain transition-all duration-300 group-hover:scale-105"
                                priority
                            />
                        </Link>

                        {/* Desktop Navigation */}                        <div className="hidden md:flex items-center space-x-2">
                            {navigationLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className={`relative px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 group ${pathname === link.href
                                        ? transparent && !isScrolled
                                            ? 'text-white bg-white/15 backdrop-blur-sm border border-white/20'
                                            : 'text-amber-800 bg-amber-50 border border-amber-200'
                                        : linkColorClass
                                        } hover:scale-105`}
                                >
                                    {link.label}

                                    {/* Active indicator */}
                                    {pathname === link.href && (
                                        <motion.div
                                            layoutId="activeNavItem"
                                            className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 rounded-full ${transparent && !isScrolled ? 'bg-amber-300' : 'bg-amber-600'
                                                }`}
                                            transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                                        />
                                    )}
                                </Link>
                            ))}

                            {/* Botão de Contato Premium */}
                            <Link
                                href="/contato"
                                className={`ml-6 px-8 py-3 text-sm font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg ${transparent && !isScrolled
                                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-900 hover:from-amber-300 hover:to-amber-400 shadow-amber-400/30'
                                    : 'bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 shadow-amber-600/30'
                                    }`}
                            >
                                <span className="flex items-center gap-3">
                                    <MessageCircle className="w-5 h-5" />
                                    Fale Conosco
                                </span>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`md:hidden p-3 rounded-xl border transition-all duration-300 ${transparent && !isScrolled
                                ? 'text-white hover:bg-white/10 border-white/20 backdrop-blur-sm'
                                : 'text-stone-600 hover:bg-stone-100 border-stone-200'
                                }`}
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-stone-200"
                        >
                            <div className="max-w-7xl mx-auto px-6 py-6 space-y-2">
                                {navigationLinks.map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`block px-6 py-4 text-lg font-semibold rounded-xl transition-all duration-200 ${pathname === link.href
                                            ? 'text-amber-800 bg-amber-50 border border-amber-200'
                                            : 'text-stone-700 hover:bg-stone-50'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <Link
                                    href="/contato"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-6 py-4 text-lg font-bold text-white bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-200 shadow-lg shadow-amber-600/30 mt-4"
                                >
                                    <span className="flex items-center gap-3">
                                        <MessageCircle className="w-5 h-5" />
                                        Fale Conosco
                                    </span>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Espaçador para evitar que o conteúdo fique sob a navbar */}
            <div className="h-20" />
        </>
    );
}
