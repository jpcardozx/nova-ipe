'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'small' | 'large';
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = 'p', children, as, ...props }, ref) => {
    const variantClasses = {
      h1: 'text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl',
      h2: 'text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl',
      h3: 'text-2xl font-semibold tracking-tight text-gray-900',
      h4: 'text-xl font-semibold tracking-tight text-gray-900',
      h5: 'text-lg font-semibold tracking-tight text-gray-900',
      h6: 'text-base font-semibold tracking-tight text-gray-900',
      p: 'text-base text-gray-700 leading-7',
      small: 'text-sm text-gray-600',
      large: 'text-lg text-gray-700 leading-8',
    };

    const Component = as || variant;

    return React.createElement(
      Component,
      {
        className: cn(variantClasses[variant], className),
        ref,
        ...props,
      },
      children
    );
  }
);

Typography.displayName = "Typography";

export { Typography };
export type { TypographyProps };