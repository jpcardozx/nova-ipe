import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Providers } from './providers/QueryProvider';
import './globals.css';

const CenteredNavbar = dynamic(() => import('./components/ui/CenteredNavbar'), {
  ssr: false,
  loading: () => (
    <div className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm h-20 flex items-center justify-center">
      <div className="w-32 h-8 bg-gray-200 animate-pulse rounded" />
    </div>
  ),
});

export const metadata: Metadata = {
  title: {
    template: '%s | Ipê Imóveis - Guararema',
    default: 'Ipê Imóveis - Serviços Imobiliários em Guararema e Região'
  },
  description: 'Temos o imóvel que você procura em Guararema e região. Entre em contato conosco e descubra as melhores opções de compra e aluguel. 15 anos de experiência, 500+ imóveis vendidos.',
  keywords: 'imóveis Guararema, casas venda, apartamentos aluguel, terrenos, Nova Ipê, imobiliária, Guararema SP, região, compra, venda, locação',
  authors: [{ name: 'Ipê Imóveis', url: 'https://www.ipeimoveis.com.br' }],
  creator: 'Ipê Imóveis',
  publisher: 'Ipê Imóveis',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.ipeimoveis.com.br'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Ipê Imóveis - Compra, Venda e Locação em Guararema',
    description: 'O imóvel que você busca está em nosso catálogo. Agende sua visita. 15 anos de experiência, 500+ imóveis vendidos.',
    url: 'https://www.ipeimoveis.com.br',
    siteName: 'Ipê Imóveis',
    images: [
      {
        url: '/images/ipeLogoWritten.png',
        width: 1200,
        height: 630,
        alt: 'Ipê Imóveis - Guararema'
      }
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ipê Imóveis - Guararema, SP',
    description: 'Ipê Imóveis te espera. Mais de 15 anos ajudando famílias a encontrar os imóveis perfeitos.',
    images: ['/images/ipeLogoWritten.png'],
    creator: '@ipeimoveis',
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
  icons: {
    icon: [
      { url: '/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon_io/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/favicon_io/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'android-chrome', url: '/favicon_io/android-chrome-192x192.png', sizes: '192x192' },
      { rel: 'android-chrome', url: '/favicon_io/android-chrome-512x512.png', sizes: '512x512' }
    ]
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'verification-token-here', // Add your Google Search Console verification token
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#1e40af" />
        <meta name="color-scheme" content="light dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script src="https://analytics.ahrefs.com/analytics.js" data-key="TN1BpN+MhVBcvja6ELAPbA" async></script>
      </head>
      <body className="font-sans antialiased bg-white text-gray-900">
        <Providers>
          <CenteredNavbar />
          <main role="main">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}