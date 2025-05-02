"use client";

import Image from "next/image";
import { ShieldCheck, MapPin, Users, ArrowRight, Star, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Montserrat } from "next/font/google";
import { useState } from "react";

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["300", "500", "600", "700"],
    display: "swap",
    variable: "--font-montserrat",
});

// Dados mais ricos e persuasivos
const destaques = [
    {
        titulo: "Segurança incomparável",
        descricao: "Guararema tem índice de criminalidade 78% menor que a capital. Viva sem medo, sem grades e aproveite cada momento.",
        icone: ShieldCheck,
        imagem: "/images/seguranca.jpg",
        altText: "Família caminhando tranquilamente à noite em Guararema",
        estatistica: "78% menos crimes",
        cta: "Conheça nossos condomínios fechados",
        depoimento: {
            texto: "Aqui posso deixar meus filhos brincarem na rua como na minha infância. Impagável!",
            autor: "Roberto, ex-morador de São Paulo"
        }
    },
    {
        titulo: "Bem-estar e saúde",
        descricao: "Ar puro, natureza abundante e menos estresse. A expectativa de vida em Guararema é 4 anos maior que a média estadual.",
        icone: Heart,
        imagem: "/images/qualidade.jpg",
        altText: "Família desfrutando de piquenique em área verde de Guararema",
        estatistica: "+4 anos de vida",
        cta: "Descubra nossos espaços verdes",
        depoimento: {
            texto: "Minha pressão normalizou e parei com os remédios para ansiedade em apenas 3 meses morando aqui.",
            autor: "Márcia, moradora há 1 ano"
        }
    },
    {
        titulo: "A 45 min de São Paulo",
        descricao: "Trabalhe na capital e volte para casa todos os dias. Trem direto, rodovia duplicada e acesso fácil ao Aeroporto de Guarulhos.",
        icone: MapPin,
        imagem: "/images/localizacao.jpg",
        altText: "Mapa destacando a proximidade de Guararema com São Paulo",
        estatistica: "45 min até SP",
        cta: "Veja nossos imóveis",
        depoimento: {
            texto: "Mantenho meu emprego em SP e recuperei 2 horas diárias do meu tempo de vida comparado ao trânsito da capital.",
            autor: "Carlos, empresário"
        }
    },
];

export default function SecaoDestaquesRegiao() {
    const [activeCard, setActiveCard] = useState<number | null>(null);

    // Variantes de animação avançadas
    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const cardVariants = {
        hidden: { y: 60, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100
            }
        },
        hover: {
            y: -10,
            transition: {
                type: "spring",
                damping: 10,
                stiffness: 200
            }
        }
    };

    const statBadgeVariants = {
        initial: { scale: 0.8, opacity: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                damping: 15,
                delay: 0.5
            }
        }
    };

    const textRevealVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <section
            className={`w-full bg-gradient-to-br from-[#f8e3c1] to-[#ffd79b] text-[#0D1F2D] py-20 md:py-32 px-4 md:px-6 ${montserrat.variable}`}
            aria-labelledby="guararema-heading"
        >
            <div className="max-w-7xl mx-auto space-y-16">
                {/* Cabeçalho impactante */}
                <div className="text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="inline-block mb-3"
                    >
                        <span className="bg-[#FFAD43] text-white px-4 py-1 rounded-full text-sm font-semibold tracking-wider uppercase">
                            Qualidade de vida comprovada
                        </span>
                    </motion.div>

                    <motion.h2
                        id="guararema-heading"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-[clamp(2.2rem,6vw,3.5rem)] font-bold leading-tight"
                    >
                        Uma nova vida te espera em <span className="text-[#FFAD43] relative inline-block">
                            Guararema
                            <motion.span
                                initial={{ width: 0 }}
                                whileInView={{ width: "100%" }}
                                transition={{ duration: 0.8, delay: 1, ease: "easeInOut" }}
                                viewport={{ once: true }}
                                className="absolute -bottom-2 left-0 h-1 bg-[#FFAD43]/50 rounded-full"
                            />
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="text-lg md:text-xl text-[#0D1F2D]/80 max-w-2xl mx-auto font-light"
                    >
                        <span className="font-medium">8 em cada 10 novos moradores</span> relatam melhoria significativa na qualidade de vida após se mudarem para Guararema. Descubra o porquê:
                    </motion.p>
                </div>

                {/* Cards interativos e informativos */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-10%" }}
                >
                    {destaques.map((item, i) => {
                        const Icon = item.icone;
                        const isActive = activeCard === i;

                        return (
                            <motion.div
                                key={i}
                                variants={cardVariants}
                                whileHover="hover"
                                onMouseEnter={() => setActiveCard(i)}
                                onMouseLeave={() => setActiveCard(null)}
                                className="relative bg-white rounded-2xl overflow-hidden shadow-xl group transition-all duration-500"
                                style={{
                                    boxShadow: isActive ? "0 25px 50px -12px rgba(255, 173, 67, 0.25)" : ""
                                }}
                            >
                                {/* Badge estatística flutuante */}
                                <motion.div
                                    className="absolute right-4 top-4 z-10 bg-white text-[#FFAD43] px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1"
                                    variants={statBadgeVariants}
                                    initial="initial"
                                    animate="animate"
                                >
                                    <Star className="w-4 h-4 fill-[#FFAD43] text-[#FFAD43]" />
                                    {item.estatistica}
                                </motion.div>

                                {/* Imagem com overlay mais dinâmico */}
                                <div className="relative w-full h-60 overflow-hidden">
                                    <Image
                                        src={item.imagem}
                                        alt={item.altText}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 400px"
                                        priority={i === 0}
                                        className="object-cover object-center transition-transform duration-700 ease-out"
                                        style={{
                                            transform: isActive ? "scale(1.08)" : "scale(1)"
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                                    {/* Título sobre a imagem para maior impacto */}
                                    <div className="absolute bottom-0 left-0 p-6 w-full">
                                        <h3 className="text-2xl font-semibold tracking-tight text-white">
                                            {item.titulo}
                                        </h3>
                                    </div>
                                </div>

                                <div className="p-6 space-y-5">
                                    {/* Descrição com destaque */}
                                    <p className="text-base text-[#0D1F2D]/80 leading-relaxed">
                                        {item.descricao}
                                    </p>

                                    {/* Depoimento real */}
                                    <div className="bg-[#f8f8f8] p-4 rounded-lg border-l-4 border-[#FFAD43] italic text-sm">
                                        <p className="text-[#0D1F2D]/75 mb-2">"{item.depoimento.texto}"</p>
                                        <p className="text-[#0D1F2D]/90 font-medium not-italic">— {item.depoimento.autor}</p>
                                    </div>

                                    {/* CTA atraente */}
                                    <motion.a
                                        href="#"
                                        className="mt-6 inline-flex items-center gap-2 text-[#FFAD43] font-medium group"
                                        whileHover={{ x: 5 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                        {item.cta}
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </motion.a>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Call to action principal */}
                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    viewport={{ once: true }}
                >
                    <a
                        href="#"
                        className="inline-block bg-[#FFAD43] hover:bg-[#f09a25] text-white font-semibold py-4 px-10 rounded-full text-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"
                    >
                        Agende uma visita e conheça Guararema
                    </a>
                    <p className="text-[#0D1F2D]/60 mt-4 text-sm">
                        Sem compromisso. Mais de 200 famílias atendidas em 2024.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}