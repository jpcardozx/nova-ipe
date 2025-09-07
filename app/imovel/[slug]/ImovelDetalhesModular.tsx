"use client";

import React, { FC, useEffect, useState } from 'react';
import { transformToUnifiedProperty, transformToUnifiedPropertyList } from '@/lib/unified-property-transformer';
import { useAnalytics } from '@/app/hooks/useAnalytics';
import { Building2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { ImovelClient as ImovelDataType } from '@/src/types/imovel-client';

// Importar todos os componentes modulares
import PropertyHeader from './components/PropertyHeader';
import PropertyGallery from './components/PropertyGallery';
import PropertyGalleryMobile from './components/PropertyGalleryMobile';
import PropertyMainInfo from './components/PropertyMainInfo';
import PropertyBadges from './components/PropertyBadges';
import PropertyFeatures from './components/PropertyFeatures';
import PropertyDescription from './components/PropertyDescription';
import PropertyDetails from './components/PropertyDetails';
import LocationInfo from './components/LocationInfo';
import PropertySidebar from './components/PropertySidebar';
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

    // Estados locais
    const [isFavorite, setIsFavorite] = useState(false);

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

    // Preparar todas as imagens - incluir imagem principal + galeria
    const images = (() => {
        const galleryUrls = unifiedProperty.gallery?.map(img => img.url).filter(Boolean) || [];
        const mainImageUrl = unifiedProperty.mainImage?.url;

        // Combinar imagem principal com galeria, evitando duplicatas
        const allImages: string[] = [];

        // Adicionar imagem principal primeiro
        if (mainImageUrl && !galleryUrls.includes(mainImageUrl)) {
            allImages.push(mainImageUrl);
        }

        // Adicionar galeria
        allImages.push(...galleryUrls);

        // Se não tem nenhuma imagem, retornar array vazio
        return allImages.length > 0 ? allImages : [];
    })();

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
                isFavorite={isFavorite}
                onFavoriteToggle={() => setIsFavorite(!isFavorite)}
                onShare={() => {
                    if (navigator.share) {
                        navigator.share({
                            title: unifiedProperty.title,
                            text: unifiedProperty.description,
                            url: window.location.href
                        });
                    } else {
                        navigator.clipboard.writeText(window.location.href);
                    }
                }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8 space-y-8 lg:space-y-0">
                    {/* Coluna Principal */}
                    <div className="lg:col-span-8 space-y-6 sm:space-y-8">
                        {/* Galeria de Imagens - Mobile First */}
                        <div className="block sm:hidden">
                            <PropertyGalleryMobile
                                images={images}
                                propertyTitle={unifiedProperty.title}
                            />
                        </div>
                        <div className="hidden sm:block">
                            <PropertyGallery
                                images={images}
                                propertyTitle={unifiedProperty.title}
                            />
                        </div>

                        {/* Informações Principais */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 lg:p-8 space-y-6">
                            {/* Título, Localização e Preço */}
                            <PropertyMainInfo
                                title={unifiedProperty.title}
                                location={unifiedProperty.location}
                                price={unifiedProperty.price}
                                propertyType={unifiedProperty.propertyType}
                            />

                            {/* Características do Imóvel */}
                            <PropertyFeatures
                                area={unifiedProperty.area}
                                totalArea={unifiedProperty.totalArea}
                                bedrooms={unifiedProperty.bedrooms}
                                bathrooms={unifiedProperty.bathrooms}
                                parkingSpots={unifiedProperty.parkingSpots}
                            />
                        </div>

                        {/* CTA Mobile - Exibido apenas no mobile após as informações principais */}
                        <div className="block lg:hidden">
                            <PropertySidebar
                                phoneNumber="+5511981845016"
                                whatsappNumber="11981845016"
                                price={unifiedProperty.price}
                                propertyId={unifiedProperty.id}
                                propertyTitle={unifiedProperty.title}
                                acceptsFinancing={unifiedProperty.acceptsFinancing}
                                documentationOk={unifiedProperty.documentationOk}
                                features={unifiedProperty.features}
                                propertyTypeDetail={unifiedProperty.propertyTypeDetail}
                                publishedDate={unifiedProperty.publishedDate}
                                hasGarden={unifiedProperty.hasGarden}
                                hasPool={unifiedProperty.hasPool}
                                address={unifiedProperty.address}
                                codigo={unifiedProperty.codigo}
                            />
                        </div>

                        {/* Descrição */}
                        <PropertyDescription
                            description={unifiedProperty.description}
                        />

                        {/* Informações de Localização */}
                        <LocationInfo
                            city={unifiedProperty.city}
                            location={unifiedProperty.location}
                            address={unifiedProperty.address}
                        />

                        {/* Imóveis Relacionados */}
                        {relatedPropertiesData.length > 0 && (
                            <RelatedProperties
                                properties={relatedPropertiesData}
                                currentPropertyId={unifiedProperty.id}
                            />
                        )}
                    </div>

                    {/* Sidebar de Contato e Detalhes - Agrupados */}
                    <div className="hidden lg:block lg:col-span-4">
                        <PropertySidebar
                            phoneNumber="+5511981845016"
                            whatsappNumber="11981845016"
                            price={unifiedProperty.price}
                            propertyId={unifiedProperty.id}
                            propertyTitle={unifiedProperty.title}
                            acceptsFinancing={unifiedProperty.acceptsFinancing}
                            documentationOk={unifiedProperty.documentationOk}
                            features={unifiedProperty.features}
                            propertyTypeDetail={unifiedProperty.propertyTypeDetail}
                            publishedDate={unifiedProperty.publishedDate}
                            hasGarden={unifiedProperty.hasGarden}
                            hasPool={unifiedProperty.hasPool}
                            address={unifiedProperty.address}
                            codigo={unifiedProperty.codigo}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImovelDetalhesModular;
