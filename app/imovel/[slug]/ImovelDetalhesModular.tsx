"use client";

import React, { FC, useEffect } from 'react';
import { transformToUnifiedProperty, transformToUnifiedPropertyList } from '@/lib/unified-property-transformer';
import { useAnalytics } from '@/app/hooks/useAnalytics';
import { Building2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { ImovelClient as ImovelDataType } from '@/src/types/imovel-client';

// Importar todos os componentes modulares
import PropertyHeader from './components/PropertyHeader';
import PropertyGallery from './components/PropertyGallery';
import PropertyMainInfo from './components/PropertyMainInfo';
import PropertyBadges from './components/PropertyBadges';
import PropertyFeatures from './components/PropertyFeatures';
import PropertyDescription from './components/PropertyDescription';
import PropertyContact from './components/PropertyContact';
import RelatedProperties from './components/RelatedProperties';

interface ImovelDetalhesProps {
    imovel: ImovelDataType;
    relacionados?: ImovelDataType[];
    preco?: number;
}

const ImovelDetalhesModular: FC<ImovelDetalhesProps> = ({
    imovel,
    relacionados = [],
    preco
}) => {
    // Transform para o formato unificado
    const unifiedProperty = React.useMemo(() => {
        try {
            return transformToUnifiedProperty(imovel)
        } catch (error) {
            console.error('Erro ao transformar propriedade:', error)
            return null
        }
    }, [imovel])

    const unifiedRelated = React.useMemo(() => {
        return transformToUnifiedPropertyList(relacionados)
    }, [relacionados])

    // Analytics hook
    const {
        trackPropertyView,
        trackPropertyViewConversion,
        isEnabled: analyticsEnabled
    } = useAnalytics();

    // Track property view on component mount
    useEffect(() => {
        if (unifiedProperty && analyticsEnabled) {
            trackPropertyView({
                property_id: unifiedProperty.id,
                property_type: unifiedProperty.propertyType,
                price: unifiedProperty.price,
                location: unifiedProperty.location
            });

            trackPropertyViewConversion(unifiedProperty.id, unifiedProperty.price);
        }
    }, [unifiedProperty, analyticsEnabled, trackPropertyView, trackPropertyViewConversion]);

    // Verificação de segurança
    if (!unifiedProperty) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-slate-700 mb-2">Imóvel não encontrado</h2>
                    <p className="text-slate-500 mb-6">O imóvel que você está procurando não está mais disponível ou ocorreu um erro no carregamento.</p>
                    <Link
                        href="/catalogo"
                        className="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors inline-flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar ao catálogo
                    </Link>
                </div>
            </div>
        );
    }

    // Preparar dados para os componentes
    const images = unifiedProperty.gallery?.map(img => img.url) || [unifiedProperty.mainImage?.url].filter(Boolean) || [];

    const relatedPropertiesData = unifiedRelated.map(prop => ({
        id: prop.id,
        slug: prop.slug,
        title: prop.title,
        price: prop.price,
        location: prop.location,
        images: prop.gallery?.map(img => img.url) || [prop.mainImage?.url].filter(Boolean) || [],
        area: prop.area,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        parkingSpots: prop.parkingSpots,
        type: prop.propertyType
    }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 pt-16 sm:pt-18">
            {/* Header */}
            <PropertyHeader
                title={unifiedProperty.title}
                description={unifiedProperty.description}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
                <div className="lg:grid lg:grid-cols-3 lg:gap-8 space-y-6 lg:space-y-0">
                    {/* Coluna Principal */}
                    <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                        {/* Galeria de Imagens */}
                        <PropertyGallery
                            images={images}
                            propertyTitle={unifiedProperty.title}
                        />

                        {/* Informações Principais */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 lg:p-8 space-y-6">
                            {/* Badges de Status */}
                            <PropertyBadges
                                isPremium={unifiedProperty.isPremium}
                                status={unifiedProperty.status}
                                propertyType={unifiedProperty.propertyType}
                            />

                            {/* Título, Localização e Preço */}
                            <PropertyMainInfo
                                title={unifiedProperty.title}
                                location={unifiedProperty.location}
                                price={unifiedProperty.price}
                            />

                            {/* Características do Imóvel */}
                            <PropertyFeatures
                                area={unifiedProperty.area}
                                bedrooms={unifiedProperty.bedrooms}
                                bathrooms={unifiedProperty.bathrooms}
                                parkingSpots={unifiedProperty.parkingSpots}
                            />
                        </div>

                        {/* Descrição e Comodidades */}
                        <PropertyDescription
                            description={unifiedProperty.description}
                            amenities={unifiedProperty.amenities}
                        />

                        {/* Imóveis Relacionados */}
                        {relatedPropertiesData.length > 0 && (
                            <RelatedProperties
                                properties={relatedPropertiesData}
                                currentPropertyId={unifiedProperty.id}
                            />
                        )}
                    </div>

                    {/* Sidebar de Contato */}
                    <div className="lg:col-span-1">
                        <PropertyContact
                            phoneNumber="+5511981845016"
                            whatsappNumber="11981845016"
                            price={unifiedProperty.price}
                            propertyId={unifiedProperty.id}
                            propertyTitle={unifiedProperty.title}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImovelDetalhesModular;
