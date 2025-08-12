"use client"

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Search, Home, Building2, MapPin, Phone, Star, Award, Clock, Shield, Users,
    ArrowRight, ChevronDown, Filter, X, AlertCircle, Loader2, TrendingUp, Eye,
    Bed, Bath
} from 'lucide-react'

// Components
import SimplePropertyCard from './SimplePropertyCard'

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
    isEmAltaExpanded: boolean
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
        isEmAltaExpanded: false
    })

    const [searchErrors, setSearchErrors] = useState<SearchErrors>({})
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

    const router = useRouter()

    // Simplified debounced search functionality
    const debouncedSearch = useCallback((params: URLSearchParams) => {
        if (searchTimeout) clearTimeout(searchTimeout)

        const timeout = setTimeout(() => {
            setUiState(prev => ({ ...prev, isSearching: false }))
            router.push(`/catalogo?${params.toString()}`)
        }, 500)

        setSearchTimeout(timeout)
    }, [router, searchTimeout])

    useEffect(() => {
        setUiState(prev => ({ ...prev, isMounted: true, isLoaded: true }))
        return () => {
            if (searchTimeout) clearTimeout(searchTimeout)
        }
    }, [searchTimeout])

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

        setUiState(prev => ({ ...prev, isSearching: true }))

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

    const toggleEmAlta = useCallback(() => {
        setUiState(prev => ({ ...prev, isEmAltaExpanded: !prev.isEmAltaExpanded }))
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
            className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
            role="banner"
            aria-label="Página inicial da Ipê Imóveis"
        >
            {/* Balanced Background System */}
            <div className="absolute inset-0">
                {/* Base Image Layer - More Visible */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.25]"
                    style={{
                        backgroundImage: `url('/images/hero-bg2.png')`,
                        backgroundPosition: 'center center',
                        backgroundSize: 'cover',
                        filter: 'contrast(1.1) brightness(0.9)'
                    }}
                />

                {/* Single Smart Overlay - Less Aggressive */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/75 via-slate-800/65 to-slate-900/80" />

                {/* Subtle Brand Accent */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-950/10 to-transparent" />

                {/* Top Brand Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 shadow-sm" />
            </div>            {/* Main content - Enhanced Readability */}
            <div className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto w-full">

                {/* Content Background Enhancer - Subtle */}
                <div className="absolute inset-0 bg-gradient-radial from-slate-900/20 via-transparent to-transparent opacity-60 pointer-events-none" />

                {/* Header Section */}
                <header className="text-center mb-8 sm:mb-12 lg:mb-16 relative z-10">
                    {/* Professional badge with better contrast */}
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-900/40 backdrop-blur-xl border border-amber-400/30 rounded-full text-white text-sm font-medium mb-6 sm:mb-8 shadow-2xl hover:bg-slate-800/50 hover:border-amber-300/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                        <Award className="w-4 h-4 text-amber-400" aria-hidden="true" />
                        <span className="font-semibold text-slate-100">Ipê Imóveis - 15 anos em Guararema</span>
                        <Star className="w-4 h-4 text-amber-400" aria-hidden="true" />
                    </div>

                    {/* Main title with beautiful gradient */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-white mb-4 sm:mb-6 leading-tight tracking-tight" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.9)' }}>
                        <span className="block text-white">Encontre seu</span>
                        <span className="block font-semibold bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-400 bg-clip-text text-transparent" style={{ textShadow: '0 0 8px rgba(251, 146, 60, 0.3)' }}>
                            lar ideal
                        </span>
                        <span className="block text-xl sm:text-2xl lg:text-3xl xl:text-4xl mt-2 text-slate-100 font-light">
                            em Guararema
                        </span>
                    </h1>

                    <p className="text-base sm:text-lg lg:text-xl text-slate-400 mb-6 sm:mb-8 font-light max-w-3xl mx-auto leading-relaxed" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}>
                        Corretores locais com conhecimento e experiência no mercado imobiliário de Guararema e região
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12">
                        <button
                            onClick={handleQuickCall}
                            className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 lg:px-8 lg:py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/25 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                            aria-label="Entrar em contato via WhatsApp"
                        >
                            <Phone className="w-5 h-5" aria-hidden="true" />
                            <span>Falar no WhatsApp</span>
                        </button>

                        <Link
                            href="/catalogo"
                            className="w-full sm:w-auto bg-slate-900/60 backdrop-blur-xl border border-amber-400/40 text-white px-6 py-3 lg:px-8 lg:py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 hover:bg-slate-800/60 hover:border-amber-300 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                            aria-label="Ver catálogo de imóveis"
                        >
                            <span>Ver Catálogo</span>
                            <ArrowRight className="w-5 h-5" aria-hidden="true" />
                        </Link>
                    </div>
                </header>

                {/* Search Box - Balanced with visible background */}
                <div className="mb-8 sm:mb-12 lg:mb-16 relative z-10">
                    <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-amber-400/30 max-w-5xl mx-auto relative overflow-hidden">

                        {/* Subtle Inner Enhancement */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/3 via-transparent to-transparent pointer-events-none" />

                        <div className="relative z-10">                            {/* Header */}
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 sm:p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                                        <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white">
                                            {copyContent.title}
                                        </h3>
                                        <p className="text-slate-300 text-xs sm:text-sm">{copyContent.subtitle}</p>
                                    </div>
                                </div>

                                {/* Clear search button */}
                                {(searchState.query || searchState.propertyType || searchState.location) && (
                                    <button
                                        onClick={clearSearch}
                                        className="p-2 text-slate-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-slate-800/50"
                                        aria-label="Limpar busca"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Mode Toggle */}
                            <div className="mb-4 sm:mb-6">
                                <div className="flex items-center justify-center">
                                    <div className="bg-slate-800/80 rounded-xl p-1 relative overflow-hidden shadow-inner border border-slate-700">
                                        <div
                                            className="absolute inset-y-1 bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg shadow-md transition-all duration-300 ease-out"
                                            style={{
                                                left: searchState.mode === 'venda' ? '4px' : '50%',
                                                width: '47%'
                                            }}
                                        />
                                        <div className="relative flex" role="tablist" aria-label="Modo de busca">
                                            <button
                                                onClick={() => updateSearchField('mode', 'venda')}
                                                className={`px-6 py-3 text-sm font-semibold rounded-lg transition-colors duration-200 relative z-10 min-w-[100px] ${searchState.mode === 'venda'
                                                    ? 'text-white'
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
                                                className={`px-6 py-3 text-sm font-semibold rounded-lg transition-colors duration-200 relative z-10 min-w-[100px] ${searchState.mode === 'aluguel'
                                                    ? 'text-white'
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

                            {/* Search Fields - Estratégicos baseados no lead */}
                            <div
                                id="search-panel"
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6"
                                role="tabpanel"
                            >
                                {/* Tipo de Imóvel - Campo 1: Mais básico e universal */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Home className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" aria-hidden="true" />
                                    </div>
                                    <select
                                        value={searchState.propertyType}
                                        onChange={(e) => updateSearchField('propertyType', e.target.value)}
                                        className="w-full pl-9 sm:pl-10 pr-8 py-3 sm:py-4 text-sm border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all duration-300 bg-white appearance-none hover:border-amber-300 hover:shadow-sm focus:shadow-md"
                                        aria-label="Selecionar tipo de imóvel"
                                    >
                                        {propertyOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
                                    </div>
                                </div>

                                {/* Faixa de Preço - Campo 2: Principal filtro financeiro */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <div className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 font-bold text-xs flex items-center justify-center">R$</div>
                                    </div>
                                    <select
                                        value={searchState.priceRange}
                                        onChange={(e) => updateSearchField('priceRange', e.target.value)}
                                        className="w-full pl-9 sm:pl-10 pr-8 py-3 sm:py-4 text-sm border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all duration-300 bg-white appearance-none hover:border-amber-300 hover:shadow-sm focus:shadow-md"
                                        aria-label="Selecionar faixa de preço"
                                    >
                                        {primaryFieldOptions.priceRanges.map(option => (
                                            <option key={`${option.min}-${option.max}`} value={`${option.min}-${option.max}`}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
                                    </div>
                                </div>

                                {/* Dormitórios - Campo 3: Tamanho/funcionalidade */}
                                <div className="sm:col-span-2 lg:col-span-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Bed className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" aria-hidden="true" />
                                    </div>
                                    <select
                                        value={searchState.bedrooms}
                                        onChange={(e) => updateSearchField('bedrooms', e.target.value)}
                                        className="w-full pl-9 sm:pl-10 pr-8 py-3 sm:py-4 text-sm border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all duration-300 bg-white appearance-none hover:border-amber-300 hover:shadow-sm focus:shadow-md"
                                        aria-label="Selecionar número de quartos"
                                    >
                                        {primaryFieldOptions.bedroomOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
                                    </div>
                                </div>
                            </div>

                            {/* Advanced Search Toggle */}
                            <div className="mb-4">
                                <button
                                    onClick={toggleAdvancedSearch}
                                    className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors duration-200 text-sm font-medium focus:outline-none focus:text-amber-400"
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

                            {/* Advanced Search Fields - Campos específicos e regionais */}
                            {uiState.showAdvancedSearch && (
                                <div
                                    id="advanced-search"
                                    className="mb-4 transition-all duration-300"
                                >
                                    <div className="bg-slate-800/40 rounded-xl p-4 space-y-4 border border-slate-700/50">

                                        {/* Primeira linha - Busca por texto e localização */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {/* Search Input with validation */}
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Buscar por endereço, bairro..."
                                                    value={searchState.query}
                                                    onChange={(e) => updateSearchField('query', e.target.value)}
                                                    onFocus={() => setUiState(prev => ({ ...prev, isSearchFocused: true }))}
                                                    onBlur={() => setUiState(prev => ({ ...prev, isSearchFocused: false }))}
                                                    className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-amber-500/20 outline-none transition-all duration-300 bg-white hover:shadow-sm focus:shadow-md ${searchErrors.query
                                                        ? 'border-red-300 focus:border-red-500'
                                                        : 'border-slate-300 focus:border-amber-500 hover:border-amber-300'
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

                                            {/* Location Select - Agora nos filtros avançados */}
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <MapPin className="h-4 w-4 text-slate-400" aria-hidden="true" />
                                                </div>
                                                <select
                                                    value={searchState.location}
                                                    onChange={(e) => updateSearchField('location', e.target.value)}
                                                    className="w-full pl-9 pr-8 py-2 text-sm border border-slate-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all duration-300 bg-white appearance-none hover:border-amber-300"
                                                    aria-label="Selecionar cidade"
                                                >
                                                    {locationOptions.map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Segunda linha - Área e Banheiros */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <select
                                                value={searchState.areaMin}
                                                onChange={(e) => updateSearchField('areaMin', e.target.value)}
                                                className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none bg-white transition-all duration-200"
                                                aria-label="Área mínima"
                                            >
                                                {primaryFieldOptions.areaOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>

                                            <select
                                                value={searchState.bathrooms}
                                                onChange={(e) => updateSearchField('bathrooms', e.target.value)}
                                                className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none bg-white transition-all duration-200"
                                                aria-label="Número de banheiros"
                                            >
                                                <option value="">Quantos banheiros?</option>
                                                <option value="1">1 banheiro</option>
                                                <option value="2">2 banheiros</option>
                                                <option value="3">3 banheiros</option>
                                                <option value="4">4+ banheiros</option>
                                            </select>
                                        </div>

                                        {/* Terceira linha - Vagas e Características */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <select
                                                value={searchState.vagas}
                                                onChange={(e) => updateSearchField('vagas', e.target.value)}
                                                className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none bg-white transition-all duration-200"
                                                aria-label="Número de vagas"
                                            >
                                                <option value="">Vagas de garagem?</option>
                                                <option value="1">1 vaga</option>
                                                <option value="2">2 vagas</option>
                                                <option value="3">3 vagas</option>
                                                <option value="4">4+ vagas</option>
                                            </select>

                                            <select
                                                value={searchState.features}
                                                onChange={(e) => updateSearchField('features', e.target.value)}
                                                className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none bg-white transition-all duration-200"
                                                aria-label="Características especiais"
                                            >
                                                <option value="">Características especiais</option>
                                                <option value="possuiPiscina">Com piscina</option>
                                                <option value="possuiJardim">Com jardim</option>
                                                <option value="destaque">Imóvel destaque</option>
                                                <option value="emAlta">Em alta</option>
                                            </select>
                                        </div>

                                        {/* Quarta linha - Financiamento (apenas para venda) */}
                                        {searchState.mode === 'venda' && (
                                            <div className="grid grid-cols-1 gap-3">
                                                <select
                                                    value={searchState.financing}
                                                    onChange={(e) => updateSearchField('financing', e.target.value)}
                                                    className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none bg-white transition-all duration-200"
                                                    aria-label="Aceita financiamento"
                                                >
                                                    <option value="">Financiamento</option>
                                                    <option value="aceitaFinanciamento">Aceita financiamento</option>
                                                    <option value="documentacaoOk">Documentação em dia</option>
                                                </select>
                                            </div>
                                        )}

                                        {/* Mensagem explicativa */}
                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                                            <p className="text-xs text-amber-800 flex items-center gap-2">
                                                <Award className="w-3 h-3" />
                                                <span>
                                                    {searchState.mode === 'venda'
                                                        ? 'Filtros avançados para refinar sua busca por casa própria!'
                                                        : 'Filtros detalhados para encontrar o imóvel ideal para alugar!'
                                                    }
                                                </span>
                                            </p>
                                        </div>                                        {/* Price range error */}
                                        {searchErrors.priceRange && (
                                            <div className="text-xs text-red-400 flex items-center gap-1 mt-2">
                                                <AlertCircle className="w-3 h-3" />
                                                {searchErrors.priceRange}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Search Button */}
                            <button
                                onClick={handleSearch}
                                disabled={uiState.isSearching}
                                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:from-amber-500 disabled:to-amber-600 disabled:opacity-70 text-white px-6 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                                aria-label={uiState.isSearching ? "Buscando imóveis..." : "Buscar imóveis"}
                            >
                                {uiState.isSearching ? (
                                    <>
                                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" aria-hidden="true" />
                                        <span>Buscando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                                        <span>Buscar Imóveis</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Featured Properties */}
                <div className="mb-8 sm:mb-12">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-6 sm:mb-8">
                            <button
                                onClick={toggleEmAlta}
                                className="inline-flex items-center gap-4 sm:gap-6 bg-slate-900/70 backdrop-blur-xl border border-amber-400/30 px-6 sm:px-8 py-4 sm:py-6 rounded-2xl text-white shadow-xl hover:bg-slate-800/70 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                                aria-expanded={uiState.isEmAltaExpanded}
                                aria-controls="featured-properties"
                            >
                                <div>
                                    <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" aria-hidden="true" />
                                </div>

                                <div className="text-left flex-1">
                                    <span className="block text-lg sm:text-xl lg:text-2xl font-semibold text-white">
                                        Imóveis em Destaque
                                    </span>
                                    <span className="block text-xs sm:text-sm text-slate-300 mt-1">
                                        {imoveisEmAlta.length > 0
                                            ? `${imoveisEmAlta.length} propriedades selecionadas`
                                            : 'Clique para ver novidades'
                                        }
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-sm">
                                        {imoveisEmAlta.length > 0 ? imoveisEmAlta.length : 'NOVO'}
                                    </span>
                                    <div className={`transition-transform duration-300 ${uiState.isEmAltaExpanded ? 'rotate-180' : ''}`}>
                                        <ChevronDown className="w-5 h-5 text-slate-300" aria-hidden="true" />
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* Properties Grid */}
                        {uiState.isEmAltaExpanded && (
                            <div
                                id="featured-properties"
                                className="transition-all duration-300"
                            >
                                {imoveisEmAlta.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                        {imoveisEmAlta.slice(0, 6).map((imovel, index) => (
                                            <SimplePropertyCard
                                                key={imovel._id || index}
                                                id={imovel._id || `featured-${index}`}
                                                title={imovel.titulo || 'Imóvel em destaque'}
                                                location={`${imovel.bairro || ''}, ${imovel.cidade || 'Guararema'}`}
                                                price={imovel.preco || 0}
                                                propertyType={imovel.finalidade === 'Venda' ? 'sale' : 'rent'}
                                                bedrooms={imovel.dormitorios}
                                                bathrooms={imovel.banheiros}
                                                area={imovel.areaUtil}
                                                mainImage={{ url: imovel.imagem?.imagemUrl || '/placeholder-house.jpg' }}
                                                description={imovel.descricao}
                                                showFavoriteButton={true}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 sm:py-16">
                                        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-amber-400/20 p-8 sm:p-12 max-w-2xl mx-auto shadow-xl">
                                            <TrendingUp className="w-16 h-16 text-amber-500 mx-auto mb-6" />

                                            <h3 className="text-white font-semibold text-xl sm:text-2xl mb-4">
                                                Novos Destaques em Breve
                                            </h3>
                                            <p className="text-slate-300 mb-6 leading-relaxed">
                                                Nossa equipe está selecionando os melhores imóveis de Guararema para você.
                                            </p>

                                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                                <Link
                                                    href="/catalogo"
                                                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                                                >
                                                    <Eye className="w-4 h-4" aria-hidden="true" />
                                                    Ver Catálogo
                                                </Link>

                                                <button
                                                    onClick={handleQuickCall}
                                                    className="bg-slate-800 border border-amber-400/40 hover:border-amber-300 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                                                >
                                                    <Phone className="w-4 h-4" aria-hidden="true" />
                                                    Fale Conosco
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Trust Indicators */}
                <div className="mb-8 sm:mb-12">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto">
                        {trustMetrics.map((metric, index) => (
                            <div
                                key={index}
                                className="bg-slate-900/60 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-amber-400/20 text-center hover:bg-slate-800/60 hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className="mb-3 mx-auto w-fit">
                                    <div className={`bg-gradient-to-br ${metric.color} p-2 sm:p-3 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300`}>
                                        <metric.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" aria-hidden="true" />
                                    </div>
                                </div>
                                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">
                                    {metric.number}
                                </div>
                                <p className="text-xs sm:text-sm font-medium text-slate-300 mb-1">{metric.text}</p>
                                <p className="text-xs text-slate-400">{metric.subtitle}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-slate-500">
                <div className="flex flex-col items-center gap-2 animate-bounce">
                    <span className="text-xs font-medium">Explore mais</span>
                    <div className="w-5 h-8 border border-slate-300 rounded-full flex justify-center">
                        <div className="w-0.5 h-2 bg-amber-500 rounded-full mt-2 animate-pulse" />
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
