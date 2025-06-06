"use client"

import { useCallback, useState, useEffect } from "react"
import { Home, MapPin, ShoppingBag, Search, Trees, Building2, Car } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useProperties, QuickPropertySearch } from "./ClientComponents"

// Categorias de imóveis em Guararema
const categoriasDestaque = [
    {
        label: "Casas",
        icone: <Home className="w-6 h-6" />,
        href: "/buscar?tipo=casa&bairro=centro",
        descricao: "Imóveis residenciais em áreas centrais",
        bgImage: "/houses.jpg",
        quantidadeMedia: "Em catálogo"
    },
    {
        label: "Terrenos",
        icone: <MapPin className="w-6 h-6" />,
        href: "/buscar?tipo=terreno",
        descricao: "Áreas para construção residencial",
        bgImage: "/terreno.jpg",
        quantidadeMedia: "Disponíveis"
    },
    {
        label: "Comércios",
        icone: <ShoppingBag className="w-6 h-6" />,
        href: "/buscar?tipo=comercial",
        descricao: "Espaços comerciais em localização central",
        bgImage: "/comerciais.jpg",
        quantidadeMedia: "Para locação e venda"
    },
]

// Filtros de bairros reais de Guararema
const filtrosBairros = [
    { label: "Centro", icon: <Building2 className="w-4 h-4" />, href: "/buscar?bairro=centro" },
    { label: "Nogueira", icon: <Trees className="w-4 h-4" />, href: "/buscar?bairro=nogueira" },
    { label: "Itaoca", icon: <Home className="w-4 h-4" />, href: "/buscar?bairro=itaoca" },
    { label: "Parque Agrinco", icon: <MapPin className="w-4 h-4" />, href: "/buscar?bairro=parque-agrinco" },
    { label: "Guanabara", icon: <Building2 className="w-4 h-4" />, href: "/buscar?bairro=guanabara" },
    { label: "Lagoa Nova", icon: <Trees className="w-4 h-4" />, href: "/buscar?bairro=lagoa-nova" },
]

// Buscas mais procuradas
const buscasFrequentes = [
    { label: "Até R$ 500 mil", href: "/buscar?preco=ate-500k" },
    { label: "Casas com quintal", href: "/buscar?caracteristica=quintal" },
    { label: "Próximo à estação", href: "/buscar?proximo=estacao" },
]

export default function BlocoExploracaoGuararema() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <section className="w-full py-16 px-6 md:px-12 bg-white">
            <div className="max-w-6xl mx-auto">                {/* Cabeçalho simplificado */}                <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 font-display tracking-tight">
                    Selecione sua Categoria de Interesse
                </h2>
                <p className="text-gray-600 max-w-2xl font-body leading-relaxed">
                    Explore nosso portfólio segmentado por categoria ou utilize os filtros para uma busca refinada. <span className="text-amber-600 font-medium cursor-pointer hover:underline">Atualizações semanais.</span>
                </p>
            </div>

                {/* Cards de categorias com design sóbrio */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {categoriasDestaque.map((categoria, idx) => (
                        <Link
                            href={categoria.href}
                            key={idx}
                            className="group relative overflow-hidden rounded-xl border border-gray-200 
                                     hover:border-amber-200 transition-all duration-300"
                            onMouseEnter={() => setHoveredIndex(idx)}
                            onMouseLeave={() => setHoveredIndex(null)}                        >                            <div className="relative h-48 w-full">
                                <div className="absolute inset-0 bg-black/40 z-10" />
                                <Image
                                    src={categoria.bgImage}
                                    alt={categoria.label}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover"
                                />

                                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-white/90 rounded-lg">
                                            {categoria.icone}
                                        </div>
                                        <span className="text-xs font-medium text-white bg-black/50 px-2 py-1 rounded">
                                            {categoria.quantidadeMedia}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-semibold text-white mb-1 font-display">
                                        {categoria.label}
                                    </h3>
                                    <p className="text-sm text-white/90 font-body">
                                        {categoria.descricao}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Seção de filtros por bairro */}
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 font-display">Escolha seu Bairro Ideal</h3>
                        <p className="text-sm text-gray-600 mt-1 font-body">Cada região tem sua personalidade. Qual combina com você?</p>
                    </div>
                    <Link
                        href="/mapa"
                        className="text-sm text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1 bg-amber-50 px-4 py-2 rounded-lg border border-amber-100 hover:bg-amber-100 transition-colors font-body"
                    >
                        <Car className="w-4 h-4" />
                        Explorar no mapa
                    </Link>
                </div>

                    <div className="flex flex-wrap gap-3">
                        {filtrosBairros.map((filtro, idx) => (
                            <Link
                                key={idx}
                                href={filtro.href}
                                className="inline-flex items-center gap-2 text-sm px-4 py-2.5 
                                         bg-white text-gray-700 rounded-lg border border-gray-200
                                         hover:bg-amber-50 hover:border-amber-300 hover:text-amber-800
                                         transition-all duration-200"
                            >
                                {filtro.icon}
                                {filtro.label}
                            </Link>
                        ))}
                    </div>

                    {/* Buscas frequentes - mais discreto */}
                    <div className="mt-6 pt-6 border-t border-amber-100">
                        <p className="text-sm text-gray-600 mb-3">Buscas frequentes:</p>
                        <div className="flex flex-wrap gap-3">
                            {buscasFrequentes.map((busca, idx) => (
                                <Link
                                    key={idx}
                                    href={busca.href}
                                    className="text-sm text-amber-700 hover:text-amber-800 
                                             underline-offset-2 hover:underline"
                                >
                                    {busca.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>                {/* Chamada para ação sutil */}
                <div className="mt-12 text-center">
                    <p className="text-gray-600 mb-4">
                        Não encontrou sua oportunidade ideal?
                    </p>
                    <Link
                        href="/contato"
                        className="inline-flex items-center gap-2 px-6 py-3 
                                 bg-amber-600 text-white rounded-lg font-medium
                                 hover:bg-amber-700 transition-colors duration-200"
                    >
                        Receber análise personalizada
                        <Search className="w-4 h-4" />
                    </Link>                </div>
            </div>
        </section>
    );
}