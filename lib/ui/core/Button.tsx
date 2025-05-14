'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300',
    {
        variants: {
            variant: {
                primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
                secondary: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 active:bg-neutral-400',
                outline: 'border border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100',
                ghost: 'bg-transparent text-neutral-800 hover:bg-neutral-100 active:bg-neutral-200',
                light: 'bg-white text-neutral-900 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50',
                dark: 'bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-700',
                premium: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 active:from-primary-700 active:to-primary-800 shadow-md hover:shadow-lg',
                success: 'bg-accent-emerald-500 text-white hover:bg-accent-emerald-600',
                danger: 'bg-accent-red-500 text-white hover:bg-accent-red-600',
                link: 'text-primary-500 underline-offset-4 hover:underline',
            },
            size: {
                xs: 'h-7 px-2.5 text-xs',
                sm: 'h-9 px-3 text-sm',
                default: 'h-10 px-4 py-2',
                md: 'h-11 px-5 py-2',
                lg: 'h-12 px-6 py-2.5 text-base',
                xl: 'h-14 px-8 py-3 text-lg',
            },
            radius: {
                none: 'rounded-none',
                sm: 'rounded-sm',
                default: 'rounded-md',
                md: 'rounded-lg',
                lg: 'rounded-xl',
                full: 'rounded-full',
            },
            width: {
                auto: 'w-auto',
                full: 'w-full',
            }
        },
        defaultVariants: {
            variant: 'primary',
            size: 'default',
            radius: 'default',
            width: 'auto',
        },
    }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    loading?: boolean;
    animation?: 'none' | 'pulse' | 'scale' | 'float';
    href?: string;
    target?: string;
    as?: React.ElementType;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        className,
        variant,
        size,
        radius,
        width,
        leftIcon,
        rightIcon,
        children,
        loading,
        disabled,
        animation = 'none',
        href,
        target,
        as: Component = href ? 'a' : 'button',
        ...props
    }, ref) => {

        // Determina os estilos de animação baseado na prop animation
        const getAnimationProps = () => {
            switch (animation) {
                case 'pulse':
                    return {
                        whileHover: { scale: 1.02 },
                        whileTap: { scale: 0.98 },
                        transition: { type: 'spring', stiffness: 400, damping: 10 }
                    };
                case 'scale':
                    return {
                        whileHover: { scale: 1.05 },
                        whileTap: { scale: 0.95 },
                        transition: { type: 'spring', stiffness: 300, damping: 10 }
                    };
                case 'float':
                    return {
                        whileHover: { y: -4, boxShadow: '0 8px 20px -6px rgba(0,0,0,0.2)' },
                        whileTap: { y: -1, boxShadow: '0 4px 10px -4px rgba(0,0,0,0.2)' },
                        transition: { type: 'spring', stiffness: 400, damping: 15 }
                    };
                default:
                    return {};
            }
        };

        const MotionComponent = motion(Component as any);

        return (
            <MotionComponent
                ref={ref as any}
                className={cn(
                    buttonVariants({ variant, size, radius, width, className })
                )}
                disabled={disabled || loading}
                href={href}
                target={target}
                {...getAnimationProps()}
                {...props}
            >
                {loading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                )}
                {!loading && leftIcon && (
                    <span className="mr-2 -ml-1">{leftIcon}</span>
                )}
                {children}
                {!loading && rightIcon && (
                    <span className="ml-2 -mr-1">{rightIcon}</span>
                )}
            </MotionComponent>
        );
    }
);

Button.displayName = 'Button';

export { Button, buttonVariants }; 