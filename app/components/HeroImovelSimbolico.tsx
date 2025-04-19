"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { BadgeCheck } from "lucide-react"

interface HeroImovelSimbolicoProps {
    titulo: string
    imagemFundo: string
    destaque?: boolean
    cidade?: string
    tipo?: string
    metros?: string
}

export default function HeroImovelSimbolico({
    titulo,
    imagemFundo,
    destaque,
    cidade,
    tipo,
    metros,
}: HeroImovelSimbolicoProps) {
    return (
        <section className="relative w-full min-h-[60vh] md:min-h-[75vh] lg:min-h-[80vh] overflow-hidden text-white rounded-b-[3rem] shadow-xl">
            <div className="absolute inset-0">
                <Image
                    src={imagemFundo}
                    alt={titulo}
                    fill
                    priority
                    className="object-cover object-center brightness-[0.4]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-0 backdrop-blur-sm" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9 }}
                className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center flex flex-col items-center justify-end h-full pb-16 md:pb-24"
            >
                {destaque && (
                    <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="mb-4 inline-flex items-center gap-2 px-4 py-1 rounded-full border border-yellow-400 text-yellow-100 text-xs font-medium uppercase tracking-widest bg-yellow-400/10 backdrop-blur-md"
                    >
                        <BadgeCheck className="w-4 h-4 text-yellow-300" /> Imóvel em destaque
                    </motion.span>
                )}

                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.7 }}
                    className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold leading-snug md:leading-tight tracking-tight drop-shadow-xl"
                >
                    {titulo}
                </motion.h1>

                {(cidade || tipo || metros) && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9, duration: 0.6 }}
                        className="mt-4 text-sm sm:text-base md:text-lg text-white/80 italic drop-shadow-sm"
                    >
                        {[tipo, metros, cidade].filter(Boolean).join(" · ")}
                    </motion.p>
                )}
            </motion.div>
        </section>
    )
}
