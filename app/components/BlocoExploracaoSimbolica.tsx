"use client"

import { Home, MapPin, Trees, Building2, Car, TrendingUp, ArrowRight, Award, Search, Target, ShoppingBag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import SectionWrapper from "@/app/components/ui/SectionWrapper"
import { useCarousel } from "@/app/hooks/useCarousel"
import { cn } from "@/lib/utils"

// [PREMIUM] Dados completos com assets relevantes
const cenariosDeMoradia = [
    {
        label: "Casas & Sobrados",
        subtitulo: "Espaço e privacidade",
        icone: <Home className="w-full h-full" />,
        href: "/alugar?tipo=casa",
        descricao: "Quintal, garagem coberta e até 4 quartos para sua família crescer",
        features: ["2-4 quartos", "Quintal", "Garagem"],
        bgImage: "/images/imagensExploracao/family.png",
        badge: "Área externa",
        accentColor: "amber",
        stats: { price: "R$ 1.500 - R$ 3.500", area: "80m² - 200m²" }
    },
    {
        label: "Condomínios Fechados",
        subtitulo: "Infraestrutura completa",
        icone: <Building2 className="w-full h-full" />,
        href: "/alugar?tipo=condominio",
        descricao: "Portaria 24h, área de lazer completa e infraestrutura premium",
        features: ["Portaria 24h", "Lazer", "Academia"],
        bgImage: "/images/imagensExploracao/condominios.jpg",
        badge: "Segurança 24h",
        accentColor: "blue",
        stats: { price: "R$ 2.000 - R$ 5.000", area: "60m² - 150m²" }
    },
    {
        label: "Imóveis Comerciais",
        subtitulo: "Localização estratégica",
        icone: <ShoppingBag className="w-full h-full" />,
        href: "/comprar?tipo=comercial",
        descricao: "Lojas e salas comerciais em pontos estratégicos de Guararema",
        features: ["Centro", "Alto fluxo", "Visibilidade"],
        bgImage: "/images/imagensExploracao/comerciais.jpg",
        badge: "Ponto comercial",
        accentColor: "emerald",
        stats: { price: "R$ 3.000 - R$ 8.000", area: "40m² - 300m²" }
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
    { label: "Aluguel até R$ 2.000", href: "/alugar?precoMax=2000", trend: "Busca frequente" },
    { label: "Casas com quintal", href: "/alugar?tipo=casa&caracteristica=quintal", trend: "Procurado" },
    { label: "Perto do Centro", href: "/alugar?bairro=centro", trend: "Região central" },
]

// Mapeamento de classes para evitar problemas com o JIT compiler do Tailwind
// Paleta harmônica com tonalidades consistentes
const iconBgClasses = {
  amber: 'from-amber-500 to-amber-600',
  blue: 'from-blue-500 to-blue-600',
  emerald: 'from-emerald-500 to-emerald-600',
};

const shadowHoverClasses = {
    amber: 'group-hover:shadow-amber-500/20',
    blue: 'group-hover:shadow-blue-500/20',
    green: 'group-hover:shadow-green-500/20',
}

// Componente Mobile Carousel (S-Tier) - Clareza Máxima
function MobileCarousel({ 
    items, 
    iconBgClasses, 
    shadowHoverClasses 
}: { 
    items: typeof cenariosDeMoradia
    iconBgClasses: Record<string, string>
    shadowHoverClasses: Record<string, string>
}) {
    const { emblaRef, selectedIndex, scrollSnaps, scrollTo } = useCarousel({
        options: { loop: false, align: 'start' },
    })

    return (
        <>
            <div className="overflow-hidden -mx-4 sm:mx-0" ref={emblaRef}>
                <div className="flex gap-3 sm:gap-4 px-4 sm:px-0">
                    {items.map((cenario) => (
                        <Link
                            key={cenario.label}
                            href={cenario.href}
                            className="group block flex-[0_0_85%] sm:flex-[0_0_90%] min-w-0"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white border border-gray-100/50">
                                {/* Imagem de Fundo com Overlay Profissional */}
                                <div className="relative h-44 sm:h-52 w-full overflow-hidden">
                                    <Image
                                        src={cenario.bgImage}
                                        alt={cenario.label}
                                        fill
                                        sizes="90vw"
                                        className="object-cover transition-all duration-700 group-hover:scale-110"
                                    />
                                    {/* Gradient Overlay Sofisticado */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                    
                                    {/* Badge Alto Contraste */}
                                    {cenario.badge && (
                                        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-slate-900/95 backdrop-blur-md px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full shadow-2xl border border-slate-800">
                                            <span className="text-white text-[10px] sm:text-xs font-bold tracking-wide">{cenario.badge}</span>
                                        </div>
                                    )}
                                    
                                    {/* Ícone Grande Integrado na Imagem */}
                                    <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5">
                                        <div className={cn(
                                            "p-3.5 sm:p-4 rounded-2xl shadow-2xl backdrop-blur-sm border-2 border-white/30",
                                            "transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1",
                                            "bg-gradient-to-br",
                                            iconBgClasses[cenario.accentColor as keyof typeof iconBgClasses]
                                        )}>
                                            <div className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-2xl flex items-center justify-center">
                                                {cenario.icone}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Content Premium */}
                                <div className="relative p-4 sm:p-5 bg-white">
                                    {/* Decorative Border Top */}
                                    <div className={cn(
                                        "absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                                        "bg-gradient-to-r",
                                        cenario.accentColor === 'amber' && "from-amber-500 to-amber-600",
                                        cenario.accentColor === 'blue' && "from-blue-500 to-blue-600",
                                        cenario.accentColor === 'emerald' && "from-emerald-500 to-emerald-600"
                                    )} />
                                    
                                    <div className="space-y-2 sm:space-y-2.5 mb-4 sm:mb-5">
                                        <h3 className={cn(
                                            "font-bold text-lg sm:text-xl tracking-tight transition-colors truncate",
                                            cenario.accentColor === 'amber' && "text-slate-900 group-hover:text-amber-600",
                                            cenario.accentColor === 'blue' && "text-slate-900 group-hover:text-blue-600",
                                            cenario.accentColor === 'emerald' && "text-slate-900 group-hover:text-emerald-600"
                                        )}>
                                            {cenario.label}
                                        </h3>
                                        <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">
                                            {cenario.subtitulo}
                                        </p>
                                        <p className="text-slate-700 text-xs sm:text-sm leading-relaxed line-clamp-2">
                                            {cenario.descricao}
                                        </p>
                                    </div>
                                    
                                    {/* Divider Elegante */}
                                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-4" />
                                    
                                    {/* CTA Premium */}
                                    <div className="flex items-center justify-between">
                                        <span className={cn(
                                            "text-xs sm:text-sm font-bold transition-colors",
                                            cenario.accentColor === 'amber' && "text-amber-600 group-hover:text-amber-700",
                                            cenario.accentColor === 'blue' && "text-blue-600 group-hover:text-blue-700",
                                            cenario.accentColor === 'emerald' && "text-emerald-600 group-hover:text-emerald-700"
                                        )}>
                                            Explorar imóveis
                                        </span>
                                        <div className={cn(
                                            "w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110",
                                            cenario.accentColor === 'amber' && "bg-amber-50 group-hover:bg-amber-100",
                                            cenario.accentColor === 'blue' && "bg-blue-50 group-hover:bg-blue-100",
                                            cenario.accentColor === 'emerald' && "bg-emerald-50 group-hover:bg-emerald-100"
                                        )}>
                                            <ArrowRight className={cn(
                                                "w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform group-hover:translate-x-0.5",
                                                cenario.accentColor === 'amber' && "text-amber-600",
                                                cenario.accentColor === 'blue' && "text-blue-600",
                                                cenario.accentColor === 'emerald' && "text-emerald-600"
                                            )} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            
            {/* Dots de Navegação Aprimorados */}
            <div className="flex justify-center gap-1.5 sm:gap-2 mt-5 sm:mt-6">
                {scrollSnaps.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => scrollTo(idx)}
                        className={cn(
                            "h-2 sm:h-2.5 rounded-full transition-all duration-300 shadow-sm active:scale-90",
                            idx === selectedIndex 
                                ? "w-8 sm:w-10 bg-gradient-to-r from-amber-500 to-orange-500" 
                                : "w-2 sm:w-2.5 bg-gray-300 hover:bg-gray-400"
                        )}
                        aria-label={`Ir para ${items[idx].label}`}
                        aria-current={idx === selectedIndex ? 'true' : 'false'}
                    />
                ))}
            </div>
        </>
    )
}

export default function BlocoExploracaoGuararema() {
    return (
        <SectionWrapper
            background="white"
            className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24 bg-gradient-to-br from-slate-50 via-white to-slate-50/80"
        >
            {/* Background Texture Premium - Externo */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
                <div 
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(148 163 184 / 0.08) 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 sm:mb-16 md:mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6 bg-amber-100/60 border border-amber-200/80 rounded-full text-amber-800 text-xs sm:text-sm font-semibold shadow-sm">
                        <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
                        Imóveis para Locação
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight px-2">
                        Alugue em Guararema: <span className="block sm:inline-block bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                             Encontre seu Espaço
                        </span>
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                        Explore nosso portfólio de imóveis para locação. Filtre por tipo, localização ou características específicas.
                    </p>
                </div>

                {/* Mobile: Carrossel Horizontal */}
                <div className="md:hidden mb-10 sm:mb-12">
                    <MobileCarousel 
                        items={cenariosDeMoradia}
                        iconBgClasses={iconBgClasses}
                        shadowHoverClasses={shadowHoverClasses}
                    />
                </div>

                {/* Desktop: Grid Aprimorado com Clareza */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-x-8 lg:gap-y-16">
                    {cenariosDeMoradia.map((cenario) => (
                        <Link
                            key={cenario.label}
                            href={cenario.href}
                            className="group block transition-all duration-500 hover:shadow-2xl active:scale-[0.98]"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white border border-gray-100/50">
                                {/* Imagem de Fundo com Overlay Profissional */}
                                <div className="relative h-64 w-full overflow-hidden">
                                    <Image
                                        src={cenario.bgImage}
                                        alt={cenario.label}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover transition-all duration-700 group-hover:scale-110"
                                    />
                                    {/* Gradient Overlay Sofisticado */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                    
                                    {/* Badge Alto Contraste */}
                                    {cenario.badge && (
                                        <div className="absolute top-4 right-4 bg-slate-900/95 backdrop-blur-md px-4 py-1.5 rounded-full shadow-2xl border border-slate-800">
                                            <span className="text-white text-xs font-bold tracking-wide">{cenario.badge}</span>
                                        </div>
                                    )}
                                    
                                    {/* Ícone Grande Integrado na Imagem */}
                                    <div className="absolute bottom-6 left-6">
                                        <div className={cn(
                                            "p-5 rounded-2xl shadow-2xl backdrop-blur-sm border-2 border-white/30",
                                            "transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2",
                                            "bg-gradient-to-br",
                                            iconBgClasses[cenario.accentColor as keyof typeof iconBgClasses]
                                        )}>
                                            <div className="w-8 h-8 text-white drop-shadow-2xl flex items-center justify-center">
                                                {cenario.icone}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Content Premium */}
                                <div className="relative p-6 bg-white">
                                    {/* Decorative Border Top */}
                                    <div className={cn(
                                        "absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                                        "bg-gradient-to-r",
                                        cenario.accentColor === 'amber' && "from-amber-500 to-amber-600",
                                        cenario.accentColor === 'blue' && "from-blue-500 to-blue-600",
                                        cenario.accentColor === 'emerald' && "from-emerald-500 to-emerald-600"
                                    )} />
                                    
                                    <div className="space-y-3 mb-5">
                                        <h3 className={cn(
                                            "font-bold text-2xl tracking-tight transition-colors",
                                            cenario.accentColor === 'amber' && "text-slate-900 group-hover:text-amber-600",
                                            cenario.accentColor === 'blue' && "text-slate-900 group-hover:text-blue-600",
                                            cenario.accentColor === 'emerald' && "text-slate-900 group-hover:text-emerald-600"
                                        )}>
                                            {cenario.label}
                                        </h3>
                                        <p className="text-slate-600 text-sm font-medium">
                                            {cenario.subtitulo}
                                        </p>
                                        <p className="text-slate-700 text-sm leading-relaxed">
                                            {cenario.descricao}
                                        </p>
                                    </div>
                                    
                                    {/* Divider Elegante */}
                                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-5" />
                                    
                                    {/* CTA Premium */}
                                    <div className="flex items-center justify-between">
                                        <span className={cn(
                                            "text-sm font-bold transition-colors",
                                            cenario.accentColor === 'amber' && "text-amber-600 group-hover:text-amber-700",
                                            cenario.accentColor === 'blue' && "text-blue-600 group-hover:text-blue-700",
                                            cenario.accentColor === 'emerald' && "text-emerald-600 group-hover:text-emerald-700"
                                        )}>
                                            Explorar imóveis
                                        </span>
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110",
                                            cenario.accentColor === 'amber' && "bg-amber-50 group-hover:bg-amber-100",
                                            cenario.accentColor === 'blue' && "bg-blue-50 group-hover:bg-blue-100",
                                            cenario.accentColor === 'emerald' && "bg-emerald-50 group-hover:bg-emerald-100"
                                        )}>
                                            <ArrowRight className={cn(
                                                "w-5 h-5 transition-transform group-hover:translate-x-0.5",
                                                cenario.accentColor === 'amber' && "text-amber-600",
                                                cenario.accentColor === 'blue' && "text-blue-600",
                                                cenario.accentColor === 'emerald' && "text-emerald-600"
                                            )} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-gray-200/70 shadow-xl max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 sm:mb-6 gap-3 sm:gap-4">
                    <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Explore Aluguéis por Bairro</h3>
                        <p className="text-sm sm:text-base text-gray-600">Encontre a localização perfeita para você.</p>
                    </div>
                    <Link
                        href="/mapa-de-alugueis"
                        className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm text-amber-700 hover:text-amber-800 font-semibold bg-amber-100/80 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-amber-200/80 hover:bg-amber-200/70 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
                    >
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="whitespace-nowrap">Visualizar no Mapa</span>
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
                    {filtrosBairros.map((filtro) => (
                        <Link
                            key={filtro.label}
                            href={filtro.href}
                            className="group p-2.5 sm:p-3 bg-white rounded-lg sm:rounded-xl border-2 border-gray-200/90 hover:border-amber-400/80 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 shadow-sm"
                        >
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-gray-100 border border-gray-200/90 shadow-sm flex-shrink-0">
                                    {filtro.icon}
                                </div>
                                <div className="min-w-0">
                                    <span className="font-semibold text-xs sm:text-sm text-gray-800 truncate block">{filtro.label}</span>
                                    <span className="block text-[10px] sm:text-xs text-gray-500 group-hover:text-amber-600 transition-colors">{filtro.count} imóveis</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="pt-5 sm:pt-6 md:pt-8 mt-5 sm:mt-6 md:mt-8 border-t border-gray-200/90">
                    <p className="text-sm sm:text-base font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                        Buscas Rápidas
                    </p>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        {buscasFrequentes.map((busca) => (
                            <Link
                                key={busca.label}
                                href={busca.href}
                                className="group inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-700 hover:text-amber-800 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 border-gray-200/90 font-medium transition-all duration-200 shadow-sm hover:shadow-lg hover:border-amber-300/80 active:scale-95"
                            >
                                <span className="whitespace-nowrap">{busca.label}</span>
                                <span className="text-[10px] sm:text-xs text-gray-500 group-hover:text-amber-600 border-l-2 border-gray-200/90 pl-1.5 sm:pl-2 ml-1 transition-colors duration-200 whitespace-nowrap hidden sm:inline">
                                    {busca.trend}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Especialista - Premium Design Responsivo */}
            <div className="relative mt-10 sm:mt-12 md:mt-16 text-center max-w-7xl mx-auto px-4 sm:px-0">
                <div className="relative bg-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 text-white shadow-2xl overflow-hidden border border-slate-800">
                    {/* Background Pattern Sutil */}
                    <div className="absolute inset-0 opacity-5">
                        <div 
                            className="absolute inset-0"
                            style={{
                                backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(255 255 255) 1px, transparent 0)',
                                backgroundSize: '32px 32px'
                            }}
                        />
                    </div>
                    
                    {/* Glow Effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-24 sm:h-32 bg-amber-500/10 blur-3xl" />
                    
                    <div className="relative z-10">
                        {/* Badge Premium */}
                        <div className="inline-flex items-center gap-2 sm:gap-2.5 mb-4 sm:mb-5 px-3.5 sm:px-4 py-1.5 sm:py-2 bg-amber-500/10 border border-amber-500/20 rounded-full backdrop-blur-sm">
                            <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                            <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-amber-400 uppercase tracking-wider">
                                Atendimento Especializado
                            </span>
                        </div>
                        
                        {/* Título Responsivo */}
                        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 tracking-tight leading-tight">
                            Encontre seu Imóvel Ideal
                        </h3>
                        
                        {/* Descrição Aprimorada Mobile */}
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-300 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
                            Nossa equipe de especialistas em locação está pronta para criar uma busca personalizada e encontrar o imóvel perfeito para você.
                        </p>
                        
                        {/* CTA Button Premium com Texto Diferente Mobile/Desktop */}
                        <Link
                            href="/contato?assunto=aluguel"
                            className="group inline-flex items-center justify-center gap-2 sm:gap-2.5 md:gap-3 px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 bg-amber-500 text-slate-900 text-xs sm:text-sm md:text-base font-bold rounded-xl sm:rounded-2xl hover:bg-amber-400 transition-all duration-300 shadow-xl shadow-amber-500/25 hover:shadow-2xl hover:shadow-amber-500/40 transform hover:scale-105 active:scale-95 w-full sm:w-auto"
                        >
                            <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 flex-shrink-0" />
                            <span className="sm:hidden font-extrabold tracking-tight">Falar com Especialista</span>
                            <span className="hidden sm:inline whitespace-nowrap">Seja Atendido pela Ipê</span>
                            <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 transition-transform group-hover:translate-x-1 flex-shrink-0" />
                        </Link>
                        
                        {/* Info Extra Mobile */}
                        <p className="mt-4 sm:mt-5 text-[10px] sm:text-xs text-slate-400 flex items-center justify-center gap-1.5 sm:gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Contato disponível via WhatsApp
                        </p>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}
