"use client"

import { useCallback, useState, useEffect } from "react"
import { Home, MapPin, Building, Castle, Mountain, ShoppingBag, Search, ZoomIn, ArrowRight, TrendingUp, DollarSign } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useProperties, QuickPropertySearch } from "./ClientComponents"

// Categorias aprimoradas com imagens de fundo e descrições
const categoriasDestaque = [
    {
        label: "Casas",
        icone: <Home className="w-6 h-6" />,
        href: "/comprar?tipo=casa",
        descricao: "Encontre a casa perfeita para sua família em Guararema",
        bgImage: "/images/categorias/casas.jpg",
        color: "amber"
    },
    {
        label: "Terrenos",
        icone: <MapPin className="w-6 h-6" />,
        href: "/comprar?tipo=terreno",
        descricao: "Projete sua vida em um dos terrenos de maior valorização da região",
        bgImage: "/images/categorias/terrenos.jpg",
        color: "green"
    },
    {
        label: "Imóveis Comerciais",
        icone: <ShoppingBag className="w-6 h-6" />,
        href: "/comprar?tipo=comercial",
        descricao: "Invista em pontos estratégicos para seu negócio prosperar",
        bgImage: "/images/categorias/comerciais.jpg",
        color: "blue"
    },
]

// Filtros rápidos com melhor UI
const filtros = [
    { label: "Casas", icon: <Home className="w-4 h-4" />, href: "/comprar?tipo=casa" },
    { label: "Terrenos", icon: <MapPin className="w-4 h-4" />, href: "/comprar?tipo=terreno" },
    { label: "Comerciais", icon: <ShoppingBag className="w-4 h-4" />, href: "/comprar?tipo=comercial" },
    { label: "Centro", icon: <Building className="w-4 h-4" />, href: "/comprar?localizacao=centro" },
    { label: "Itapema", icon: <Castle className="w-4 h-4" />, href: "/comprar?localizacao=itapema" },
    { label: "Rural", icon: <Mountain className="w-4 h-4" />, href: "/comprar?tipo=rural" },
]

// Opções de buscas específicas
const buscasRapidas = [
    { label: "Casas com Piscina", href: "/busca-avancada?caracteristicas=piscina", icon: <ZoomIn className="w-4 h-4" /> },
    { label: "Pronto para Morar", href: "/busca-avancada?status=pronto", icon: <TrendingUp className="w-4 h-4" /> },
    { label: "Financiamento Facilitado", href: "/busca-avancada?financiamento=sim", icon: <DollarSign className="w-4 h-4" /> },
]

export default function BlocoExploracaoSimbolica() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // Efeito para auto-rotação das categorias em destaque
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) =>
                prev === null || prev >= categoriasDestaque.length - 1 ? 0 : prev + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Cores de acordo com a categoria
    const getAccentColor = useCallback((color: string) => {
        switch (color) {
            case "amber": return "bg-amber-500";
            case "green": return "bg-emerald-500";
            case "blue": return "bg-blue-500";
            default: return "bg-primary-500";
        }
    }, []);

    return (
        <section className="w-full py-20 px-6 md:px-12 bg-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/texture-elegant.png')] opacity-5 mix-blend-soft-light"></div>

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-[#0D1F2D] mb-3">
                            Descubra seu Novo Lar
                        </h2>
                        <p className="text-[#0D1F2D]/70 max-w-2xl">
                            Encontre imóveis que combinam com seu estilo de vida em Guararema, organizados para uma experiência de busca intuitiva.
                        </p>
                    </div>
                    <div className="w-full md:w-80 lg:w-96">
                        <QuickPropertySearch />
                    </div>
                </div>

                {/* Cards de categorias em destaque */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {categoriasDestaque.map((categoria, idx) => (
                        <Link
                            href={categoria.href}
                            key={idx}
                            className="group relative overflow-hidden rounded-2xl h-64 transition-all duration-500"
                            onMouseEnter={() => setActiveIndex(idx)}
                        >
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500 z-10" />

                            {/* Imagem de fundo com efeito parallax */}
                            <motion.div
                                className="absolute inset-0"
                                animate={{
                                    scale: activeIndex === idx ? 1.05 : 1,
                                }}
                                transition={{ duration: 5 }}
                            >
                                <Image
                                    src={categoria.bgImage || "/images/property-placeholder.jpg"}
                                    alt={categoria.label}
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>

                            <div className="absolute inset-0 flex flex-col items-start justify-end p-6 z-20">
                                <div className={cn(
                                    "p-3 rounded-full mb-4",
                                    "bg-white/20 backdrop-blur-sm"
                                )}>
                                    {categoria.icone}
                                </div>

                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{categoria.label}</h3>
                                    <p className="text-sm text-white/90 mb-4 max-w-[90%] line-clamp-2">{categoria.descricao}</p>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{
                                            opacity: activeIndex === idx ? 1 : 0,
                                            y: activeIndex === idx ? 0 : 20
                                        }}
                                        className="flex items-center text-white font-medium"
                                    >
                                        Explorar agora <ArrowRight className="w-4 h-4 ml-1" />
                                    </motion.div>
                                </div>
                            </div>

                            {/* Indicador visual */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 z-30">
                                <div className={cn(
                                    "h-full w-full transform origin-left scale-x-0 transition-transform duration-500",
                                    getAccentColor(categoria.color),
                                    activeIndex === idx && "scale-x-100"
                                )} />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Filtros rápidos */}
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-neutral-100 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <h3 className="text-lg font-semibold text-[#0D1F2D]">Filtros rápidos</h3>
                        <Link href="/busca-avancada" className="text-sm text-primary-600 hover:text-primary-700 flex items-center font-medium">
                            Busca avançada <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {filtros.map((filtro, idx) => (
                            <Link
                                key={idx}
                                href={filtro.href}
                                className="inline-flex items-center gap-2 text-sm px-4 py-2.5 
                                           bg-white text-[#0D1F2D] rounded-full border border-neutral-200
                                           hover:bg-[#FFAD43]/10 hover:border-[#FFAD43]/30 hover:shadow-sm 
                                           transition-all duration-300 transform hover:scale-105"
                            >
                                {filtro.icon} {filtro.label}
                            </Link>
                        ))}
                    </div>

                    <div className="border-t border-neutral-100 mt-6 pt-6">
                        <p className="text-sm text-neutral-500 mb-4">Buscas em alta:</p>
                        <div className="flex flex-wrap gap-3">
                            {buscasRapidas.map((busca, idx) => (
                                <Link
                                    key={idx}
                                    href={busca.href}
                                    className="inline-flex items-center gap-2 text-sm px-3 py-1.5
                                               text-neutral-700 underline-offset-4 hover:underline"
                                >
                                    {busca.icon} {busca.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
