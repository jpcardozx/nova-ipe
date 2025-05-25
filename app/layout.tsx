import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat'
})

export const metadata: Metadata = {
  title: 'Ipê Imóveis - Especialistas em Imóveis Premium em Guararema | Compra, Venda e Locação',
  description: 'Descobra imóveis exclusivos em Guararema e região com a Ipê Imóveis. Mais de 15 anos de experiência em vendas, locações e investimentos imobiliários de alto padrão. Atendimento personalizado e consultoria especializada.',
  keywords: 'imóveis Guararema, casas para venda Guararema, apartamentos aluguel Guararema, imobiliária Guararema, investimento imobiliário, terrenos Guararema, condomínios fechados, imóveis premium, corretores especializados',
  authors: [{ name: 'Ipê Imóveis', url: 'https://novaipe.com.br' }],
  creator: 'Ipê Imóveis',
  publisher: 'Ipê Imóveis',
  category: 'Real Estate',
  classification: 'Business',
  openGraph: {
    title: 'Ipê Imóveis - Especialistas em Imóveis Premium em Guararema',
    description: 'Encontre o imóvel ideal em Guararema com nossa curadoria especializada. Vendas, locações e investimentos com a melhor imobiliária da região. Atendimento personalizado e exclusividade garantida.',
    url: 'https://novaipe.com.br',
    siteName: 'Ipê Imóveis',
    images: [
      {
        url: '/images/og-image-2025.jpg',
        width: 1200,
        height: 630,
        alt: 'Ipê Imóveis - Especialistas em Imóveis Premium em Guararema',
        type: 'image/jpeg',
      },
      {
        url: '/images/og-image-square.jpg',
        width: 800,
        height: 800,
        alt: 'Ipê Imóveis - Logo',
        type: 'image/jpeg',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
    countryName: 'Brazil',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ipê Imóveis - Imóveis Premium em Guararema',
    description: 'Especialistas em imóveis de alto padrão em Guararema. Encontre sua casa dos sonhos com atendimento personalizado e exclusividade.',
    images: ['/images/og-image-2025.jpg'],
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
    canonical: 'https://novaipe.com.br',
    languages: {
      'pt-BR': 'https://novaipe.com.br',
    },
  },
  other: {
    'msapplication-TileColor': '#1a6f5c',
    'theme-color': '#1a6f5c',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'format-detection': 'telephone=no',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-montserrat antialiased bg-white">
        {children}
      </body>
    </html>
  )
}