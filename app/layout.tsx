import type { Metadata } from 'next';
import { Providers } from './providers/QueryProvider';
import ConditionalLayout from './components/ConditionalLayout';
import './globals.css';

// CSS variables para fontes usando fallbacks
const fontVariables = `
  --font-inter: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-lexend: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-playfair-display: Georgia, 'Times New Roman', Times, serif;
`;

export const metadata: Metadata = {
  title: {
    template: '%s | Ipê Imóveis - Guararema',
    default: 'Ipê Imóveis - Serviços Imobiliários em Guararema | Compra, Venda e Locação'
  },
  description: 'Encontre seu imóvel ideal em Guararema com a Ipê Imóveis. 15 anos de experiência, 500+ imóveis vendidos, atendimento personalizado.',
  keywords: 'imóveis Guararema, casas venda Guararema, apartamentos aluguel Guararema, terrenos Guararema, Ipê Imóveis, imobiliária Guararema SP',
  authors: [{ name: 'Ipê Imóveis', url: 'https://ipeimoveis.vercel.app' }],
  creator: 'Ipê Imóveis',
  publisher: 'Ipê Imóveis',
  metadataBase: new URL('https://ipeimoveis.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Ipê Imóveis - Especialistas em Imóveis em Guararema',
    description: 'Encontre seu imóvel ideal em Guararema. 15 anos de experiência, 500+ imóveis vendidos.',
    url: 'https://ipeimoveis.vercel.app',
    siteName: 'Ipê Imóveis',
    images: [
      {
        url: '/images/og-banner-guararema.jpg',
        width: 1200,
        height: 630,
        alt: 'Ipê Imóveis - Especialistas em Guararema'
      }
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ipê Imóveis - Guararema, SP',
    description: 'Especialistas em imóveis em Guararema há 15 anos.',
    images: ['/images/og-banner-optimized.png'],
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
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Ipê Imóveis",
    "description": "Especialistas em imóveis em Guararema com mais de 15 anos de experiência",
    "url": "https://ipeimoveis.vercel.app",
    "telephone": "+55-11-99999-9999",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Guararema",
      "addressRegion": "SP",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-23.4004",
      "longitude": "-46.0318"
    },
    "openingHours": "Mo,Tu,We,Th,Fr 08:00-18:00",
    "priceRange": "$$",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Guararema",
        "addressRegion": "SP",
        "addressCountry": "BR"
      }
    ]
  };

  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#1a6f5c" />

        {/* Google tag (gtag.js) - Google Ads Conversion Tracking */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17457190449"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17457190449');
            `,
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="font-sans antialiased bg-white text-gray-900" style={{ fontFamily: 'var(--font-inter)' }}>
        <style dangerouslySetInnerHTML={{ __html: `:root { ${fontVariables} }` }} />
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}