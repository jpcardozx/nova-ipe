'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Grid3x3,
    List,
    MapPin,
    Building,
    Home,
    TrendingUp,
    Award,
    Shield,
    Clock,
    Users,
    Star,
    ArrowRight,
    ChevronDown,
    X
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { formatarMoeda } from '@/lib/utils';
import SanityImage from '@/app/components/SanityImage';
import type { ImovelClient } from '../../src/types/imovel-client';

// Professional color system
const colors = {
    primary: {
        50: '#fef7ed',
        100: '#fdecd3',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f'
    },
    neutral: {
        50: '#fafaf9',
        100: '#f5f5f4',
        200: '#e7e5e4',
        300: '#d6d3d1',
        500: '#78716c',
        600: '#57534e',
        700: '#44403c',
        800: '#292524',
        900: '#1c1917'
    },
    emerald: {
        50: '#ecfdf5',
        500: '#10b981',
        600: '#059669',
        700: '#047857'
    }
};

interface ProfessionalPropertyPageProps {
    pageTitle: string;
    pageDescription: string;
    fetchPropertiesFunction: () => Promise<ImovelClient[]>;
    propertyType: 'sale' | 'rent';
}

interface FilterState {
    priceRange: [number, number];
    bedrooms: string;
    location: string;
    propertyTypes: string[];
}

const ProfessionalPropertyPage: React.FC<ProfessionalPropertyPageProps> = ({
    pageTitle,
    pageDescription,
    fetchPropertiesFunction,
    propertyType
}) => {
    const [properties, setProperties] = useState<ImovelClient[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<ImovelClient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        priceRange: [0, 10000000],
        bedrooms: '',
        location: '',
        propertyTypes: []
    });

    // Fetch properties
    useEffect(() => {
        const loadProperties = async () => {
            try {
                setLoading(true);
                const data = await fetchPropertiesFunction();
                setProperties(data);
                setFilteredProperties(data);
                setError(null);
            } catch (err) {
                console.error('Error loading properties:', err);
                setError('Erro ao carregar imóveis. Tente novamente.');
            } finally {
                setLoading(false);
            }
        };

        loadProperties();
    }, [fetchPropertiesFunction]);

    // Filter properties
    useEffect(() => {
        let filtered = properties;

        // Search term filter
        if (searchTerm.trim()) {
            filtered = filtered.filter(property =>
                property.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                property.bairro?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                property.cidade?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }        // Price range filter
        if (filters.priceRange[1] < 10000000) {
            filtered = filtered.filter(property =>
                property.preco !== undefined &&
                property.preco >= filters.priceRange[0] &&
                property.preco <= filters.priceRange[1]
            );
        }

        // Bedrooms filter
        if (filters.bedrooms) {
            const bedroomCount = parseInt(filters.bedrooms);
            filtered = filtered.filter(property => property.dormitorios === bedroomCount);
        }

        // Location filter
        if (filters.location) {
            filtered = filtered.filter(property =>
                property.bairro?.toLowerCase().includes(filters.location.toLowerCase()) ||
                property.cidade?.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        setFilteredProperties(filtered);
    }, [properties, searchTerm, filters]);

    const heroStats = [
        { icon: Building, label: 'Imóveis Disponíveis', value: properties.length.toString() },
        { icon: Award, label: 'Anos de Experiência', value: '15+' },
        { icon: Users, label: 'Famílias Atendidas', value: '500+' },
        { icon: Star, label: 'Avaliação', value: '4.9/5' }
    ];

    const features = [
        {
            icon: Shield,
            title: 'Negociação Segura',
            description: 'Suporte jurídico completo em todas as etapas'
        },
        {
            icon: TrendingUp,
            title: 'Análise de Mercado',
            description: 'Avaliação precisa do potencial de valorização'
        },
        {
            icon: Clock,
            title: 'Atendimento Ágil',
            description: 'Resposta em até 2 horas úteis'
        }
    ];

    if (loading) {
        return <PropertyPageSkeleton />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">Erro ao carregar imóveis</h2>
                    <p className="text-neutral-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/property-pattern.png')] opacity-5"></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16"
                >
                    <div className="text-center mb-12">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
                        >
                            {pageTitle}
                            <span className="text-primary-500"> Premium</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl text-neutral-300 max-w-3xl mx-auto"
                        >
                            {pageDescription}
                        </motion.p>
                    </div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                    >
                        {heroStats.map(({ icon: Icon, label, value }, index) => (
                            <motion.div
                                key={label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                                className="text-center"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/20 rounded-full mb-4">
                                    <Icon className="w-8 h-8 text-primary-500" />
                                </div>
                                <div className="text-3xl font-bold text-white">{value}</div>
                                <div className="text-sm text-neutral-400">{label}</div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar por localização, características..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border-0 text-neutral-900 placeholder-neutral-500 focus:ring-2 focus:ring-primary-500 focus:outline-none text-lg"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center justify-center gap-2 px-6 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition-colors"
                                >
                                    <Filter className="w-5 h-5" />
                                    <span>Filtros</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Features */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map(({ icon: Icon, title, description }, index) => (
                            <motion.div
                                key={title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center group"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6 group-hover:bg-primary-200 transition-colors">
                                    <Icon className="w-8 h-8 text-primary-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-neutral-900 mb-3">{title}</h3>
                                <p className="text-neutral-600">{description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Properties Section */}
            <section className="py-16 bg-neutral-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                                {filteredProperties.length} {filteredProperties.length === 1 ? 'Imóvel Encontrado' : 'Imóveis Encontrados'}
                            </h2>
                            <p className="text-neutral-600">
                                Propriedades selecionadas com critério para sua família
                            </p>
                        </div>

                        <div className="flex items-center gap-4 mt-6 lg:mt-0">
                            <div className="flex bg-white rounded-lg p-1 shadow-sm border border-neutral-200">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
                                        viewMode === 'grid'
                                            ? "bg-primary-500 text-white"
                                            : "text-neutral-600 hover:text-neutral-900"
                                    )}
                                >
                                    <Grid3x3 className="w-4 h-4" />
                                    <span className="hidden sm:inline">Grade</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
                                        viewMode === 'list'
                                            ? "bg-primary-500 text-white"
                                            : "text-neutral-600 hover:text-neutral-900"
                                    )}
                                >
                                    <List className="w-4 h-4" />
                                    <span className="hidden sm:inline">Lista</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Properties Grid */}
                    {filteredProperties.length > 0 ? (
                        <div className={cn(
                            "grid gap-8",
                            viewMode === 'grid'
                                ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                                : "grid-cols-1"
                        )}>
                            {filteredProperties.map((property, index) => (
                                <ProfessionalPropertyCard
                                    key={property._id}
                                    property={property}
                                    viewMode={viewMode}
                                    index={index}
                                />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-16"
                        >
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-neutral-200 rounded-full mb-6">
                                <Search className="w-12 h-12 text-neutral-400" />
                            </div>
                            <h3 className="text-2xl font-semibold text-neutral-900 mb-4">
                                Nenhum imóvel encontrado
                            </h3>
                            <p className="text-neutral-600 mb-6">
                                Tente ajustar os filtros ou termos de busca
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilters({
                                        priceRange: [0, 10000000],
                                        bedrooms: '',
                                        location: '',
                                        propertyTypes: []
                                    });
                                }}
                                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                            >
                                Limpar Filtros
                            </button>
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
};

// Professional Property Card Component
const ProfessionalPropertyCard: React.FC<{
    property: ImovelClient;
    viewMode: 'grid' | 'list';
    index: number;
}> = ({ property, viewMode, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={cn(
                "bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden group hover:shadow-xl transition-all duration-300",
                viewMode === 'list' && "flex flex-col lg:flex-row"
            )}
        >
            {/* Image Section */}
            <div className={cn(
                "relative overflow-hidden",
                viewMode === 'grid' ? "aspect-[4/3]" : "lg:w-1/3 aspect-[4/3] lg:aspect-auto"
            )}>
                {property.imagem?.imagemUrl ? (
                    <SanityImage
                        image={property.imagem}
                        alt={property.imagem.alt || property.titulo || 'Imóvel'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                        <Home className="w-16 h-16 text-neutral-400" />
                    </div>
                )}

                {/* Price Badge */}
                <div className="absolute top-4 left-4">                    <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-lg font-bold text-neutral-900">
                        {property.preco ? formatarMoeda(property.preco) : 'Preço sob consulta'}
                    </span>
                </div>
                </div>

                {/* Highlight Badge */}
                {property.destaque && (
                    <div className="absolute top-4 right-4">
                        <div className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Destaque
                        </div>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className={cn(
                "p-6",
                viewMode === 'list' && "lg:flex-1"
            )}>
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                            {property.titulo}
                        </h3>
                        <div className="flex items-center gap-1 text-neutral-600">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">
                                {property.bairro}, {property.cidade}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Property Details */}
                <div className="flex items-center gap-6 mb-6 text-sm text-neutral-600">
                    {property.dormitorios && (
                        <div className="flex items-center gap-1">
                            <span className="font-medium">{property.dormitorios}</span>
                            <span>quartos</span>
                        </div>
                    )}
                    {property.banheiros && (
                        <div className="flex items-center gap-1">
                            <span className="font-medium">{property.banheiros}</span>
                            <span>banheiros</span>
                        </div>
                    )}
                    {property.areaUtil && (
                        <div className="flex items-center gap-1">
                            <span className="font-medium">{property.areaUtil}</span>
                            <span>m²</span>
                        </div>
                    )}
                </div>

                {/* CTA */}
                <Link
                    href={`/imovel/${typeof property.slug === 'string' ? property.slug : property._id}`}
                    className="inline-flex items-center gap-2 w-full justify-center bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors group"
                >
                    <span>Ver Detalhes</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
};

// Loading Skeleton Component
const PropertyPageSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Hero Skeleton */}
            <div className="bg-neutral-900 pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="h-16 bg-neutral-800 rounded-lg mb-6 animate-pulse"></div>
                        <div className="h-6 bg-neutral-800 rounded-lg max-w-3xl mx-auto animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {Array(4).fill(0).map((_, i) => (
                            <div key={i} className="text-center">
                                <div className="w-16 h-16 bg-neutral-800 rounded-full mx-auto mb-4 animate-pulse"></div>
                                <div className="h-8 bg-neutral-800 rounded mb-2 animate-pulse"></div>
                                <div className="h-4 bg-neutral-800 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Properties Skeleton */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-8 bg-neutral-200 rounded-lg mb-12 max-w-md animate-pulse"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {Array(6).fill(0).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden">
                                <div className="aspect-[4/3] bg-neutral-200 animate-pulse"></div>
                                <div className="p-6">
                                    <div className="h-6 bg-neutral-200 rounded mb-4 animate-pulse"></div>
                                    <div className="h-4 bg-neutral-200 rounded mb-6 animate-pulse"></div>
                                    <div className="h-12 bg-neutral-200 rounded-xl animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfessionalPropertyPage;
