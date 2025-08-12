'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, MapPin, Home, Building2, Star, Award, Users, ChevronDown } from 'lucide-react'
import { motion, useAnimation } from 'framer-motion'

export default function LuxuryHero() {
    const [searchQuery, setSearchQuery] = useState('')
    const [propertyType, setPropertyType] = useState('')
    const [location, setLocation] = useState('')
    const [isLoaded, setIsLoaded] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const heroRef = useRef<HTMLElement>(null)

    // Verifica se é mobile e ajusta o layout
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)

            // Ajusta altura do hero em telas menores para evitar overflow
            if (heroRef.current) {
                const minHeight = window.innerHeight * (window.innerWidth < 640 ? 0.9 : 1)
                heroRef.current.style.minHeight = `${minHeight}px`
                heroRef.current.style.height = window.innerWidth < 640 ? 'auto' : '100vh'
            }
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Adiciona efeito de entrada suave
    useEffect(() => {
        setIsLoaded(true)

        // Adiciona a animação "breathe" ao CSS global
        const style = document.createElement('style')
        style.innerHTML = `
            @keyframes breathe {
                0%, 100% {
                    opacity: 0.1;
                    transform: scale(1);
                }
                50% {
                    opacity: 0.3;
                    transform: scale(1.05);
                }
            }
            
            @keyframes shine {
                to {
                    background-position: -200% center;
                }
            }
              @media (max-width: 640px) {
                .responsive-padding {
                    padding-top: 6rem !important;
                    padding-bottom: 5rem !important;
                }
                
                .mobile-search-row {
                    margin-bottom: 0.75rem !important;
                }
            }
        `
        document.head.appendChild(style)

        // Adiciona manipulador de efeito parallax no scroll
        const handleScroll = () => {
            // Desabilita parallax em dispositivos móveis para melhorar performance
            if (window.innerWidth < 768) return;

            const scrolled = window.scrollY;
            const parallaxElements = document.querySelectorAll('[data-parallax]');

            parallaxElements.forEach(element => {
                const speedAttr = element.getAttribute('data-parallax');
                const speed = speedAttr ? parseFloat(speedAttr) : 0.3;
                const yPos = -(scrolled * speed);

                // Verificação para garantir que element.style não seja undefined
                if (element instanceof HTMLElement) {
                    element.style.transform = `translateY(${yPos}px)`;
                }
            });
        };

        // Adiciona listener de scroll
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            document.head.removeChild(style);
            window.removeEventListener('scroll', handleScroll);
        }
    }, [])

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.append('q', searchQuery);
        if (propertyType) params.append('tipo', propertyType); if (location) params.append('local', location);

        window.location.href = `/catalogo?${params.toString()}`;
    }

    return (
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden responsive-padding py-16 sm:py-0 pt-20 sm:pt-24">
            {/* Background with subtle gradient */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear"
                style={{
                    backgroundImage: `url('/images/hero-bg.jpg')`,
                    backgroundPosition: isMobile ? 'center center' : 'center'
                }}
            >
                {/* Camada de gradiente com profundidade visual */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(251,191,36,0.05),_rgba(15,23,42,0.7)_70%)]" />

                {/* Camada de gradiente vertical com transição suave */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-slate-900/60 to-black/75" />
            </div>

            {/* Elementos flutuantes com design refinado - ocultos em mobile para melhor performance */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
                {/* Camada de partículas mais sutil */}
                <div className="absolute h-full w-full opacity-15"
                    style={{
                        backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.12) 0%, transparent 5%)',
                        backgroundSize: '20px 20px'
                    }} />

                {/* Glow spots com efeito parallax mais sutil */}
                <div
                    className="absolute top-1/4 left-1/6 w-56 h-56 bg-amber-500/5 rounded-full blur-[85px]"
                    data-parallax="0.3"
                    style={{ animation: 'breathe 8s ease-in-out infinite alternate' }} />

                <div
                    className="absolute -bottom-10 right-20 w-72 h-72 bg-amber-400/4 rounded-full blur-[120px]"
                    data-parallax="0.4"
                    style={{ animation: 'breathe 12s ease-in-out infinite alternate-reverse', animationDelay: '3s' }} />
            </div>            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center text-white max-w-5xl">
                {/* Headline com animações mais sutis */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isLoaded ? 1 : 0 }}
                    transition={{ duration: 1 }}
                    className="mb-8 sm:mb-12"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                    >
                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light mb-4 sm:mb-6 tracking-tight leading-tight">
                            Imóveis em
                            <span className="block font-normal mt-1 sm:mt-2 relative z-10">
                                <span className="relative">
                                    {/* Gradiente simplificado */}
                                    <span
                                        className="relative z-10 inline-block"
                                        style={{
                                            background: "linear-gradient(to right, #fbbf24 20%, #f59e0b 80%)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent"
                                        }}
                                    >
                                        Guararema
                                    </span>
                                </span>
                            </span>
                        </h1>
                    </motion.div>

                    <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-5 font-light text-white/90 max-w-3xl mx-auto leading-relaxed">
                        Experiência de 15 anos no mercado imobiliário da região
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-6 text-xs sm:text-sm text-white/80 font-light max-w-2xl mx-auto">
                        <span className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full inline-block mr-2 opacity-80"></span>
                            Consultoria especializada
                        </span>
                        <span className="hidden sm:inline-block text-white/40">|</span>
                        <span className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full inline-block mr-2 opacity-80"></span>
                            Imóveis selecionados
                        </span>
                        <span className="hidden sm:inline-block text-white/40">|</span>
                        <span className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full inline-block mr-2 opacity-80"></span>
                            Atendimento personalizado
                        </span>
                    </div>
                </motion.div>

                {/* Caixa de busca com design simplificado e melhor responsividade */}
                <div className="relative mb-8 sm:mb-14">
                    {/* Container externo */}
                    <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-7 
                                  border border-white/10 w-full max-w-4xl mx-auto
                                  relative overflow-hidden">
                        {/* Container de conteúdo */}
                        <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-2xl p-4 sm:p-6 border border-white/40 shadow-sm relative">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                                {/* Search Input */}
                                <div className="relative group mobile-search-row">
                                    <label className="absolute text-xs text-neutral-500 font-medium -top-2 left-3 px-1 bg-white z-10">
                                        Busca
                                    </label>
                                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none">
                                        <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-400 group-focus-within:text-amber-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Nome, características..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border border-neutral-200 
                                               focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 
                                               outline-none text-neutral-700 text-sm sm:text-base font-light
                                               transition-all duration-200 hover:border-neutral-300 bg-white/80"
                                    />
                                </div>

                                {/* Property Type */}
                                <div className="relative group mobile-search-row">
                                    <label className="absolute text-xs text-neutral-500 font-medium -top-2 left-3 px-1 bg-white z-10">
                                        Tipo
                                    </label>
                                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none">
                                        <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-400 group-focus-within:text-amber-500 transition-colors" />
                                    </div>
                                    <select
                                        value={propertyType}
                                        onChange={(e) => setPropertyType(e.target.value)}
                                        className="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-3 sm:py-4 rounded-lg sm:rounded-xl border border-neutral-200 
                                               focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 
                                               outline-none text-neutral-700 text-sm sm:text-base font-light
                                               transition-all duration-200 hover:border-neutral-300
                                               bg-white/80 appearance-none cursor-pointer"
                                    >
                                        <option value="">Tipo de imóvel</option>
                                        <option value="casa">Casa</option>
                                        <option value="apartamento">Apartamento</option>
                                        <option value="terreno">Terreno</option>
                                        <option value="chacara">Chácara</option>
                                        <option value="comercial">Comercial</option>
                                    </select>
                                </div>

                                {/* Location */}
                                <div className="relative group">
                                    <label className="absolute text-xs text-neutral-500 font-medium -top-2 left-3 px-1 bg-white z-10">
                                        Região
                                    </label>
                                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none">
                                        <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-400 group-focus-within:text-amber-500 transition-colors" />
                                    </div>
                                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <select
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-3 sm:py-4 rounded-lg sm:rounded-xl border border-neutral-200 
                                               focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 
                                               outline-none text-neutral-700 text-sm sm:text-base font-light
                                               transition-all duration-200 hover:border-neutral-300
                                               bg-white/80 appearance-none cursor-pointer"
                                    >
                                        <option value="">Escolha a região</option>
                                        <option value="centro">Centro</option>
                                        <option value="tanque">Bairro do Tanque</option>
                                        <option value="ponte-alta">Ponte Alta</option>
                                        <option value="itapema">Itapema</option>
                                        <option value="rural">Zona Rural</option>
                                    </select>
                                </div>
                            </div>

                            {/* Botão de busca simplificado */}
                            <button
                                onClick={handleSearch}
                                className="group w-full bg-gradient-to-r from-amber-500 to-amber-600 
                                         hover:from-amber-600 hover:to-amber-700 text-white font-medium 
                                         py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-300 
                                         flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                            >
                                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span className="inline-block translate-y-px tracking-wide">Buscar Imóveis</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards - Responsivos */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full max-w-4xl mx-auto"
                >
                    {[
                        {
                            icon: <Award className="w-5 h-5 sm:w-6 sm:h-6" />,
                            value: "15+",
                            label: "Anos no Mercado",
                            description: "Experiência no setor imobiliário",
                            color: "from-amber-300 to-amber-500"
                        },
                        {
                            icon: <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />,
                            value: "250+",
                            label: "Negociações",
                            description: "Transações imobiliárias realizadas",
                            color: "from-amber-300 to-amber-500"
                        },
                        {
                            icon: <Star className="w-5 h-5 sm:w-6 sm:h-6" />,
                            value: "98%",
                            label: "Satisfação",
                            description: "Clientes satisfeitos",
                            color: "from-amber-300 to-amber-500"
                        }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                            transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                            className="group"
                        >
                            <div className="relative overflow-hidden rounded-lg sm:rounded-2xl backdrop-blur-lg border border-white/20">
                                {/* Fundo simplificado */}
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-slate-800/80" />

                                {/* Conteúdo do card */}
                                <div className="relative z-10 p-3 sm:p-4 md:p-6">
                                    <div className="mb-2 sm:mb-3 md:mb-5 flex flex-col items-center">
                                        {/* Ícone simplificado */}
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-500/15 to-amber-600/5 
                                                     flex items-center justify-center mb-2 sm:mb-4">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-800 flex items-center justify-center">
                                                <span className="text-amber-400">
                                                    {stat.icon}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Métricas com gradiente simplificado */}
                                        <div className="text-xl sm:text-2xl md:text-3xl font-medium bg-gradient-to-r bg-clip-text text-transparent mb-0.5 sm:mb-1"
                                            style={{ backgroundImage: `linear-gradient(to right, #fbbf24, #fcd34d)` }}>
                                            {stat.value}
                                        </div>
                                        <div className="text-xs sm:text-sm font-medium text-white/90">{stat.label}</div>
                                        <div className="text-xs text-white/70 mt-0.5 sm:mt-1">{stat.description}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Indicador de scroll simplificado - oculto em telas muito pequenas */}
                <motion.div
                    className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 hidden xs:flex"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: isLoaded ? 0.7 : 0, y: isLoaded ? 0 : -20 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                >
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-white/60 font-light mb-2 tracking-wider">Explore mais</span>
                        <motion.div
                            animate={{
                                y: [0, 8, 0],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 2,
                                ease: "easeInOut" as const
                            }}                        >
                            <ChevronDown className="w-5 h-5 text-white/60" />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
