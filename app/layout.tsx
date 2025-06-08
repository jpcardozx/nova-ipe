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