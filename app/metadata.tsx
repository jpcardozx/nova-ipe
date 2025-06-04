import { Metadata } from 'next';

export const metadata: Metadata = {
    metadataBase: process.env.NODE_ENV === 'production'
        ? new URL('https://ipeimoveis.vercel.app')
        : new URL(`http://localhost:${process.env.PORT || 3002}`),
    title: {
        default: 'Ipê - Imóveis Selecionados em Guararema | Compra, Venda e Locação',
        template: '%s | Ipê Imóveis'
    },
    description: 'Descobra imóveis exclusivos em Guararema e região com a Ipê Imóveis. Mais de 15 anos de experiência em vendas, locações e investimentos imobiliários de alto padrão. Atendimento personalizado e consultoria especializada.',
    keywords: ['imóveis Guararema', 'casas para venda Guararema', 'apartamentos aluguel Guararema', 'imobiliária Guararema', 'investimento imobiliário', 'terrenos Guararema', 'condomínios fechados', 'imóveis premium', 'corretores especializados'],
    authors: [{ name: 'Ipê Imóveis', url: 'https://ipeimoveis.vercel.app' }],
    creator: 'Ipê Imóveis',
    publisher: 'Ipê Imóveis',
    category: 'Real Estate',
    classification: 'Business', icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
            { url: '/images/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/images/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/images/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
            { url: '/images/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
        shortcut: '/favicon.ico',
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
    }, openGraph: {
        title: 'Ipê - Imóveis Selecionados em Guararema',
        description: 'Encontre o imóvel ideal em Guararema com nossa curadoria especializada. Vendas, locações e investimentos com a melhor imobiliária da região. Atendimento personalizado e exclusividade garantida.',
        url: 'https://ipeimoveis.vercel.app',
        siteName: 'Ipê Imóveis',
        images: [
            {
                url: '/preview.png',
                width: 1200,
                height: 630,
                alt: 'Ipê Imóveis - Imóveis selecionados em Guararema',
                type: 'image/png',
            },
            {
                url: '/preview.png',
                width: 800,
                height: 800,
                alt: 'Ipê Imóveis - Logo',
                type: 'image/png',
            },
        ],
        locale: 'pt_BR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Ipê Imóveis - Imóveis Selecionados em Guararema',
        description: 'Especialistas e corretores imobiliários em Guararema e região. Encontre seu novo endereço com atendimento personalizado e eficiente.',
        images: ['/preview.png'],
        creator: '@ipeimoveisguararema',
        site: '@ipeimoveisguararema',
    },
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'verification-token-here',
        yandex: 'verification-token-here',
        yahoo: 'verification-token-here',
    },
    alternates: {
        canonical: 'https://ipeimoveis.vercel.app',
        languages: {
            'pt-BR': 'https://ipeimoveis.vercel.app',
        },
    },
    other: {
        'msapplication-TileColor': '#E6AA2C',
        'theme-color': '#E6AA2C',
        'mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'default',
        'format-detection': 'telephone=no',
    },
};
