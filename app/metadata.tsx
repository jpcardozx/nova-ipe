import { Metadata } from 'next';

export const metadata: Metadata = {
    metadataBase: process.env.NODE_ENV === 'production'
        ? new URL('https://imobiliariaipe.com.br')
        : new URL(`http://localhost:${process.env.PORT || 3002}`),
    title: {
        default: 'Ipê - Imóveis Selecionados em Guararema | Compra, Venda e Locação',
        template: '%s | Ipê Imóveis'
    },
    description: 'Descobra imóveis exclusivos em Guararema e região com a Ipê Imóveis. Mais de 15 anos de experiência em vendas, locações e investimentos imobiliários de alto padrão. Atendimento personalizado e consultoria especializada.',
    keywords: ['imóveis Guararema', 'casas para venda Guararema', 'apartamentos aluguel Guararema', 'imobiliária Guararema', 'investimento imobiliário', 'terrenos Guararema', 'condomínios fechados', 'imóveis premium', 'corretores especializados'],
    authors: [{ name: 'Ipê Imóveis', url: 'https://imobiliariaipe.com.br' }],
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
        title: 'Ipê Imóveis - Imóveis Selecionados em Guararema',
        description: 'Consultoria imobiliária especializada há 15 anos. Encontre o imóvel ideal em Guararema com nossa expertise em vendas, locações e investimentos de alto padrão.',
        url: 'https://imobiliariaipe.com.br',
        siteName: 'Ipê Imóveis',
        images: [
            {
                url: '/images/ipe-social-banner.png',
                width: 1200,
                height: 630,
                alt: 'Ipê Imóveis - Consultoria Imobiliária Especializada em Guararema',
                type: 'image/png',
            },
        ],
        locale: 'pt_BR',
        type: 'website',
    }, twitter: {
        card: 'summary_large_image',
        title: 'Ipê Imóveis - Consultoria Imobiliária em Guararema',
        description: 'Especialistas em imóveis selecionados em Guararema e região. 15 anos de experiência em vendas, locações e investimentos.',
        images: ['/images/ipe-social-banner.png'],
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
        canonical: 'https://imobiliariaipe.com.br',
        languages: {
            'pt-BR': 'https://imobiliariaipe.com.br',
        },
    }, other: {
        'msapplication-TileColor': '#E6AA2C',
        'theme-color': '#E6AA2C',
        'mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'default',
        'format-detection': 'telephone=no',
        'og:image:width': '1200',
        'og:image:height': '630',
        'fb:app_id': '1234567890123456', // Replace with your actual Facebook App ID
    },
    manifest: '/manifest.webmanifest',
};
