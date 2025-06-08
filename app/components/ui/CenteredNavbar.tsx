'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, X, Menu, Home, Building, Key, Mail } from 'lucide-react';

const navItems = [
  { label: 'Início', href: '/', icon: Home },
  { label: 'Comprar', href: '/comprar', icon: Building },
  { label: 'Alugar', href: '/alugar', icon: Key },
  { label: 'Contato', href: '#contato', icon: Mail },
];

interface CenteredNavbarProps {
  className?: string;
}

const CenteredNavbar: React.FC<CenteredNavbarProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Memoized handlers for performance
  const handleScroll = useMemo(
    () => () => setIsScrolled(window.scrollY > 20),
    []
  );

  const checkMobile = useMemo(
    () => () => setIsMobile(window.innerWidth < 1024),
    []
  );

  useEffect(() => {
    setIsMounted(true);
    handleScroll();
    checkMobile();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', checkMobile, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, [handleScroll, checkMobile]);

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

  // SSR protection
  if (!isMounted) {
    return (
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-center">
          <Link href="/" aria-label="Ir para página inicial">
            <Image
              src="/images/ipeLogoWritten.png"
              alt="Ipê Imóveis"
              width={160}
              height={48}
              className="object-contain"
              priority
            />
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/98 backdrop-blur-xl shadow-lg border-b border-gray-200/80'
            : 'bg-white/95 backdrop-blur-lg border-b border-gray-100/60'
        } ${className || ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-500 ${isScrolled ? 'h-16' : 'h-20'} flex items-center`}>
            
            {/* Mobile Layout */}
            {isMobile ? (
              <div className="flex items-center justify-between w-full">
                {/* Logo */}
                <Link href="/" aria-label="Ir para página inicial" className="flex-shrink-0">
                  <Image
                    src="/images/ipeLogoWritten.png"
                    alt="Ipê Imóveis"
                    width={isScrolled ? 140 : 160}
                    height={isScrolled ? 42 : 48}
                    className="object-contain transition-all duration-500"
                    priority
                  />
                </Link>

                {/* Mobile Menu Button */}
                <motion.button
                  onClick={() => setIsOpen(!isOpen)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
                  aria-label="Menu de navegação"
                  aria-expanded={isOpen}
                  whileTap={{ scale: 0.95 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isOpen ? 'close' : 'menu'}
                      initial={{ rotate: isOpen ? -90 : 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: isOpen ? 90 : -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
              </div>
            ) : (
              /* Desktop Layout - Centered Navigation */
              <div className="grid grid-cols-3 items-center w-full gap-8">
                
                {/* Left: Logo */}
                <div className="flex justify-start">
                  <Link href="/" aria-label="Ir para página inicial" className="group">
                    <div className="relative overflow-hidden rounded-xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-50/0 via-amber-50/60 to-amber-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Image
                        src="/images/ipeLogoWritten.png"
                        alt="Ipê Imóveis"
                        width={isScrolled ? 140 : 160}
                        height={isScrolled ? 42 : 48}
                        className="object-contain transition-all duration-500 relative z-10"
                        priority
                      />
                    </div>
                  </Link>
                </div>

                {/* Center: Navigation Links */}
                <div className="flex justify-center">
                  <nav className="flex items-center bg-white/80 backdrop-blur-sm rounded-2xl px-2 py-1 shadow-sm border border-gray-100/60">
                    <ul className="flex items-center gap-1">
                      {navItems.map(({ label, href }) => {
                        const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
                        
                        return (
                          <li key={label}>
                            <Link
                              href={href}
                              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group ${
                                isActive
                                  ? 'text-amber-700 bg-amber-50/80 shadow-sm'
                                  : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50/40'
                              }`}
                            >
                              <span className="relative z-10">{label}</span>
                              
                              {/* Active indicator */}
                              {isActive && (
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-amber-100/60 to-orange-100/60 rounded-xl border border-amber-200/40"
                                  layoutId="activeNavItem"
                                  initial={false}
                                  transition={{ type: 'spring', bounce: 0.15, duration: 0.6 }}
                                />
                              )}
                              
                              {/* Hover indicator */}
                              <div className="absolute inset-0 bg-gradient-to-r from-amber-50/40 to-orange-50/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                </div>

                {/* Right: CTA Buttons */}
                <div className="flex justify-end items-center gap-3">
                  {/* Phone CTA */}
                  <motion.a
                    href="tel:+551146932350"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-amber-600 transition-colors group"
                  >
                    <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium hidden xl:block">(11) 4693-2350</span>
                  </motion.a>

                  {/* WhatsApp CTA */}
                  <motion.a
                    href="https://wa.me/5511981845016"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:from-green-700 hover:to-green-600 transition-all shadow-md hover:shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden xl:block">Falar com especialista</span>
                    <span className="xl:hidden">WhatsApp</span>
                  </motion.a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && isMobile && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
              />

              {/* Mobile Menu */}
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute top-full left-0 right-0 bg-white/98 backdrop-blur-xl border-b border-gray-200 shadow-2xl"
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  {/* Mobile Navigation Links */}
                  <nav className="mb-8">
                    <ul className="space-y-2">
                      {navItems.map(({ label, href, icon: Icon }, index) => {
                        const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
                        
                        return (
                          <motion.li
                            key={label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                          >
                            <Link
                              href={href}
                              onClick={() => setIsOpen(false)}
                              className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 ${
                                isActive
                                  ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200/40'
                                  : 'text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                              }`}
                            >
                              <div className={`p-2 rounded-xl ${isActive ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <span className="font-semibold text-lg">{label}</span>
                              {isActive && (
                                <div className="ml-auto w-2 h-2 bg-amber-500 rounded-full" />
                              )}
                            </Link>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </nav>

                  {/* Mobile CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    className="space-y-4 pt-6 border-t border-gray-200"
                  >
                    {/* WhatsApp Button */}
                    <a
                      href="https://wa.me/5511981845016"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-4 rounded-2xl font-semibold text-lg hover:from-green-700 hover:to-green-600 transition-all shadow-lg"
                    >
                      <MessageCircle className="w-6 h-6" />
                      <span>Falar via WhatsApp</span>
                    </a>

                    {/* Phone Button */}
                    <a
                      href="tel:+551146932350"
                      className="flex items-center justify-center gap-3 w-full border-2 border-gray-200 text-gray-700 px-6 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                      <Phone className="w-5 h-5" />
                      <span>(11) 4693-2350</span>
                    </a>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer to prevent content overlap */}
      <div className={`transition-all duration-500 ${isScrolled ? 'h-16' : 'h-20'}`} />
    </>
  );
};

export default CenteredNavbar;