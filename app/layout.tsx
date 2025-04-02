// app/layout.tsx
import './globals.css';
import { DM_Serif_Display, Italiana, Libre_Caslon_Display, Cormorant_Garamond } from 'next/font/google';

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-dmserif',
});

const italiana = Italiana({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-italiana',
});

const libreCaslon = Libre_Caslon_Display({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-libre',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-cormorant',
});

export const metadata = {
  title: 'Nova Ipê',
  description: 'Gestão Imobiliária e Consultoria',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR"
      className={`${dmSerif.variable} ${italiana.variable} ${libreCaslon.variable} ${cormorant.variable}`}>
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  );
}
