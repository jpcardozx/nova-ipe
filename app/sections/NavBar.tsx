'use client';

import { useState } from "react";
import { FaWhatsapp, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { DM_Serif_Display, Italiana, Libre_Caslon_Display, Cormorant_Garamond, Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] });

const dmSerif = DM_Serif_Display({
    subsets: ['latin'],
    weight: ['400'],
    display: 'swap',
    variable: '--font-dmserif',
});

const italiana = Italiana({
    subsets: ['latin'],
    weight: ['400'],
    display: 'swap',
    variable: '--font-italiana',
});

const libreCaslon = Libre_Caslon_Display({
    subsets: ['latin'],
    weight: ['400'],
    display: 'swap',
    variable: '--font-libre',
});

const cormorant = Cormorant_Garamond({
    subsets: ['latin'],
    weight: ['400', '700'],
    display: 'swap',
    variable: '--font-cormorant',
});

const links = ["Início", "Comprar", "Alugar", "Contato"];

const linkVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.08,
            duration: 0.4,
            ease: "easeOut",
        },
    }),
};

const Navbar = () => {
    const [open, setOpen] = useState(false);

    return (
        <nav className="w-full fixed top-0 z-50 bg-white/80 backdrop-blur-lg shadow-md border-b border-neutral-200 p-3 md:p-4 rounded-b-xl transition-all duration-300 ease-in-out">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo + Nome */}
                <div className="flex items-center space-x-3">
                    <img src="https://github.com/jpcardozx/julia_realstate/blob/main/logos/assets/ipeLogo.png?raw=true" alt="Ipê Logo" className='h-12 w-12 mr-4 object-contain' />
                    <span className={`${playfair.className} text-3xl text-gray-900 font-semibold tracking-wide hover:`}>
                        Nova Ipê
                    </span>

                </div>

                <ul className="hidden md:flex gap-10 text-gray-800 text-[15px] font-medium tracking-tight">
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
                                <span className="block h-full w-full origin-left scale-x-0 bg-gray-900 transition-transform duration-300 ease-in-out group-hover:scale-x-100" />
                            </span>
                        </motion.li>
                    ))}
                </ul>


                {/* CTA WhatsApp - Desktop */}
                <a
                    href="https://wa.me/5511981845016"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden md:flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-green-700 hover:shadow-md hover:brightness-110 transition-all duration-300 ease-in-out"
                >
                    <FaWhatsapp className="text-lg" />
                    Fale com nossa equipe
                </a>

                {/* Mobile menu toggle */}
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
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="md:hidden bg-white shadow-md rounded-b-xl px-6 pt-2 pb-6"
                    >
                        <ul className="flex flex-col gap-4 text-gray-700 text-sm font-light">
                            {links.map((link) => (
                                <li
                                    key={link}
                                    className="hover:text-black transition cursor-pointer"
                                    onClick={() => setOpen(false)}
                                >
                                    {link}
                                </li>
                            ))}
                        </ul>

                        <a
                            href="https://wa.me/5511981845016"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-green-700 transition"
                        >
                            <FaWhatsapp className="text-lg" />
                            Fale com nossa equipe
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
