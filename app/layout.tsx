// app/layout.tsx
import './globals.css';
import './cls-optimizations.css'; // Importando otimizações para CLS
import { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { Montserrat } from 'next/font/google';
import { ClientOnly } from './components/ClientComponents';

// Import client components properly
import ClientWebVitals from './components/ClientWebVitals';
import ClientPerformanceMonitor from './components/ClientPerformanceMonitor';
import WebVitalsDebuggerWrapper from './components/WebVitalsDebuggerWrapper';

// Configuração otimizada da fonte Montserrat
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: true, // Garante preload da fonte
});

export const metadata: Metadata = {
  title: {
    default: 'Nova Ipê Imobiliária | Imóveis em Guararema e Região',
    template: '%s | Nova Ipê Imobiliária'
  },
  description: 'Encontre seu imóvel ideal em Guararema e região. Casas, apartamentos e terrenos para compra e aluguel. Atendimento personalizado.',
  keywords: 'imóveis, Guararema, comprar casa, alugar apartamento, imobiliária',
  authors: [{ name: 'Ipê Imóveis', url: 'https://nova-ipe.vercel.app' }],
  creator: 'Ipê Imóveis',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0D1F2D',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={montserrat.variable} data-loading-state="loading">
      <head>
        {/* Preload de recursos críticos */}
        <link rel="preload" href="/critical.css" as="style" />
      </head>
      <body>
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