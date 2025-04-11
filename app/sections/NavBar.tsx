"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaWhatsapp, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Montserrat } from 'next/font/google';

const montSerrat = Montserrat({
    subsets: ['latin'],
    weight: ['400'],
    display: 'swap',
    variable: '--font-montserrat',
});

const links = ["Início", "Comprar", "Alugar", "Contato"];

const linkVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.05,
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1],
        },
    }),
};

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-neutral-200 shadow-sm transition-all duration-700 ease-in-out ${scrolled ? 'py-1.5' : 'py-4'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center transition-all duration-300 ease-in-out">
                {/* Logo */}
                <Image
                    src="/images/ipeLogoWritten.png"
                    alt="Ipê Logo"
                    width={scrolled ? 130 : 160}
                    height={50}
                    className="object-contain transition-all duration-300"
                    priority
                />

                {/* Links - Desktop */}
                <ul
                    className={`hidden md:flex gap-10 text-[#0D1F2D] text-[${scrolled ? '15px' : '17px'}] font-medium tracking-wide ${montSerrat.className} transition-all duration-300`}
                >
                    {links.map((link, index) => (
                        <motion.li
                            key={link}
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            variants={linkVariants}
                            className="relative group cursor-pointer px-1"
                        >
                            <span className="relative z-10 group-hover:text-black transition-colors duration-300">
                                {link}
                            </span>
                            <span className="pointer-events-none absolute left-0 -bottom-0.5 h-[1.5px] w-full overflow-hidden">
                                <span className="block h-full w-full origin-left scale-x-0 bg-[#ffd816] transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-x-100" />
                            </span>
                        </motion.li>
                    ))}
                </ul>

                {/* WhatsApp CTA - Desktop */}
                <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    href="https://wa.me/5511981845016"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`hidden md:flex items-center gap-2 bg-[#20b858] text-white px-5 ${scrolled ? 'py-1.5 text-xs' : 'py-2 text-sm'
                        } rounded-full font-medium hover:brightness-105 hover:shadow transition duration-300`}
                >
                    <FaWhatsapp className="text-lg" />
                    Fale com nossa equipe
                </motion.a>

                {/* Toggle - Mobile */}
                <button
                    className="md:hidden text-gray-700 text-2xl"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Mobile Menu */}
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
                        <ul className="flex flex-col gap-5 text-[#0D1F2D] text-base font-medium">
                            {links.map((link, i) => (
                                <motion.li
                                    key={link}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.12 }}
                                    onClick={() => setOpen(false)}
                                    className="cursor-pointer hover:text-[#000000] transition-colors duration-200"
                                >
                                    {link}
                                </motion.li>
                            ))}
                        </ul>

                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            href="https://wa.me/5511981845016"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 flex items-center justify-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full text-sm font-medium hover:brightness-105 transition duration-300"
                        >
                            <FaWhatsapp className="text-lg" />
                            Fale com nossa equipe
                        </motion.a>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
