'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface PropertyMetadataProps {
    property: {
        id: string;
        title: string;
        description?: string;
        price: number;
        address?: string;
        city: string;
        location: string;
        propertyType: 'sale' | 'rent';
        bedrooms?: number;
        bathrooms?: number;
        area?: number;
        features?: string[];
        mainImage: {
            url: string;
            alt: string;
        };
        images?: Array<{
            url: string;
            alt: string;
        }>;
        latitude?: number;
        longitude?: number;
        constructionYear?: number;
        slug: string;
    };
}

function PropertyMetadata({ property }: PropertyMetadataProps) {
    // Validação de segurança para garantir que property está definido
    if (!property) {
        console.error('PropertyMetadata recebeu property undefined');
        return null;
    }

    // Format price as BRL currency - with safety check
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(property.price || 0);

    // Generate JSON-LD for the property
    const propertySchema = {
        '@context': 'https://schema.org',
        '@type': 'RealEstateListing',
        url: `https://www.imobiliariaipe.com.br/imovel/${property.slug}`,
        name: property.title,
        description: property.description || `${property.title} em ${property.city}`,
        offers: {
            '@type': 'Offer',
            price: property.price,
            priceCurrency: 'BRL',
            availability: 'https://schema.org/InStock',
        },
        image: property.images?.map(img => img.url) || [property.mainImage.url],
        address: {
            '@type': 'PostalAddress',
            addressLocality: property.city,
            addressRegion: 'SP',
            addressCountry: 'BR',
            streetAddress: property.address || property.location,
        },
        datePosted: new Date().toISOString(),
        areaSize: property.area ? `${property.area} m²` : undefined,
        numberOfRooms: property.bedrooms,
        numberOfBathroomsTotal: property.bathrooms,
    };

    // Create additional property metadata
    const propertyType = property.propertyType === 'sale' ? 'Para venda' : 'Para locação';

    // Format features for display
    const featuresList = [
        property.area ? `${property.area}m²` : null,
        property.bedrooms ? `${property.bedrooms} ${property.bedrooms > 1 ? 'quartos' : 'quarto'}` : null,
        property.bathrooms ? `${property.bathrooms} ${property.bathrooms > 1 ? 'banheiros' : 'banheiro'}` : null,
        ...(property.features || [])
    ].filter(Boolean);

    // BreadcrumbList schema
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Início',
                item: 'https://www.imobiliariaipe.com.br'
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: property.propertyType === 'sale' ? 'Comprar' : 'Alugar',
                item: `https://www.imobiliariaipe.com.br/${property.propertyType === 'sale' ? 'comprar' : 'alugar'}`
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: property.title,
                item: `https://www.imobiliariaipe.com.br/imovel/${property.slug}`
            }
        ]
    };

    return (
        <>
            <Script id="property-schema" type="application/ld+json">
                {JSON.stringify(propertySchema)}
            </Script>

            <Script id="property-breadcrumb" type="application/ld+json">
                {JSON.stringify(breadcrumbSchema)}
            </Script>

            {/* Additional meta tags optimized for WhatsApp sharing */}
            <meta property="og:price:amount" content={property.price.toString()} />
            <meta property="og:price:currency" content="BRL" />
            <meta property="og:availability" content="instock" />
            <meta property="product:price:amount" content={property.price.toString()} />
            <meta property="product:price:currency" content="BRL" />
            <meta property="product:availability" content="instock" />
            <meta property="product:condition" content="new" />
            <meta property="product:retailer_item_id" content={property.id} />

            {/* WhatsApp-specific metadata for better previews */}
            <meta property="og:site_name" content="Nova Ipê Imobiliária" />
            <meta property="og:locale" content="pt_BR" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={`${property.title} - ${formattedPrice}`} />
            <meta property="whatsapp:title" content={`${property.title} | ${formattedPrice}`} />
            <meta property="whatsapp:description" content={`${propertyType} • ${featuresList.join(' • ')}`} />
        </>
    );
}

// Export both named and default for maximum compatibility
export { PropertyMetadata };
export default PropertyMetadata;
