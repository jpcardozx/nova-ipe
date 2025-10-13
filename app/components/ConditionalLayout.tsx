"use client";

import { usePathname } from 'next/navigation';
import Navbar from '../sections/NavBar';
import FooterAprimorado from '../sections/FooterAprimorado';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

const ConditionalLayout = ({ children }: ConditionalLayoutProps) => {
  const pathname = usePathname();

  // Páginas que devem renderizar sem navbar/footer
  const noLayoutPages = ['/julia', '/dashboard', '/admin', '/studio', '/structure'];

  const showNavFooter = !noLayoutPages.some(page => pathname.startsWith(page));

  // Para páginas especiais como studio, não envolvemos em main
  if (noLayoutPages.some(page => pathname.startsWith(page))) {
    return <>{children}</>;
  }

  return (
    <>
      {showNavFooter && <Navbar />}
      <main role="main">
        {children}
      </main>
      {showNavFooter && <FooterAprimorado />}
    </>
  );
};

export default ConditionalLayout;