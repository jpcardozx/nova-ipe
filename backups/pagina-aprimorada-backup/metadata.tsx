import { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        template: '%s | Ipê Imobiliária Guararema',
        default: 'Ipê Imobiliária | Seu Refúgio em Guararema',
    },
    description: 'Encontre seu imóvel ideal em Guararema. Especialistas locais há 13 anos, oferecendo as melhores oportunidades com valorização acima da média do mercado.',
    keywords: ['Imóveis Guararema', 'Comprar casa Guararema', 'Imobiliária Guararema', 'Casa em Guararema', 'Terrenos Guararema'],
    authors: [{ name: 'Ipê Imobiliária' }],
    creator: 'Ipê Imobiliária',
    publisher: 'Ipê Imobiliária',
    formatDetection: {
        email: true,
        address: true,
        telephone: true,
    },
    metadataBase: new URL('https://www.ipe-imoveis.com.br'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        images: '/images/og-image-ipe-2025.jpg',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};
