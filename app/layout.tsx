import { Inter } from 'next/font/google';
import ClientLayout from './providers/ClientLayout';
import './globals.css';

// Initialize Inter font
const inter = Inter({ subsets: ['latin'] });

// Metadata is exported from a separate file
export { metadata } from './metadata';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}