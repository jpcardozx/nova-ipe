import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import './critical.css';
import Script from 'next/script';

// Configuração da fonte
const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800'],
    display: 'swap',
    variable: '--font-montserrat',
});

// Metadados padrão do site
export const metadata: Metadata = {
    metadataBase: new URL('https://www.ipe-imoveis.com.br'),
    title: {
        default: 'Ipê Imobiliária Guararema',
        template: '%s | Ipê Imobiliária Guararema',
    },
    description: 'Especialistas em imóveis em Guararema desde 2010. Casas, terrenos, sítios e imóveis comerciais com as melhores condições.',
    openGraph: {
        title: 'Ipê Imobiliária Guararema',
        description: 'Encontre seu imóvel ideal em Guararema com quem entende do mercado local há 13 anos.',
        url: 'https://www.ipe-imoveis.com.br',
        siteName: 'Ipê Imobiliária',
        locale: 'pt_BR',
        type: 'website',
        images: [
            {
                url: '/images/og-image-ipe-2025.jpg',
                width: 1200,
                height: 630,
                alt: 'Ipê Imobiliária - Seu refúgio em Guararema',
            },
        ],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR" className={`${montserrat.variable} scroll-smooth`}>
            <head>
                {/* Preloading de recursos críticos */}
                <link
                    rel="preload"
                    href="/images/hero-bg-optimized.webp"
                    as="image"
                    type="image/webp"
                />
                <link
                    rel="preload"
                    href="/images/logo-ipe.png"
                    as="image"
                />
                <link
                    rel="preconnect"
                    href="https://cdn.sanity.io"
                />

                {/* Prefetch de páginas comuns */}
                <link
                    rel="prefetch"
                    href="/comprar"
                />
                <link
                    rel="prefetch"
                    href="/alugar"
                />
            </head>

            <body className="bg-white text-gray-900 antialiased">
                {/* Banner de notificação que será exibido */}
                <div id="notification-root"></div>

                {/* Conteúdo principal */}
                <div id="root">{children}</div>

                {/* Analytics (Google e similar) - modificar para o ID correto */}
                <Script
                    strategy="afterInteractive"
                    src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXX');
          `}
                </Script>

                {/* Script para medir Core Web Vitals */}
                <Script id="web-vitals" strategy="afterInteractive">
                    {`
            // Web Vitals
            function sendToAnalytics(metric) {
              const body = JSON.stringify(metric);
              navigator.sendBeacon('/api/vitals', body);
            }
            
            try {
              if (window.webVitals) {
                webVitals.getCLS(sendToAnalytics);
                webVitals.getFID(sendToAnalytics);
                webVitals.getLCP(sendToAnalytics);
                webVitals.getFCP(sendToAnalytics);
                webVitals.getTTFB(sendToAnalytics);
              }
            } catch (e) {
              console.error('Error measuring Web Vitals:', e);
            }
          `}
                </Script>
            </body>
        </html>
    );
}
