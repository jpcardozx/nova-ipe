"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Sparkles } from "lucide-react"

interface HeroInstitucionalProps {
    titulo: string
    subtitulo?: string
    tagline?: string
}

export default function HeroInstitucional({ titulo, subtitulo, tagline }: HeroInstitucionalProps) {
    return (
        <section className="relative w-full bg-[#F2EFEA] py-28 px-6 md:px-12 border-b border-[#FFAD43]/20 overflow-hidden">
            {/* Fundo simbólico */}
            <div className="absolute inset-0 bg-[url('/seal-grid.png')] bg-center bg-no-repeat opacity-5 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="relative z-10 max-w-5xl mx-auto text-center"
            >
                {tagline && (
                    <p className="inline-flex items-center gap-2 text-[#0D1F2D]/50 text-sm font-medium uppercase tracking-wide mb-4">
                        <Sparkles className="w-4 h-4" /> {tagline}
                    </p>
                )}
                <h1 className="text-4xl md:text-5xl font-bold text-[#0D1F2D] leading-tight">
                    {titulo}
                </h1>
                {subtitulo && (
                    <p className="mt-6 text-lg md:text-xl text-[#0D1F2D]/70 max-w-3xl mx-auto leading-relaxed">
                        {subtitulo}
                    </p>
                )}
            </motion.div>
        </section>
    )
}
