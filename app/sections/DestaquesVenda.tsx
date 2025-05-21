'use client'

import React, { useState, useEffect, FC, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Building, MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ImovelClient } from '@/types/imovel-client';
import ImovelCard from '../components/ImovelCard';
import { normalizeDocuments } from '../../lib/sanity-utils';
import { Button } from '../components/ui/Button';
import FeaturedProperty from '../components/ui/FeaturedProperty';

// Navigation button component
interface NavButtonProps {
    direction?: 'next' | 'prev';
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
            disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-brand-light hover:border-brand-green/20 hover:shadow-lg',
            'focus:outline-none focus:ring-2 focus:ring-brand-green/30'
        )}
        aria-label={direction === 'next' ? 'Próximo imóvel' : 'Imóvel anterior'}
    >
        {direction === 'next' ? (
            <ChevronRight className="w-5 h-5 text-brand-dark" />
        ) : (
            <ChevronLeft className="w-5 h-5 text-brand-dark" />
        )}
    </button>
);

// Hook de favoritos tipado
function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);

    // Carrega favoritos do localStorage apenas após montagem do componente
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const saved = window.localStorage.getItem('imoveis-favoritos');
        if (saved) setFavorites(JSON.parse(saved));
    }, []);

    // Salva favoritos no localStorage quando a lista é atualizada
    useEffect(() => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem('imoveis-favoritos', JSON.stringify(favorites));
    }, [favorites]);

    const isFavorite = (id: string) => favorites.includes(id);
    const toggleFavorite = (id: string) => {
        setFavorites((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    return { isFavorite, toggleFavorite };
}

const DestaquesVendaSection: FC = () => {
    const [imoveis, setImoveis] = useState<ImovelClient[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true,
    });
    const { isFavorite, toggleFavorite } = useFavorites();
    const sectionRef = useRef<HTMLElement>(null);

    // Use a useEffect to load data when component mounts or enters viewport
    useEffect(() => {
        if (inView && isLoading) fetchImoveis();
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
            // Use mock API for testing to avoid Sanity connection issues
            const response = await fetch('/api/mock');

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status}`);
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
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-brand-dark mb-4">Imóveis em Destaque</h2>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 max-w-xl mx-auto">
                        <p className="text-red-700 mb-4">{error}</p>
                        <Button
                            variant="default"
                            onClick={fetchImoveis}
                        >
                            Tentar novamente
                        </Button>
                    </div>
                </div>
            </section>
        );
    }

    // If no imóveis found
    if (imoveis.length === 0) {
        return (
            <section ref={ref} id="properties" className="py-16 md:py-24 bg-white border-y border-stone-100 scroll-mt-24">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-brand-dark mb-4">Imóveis para Compra</h2>
                    <p className="text-stone-500 mb-8">Não há imóveis em destaque no momento.</p>
                </div>
            </section>
        );
    }

    return (
        <section
            ref={sectionRef}
            id="properties"
            className="py-16 md:py-24 bg-white border-y border-stone-100 scroll-mt-24 relative overflow-hidden"
        >
            {/* Decorative elements */}
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-brand-light/30 filter blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent-yellow/10 filter blur-3xl"></div>

            {/* Main content */}
            <div className="container mx-auto px-4 relative">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center justify-center px-4 py-1.5 bg-brand-light rounded-full mb-4">
                        <Building className="w-4 h-4 mr-2 text-brand-green" />
                        <span className="text-sm font-medium text-brand-green">Imóveis Selecionados</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">Encontre o Imóvel Perfeito</h2>
                    <p className="text-stone-600 max-w-2xl mx-auto">
                        Curadoria exclusiva de propriedades em Guararema e região, escolhidas pelos nossos especialistas com 15 anos de experiência no mercado imobiliário.
                    </p>
                </motion.div>

                {/* Feature property - highlighted */}
                <motion.div
                    className="mb-16 relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="absolute -right-4 -top-4 px-3 py-1.5 bg-brand-green text-white text-sm font-semibold rounded-lg shadow-lg z-10">
                        Destaque da Semana
                    </div>
                    <div className="p-4 lg:p-0 border border-brand-green/20 rounded-xl bg-white shadow-xl lg:border-0 lg:shadow-none lg:bg-transparent">
                        <FeaturedProperty
                            property={imoveis[activeIndex]}
                        />
                    </div>
                </motion.div>

                {/* Navigation controls */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-brand-green" />
                        <h3 className="text-xl font-semibold text-brand-dark">
                            Últimas Adições
                        </h3>
                    </div>
                    <div className="flex space-x-2">
                        <NavButton direction="prev" onClick={prev} disabled={imoveis.length <= 1} />
                        <NavButton direction="next" onClick={next} disabled={imoveis.length <= 1} />
                    </div>
                </div>

                {/* Property grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {imoveis.slice(0, 6).map((imovel, idx) => (
                        <AnimatePresence key={imovel._id} mode="wait">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <ImovelCard
                                    imovel={imovel}
                                    isFavorite={isFavorite(imovel._id)}
                                    onFavoriteToggle={toggleFavorite}
                                    labelNovo={idx === 0 || idx === 2} // Marcar alguns como novos para demonstração
                                />
                            </motion.div>
                        </AnimatePresence>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <Link href="/comprar" passHref>
                        <Button
                            variant="accent"
                            size="lg"
                            rightIcon={<ArrowRight className="w-4 h-4 ml-2" />}
                        >
                            Ver todos os imóveis à venda
                        </Button>
                    </Link>
                    <p className="mt-4 text-stone-500 text-sm">
                        <MapPin className="w-3.5 h-3.5 inline-block mr-1" />
                        Mais de 120 propriedades disponíveis em Guararema e região
                    </p>
                </div>
            </div>
        </section>
    );
};

export default DestaquesVendaSection;
