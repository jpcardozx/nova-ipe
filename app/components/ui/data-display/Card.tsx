'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Definindo as variantes do card usando CVA
const cardVariants = cva(
    // Base style
    'rounded-lg overflow-hidden transition-all',
    {
        variants: {
            variant: {
                default: 'bg-white shadow-md',
                outline: 'bg-white border border-neutral-200',
                flat: 'bg-neutral-50',
                elevated: 'bg-white shadow-lg',
                premium: 'bg-white border-2 border-accent-yellow shadow-md',
            },
            padding: {
                none: '',
                sm: 'p-3',
                default: 'p-4',
                lg: 'p-6',
                xl: 'p-8',
            },
            radius: {
                default: 'rounded-lg',
                sm: 'rounded',
                lg: 'rounded-xl',
                full: 'rounded-[20px]',
            },
            hover: {
                default: 'hover:shadow-lg',
                none: '',
                scale: 'hover:shadow-lg hover:scale-[1.02]',
                lift: 'hover:shadow-lg hover:translate-y-[-4px]',
            },
        },
        defaultVariants: {
            variant: 'default',
            padding: 'default',
            radius: 'default',
            hover: 'none',
        },
    }
);

// Tipo das props do card
export interface CardProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
    as?: React.ElementType;
}

/**
 * Componente Card versátil
 * Um container para exibir conteúdo relacionado de forma organizada
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, variant, padding, radius, hover, as = 'div', ...props }, ref) => {
        const Component = as;

        return (
            <Component
                className={cn(cardVariants({ variant, padding, radius, hover }), className)}
                ref={ref}
                {...props}
            >
                {children}
            </Component>
        );
    }
);

Card.displayName = 'Card';

// Componentes para a estrutura interna do Card
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div className={cn('flex flex-col space-y-1.5 p-4', className)} ref={ref} {...props} />
    )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3
            className={cn('text-xl font-medium leading-tight tracking-tight', className)}
            ref={ref}
            {...props}
        />
    )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p className={cn('text-neutral-500 text-sm', className)} ref={ref} {...props} />
    )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => <div className={cn('p-4 pt-0', className)} ref={ref} {...props} />
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            className={cn('flex items-center p-4 pt-0', className)}
            ref={ref}
            {...props}
        />
    )
);
CardFooter.displayName = 'CardFooter';

const CardBadge = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement> & { variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger' }>(
    ({ className, variant = 'default', ...props }, ref) => {
        const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';

        const styles = {
            default: 'bg-brand-green text-white',
            secondary: 'bg-neutral-200 text-neutral-700',
            outline: 'border border-brand-green text-brand-green',
            success: 'bg-green-100 text-green-700',
            warning: 'bg-amber-100 text-amber-700',
            danger: 'bg-red-100 text-red-700',
        };

        return <span
            className={cn(baseStyles, styles[variant], className)}
            ref={ref}
            {...props}
        />;
    }
);
CardBadge.displayName = 'CardBadge';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardBadge, cardVariants };
