import { Metadata } from 'next';
import { generateSiteMetadata } from '@/lib/metadata-generators';

// Use the centralized metadata generator for consistent site metadata
export const metadata: Metadata = {
    ...generateSiteMetadata(),
    // Add any site-specific overrides here if needed
    title: 'Nova Ipê Imobiliária - Imóveis Premium em Guararema',
    description: 'Encontre propriedades exclusivas para compra e aluguel em Guararema e região. Atendimento personalizado e curadoria de imóveis de alto padrão.',
    keywords: 'imobiliária, Guararema, imóveis premium, comprar casa, alugar imóvel, investimento imobiliário',
    twitter: {
        card: 'summary_large_image',
        title: 'Nova Ipê Imobiliária - Imóveis Premium em Guararema',
        description: 'Encontre propriedades exclusivas para compra e aluguel em Guararema e região.',
        images: ['/images/og-image-2025.jpg'],
        creator: '@novaipe',
    }, other: {
        'fb:app_id': '123456789',
        'whatsapp-platform': 'true', // Optimizes for WhatsApp
        'whatsapp:card': 'summary_large_image',
        'whatsapp:creator': '@novaipe',
        'whatsapp:domain': 'novaipe.com.br',
        'theme-color': '#0D1F2D',
        'msapplication-TileColor': '#0D1F2D',
        'msapplication-config': '/browserconfig.xml',
        // Adicionando meta tags específicas para compatibilidade com WhatsApp
        'og:image:width': '1200',
        'og:image:height': '630',
        'og:image:alt': 'Nova Ipê Imobiliária - Imóveis Premium em Guararema',
        'og:locale': 'pt_BR',
    },
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/icon.svg', type: 'image/svg+xml' }
        ],
        shortcut: '/favicon.ico',
        apple: [
            { url: '/apple-touch-icon.png' },
            { url: '/apple-touch-icon-180x180.png', sizes: '180x180', type: 'image/png' },
        ],
        other: [
            { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#0D1F2D' },
        ],
    }, viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 5,
    },
    themeColor: '#0D1F2D',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-video-preview': -1,
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'verification_token_here',
        yandex: 'verification_token_here',
    }
};