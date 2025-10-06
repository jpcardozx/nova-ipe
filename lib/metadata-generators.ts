import { Metadata } from 'next';

// This function generates site-wide metadata
export function generateSiteMetadata(): Metadata {
    // Base domain for absolute URLs
    const domain = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.imobiliariaipe.com.br';

    return {
        title: 'Nova Ipê Imobiliária - Imóveis Premium em Guararema',
        description: 'Encontre propriedades exclusivas para compra e aluguel em Guararema e região. Atendimento personalizado e curadoria de imóveis de alto padrão.',
        keywords: 'imobiliária, Guararema, imóveis premium, comprar casa, alugar imóvel, investimento imobiliário',
        openGraph: {
            type: 'website',
            locale: 'pt_BR',
            url: domain,
            siteName: 'Nova Ipê Imobiliária',
            title: 'Nova Ipê Imobiliária - Imóveis Premium em Guararema',
            description: 'Encontre propriedades exclusivas para compra e aluguel em Guararema e região. Atendimento personalizado e curadoria de imóveis de alto padrão.',
            images: [
                {
                    url: `${domain}/images/og-image-2025.jpg`,
                    width: 1200,
                    height: 630,
                    alt: 'Nova Ipê Imobiliária - Imóveis Premium em Guararema',
                },
                {
                    url: `${domain}/images/og-image-square.jpg`,
                    width: 1080,
                    height: 1080,
                    alt: 'Nova Ipê Imobiliária',
                },
            ],
        }
    };
}

// This function generates metadata for individual property pages
export function generatePropertyMetadata(property: {
    id?: string;
    title: string;
    location: string;
    city: string;
    price: number;
    propertyType: 'sale' | 'rent';
    area?: number;
    bedrooms?: number;
    bathrooms?: number;
    parkingSpots?: number;
    mainImage: { url: string; alt: string };
    images?: Array<{ url: string; alt: string }>;
    description?: string;
    address?: string;
    features?: string[];
    latitude?: number;
    longitude?: number;
    slug: string;
}): Metadata {
    // Format price as BRL currency
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(property.price);

    // Create property features text
    const features = [
        property.area ? `${property.area}m²` : null,
        property.bedrooms ? `${property.bedrooms} ${property.bedrooms > 1 ? 'quartos' : 'quarto'}` : null,
        property.bathrooms ? `${property.bathrooms} ${property.bathrooms > 1 ? 'banheiros' : 'banheiro'}` : null,
        property.parkingSpots ? `${property.parkingSpots} ${property.parkingSpots > 1 ? 'vagas' : 'vaga'}` : null,
        ...(property.features || []),
    ].filter(Boolean);

    const featuresText = features.join(' • ');

    // Set property transaction type text
    const propertyTypeText = property.propertyType === 'sale' ? 'à venda' : 'para alugar';
    const propertyTypePrefix = property.propertyType === 'sale' ? 'Comprar:' : 'Alugar:';

    // Create property description with rich information
    const description = property.description ||
        `${property.title} com ${featuresText} ${propertyTypeText} em ${property.city}. ${formattedPrice}${property.propertyType === 'rent' ? '/mês' : ''}. Conheça esta propriedade exclusiva da Nova Ipê Imobiliária.`;

    // Create title with dynamic information optimized for visibility
    const title = `${property.title} | ${formattedPrice}${property.propertyType === 'rent' ? '/mês' : ''} | Nova Ipê Imobiliária`;

    // Create canonical URL
    const canonicalUrl = `https://www.imobiliariaipe.com.br/imovel/${property.slug}`;

    // Get image URLs ensuring we have all required formats
    const mainImageUrl = property.mainImage?.url || '/images/og-image-2025.jpg';
    const squareImageUrl = property.images?.[0]?.url || mainImageUrl;
    const whatsappImageUrl = property.images?.[1]?.url || squareImageUrl;

    // Generate metadata with enhanced social sharing support
    return {
        title,
        description,
        keywords: [
            'imóvel',
            property.city,
            property.location,
            property.propertyType === 'sale' ? 'comprar' : 'alugar',
            property.propertyType === 'sale' ? 'venda' : 'locação',
            property.bedrooms ? `${property.bedrooms} quartos` : '',
            property.area ? `${property.area}m²` : '',
            ...(property.features || []),
        ].filter(Boolean).join(', '),
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            siteName: 'Nova Ipê Imobiliária',
            locale: 'pt_BR',
            type: 'website',
            images: [
                {
                    url: mainImageUrl,
                    width: 1200,
                    height: 630,
                    alt: `${property.title} - ${formattedPrice}`,
                },
                {
                    url: squareImageUrl,
                    width: 1080,
                    height: 1080,
                    alt: `${property.title} - ${formattedPrice}`,
                },
                {
                    url: whatsappImageUrl,
                    width: 400,
                    height: 400,
                    alt: `${property.title} - ${formattedPrice}`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [mainImageUrl],
            site: '@novaipe',
            creator: '@novaipe',
        },
        other: {
            // WhatsApp specific metadata - enhances preview cards
            'whatsapp-platform': 'true',
            'whatsapp:image': whatsappImageUrl,
            'whatsapp:title': `${propertyTypePrefix} ${property.title} | ${formattedPrice}`,
            'whatsapp:description': `${featuresText} • ${property.city}`,

            // Product metadata for rich previews
            'og:price:amount': property.price.toString(),
            'og:price:currency': 'BRL',
            'og:availability': 'instock',
            'product:price:amount': property.price.toString(),
            'product:price:currency': 'BRL',
            'product:availability': 'instock',
            'product:condition': property.propertyType === 'sale' ? 'new' : 'instock',
            'product:retailer_item_id': property.id || '',

            // Property-specific OpenGraph tags
            'og:price': formattedPrice,
            'og:street_address': property.address || property.location,
            'og:locality': property.city,
            'og:region': 'SP',
            'og:country_name': 'Brasil',
        },
    };
}

// This function generates metadata for listing pages (alugar, comprar)
export function generateListingPageMetadata(type: 'rent' | 'sale', count?: number): Metadata {
    const isRent = type === 'rent';

    const title = isRent
        ? 'Imóveis para Alugar em Guararema | Nova Ipê Imobiliária'
        : 'Imóveis à Venda em Guararema | Nova Ipê Imobiliária';

    const description = isRent
        ? `${count ? `${count} imóveis` : 'Imóveis'} disponíveis para alugar em Guararema e região. Casas, apartamentos e imóveis comerciais com localização privilegiada.`
        : `${count ? `${count} imóveis` : 'Imóveis'} à venda em Guararema e região. Encontre a casa dos seus sonhos com a Nova Ipê Imobiliária.`;

    const canonicalUrl = `https://www.imobiliariaipe.com.br/${isRent ? 'alugar' : 'comprar'}`;

    return {
        title,
        description,
        keywords: `${isRent ? 'alugar, locação' : 'comprar, venda'}, imóveis, Guararema, casas, apartamentos`,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            siteName: 'Nova Ipê Imobiliária',
            locale: 'pt_BR',
            type: 'website',
            images: [
                {
                    url: `/images/og-${isRent ? 'rent' : 'sale'}.jpg`,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [`/images/og-${isRent ? 'rent' : 'sale'}.jpg`],
        },
    };
}
