// app/layout.tsx - Server component
import './layout-styles';
import { Montserrat } from 'next/font/google';
import Script from 'next/script';
import LayoutClient from './components/LayoutClient';

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
  return (<html lang="pt-BR" className={montserrat.variable}>
    <head>
      {/* Script crítico */}
      <Script src="/js/critical-preload.js" strategy="beforeInteractive" />
      {/* Preload */}
      <link rel="preload" href="/critical-speed.css" as="style" />
      <link rel="preload" href="/critical.css" as="style" />
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
      <meta name="format-detection" content="telephone=no" />
      {/* Scripts */}
      <Script src="/js/whatsapp-optimizer.js" strategy="lazyOnload" />
      <Script src="/js/loading-timeout.js" strategy="lazyOnload" />
    </head>
    <body style={{ visibility: 'hidden', opacity: '0', transition: 'opacity 0.3s ease-out' }}>
      <LayoutClient>
        {children}
      </LayoutClient>
    </body>
  </html>
  );
}
