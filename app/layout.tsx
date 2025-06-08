import type { Metadata } from 'next';
import './globals.css';

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
        {children}
      </body>
    </html>
  );
}