"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { BadgeCheck } from "lucide-react"

interface HeroImovelProps {
    imagem: string
    titulo: string
    cidade: string
    tipo: string
    metros: string
    destaque?: boolean
}

export default function HeroImovel({ imagem, titulo, cidade, tipo, metros, destaque }: HeroImovelProps) {
    return (
        <section className="relative w-full min-h-[80vh] overflow-hidden rounded-b-3xl shadow-xl">
            {/* Background visual */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={imagem}
                    alt={`Imagem do imóvel: ${titulo}`}
                    fill
                    priority
                    className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent" />
                <div className="absolute bottom-0 w-full h-28 bg-[#fafaf9] clip-path-hero-mask" />
            </div>

            {/* Marca d'água institucional */}
            <div className="absolute bottom-8 right-8 z-10 opacity-10 select-none">
                <span className="text-7xl font-extrabold text-white tracking-tight">Ipê</span>
            </div>

            {/* Conteúdo */}
            <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="relative z-20 h-full w-full flex flex-col justify-end pb-24 px-6 md:px-14 max-w-7xl mx-auto"
            >
                {destaque && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-4 inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#FFAD43]/90 text-[#0D1F2D] text-xs font-semibold uppercase tracking-widest shadow-md"
                    >
                        <BadgeCheck className="w-4 h-4" /> Imóvel em destaque
                    </motion.div>
                )}

                <h1 className="text-[clamp(2.2rem,6vw,3.6rem)] font-playfair font-bold text-white leading-tight max-w-4xl drop-shadow-xl">
                    {titulo}
                </h1>

                <p className="mt-3 text-white/90 text-[clamp(1rem,2vw,1.3rem)] italic">
                    {[cidade, tipo, metros].filter(Boolean).join(" · ")}
                </p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 inline-block bg-white/10 backdrop-blur-sm text-white text-xs px-4 py-[6px] rounded-full uppercase tracking-wide font-medium shadow-sm border border-white/20"
                >
                    Curadoria Nova Ipê
                </motion.div>
            </motion.div>

            <style jsx>{`
        .clip-path-hero-mask {
          clip-path: polygon(0% 100%, 0% 0%, 100% 0%, 100% 65%, 0% 100%);
        }
      `}</style>
        </section>
    )
}
