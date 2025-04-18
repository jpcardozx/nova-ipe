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
        <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden text-white">
            <Image
                src={imagemFundo}
                alt={titulo}
                fill
                priority
                className="object-cover object-center brightness-[0.4]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-0" />

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9 }}
                className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center flex flex-col items-center justify-end h-full pb-20"
            >
                {destaque && (
                    <span className="mb-4 inline-flex items-center gap-2 px-4 py-1 rounded-full bg-yellow-400/90 text-yellow-900 text-xs font-semibold uppercase tracking-widest shadow-sm">
                        <BadgeCheck className="w-4 h-4" /> Destaque Nova Ipê
                    </span>
                )}
                <h1 className="text-3xl md:text-5xl font-playfair font-bold leading-snug md:leading-tight max-w-3xl">
                    {titulo}
                </h1>
                {(cidade || tipo || metros) && (
                    <p className="mt-4 text-base md:text-lg text-white/80 italic">
                        {[tipo, metros, cidade].filter(Boolean).join(" · ")}
                    </p>
                )}
            </motion.div>
        </section>
    )
}
