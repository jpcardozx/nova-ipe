'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
    Menu,
    X,
    Phone,
    MessageCircle,
    MapPin,
    Clock,
    ChevronDown,
    Home,
    Building,
    Search,
    FileText,
    Users,
    Mail,
    Globe,
    Star,
    Award,
    Shield,
    Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Configuração avançada de design profissional
const designTokens = {
    colors: {
        primary: {
            50: '#fef7ed',
            100: '#fdecd3',
            200: '#fbd5a6',
            300: '#f9b777',
            400: '#f5a623',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f'
        },
        neutral: {
            50: '#fafaf9',
            100: '#f5f5f4',
            200: '#e7e5e4',
            300: '#d6d3d1',
            400: '#a8a29e',
            500: '#78716c',
            600: '#57534e',
            700: '#44403c',
            800: '#292524',
            900: '#1c1917'
        },
        emerald: {
            50: '#ecfdf5',
            100: '#d1fae5',
            500: '#10b981',
            600: '#059669',
            700: '#047857',
            800: '#065f46'
        },
        accent: {
            blue: '#3b82f6',
            purple: '#8b5cf6',
            pink: '#ec4899'
        }
    },
    gradients: {
        primary: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        hero: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #44403c 100%)',
        glass: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        shimmer: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
        premium: 'linear-gradient(135deg, #059669 0%, #047857 25%, #065f46 100%)'
    },
    effects: {
        glassmorphism: 'backdrop-filter: saturate(180%) blur(20px); background: rgba(255,255,255,0.85);',
        neuomorphism: 'box-shadow: 12px 12px 24px rgba(0,0,0,0.1), -12px -12px 24px rgba(255,255,255,0.9);',
        elevation: {
            sm: '0 2px 8px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)',
            md: '0 8px 24px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
            lg: '0 16px 48px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.08)',
            xl: '0 24px 64px rgba(0,0,0,0.16), 0 12px 32px rgba(0,0,0,0.12)'
        }
    }
};

// Interface para navegação avançada
interface AdvancedNavigationLink {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    badge?: string;
    isNew?: boolean;
    isPopular?: boolean;
    submenu?: {
        label: string;
        href: string;
        description: string;
        icon: React.ComponentType<{ className?: string }>;
    }[];
}

// Links de navegação com submenu
const advancedNavigationLinks: AdvancedNavigationLink[] = [
    {
        label: 'Início',
        href: '/',
        icon: Home,
        description: 'Página principal com destaques',
        submenu: [
            {
                label: 'Destaques',
                href: '/#destaques',
                description: 'Imóveis em destaque',
                icon: Star
            },
            {
                label: 'Novidades',
                href: '/#novidades',
                description: 'Últimas atualizações',
                icon: Zap
            }
        ]
    },
    {
        label: 'Comprar',
        href: '/comprar',
        icon: Building,
        description: 'Imóveis à venda em Guararema',
        badge: 'Hot',
        isPopular: true,
        submenu: [
            {
                label: 'Casas',
                href: '/comprar?tipo=casa',
                description: 'Casas residenciais',
                icon: Home
            },
            {
                label: 'Apartamentos',
                href: '/comprar?tipo=apartamento',
                description: 'Apartamentos modernos',
                icon: Building
            },
            {
                label: 'Terrenos',
                href: '/comprar?tipo=terreno',
                description: 'Terrenos para construção',
                icon: Globe
            }
        ]
    },
    {
        label: 'Alugar',
        href: '/alugar',
        icon: Search,
        description: 'Imóveis para locação',
        submenu: [
            {
                label: 'Residencial',
                href: '/alugar?categoria=residencial',
                description: 'Casas e apartamentos',
                icon: Home
            },
            {
                label: 'Comercial',
                href: '/alugar?categoria=comercial',
                description: 'Pontos comerciais',
                icon: Building
            }
        ]
    },
    {
        label: 'Sobre',
        href: '/sobre',
        icon: Users,
        description: 'Nossa história e valores',
        submenu: [
            {
                label: 'A Empresa',
                href: '/sobre#empresa',
                description: 'Nossa trajetória',
                icon: Award
            },
            {
                label: 'Equipe',
                href: '/sobre#equipe',
                description: 'Nossos profissionais',
                icon: Users
            },
            {
                label: 'Certificações',
                href: '/sobre#certificacoes',
                description: 'Credibilidade e confiança',
                icon: Shield
            }
        ]
    },
    {
        label: 'Contato',
        href: '/contato',
        icon: MessageCircle,
        description: 'Fale conosco agora',
        isNew: true
    }
];

const ProfessionalNavbar: React.FC = () => {
    // Estados avançados
    const [isScrolled, setIsScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);
    const [showSubmenu, setShowSubmenu] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [navbarHidden, setNavbarHidden] = useState(false);

    const pathname = usePathname();
    const navbarRef = useRef<HTMLElement>(null);

    // Hook de scroll do Framer Motion
    const { scrollY } = useScroll();
    const navbarOpacity = useTransform(scrollY, [0, 100], [0.95, 0.98]);
    const navbarBlur = useTransform(scrollY, [0, 100], [10, 25]);

    // Efeitos avançados de scroll e interação
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (currentScrollY / documentHeight) * 100;

            setScrollProgress(scrollPercent);
            setIsScrolled(currentScrollY > 20);

            // Auto-hide navbar on scroll down, show on scroll up
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setNavbarHidden(true);
            } else {
                setNavbarHidden(false);
            }

            setLastScrollY(currentScrollY);
        };

        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (!mobile) {
                setIsMobileMenuOpen(false);
                setShowSubmenu(null);
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            // Efeito parallax sutil no navbar
            if (navbarRef.current && !isMobile) {
                const { clientX } = e;
                const { innerWidth } = window;
                const moveX = (clientX / innerWidth - 0.5) * 10;
                navbarRef.current.style.transform = `translateX(${moveX}px)`;
            }
        };

        // Configuração inicial
        handleResize();
        handleScroll();
        setIsLoaded(true);

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize, { passive: true });
        document.addEventListener('mousemove', handleMouseMove, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [lastScrollY, isMobile]);

    // Fechar menus ao mudar de rota
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setShowSubmenu(null);
        setHoveredLink(null);
    }, [pathname]);

    // Handlers avançados
    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLinkHover = (linkLabel: string | null) => {
        if (!isMobile) {
            setHoveredLink(linkLabel);
            if (linkLabel && advancedNavigationLinks.find(link => link.label === linkLabel)?.submenu) {
                setShowSubmenu(linkLabel);
            } else {
                setShowSubmenu(null);
            }
        }
    };

    const handleSubmenuLeave = () => {
        if (!isMobile) {
            setShowSubmenu(null);
            setHoveredLink(null);
        }
    };

    // Classes dinâmicas avançadas
    const navbarClasses = cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out",
        "backdrop-blur-xl bg-white/85 border-b border-neutral-200/50",
        isScrolled && "bg-white/95 shadow-xl border-neutral-300/50",
        navbarHidden && "transform -translate-y-full",
        !isLoaded && "opacity-0"
    );

    const progressBarClasses = cn(
        "absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-500 via-primary-600 to-emerald-600",
        "transition-all duration-300 ease-out rounded-r-full"
    );

    return (
        <>
            {/* Barra de Progresso de Scroll */}
            <div className="fixed top-0 left-0 w-full h-1 bg-neutral-200/30 z-50">
                <motion.div
                    className={progressBarClasses}
                    style={{ width: `${scrollProgress}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${scrollProgress}%` }}
                    transition={{ duration: 0.1 }}
                />
            </div>

            {/* Barra de Contato Superior */}
            <motion.div
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={cn(
                    "w-full text-white relative overflow-hidden",
                    "bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900",
                    "transition-all duration-500",
                    isScrolled ? "py-1" : "py-2"
                )}
            >
                {/* Efeito de brilho animado */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 animate-pulse" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex items-center justify-between text-sm">
                        <motion.div
                            className="flex items-center gap-6"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex items-center gap-2 group cursor-pointer">
                                <MapPin className="w-4 h-4 group-hover:text-primary-400 transition-colors" />
                                <span className="group-hover:text-primary-200 transition-colors">
                                    Guararema, SP - Região de Mogi das Cruzes
                                </span>
                            </div>
                            <div className="hidden md:flex items-center gap-2 group cursor-pointer">
                                <Clock className="w-4 h-4 group-hover:text-emerald-400 transition-colors" />
                                <span className="group-hover:text-emerald-200 transition-colors">
                                    Seg-Sex: 8h-18h | Sáb: 8h-12h
                                </span>
                            </div>
                        </motion.div>

                        <motion.div
                            className="flex items-center gap-4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <motion.a
                                href="tel:+551146932350"
                                className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 group"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Phone className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                <span className="hidden sm:inline font-medium">(11) 4693-2350</span>
                            </motion.a>
                            <motion.a
                                href="mailto:contato@novaipe.com.br"
                                className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 group"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="hidden sm:inline">E-mail</span>
                            </motion.a>
                            <motion.a
                                href="https://wa.me/5511981845016"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/80 hover:bg-emerald-500 transition-all duration-300 group shadow-lg"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <MessageCircle className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                <span className="hidden sm:inline font-medium">WhatsApp</span>
                            </motion.a>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Navbar Principal */}
            <motion.nav
                ref={navbarRef}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                className={navbarClasses}
                style={{
                    opacity: navbarOpacity,
                    backdropFilter: `blur(${navbarBlur}px)`
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={cn(
                        "flex items-center justify-between transition-all duration-500",
                        isScrolled ? "py-3" : "py-4"
                    )}>

                        {/* Logo Premium */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative z-10"
                        >
                            <Link href="/" className="group relative">
                                <div className="absolute -inset-2 bg-gradient-to-r from-primary-500/20 to-emerald-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm" />
                                <div className="relative bg-white/50 backdrop-blur-sm rounded-xl p-2 border border-white/30 shadow-lg">
                                    <Image
                                        src="/images/ipeLogoWritten.png"
                                        alt="Nova IPE Imobiliária"
                                        width={isScrolled ? 140 : 160}
                                        height={isScrolled ? 35 : 40}
                                        className="transition-all duration-500 filter group-hover:brightness-110"
                                        priority
                                        style={{
                                            aspectRatio: '160/40',
                                            objectFit: 'contain'
                                        }}
                                    />
                                </div>
                            </Link>
                        </motion.div>

                        {/* Navegação Desktop */}
                        <div className="hidden lg:flex items-center">
                            <div className="flex items-center gap-2 bg-white/40 backdrop-blur-xl rounded-2xl p-2 border border-white/50 shadow-xl">
                                {advancedNavigationLinks.map((link, index) => {
                                    const isActive = pathname === link.href ||
                                        (link.href !== '/' && pathname?.startsWith(link.href));
                                    const isHovered = hoveredLink === link.label;
                                    const Icon = link.icon;

                                    return (
                                        <div
                                            key={link.label}
                                            className="relative"
                                            onMouseEnter={() => handleLinkHover(link.label)}
                                            onMouseLeave={() => handleLinkHover(null)}
                                        >
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <Link
                                                    href={link.href}
                                                    className={cn(
                                                        "relative flex items-center gap-3 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 group",
                                                        "hover:bg-white/80 hover:shadow-lg hover:scale-105",
                                                        isActive
                                                            ? "bg-gradient-to-r from-primary-50 to-emerald-50 text-primary-700 shadow-md border border-primary-200"
                                                            : "text-neutral-700 hover:text-primary-700"
                                                    )}
                                                >
                                                    {/* Efeito de fundo animado */}
                                                    <motion.div
                                                        className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-emerald-500/10 rounded-xl opacity-0 group-hover:opacity-100"
                                                        layoutId={`nav-bg-${link.label}`}
                                                        transition={{ duration: 0.3 }}
                                                    />

                                                    <Icon className={cn(
                                                        "w-5 h-5 transition-all duration-300",
                                                        "group-hover:scale-110 group-hover:rotate-6",
                                                        isActive && "text-primary-600"
                                                    )} />

                                                    <span className="relative z-10">{link.label}</span>

                                                    {/* Badges */}
                                                    {link.badge && (
                                                        <motion.span
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-lg"
                                                        >
                                                            {link.badge}
                                                        </motion.span>
                                                    )}

                                                    {link.isNew && (
                                                        <motion.span
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-lg"
                                                        >
                                                            New
                                                        </motion.span>
                                                    )}

                                                    {link.isPopular && (
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                                            className="absolute -top-1 -right-1"
                                                        >
                                                            <Star className="w-4 h-4 text-primary-500 fill-current" />
                                                        </motion.div>
                                                    )}

                                                    {/* Indicador de submenu */}
                                                    {link.submenu && (
                                                        <ChevronDown className={cn(
                                                            "w-4 h-4 transition-transform duration-300",
                                                            isHovered && "rotate-180"
                                                        )} />
                                                    )}
                                                </Link>
                                            </motion.div>

                                            {/* Submenu */}
                                            <AnimatePresence>
                                                {link.submenu && showSubmenu === link.label && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="absolute top-full left-0 mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-4 z-50"
                                                        onMouseEnter={() => setShowSubmenu(link.label)}
                                                        onMouseLeave={handleSubmenuLeave}
                                                    >
                                                        <div className="space-y-2">
                                                            {link.submenu.map((subItem, subIndex) => {
                                                                const SubIcon = subItem.icon;
                                                                return (
                                                                    <motion.div
                                                                        key={subItem.href}
                                                                        initial={{ opacity: 0, x: -10 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        transition={{ delay: subIndex * 0.05 }}
                                                                    >
                                                                        <Link
                                                                            href={subItem.href}
                                                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-emerald-50 transition-all duration-300 group"
                                                                        >
                                                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-100 to-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                                <SubIcon className="w-5 h-5 text-primary-600" />
                                                                            </div>
                                                                            <div>
                                                                                <div className="font-medium text-neutral-800 group-hover:text-primary-700 transition-colors">
                                                                                    {subItem.label}
                                                                                </div>
                                                                                <div className="text-sm text-neutral-500">
                                                                                    {subItem.description}
                                                                                </div>
                                                                            </div>
                                                                        </Link>
                                                                    </motion.div>
                                                                );
                                                            })}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* CTAs Desktop */}
                        <div className="hidden lg:flex items-center gap-3">
                            <motion.a
                                href="https://wa.me/5511981845016"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative flex items-center gap-2">
                                    <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    <span>WhatsApp</span>
                                </div>
                            </motion.a>

                            <motion.a
                                href="tel:+551146932350"
                                className="relative px-6 py-3 bg-white/80 backdrop-blur-sm text-neutral-700 font-medium rounded-xl border border-neutral-300/50 hover:bg-white hover:shadow-lg transition-all duration-300 group"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="flex items-center gap-2">
                                    <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    <span>Ligar</span>
                                </div>
                            </motion.a>
                        </div>

                        {/* Botão Mobile Menu */}
                        <motion.button
                            onClick={handleMobileMenuToggle}
                            className="lg:hidden relative p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-neutral-300/50 shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <AnimatePresence mode="wait">
                                {isMobileMenuOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X className="w-6 h-6 text-neutral-700" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu className="w-6 h-6 text-neutral-700" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>
            </motion.nav>

            {/* Menu Mobile Premium */}
            <AnimatePresence>
                {isMobileMenuOpen && isMobile && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Menu Content */}
                        <motion.div
                            initial={{ opacity: 0, height: 0, y: -20 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-neutral-200/50 shadow-2xl z-50"
                        >
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                {/* Links de Navegação Mobile */}
                                <div className="space-y-2 mb-8">
                                    {advancedNavigationLinks.map((link, index) => {
                                        const isActive = pathname === link.href ||
                                            (link.href !== '/' && pathname?.startsWith(link.href) === true);
                                        const Icon = link.icon;

                                        return (
                                            <motion.div
                                                key={link.label}
                                                initial={{ opacity: 0, x: -30 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <Link
                                                    href={link.href}
                                                    className={cn(
                                                        "relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group",
                                                        "hover:bg-gradient-to-r hover:from-primary-50 hover:to-emerald-50",
                                                        isActive
                                                            ? "bg-gradient-to-r from-primary-100 to-emerald-100 border-l-4 border-primary-500"
                                                            : "hover:border-l-4 hover:border-primary-300"
                                                    )}
                                                >
                                                    {/* Ícone Premium */}
                                                    <div className={cn(
                                                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
                                                        "bg-gradient-to-br from-neutral-100 to-neutral-200 group-hover:from-primary-100 group-hover:to-emerald-100",
                                                        isActive && "from-primary-200 to-emerald-200 shadow-lg"
                                                    )}>
                                                        <Icon className={cn(
                                                            "w-7 h-7 transition-all duration-300",
                                                            "text-neutral-700 group-hover:text-primary-700 group-hover:scale-110",
                                                            isActive && "text-primary-700 scale-110"
                                                        )} />
                                                    </div>

                                                    {/* Conteúdo */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={cn(
                                                                "font-semibold text-lg transition-colors",
                                                                isActive ? "text-primary-700" : "text-neutral-800 group-hover:text-primary-700"
                                                            )}>
                                                                {link.label}
                                                            </span>

                                                            {/* Badges Mobile */}
                                                            {link.badge && (
                                                                <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                                                                    {link.badge}
                                                                </span>
                                                            )}

                                                            {link.isNew && (
                                                                <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                                                                    New
                                                                </span>
                                                            )}

                                                            {link.isPopular && (
                                                                <Star className="w-5 h-5 text-primary-500 fill-current" />
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-neutral-600 group-hover:text-neutral-700 transition-colors">
                                                            {link.description}
                                                        </p>
                                                    </div>

                                                    {/* Submenu Indicator */}
                                                    {link.submenu && (
                                                        <ChevronDown className="w-5 h-5 text-neutral-400 group-hover:text-primary-500 transition-colors" />
                                                    )}
                                                </Link>

                                                {/* Submenu Mobile */}
                                                {link.submenu && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        className="ml-6 mt-2 space-y-1"
                                                    >
                                                        {link.submenu.map((subItem, subIndex) => {
                                                            const SubIcon = subItem.icon;
                                                            return (
                                                                <motion.div
                                                                    key={subItem.href}
                                                                    initial={{ opacity: 0, x: -20 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: subIndex * 0.05 }}
                                                                >
                                                                    <Link
                                                                        href={subItem.href}
                                                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/80 transition-all duration-300 group"
                                                                    >
                                                                        <SubIcon className="w-5 h-5 text-neutral-500 group-hover:text-primary-600" />
                                                                        <div>
                                                                            <div className="font-medium text-neutral-700 group-hover:text-primary-700">
                                                                                {subItem.label}
                                                                            </div>
                                                                            <div className="text-xs text-neutral-500">
                                                                                {subItem.description}
                                                                            </div>
                                                                        </div>
                                                                    </Link>
                                                                </motion.div>
                                                            );
                                                        })}
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* CTAs Mobile */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="space-y-4 pt-6 border-t border-neutral-200"
                                >
                                    <motion.a
                                        href="https://wa.me/5511981845016"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-3 w-full p-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-2xl shadow-lg"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <MessageCircle className="w-6 h-6" />
                                        <span>Falar via WhatsApp</span>
                                    </motion.a>

                                    <div className="grid grid-cols-2 gap-3">
                                        <motion.a
                                            href="tel:+551146932350"
                                            className="flex items-center justify-center gap-2 p-3 bg-white/80 backdrop-blur-sm text-neutral-700 font-medium rounded-xl border border-neutral-300/50 shadow-sm"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Phone className="w-5 h-5" />
                                            <span>Ligar</span>
                                        </motion.a>

                                        <motion.a
                                            href="mailto:contato@novaipe.com.br"
                                            className="flex items-center justify-center gap-2 p-3 bg-white/80 backdrop-blur-sm text-neutral-700 font-medium rounded-xl border border-neutral-300/50 shadow-sm"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Mail className="w-5 h-5" />
                                            <span>E-mail</span>
                                        </motion.a>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Spacer dinâmico */}
            <motion.div
                className={cn(
                    "transition-all duration-500",
                    isScrolled ? "h-[100px]" : "h-[120px]"
                )}
                animate={{
                    height: isScrolled ? "100px" : "120px"
                }}
                transition={{ duration: 0.5 }}
            />
        </>
    );
};

export default ProfessionalNavbar;
