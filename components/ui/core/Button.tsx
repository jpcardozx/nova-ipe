'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50 select-none',
    {
        variants: {
            variant: {
                primary: 'bg-primary-500 text-white shadow-sm hover:bg-primary-600 active:bg-primary-700',
                secondary: 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300 active:bg-neutral-400',
                outline: 'bg-transparent border border-primary-500 text-primary-500 hover:bg-primary-50 hover:border-primary-600 hover:text-primary-600 active:bg-primary-100',
                ghost: 'bg-transparent text-neutral-800 hover:bg-neutral-100 active:bg-neutral-200',
                light: 'bg-white text-neutral-900 border border-neutral-200 shadow-sm hover:border-neutral-300 hover:bg-neutral-50',
                dark: 'bg-neutral-900 text-white shadow-sm hover:bg-neutral-800 active:bg-neutral-700',
                premium: [
                    'bg-gradient-to-r from-primary-500 to-primary-600 text-white',
                    'shadow-md hover:shadow-lg hover:from-primary-600 hover:to-primary-700',
                    'active:shadow-inner active:from-primary-700 active:to-primary-800',
                    'border border-primary-400/30',
                ],
                success: 'bg-accent-emerald-500 text-white shadow-sm hover:bg-accent-emerald-600 active:bg-accent-emerald-700',
                danger: 'bg-accent-red-500 text-white shadow-sm hover:bg-accent-red-600 active:bg-accent-red-700',
                link: 'text-primary-500 underline-offset-4 hover:underline hover:text-primary-600 active:text-primary-700 p-0 h-auto',
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
    animation?: 'none' | 'pulse' | 'scale' | 'float' | 'glow' | 'subtle';
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
        // Estado de hover para animações personalizadas
        const [isHovering, setIsHovering] = React.useState(false);

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
                case 'glow':
                    return {
                        whileHover: {
                            boxShadow: '0 0 15px 3px rgba(255, 173, 67, 0.4)',
                            transition: { duration: 0.2 }
                        }
                    };
                case 'subtle':
                    return {
                        whileHover: { backgroundColor: 'rgba(255,255,255,0.1)' },
                        whileTap: { backgroundColor: 'rgba(255,255,255,0.15)' }
                    };
                default:
                    return {};
            }
        };

        const MotionComponent = motion(Component as any);

        // Classes para efeito de ripple
        const rippleClasses = variant === 'premium' && animation === 'none' ?
            'relative overflow-hidden after:content-[""] after:absolute after:inset-0 after:bg-white/20 after:translate-x-[-100%] hover:after:animate-ripple' : '';

        // Estilo de loading específico para cada variante
        const getLoadingColor = () => {
            if (variant === 'outline' || variant === 'ghost' || variant === 'link') {
                return 'text-primary-500';
            } else if (variant === 'light' || variant === 'secondary') {
                return 'text-neutral-700';
            }
            return 'text-white';
        };

        return (
            <MotionComponent
                ref={ref as any}
                className={cn(
                    buttonVariants({ variant, size, radius, width }),
                    rippleClasses,
                    className
                )}
                disabled={disabled || loading}
                href={href}
                target={target}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                {...getAnimationProps()}
                {...props}
                aria-busy={loading}
            >
                {loading && (
                    <Loader2 className={cn("mr-2 h-4 w-4 animate-spin", getLoadingColor())} aria-hidden="true" />
                )}
                {!loading && leftIcon && (
                    <span className="mr-2 flex-shrink-0 -ml-1">{leftIcon}</span>
                )}
                <span className="truncate">{children}</span>
                {!loading && rightIcon && (
                    <span className="ml-2 flex-shrink-0 -mr-1 transition-transform duration-300 ease-out"
                        style={{ transform: isHovering && variant !== 'link' ? 'translateX(2px)' : 'none' }}
                    >{rightIcon}</span>
                )}

                {/* Elemento de foco para acessibilidade melhorada */}
                <span className="absolute inset-0 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500" />
            </MotionComponent>
        );
    }
);

Button.displayName = 'Button';

export { Button, buttonVariants }; 