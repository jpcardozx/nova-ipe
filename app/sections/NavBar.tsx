"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

const links = [
    { label: "Início", href: "/", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { label: "Comprar", href: "/catalogo", icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" },
    { label: "Alugar", href: "/catalogo", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { label: "Contato", href: "#contato", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
]

export default function Navbar() {
    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [hoveredLink, setHoveredLink] = useState<string | null>(null)
    const pathname = usePathname()
    const navRef = useRef<HTMLDivElement>(null)
    const linksContainerRef = useRef<HTMLDivElement>(null)

    // 🔥 APRIMORAMENTO 1: Scroll detection otimizado com RAF
    useEffect(() => {
        let ticking = false
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 10)
                    ticking = false
                })
                ticking = true
            }
        }
        window.addEventListener("scroll", handleScroll, { passive: true })
        handleScroll()
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // 🔥 APRIMORAMENTO 2: Click outside + ESC + body lock
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (open && navRef.current && !navRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) setOpen(false)
        }

        if (open) {
            document.addEventListener("mousedown", handleClickOutside)
            document.addEventListener("keydown", handleKeyDown)
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleKeyDown)
            document.body.style.overflow = "unset"
        }
    }, [open])

    return (
        <>
            <motion.nav
                ref={navRef}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    duration: 0.6
                }}
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]`}
                role="navigation"
                aria-label="Navegação principal"
                style={{
                    background: scrolled
                        ? 'linear-gradient(180deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.90) 100%)'
                        : 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.92) 100%)',
                    backdropFilter: scrolled ? 'blur(28px) saturate(110%)' : 'blur(20px) saturate(150%)',
                    WebkitBackdropFilter: scrolled ? 'blur(28px) saturate(110%)' : 'blur(20px) saturate(150%)',
                    boxShadow: scrolled
                        ? '0 8px 32px 0 rgba(0,0,0,0.3), inset 0 1px 0 0 rgba(255,255,255,0.1)'
                        : '0 4px 16px 0 rgba(0,0,0,0.08), inset 0 1px 0 0 rgba(255,255,255,0.5)',
                    borderBottom: scrolled ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(226,232,240,0.4)'
                }}
            >
                {/* Grid 3 colunas para centralização perfeita */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`grid grid-cols-[1fr_auto_1fr] lg:grid-cols-[minmax(180px,auto)_1fr_minmax(180px,auto)] items-center gap-4 transition-all duration-500 ${
                        scrolled ? "h-16" : "h-20"
                    }`}>

                        {/* 🔥 COLUNA 1: Logo (esquerda) */}
                        <div className="flex justify-start">
                            <Link
                                href="/"
                                aria-label="Ir para página inicial da Ipê Imóveis"
                                className="relative group block"
                            >
                                <div className="relative transition-all duration-500 ease-in-out">
                                    {/* Desktop Logo - Transição colorida → branca */}
                                    <Image
                                        src={scrolled ? "/images/logos/ipeWhiteWrittenLogo.png" : "/images/logos/ipeLogoWritten.png"}
                                        alt="Ipê Imóveis - Logo"
                                        width={150}
                                        height={47}
                                        className="hidden sm:block object-contain transition-all duration-500 ease-in-out"
                                        style={{
                                            width: 'auto',
                                            height: 'auto',
                                            maxHeight: scrolled ? '41px' : '47px',
                                            filter: scrolled
                                                ? 'drop-shadow(0 2px 8px rgba(255,255,255,0.15))'
                                                : 'drop-shadow(0 1px 3px rgba(0,0,0,0.08))',
                                            opacity: 1
                                        }}
                                        priority
                                    />
                                    {/* Mobile Logo - Mesma do desktop */}
                                    <Image
                                        src={scrolled ? "/images/logos/ipeWhiteWrittenLogo.png" : "/images/logos/ipeLogoWritten.png"}
                                        alt="Ipê Imóveis"
                                        width={120}
                                        height={38}
                                        className="sm:hidden object-contain transition-all duration-500 ease-in-out"
                                        style={{
                                            width: 'auto',
                                            height: 'auto',
                                            maxHeight: scrolled ? '32px' : '38px',
                                            filter: scrolled
                                                ? 'drop-shadow(0 2px 6px rgba(255,255,255,0.15))'
                                                : 'drop-shadow(0 1px 3px rgba(0,0,0,0.08))',
                                            opacity: 1
                                        }}
                                        priority
                                    />
                                </div>
                            </Link>
                        </div>

                        {/* 🔥 COLUNA 2: Links (centro - perfeitamente centralizado) */}
                        <div className="hidden lg:flex justify-center">
                            <motion.div
                                ref={linksContainerRef}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
                                className={`relative inline-flex items-center gap-0 rounded-full p-1.5 transition-all duration-700`}
                                style={{
                                    background: scrolled
                                        ? 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.08) 100%)'
                                        : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                                    backdropFilter: 'blur(16px) saturate(180%)',
                                    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                                    boxShadow: scrolled
                                        ? '0 8px 32px 0 rgba(0,0,0,0.3), inset 0 1px 0 0 rgba(255,255,255,0.15)'
                                        : '0 4px 16px 0 rgba(0,0,0,0.08), inset 0 1px 0 0 rgba(255,255,255,0.8)',
                                    border: scrolled ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(226,232,240,0.6)'
                                }}
                            >
                                {/* Floating indicator - glassmorphic animated */}
                                <motion.div
                                    className={`absolute top-1.5 bottom-1.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]`}
                                    style={{
                                        background: scrolled
                                            ? 'linear-gradient(135deg, rgba(251,191,36,0.95) 0%, rgba(249,115,22,0.95) 100%)'
                                            : 'linear-gradient(135deg, rgb(245,158,11) 0%, rgb(234,88,12) 100%)',
                                        boxShadow: scrolled
                                            ? '0 8px 24px rgba(251,191,36,0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
                                            : '0 6px 20px rgba(245,158,11,0.35), inset 0 1px 0 rgba(255,255,255,0.4)',
                                        left: `${hoveredLink ? links.findIndex(l => l.label === hoveredLink) * 25 + 1 : links.findIndex(l => l.href === pathname || (pathname !== "/" && pathname.startsWith(l.href) && l.href !== "/")) * 25 + 1}%`,
                                        width: 'calc(25% - 8px)',
                                        opacity: hoveredLink || links.some(l => l.href === pathname || (pathname !== "/" && pathname.startsWith(l.href) && l.href !== "/")) ? 1 : 0
                                    }}
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    aria-hidden="true"
                                />

                                {links.map(({ label, href, icon }) => {
                                    const isActive = pathname === href || (href !== "/" && pathname.startsWith(href))
                                    return (
                                        <Link
                                            key={label}
                                            href={href}
                                            onMouseEnter={() => setHoveredLink(label)}
                                            onMouseLeave={() => setHoveredLink(null)}
                                            className={`relative z-10 px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-all duration-300 ${
                                                scrolled
                                                    ? (isActive || hoveredLink === label ? 'text-white' : 'text-slate-300 hover:text-white')
                                                    : (isActive || hoveredLink === label ? 'text-white' : 'text-slate-700 hover:text-slate-900')
                                            }`}
                                            aria-current={isActive ? "page" : undefined}
                                            data-nav-active={isActive}
                                        >
                                            {/* SVG icons - transição suave */}
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="transition-transform duration-200"
                                                aria-hidden="true"
                                            >
                                                <path d={icon} />
                                            </svg>
                                            <span className="whitespace-nowrap">{label}</span>
                                        </Link>
                                    )
                                })}
                            </motion.div>
                        </div>

                        {/* COLUNA 3: CTAs (direita) - WhatsApp + Login discreto */}
                        <div className="hidden lg:flex justify-end items-center gap-3">
                            {/* WhatsApp CTA - Principal */}
                            <motion.a
                                href="https://wa.me/5511981845016"
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200"
                                style={{
                                    background: 'linear-gradient(135deg, rgb(22,163,74) 0%, rgb(21,128,61) 100%)',
                                    boxShadow: '0 4px 16px rgba(22,163,74,0.35)'
                                }}
                                aria-label="Falar com especialista via WhatsApp"
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    className="transition-transform duration-200 group-hover:scale-105"
                                    aria-hidden="true"
                                >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                                <span className="whitespace-nowrap hidden xl:inline">Fale Conosco</span>
                            </motion.a>

                            {/* Login Button - Discreto (apenas ícone) */}
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href="/login"
                                    className={`group relative inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300`}
                                    style={{
                                        background: scrolled
                                            ? 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.10) 100%)'
                                            : 'linear-gradient(135deg, rgba(241,245,249,0.95) 0%, rgba(226,232,240,0.9) 100%)',
                                        color: scrolled ? 'rgb(255,255,255)' : 'rgb(51,65,85)',
                                        border: scrolled ? '1px solid rgba(255,255,255,0.22)' : '1px solid rgba(226,232,240,0.8)',
                                        backdropFilter: 'blur(12px)',
                                        WebkitBackdropFilter: 'blur(12px)'
                                    }}
                                    aria-label="Área de sócios - Fazer login"
                                    title="Área de sócios"
                                >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="transition-transform duration-200 group-hover:scale-110"
                                    aria-hidden="true"
                                >
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </Link>
                            </motion.div>
                        </div>

                        {/* 🔥 Mobile: Hamburger Menu (direita) */}
                        <div className="flex lg:hidden justify-end col-start-3">
                            <motion.button
                                onClick={() => setOpen(!open)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative z-10 p-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                                style={{
                                    background: scrolled
                                        ? 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.10) 100%)'
                                        : 'linear-gradient(135deg, rgba(248,250,252,0.95) 0%, rgba(241,245,249,0.9) 100%)',
                                    backdropFilter: 'blur(12px)',
                                    WebkitBackdropFilter: 'blur(12px)',
                                    border: scrolled ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(226,232,240,0.5)'
                                }}
                                aria-label={open ? "Fechar menu" : "Abrir menu"}
                                aria-expanded={open}
                                aria-controls="mobile-menu"
                            >
                                <div className="w-5 h-4 flex flex-col justify-between">
                                    <motion.span 
                                        className="h-0.5 w-full rounded-full"
                                        style={{
                                            background: scrolled ? 'rgb(255,255,255)' : 'rgb(51,65,85)'
                                        }}
                                        animate={{
                                            rotate: open ? 45 : 0,
                                            y: open ? 6 : 0
                                        }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    <motion.span 
                                        className="h-0.5 w-full rounded-full"
                                        style={{
                                            background: scrolled ? 'rgb(255,255,255)' : 'rgb(51,65,85)'
                                        }}
                                        animate={{
                                            opacity: open ? 0 : 1,
                                            scale: open ? 0 : 1
                                        }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    <motion.span 
                                        className="h-0.5 w-full rounded-full"
                                        style={{
                                            background: scrolled ? 'rgb(255,255,255)' : 'rgb(51,65,85)'
                                        }}
                                        animate={{
                                            rotate: open ? -45 : 0,
                                            y: open ? -6 : 0
                                        }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* 🔥 Mobile Menu Premium with Glassmorphism */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        id="mobile-menu"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ 
                            type: "spring",
                            stiffness: 260,
                            damping: 25,
                            duration: 0.4
                        }}
                        className="fixed top-16 lg:top-20 left-0 w-full lg:hidden z-40"
                        aria-hidden={!open}
                    >
                        <div
                            className="border-b shadow-2xl"
                            style={{
                                background: 'linear-gradient(180deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.95) 100%)',
                                backdropFilter: 'blur(32px) saturate(110%)',
                                WebkitBackdropFilter: 'blur(32px) saturate(110%)',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)',
                                borderBottom: '1px solid rgba(255,255,255,0.12)'
                            }}
                        >
                    <div className="max-w-7xl mx-auto px-4 py-6 space-y-2.5">
                        {links.map(({ label, href, icon }, index) => {
                            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href))
                            return (
                                <motion.div
                                    key={label}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }}
                                    transition={{
                                        delay: index * 0.08,
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20
                                    }}
                                >
                                    <Link
                                        href={href}
                                        onClick={() => setOpen(false)}
                                        className={`
                                            flex items-center gap-3 px-5 py-3.5 rounded-xl text-base font-semibold
                                            transition-all duration-300
                                        `}
                                        style={{
                                            background: isActive
                                                ? 'linear-gradient(135deg, rgb(245,158,11) 0%, rgb(234,88,12) 100%)'
                                                : 'transparent',
                                            color: isActive ? 'white' : 'rgb(203,213,225)',
                                            boxShadow: isActive ? '0 8px 24px rgba(245,158,11,0.35)' : 'none'
                                        }}
                                    >
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="flex-shrink-0"
                                        aria-hidden="true"
                                    >
                                        <path d={icon} />
                                    </svg>
                                    <span className="flex-1">{label}</span>
                                    {isActive && (
                                        <span
                                            className="w-2 h-2 rounded-full bg-white shadow-lg"
                                            aria-label="Página atual"
                                        />
                                    )}
                                </Link>
                                </motion.div>
                            )
                        })}

                        {/* CTAs Mobile - WhatsApp + Login */}
                        <motion.div 
                            className="mt-4 grid grid-cols-2 gap-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ delay: links.length * 0.08 + 0.1 }}
                        >
                            {/* WhatsApp CTA Mobile */}
                            <motion.a
                                href="https://wa.me/5511981845016"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-bold text-white shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300"
                                style={{
                                    background: 'linear-gradient(135deg, rgb(22,163,74) 0%, rgb(21,128,61) 100%)',
                                    boxShadow: '0 8px 24px rgba(22,163,74,0.4)'
                                }}
                            >
                                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                                <span>WhatsApp</span>
                            </motion.a>

                            {/* Login Button Mobile */}
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <Link
                                    href="/login"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-bold text-white shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300"
                                    style={{
                                        background: 'linear-gradient(135deg, rgb(245,158,11) 0%, rgb(234,88,12) 100%)',
                                        boxShadow: '0 8px 24px rgba(245,158,11,0.4)'
                                    }}
                                >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                    <polyline points="10 17 15 12 10 7" />
                                    <line x1="15" y1="12" x2="3" y2="12" />
                                </svg>
                                <span>Login</span>
                            </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 🔥 Backdrop overlay profissional with Framer Motion */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-30 lg:hidden"
                        style={{
                            background: 'rgba(0,0,0,0.75)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)'
                        }}
                        onClick={() => setOpen(false)}
                        aria-hidden="true"
                    />
                )}
            </AnimatePresence>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </>
    )
}
