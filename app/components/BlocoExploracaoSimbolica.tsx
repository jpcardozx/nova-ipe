"use client"

import { useCallback, useState, useEffect } from "react"
import { Home, MapPin, ShoppingBag, Search, Trees, Building2, Car } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useProperties, QuickPropertySearch } from "./ClientComponents"

// Categorias realistas de Guararema
const categoriasDestaque = [
    {
        label: "Casas",
        icone: <Home className="w-6 h-6" />,
        href: "/buscar?tipo=casa&bairro=centro",
        descricao: "Imóveis próximos ao comércio e infraestrutura",
        bgImage: "/houses.jpg",
        quantidadeMedia: "Novidades disponíveis"
    },
    {
        label: "Terrenos",
        icone: <MapPin className="w-6 h-6" />,
        href: "/buscar?tipo=terreno",
        descricao: "Oportunidades para construção e investimento",
        bgImage: "/terreno.jpg",
        quantidadeMedia: "Catálogo Exclusivo"
    },
    {
        label: "Comércios",
        icone: <ShoppingBag className="w-6 h-6" />,
        href: "/buscar?tipo=comercial",
        descricao: "Pontos comerciais no centro e arredores",
        bgImage: "/comerciais.jpg",
        quantidadeMedia: "Confira opções disponíveis"
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
            <div className="max-w-6xl mx-auto">
                {/* Cabeçalho simplificado */}
                <div className="mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                        Explore Imóveis em Guararema
                    </h2>
                    <p className="text-gray-600 max-w-2xl">
                        Navegue por nossa seleção de imóveis disponíveis nos principais bairros da cidade.
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
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div className="aspect-[16/10] relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />

                                <Image
                                    src={categoria.bgImage}
                                    alt={categoria.label}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
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

                                    <h3 className="text-lg font-semibold text-white mb-1">
                                        {categoria.label}
                                    </h3>
                                    <p className="text-sm text-white/90">
                                        {categoria.descricao}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Seção de filtros por bairro */}
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Buscar por Bairro</h3>
                            <p className="text-sm text-gray-600 mt-1">Encontre imóveis nos principais bairros de Guararema</p>
                        </div>
                        <Link
                            href="/mapa"
                            className="text-sm text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1"
                        >
                            <Car className="w-4 h-4" />
                            Ver no mapa
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
                </div>

                {/* Chamada para ação sutil */}
                <div className="mt-12 text-center">
                    <p className="text-gray-600 mb-4">
                        Não encontrou o que procura?
                    </p>
                    <Link
                        href="/contato"
                        className="inline-flex items-center gap-2 px-6 py-3 
                                 bg-amber-600 text-white rounded-lg font-medium
                                 hover:bg-amber-700 transition-colors duration-200"
                    >
                        Fale com um corretor
                        <Search className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}