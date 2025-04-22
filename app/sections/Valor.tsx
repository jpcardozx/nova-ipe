"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Montserrat } from "next/font/google";
import { BadgeCheck } from "lucide-react";

const montSerrat = Montserrat({
    subsets: ["latin"],
    weight: ["400"],
    display: "swap",
    variable: "--font-montserrat",
});

export default function SecaoApresentacaoValor() {
    return (
        <section className={`w-full bg-[#e0e1d9] text-[#0D1F2D] py-32 px-6 border-t border-[#FFAD43]/10 ${montSerrat.className}`}>
            <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-16 items-center relative">
                {/* Selo visual */}
                <div className="absolute -top-10 left-6 md:left-0 flex items-center gap-2 text-sm text-[#FFAD43] font-medium">
                    <BadgeCheck className="w-5 h-5" />
                    +200 imóveis entregues com segurança
                </div>

                {/* Bloco de texto com hierarquia real */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="md:col-span-3 space-y-7"
                >
                    <h2 className="text-[clamp(1.9rem,4vw,2.7rem)] font-semibold leading-snug tracking-tight max-w-2xl text-center md:text-left">
                        Atendimento eficiente e de qualidade com a Imobiliária de Referência no mercado local
                        <span className="text-[#FFAD43]">.</span>
                    </h2>

                    <p className="text-base md:text-lg text-[#0D1F2D]/85 leading-relaxed max-w-xl">
                        A Ipê é uma imobiliária sólida, com mais de quinze anos de atuação consistente em Guararema. Atuamos com critério técnico, leitura estratégica do mercado e responsabilidade sobre cada orientação que damos.
                    </p>

                    <p className="text-base text-[#0D1F2D]/70 max-w-lg leading-relaxed">
                        Nosso trabalho começa muito antes da visita e vai além da assinatura: analisamos documentação, avaliamos potencial de valorização, mapeamos riscos e garantimos que cada negociação se sustente com clareza, fundamento e confiança.
                    </p>
                </motion.div>

                {/* Imagem institucional simbólica */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="md:col-span-2 relative w-full h-72 md:h-[440px] rounded-2xl overflow-hidden shadow-md"
                >
                    <Image
                        src="/images/mirante.png"
                        alt="Vista panorâmica de Guararema"
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, 40vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1F2D]/60 via-transparent to-transparent" />
                </motion.div>
            </div>
        </section>
    );
}