import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Nova Ipê Imobiliária - Imóveis Premium em Guararema',
    description: 'Encontre propriedades exclusivas para compra e aluguel em Guararema e região. Atendimento personalizado e curadoria de imóveis de alto padrão.',
    keywords: 'imobiliária, Guararema, imóveis premium, comprar casa, alugar imóvel, investimento imobiliário',
    authors: [{ name: 'Nova Ipê Imobiliária' }],
    openGraph: {
        title: 'Nova Ipê Imobiliária - Imóveis Premium em Guararema',
        description: 'Encontre propriedades exclusivas para compra e aluguel em Guararema e região.',
        url: 'https://www.novaipe.com.br',
        siteName: 'Nova Ipê Imobiliária',
        locale: 'pt_BR',
        type: 'website',
        images: [
            {
                url: '/images/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Nova Ipê Imobiliária',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Nova Ipê Imobiliária - Imóveis Premium em Guararema',
        description: 'Encontre propriedades exclusivas para compra e aluguel em Guararema e região.',
        images: ['/images/og-image.jpg'],
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
    viewport: {
        width: 'device-width',
        initialScale: 1,
    },
    robots: {
        index: true,
        follow: true,
    },
}; 