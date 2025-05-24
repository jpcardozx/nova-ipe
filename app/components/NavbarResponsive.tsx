"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const links = [
    { label: "Início", href: "/" },
    { label: "Comprar", href: "/comprar" },
    { label: "Alugar", href: "/alugar" },
    { label: "Sobre Nós", href: "/sobre" },
    { label: "Contato", href: "#contato" },
];

const NavbarResponsive: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();

    // Memoize handlers to prevent unnecessary re-renders
    const handleScroll = useMemo(
        () => () => setScrolled(window.scrollY > 50),
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
    }, [handleScroll, checkMobile]); if (!isMounted) {
        // Return static navbar for SSR to prevent hydration mismatch
        return (
            <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-lg border-b border-neutral-200 shadow-sm transition-all duration-300 py-4">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">                    <Link href="/" aria-label="Ir para página inicial" className="group relative">
                    <div className="relative">                        <Image
                        src="/images/ipeLogoWritten.png"
                        alt="Ipê Imóveis"
                        width={140}
                        height={45}
                        style={{
                            width: '140px',
                            height: 'auto',
                            maxHeight: '45px'
                        }}
                        className="object-contain"
                        priority
                        loading="eager"
                        fetchPriority="high"
                    />
                    </div>
                </Link>
                </div>
            </nav>
        );
    } return (
        <motion.nav
            className={`navbar fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-lg border-b border-neutral-200 shadow-sm transition-all duration-300 ease-in-out ${scrolled ? "h-16 py-1.5" : "h-24 py-4"
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                {/* Logo com efeito de hover e scala */}
                <Link href="/" aria-label="Ir para página inicial" className="group relative">
                    <div className="absolute -inset-y-2 -inset-x-4 group-hover:bg-amber-50/50 rounded-xl transition-colors duration-300"></div>                    <div className="relative">                        <Image
                        src="/images/ipeLogoWritten.png"
                        alt="Ipê Imóveis"
                        width={140}
                        height={45}
                        style={{
                            width: '140px',
                            height: 'auto',
                            maxHeight: '45px'
                        }}
                        className={`object-contain transition-transform duration-300 ease-in-out ${scrolled ? 'scale-90' : 'scale-100'}`}
                        priority
                        loading="eager"
                        fetchPriority="high"
                    />
                    </div>
                </Link>

                {/* Desktop Navigation */}
                {!isMobile && (
                    <div className="flex items-center gap-8">
                        <ul className="flex gap-7 text-gray-800 text-button font-body">
                            {links.map(({ label, href }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        className={`relative group transition-colors ${pathname === href ? "text-amber-600 font-semibold" : "hover:text-amber-700"}`}
                                    >
                                        {label}
                                        <span className={`pointer-events-none absolute left-0 -bottom-0.5 h-[2px] w-full overflow-hidden ${pathname === href ? 'bg-amber-600' : 'bg-transparent'}`}>
                                            <span className="block h-full w-full origin-left scale-x-0 bg-amber-500 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-x-100" />
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* WhatsApp Button com UI melhorada */}
                        <motion.a
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            href="https://wa.me/5511981845016"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:from-green-700 hover:to-green-600 transition-all shadow-sm hover:shadow-md"
                        >
                            <div className="flex items-center justify-center w-5 h-5 bg-white/20 rounded-full">
                                <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M20.5 3.5c-2.6-2.6-6.9-2.6-9.5 0-2.2 2.2-2.5 5.6-1 8.2L3 21l9.3-7c2.6 1.5 6 .8 8.2-1 2.6-2.6 2.6-6.9 0-9.5z" />
                                </svg>
                            </div>
                            <span>Fale com um consultor</span>
                        </motion.a>
                    </div>
                )}                {/* Mobile Menu Button com animação */}
                {isMobile && (
                    <motion.button
                        onClick={() => setOpen(!open)}
                        className={`text-gray-700 flex items-center justify-center p-2 rounded-lg ${open ? 'bg-amber-50' : ''}`}
                        aria-label="Abrir menu"
                        aria-expanded={open}
                        whileTap={{ scale: 0.92 }}
                    >
                        <span className="sr-only">Menu</span>
                        <div className="w-10 h-10 flex items-center justify-center relative">
                            <motion.div
                                animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                                className="absolute w-6 h-0.5 bg-gray-800 rounded-full"
                                style={{ transformOrigin: "center" }}
                            />
                            <motion.div
                                animate={open ? { opacity: 0 } : { opacity: 1 }}
                                className="absolute w-6 h-0.5 bg-gray-800 rounded-full"
                            />
                            <motion.div
                                animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                                className="absolute w-6 h-0.5 bg-gray-800 rounded-full"
                                style={{ transformOrigin: "center" }}
                            />
                        </div>
                    </motion.button>
                )}
            </div>            {/* Mobile Menu com design aprimorado */}
            <AnimatePresence>
                {open && isMobile && (
                    <motion.div
                        key="mobileMenu"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-neutral-100 rounded-b-2xl z-50 overflow-hidden"
                    >
                        <div className="px-4 py-6 max-h-[80vh] overflow-y-auto">
                            <ul className="flex flex-col gap-2 text-gray-800 font-medium mb-6">
                                {links.map(({ label, href }, index) => (
                                    <motion.li
                                        key={label}
                                        onClick={() => setOpen(false)}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link
                                            href={href}
                                            className={`flex items-center gap-3 py-3 px-4 rounded-xl ${pathname === href ? 'bg-amber-50 text-amber-700' : 'hover:bg-gray-50'}`}
                                        >
                                            <div className={`w-1.5 h-1.5 rounded-full ${pathname === href ? 'bg-amber-500' : 'bg-gray-300'}`}></div>
                                            {label}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>

                            <div className="border-t border-gray-100 pt-6 space-y-4">
                                <a
                                    href="https://wa.me/5511981845016"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white px-5 py-4 rounded-xl font-medium hover:from-green-700 hover:to-green-600 transition-all shadow-sm w-full"
                                >
                                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M20.5 3.5c-2.6-2.6-6.9-2.6-9.5 0-2.2 2.2-2.5 5.6-1 8.2L3 21l9.3-7c2.6 1.5 6 .8 8.2-1 2.6-2.6 2.6-6.9 0-9.5z" />
                                        </svg>
                                    </div>
                                    <span>Falar com consultor via WhatsApp</span>
                                </a>

                                <a
                                    href="tel:+551146932350"
                                    className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 px-5 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all w-full"
                                >
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span>(11) 4693-2350</span>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}

export default NavbarResponsive;
