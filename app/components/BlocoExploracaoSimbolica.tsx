"use client"

import { Home, MapPin, Trees, Building2, Car, TrendingUp, ArrowRight, Sparkles, Search, Target, ShoppingBag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import SectionWrapper from "@/app/components/ui/SectionWrapper"

// [FINAL] Conteúdo dos cards com consistência de paleta e UI refinada
const cenariosDeMoradia = [
    {
        label: "Lar para Família",
        icone: <Home className="w-6 h-6 text-white" />,
        href: "/alugar?tipo=casa",
        descricao: "Espaço, conforto e segurança para sua família em nossas melhores casas e sobrados.",
        bgImage: "/images/imagensExploracao/family.png",
        tag: "Ideal para Famílias",
        accentColor: "amber",
        cta: "Explorar Casas"
    },
    {
        label: "Condomínios Fechados",
        icone: <Building2 className="w-6 h-6 text-white" />,
        href: "/alugar?tipo=condominio",
        descricao: "Segurança, lazer e qualidade de vida para sua família em condomínios selecionados.",
        bgImage: "/images/imagensExploracao/condominios.jpg",
        tag: "Lazer e Segurança",
        accentColor: "blue", // Azul para condomínios
        cta: "Ver Condomínios"
    },
    {
        label: "Imóveis Comerciais",
        icone: <ShoppingBag className="w-6 h-6 text-white" />,
        href: "/comprar?tipo=comercial",
        descricao: "Lojas, salas e prédios para o seu negócio prosperar no coração de Guararema.",
        bgImage: "/images/imagensExploracao/comerciais.jpg",
        tag: "Para Investir",
        accentColor: "green", // Verde para comerciais
        cta: "Ver Pontos Comerciais"
    },
]

const filtrosBairros = [
    { label: "Centro", icon: <Building2 className="w-4 h-4" />, href: "/alugar?bairro=centro", count: "12" },
    { label: "Nogueira", icon: <Trees className="w-4 h-4" />, href: "/alugar?bairro=nogueira", count: "8" },
    { label: "Itaoca", icon: <Home className="w-4 h-4" />, href: "/alugar?bairro=itaoca", count: "6" },
    { label: "P. Agrinco", icon: <MapPin className="w-4 h-4" />, href: "/alugar?bairro=parque-agrinco", count: "4" },
    { label: "Guanabara", icon: <Building2 className="w-4 h-4" />, href: "/alugar?bairro=guanabara", count: "7" },
    { label: "Lagoa Nova", icon: <Trees className="w-4 h-4" />, href: "/alugar?bairro=lagoa-nova", count: "5" },
]

const buscasFrequentes = [
    { label: "Aluguel até R$ 2.000", href: "/alugar?precoMax=2000", trend: "Mais buscado" },
    { label: "Casas com quintal", href: "/alugar?tipo=casa&caracteristica=quintal", trend: "Alta demanda" },
    { label: "Perto do Centro", href: "/alugar?bairro=centro", trend: "Conveniência" },
]

// Mapeamento de classes para evitar problemas com o JIT compiler do Tailwind
const iconBgClasses = {
  amber: 'bg-gradient-to-br from-amber-500 to-amber-600',
  blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
  green: 'bg-gradient-to-br from-green-500 to-green-600',
};

const shadowHoverClasses = {
    amber: 'group-hover:shadow-amber-500/20',
    blue: 'group-hover:shadow-blue-500/20',
    green: 'group-hover:shadow-green-500/20',
}

export default function BlocoExploracaoGuararema() {
    return (
        <SectionWrapper
            background="white"
            className="relative overflow-hidden pt-16 pb-24"
        >
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-amber-100/60 border border-amber-200/80 rounded-full text-amber-800 text-sm font-semibold shadow-sm">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        Curadoria Especial de Aluguel
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                        Alugue em Guararema: <span className="block sm:inline-block bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                             Do seu Jeito
                        </span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Nossa curadoria de imóveis para alugar em Guararema. Explore por tipo, bairro ou características.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-x-8 lg:gap-y-16">
                    {cenariosDeMoradia.map((cenario) => (
                        <Link
                            key={cenario.label}
                            href={cenario.href}
                            className="group block"
                        >
                            <div className="relative">
                                <div className="relative h-56 w-full rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                                    <Image
                                        src={cenario.bgImage}
                                        alt={cenario.label}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/20"></div>
                                    <div className={`absolute top-3 right-3 text-xs font-semibold text-white bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20`}>
                                        {cenario.tag}
                                    </div>
                                </div>

                                <div className="absolute -top-6 left-6">
                                    <div className={`p-4 rounded-2xl shadow-lg border-2 border-white/80 ${iconBgClasses[cenario.accentColor as keyof typeof iconBgClasses]}`}>
                                        {cenario.icone}
                                    </div>
                                </div>

                                <div className={`relative bg-gradient-to-b from-white to-gray-50 border border-gray-200/80 rounded-2xl pt-14 pb-6 px-6 -mt-10 shadow-md transition-all duration-300 group-hover:shadow-xl ${shadowHoverClasses[cenario.accentColor as keyof typeof shadowHoverClasses]}`}>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{cenario.label}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed mb-4 h-12">{cenario.descricao}</p>
                                    <div className="flex items-center justify-end gap-2 text-sm font-semibold text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span>{cenario.cta}</span>
                                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="mt-24 bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-200/70 shadow-xl max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">Explore Aluguéis por Bairro</h3>
                        <p className="text-gray-600">Encontre a localização perfeita para você.</p>
                    </div>
                    <Link
                        href="/mapa-de-alugueis"
                        className="inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 font-semibold bg-amber-100/80 px-5 py-3 rounded-xl border border-amber-200/80 hover:bg-amber-200/70 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        <MapPin className="w-4 h-4" />
                        Ver Mapa de Aluguéis
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {filtrosBairros.map((filtro) => (
                        <Link
                            key={filtro.label}
                            href={filtro.href}
                            className="group p-3 bg-white rounded-xl border-2 border-gray-200/90 hover:border-amber-400/80 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 shadow-md"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gray-100 border border-gray-200/90 shadow-sm">
                                    {filtro.icon}
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-800">{filtro.label}</span>
                                    <span className="block text-xs text-gray-500 group-hover:text-amber-600">{filtro.count} aluguéis</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="pt-8 mt-8 border-t border-gray-200/90">
                    <p className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-amber-600" />
                        Atalhos para seu Aluguel Ideal
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {buscasFrequentes.map((busca) => (
                            <Link
                                key={busca.label}
                                href={busca.href}
                                className="group inline-flex items-center gap-2 text-sm text-gray-700 hover:text-amber-800 bg-white px-4 py-2 rounded-full border-2 border-gray-200/90 font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:border-amber-300/80"
                            >
                                <span>{busca.label}</span>
                                <span className="text-xs text-gray-500 group-hover:text-amber-600 border-l-2 border-gray-200/90 pl-2 ml-1 transition-colors duration-200">
                                    {busca.trend}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-16 text-center max-w-7xl mx-auto">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-10 text-white shadow-2xl">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Target className="w-5 h-5 text-amber-400" />
                        <span className="text-sm font-medium text-amber-400 uppercase tracking-wider">
                            Precisa de ajuda?
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold mb-3">Fale com um Especialista em Locação</h3>
                    <p className="text-gray-300 mb-8 max-w-lg mx-auto">
                        Nossa equipe pode criar uma busca direcionada para encontrar seu imóvel ideal para alugar.
                    </p>
                    <Link
                        href="/contato?assunto=aluguel"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        <Search className="w-5 h-5" />
                        Busca Personalizada de Aluguel
                    </Link>
                </div>
            </div>
        </SectionWrapper>
    );
}
