'use client';

import { useState } from 'react';
import { useSanityImage } from '../hooks/useSanityImage';
import { useSanityProperties } from '../hooks/useSanityProperties';
import ResponsiveSanityImage from './ResponsiveSanityImage';
import OptimizedSanityImage from './OptimizedSanityImage';
import { cn } from '@/lib/utils';

/**
 * Este componente demonstra o uso das diferentes técnicas de
 * otimização de imagens do Sanity em nosso projeto
 */
export default function SanityImagesShowcase({ properties }: { properties: any[] }) {
    const [selectedProperty, setSelectedProperty] = useState<number>(0);
    const [viewMode, setViewMode] = useState<'basic' | 'responsive' | 'hook'>('basic');

    // Usar o hook para processar as propriedades com otimização
    const { properties: processedProperties, isLoading } = useSanityProperties(properties, {
        sortBy: 'date',
        sortDirection: 'desc',
        limit: 5
    });

    const property = processedProperties[selectedProperty];

    // Para demonstração do hook useSanityImage
    const imageOptions = property ? {
        image: property.mainImage,
        fallbackUrl: '/images/property-placeholder.jpg',
        alt: property.title,
        responsiveSizes: {
            'xs': { width: 320, height: 240, quality: 70 },
            'md': { width: 640, height: 480, quality: 80 },
            'lg': { width: 1200, height: 800, quality: 85 }
        },
        sizesAttribute: {
            'xs': '100vw',
            'md': '75vw',
            'lg': '50vw'
        },
        lazyLoad: false
    } : null;

    // Hook deve ser chamado incondicionalmente para seguir as regras do React
    const imageProps = useSanityImage(imageOptions || {
        image: null,
        fallbackUrl: '/images/property-placeholder.jpg',
        alt: 'Imagem não disponível',
        responsiveSizes: {
            'xs': { width: 320, height: 240, quality: 70 },
            'md': { width: 640, height: 480, quality: 80 },
            'lg': { width: 1200, height: 800, quality: 85 }
        },
        sizesAttribute: {
            'xs': '100vw',
            'md': '75vw',
            'lg': '50vw'
        },
        lazyLoad: false
    });

    if (isLoading) {
        return <div className="flex items-center justify-center h-64 bg-gray-100">Carregando...</div>;
    }

    if (!property) {
        return <div className="flex items-center justify-center h-64 bg-gray-100">Nenhuma propriedade disponível</div>;
    }

    return (
        <div className="space-y-8 p-6 bg-white rounded-xl shadow-lg">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-800">Demonstração de Otimizações de Imagens</h2>
                <p className="text-gray-600">
                    Compare diferentes técnicas de otimização de imagens Sanity
                </p>
            </div>

            {/* Seleção de propriedade */}
            <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Selecione um imóvel:</span>
                <div className="flex space-x-2">
                    {processedProperties.map((prop: { id: string }, idx: number) => (
                        <button
                            key={prop.id}
                            onClick={() => setSelectedProperty(idx)}
                            className={cn(
                                "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                                selectedProperty === idx
                                    ? "bg-amber-500 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            )}
                        >
                            Imóvel {idx + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* Seleção de modo de visualização */}
            <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Técnica de otimização:</span>
                <div className="flex space-x-2">
                    {(['basic', 'responsive', 'hook'] as const).map(mode => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            className={cn(
                                "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                                viewMode === mode
                                    ? "bg-amber-500 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            )}
                        >
                            {mode === 'basic' ? 'Básico' : mode === 'responsive' ? 'Responsivo' : 'Hook Avançado'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Demonstração da imagem */}
            <div className="border border-gray-200 rounded-lg p-4">
                <div className="mb-4">
                    <h3 className="font-bold text-lg text-amber-700">{property.title}</h3>
                    <p className="text-gray-600">{property.location}, {property.city}</p>
                    <p className="font-semibold text-gray-800">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price)}
                    </p>
                </div>

                <div className="aspect-video w-full relative">
                    {viewMode === 'basic' && (
                        <div className="h-full">
                            <OptimizedSanityImage
                                image={property.mainImage}
                                alt={property.title}
                                width={800}
                                height={450}
                                className="w-full h-full"
                            />
                            <div className="mt-2 bg-gray-100 p-2 text-sm">
                                <h4 className="font-medium">OptimizedSanityImage</h4>
                                <p>Componente simples com cache e tratamento de erros</p>
                            </div>
                        </div>
                    )}

                    {viewMode === 'responsive' && (
                        <div className="h-full">
                            <ResponsiveSanityImage
                                image={property.mainImage}
                                alt={property.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 75vw"
                                className="w-full h-full"
                            />
                            <div className="mt-2 bg-gray-100 p-2 text-sm">
                                <h4 className="font-medium">ResponsiveSanityImage</h4>
                                <p>Componente com art direction e hotspot automático</p>
                            </div>
                        </div>
                    )}

                    {viewMode === 'hook' && imageProps && (
                        <div className="h-full">
                            <div className="relative h-full bg-gray-100">
                                <img
                                    src={imageProps.url}
                                    alt={imageProps.alt}
                                    sizes={imageProps.sizes}
                                    srcSet={imageProps.getSrcSet()}
                                    loading={imageProps.loading}
                                    className="w-full h-full object-cover"
                                    style={{
                                        objectPosition: imageProps.hotspot
                                            ? `${imageProps.hotspot.x * 100}% ${imageProps.hotspot.y * 100}%`
                                            : 'center'
                                    }}
                                />
                            </div>
                            <div className="mt-2 bg-gray-100 p-2 text-sm">
                                <h4 className="font-medium">useSanityImage Hook</h4>
                                <p>Hook avançado com controle total sobre tamanhos e breakpoints</p>
                            </div>
                        </div>
                    )}
                </div>

                {viewMode === 'hook' && imageProps && (
                    <div className="mt-4 p-3 bg-gray-50 rounded text-xs font-mono overflow-x-auto">
                        <div className="mb-2 text-sm font-medium text-gray-700">Dados técnicos:</div>
                        <pre>{JSON.stringify({
                            mainUrl: imageProps.url.substring(0, 50) + '...',
                            sizes: imageProps.sizes,
                            hasHotspot: !!imageProps.hotspot,
                            screenSizes: Object.keys(imageProps.urls),
                        }, null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}
