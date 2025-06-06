"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import NavbarParticles from "./NavbarParticles"; // Certifique-se que este componente existe e está importado corretamente

// Nova Ipê Brand Colors
const novaIpeColors = {
    primary: { ipe: '#E6AA2C', ipeLight: '#F7D660', ipeDark: '#B8841C' },
    earth: { brown: '#8B4513', brownLight: '#A0522D', brownDark: '#654321' },
    neutral: { black: '#1A1A1A', charcoal: '#2D2D2D', white: '#FFFFFF', cream: '#F8F4E3' }
};

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
    const [scrollY, setScrollY] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const pathname = usePathname();    // Enhanced scroll handler with hide/show logic and smoother transitions
    const handleScroll = useMemo(
        () => () => {
            const currentScrollY = window.scrollY;
            const scrollDifference = currentScrollY - lastScrollY;

            setScrollY(currentScrollY);
            setLastScrollY(currentScrollY);

            // Enhanced threshold for premium experience with Nova Ipê styling
            setScrolled(currentScrollY > 30);

            // Improved hide/show logic for better UX
            if (Math.abs(scrollDifference) > 8) {
                if (scrollDifference > 0 && currentScrollY > 120) {
                    // Scrolling down - hide navbar with longer delay
                    setIsVisible(false);
                } else if (scrollDifference < 0) {
                    // Scrolling up - show navbar immediately
                    setIsVisible(true);
                }
            }

            // Always show navbar at top with enhanced sensitivity
            if (currentScrollY < 40) {
                setIsVisible(true);
            }
        },
        [lastScrollY]
    );

    const checkMobile = useMemo(
        () => () => setIsMobile(window.innerWidth < 768),
        []
    ); useEffect(() => {
        setIsMounted(true);
        handleScroll();
        checkMobile();

        // Enhanced initial animation sequence
        const timer = setTimeout(() => {
            setIsInitialLoad(false);
        }, 800); // Allow time for descent animation

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", checkMobile);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", checkMobile);
            clearTimeout(timer);
        };
    }, [handleScroll, checkMobile]);    // Fix hydration mismatch by ensuring consistent SSR/client rendering
    if (!isMounted) {
        // Return a placeholder with consistent structure to prevent hydration mismatch
        return (<nav className="navbar fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out"
            style={{
                backgroundColor: `${novaIpeColors.neutral.white}F5`,
                backdropFilter: "blur(20px)",
                borderBottom: `1px solid ${novaIpeColors.primary.ipe}20`,
                padding: "1rem 0",
                transform: "translateY(0px)",
                boxShadow: `0 4px 20px -2px ${novaIpeColors.neutral.charcoal}15, 0 2px 8px -2px ${novaIpeColors.primary.ipe}10`
            }}>
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between relative z-10">
                <Link href="/" aria-label="Ir para página inicial" className="group relative overflow-hidden">
                    <div className="relative">
                        <div className="flex items-center space-x-3">
                            <div className="relative w-8 h-8 md:w-10 md:h-10">
                                <Image
                                    src="/logo-nova-ipe.png"
                                    alt="Nova Ipê"
                                    fill
                                    sizes="40px"
                                    className="object-contain"
                                    priority
                                />
                            </div>                                <span className="text-xl md:text-2xl font-bold"
                                style={{
                                    background: novaIpeColors.primary.ipe, // fallback to primary color
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                Nova Ipê
                            </span>
                        </div>
                    </div>
                </Link>

                <div className="hidden md:flex items-center space-x-8">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="relative py-2 px-1 text-gray-700 hover:text-amber-600 transition-colors duration-200 font-medium"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <button
                    className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    aria-label="Menu"
                >
                    <div className="w-6 h-6 flex flex-col justify-center items-center">
                        <span className="block w-5 h-0.5 bg-gray-600 mb-1"></span>
                        <span className="block w-5 h-0.5 bg-gray-600 mb-1"></span>
                        <span className="block w-5 h-0.5 bg-gray-600"></span>
                    </div>
                </button>
            </div>
        </nav>
        );
    } return (
        <motion.nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out`}
            style={{
                // Using Tailwind classes for background and shadow, with CSS variables for colors from the design system
                // Note: Direct color values from novaIpeColors might be needed if CSS variables are not set up for all opacity variants
                padding: scrolled ? `1rem 0` : `1.5rem 0`,
            }}
            initial={{ y: -120, opacity: 0 }}
            animate={{
                y: isVisible ? 0 : -120,
                opacity: isVisible ? 1 : 0
            }}
            transition={{
                duration: isInitialLoad ? 0.8 : 0.35,
                ease: isInitialLoad ? [0.23, 1, 0.32, 1] : [0.22, 1, 0.36, 1],
                delay: isInitialLoad ? 0.2 : 0
            }}
        >
            {/* Animated particles background */}
            <NavbarParticles visible={scrolled} />

            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between relative z-10">                {/* Logo com efeito de hover e scala */}
                <Link href="/" aria-label="Ir para página inicial" className="group relative">
                    {/* Simplified logo, focusing on Image and basic motion */}
                    <motion.div
                        animate={{
                            scale: scrolled ? 0.92 : 1,
                            // Force hardware acceleration with transform3d
                            transform: scrolled ? 'translate3d(0,0,0) scale(0.92)' : 'translate3d(0,0,0) scale(1)'
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 20,
                            // Use will-change for performance
                            willChange: 'transform'
                        }}
                        className="relative z-10"
                        style={{
                            // Force hardware acceleration
                            transform: 'translate3d(0, 0, 0)',
                            backfaceVisibility: 'hidden',
                            perspective: 1000
                        }}
                    >                        <Image
                            src="/images/ipeLogoWritten.png"
                            alt="Ipê Imóveis"
                            width={140}
                            height={45}
                            className="object-contain w-auto h-[45px]"
                            priority
                            loading="eager"
                            fetchPriority="high"
                        />
                    </motion.div>
                </Link>

                {/* Desktop Navigation */}
                {!isMobile && (
                    <div className="flex items-center gap-x-spacing-8"> {/* Using gap-x for horizontal spacing */}
                        <ul className="flex items-center gap-x-spacing-7 font-body"> {/* Using gap-x and font-body */}
                            {links.map(({ label, href }) => (
                                <motion.li
                                    key={label}
                                    whileHover={{ y: -2 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="relative" // Add explicit positioning context
                                >
                                    <Link
                                        href={href}
                                        className={`relative group font-medium transition-colors duration-200
                                            ${pathname === href ? "font-semibold text-primary" : "text-neutral-charcoal hover:text-primary-dark"}
                                        `}
                                    >
                                        <span className={`relative ${pathname === href ? "drop-shadow-sm" : ""}`}>
                                            {label}
                                            {pathname === href && (
                                                <motion.span
                                                    className="absolute -top-0.5 -right-1 w-1.5 h-1.5 rounded-full bg-primary"
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ duration: 0.2, delay: 0.1 }}
                                                />
                                            )}
                                        </span>
                                        {/* Underline effect using Tailwind classes */}
                                        <span className={`absolute left-0 -bottom-0.5 block h-[2px] w-full origin-left transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${pathname === href ? 'scale-x-100 bg-gradient-primary' : 'bg-gradient-primary'}`}></span>
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                        {/* WhatsApp Button */}
                        <motion.a
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            href="https://wa.me/5511981845016"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative inline-flex items-center gap-x-spacing-2 bg-gradient-success text-neutral-white px-spacing-6 py-spacing-3 rounded-xl text-sm font-accent font-semibold shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            <div className="relative flex items-center gap-x-spacing-2 z-10"> {/* gap-x for horizontal spacing */}
                                <motion.div
                                    animate={{
                                        rotate: [0, 10, -10, 0],
                                        scale: [1, 1.1, 1, 1]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatType: "loop",
                                        ease: "easeInOut",
                                        repeatDelay: 3
                                    }}
                                    className="flex items-center justify-center w-spacing-6 h-spacing-6 bg-white/20 rounded-full ring-1 ring-white/30"
                                >
                                    <svg className="w-spacing-4 h-spacing-4 text-neutral-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                </motion.div>
                                <span className="font-semibold tracking-wide">Fale com especialista</span>
                            </div>
                        </motion.a>
                    </div>
                )}                {/* Enhanced Mobile Menu Button with premium styling and shadows */}
                {isMobile && (
                    <motion.button
                        onClick={() => setOpen(!open)}
                        className={`relative flex items-center justify-center p-spacing-3 rounded-xl transition-all duration-300 group
                            ${open ? "bg-primary/15 shadow-inner-primary" : "bg-neutral-white/80 shadow-md hover:bg-neutral-white"}
                        `}
                        aria-label="Abrir menu"
                        aria-expanded={open}
                        whileTap={{ scale: 0.92 }}
                        whileHover={{ scale: 1.05, y: -1 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <span className="sr-only">Menu</span>
                        <div className="w-spacing-6 h-spacing-6 flex items-center justify-center relative">
                            <motion.span
                                animate={open
                                    ? { rotate: 45, y: 0, backgroundColor: `var(--color-primary)` }
                                    : { rotate: 0, y: -6, backgroundColor: `var(--color-neutral-charcoal)` }
                                }
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute w-full h-0.5 rounded-full shadow-sm"
                                style={{ transformOrigin: "center" }}
                            />
                            <motion.span
                                animate={open
                                    ? { opacity: 0, width: 0, scale: 0 }
                                    : { opacity: 1, width: "100%", scale: 1 }
                                }
                                transition={{ duration: 0.3 }}
                                className="absolute w-full h-0.5 rounded-full shadow-sm bg-neutral-charcoal"
                            />
                            <motion.span
                                animate={open
                                    ? { rotate: -45, y: 0, backgroundColor: `var(--color-primary)` }
                                    : { rotate: 0, y: 6, backgroundColor: `var(--color-neutral-charcoal)` }
                                }
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute w-full h-0.5 rounded-full shadow-sm"
                                style={{ transformOrigin: "center" }}
                            />
                        </div>
                        {/* Enhanced hover glow effect - simplified or use pseudo-elements if needed */}
                        <div
                            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-br from-neutral-white/50 to-primary/10"
                        ></div>
                    </motion.button>
                )}
            </div>
            {/* Enhanced Mobile Menu with premium design and shadows */}
            <AnimatePresence>
                {open && isMobile && (
                    <motion.div
                        key="mobileMenu"
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -20 }}
                        transition={{
                            duration: 0.5,
                            ease: [0.22, 1, 0.36, 1],
                            height: { duration: 0.4 },
                            opacity: { duration: 0.3 }
                        }}
                        className="absolute top-full left-0 right-0 backdrop-blur-xl border-t rounded-b-3xl z-50 overflow-hidden shadow-primary-lg bg-neutral-soft-white/97 border-primary/30"
                    >
                        {/* Enhanced gradient overlay */}
                        <div
                            className="absolute inset-0 pointer-events-none bg-gradient-to-br from-neutral-white/50 via-neutral-cream/30 to-primary/5"
                        ></div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.4 }}
                            className="relative px-spacing-6 py-spacing-8 max-h-[calc(100vh-100px)] overflow-y-auto"
                        >
                            <ul className="flex flex-col gap-spacing-2 font-medium mb-spacing-6"> {/* Design System Spacing */}
                                {links.map(({ label, href }, index) => (
                                    <motion.li
                                        key={label}
                                        onClick={() => setOpen(false)}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: index * 0.07,
                                            type: "spring",
                                            stiffness: 120,
                                            damping: 15
                                        }}
                                    >
                                        <Link
                                            href={href}
                                            className={`flex items-center gap-spacing-3 py-spacing-3.5 px-spacing-4 rounded-xl transition-all duration-300
                                                ${pathname === href ? "bg-primary/20 text-primary-dark font-semibold" : "text-neutral-charcoal hover:bg-neutral-cream/50 hover:text-primary"}
                                            `}
                                        >
                                            <div
                                                className={`w-spacing-2 h-spacing-2 rounded-full transition-all duration-300 transform
                                                    ${pathname === href ? "bg-primary scale-110" : "bg-neutral-charcoal/50"}
                                                `}
                                            ></div>
                                            {label}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                            <motion.div
                                className="border-t border-neutral-light pt-spacing-6 space-y-spacing-4" /* Design System Spacing and Color */
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <motion.a
                                    href="https://wa.me/5511981845016"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative flex items-center justify-center gap-spacing-3 bg-gradient-success text-neutral-white px-spacing-6 py-spacing-5 rounded-2xl font-semibold font-accent transition-all w-full overflow-hidden shadow-lg hover:shadow-xl"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {/* Simplified decorative elements, focusing on core style */}
                                    <div className="relative flex items-center justify-center gap-spacing-3 z-10">
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1, 1], rotate: [0, 5, -5, 0] }} // Simplified animation
                                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut", repeatDelay: 2.5 }}
                                            className="flex items-center justify-center w-spacing-7 h-spacing-7 bg-white/20 rounded-full ring-1 ring-white/30 shadow-inner relative"
                                            style={{
                                                transform: 'translate3d(0, 0, 0)',
                                                backfaceVisibility: 'hidden',
                                                willChange: 'transform'
                                            }}
                                        >
                                            <svg className="w-spacing-4 h-spacing-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                            </svg>                                        </motion.div>
                                        Fale com especialista
                                    </div>
                                </motion.a><motion.a
                                    href="tel:+551146932350"
                                    className="group relative flex items-center justify-center gap-3 border-2 border-gray-200/80 bg-white/90 text-gray-700 px-6 py-4 rounded-2xl font-semibold hover:bg-amber-50/50 transition-all w-full overflow-hidden backdrop-blur-sm"
                                    style={{
                                        boxShadow: "0 8px 20px -4px rgba(0, 0, 0, 0.1), 0 4px 12px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.1)"
                                    }}
                                    whileHover={{ scale: 1.02, y: -1 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {/* Enhanced hover effects */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50/90 via-amber-100/60 to-amber-50/90 opacity-0 group-hover:opacity-100 transition-all duration-400"></div>
                                    <div className="absolute inset-0 rounded-2xl border-2 border-amber-200/0 group-hover:border-amber-200/60 transition-all duration-400"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/40 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                                    <div className="relative flex items-center justify-center gap-3 z-10">
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.1, 1, 1]
                                            }}
                                            transition={{
                                                duration: 2.5,
                                                repeat: Infinity,
                                                repeatType: "loop",
                                                ease: "easeInOut",
                                                repeatDelay: 3
                                            }}
                                            className="w-8 h-8 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center shadow-md ring-2 ring-amber-200/50"
                                        >
                                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-amber-700" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </motion.div>
                                        <span className="font-semibold tracking-wide drop-shadow-sm">(11) 4693-2350</span>
                                    </div>
                                </motion.a>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default NavbarResponsive;
