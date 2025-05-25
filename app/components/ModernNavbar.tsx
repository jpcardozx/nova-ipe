"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, X, Menu } from "lucide-react";
import "../styles/modern-navbar.css";

const links = [
    { label: "Início", href: "/" },
    { label: "Comprar", href: "/comprar" },
    { label: "Alugar", href: "/alugar" },
    { label: "Sobre Nós", href: "/sobre" },
    { label: "Contato", href: "#contato" },
];

const ModernNavbar: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();

    // Memoize handlers to prevent unnecessary re-renders
    const handleScroll = useMemo(
        () => () => setScrolled(window.scrollY > 20),
        []
    );

    const checkMobile = useMemo(
        () => () => setIsMobile(window.innerWidth < 768),
        []
    );

    useEffect(() => {
        setIsMounted(true);
        handleScroll();
        checkMobile();

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", checkMobile);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", checkMobile);
        };
    }, [handleScroll, checkMobile]);

    // Prevent hydration mismatch
    if (!isMounted) {
        return (
            <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <Link href="/" aria-label="Ir para página inicial">
                        <div className="relative">
                            <Image
                                src="/images/ipeLogoWritten.png"
                                alt="Ipê Imóveis"
                                width={150}
                                height={48}
                                className="object-contain"
                                priority
                            />
                        </div>
                    </Link>
                </div>
            </nav>
        );
    } return (
        <>
            <motion.nav
                className={`modern-navbar fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
                        ? "bg-white/96 backdrop-blur-lg shadow-lg border-b border-gray-100 py-3 scrolled"
                        : "bg-white/92 backdrop-blur-md border-b border-gray-50 py-4"
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">                        {/* Logo */}
                        <Link href="/" aria-label="Ir para página inicial" className="logo-container group relative">
                            <div className="absolute -inset-2 rounded-xl bg-amber-50/0 group-hover:bg-amber-50/80 transition-colors duration-300" />
                            <div className="relative">
                                <Image
                                    src="/images/ipeLogoWritten.png"
                                    alt="Ipê Imóveis"
                                    width={scrolled ? 135 : 150}
                                    height={scrolled ? 43 : 48}
                                    className={`object-contain transition-all duration-300 ${scrolled ? 'scale-95' : 'scale-100'
                                        }`}
                                    priority
                                />
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        {!isMobile && (
                            <div className="flex items-center gap-12">
                                {/* Navigation Links */}
                                <ul className="flex items-center gap-8">
                                    {links.map(({ label, href }) => (
                                        <li key={label}>                                            <Link
                                            href={href}
                                            className={`nav-link relative text-sm font-medium transition-colors duration-200 hover:text-amber-600 ${pathname === href
                                                    ? "text-amber-600"
                                                    : "text-gray-700"
                                                }`}
                                        >
                                            {label}
                                            {/* Active indicator */}
                                            {pathname === href && (
                                                <motion.div
                                                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-500 rounded-full"
                                                    layoutId="activeTab"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                />
                                            )}
                                            {/* Hover indicator */}
                                            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-400 rounded-full scale-x-0 origin-left transition-transform duration-200 group-hover:scale-x-100" />
                                        </Link>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Buttons */}
                                <div className="flex items-center gap-3">
                                    {/* Phone CTA */}
                                    <motion.a
                                        href="tel:+551146932350"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-amber-600 transition-colors group"
                                    >
                                        <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-medium">
                                            (11) 4693-2350
                                        </span>
                                    </motion.a>                                    {/* WhatsApp CTA */}
                                    <motion.a
                                        href="https://wa.me/5511981845016"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="whatsapp-button flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-green-700 hover:to-green-600 transition-all shadow-sm hover:shadow-md"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        <span>Falar com especialista</span>
                                    </motion.a>
                                </div>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        {isMobile && (
                            <motion.button
                                onClick={() => setOpen(!open)}
                                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                                aria-label="Menu"
                                aria-expanded={open}
                                whileTap={{ scale: 0.95 }}
                            >
                                <AnimatePresence mode="wait">
                                    {open ? (
                                        <motion.div
                                            key="close"
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <X className="w-6 h-6" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="menu"
                                            initial={{ rotate: 90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: -90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Menu className="w-6 h-6" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {open && isMobile && (<motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="mobile-menu bg-white border-t border-gray-100 shadow-xl"
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                            {/* Mobile Navigation Links */}
                            <ul className="space-y-2 mb-6">
                                {links.map(({ label, href }, index) => (
                                    <motion.li
                                        key={label}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link
                                            href={href}
                                            onClick={() => setOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === href
                                                    ? "bg-amber-50 text-amber-700"
                                                    : "text-gray-700 hover:bg-gray-50"
                                                }`}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${pathname === href ? "bg-amber-500" : "bg-gray-300"
                                                }`} />
                                            <span className="font-medium">{label}</span>
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>

                            {/* Mobile CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-3 pt-6 border-t border-gray-100"
                            >
                                {/* WhatsApp Button */}
                                <a
                                    href="https://wa.me/5511981845016"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-600 transition-all shadow-sm"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    <span>Falar via WhatsApp</span>
                                </a>

                                {/* Phone Button */}
                                <a
                                    href="tel:+551146932350"
                                    className="flex items-center justify-center gap-2 w-full border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                                >
                                    <Phone className="w-4 h-4" />
                                    <span>(11) 4693-2350</span>
                                </a>
                            </motion.div>
                        </div>
                    </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Spacer para evitar sobreposição de conteúdo */}
            <div className={`transition-all duration-300 ${scrolled ? 'h-20' : 'h-24'}`} />
        </>
    );
};

export default ModernNavbar;
