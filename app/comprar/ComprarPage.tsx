// app/comprar/ComprarPage.tsx
'use client';

import { useState, useEffect } from 'react';
import Footer from '@sections/Footer';
import Valor from '@sections/Valor';
import { PropertyCardUnified } from '@/app/components/ui/property/PropertyCardUnified';
import { getImoveisParaVenda } from '@lib/sanity/fetchImoveis';
import type { ImovelClient } from '../../src/types/imovel-client';
import { Search, Filter, MapPin, TrendingUp, Building2, Award } from 'lucide-react';

export default function ComprarPage() {
    const [imoveis, setImoveis] = useState<ImovelClient[]>([]);
    const [filtroAtivo, setFiltroAtivo] = useState<string>('todos');
    const [termoBusca, setTermoBusca] = useState<string>('');

    useEffect(() => {
        getImoveisParaVenda()
            .then((data) => setImoveis(data))
            .catch((err) => console.error('Erro ao buscar imóveis para venda:', err));
    }, []);

    const filtros = [
        { id: 'todos', label: 'Todos os Imóveis', icon: Building2 },
        { id: 'destaque', label: 'Em Destaque', icon: Award },
        { id: 'valorização', label: 'Alto Potencial', icon: TrendingUp },
        { id: 'localizacao', label: 'Localização Premium', icon: MapPin }
    ];

    const imoveisFiltrados = imoveis.filter(imovel => {
        const atendeFiltro = filtroAtivo === 'todos' ||
            (filtroAtivo === 'destaque' && imovel.destaque) ||
            (filtroAtivo === 'valorização' && imovel.preco && imovel.preco > 500000) ||
            (filtroAtivo === 'localizacao' && imovel.endereco?.toLowerCase().includes('centro'));

        const atendeBusca = !termoBusca ||
            imovel.titulo?.toLowerCase().includes(termoBusca.toLowerCase()) ||
            imovel.endereco?.toLowerCase().includes(termoBusca.toLowerCase());

        return atendeFiltro && atendeBusca;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
            {/* Hero Section Aprimorado */}
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 text-white">
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                <div className="relative max-w-7xl mx-auto px-6 py-24 pt-32">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-amber-300 font-semibold text-lg">Curadoria Especializada</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6">
                            Imóveis para <span className="text-amber-400">Compra</span>
                            <br />
                            <span className="text-3xl sm:text-4xl text-slate-300 font-normal">
                                com análise simbólica
                            </span>
                        </h1>

                        <p className="text-xl text-slate-200 leading-relaxed mb-8 max-w-3xl">
                            Propriedades selecionadas por sua <strong className="text-amber-300">potencial valorização</strong>,
                            localização estratégica e <em>significado institucional</em> em Guararema e região.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                                <TrendingUp className="w-5 h-5 text-amber-400" />
                                <span className="text-sm font-medium">Alto Potencial de Valorização</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                                <MapPin className="w-5 h-5 text-amber-400" />
                                <span className="text-sm font-medium">Localização Estratégica</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                                <Award className="w-5 h-5 text-amber-400" />
                                <span className="text-sm font-medium">Curadoria Simbólica</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Seção de Filtros e Busca */}
            <section className="bg-white shadow-lg sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                        {/* Barra de Busca */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar por localização ou características..."
                                value={termoBusca}
                                onChange={(e) => setTermoBusca(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                            />
                        </div>

                        {/* Filtros */}
                        <div className="flex flex-wrap gap-2">
                            {filtros.map((filtro) => {
                                const Icon = filtro.icon;
                                return (
                                    <button
                                        key={filtro.id}
                                        onClick={() => setFiltroAtivo(filtro.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${filtroAtivo === filtro.id
                                                ? 'bg-amber-500 text-white shadow-lg'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="text-sm">{filtro.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Contador de Resultados */}
                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-slate-600">
                            <span className="font-semibold text-slate-900">{imoveisFiltrados.length}</span>
                            {imoveisFiltrados.length === 1 ? ' imóvel encontrado' : ' imóveis encontrados'}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Filter className="w-4 h-4" />
                            <span>Filtro ativo: {filtros.find(f => f.id === filtroAtivo)?.label}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Listagem de Imóveis */}
            <main className="py-16">
                <section className="max-w-7xl mx-auto px-6">
                    {imoveisFiltrados.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Building2 className="w-12 h-12 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-700 mb-2">
                                Nenhum imóvel encontrado
                            </h3>
                            <p className="text-slate-500 mb-6">
                                Tente ajustar os filtros ou termo de busca para encontrar imóveis disponíveis.
                            </p>
                            <button
                                onClick={() => {
                                    setFiltroAtivo('todos');
                                    setTermoBusca('');
                                }}
                                className="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors"
                            >
                                Limpar Filtros
                            </button>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
                            {imoveisFiltrados.map((imovel, index) => (
                                <div
                                    key={imovel._id}
                                    className="transform hover:scale-105 transition-all duration-300"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <PropertyCardUnified
                                        id={imovel._id}
                                        title={imovel.titulo || ''}
                                        slug={imovel.slug || ''}
                                        location={imovel.endereco || ''}
                                        city={imovel.cidade || ''}
                                        price={imovel.preco || 0}
                                        propertyType="sale"
                                        area={imovel.areaUtil || undefined}
                                        bedrooms={imovel.dormitorios || undefined}
                                        bathrooms={imovel.banheiros || undefined}
                                        parkingSpots={imovel.vagas || undefined}
                                        mainImage={{
                                            url: imovel.imagem?.imagemUrl || imovel.galeria?.[0]?.imagemUrl || '',
                                            alt: imovel.titulo || '',
                                            sanityImage: imovel.imagem
                                        }}
                                        isHighlight={imovel.destaque || false}
                                        isNew={Boolean(imovel.dataPublicacao && new Date(imovel.dataPublicacao) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))}
                                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Seção Valor */}
            <Valor />

            {/* Footer */}
            <Footer />
        </div>
    );
}
