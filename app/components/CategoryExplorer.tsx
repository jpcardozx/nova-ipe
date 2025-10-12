'use client';

import { memo } from 'react';
import { Home, Building2, MapPin, ArrowRight } from 'lucide-react';
import PropertyCategoryCard from './PropertyCategoryCard';
import Link from 'next/link';

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
    return (
        <section className={`mt-8 sm:mt-12 mb-6 sm:mb-8 ${className}`} aria-labelledby="category-explorer-heading">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <header className="text-center mb-6 sm:mb-8">
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

                {/* Category Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {CATEGORIES.map((category) => (
                        <PropertyCategoryCard
                            key={category.href}
                            {...category}
                        />
                    ))}
                </div>

                {/* Call to Action */}
                <footer className="text-center mt-6 sm:mt-8">
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
