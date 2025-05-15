"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Montserrat } from "next/font/google";

const montSerrat = Montserrat({
    subsets: ["latin"],
    weight: ["400"],
    display: "swap",
    variable: "--font-montserrat",
});

const links = [
    { label: "Início", href: "/" },
    { label: "Comprar", href: "/comprar" },
    { label: "Alugar", href: "/alugar" },
    { label: "Sobre Nós", href: "/sobre" },
    { label: "Contato", href: "#contato" },
];

export default function NavbarResponsive() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Mark component as mounted to prevent hydration issues
        setIsMounted(true);

        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);

        // Check if we're on mobile
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Initial check
        checkMobile();

        // Add resize listener
        window.addEventListener("resize", checkMobile);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    // Add debugging log
    console.log("NavbarResponsive rendering, isMounted:", isMounted, "isMobile:", isMobile);

    return (
        <motion.nav
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-lg border-b border-neutral-200 shadow-sm transition-all duration-300 ${scrolled ? "py-1.5" : "py-4"}`}
        >
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" aria-label="Ir para página inicial">
                    <Image
                        src="/images/ipeLogoWritten.png"
                        alt="Ipê Imóveis"
                        width={scrolled ? 130 : 160}
                        height={50}
                        className="object-contain transition-all duration-300 cursor-pointer"
                        priority
                    />
                </Link>

                {/* Desktop Navigation */}
                {!isMobile && (
                    <div className="flex items-center gap-8">
                        <ul className={`flex gap-6 text-[#0D1F2D] text-sm font-medium ${montSerrat.className}`}>
                            {links.map(({ label, href }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        className={`relative group transition-colors ${pathname === href ? "text-[#FFAD43]" : "hover:text-black"}`}
                                    >
                                        {label}
                                        <span className="pointer-events-none absolute left-0 -bottom-0.5 h-[1.5px] w-full overflow-hidden">
                                            <span className="block h-full w-full origin-left scale-x-0 bg-[#ffd816] transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-x-100" />
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* WhatsApp Button */}
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            href="https://wa.me/5511981845016"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#20b858] text-white px-4 py-2 rounded-full text-sm font-medium hover:brightness-105 transition shadow-sm"
                        >
                            <span className="navbar-icon">
                                <svg width="16" height="16" fill="currentColor" className="text-white" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M20.5 3.5c-2.6-2.6-6.9-2.6-9.5 0-2.2 2.2-2.5 5.6-1 8.2L3 21l9.3-7c2.6 1.5 6 .8 8.2-1 2.6-2.6 2.6-6.9 0-9.5z" />
                                </svg>
                            </span>
                            <span>Fale conosco</span>
                        </motion.a>
                    </div>
                )}

                {/* Mobile Menu Button */}
                {isMobile && (
                    <button
                        onClick={() => setOpen(!open)}
                        className="text-gray-700 text-2xl flex items-center justify-center p-2"
                        aria-label="Abrir menu"
                        aria-expanded={open}
                    >
                        <span className="sr-only">Menu</span>
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="block" viewBox="0 0 24 24">
                            {open ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                )}
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {open && isMobile && (
                    <motion.div
                        key="mobileMenu"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/95 backdrop-blur-xl shadow-md border-t border-neutral-100"
                    >
                        <div className="px-4 py-6">
                            <ul className="flex flex-col gap-4 text-[#0D1F2D] text-base font-medium">
                                {links.map(({ label, href }) => (
                                    <li key={label} onClick={() => setOpen(false)}>
                                        <Link href={href} className="block py-2 px-3 hover:bg-neutral-50 rounded-md">
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-6">
                                <a
                                    href="https://wa.me/5511981845016"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full text-sm font-medium hover:brightness-105 transition w-full"
                                >
                                    <span className="navbar-icon">
                                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M20.5 3.5c-2.6-2.6-6.9-2.6-9.5 0-2.2 2.2-2.5 5.6-1 8.2L3 21l9.3-7c2.6 1.5 6 .8 8.2-1 2.6-2.6 2.6-6.9 0-9.5z" />
                                        </svg>
                                    </span>
                                    Fale com um corretor!
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
