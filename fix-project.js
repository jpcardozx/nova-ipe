const fs = require('fs');
const path = require('path');

console.log('🔧 Iniciando correção definitiva do projeto...');

// 1. Remover componentes problemáticos
const problematicComponents = [
    'app/components/OptimizedPreloader.tsx',
    'app/components/MarketAnalysisSection.tsx'
];

problematicComponents.forEach(comp => {
    const fullPath = path.join(__dirname, comp);
    if (fs.existsSync(fullPath)) {
        console.log(`❌ Removendo componente problemático: ${comp}`);
        fs.unlinkSync(fullPath);
    }
});

// 2. Restaurar layout original
const originalLayout = `import type { Metadata } from 'next';
import { Providers } from './providers/QueryProvider';
import Script from 'next/script';
import './globals.css';

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
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
      </head>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
`;

console.log('📝 Restaurando layout original...');
fs.writeFileSync(path.join(__dirname, 'app/layout.tsx'), originalLayout);

// 3. Criar versão simplificada do HomePageComponents
const simpleHomePageComponents = `'use client';

import React, { useState, useEffect } from 'react';
import { Suspense, lazy } from 'react';
import { UnifiedLoading } from './ui/UnifiedComponents';
import WhatsAppButton from './WhatsAppButton';
import EnhancedNotificationBanner from './EnhancedNotificationBanner';
import MobileFirstHero from './MobileFirstHero';
import type { ImovelClient } from '../../src/types/imovel-client';

// Lazy loading dos componentes
const CleanSalesSection = lazy(() => import('./premium/CleanPropertySections').then(mod => ({ default: mod.CleanSalesSection })));
const CleanRentalsSection = lazy(() => import('./premium/CleanPropertySections').then(mod => ({ default: mod.CleanRentalsSection })));
const FooterAprimorado = lazy(() => import('../sections/FooterAprimorado'));

const FallbackLoader = ({ title, height = '500px' }: { title: string, height?: string }) => (
    <UnifiedLoading height={height} title={title} />
);

interface HomePageComponentsProps {
    propertiesForSale: ImovelClient[];
    propertiesForRent: ImovelClient[];
    featuredProperties: ImovelClient[];
}

export default function HomePageComponents({ propertiesForSale, propertiesForRent, featuredProperties }: HomePageComponentsProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <>
            <header>
                <EnhancedNotificationBanner
                    message="Novos imóveis disponíveis! Confira nosso catálogo atualizado"
                    link="/contato"
                    linkText="Entre em contato"
                    variant="promotional"
                    storageKey="home_notification_dismissed"
                />
            </header>

            <MobileFirstHero />

            <main className="min-h-screen">
                {isLoaded && (
                    <>
                        <Suspense fallback={<FallbackLoader title="Carregando imóveis para venda..." />}>
                            <CleanSalesSection
                                properties={propertiesForSale}
                                title="Imóveis para Venda"
                                subtitle="Encontre a casa dos seus sonhos em Guararema"
                                maxItems={12}
                                className="mb-20"
                            />
                        </Suspense>

                        <Suspense fallback={<FallbackLoader title="Carregando imóveis para aluguel..." />}>
                            <CleanRentalsSection
                                properties={propertiesForRent}
                                title="Imóveis para Aluguel"
                                subtitle="Encontre o imóvel ideal para locação em Guararema"
                                maxItems={12}
                                className="mb-20"
                            />
                        </Suspense>
                    </>
                )}
            </main>

            <WhatsAppButton phoneNumber="+5511981845016" />

            {isLoaded && (
                <Suspense fallback={<FallbackLoader title="Carregando rodapé..." height="300px" />}>
                    <FooterAprimorado />
                </Suspense>
            )}
        </>
    );
}
`;

console.log('🔄 Criando versão simplificada dos componentes...');
fs.writeFileSync(path.join(__dirname, 'app/components/HomePageComponents.tsx'), simpleHomePageComponents);

console.log('✅ Correção completa! O projeto agora está limpo e funcional.');
console.log('📌 Execute: pnpm dev para testar');
