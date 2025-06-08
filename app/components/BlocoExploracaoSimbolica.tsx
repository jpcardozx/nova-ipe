"use client"

import { useState } from "react"
import { Home, MapPin, ShoppingBag, Search, Trees, Building2, Car, TrendingUp, ArrowRight, Sparkles, Target } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import SectionWrapper from "@/app/components/ui/SectionWrapper"

// Categorias de imóveis em Guararema com design premium
const categoriasDestaque = [
    {
        label: "Casas",
        icone: <Home className="w-6 h-6" />,
        href: "/buscar?tipo=casa&bairro=centro",
        descricao: "Residências premium em localização estratégica",
        bgImage: "/houses.jpg",
        quantidadeMedia: "Catálogo exclusivo",
        highlightColor: "from-emerald-500 to-teal-600",
        stats: "15+ disponíveis"
    },
    {
        label: "Terrenos",
        icone: <MapPin className="w-6 h-6" />,
        href: "/buscar?tipo=terreno",
        descricao: "Lotes para projetos personalizados",
        bgImage: "/terreno.jpg",
        quantidadeMedia: "Para construção",
        highlightColor: "from-amber-500 to-orange-600",
        stats: "8+ oportunidades"
    },
    {
        label: "Comércios",
        icone: <ShoppingBag className="w-6 h-6" />,
        href: "/buscar?tipo=comercial",
        descricao: "Pontos comerciais em localização nobre",
        bgImage: "/comerciais.jpg",
        quantidadeMedia: "Investimento",
        highlightColor: "from-blue-500 to-indigo-600",
        stats: "5+ espaços"
    },
]

// Filtros de bairros reais de Guararema com estatísticas
const filtrosBairros = [
    { label: "Centro", icon: <Building2 className="w-4 h-4" />, href: "/buscar?bairro=centro", count: "12 imóveis" },
    { label: "Nogueira", icon: <Trees className="w-4 h-4" />, href: "/buscar?bairro=nogueira", count: "8 imóveis" },
    { label: "Itaoca", icon: <Home className="w-4 h-4" />, href: "/buscar?bairro=itaoca", count: "6 imóveis" },
    { label: "Parque Agrinco", icon: <MapPin className="w-4 h-4" />, href: "/buscar?bairro=parque-agrinco", count: "4 imóveis" },
    { label: "Guanabara", icon: <Building2 className="w-4 h-4" />, href: "/buscar?bairro=guanabara", count: "7 imóveis" },
    { label: "Lagoa Nova", icon: <Trees className="w-4 h-4" />, href: "/buscar?bairro=lagoa-nova", count: "5 imóveis" },
]

// Buscas mais procuradas com informações de tendência
const buscasFrequentes = [
    { label: "Até R$ 500 mil", href: "/buscar?preco=ate-500k", trend: "+23% procura" },
    { label: "Casas com quintal", href: "/buscar?caracteristica=quintal", trend: "Alta demanda" },
    { label: "Próximo à estação", href: "/buscar?proximo=estacao", trend: "+15% interesse" },
]

export default function BlocoExploracaoGuararema() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    return (
        <SectionWrapper
            background="gradient"
            className="relative overflow-hidden"
            animate={true}
        >
            {/* Background decorativo */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute top-0 left-0 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-100/25 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div ref={sectionRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Cabeçalho premium */}
                <motion.div
                    className="text-center mb-20"
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={containerVariants}
                >
                    <motion.div
                        variants={itemVariants}
                        className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-full text-amber-700 text-sm font-semibold mb-8 shadow-lg backdrop-blur-sm"
                    >
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        Explore Guararema
                        <MapPin className="w-4 h-4 text-amber-600" />
                    </motion.div>

                    <motion.h2
                        variants={itemVariants}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight"
                    >
                        Encontre seu
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                            Espaço Ideal
                        </span>
                    </motion.h2>

                    <motion.p
                        variants={itemVariants}
                        className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                    >
                        Explore nossa seleção exclusiva de imóveis em Guararema.
                        <span className="text-amber-600 font-semibold"> Atualizada semanalmente</span> com as
                        melhores oportunidades do mercado local.
                    </motion.p>
                </motion.div>

                {/* Cards de categorias com design premium */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {categoriasDestaque.map((categoria, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 * idx }}
                            whileHover={{ scale: 1.05 }}
                            className="group relative overflow-hidden rounded-2xl border border-gray-200 
                                     hover:border-amber-300 transition-all duration-500 shadow-lg hover:shadow-2xl"
                            onMouseEnter={() => setHoveredIndex(idx)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <Link href={categoria.href}>
                                <div className="relative h-64 w-full">
                                    {/* Overlay gradiente mais sofisticado */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
                                    <div className="absolute inset-0 bg-amber-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                                    <Image
                                        src={categoria.bgImage}
                                        alt={categoria.label}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />                                    {/* Conteúdo do card */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                                        <div className="flex items-center justify-between mb-3">
                                            <motion.div
                                                className="p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg"
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {categoria.icone}
                                            </motion.div>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="text-xs font-semibold text-white bg-amber-600/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-amber-400/30">
                                                    {categoria.quantidadeMedia}
                                                </span>
                                                <span className="text-xs font-medium text-amber-200 bg-black/20 backdrop-blur-sm px-2 py-1 rounded-full">
                                                    {categoria.stats}
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-2">
                                            {categoria.label}
                                        </h3>
                                        <p className="text-sm text-white/90 leading-relaxed mb-3">
                                            {categoria.descricao}
                                        </p>

                                        {/* Highlight gradient bar */}
                                        <div className={`h-1 w-full bg-gradient-to-r ${categoria.highlightColor} rounded-full mb-3 opacity-80`} />

                                        {/* Indicador de hover */}
                                        <motion.div
                                            className="flex items-center gap-2 text-amber-300"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{
                                                opacity: hoveredIndex === idx ? 1 : 0,
                                                x: hoveredIndex === idx ? 0 : -10
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <span className="text-sm font-medium">Explorar</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </motion.div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Seção de filtros por bairro melhorada */}
                <motion.div
                    className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200 shadow-lg"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 font-display mb-2">Explore por Bairro</h3>
                            <p className="text-gray-600 font-body">Cada região tem sua personalidade única. Descubra a sua!</p>
                        </div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href="/mapa"
                                className="inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 font-semibold bg-white px-6 py-3 rounded-xl border border-amber-200 hover:bg-amber-50 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                <Car className="w-4 h-4" />
                                Ver no Mapa Interativo
                            </Link>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">                        {filtrosBairros.map((filtro, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.05 * idx }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href={filtro.href}
                                className="group flex items-center justify-between text-sm px-4 py-3.5 
                                             bg-white text-gray-700 rounded-xl border border-gray-200
                                             hover:bg-amber-50 hover:border-amber-300 hover:text-amber-800
                                             transition-all duration-300 shadow-sm hover:shadow-md"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-amber-100 transition-colors">
                                        {filtro.icon}
                                    </div>
                                    <span className="font-medium">{filtro.label}</span>
                                </div>
                                <span className="text-xs text-gray-500 group-hover:text-amber-600">
                                    {filtro.count}
                                </span>
                            </Link>
                        </motion.div>
                    ))}
                    </div>

                    {/* Buscas frequentes aprimoradas */}
                    <div className="pt-6 border-t border-amber-200">
                        <p className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-amber-600" />
                            Buscas em Alta:
                        </p>                        <div className="flex flex-wrap gap-3">
                            {buscasFrequentes.map((busca, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href={busca.href}
                                        className="group inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 
                                                 bg-white hover:bg-amber-50 px-4 py-2.5 rounded-lg border border-amber-200
                                                 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                    >
                                        <span>{busca.label}</span>
                                        <span className="text-xs text-gray-500 group-hover:text-amber-600 border-l border-amber-200 pl-2 ml-1">
                                            {busca.trend}
                                        </span>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>                {/* Chamada para ação elegante */}
                <motion.div
                    className="mt-16 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-2xl">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center justify-center gap-2 mb-4"
                        >
                            <Target className="w-5 h-5 text-amber-400" />
                            <span className="text-sm font-medium text-amber-400 uppercase tracking-wide">
                                Busca Especializada
                            </span>
                        </motion.div>

                        <h3 className="text-2xl font-bold mb-3">Atendimento Personalizado</h3>
                        <p className="text-gray-300 mb-6 max-w-lg mx-auto">
                            Nossa equipe de especialistas locais pode criar uma busca direcionada para seus
                            critérios específicos. Conte-nos sobre seu imóvel ideal.
                        </p>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href="/contato"
                                className="inline-flex items-center gap-3 px-8 py-4 
                                         bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold
                                         hover:from-amber-600 hover:to-orange-600 transition-all duration-300 
                                         shadow-lg hover:shadow-xl border border-amber-400/20"
                            >
                                <Search className="w-5 h-5" />
                                Solicitar Análise Gratuita
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>

                        {/* Stats row */}
                        <div className="mt-6 pt-6 border-t border-gray-700 flex justify-center items-center gap-8 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                <span>Resposta em 24h</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-amber-400 rounded-full" />
                                <span>Sem compromisso</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </SectionWrapper>
    );
}