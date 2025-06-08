import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
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
  title: 'Nova Ipê Imóveis - Guararema, SP',
  description: 'Nova Ipê Imóveis - Sua Casa dos Sonhos Te Espera. Mais de 15 anos conectando famílias aos imóveis perfeitos em Guararema e região.',
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
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        <CenteredNavbar />
        {children}
      </body>
    </html>
  );
}