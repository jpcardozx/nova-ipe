import React from 'react'
import { Metadata } from 'next'
import { Building2, MapPin, Award, Users, Search, Filter, Grid3x3, TrendingUp } from 'lucide-react'
import PropertyCatalogClean from './components/PropertyCatalogClean'

export const metadata: Metadata = {
    title: 'Catálogo de Imóveis | Ipê Concept',
    description: 'Explore nossa seleção premium de imóveis em Guararema e região.',
}

interface SearchParams {
    q?: string
    tipo?: string
    local?: string
    preco?: string
    quartos?: string
}

interface CatalogoPageProps {
    searchParams: Promise<SearchParams>
}

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
    const params = await searchParams

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Professional Header Section */}
            <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        {/* Company Badge */}
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-6">
                            <Building2 className="w-4 h-4 text-amber-400" />
                            <span className="text-sm font-medium">Ipê Concept Imóveis</span>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Catálogo de Imóveis
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Explore nossa seleção premium de imóveis em Guararema e região. Encontre o lar perfeito para sua família.
                        </p>

                        {/* Premium Search Bar */}
                        <div className="max-w-2xl mx-auto mb-12">
                            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Digite o bairro, cidade ou tipo de imóvel..."
                                            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                                        />
                                    </div>
                                    <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap">
                                        Buscar Imóveis
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <Building2 className="w-6 h-6 text-amber-400" />
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">150+</div>
                            <div className="text-sm text-gray-300">Imóveis disponíveis</div>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <MapPin className="w-6 h-6 text-amber-400" />
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">8</div>
                            <div className="text-sm text-gray-300">Cidades atendidas</div>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <Award className="w-6 h-6 text-amber-400" />
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">15+</div>
                            <div className="text-sm text-gray-300">Anos no mercado</div>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <Users className="w-6 h-6 text-amber-400" />
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">500+</div>
                            <div className="text-sm text-gray-300">Famílias atendidas</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Catalog Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-5 gap-12">

                        {/* Filters Sidebar */}
                        <div className="lg:col-span-1 space-y-6">

                            {/* Quick Filters */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Filter className="w-5 h-5 text-amber-600" />
                                    <h3 className="font-semibold text-gray-900">Filtros Rápidos</h3>
                                </div>

                                <div className="space-y-4">
                                    {/* Property Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tipo de Imóvel
                                        </label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                                            <option value="">Todos os tipos</option>
                                            <option value="casa">Casa</option>
                                            <option value="apartamento">Apartamento</option>
                                            <option value="terreno">Terreno</option>
                                            <option value="comercial">Comercial</option>
                                        </select>
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Localização
                                        </label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                                            <option value="">Todas as cidades</option>
                                            <option value="guararema">Guararema</option>
                                            <option value="mogi-das-cruzes">Mogi das Cruzes</option>
                                            <option value="jacarei">Jacareí</option>
                                            <option value="suzano">Suzano</option>
                                        </select>
                                    </div>

                                    {/* Price Range */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Faixa de Preço
                                        </label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                                            <option value="">Qualquer preço</option>
                                            <option value="0-300000">Até R$ 300 mil</option>
                                            <option value="300000-500000">R$ 300 - 500 mil</option>
                                            <option value="500000-1000000">R$ 500 mil - 1 milhão</option>
                                            <option value="1000000+">Acima de R$ 1 milhão</option>
                                        </select>
                                    </div>

                                    {/* Bedrooms */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Dormitórios
                                        </label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                                            <option value="">Qualquer quantidade</option>
                                            <option value="1">1 dormitório</option>
                                            <option value="2">2 dormitórios</option>
                                            <option value="3">3 dormitórios</option>
                                            <option value="4+">4+ dormitórios</option>
                                        </select>
                                    </div>
                                </div>

                                <button className="w-full mt-6 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                                    Aplicar Filtros
                                </button>
                            </div>

                            {/* Popular Searches */}
                            <div className="bg-gray-900 text-white p-6 rounded-lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <TrendingUp className="w-5 h-5 text-amber-400" />
                                    <h4 className="font-semibold">Buscas Populares</h4>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <a href="#" className="block hover:text-amber-400 transition-colors">Casa 3 dormitórios Guararema</a>
                                    <a href="#" className="block hover:text-amber-400 transition-colors">Apartamento aluguel centro</a>
                                    <a href="#" className="block hover:text-amber-400 transition-colors">Terreno Portal do Paraíso</a>
                                    <a href="#" className="block hover:text-amber-400 transition-colors">Casa com piscina</a>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-4">
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                            Imóveis Disponíveis
                                        </h2>
                                        <p className="text-gray-600">
                                            Encontre o imóvel perfeito para você
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Grid3x3 className="w-4 h-4" />
                                            <span>Visualização</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Property Catalog Component */}
                                <PropertyCatalogClean searchParams={params as Record<string, string>} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}