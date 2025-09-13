"use client";

import { usePathname } from 'next/navigation';
import CenteredNavbar from './ui/CenteredNavbar-optimized';
import FooterAprimorado from '../sections/FooterAprimorado';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

const ConditionalLayout = ({ children }: ConditionalLayoutProps) => {
  const pathname = usePathname();

  // Páginas que devem renderizar sem navbar/footer
  const noLayoutPages = ['/julia', '/carla', '/dashboard', '/admin', '/studio', '/structure'];

  const showNavFooter = !noLayoutPages.some(page => pathname.startsWith(page));

  // Para páginas especiais como studio, não envolvemos em main
  if (noLayoutPages.some(page => pathname.startsWith(page))) {
    return <>{children}</>;
  }

  return (
    <>
      {showNavFooter && <CenteredNavbar />}
      <main role="main">
        {children}
      </main>
      {showNavFooter && <FooterAprimorado />}
    </>
  );
};

export default ConditionalLayout;