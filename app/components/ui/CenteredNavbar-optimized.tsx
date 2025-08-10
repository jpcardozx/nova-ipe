'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MessageCircle, X, Menu, Home, Building, Key, Mail } from 'lucide-react';

const navItems = [
    { label: 'Início', href: '/', icon: Home },
    { label: 'Comprar', href: '/catalogo', icon: Building },
    { label: 'Alugar', href: '/catalogo', icon: Key },
    { label: 'Contato', href: '/contato', icon: Mail },
];

interface CenteredNavbarProps {
    className?: string;
}

const CenteredNavbar: React.FC<CenteredNavbarProps> = ({ className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();

    // Optimized scroll handler with throttling
    const handleScroll = useCallback(() => {
        setIsScrolled(window.scrollY > 20);
    }, []);

    // Optimized resize handler with throttling  
    const handleResize = useCallback(() => {
        setIsMobile(window.innerWidth < 1024);
    }, []);

    useEffect(() => {
        // Initial setup
        handleScroll();
        handleResize();

        // Add optimized event listeners with throttling
        let scrollTicking = false;
        let resizeTicking = false;

        const throttledScroll = () => {
            if (!scrollTicking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        };

        const throttledResize = () => {
            if (!resizeTicking) {
                requestAnimationFrame(() => {
                    handleResize();
                    resizeTicking = false;
                });
                resizeTicking = true;
            }
        };

        window.addEventListener('scroll', throttledScroll, { passive: true });
        window.addEventListener('resize', throttledResize, { passive: true });

        return () => {
            window.removeEventListener('scroll', throttledScroll);
            window.removeEventListener('resize', throttledResize);
        };
    }, [handleScroll, handleResize]);

    // Close mobile menu when pathname changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isOpen && isMobile) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, isMobile]);

    return (
        <>
            {/* Fixed navbar with CSS-only transitions */}
            <nav
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200'
                    : 'bg-white/90 backdrop-blur-lg border-b border-gray-100'
                    } ${className || ''}`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-18 flex items-center">

                        {/* Mobile Layout */}
                        {isMobile ? (
                            <div className="flex items-center justify-between w-full">
                                <Link href="/" aria-label="Ir para página inicial" className="flex-shrink-0">
                                    <Image
                                        src="/images/ipeLogoWritten.png"
                                        alt="Ipê Imóveis"
                                        width={150}
                                        height={45}
                                        className="object-contain transition-all duration-300"
                                        priority
                                    />
                                </Link>

                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                                    aria-label="Menu de navegação"
                                    aria-expanded={isOpen}
                                >
                                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                                </button>
                            </div>
                        ) : (
                            /* Desktop Layout - Grid optimizado */
                            <div className="grid grid-cols-3 items-center w-full gap-8">

                                {/* Logo - Esquerda */}
                                <div className="flex justify-start">
                                    <Link href="/" aria-label="Ir para página inicial" className="group">
                                        <div className="relative overflow-hidden rounded-xl p-2 transition-colors duration-200 hover:bg-amber-50/50">
                                            <Image
                                                src="/images/ipeLogoWritten.png"
                                                alt="Ipê Imóveis"
                                                width={150}
                                                height={45}
                                                className="object-contain transition-all duration-300"
                                                priority
                                            />
                                        </div>
                                    </Link>
                                </div>

                                {/* Navegação Central */}
                                <div className="flex justify-center">
                                    <nav className="flex items-center bg-white/80 backdrop-blur-sm rounded-2xl px-2 py-1 shadow-sm border border-gray-100">
                                        <ul className="flex items-center gap-1">
                                            {navItems.map(({ label, href }) => {
                                                const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

                                                return (
                                                    <li key={label}>
                                                        <Link
                                                            href={href}
                                                            className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                                                ? 'text-amber-700 bg-amber-50 shadow-sm'
                                                                : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50/60'
                                                                }`}
                                                        >
                                                            {label}
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </nav>
                                </div>

                                {/* CTAs - Direita */}
                                <div className="flex justify-end items-center gap-3">
                                    <a
                                        href="tel:+551146933003"
                                        className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                                    >
                                        <Phone className="w-4 h-4" />
                                        <span className="text-sm font-medium hidden xl:block">(11) 4693-3003</span>
                                    </a>

                                    <a
                                        href="https://wa.me/5521990051961"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        <span className="hidden xl:block">WhatsApp</span>
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu - CSS transitions only */}
                {isMobile && (
                    <div
                        className={`overflow-hidden transition-all duration-300 bg-white border-t border-gray-200 ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                            }`}
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                            {/* Navigation Links */}
                            <nav className="mb-6">
                                <div className="space-y-2">
                                    {navItems.map(({ label, href, icon: Icon }) => {
                                        const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

                                        return (
                                            <Link
                                                key={label}
                                                href={href}
                                                onClick={() => setIsOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 ${isActive
                                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span className="font-medium text-lg">{label}</span>
                                                {isActive && <div className="ml-auto w-2 h-2 bg-amber-500 rounded-full" />}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </nav>

                            {/* Mobile CTAs */}
                            <div className="space-y-3 pt-4 border-t border-gray-200">
                                <a
                                    href="https://wa.me/5521990051961"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 w-full bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition-colors duration-200"
                                >
                                    <MessageCircle className="w-6 h-6" />
                                    <span className="font-medium">Falar via WhatsApp</span>
                                </a>

                                <a
                                    href="tel:+551146933003"
                                    className="flex items-center gap-3 w-full text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <Phone className="w-5 h-5" />
                                    <span className="font-medium">(11) 4693-3003</span>
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Spacer */}
            <div className="h-18" />
        </>
    );
};

export default CenteredNavbar;
