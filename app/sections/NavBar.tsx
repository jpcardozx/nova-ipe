"use client";

import { useState } from "react";
import Image from "next/image";
import { FaWhatsapp, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Libre_Caslon_Display } from 'next/font/google';

const libreCaslon = Libre_Caslon_Display({
    subsets: ['latin'],
    weight: ['400'],
    display: 'swap',
    variable: '--font-libre',
});

const links = ["Início", "Comprar", "Alugar", "Contato"];

const linkVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.06,
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1],
        },
    }),
};

const Navbar = () => {
    const [open, setOpen] = useState(false);

    return (
        <motion.nav
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed top-0 left-0 w-full z-50 bg-white backdrop-blur-lg shadow-sm border-b border-neutral-200 transition-all duration-500 ease-in-out"
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Image
                    src='/images/ipeLogoWritten.png'
                    alt="Ipê Logo"
                    width={178}
                    height={50}
                    className="object-contain"
                />

                {/* Links - Desktop */}
                <ul className="hidden md:flex gap-10 text-[#0D1F2D] text-[15px] font-medium tracking-tight">
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
                                <span className="block h-full w-full origin-left scale-x-0 bg-[#FFAD43] transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-x-100" />
                            </span>
                        </motion.li>
                    ))}
                </ul>

                {/* CTA WhatsApp - Desktop */}
                <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    href="https://wa.me/5511981845016"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden md:flex items-center gap-2 bg-[#20b858] text-white px-5 py-2 rounded-full text-sm font-medium hover:brightness-110 hover:shadow-md transition"
                >
                    <FaWhatsapp className="text-lg" />
                    Fale com nossa equipe
                </motion.a>

                {/* Mobile menu toggle */}
                <button
                    className="md:hidden text-gray-700 text-2xl"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Mobile Menu com animação */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="mobileMenu"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="md:hidden bg-white/90 backdrop-blur-xl shadow-xl rounded-b-2xl px-6 pt-4 pb-8"
                    >
                        <ul className="flex flex-col gap-5 text-[#0D1F2D] text-base font-medium">
                            {links.map((link, i) => (
                                <motion.li
                                    key={link}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => setOpen(false)}
                                    className="cursor-pointer hover:text-[#FFAD43] transition-colors"
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
                            className="mt-6 flex items-center justify-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full text-sm font-medium hover:shadow-md transition"
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
