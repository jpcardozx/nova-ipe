'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, Filter, Home, Building2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { ImovelClient } from '@/src/types/imovel-client';

interface CleanHeroProps {
    imoveisEmAlta?: ImovelClient[];
}

interface SearchState {
    mode: 'venda' | 'aluguel';
    query: string;
    location: string;
    priceRange: string;
}

export default function CleanHero({ imoveisEmAlta = [] }: CleanHeroProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [searchState, setSearchState] = useState<SearchState>({
        mode: 'venda',
        query: '',
        location: '',
        priceRange: ''
    });
    
    const [showFilters, setShowFilters] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // Locations from Sanity data
    const availableLocations = useMemo(() => {
        if (!imoveisEmAlta?.length) return [];
        const locations = new Set<string>();
        imoveisEmAlta.forEach(imovel => {
            if (imovel.bairro) locations.add(imovel.bairro);
            if (imovel.cidade) locations.add(imovel.cidade);
        });
        return Array.from(locations).sort();
    }, [imoveisEmAlta]);

    const handleSearch = async () => {
        if (!searchState.query && !searchState.location) return;
        
        setIsSearching(true);
        
        const params = new URLSearchParams();
        if (searchState.query) params.set('q', searchState.query);
        if (searchState.location) params.set('location', searchState.location);
        if (searchState.priceRange) params.set('price', searchState.priceRange);
        params.set('finalidade', searchState.mode);
        
        router.push(`/catalogo?${params.toString()}`);
    };

    const handleModeChange = (mode: 'venda' | 'aluguel') => {
        setSearchState(prev => ({ ...prev, mode }));
    };

    const priceRanges = {
        venda: [
            { label: 'Até R$ 300.000', value: '0-300000' },
            { label: 'R$ 300.000 - R$ 500.000', value: '300000-500000' },
            { label: 'R$ 500.000 - R$ 800.000', value: '500000-800000' },
            { label: 'R$ 800.000 - R$ 1.200.000', value: '800000-1200000' },
            { label: 'Acima de R$ 1.200.000', value: '1200000-' }
        ],
        aluguel: [
            { label: 'Até R$ 2.000', value: '0-2000' },
            { label: 'R$ 2.000 - R$ 3.500', value: '2000-3500' },
            { label: 'R$ 3.500 - R$ 5.000', value: '3500-5000' },
            { label: 'R$ 5.000 - R$ 8.000', value: '5000-8000' },
            { label: 'Acima de R$ 8.000', value: '8000-' }
        ]
    };

    return (
        <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden mt-8 sm:mt-12 mb-12 sm:mb-16">
            {/* Clean Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-amber-50/20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_70%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.03),transparent_70%)]" />
            </div>

            {/* Subtle Pattern Overlay */}
            <div 
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    {/* Heading com hierarquia visual aprimorada */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-slate-900 mb-6 tracking-tight leading-[1.1]">
                        <span className="block text-slate-600 text-2xl sm:text-3xl lg:text-4xl font-normal mb-2">Encontre</span>
                        Seu Próximo
                        <span className="block text-amber-600 font-semibold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                            Lar
                        </span>
                    </h1>
                    
                    {/* Subtitle natural e acolhedor */}
                    <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
                        Descubra <span className="font-semibold text-amber-600">{imoveisEmAlta?.length || 0} imóveis</span> cuidadosamente selecionados em Guararema e região, onde cada casa tem sua história
                    </p>

                    {/* Indicadores de confiança orgânicos */}
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 mb-12">
                        <div className="flex items-center gap-3 bg-white/40 backdrop-blur-sm px-3 py-2 rounded-full border border-white/30">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="font-medium">{imoveisEmAlta?.length || 0} imóveis ativos</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/40 backdrop-blur-sm px-3 py-2 rounded-full border border-white/30">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span className="font-medium">Acompanhamento dedicado</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/40 backdrop-blur-sm px-3 py-2 rounded-full border border-white/30">
                            <div className="w-2 h-2 bg-amber-500 rounded-full" />
                            <span className="font-medium">Processo transparente</span>
                        </div>
                    </div>
                </div>

                {/* Search Interface */}
                <div className="max-w-4xl mx-auto">
                    {/* Toggle com profundidade visual */}
                    <div className="flex justify-center mb-8">
                        <div className="relative bg-white/70 backdrop-blur-xl rounded-full p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/40">
                            {/* Indicador de seleção animado */}
                            <div className={cn(
                                "absolute top-1.5 h-[calc(100%-12px)] bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg transition-all duration-300 ease-out",
                                searchState.mode === 'venda' ? "left-1.5 w-[calc(50%-6px)]" : "left-[calc(50%+1.5px)] w-[calc(50%-6px)]"
                            )} />
                            <div className="flex relative z-10">
                                <button
                                    onClick={() => handleModeChange('venda')}
                                    className={cn(
                                        "px-8 py-3 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2",
                                        searchState.mode === 'venda'
                                            ? "text-white"
                                            : "text-slate-600 hover:text-slate-800"
                                    )}
                                >
                                    <Home className="w-4 h-4" />
                                    Comprar
                                </button>
                                <button
                                    onClick={() => handleModeChange('aluguel')}
                                    className={cn(
                                        "px-8 py-3 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2",
                                        searchState.mode === 'aluguel'
                                            ? "text-white"
                                            : "text-slate-600 hover:text-slate-800"
                                    )}
                                >
                                    <Building2 className="w-4 h-4" />
                                    Alugar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Formulário com profundidade visual */}
                    <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-white/40 p-3">
                        {/* Linha de luz superior */}
                        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                            {/* Campo de busca com profundidade */}
                            <div className="lg:col-span-2 relative group">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 group-focus-within:from-amber-200 group-focus-within:to-orange-200 transition-colors">
                                    <Search className="w-4 h-4 text-amber-600" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar por tipo, bairro ou características..."
                                    value={searchState.query}
                                    onChange={(e) => setSearchState(prev => ({ ...prev, query: e.target.value }))}
                                    className="w-full h-14 pl-14 pr-4 rounded-xl border border-white/40 focus:border-amber-300/60 focus:ring-4 focus:ring-amber-100/50 outline-none text-slate-900 placeholder-slate-500 bg-white/60 backdrop-blur-sm focus:bg-white/90 transition-all shadow-inner"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>

                            {/* Seletor de localização */}
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 group-focus-within:from-blue-200 group-focus-within:to-indigo-200 transition-colors">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                </div>
                                <select
                                    value={searchState.location}
                                    onChange={(e) => setSearchState(prev => ({ ...prev, location: e.target.value }))}
                                    className="w-full h-14 pl-14 pr-4 rounded-xl border border-white/40 focus:border-blue-300/60 focus:ring-4 focus:ring-blue-100/50 outline-none text-slate-900 bg-white/60 backdrop-blur-sm focus:bg-white/90 transition-all appearance-none cursor-pointer shadow-inner"
                                >
                                    <option value="">Todas as localidades</option>
                                    {availableLocations.map(location => (
                                        <option key={location} value={location}>
                                            {location}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Botão de busca com profundidade */}
                            <button
                                onClick={handleSearch}
                                disabled={isSearching || (!searchState.query && !searchState.location)}
                                className="relative h-14 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-xl font-semibold transition-all duration-300 shadow-[0_8px_32px_rgba(59,130,246,0.3)] hover:shadow-[0_12px_40px_rgba(59,130,246,0.4)] disabled:cursor-not-allowed flex items-center justify-center group overflow-hidden"
                            >
                                {/* Efeito de brilho */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                <div className="relative z-10 flex items-center">
                                    {isSearching ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Search className="w-5 h-5 mr-2" />
                                            Buscar
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>

                        {/* Advanced Filters Toggle */}
                        <div className="mt-3 pt-3 border-t border-gray-100">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mx-auto"
                            >
                                <Filter className="w-4 h-4" />
                                Filtros avançados
                            </button>
                        </div>

                        {/* Advanced Filters */}
                        {showFilters && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* Price Range */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Faixa de preço
                                        </label>
                                        <select
                                            value={searchState.priceRange}
                                            onChange={(e) => setSearchState(prev => ({ ...prev, priceRange: e.target.value }))}
                                            className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:border-blue-200 focus:ring-2 focus:ring-blue-50 outline-none text-gray-900 bg-white"
                                        >
                                            <option value="">Qualquer valor</option>
                                            {priceRanges[searchState.mode].map(range => (
                                                <option key={range.value} value={range.value}>
                                                    {range.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Ações rápidas com profundidade */}
                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                        <button
                            onClick={() => router.push('/catalogo')}
                            className="group px-6 py-3 bg-white/70 hover:bg-white/90 text-slate-700 hover:text-slate-900 rounded-full border border-white/40 hover:border-white/60 transition-all duration-300 text-sm font-medium shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] backdrop-blur-sm"
                        >
                            <span className="relative">
                                Ver todos os imóveis
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-slate-600 to-slate-800 group-hover:w-full transition-all duration-300" />
                            </span>
                        </button>
                        <button
                            onClick={() => router.push('/catalogo?finalidade=venda&destaque=true')}
                            className="group px-6 py-3 bg-white/70 hover:bg-white/90 text-slate-700 hover:text-slate-900 rounded-full border border-white/40 hover:border-white/60 transition-all duration-300 text-sm font-medium shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] backdrop-blur-sm"
                        >
                            <span className="relative">
                                Imóveis em destaque
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 group-hover:w-full transition-all duration-300" />
                            </span>
                        </button>
                        <button
                            onClick={() => router.push('/contato')}
                            className="group px-6 py-3 bg-white/70 hover:bg-white/90 text-slate-700 hover:text-slate-900 rounded-full border border-white/40 hover:border-white/60 transition-all duration-300 text-sm font-medium shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] backdrop-blur-sm"
                        >
                            <span className="relative">
                                Fale conosco
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-full transition-all duration-300" />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}