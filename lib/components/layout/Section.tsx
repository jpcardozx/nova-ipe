'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from '../layout/Container';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'hero' | 'feature' | 'cta';
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  background?: 'white' | 'gray' | 'gradient';
  children: React.ReactNode;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ 
    className, 
    variant = 'default', 
    containerSize = 'xl',
    background = 'white',
    children, 
    ...props 
  }, ref) => {
    const variantClasses = {
      default: 'py-12 sm:py-16 lg:py-20',
      hero: 'py-20 sm:py-24 lg:py-32',
      feature: 'py-16 sm:py-20 lg:py-24',
      cta: 'py-12 sm:py-16 lg:py-20',
    };

    const backgroundClasses = {
      white: 'bg-white',
      gray: 'bg-gray-50',
      gradient: 'bg-gradient-to-b from-white to-gray-50',
    };

    return (
      <section
        className={cn(
          variantClasses[variant],
          backgroundClasses[background],
          className
        )}
        ref={ref}
        {...props}
      >
        <Container size={containerSize}>
          {children}
        </Container>
      </section>
    );
  }
);

Section.displayName = "Section";

export { Section };
export type { SectionProps };