/**
 * Layout Raiz da Aplicação (Server Component)
 * 
 * Componente raiz que define a estrutura base HTML da aplicação.
 * Responsável por importar estilos globais, fontes e scripts críticos.
 * 
 * @version 2.0.0
 * @date 17/05/2025
 */

// Importações essenciais
import { Montserrat } from 'next/font/google';
import Script from 'next/script';
import LayoutClient from './components/LayoutClient';
import CriticalStyleLoader from './components/CriticalStyleLoader';
import fs from 'fs';
import path from 'path';

// Importação do CSS principal - carregado depois do critical CSS
import './globals.css';

// Configuração otimizada da fonte Montserrat
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: true,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={montserrat.variable} data-loading-state="loading">
      <head>        {/* Inlined Critical CSS */}
        <style id="critical-css" dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS inline */
            body, html {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            *, *::before, *::after {
              box-sizing: inherit;
            }
            
            /* Variáveis essenciais */
            :root {
              --color-brand-green: #1a6f5c;
              --color-brand-dark: #0D1F2D;
              --color-background: #ffffff;
              --color-foreground: #333333;
            }
            
            .container-ipe {
              width: 100%;
              margin-left: auto;
              margin-right: auto;
              padding-left: 1rem;
              padding-right: 1rem;
            }
            
            h1 {
              font-size: 2.25rem;
              font-weight: 700;
              line-height: 1.1;
              margin-top: 0;
            }
          `
        }} />        {/* Carregamento otimizado de CSS não-crítico */}
        <link rel="preload" href="/critical-bundle.css" as="style" />
        {/* O CriticalStyleLoader é um Client Component que gerencia o CSS não-crítico */}
        <link rel="stylesheet" href="/critical-bundle.css" media="print" />
        {/* Importe o CriticalStyleLoader no topo do arquivo */}

        {/* Script crítico com carregamento otimizado */}
        <Script src="/js/critical-preload.js" strategy="beforeInteractive" />
        {/* Favicon */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#122D42" />
        <meta name="msapplication-TileColor" content="#122D42" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content="#ffffff" />
        {/* OG tags */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:site_name" content="Nova Ipê Imobiliária" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:alt" content="Nova Ipê Imobiliária - Imóveis Premium em Guararema" />
        {/* WhatsApp */}
        <meta property="whatsapp:title" content="Nova Ipê Imobiliária - Imóveis em Guararema" />
        <meta property="whatsapp:description" content="Propriedades exclusivas em Guararema com atendimento personalizado" />
        <meta property="whatsapp:image" content="https://www.novaipe.com.br/images/og-image-whatsapp.jpg" />
        <meta property="whatsapp:card" content="summary_large_image" />
        {/* Facebook */}
        <meta property="fb:app_id" content="123456789" />
        <meta name="format-detection" content="telephone=no" />        {/* Performance optimization - resource hints */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />

        {/* Preloads para recursos críticos */}
        <link rel="preload" href="/fonts/Montserrat-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

        {/* Scripts não críticos carregados de forma otimizada */}
        <Script src="/js/critical-preload.js" strategy="beforeInteractive" />
        <Script src="/js/whatsapp-optimizer.js" strategy="lazyOnload" />
        <Script src="/js/loading-timeout.js" strategy="lazyOnload" />

        {/* Prefetch de rotas principais */}
        <link rel="prefetch" href="/comprar" />
        <link rel="prefetch" href="/alugar" />
      </head>
      {/* 
        Including initial styles inline to match what critical-preload.js will set
        This prevents hydration mismatches
      */}      <body className="body-initial-state">
        <LayoutClient>
          {/* Componente cliente para gerenciar estilos críticos */}
          <CriticalStyleLoader href="/critical-bundle.css" />

          {/* Renderização pré-otimizada para conteúdo principal */}
          <main data-optimize-lcp="true">
            {children}
          </main>

          {/* Carregador de JavaScript progressivo */}
          <Script id="progressive-hydration" strategy="afterInteractive">
            {`document.documentElement.removeAttribute('data-loading-state');`}
          </Script>
        </LayoutClient>
      </body>
    </html>
  );
}