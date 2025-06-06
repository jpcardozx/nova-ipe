import Script from 'next/script';

// Component for Organization Schema
export const OrganizationSchema = () => {
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'RealEstateAgent',
        name: 'Nova Ipê Imobiliária',
        alternateName: 'Ipê Imóveis',
        url: 'https://www.novaipe.com.br',
        logo: 'https://www.novaipe.com.br/images/logo.png',
        image: 'https://www.novaipe.com.br/images/og-image-2025.jpg',
        description: 'Imobiliária especializada em Guararema e região com atendimento personalizado e curadoria de imóveis premium.',
        email: 'contato@novaipe.com.br',
        telephone: '+551146958999',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Av. Exemplo, 1234',
            addressLocality: 'Guararema',
            addressRegion: 'SP',
            postalCode: '12345-678',
            addressCountry: 'BR'
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: '-23.4142',
            longitude: '-46.0370'
        },
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '09:00',
                closes: '18:00'
            },
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Saturday'],
                opens: '09:00',
                closes: '13:00'
            }
        ],
        sameAs: [
            'https://www.facebook.com/novaipe',
            'https://www.instagram.com/novaipe',
            'https://www.linkedin.com/company/nova-ipe'
        ],
        areaServed: {
            '@type': 'City',
            name: 'Guararema',
            sameAs: 'https://pt.wikipedia.org/wiki/Guararema'
        },
        priceRange: '$$',
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+551146958999',
            contactType: 'customer service',
            availableLanguage: ['Portuguese', 'English']
        }
    };

    return (
        <Script id="organization-schema" type="application/ld+json">
            {JSON.stringify(organizationSchema)}
        </Script>
    );
};

// Component for WebSite Schema
export const WebsiteSchema = () => {
    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Nova Ipê Imobiliária',
        url: 'https://www.novaipe.com.br',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://www.novaipe.com.br/busca?q={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
        },
        inLanguage: 'pt-BR'
    };

    return (
        <Script id="website-schema" type="application/ld+json">
            {JSON.stringify(websiteSchema)}
        </Script>
    );
};

// Component for BreadcrumbList Schema
export const BreadcrumbSchema = ({ items }: { items: Array<{ name: string, url: string }> }) => {
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url
        }))
    };

    return (
        <Script id="breadcrumb-schema" type="application/ld+json">
            {JSON.stringify(breadcrumbSchema)}
        </Script>
    );
};

// Component for LocalBusiness Schema (extended from Organization)
export const LocalBusinessSchema = () => {
    const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type': ['LocalBusiness', 'RealEstateAgent'],
        name: 'Nova Ipê Imobiliária',
        image: 'https://www.novaipe.com.br/images/storefront.jpg',
        '@id': 'https://www.novaipe.com.br/#business',
        url: 'https://www.novaipe.com.br',
        telephone: '+551146958999',
        priceRange: '$$',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Av. Exemplo, 1234',
            addressLocality: 'Guararema',
            addressRegion: 'SP',
            postalCode: '12345-678',
            addressCountry: 'BR'
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: '-23.4142',
            longitude: '-46.0370'
        },
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '09:00',
                closes: '18:00'
            },
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Saturday'],
                opens: '09:00',
                closes: '13:00'
            }
        ],
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '147'
        }
    };

    return (
        <Script id="local-business-schema" type="application/ld+json">
            {JSON.stringify(localBusinessSchema)}
        </Script>
    );
};

// Export combined component for convenience
export default function StructuredData() {
    return (
        <>
            <OrganizationSchema />
            <WebsiteSchema />
            <LocalBusinessSchema />
        </>
    );
}
