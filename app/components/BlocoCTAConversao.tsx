import { motion } from "framer-motion"
import Link from "next/link"
import { ShieldCheck, Phone } from "lucide-react"

interface BlocoCTAConversaoProps {
    titulo: string
    subtitulo: string
    ctaText: string
    ctaLink: string
}

export default function BlocoCTAConversao({ titulo, subtitulo, ctaText, ctaLink }: BlocoCTAConversaoProps) {
    return (
        <section className="w-full py-20 px-6 md:px-12 bg-[#0D1F2D] text-white relative overflow-hidden">
            {/* Fundo simbólico leve */}
            <div className="absolute inset-0 bg-[url('/seal-light.png')] bg-center bg-no-repeat opacity-5 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative z-10 max-w-4xl mx-auto text-center space-y-6"
            >
                <h2 className="text-2xl md:text-3xl font-semibold">
                    {titulo}
                </h2>
                <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                    {subtitulo}
                </p>
                <Link
                    href={ctaLink}
                    target="_blank"
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#20b858] hover:brightness-110 transition text-white text-sm font-medium shadow-lg"
                >
                    <Phone className="w-4 h-4" /> {ctaText}
                </Link>
                <p className="text-xs text-white/60 mt-2 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Atendimento seguro e confiável
                </p>
            </motion.div>
        </section>
    )
}