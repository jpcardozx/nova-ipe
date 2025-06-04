'use client';

import React, { useEffect, useState } from 'react';
import { OptimizedPropertyCarousel } from './OptimizedPropertyCarousel';
import { getImoveisDestaqueVenda, getImoveisAluguel } from '@/lib/queries';
import { loadImage } from '@/lib/enhanced-image-loader';
import { extractSlugString } from '@/app/PropertyTypeFix';
import type { ImovelClient } from '@/src/types/imovel-client';
import type { PropertyType, PropertyCardUnifiedProps as PropertyCardProps } from '@/app/components/ui/property/PropertyCardUnified';

interface ClientPropertySectionProps {
    type: 'sale' | 'rent';
    title: string;
    subtitle: string;
    viewAllLink: string;
    viewAllLabel: string;
    className?: string;
}

function transformPropertyData(imovel: ImovelClient, propertyType: PropertyType): PropertyCardProps | null {
    try {
        if (!imovel || !imovel._id) return null;

        const processedImage = loadImage(
            imovel.imagem,
            '/images/property-placeholder.jpg',
            imovel.titulo || 'Imóvel'
        );

        const slug = extractSlugString(imovel.slug);
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

        return {
            id: imovel._id,
            title: imovel.titulo || 'Imóvel disponível',
            slug: slug || `imovel-${imovel._id}`,
            location: imovel.bairro || 'Guararema',
            city: 'Guararema',
            price: imovel.preco || 0,
            propertyType,
            area: imovel.areaUtil,
            bedrooms: imovel.dormitorios,
            bathrooms: imovel.banheiros,
            parkingSpots: imovel.vagas, mainImage: {
                url: processedImage.url || '/images/property-placeholder.jpg',
                alt: processedImage.alt || 'Imagem do imóvel'
            },
            isHighlight: Boolean(imovel.destaque),
            isPremium: Boolean(imovel.destaque),
            isNew: Boolean(imovel.dataPublicacao && new Date(imovel.dataPublicacao) > new Date(thirtyDaysAgo))
        };
    } catch (error) {
        console.error(`Erro ao transformar imóvel: ${error}`);
        return null;
    }
}

export function ClientPropertySection({ type, title, subtitle, viewAllLink, viewAllLabel, className }: ClientPropertySectionProps) {
    const [properties, setProperties] = useState<PropertyCardProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProperties() {
            try {
                setLoading(true);
                setError(null);

                const fetchFunction = type === 'sale' ? getImoveisDestaqueVenda : getImoveisAluguel;
                const propertyType: PropertyType = type === 'sale' ? 'sale' : 'rent';

                const imoveis = await fetchFunction();
                const transformedProperties = imoveis
                    .map(imovel => transformPropertyData(imovel, propertyType))
                    .filter(Boolean) as PropertyCardProps[];

                setProperties(transformedProperties);
            } catch (err) {
                console.error('Erro ao buscar propriedades:', err);
                setError('Erro ao carregar propriedades. Tente novamente.');
            } finally {
                setLoading(false);
            }
        }

        fetchProperties();
    }, [type]);

    if (loading) {
        return (
            <section className={className}>
                <div className="container mx-auto px-6">
                    <div className="min-h-[400px] bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 animate-pulse rounded-lg" />
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className={className}>
                <div className="container mx-auto px-6">
                    <div className="min-h-[200px] flex items-center justify-center bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-lg">
                        <p className="text-neutral-600">{error}</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={className}>
            <div className="container mx-auto px-6">
                <OptimizedPropertyCarousel
                    properties={properties.map(p => ({ ...p, location: p.location || '' }))}
                    title={title}
                    subtitle={subtitle}
                    variant="featured"
                    slidesToShow={3}
                    showControls={true}
                    autoplay={true}
                    autoplayInterval={type === 'sale' ? 6000 : 7000}
                    viewAllLink={viewAllLink}
                    viewAllLabel={viewAllLabel}
                    hasAccentBackground={true}
                />
            </div>
        </section>
    );
}
