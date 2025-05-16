// app/layout.tsx
import './globals.css';
import './cls-optimizations.css'; // Importando otimizações para CLS
import { Suspense } from 'react';
import { Montserrat } from 'next/font/google';
import { ClientOnly } from './components/ClientComponents';
import Script from 'next/script';

// Import client components properly
import ClientWebVitals from './components/ClientWebVitals';
import ClientPerformanceMonitor from './components/ClientPerformanceMonitor';
import WebVitalsDebuggerWrapper from './components/WebVitalsDebuggerWrapper';
import { OrganizationSchema, WebsiteSchema, LocalBusinessSchema } from './components/StructuredData';

// Metadata is imported from metadata.tsx to ensure consistency
import { metadata } from './metadata';

// Configuração otimizada da fonte Montserrat
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: true, // Garante preload da fonte
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={montserrat.variable} data-loading-state="loading">      <head>
      {/* Preload e aplicação de recursos críticos */}
      <link rel="preload" href="/critical.css" as="style" />
      <link rel="stylesheet" href="/critical.css" />
      <link rel="stylesheet" href="/styles/loading-effects.css" />

      {/* Favicon e dispositivos móveis */}
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#122D42" />
      <meta name="msapplication-TileColor" content="#122D42" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      <meta name="theme-color" content="#ffffff" />

      {/* Otimização específica para WhatsApp e redes sociais */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content="Nova Ipê Imobiliária" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:alt" content="Nova Ipê Imobiliária - Imóveis Premium em Guararema" />

      {/* Tags específicas para WhatsApp */}
      <meta property="whatsapp:title" content="Nova Ipê Imobiliária - Imóveis em Guararema" />
      <meta property="whatsapp:description" content="Propriedades exclusivas em Guararema com atendimento personalizado" />
      <meta property="whatsapp:image" content="https://www.novaipe.com.br/images/og-image-whatsapp.jpg" />

      {/* Habilita o modo de visualização avançada do WhatsApp */}
      <meta name="format-detection" content="telephone=no" />
    </head>      <body>        {/* Structured Data for SEO and Social Sharing */}
        <ClientOnly>
          <Suspense fallback={null}>
            {/* Individual structured data components for better SEO */}
            <OrganizationSchema />
            <WebsiteSchema />
            <LocalBusinessSchema />
          </Suspense>
        </ClientOnly>

        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin"></div>
          </div>
        }>
          {children}
        </Suspense>        {/* Delay WebVitals loading */}
        <Suspense fallback={null}>
          <ClientWebVitals />
        </Suspense>

        {/* Only load monitoring tools in development */}
        {process.env.NODE_ENV !== 'production' ? (
          <>
            {/* Performance Debugging Tools - Development Only */}
            <WebVitalsDebuggerWrapper />
            <Suspense fallback={null}>
              <ClientPerformanceMonitor />
            </Suspense>
          </>
        ) : null}
      </body>
    </html>
  );
}