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
  const noLayoutPages = ['/julia'];
  
  const showNavFooter = !noLayoutPages.includes(pathname);
  
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