"use client"

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Search, Home, Building2, MapPin, Phone, Star, Award, Clock, Shield, Users,
    ArrowRight, ChevronDown, Filter, X, AlertCircle, Loader2, TrendingUp, Eye,
    Bed, Bath, Car
} from 'lucide-react'

// Components
import PropertyCardPremium from './PropertyCardPremium'
import HeroStyleCarousel from './HeroStyleCarousel'
import {
    transformToUnifiedPropertyList,
    toPropertyCardPremiumProps,
    type UnifiedPropertyData
} from '@/lib/unified-property-transformer'

// Types
import type { ImovelClient } from '@/src/types/imovel-client'

interface HeroProps {
    imoveisEmAlta?: ImovelClient[]
}

interface SearchErrors {
    query?: string
    priceRange?: string
}

interface SearchState {
    mode: 'venda' | 'aluguel'
    query: string
    propertyType: string
    location: string
    priceRange: string
    bedrooms: string
    bathrooms: string
    vagas: string
    areaMin: string
    features: string
    financing: string
}

interface UiState {
    isMounted: boolean
    isLoaded: boolean
    isSearching: boolean
    showAdvancedSearch: boolean
    showSearchErrors: boolean
    isSearchFocused: boolean
    manualSearchTriggered: boolean // Add flag to prevent auto-search
}

export default function MobileFirstHeroClean({ imoveisEmAlta = [] }: HeroProps) {
    // States
    const [searchState, setSearchState] = useState<SearchState>({
        mode: 'venda',
        query: '',
        propertyType: '',
        location: '',
        priceRange: '',
        bedrooms: '',
        bathrooms: '',
        vagas: '',
        areaMin: '',
        features: '',
        financing: ''
    })

    const [uiState, setUiState] = useState<UiState>({
        isMounted: false,
        isLoaded: false,
        isSearching: false,
        showAdvancedSearch: false,
        showSearchErrors: false,
        isSearchFocused: false,
        manualSearchTriggered: false
    })

    const [searchErrors, setSearchErrors] = useState<SearchErrors>({})
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

    const router = useRouter()

    // Fixed debounced search functionality - removed searchTimeout dependency
    const debouncedSearch = useCallback((params: URLSearchParams) => {
        // Clear previous timeout using current searchTimeout state
        setSearchTimeout(prevTimeout => {
            if (prevTimeout) clearTimeout(prevTimeout)
            return null
        })

        const timeout = setTimeout(() => {
            setUiState(prev => ({ ...prev, isSearching: false }))
            router.push(`/catalogo?${params.toString()}`)
        }, 500)

        setSearchTimeout(timeout)
    }, [router])

    useEffect(() => {
        setUiState(prev => ({ ...prev, isMounted: true, isLoaded: true }))

        // Cleanup function to clear any pending timeout on unmount
        return () => {
            setSearchTimeout(prevTimeout => {
                if (prevTimeout) clearTimeout(prevTimeout)
                return null
            })
        }
    }, []) // Remove searchTimeout dependency

    // Form validation
    const validateSearch = useCallback(() => {
        const errors: SearchErrors = {}

        if (searchState.priceRange && searchState.priceRange.includes('-')) {
            const [min, max] = searchState.priceRange.split('-').map(Number)
            if (min && max && min >= max) {
                errors.priceRange = 'Faixa de preço inválida'
            }
        }

        if (searchState.query && searchState.query.length < 2) {
            errors.query = 'Digite pelo menos 2 caracteres'
        }

        setSearchErrors(errors)
        setUiState(prev => ({ ...prev, showSearchErrors: Object.keys(errors).length > 0 }))

        return Object.keys(errors).length === 0
    }, [searchState])

    const handleSearch = useCallback(() => {
        if (!validateSearch()) return

        // Set manual search flag to true to indicate user initiated search
        setUiState(prev => ({ ...prev, isSearching: true, manualSearchTriggered: true }))

        const params = new URLSearchParams()
        if (searchState.query) params.append('busca', searchState.query)
        if (searchState.propertyType) params.append('tipoImovel', searchState.propertyType)
        if (searchState.location) params.append('cidade', searchState.location)
        if (searchState.priceRange && searchState.priceRange !== '-') {
            const [min, max] = searchState.priceRange.split('-')
            if (min) params.append('precoMin', min)
            if (max) params.append('precoMax', max)
        }
        if (searchState.bedrooms) params.append('dormitorios', searchState.bedrooms)
        if (searchState.bathrooms) params.append('banheiros', searchState.bathrooms)
        if (searchState.vagas) params.append('vagas', searchState.vagas)
        if (searchState.areaMin) params.append('areaMin', searchState.areaMin)
        if (searchState.features) params.append('features', searchState.features)
        if (searchState.financing) params.append('financing', searchState.financing)

        debouncedSearch(params)
    }, [searchState, validateSearch, debouncedSearch])

    const handleQuickCall = useCallback(() => {
        const message = encodeURIComponent('Olá! Tenho interesse em conhecer mais sobre os imóveis disponíveis.')
        window.open(`https://wa.me/5511981845016?text=${message}`, '_blank')

        // Analytics tracking (placeholder)
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'contact_click', {
                event_category: 'engagement',
                event_label: 'whatsapp_hero'
            })
        }
    }, [])

    const updateSearchField = useCallback((field: keyof typeof searchState, value: string) => {
        setSearchState(prev => ({ ...prev, [field]: value }))
        setSearchErrors({}) // Clear errors when user types
        setUiState(prev => ({ ...prev, showSearchErrors: false }))
    }, [])

    const toggleAdvancedSearch = useCallback(() => {
        setUiState(prev => ({ ...prev, showAdvancedSearch: !prev.showAdvancedSearch }))
    }, [])

    const clearSearch = useCallback(() => {
        setSearchState({
            mode: searchState.mode,
            query: '',
            propertyType: '',
            location: '',
            priceRange: '',
            bedrooms: '',
            bathrooms: '',
            vagas: '',
            areaMin: '',
            features: '',
            financing: ''
        })
        setSearchErrors({})
        setUiState(prev => ({ ...prev, showSearchErrors: false, showAdvancedSearch: false }))
    }, [searchState.mode])

    // Data
    const trustMetrics = useMemo(() => [
        {
            icon: Clock,
            number: "15+",
            text: "Anos no mercado",
            subtitle: "Experiência consolidada",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: Shield,
            number: "100%",
            text: "Transações seguras",
            subtitle: "Suporte jurídico completo",
            color: "from-green-500 to-green-600"
        },
        {
            icon: Award,
            number: "500+",
            text: "Negócios fechados",
            subtitle: "Histórico de sucesso",
            color: "from-amber-500 to-amber-600"
        },
        {
            icon: Users,
            number: "1000+",
            text: "Famílias atendidas",
            subtitle: "Confiança comprovada",
            color: "from-purple-500 to-purple-600"
        }
    ], [])

    const propertyOptions = useMemo(() => [
        { value: '', label: 'Que tipo de imóvel procura?', icon: Home },
        { value: 'Casa', label: 'Casa', icon: Home },
        { value: 'Apartamento', label: 'Apartamento', icon: Building2 },
        { value: 'Terreno', label: 'Terreno', icon: MapPin },
        { value: 'Comercial', label: 'Comercial', icon: Building2 },
        { value: 'Outro', label: 'Outros tipos', icon: Building2 }
    ], [])

    // Opções estratégicas para campos principais baseadas no mode
    const primaryFieldOptions = useMemo(() => {
        if (searchState.mode === 'venda') {
            return {
                priceRanges: [
                    { min: '', max: '', label: 'Qual sua faixa de preço?' },
                    { min: '0', max: '200000', label: 'Até R$ 200 mil' },
                    { min: '200000', max: '350000', label: 'R$ 200 - 350 mil' },
                    { min: '350000', max: '500000', label: 'R$ 350 - 500 mil' },
                    { min: '500000', max: '750000', label: 'R$ 500 - 750 mil' },
                    { min: '750000', max: '1000000', label: 'R$ 750 mil - 1 milhão' },
                    { min: '1000000', max: '2000000', label: 'R$ 1 - 2 milhões' },
                    { min: '2000000', max: '', label: 'Acima de R$ 2 milhões' }
                ],
                bedroomOptions: [
                    { value: '', label: 'Quantos quartos?' },
                    { value: '1', label: '1 quarto' },
                    { value: '2', label: '2 quartos' },
                    { value: '3', label: '3 quartos' },
                    { value: '4', label: '4 quartos' },
                    { value: '5', label: '5+ quartos' }
                ],
                areaOptions: [
                    { value: '', label: 'Área mínima?' },
                    { value: '50', label: '50m² ou mais' },
                    { value: '80', label: '80m² ou mais' },
                    { value: '100', label: '100m² ou mais' },
                    { value: '150', label: '150m² ou mais' },
                    { value: '200', label: '200m² ou mais' },
                    { value: '300', label: '300m² ou mais' }
                ]
            }
        } else {
            return {
                priceRanges: [
                    { min: '', max: '', label: 'Qual valor de aluguel?' },
                    { min: '0', max: '1000', label: 'Até R$ 1.000' },
                    { min: '1000', max: '1500', label: 'R$ 1.000 - 1.500' },
                    { min: '1500', max: '2000', label: 'R$ 1.500 - 2.000' },
                    { min: '2000', max: '3000', label: 'R$ 2.000 - 3.000' },
                    { min: '3000', max: '4000', label: 'R$ 3.000 - 4.000' },
                    { min: '4000', max: '6000', label: 'R$ 4.000 - 6.000' },
                    { min: '6000', max: '', label: 'Acima de R$ 6.000' }
                ],
                bedroomOptions: [
                    { value: '', label: 'Quantos quartos?' },
                    { value: '1', label: '1 quarto (studio/kitnet)' },
                    { value: '2', label: '2 quartos' },
                    { value: '3', label: '3 quartos' },
                    { value: '4', label: '4+ quartos' }
                ],
                areaOptions: [
                    { value: '', label: 'Tamanho preferido?' },
                    { value: '30', label: '30m² ou mais (compacto)' },
                    { value: '50', label: '50m² ou mais (confortável)' },
                    { value: '80', label: '80m² ou mais (espaçoso)' },
                    { value: '100', label: '100m² ou mais (amplo)' },
                    { value: '150', label: '150m² ou mais (família grande)' }
                ]
            }
        }
    }, [searchState.mode])

    const locationOptions = useMemo(() => [
        { value: '', label: 'Em qual cidade?' },
        { value: 'Guararema', label: 'Guararema' },
        { value: 'Mogi das Cruzes', label: 'Mogi das Cruzes' },
        { value: 'Santa Isabel', label: 'Santa Isabel' },
        { value: 'Salesópolis', label: 'Salesópolis' },
        { value: 'Biritiba Mirim', label: 'Biritiba Mirim' }
    ], [])

    const priceRanges = useMemo(() => [
        { min: '', max: '', label: 'Qual sua faixa de preço?' },
        { min: '0', max: '200000', label: 'Até R$ 200 mil' },
        { min: '200000', max: '350000', label: 'R$ 200 - 350 mil' },
        { min: '350000', max: '500000', label: 'R$ 350 - 500 mil' },
        { min: '500000', max: '750000', label: 'R$ 500 - 750 mil' },
        { min: '750000', max: '1000000', label: 'R$ 750 mil - 1 milhão' },
        { min: '1000000', max: '2000000', label: 'R$ 1 - 2 milhões' },
        { min: '2000000', max: '', label: 'Acima de R$ 2 milhões' }
    ], [])

    const copyContent = useMemo(() => ({
        title: searchState.mode === 'venda'
            ? 'Encontre sua casa ideal'
            : 'Descubra o lar perfeito',
        subtitle: searchState.mode === 'venda'
            ? 'Realize o sonho da casa própria com nossa orientação especializada'
            : 'Encontre conforto e praticidade nos melhores imóveis para locação'
    }), [searchState.mode])

    // Loading state
    if (!uiState.isMounted) {
        return (
            <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="relative z-10 flex-1 flex flex-col justify-center px-6 py-20 max-w-7xl mx-auto w-full">
                    <div className="text-center space-y-6">
                        <div className="h-6 bg-amber-200/20 rounded-full w-48 mx-auto animate-pulse" />
                        <div className="h-16 bg-amber-200/20 rounded-2xl w-full max-w-3xl mx-auto animate-pulse" />
                        <div className="h-10 bg-amber-200/20 rounded-xl w-2/3 mx-auto animate-pulse" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <section
            className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-4 sm:pt-8"
            role="banner"
            aria-label="Página inicial da Ipê Imóveis"
        >
            {/* Balanced Background System */}
            <div className="absolute inset-0">
                {/* Base Image Layer - More Visible */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.25]"
                    style={{
                        backgroundImage: `url('/images/hero-drone.jpg')`,
                        backgroundPosition: 'center center',
                        backgroundSize: 'cover',
                        filter: 'contrast(1.1) brightness(0.9)'
                    }}
                />

                {/* Single Smart Overlay - 10% mais sutil */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/65 via-slate-800/55 to-slate-900/70" />

                {/* Subtle Brand Accent */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-950/10 to-transparent" />

                {/* Top Brand Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 shadow-sm" />
            </div>            {/* Main content - Design Premium com Hierarquia Visual Otimizada */}
            <div className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 max-w-7xl mx-auto w-full space-y-6 sm:space-y-8 lg:space-y-12">

                {/* Content Background Enhancer - Subtle */}
                <div className="absolute inset-0 bg-gradient-radial from-slate-900/20 via-transparent to-transparent opacity-60 pointer-events-none" />

                {/* Header Section - Espaçamento otimizado */}
                <header className="text-center relative z-10">
                    {/* Professional badge with better contrast */}
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-900/40 backdrop-blur-xl border border-amber-400/30 rounded-full text-white text-sm font-medium mb-3 sm:mb-4 shadow-2xl hover:bg-slate-800/50 hover:border-amber-300/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                        <Award className="w-4 h-4 text-amber-400" aria-hidden="true" />
                        <span className="font-semibold text-slate-100">Ipê Imóveis - 15 anos em Guararema</span>
                        <Star className="w-4 h-4 text-amber-400" aria-hidden="true" />
                    </div>

                    {/* Main title with beautiful gradient */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-white mb-3 sm:mb-4 leading-tight tracking-tight" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.9)' }}>
                        <span className="block text-white">Encontre seu</span>
                        <span className="block font-semibold bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-400 bg-clip-text text-transparent" style={{ textShadow: '0 0 8px rgba(251, 146, 60, 0.3)' }}>
                            lar ideal
                        </span>
                        <span className="block text-xl sm:text-2xl lg:text-3xl xl:text-4xl mt-1 text-slate-100 font-light">
                            em Guararema
                        </span>
                    </h1>

                    <p className="text-base sm:text-lg lg:text-xl text-slate-400 mb-4 sm:mb-6 font-light max-w-3xl mx-auto leading-relaxed" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}>
                        Corretores locais com experiência no mercado imobiliário de Guararema e região
                    </p>

                    {/* CTAs - Cleaner sem stats */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={handleQuickCall}
                            className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-4 shadow-lg hover:shadow-xl hover:shadow-amber-500/25 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900 transform hover:scale-105"
                            aria-label="Entrar em contato via WhatsApp"
                        >
                            <Phone className="w-5 h-5" aria-hidden="true" />
                            <span>Falar no WhatsApp</span>
                        </button>

                        <Link
                            href="/catalogo"
                            className="w-full sm:w-auto bg-slate-900/60 backdrop-blur-xl border border-amber-400/40 text-white px-8 py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-3 hover:bg-slate-800/60 hover:border-amber-300 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                            aria-label="Ver catálogo de imóveis"
                        >
                            <span>Ver Catálogo</span>
                            <ArrowRight className="w-5 h-5" aria-hidden="true" />
                        </Link>
                    </div>
                </header>

                {/* Featured Properties - Primeira posição com design aprimorado */}
                <div className="mb-6 sm:mb-8 relative z-10">
                    <div className="max-w-6xl mx-auto">
                        {/* Header Premium */}
                        <div className="text-center mb-6 sm:mb-8">
                            <div className="inline-flex items-center gap-3 sm:gap-4 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-amber-400/40 px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-white shadow-2xl hover:shadow-amber-500/10 transition-all duration-300">
                                <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg shadow-lg">
                                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" aria-hidden="true" />
                                </div>
                                <div className="text-left">
                                    <span className="block text-base sm:text-lg font-bold text-white">
                                        Imóveis em Destaque
                                    </span>
                                    <span className="block text-sm text-amber-200">
                                        {imoveisEmAlta.length > 0
                                            ? `Confira propriedades selecionadas`
                                            : 'Novidades em breve'
                                        }
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                        {imoveisEmAlta.length > 0 ? imoveisEmAlta.length : 'NOVO'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Properties Carousel - Cards originais do hero com carrossel sutil */}
                        <div className="transition-all duration-500">
                            {imoveisEmAlta.length > 0 ? (
                                <HeroStyleCarousel
                                    title=""
                                    subtitle=""
                                    className="py-0 bg-transparent" // Background transparente
                                    itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
                                >
                                    {imoveisEmAlta.map((imovel, index) => {
                                        // Garantir que slug seja sempre uma string
                                        const slugString = typeof imovel.slug === 'object' && imovel.slug && 'current' in imovel.slug
                                            ? (imovel.slug as any).current
                                            : typeof imovel.slug === 'string'
                                                ? imovel.slug
                                                : `imovel-${index}`

                                        const propertyUrl = `/imovel/${slugString}`

                                        // Melhor tratamento de imagens com múltiplos fallbacks
                                        const getImageUrl = () => {
                                            // Tentar múltiplas fontes de imagem
                                            if (imovel.galeria && imovel.galeria.length > 0 && imovel.galeria[0]?.imagemUrl) {
                                                return imovel.galeria[0].imagemUrl
                                            }
                                            if (imovel.imagem?.imagemUrl) {
                                                return imovel.imagem.imagemUrl
                                            }
                                            // Fallback para placeholder
                                            return '/images/placeholder-property.jpg'
                                        }

                                        return (
                                            <Link
                                                key={imovel.id || index}
                                                href={propertyUrl}
                                                className="group"
                                                aria-label={`Ver detalhes do imóvel ${imovel.titulo}`}
                                            >
                                                <div className="relative bg-gradient-to-br from-slate-900/70 to-slate-800/70 backdrop-blur-xl border border-slate-600/30 rounded-xl overflow-hidden hover:border-amber-400/50 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-amber-500/5 cursor-pointer">
                                                    {/* Imagem Compacta */}
                                                    <div className="aspect-[4/3] relative overflow-hidden">
                                                        <img
                                                            src={getImageUrl()}
                                                            alt={imovel.titulo || 'Imóvel em destaque'}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                            onError={(e) => {
                                                                // Fallback em caso de erro
                                                                const target = e.target as HTMLImageElement
                                                                target.src = '/images/placeholder-property.jpg'
                                                            }}
                                                            loading="lazy"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>

                                                        {/* Badge de Preço Compacto */}
                                                        <div className="absolute top-2 left-2">
                                                            <div className="bg-gradient-to-r from-amber-500/90 to-amber-600/90 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg border border-amber-300/20">
                                                                {imovel.preco
                                                                    ? `R$ ${imovel.preco.toLocaleString('pt-BR')}`
                                                                    : 'Consulte-nos'
                                                                }
                                                            </div>
                                                        </div>

                                                        {/* Badge "EM ALTA" se aplicável */}
                                                        {imovel.emAlta && (
                                                            <div className="absolute top-2 right-2">
                                                                <div className="bg-gradient-to-r from-red-500/90 to-orange-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg border border-red-300/20 flex items-center gap-1">
                                                                    <TrendingUp className="w-3 h-3" />
                                                                    EM ALTA
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Informações Compactas */}
                                                    <div className="p-3">
                                                        <h3 className="text-white font-bold text-sm mb-2 line-clamp-1 leading-tight">
                                                            {imovel.titulo || 'Imóvel em Destaque'}
                                                        </h3>

                                                        <div className="flex items-center gap-1 text-slate-300 text-xs mb-3">
                                                            <MapPin className="w-3 h-3 text-amber-400" />
                                                            <span className="line-clamp-1">
                                                                {imovel.cidade || imovel.bairro || 'Guararema, SP'}
                                                            </span>
                                                        </div>

                                                        {/* Características Compactas com Vagas */}
                                                        <div className="flex items-center justify-between text-xs">
                                                            <div className="flex items-center gap-3 text-slate-400">
                                                                {imovel.areaUtil && (
                                                                    <div className="flex items-center gap-1">
                                                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                                                                        <span className="font-medium">{imovel.areaUtil}m²</span>
                                                                    </div>
                                                                )}
                                                                {imovel.dormitorios && imovel.dormitorios > 0 && (
                                                                    <div className="flex items-center gap-1 text-blue-400">
                                                                        <Bed className="w-3 h-3" />
                                                                        <span className="font-medium">{imovel.dormitorios}</span>
                                                                    </div>
                                                                )}
                                                                {imovel.banheiros && imovel.banheiros > 0 && (
                                                                    <div className="flex items-center gap-1 text-green-400">
                                                                        <Bath className="w-3 h-3" />
                                                                        <span className="font-medium">{imovel.banheiros}</span>
                                                                    </div>
                                                                )}
                                                                {/* Vagas de Garagem */}
                                                                {imovel.vagas && imovel.vagas > 0 && (
                                                                    <div className="flex items-center gap-1 text-purple-400">
                                                                        <Car className="w-3 h-3" />
                                                                        <span className="font-medium">{imovel.vagas}</span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* CTA Menor */}
                                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                                <ArrowRight className="w-3 h-3 text-amber-400" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </HeroStyleCarousel>
                            ) : (
                                <div className="text-center py-8 sm:py-12">
                                    <div className="bg-gradient-to-br from-slate-900/60 to-slate-800/60 backdrop-blur-xl rounded-2xl border border-amber-400/20 p-6 sm:p-8 max-w-md mx-auto shadow-2xl">
                                        <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg w-fit mx-auto mb-4">
                                            <TrendingUp className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-white font-bold text-lg sm:text-xl mb-3">
                                            Novos Destaques em Breve
                                        </h3>
                                        <p className="text-slate-300 text-sm sm:text-base mb-6 leading-relaxed">
                                            Estamos selecionando cuidadosamente os melhores imóveis para você.
                                        </p>
                                        <Link
                                            href="/catalogo"
                                            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Explorar Catálogo
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Compact Glassmorphism Search Box - Truly Expandable */}
                <div className="mb-6 sm:mb-8 relative z-10">
                    <div className={`relative backdrop-blur-3xl bg-slate-900/20 border border-slate-700/40 rounded-3xl shadow-2xl max-w-4xl mx-auto transition-all duration-700 ease-out overflow-hidden ${uiState.isSearchFocused || uiState.showAdvancedSearch || searchState.query || searchState.propertyType || searchState.location
                        ? 'p-6 sm:p-8 bg-slate-900/30 border-amber-500/30 shadow-amber-500/10 min-h-[200px]'
                        : 'p-3 sm:p-4 hover:bg-slate-900/25 hover:border-slate-600/50 h-[60px] flex items-center'
                        }`}>

                        {/* Enhanced Glassmorphism Effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/10 via-slate-700/5 to-transparent pointer-events-none"></div>
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-500/30 to-transparent"></div>                        <div className={`relative z-10 ${uiState.isSearchFocused || uiState.showAdvancedSearch || searchState.query || searchState.propertyType || searchState.location ? '' : 'w-full'}`}>
                            {/* Compact Header with Toggle - Ultra Compact */}
                            <div className={`transition-all duration-500 ${uiState.isSearchFocused || uiState.showAdvancedSearch || searchState.query || searchState.propertyType || searchState.location
                                ? 'mb-6'
                                : 'mb-0'
                                }`}>
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3">
                                        <div className={`bg-gradient-to-br from-amber-500/80 to-amber-600/80 backdrop-blur-sm rounded-2xl shadow-lg transition-all duration-500 border border-amber-400/20 ${uiState.isSearchFocused || uiState.showAdvancedSearch
                                            ? 'p-3'
                                            : 'p-2'
                                            }`}>
                                            <Search className={`text-white transition-all duration-500 ${uiState.isSearchFocused || uiState.showAdvancedSearch
                                                ? 'w-5 h-5'
                                                : 'w-4 h-4'
                                                }`} aria-hidden="true" />
                                        </div>
                                        <div className={`transition-all duration-500 ${uiState.isSearchFocused || uiState.showAdvancedSearch || searchState.query || searchState.propertyType || searchState.location ? 'opacity-100' : 'opacity-100'}`}>
                                            <h3 className={`font-bold text-white transition-all duration-500 ${uiState.isSearchFocused || uiState.showAdvancedSearch || searchState.query || searchState.propertyType || searchState.location ? 'text-lg' : 'text-base'}`}>
                                                {uiState.isSearchFocused || uiState.showAdvancedSearch || searchState.query || searchState.propertyType || searchState.location ? copyContent.title : 'Buscar Imóveis'}
                                            </h3>
                                            {(uiState.isSearchFocused || uiState.showAdvancedSearch || searchState.query || searchState.propertyType || searchState.location) && (
                                                <p className="text-white/80 text-sm">{copyContent.subtitle}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Clear search button */}
                                        {(searchState.query || searchState.propertyType || searchState.location) && (
                                            <button
                                                onClick={clearSearch}
                                                className="p-2 text-white/70 hover:text-white hover:bg-slate-800/30 backdrop-blur-sm transition-all duration-200 rounded-xl border border-slate-600/30"
                                                aria-label="Limpar busca"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}

                                        {/* Expand/Collapse Toggle */}
                                        <button
                                            onClick={() => setUiState(prev => ({ ...prev, isSearchFocused: !prev.isSearchFocused }))}
                                            className="p-2 text-white/80 hover:text-white hover:bg-slate-800/30 backdrop-blur-sm transition-all duration-200 rounded-xl border border-slate-600/30"
                                            aria-label={uiState.isSearchFocused ? "Reduzir busca" : "Expandir busca"}
                                        >
                                            <div className={`transition-transform duration-300 ${uiState.isSearchFocused ? 'rotate-180' : ''}`}>
                                                <ChevronDown className="w-4 h-4" />
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Mode Toggle - Only when expanded */}
                            {(uiState.isSearchFocused || uiState.showAdvancedSearch || searchState.query || searchState.propertyType || searchState.location) && (
                                <div className="mb-6 animate-in slide-in-from-top-2 duration-500">
                                    <div className="flex items-center justify-center">
                                        <div className="bg-slate-800/40 backdrop-blur-2xl border border-slate-600/40 rounded-2xl p-1 relative overflow-hidden">
                                            <div
                                                className="absolute inset-y-1 bg-gradient-to-r from-amber-500/90 to-amber-600/90 backdrop-blur-sm rounded-xl shadow-lg transition-all duration-300 border border-amber-400/30"
                                                style={{
                                                    left: searchState.mode === 'venda' ? '4px' : '50%',
                                                    width: 'calc(50% - 4px)'
                                                }}
                                            />
                                            <div className="relative flex" role="tablist" aria-label="Modo de busca">
                                                <button
                                                    onClick={() => updateSearchField('mode', 'venda')}
                                                    className={`px-6 py-3 text-sm font-bold rounded-xl transition-all duration-200 relative z-10 min-w-[90px] ${searchState.mode === 'venda'
                                                        ? 'text-white shadow-lg'
                                                        : 'text-slate-300 hover:text-white'
                                                        }`}
                                                    role="tab"
                                                    aria-selected={searchState.mode === 'venda'}
                                                    aria-controls="search-panel"
                                                >
                                                    Comprar
                                                </button>
                                                <button
                                                    onClick={() => updateSearchField('mode', 'aluguel')}
                                                    className={`px-6 py-3 text-sm font-bold rounded-xl transition-all duration-200 relative z-10 min-w-[90px] ${searchState.mode === 'aluguel'
                                                        ? 'text-white shadow-lg'
                                                        : 'text-slate-300 hover:text-white'
                                                        }`}
                                                    role="tab"
                                                    aria-selected={searchState.mode === 'aluguel'}
                                                    aria-controls="search-panel"
                                                >
                                                    Alugar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Search Fields - Only when expanded */}
                            {(uiState.isSearchFocused || uiState.showAdvancedSearch || searchState.query || searchState.propertyType || searchState.location) && (
                                <div
                                    id="search-panel"
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 animate-in slide-in-from-top-2 duration-500"
                                    role="tabpanel"
                                >
                                    {/* Tipo de Imóvel */}
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                            <Home className="h-4 w-4 text-slate-400 group-focus-within:text-amber-400 transition-colors" aria-hidden="true" />
                                        </div>
                                        <select
                                            value={searchState.propertyType}
                                            onChange={(e) => updateSearchField('propertyType', e.target.value)}
                                            onFocus={() => setUiState(prev => ({ ...prev, isSearchFocused: true }))}
                                            onBlur={() => setUiState(prev => ({ ...prev, isSearchFocused: false }))}
                                            className="w-full pl-10 pr-8 py-3 text-sm border-2 border-slate-600/40 rounded-2xl focus:border-amber-400/80 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all duration-300 bg-slate-800/30 backdrop-blur-2xl appearance-none hover:border-slate-500/60 hover:bg-slate-800/40 focus:bg-slate-800/50 font-medium text-white placeholder-slate-400"
                                            aria-label="Selecionar tipo de imóvel"
                                        >
                                            {propertyOptions.map(option => (
                                                <option key={option.value} value={option.value} className="bg-slate-900 text-white">
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-10">
                                            <ChevronDown className="h-4 w-4 text-slate-400 group-focus-within:text-amber-400 transition-colors" aria-hidden="true" />
                                        </div>
                                    </div>

                                    {/* Faixa de Preço */}
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                            <div className="w-4 h-4 text-slate-400 group-focus-within:text-amber-400 transition-colors font-bold text-sm flex items-center justify-center">R$</div>
                                        </div>
                                        <select
                                            value={searchState.priceRange}
                                            onChange={(e) => updateSearchField('priceRange', e.target.value)}
                                            onFocus={() => setUiState(prev => ({ ...prev, isSearchFocused: true }))}
                                            onBlur={() => setUiState(prev => ({ ...prev, isSearchFocused: false }))}
                                            className="w-full pl-10 pr-8 py-3 text-sm border-2 border-slate-600/40 rounded-2xl focus:border-amber-400/80 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all duration-300 bg-slate-800/30 backdrop-blur-2xl appearance-none hover:border-slate-500/60 hover:bg-slate-800/40 focus:bg-slate-800/50 font-medium text-white placeholder-slate-400"
                                            aria-label="Selecionar faixa de preço"
                                        >
                                            {primaryFieldOptions.priceRanges.map(option => (
                                                <option key={`${option.min}-${option.max}`} value={`${option.min}-${option.max}`} className="bg-slate-900 text-white">
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-10">
                                            <ChevronDown className="h-4 w-4 text-slate-400 group-focus-within:text-amber-400 transition-colors" aria-hidden="true" />
                                        </div>
                                    </div>

                                    {/* Dormitórios */}
                                    <div className="sm:col-span-2 lg:col-span-1 relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                            <Bed className="h-4 w-4 text-slate-400 group-focus-within:text-amber-400 transition-colors" aria-hidden="true" />
                                        </div>
                                        <select
                                            value={searchState.bedrooms}
                                            onChange={(e) => updateSearchField('bedrooms', e.target.value)}
                                            onFocus={() => setUiState(prev => ({ ...prev, isSearchFocused: true }))}
                                            onBlur={() => setUiState(prev => ({ ...prev, isSearchFocused: false }))}
                                            className="w-full pl-10 pr-8 py-3 text-sm border-2 border-slate-600/40 rounded-2xl focus:border-amber-400/80 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all duration-300 bg-slate-800/30 backdrop-blur-2xl appearance-none hover:border-slate-500/60 hover:bg-slate-800/40 focus:bg-slate-800/50 font-medium text-white placeholder-slate-400"
                                            aria-label="Selecionar número de quartos"
                                        >
                                            {primaryFieldOptions.bedroomOptions.map(option => (
                                                <option key={option.value} value={option.value} className="bg-slate-900 text-white">
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-10">
                                            <ChevronDown className="h-4 w-4 text-slate-400 group-focus-within:text-amber-400 transition-colors" aria-hidden="true" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Advanced Search Toggle - Only when expanded */}
                            {(uiState.isSearchFocused || uiState.showAdvancedSearch || searchState.query || searchState.propertyType || searchState.location) && (
                                <div className="mb-4 animate-in slide-in-from-top-2 duration-500">
                                    <button
                                        onClick={toggleAdvancedSearch}
                                        className="flex items-center gap-2 text-slate-300 hover:text-white transition-all duration-200 text-sm font-medium focus:outline-none focus:text-amber-400 bg-slate-800/20 backdrop-blur-sm border border-slate-600/30 px-4 py-2 rounded-xl hover:bg-slate-800/30 hover:border-slate-500/40"
                                        aria-expanded={uiState.showAdvancedSearch}
                                        aria-controls="advanced-search"
                                    >
                                        <Filter className="w-4 h-4" aria-hidden="true" />
                                        <span>Filtros Avançados</span>
                                        <div className={`transition-transform duration-200 ${uiState.showAdvancedSearch ? 'rotate-180' : ''}`}>
                                            <ChevronDown className="w-4 h-4" aria-hidden="true" />
                                        </div>
                                    </button>
                                </div>
                            )}                            {/* Advanced Search Fields - Glassmorphism S-tier */}
                            {uiState.showAdvancedSearch && (
                                <div
                                    id="advanced-search"
                                    className="mb-3 transition-all duration-300"
                                >
                                    <div className="bg-white/5 backdrop-blur-xl rounded-lg p-4 space-y-4 border border-white/10">

                                        {/* Primeira linha - Busca por texto e localização */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {/* Search Input with validation */}
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Search className="h-4 w-4 text-white/60" aria-hidden="true" />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Buscar por endereço, bairro..."
                                                    value={searchState.query}
                                                    onChange={(e) => updateSearchField('query', e.target.value)}
                                                    onFocus={() => setUiState(prev => ({ ...prev, isSearchFocused: true }))}
                                                    onBlur={() => setUiState(prev => ({ ...prev, isSearchFocused: false }))}
                                                    className={`w-full pl-10 pr-4 py-3 text-sm border-2 rounded-lg focus:ring-2 focus:ring-amber-500/20 outline-none transition-all duration-300 bg-white/10 backdrop-blur-xl text-white placeholder-white/60 ${searchErrors.query
                                                        ? 'border-red-400/60 focus:border-red-400'
                                                        : 'border-white/20 focus:border-amber-400/80 hover:border-white/30'
                                                        }`}
                                                    aria-label="Campo de busca de imóveis"
                                                    aria-invalid={!!searchErrors.query}
                                                    aria-describedby={searchErrors.query ? 'search-error-advanced' : undefined}
                                                />
                                                {searchErrors.query && (
                                                    <div id="search-error-advanced" className="absolute -bottom-5 left-0 text-xs text-red-400 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        {searchErrors.query}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Location Select */}
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <MapPin className="h-4 w-4 text-white/60" aria-hidden="true" />
                                                </div>
                                                <select
                                                    value={searchState.location}
                                                    onChange={(e) => updateSearchField('location', e.target.value)}
                                                    className="w-full pl-10 pr-8 py-3 text-sm border-2 border-white/20 rounded-lg focus:border-amber-400/80 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all duration-300 bg-white/10 backdrop-blur-xl appearance-none hover:border-white/30 text-white"
                                                    aria-label="Selecionar cidade"
                                                >
                                                    {locationOptions.map(option => (
                                                        <option key={option.value} value={option.value} className="bg-slate-800 text-white">
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <ChevronDown className="h-4 w-4 text-white/60" aria-hidden="true" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Segunda linha - Filtros complementares */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            <select
                                                value={searchState.areaMin}
                                                onChange={(e) => updateSearchField('areaMin', e.target.value)}
                                                className="px-3 py-2 text-sm border border-white/20 rounded-lg focus:border-amber-400/80 focus:ring-1 focus:ring-amber-500/20 outline-none bg-white/10 backdrop-blur-xl transition-all duration-200 text-white appearance-none hover:border-white/30"
                                                aria-label="Área mínima"
                                            >
                                                {primaryFieldOptions.areaOptions.map(option => (
                                                    <option key={option.value} value={option.value} className="bg-slate-800 text-white">
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>

                                            <select
                                                value={searchState.bathrooms}
                                                onChange={(e) => updateSearchField('bathrooms', e.target.value)}
                                                className="px-3 py-2 text-sm border border-white/20 rounded-lg focus:border-amber-400/80 focus:ring-1 focus:ring-amber-500/20 outline-none bg-white/10 backdrop-blur-xl transition-all duration-200 text-white appearance-none hover:border-white/30"
                                                aria-label="Número de banheiros"
                                            >
                                                <option value="" className="bg-slate-800 text-white">Banheiros</option>
                                                <option value="1" className="bg-slate-800 text-white">1 banheiro</option>
                                                <option value="2" className="bg-slate-800 text-white">2 banheiros</option>
                                                <option value="3" className="bg-slate-800 text-white">3 banheiros</option>
                                                <option value="4" className="bg-slate-800 text-white">4+ banheiros</option>
                                            </select>

                                            <select
                                                value={searchState.vagas}
                                                onChange={(e) => updateSearchField('vagas', e.target.value)}
                                                className="px-3 py-2 text-sm border border-white/20 rounded-lg focus:border-amber-400/80 focus:ring-1 focus:ring-amber-500/20 outline-none bg-white/10 backdrop-blur-xl transition-all duration-200 text-white appearance-none hover:border-white/30"
                                                aria-label="Número de vagas"
                                            >
                                                <option value="" className="bg-slate-800 text-white">Vagas</option>
                                                <option value="1" className="bg-slate-800 text-white">1 vaga</option>
                                                <option value="2" className="bg-slate-800 text-white">2 vagas</option>
                                                <option value="3" className="bg-slate-800 text-white">3 vagas</option>
                                                <option value="4" className="bg-slate-800 text-white">4+ vagas</option>
                                            </select>

                                            <select
                                                value={searchState.features}
                                                onChange={(e) => updateSearchField('features', e.target.value)}
                                                className="px-3 py-2 text-sm border border-white/20 rounded-lg focus:border-amber-400/80 focus:ring-1 focus:ring-amber-500/20 outline-none bg-white/10 backdrop-blur-xl transition-all duration-200 text-white appearance-none hover:border-white/30"
                                                aria-label="Características especiais"
                                            >
                                                <option value="" className="bg-slate-800 text-white">Extras</option>
                                                <option value="possuiPiscina" className="bg-slate-800 text-white">Com piscina</option>
                                                <option value="possuiJardim" className="bg-slate-800 text-white">Com jardim</option>
                                                <option value="destaque" className="bg-slate-800 text-white">Destaque</option>
                                                <option value="emAlta" className="bg-slate-800 text-white">Em alta</option>
                                            </select>
                                        </div>

                                        {/* Financiamento (apenas para venda) */}
                                        {searchState.mode === 'venda' && (
                                            <div className="grid grid-cols-1 gap-3">
                                                <select
                                                    value={searchState.financing}
                                                    onChange={(e) => updateSearchField('financing', e.target.value)}
                                                    className="px-3 py-2 text-sm border border-white/20 rounded-lg focus:border-amber-400/80 focus:ring-1 focus:ring-amber-500/20 outline-none bg-white/10 backdrop-blur-xl transition-all duration-200 text-white appearance-none hover:border-white/30"
                                                    aria-label="Aceita financiamento"
                                                >
                                                    <option value="" className="bg-slate-800 text-white">Financiamento</option>
                                                    <option value="aceitaFinanciamento" className="bg-slate-800 text-white">Aceita financiamento</option>
                                                    <option value="documentacaoOk" className="bg-slate-800 text-white">Documentação em dia</option>
                                                </select>
                                            </div>
                                        )}

                                        {/* Mensagem explicativa glassmorphism */}
                                        <div className="bg-amber-500/10 backdrop-blur-sm border border-amber-400/20 rounded-lg p-3">
                                            <p className="text-sm text-amber-200 flex items-center gap-2">
                                                <Award className="w-4 h-4" />
                                                <span>
                                                    {searchState.mode === 'venda'
                                                        ? 'Use os filtros para refinar sua busca!'
                                                        : 'Encontre o imóvel ideal para alugar!'
                                                    }
                                                </span>
                                            </p>
                                        </div>

                                        {/* Price range error */}
                                        {searchErrors.priceRange && (
                                            <div className="text-sm text-red-400 flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4" />
                                                {searchErrors.priceRange}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Search Button - Only when expanded */}
                            {(uiState.isSearchFocused || uiState.showAdvancedSearch || searchState.query || searchState.propertyType || searchState.location) && (
                                <button
                                    onClick={handleSearch}
                                    disabled={uiState.isSearching}
                                    className="w-full bg-gradient-to-r from-amber-500/80 to-amber-600/80 hover:from-amber-600/90 hover:to-amber-700/90 disabled:from-amber-400/60 disabled:to-amber-500/60 disabled:opacity-70 text-white px-6 py-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-2xl hover:shadow-2xl hover:shadow-amber-500/25 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-transparent transform hover:scale-105 active:scale-95 backdrop-blur-2xl border border-amber-400/30 animate-in slide-in-from-top-2"
                                    aria-label={uiState.isSearching ? "Buscando imóveis..." : "Buscar imóveis"}
                                >
                                    {uiState.isSearching ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                                            <span>Buscando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Search className="w-5 h-5" aria-hidden="true" />
                                            <span>Buscar Imóveis</span>
                                            <ArrowRight className="w-5 h-5" aria-hidden="true" />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navegação por Categorias - Premium com Imagens Reais */}
                <div className="mt-8 sm:mt-12 mb-6 sm:mb-8">
                    <div className="max-w-5xl mx-auto">
                        {/* Header da Navegação */}
                        <div className="text-center mb-6 sm:mb-8">
                            <h3 className="text-white text-xl sm:text-2xl font-bold mb-3">
                                Explore por Categoria
                            </h3>
                            <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto">
                                Encontre o imóvel para você entre nossas principais categorias
                            </p>
                        </div>

                        {/* Cards de Navegação com Imagens Reais - Otimizado para Mobile */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
                            {/* Card Casas */}
                            <Link
                                href="/catalogo?tipo=casa"
                                className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-600/30 hover:border-blue-400/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                                aria-label="Ver casas disponíveis"
                            >
                                <div className="aspect-[4/3] sm:aspect-[4/3] relative overflow-hidden">
                                    <img
                                        src="/images/imagensHero/casasHero.webp"
                                        alt="Casas Residenciais"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-800/40 to-transparent"></div>

                                    {/* Overlay de Hover */}
                                    <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                        <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg backdrop-blur-sm">
                                            <Home className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-sm sm:text-lg group-hover:text-blue-100 transition-colors">
                                                Casas
                                            </h4>
                                            <p className="text-slate-300 text-xs sm:text-sm group-hover:text-blue-200 transition-colors">
                                                Residenciais completas
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            {/* Card Sítios */}
                            <Link
                                href="/catalogo?tipo=sitio"
                                className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-600/30 hover:border-green-400/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                                aria-label="Ver sítios e chácaras disponíveis"
                            >
                                <div className="aspect-[4/3] sm:aspect-[4/3] relative overflow-hidden">
                                    <img
                                        src="/images/imagensHero/sitiosHero.webp"
                                        alt="Sítios e Chácaras"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-800/40 to-transparent"></div>

                                    {/* Overlay de Hover */}
                                    <div className="absolute inset-0 bg-green-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                        <div className="p-1.5 sm:p-2 bg-green-500/20 rounded-lg backdrop-blur-sm">
                                            <Building2 className="w-4 h-4 sm:w-6 sm:h-6 text-green-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-sm sm:text-lg group-hover:text-green-100 transition-colors">
                                                Sítios
                                            </h4>
                                            <p className="text-slate-300 text-xs sm:text-sm group-hover:text-green-200 transition-colors">
                                                Propriedades rurais
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            {/* Card Terrenos - Coluna inteira em mobile */}
                            <Link
                                href="/catalogo?tipo=terreno"
                                className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-600/30 hover:border-amber-400/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900 col-span-2 sm:col-span-1"
                                aria-label="Ver terrenos disponíveis"
                            >
                                <div className="aspect-[4/3] sm:aspect-[4/3] relative overflow-hidden">
                                    <img
                                        src="/images/imagensHero/terrenosHero.webp"
                                        alt="Terrenos para Construção"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-800/40 to-transparent"></div>

                                    {/* Overlay de Hover */}
                                    <div className="absolute inset-0 bg-amber-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                        <div className="p-1.5 sm:p-2 bg-amber-500/20 rounded-lg backdrop-blur-sm">
                                            <MapPin className="w-4 h-4 sm:w-6 sm:h-6 text-amber-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-sm sm:text-lg group-hover:text-amber-100 transition-colors">
                                                Terrenos
                                            </h4>
                                            <p className="text-slate-300 text-xs sm:text-sm group-hover:text-amber-200 transition-colors">
                                                Lotes para construir
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Call to Action Premium */}
                        <div className="text-center mt-6 sm:mt-8">
                            <div className="inline-flex items-center gap-2 bg-slate-900/60 backdrop-blur-xl border border-amber-400/20 rounded-xl px-4 py-2">
                                <span className="text-slate-300 text-sm">Não encontrou o que procura?</span>
                                <Link
                                    href="/catalogo"
                                    className="text-amber-400 hover:text-amber-300 font-semibold transition-colors text-sm inline-flex items-center gap-1"
                                >
                                    Ver todos os imóveis
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Custom styles for S-tier UX */}
            <style jsx>{`
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .bg-gradient-radial {
                    background: radial-gradient(circle at center, var(--tw-gradient-stops));
                }

                /* Enhanced Performance optimizations */
                * {
                    backface-visibility: hidden;
                    transform: translateZ(0);
                }

                /* Smooth text rendering */
                h1, h2, h3, p {
                    text-rendering: optimizeLegibility;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }

                /* Enhanced backdrop blur support */
                @supports (backdrop-filter: blur(20px)) {
                    .backdrop-blur-2xl {
                        backdrop-filter: blur(20px) saturate(150%);
                    }
                }

                /* Fallback for older browsers */
                @supports not (backdrop-filter: blur(20px)) {
                    .backdrop-blur-2xl {
                        background-color: rgba(15, 23, 42, 0.8) !important;
                    }
                }

                /* Custom gradient shadows */
                .shadow-amber-glow {
                    box-shadow: 
                        0 4px 20px rgba(251, 191, 36, 0.15),
                        0 1px 3px rgba(0, 0, 0, 0.1);
                }

                /* Refined image overlay techniques */
                .hero-bg-overlay {
                    background: 
                        linear-gradient(135deg, rgba(2, 6, 23, 0.95) 0%, rgba(15, 23, 42, 0.92) 25%, rgba(30, 41, 59, 0.90) 75%, rgba(51, 65, 85, 0.88) 100%),
                        radial-gradient(circle at 25% 75%, rgba(251, 191, 36, 0.08) 0%, transparent 50%),
                        radial-gradient(circle at 75% 25%, rgba(251, 191, 36, 0.05) 0%, transparent 50%);
                }

                /* Reduced motion support */
                @media (prefers-reduced-motion: reduce) {
                    .animate-bounce,
                    .animate-pulse {
                        animation: none !important;
                    }
                    
                    * {
                        transition-duration: 0.01ms !important;
                    }
                }

                /* Enhanced mobile optimization */
                @media (max-width: 640px) {
                    .backdrop-blur-2xl {
                        backdrop-filter: blur(16px) saturate(130%);
                    }
                }

                /* High contrast mode support */
                @media (prefers-contrast: high) {
                    .bg-slate-900\\/50 {
                        background-color: rgba(15, 23, 42, 0.9) !important;
                    }
                }
            `}</style>
        </section>
    )
}
