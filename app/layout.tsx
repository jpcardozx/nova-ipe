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
  title: 'Ipê Imóveis - Encontre seu Imóvel dos Sonhos em Guararema',
  description: 'Descobra imóveis incríveis em Guararema e região com a Ipê Imóveis. Especialistas em venda e locação de propriedades com valorização garantida.',
  keywords: 'imóveis Guararema, casas para venda, apartamentos aluguel, imobiliária Guararema, investimento imobiliário',
  openGraph: {
    title: 'Ipê Imóveis - Especialistas em Imóveis em Guararema',
    description: 'Encontre o imóvel ideal em Guararema. Vendas, locações e investimentos com a melhor imobiliária da região.',
    url: 'https://novaipe.com.br',
    siteName: 'Ipê Imóveis',
    images: [
      {
        url: '/images/og-image-2025.jpg',
        width: 1200,
        height: 630,
        alt: 'Ipê Imóveis - Guararema',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ipê Imóveis - Imóveis em Guararema',
    description: 'Especialistas em imóveis em Guararema. Encontre sua casa dos sonhos.',
    images: ['/images/og-image-2025.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: 'width=device-width, initial-scale=1',
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