'use client'

import React, { useState, useEffect, FC, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Building, MapPin, Clock, Home, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatarMoeda } from '@/lib/utils';
import SanityImage from '@/app/components/SanityImage';
import type { ImovelClient } from '../../src/types/imovel-client';
import { normalizeDocuments } from '../../lib/sanity-utils';
import Button from '@/components/ui/button';
// import FeaturedProperty from '@/components/ui/FeaturedProperty'; // Temporarily disabled - empty component
import type { ImovelClientType } from '../../types/imovel';
import PropertyCardUnified from '@/app/components/ui/property/PropertyCardUnified';

/**
 * Adapta os imóveis do formato ImovelClient para o formato ImovelClientType
 * necessário para o componente FeaturedProperty
 */
const adaptImovelToClientType = (imoveis: ImovelClient[]): ImovelClientType[] => {
    return imoveis.map(imovel => {
        // Garante que propertyType seja apenas 'rent' ou 'sale'
        const propertyType = imovel.finalidade === 'Venda' ? 'sale' : 'rent';

        return {
            id: imovel._id, // Mapeia _id para id
            title: imovel.titulo || '',
            slug: typeof imovel.slug === 'string' ? imovel.slug : '',
            location: imovel.bairro || '',
            city: imovel.cidade,
            price: imovel.preco || 0,
            propertyType, // Já garantido como 'rent' ou 'sale'
            area: imovel.areaUtil,
            bedrooms: imovel.dormitorios,
            bathrooms: imovel.banheiros,
            parkingSpots: imovel.vagas,
            mainImage: {
                url: imovel.imagem?.imagemUrl || '',
                alt: imovel.imagem?.alt || imovel.titulo || '',
                blurDataUrl: imovel.imagem?.imagemUrl
            },
            isHighlight: imovel.destaque,
            status: 'available'
        };
    });
};

// Navigation button component
interface NavButtonProps {
    direction?: 'prev' | 'next';
    onClick: () => void;
    disabled?: boolean;
}

const NavButton: FC<NavButtonProps> = ({ direction = 'next', onClick, disabled = false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
            'p-3 rounded-full bg-white shadow-md',
            'transition-all duration-300 ease-out',
            'border border-stone-100',
            disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-emerald-50 hover:border-emerald-200 hover:shadow-lg',
            'focus:outline-none focus:ring-2 focus:ring-emerald-300/30'
        )}
        aria-label={direction === 'next' ? 'Próximo imóvel' : 'Imóvel anterior'}
    >
        {direction === 'next' ? (
            <ChevronRight className="w-5 h-5 text-emerald-700" />
        ) : (
            <ChevronLeft className="w-5 h-5 text-emerald-700" />
        )}
    </button>
);

// Hook for managing favorites
function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);

    // Load favorites from localStorage on mount
    useEffect(() => {
        try {
            const savedFavorites = localStorage.getItem('property-favorites') || '[]';
            setFavorites(JSON.parse(savedFavorites));
        } catch (error) {
            console.error('Error loading favorites:', error);
            setFavorites([]);
        }
    }, []);

    // Check if a property is favorited
    const isFavorite = (id: string): boolean => {
        return favorites.includes(id);
    };

    // Toggle favorite status
    const toggleFavorite = (id: string): void => {
        const newFavorites = [...favorites];
        const index = newFavorites.indexOf(id);

        if (index > -1) {
            newFavorites.splice(index, 1);
        } else {
            newFavorites.push(id);
        }

        setFavorites(newFavorites);
        localStorage.setItem('property-favorites', JSON.stringify(newFavorites));
    };

    return { isFavorite, toggleFavorite };
}

// Featured Property Card Component
const FeaturedPropertyCard: FC<{ property: ImovelClientType }> = ({ property }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden bg-white shadow-lg border border-emerald-100">
            <div className="relative aspect-[4/3] md:aspect-square overflow-hidden">
                <SanityImage
                    image={property.mainImage}
                    alt={property.title}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg">
                    {formatarMoeda(property.price)}
                </div>
            </div>

            <div className="p-6 flex flex-col justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-stone-800 mb-2">{property.title}</h3>

                    <div className="flex items-center text-stone-600 mb-4">
                        <MapPin className="w-5 h-5 mr-2 text-emerald-600" />
                        <span>{property.location}{property.city ? `, ${property.city}` : ''}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {property.area && (
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-emerald-100 rounded-md text-emerald-700">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-stone-500">Área</p>
                                    <p className="font-medium">{property.area} m²</p>
                                </div>
                            </div>
                        )}

                        {property.bedrooms && (
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-emerald-100 rounded-md text-emerald-700">
                                    <Home className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-stone-500">Dormitórios</p>
                                    <p className="font-medium">{property.bedrooms}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>                <Link
                    href={`/imovel/${typeof property.slug === 'object' && property.slug?.current ? property.slug.current : (typeof property.slug === 'string' ? property.slug : property.id)}`}
                    className="inline-flex items-center justify-center w-full gap-2 p-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-md"
                >
                    Quero conhecer este imóvel
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        </div>
    );
};

export default function DestaquesVendaSection() {
    const [imoveis, setImoveis] = useState<ImovelClient[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isFavorite, toggleFavorite } = useFavorites();
    const sectionRef = useRef<HTMLElement>(null);

    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true,
        rootMargin: '100px 0px'
    });

    // Fetch data when section comes into view
    useEffect(() => {
        if (inView && isLoading) {
            fetchImoveis();
        }
    }, [inView, isLoading]);

    // Optimize rendering with IntersectionObserver
    useEffect(() => {
        if (!sectionRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('cv-auto');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: '200px' }
        );

        observer.observe(sectionRef.current);

        return () => {
            if (sectionRef.current) observer.unobserve(sectionRef.current);
        };
    }, []);

    // Enhanced fetch function with proper error handling
    const fetchImoveis = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/destaques?finalidade=Venda');

            if (!response.ok) {
                throw new Error(`Falha ao buscar imóveis: ${response.status}`);
            }

            const data = await response.json();

            if (data && Array.isArray(data) && data.length > 0) {
                // Normalize the documents to ensure consistent formats
                const normalizedData = normalizeDocuments<ImovelClient>(data);
                setImoveis(normalizedData);
            } else {
                setImoveis([]);
                setError("Nenhum imóvel para venda em destaque encontrado.");
            }
        } catch (err) {
            console.error('Error fetching imoveis:', err);
            setError(err instanceof Error ? err.message : 'Erro ao carregar imóveis em destaque');
        } finally {
            setIsLoading(false);
        }
    };

    // Navigation functions
    const next = () => setActiveIndex(i => (i + 1) % imoveis.length);
    const prev = () => setActiveIndex(i => (i - 1 + imoveis.length) % imoveis.length);

    // Early return for loading state with skeleton UI
    if (isLoading) {
        return (
            <section ref={ref} id="properties" className="py-16 md:py-24 bg-white border-y border-stone-100 scroll-mt-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="h-8 w-64 bg-stone-200 rounded-lg animate-pulse mx-auto"></div>
                        <div className="h-4 w-96 bg-stone-200 rounded-lg animate-pulse mx-auto mt-4"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-96 bg-stone-200 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Error state UI
    if (error) {
        return (
            <section ref={ref} id="properties" className="py-16 md:py-24 bg-white border-y border-stone-100 scroll-mt-24">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-red-50 p-8 rounded-lg border border-red-100">
                        <h2 className="text-2xl font-bold text-red-800 mb-4">Erro ao carregar imóveis</h2>
                        <p className="text-red-700 mb-6">{error}</p>
                        <button
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            onClick={fetchImoveis}
                        >
                            Tentar novamente
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // Empty state UI
    if (imoveis.length === 0) {
        return (
            <section ref={ref} id="properties" className="py-16 md:py-24 bg-white border-y border-stone-100 scroll-mt-24">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-emerald-700 mb-4">Imóveis para Compra</h2>
                    <p className="text-stone-500 mb-8">No momento não temos imóveis em destaque. Confira todas as opções disponíveis.</p>
                    <Link href="/comprar" passHref>
                        <Button
                            variant="default"
                            size="lg"
                            className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
                        >
                            Ver todos os imóveis
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </section>
        );
    }

    return (<section
        ref={(el) => {
            // Ref combination technique - assign to both refs
            if (ref) {
                // @ts-ignore - TypeScript doesn't know about ref being callable
                if (typeof ref === 'function') ref(el);
                // @ts-ignore - TypeScript doesn't understand that ref might be an object
                else if (ref && 'current' in ref) ref.current = el;
            }
            if (sectionRef && el && 'current' in sectionRef) {
                (sectionRef as React.MutableRefObject<HTMLElement | null>).current = el;
            }
        }}
        id="properties"
        className="py-16 md:py-24 bg-white border-y border-stone-100 scroll-mt-24 relative overflow-hidden"
    >
        {/* Decorative elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-emerald-100/30 filter blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-emerald-50/20 filter blur-3xl"></div>

        {/* Main content */}
        <div className="container mx-auto px-4 relative">
            <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
            >
                <div className="inline-flex items-center justify-center px-4 py-1.5 bg-emerald-50 rounded-full mb-4">
                    <Building className="w-4 h-4 mr-2 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-600">Imóveis Selecionados</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-4">Encontre o Imóvel Perfeito para sua Família</h2>                <p className="text-stone-600 max-w-2xl mx-auto">
                    Seleção cuidadosa de propriedades em Guararema e região, escolhidas para atender às necessidades da sua família.
                </p>
            </motion.div>

            {/* Feature property - highlighted */}
            <motion.div
                className="mb-16 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="absolute -right-4 -top-4 px-3 py-1.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg shadow-lg z-10">
                    Destaque da Semana
                </div>
                <div className="p-4 lg:p-0 border border-emerald-100 rounded-xl bg-white shadow-xl lg:border-0 lg:shadow-none lg:bg-transparent">
                    <FeaturedPropertyCard
                        property={adaptImovelToClientType([imoveis[activeIndex]])[0]}
                    />
                </div>
            </motion.div>

            {/* Navigation controls */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-emerald-600" />
                    <h3 className="text-xl font-semibold text-emerald-800">
                        Outras Opções
                    </h3>
                </div>
                <div className="flex space-x-2">
                    <NavButton direction="prev" onClick={prev} disabled={imoveis.length <= 1} />
                    <NavButton direction="next" onClick={next} disabled={imoveis.length <= 1} />
                </div>
            </div>            {/* Property grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {imoveis.slice(0, 6).map((imovel) => (
                    <motion.div
                        key={imovel._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6 }}
                    >
                        <PropertyCardUnified
                            id={imovel._id}
                            title={imovel.titulo || 'Imóvel para venda'}
                            slug={imovel.slug as string || imovel._id}
                            location={imovel.bairro || 'Localização não informada'}
                            city={imovel.cidade}
                            price={imovel.preco || 0}
                            propertyType="sale"
                            area={imovel.areaUtil}
                            bedrooms={imovel.dormitorios}
                            bathrooms={imovel.banheiros}
                            parkingSpots={imovel.vagas}
                            mainImage={{
                                url: imovel.imagem?.imagemUrl || '/images/placeholder-property.jpg',
                                alt: imovel.imagem?.alt || imovel.titulo || 'Imóvel para venda',
                                sanityImage: imovel.imagem
                            }} isHighlight={imovel.destaque}
                            isFavorite={isFavorite(imovel._id)}
                            onFavoriteToggle={toggleFavorite}
                        />
                    </motion.div>
                ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-12">
                <Link href="/comprar" passHref>
                    <Button
                        variant="default"
                        size="lg"
                        className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
                    >
                        Descubra mais opções para sua família
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </Link>
                <p className="mt-4 text-stone-500 text-sm">
                    Nossa equipe está pronta para encontrar o imóvel ideal para você
                </p>
            </div>
        </div>
    </section>
    );
}
