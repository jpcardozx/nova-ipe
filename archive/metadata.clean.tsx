import { Metadata } from 'next';

export const metadata: Metadata = {
    metadataBase: process.env.NODE_ENV === 'production'
        ? new URL('https://ipeimoveis.vercel.app')
        : new URL(`http://localhost:${process.env.PORT || 3002}`),
    title: {
        default: 'Ipê Imóveis - Operações Imobiliárias em Guararema',
        template: '%s | Ipê Imóveis'
    },
    description: 'Imóveis exclusivos para compra e aluguel em Guararema. Atendimento personalizado e curadoria de alto padrão.',

    openGraph: {
        title: 'Ipê Imóveis - Operações Imobiliárias em Guararema',
        description: 'Encontre propriedades exclusivas com atendimento personalizado em Guararema.',
        url: 'https://ipeimoveis.vercel.app',
        siteName: 'Ipê Imóveis',
        images: [
            {
                url: '/preview.png',
                width: 1200,
                height: 630,
                alt: 'Preview da Ipê Imóveis'
            }
        ],
        locale: 'pt_BR',
        type: 'website'
    },

    twitter: {
        card: 'summary_large_image',
        title: 'Ipê Imóveis - Operações Imobiliárias em Guararema',
        description: 'Encontre propriedades exclusivas com atendimento personalizado em Guararema.',
        images: ['/preview.png']
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1
        }
    },

    verification: {
        google: 'sua-chave-de-verificacao-google'
    }
};
