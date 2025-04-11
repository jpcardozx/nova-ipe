"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Montserrat } from "next/font/google";

const montSerrat = Montserrat({
    subsets: ["latin"],
    weight: ["400"],
    display: "swap",
    variable: "--font-montserrat",
});

const testimonials = [
    {
        nome: "Carla Salim",
        cidade: "Guararema",
        depoimento:
            "Depois de anos procurando um sítio, encontramos a Ipê. A atenção com cada detalhe nos deu segurança para fechar o negócio. Hoje vivemos em paz, cercados de natureza.",
        imagem: "/images/cliente1.jpg",
    },
    {
        nome: "Fernanda e João",
        cidade: "Guararema",
        depoimento:
            "Fizemos tudo à distância, mas parecia que estávamos lá. Atendimento direto, transparente e caloroso. Encontramos o nosso refúgio.",
        imagem: "/images/cliente2.jpg",
    },
    {
        nome: "Larissa Nogueira",
        cidade: "Luís Carlos",
        depoimento:
            "Queríamos uma casa de fim de semana. Com a Ipê, achamos um lar. A experiência foi leve, sem pressão, e com muita clareza em cada etapa.",
        imagem: "/images/cliente3.png",
    },
];

export default function SecaoSocialProof() {
    return (
        <section
            className={`w-full bg-[#18344aad] py-24 px-6 text-[#F7D7A3] ${montSerrat.className}`}
        >
            <div className="max-w-7xl mx-auto">
                {/* Título */}
                <div className="text-center mb-14">
                    <h2 className="text-4xl md:text-5xl font-light tracking-tight leading-snug">
                        Cada imóvel, uma <span className="text-[#FFAD43] font-semibold">história real</span>
                    </h2>
                    <p className="mt-4 text-base md:text-lg text-[#F7D7A3]/70 max-w-2xl mx-auto font-light">
                        Depoimentos sinceros de quem vive o melhor de Guararema com a Ipê Imóveis.
                    </p>
                </div>

                {/* Cards em carrossel responsivo */}
                <div className="flex overflow-x-auto gap-6 snap-x snap-mandatory pb-2 px-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#FFAD43]/40">
                    {testimonials.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="min-w-[300px] max-w-sm flex-shrink-0 snap-center bg-[#faf9f6] border border-[#F7D7A3]/30 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#FFAD43]">
                                    <Image
                                        src={item.imagem}
                                        alt={item.nome}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-[#0D1F2D]">{item.nome}</p>
                                    <p className="text-xs text-[#0D1F2D]/60">{item.cidade}</p>
                                </div>
                            </div>
                            <blockquote className="text-sm font-light italic text-[#0D1F2D]/90 border-l-2 border-[#FFAD43] pl-4 leading-relaxed">
                                {item.depoimento}
                            </blockquote>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}