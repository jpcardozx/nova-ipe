"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Montserrat } from "next/font/google"

const montSerrat = Montserrat({
    subsets: ["latin"],
    weight: ["400"],
    display: "swap",
    variable: "--font-montserrat",
})

const links = [
    { label: "Início", href: "/" },
    { label: "Comprar", href: "/comprar" },
    { label: "Alugar", href: "/alugar" },
    { label: "Sobre Nós", href: "/sobre" },
    { label: "Contato", href: "#contato" },
]

export default function Navbar() {
    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        // Mark component as mounted to prevent hydration issues
        setIsMounted(true)

        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])    // Don't render anything during SSR to prevent hydration mismatches
    if (!isMounted) {
        return null;
    }

    return (
        <motion.nav
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-neutral-200 shadow-sm transition-all duration-300 ${scrolled ? "py-1.5" : "py-4"}`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                {/* ✅ Logo */}
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

                {/* ✅ Links Desktop */}
                <ul className={`hidden md:flex gap-10 text-[#0D1F2D] text-sm font-medium ${montSerrat.className}`}>
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
                </ul>                {/* ✅ CTA WhatsApp Desktop */}                <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    href="https://wa.me/5511981845016"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden md:inline-flex items-center gap-2 bg-[#20b858] text-white px-5 py-2 rounded-full text-sm font-medium hover:brightness-105 transition shadow-sm"
                >
                    <span className="navbar-icon">
                        <svg width="16" height="16" fill="currentColor" className="text-white" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M20.5 3.5c-2.6-2.6-6.9-2.6-9.5 0-2.2 2.2-2.5 5.6-1 8.2L3 21l9.3-7c2.6 1.5 6 .8 8.2-1 2.6-2.6 2.6-6.9 0-9.5z" />
                        </svg>
                    </span>
                    Conversar com consultor
                </motion.a>

                {/* ✅ Menu Toggle Mobile */}                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden text-gray-700 text-2xl flex items-center justify-center"
                    aria-label="Abrir menu"
                    aria-expanded={open}
                >
                    <span className="sr-only">Menu</span>
                    <span className="navbar-icon">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="block" viewBox="0 0 24 24">
                            {open ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </span>
                </button>
            </div>

            {/* ✅ Mobile Menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="mobileMenu"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ type: "spring", stiffness: 260, damping: 25 }}
                        className="md:hidden bg-white/95 backdrop-blur-xl shadow-md rounded-b-2xl px-6 pt-4 pb-8"
                    >
                        <ul className="flex flex-col gap-4 text-[#0D1F2D] text-base font-medium">
                            {links.map(({ label, href }) => (
                                <li key={label} onClick={() => setOpen(false)}>
                                    <Link href={href} className="block py-1 hover:text-[#000]">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            href="https://wa.me/5511981845016"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 flex items-center justify-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full text-sm font-medium hover:brightness-105 transition"
                        >
                            <span className="navbar-icon">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M20.5 3.5c-2.6-2.6-6.9-2.6-9.5 0-2.2 2.2-2.5 5.6-1 8.2L3 21l9.3-7c2.6 1.5 6 .8 8.2-1 2.6-2.6 2.6-6.9 0-9.5z" />
                                </svg>
                            </span>
                            Fale com um corretor!
                        </motion.a>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}