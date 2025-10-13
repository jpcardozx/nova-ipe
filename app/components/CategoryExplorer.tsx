'use client';

import { memo } from 'react';
import { Home, Building2, MapPin, ArrowRight } from 'lucide-react';
import PropertyCategoryCard from './PropertyCategoryCard';
import Link from 'next/link';
import { useCarousel } from '@/app/hooks/useCarousel';
import { cn } from '@/lib/utils';

interface CategoryExplorerProps {
    className?: string;
}

const CATEGORIES = [
    {
        href: '/catalogo?tipo=casa',
        title: 'Casas',
        description: 'Residenciais completas',
        imageSrc: '/images/imagensHero/casasHero.webp',
        imageAlt: 'Casas Residenciais',
        icon: Home,
        colorScheme: 'blue' as const,
    },
    {
        href: '/catalogo?tipo=sitio',
        title: 'Sítios',
        description: 'Propriedades rurais',
        imageSrc: '/images/imagensHero/sitiosHero.webp',
        imageAlt: 'Sítios e Chácaras',
        icon: Building2,
        colorScheme: 'green' as const,
    },
    {
        href: '/catalogo?tipo=terreno',
        title: 'Terrenos',
        description: 'Lotes para construir',
        imageSrc: '/images/imagensHero/terrenosHero.webp',
        imageAlt: 'Terrenos para Construção',
        icon: MapPin,
        colorScheme: 'amber' as const,
    },
] as const;

const CategoryExplorer = memo(function CategoryExplorer({ className = '' }: CategoryExplorerProps) {
    const { emblaRef, selectedIndex, scrollSnaps, scrollTo } = useCarousel({
        options: { loop: false, align: 'start' },
    });

    return (
        <section className={`mt-8 sm:mt-12 mb-6 sm:mb-8 ${className}`} aria-labelledby="category-explorer-heading">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <header className="text-center mb-6 sm:mb-8 px-4">
                    <h3 
                        id="category-explorer-heading"
                        className="text-white text-xl sm:text-2xl font-bold mb-3"
                    >
                        Explore por Categoria
                    </h3>
                    <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto">
                        Encontre o imóvel para você entre nossas principais categorias
                    </p>
                </header>

                {/* Mobile: Carrossel Horizontal */}
                <div className="md:hidden mb-6">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex gap-4 px-4">
                            {CATEGORIES.map((category) => (
                                <div 
                                    key={category.href}
                                    className="flex-[0_0_85%] min-w-0"
                                >
                                    <PropertyCategoryCard {...category} />
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Dots de Navegação */}
                    <div className="flex justify-center gap-2 mt-4">
                        {scrollSnaps.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => scrollTo(idx)}
                                className={cn(
                                    "h-2 rounded-full transition-all duration-300",
                                    idx === selectedIndex 
                                        ? "w-8 bg-amber-500" 
                                        : "w-2 bg-slate-600 hover:bg-slate-500"
                                )}
                                aria-label={`Ir para slide ${idx + 1}`}
                                aria-current={idx === selectedIndex ? 'true' : 'false'}
                            />
                        ))}
                    </div>
                </div>

                {/* Desktop: Grid Normal */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4">
                    {CATEGORIES.map((category) => (
                        <PropertyCategoryCard
                            key={category.href}
                            {...category}
                        />
                    ))}
                </div>

                {/* Call to Action */}
                <footer className="text-center mt-6 sm:mt-8 px-4">
                    <div className="inline-flex items-center gap-2 bg-slate-900/60 backdrop-blur-xl border border-amber-400/20 rounded-xl px-4 py-2">
                        <span className="text-slate-300 text-sm">
                            Não encontrou o que procura?
                        </span>
                        <Link
                            href="/catalogo"
                            className="text-amber-400 hover:text-amber-300 font-semibold transition-colors text-sm inline-flex items-center gap-1"
                            prefetch={false}
                        >
                            Ver todos os imóveis
                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </Link>
                    </div>
                </footer>
            </div>
        </section>
    );
});

export default CategoryExplorer;
