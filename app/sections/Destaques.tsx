"use client";

import Image from "next/image";
import { ShieldCheck, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Montserrat } from "next/font/google";

const montSerrat = Montserrat({
    subsets: ["latin"],
    weight: ["400"],
    display: "swap",
    variable: "--font-montserrat",
});

const destaques = [
    {
        titulo: "Cidade segura",
        descricao: "Entre as mais seguras do estado, Guararema oferece tranquilidade para quem quer viver bem.",
        icone: ShieldCheck,
        imagem: "/images/seguranca.jpg",
    },
    {
        titulo: "Qualidade de vida",
        descricao: "93% dos nossos clientes vêm de fora buscando natureza, espaço e sossego.",
        icone: Users,
        imagem: "/images/qualidade.jpg",
    },
    {
        titulo: "Localização estratégica",
        descricao: "No coração do Vale do Paraíba, com fácil acesso à capital e ao interior.",
        icone: MapPin,
        imagem: "/images/localizacao.jpg",
    },
];

export default function SecaoDestaquesRegiao() {
    return (
        <section className={`w-full bg-[#f8e3c1] text-[#0D1F2D] py-28 px-6 ${montSerrat.className}`}>
            <div className="max-w-7xl mx-auto space-y-16">
                {/* Cabeçalho */}
                <div className="text-center space-y-6">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-[clamp(2rem,5vw,2.8rem)] font-light leading-tight"
                    >
                        Por que tantas pessoas escolhem <span className="text-[#FFAD43] font-medium">Guararema?</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-base md:text-lg text-[#0D1F2D]/70 max-w-2xl mx-auto font-light"
                    >
                        Viver em Guararema é escolher calma, conexão e qualidade — a poucos minutos da capital.
                    </motion.p>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-3 gap-8">
                    {destaques.map((item, i) => {
                        const Icon = item.icone;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="relative bg-white rounded-3xl overflow-hidden shadow-lg group hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="relative w-full h-48">
                                    <Image
                                        src={item.imagem}
                                        alt={item.titulo}
                                        fill
                                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                                </div>

                                <div className="p-6 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#FFAD43]/20 flex items-center justify-center">
                                            <Icon className="w-5 h-5 text-[#FFAD43]" />
                                        </div>
                                        <h3 className="text-lg font-medium tracking-tight text-[#0D1F2D]">
                                            {item.titulo}
                                        </h3>
                                    </div>

                                    <p className="text-sm text-[#0D1F2D]/70 leading-relaxed">
                                        {item.descricao}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
