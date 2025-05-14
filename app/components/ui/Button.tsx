'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Definindo as variantes do botão usando CVA
const buttonVariants = cva(
    // Base style
    'inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden group',
    {
        variants: {
            variant: {
                default: 'bg-brand-green text-white hover:bg-brand-green-dark shadow-md hover:shadow-lg hover:translate-y-[-2px]',
                secondary: 'bg-stone-100 text-stone-800 hover:bg-stone-200 shadow-sm hover:shadow-md hover:translate-y-[-1px]',
                outline: 'bg-transparent border-2 border-current text-brand-green hover:bg-brand-green/5 shadow-sm hover:shadow',
                ghost: 'text-brand-green hover:bg-brand-green/10 hover:text-brand-green-dark',
                link: 'text-brand-green underline-offset-4 hover:underline p-0 h-auto shadow-none hover:text-brand-green-dark',
                destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg hover:translate-y-[-2px]',
                accent: 'bg-accent-yellow text-brand-dark hover:bg-accent-yellow/90 font-semibold shadow-md hover:shadow-lg hover:translate-y-[-2px]',
            },
            size: {
                xs: 'h-8 px-3 text-xs',
                sm: 'h-9 px-3.5 text-sm',
                default: 'h-10 px-5 py-2',
                lg: 'h-12 px-6 text-base',
                xl: 'h-14 px-8 text-lg',
                icon: 'h-10 w-10',
            },
            fullWidth: {
                true: 'w-full',
            },
            rounded: {
                default: 'rounded-md',
                full: 'rounded-full',
                lg: 'rounded-lg',
                xl: 'rounded-xl',
                none: 'rounded-none',
            },
            loading: {
                true: 'relative !text-transparent cursor-wait',
            },
            hasRipple: {
                true: '',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
            rounded: 'default',
            fullWidth: false,
            loading: false,
            hasRipple: true,
        },
    }
);

// Tipo das props do botão
export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    loading?: boolean;
    hasRipple?: boolean;
}

/**
 * Componente Button melhorado
 * Um botão acessível, versátil e consistente com o design system
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            children,
            variant,
            size,
            rounded,
            fullWidth,
            loading,
            leftIcon,
            rightIcon,
            disabled,
            hasRipple = true,
            onClick,
            ...props
        },
        ref
    ) => {
        // Desabilita o botão se estiver carregando ou se recebeu disabled como prop
        const isDisabled = loading || disabled;

        // Função para criar o efeito de ripple
        const handleRipple = React.useCallback(
            (e: React.MouseEvent<HTMLButtonElement>) => {
                if (!hasRipple || isDisabled) return;

                const button = e.currentTarget;
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const ripple = document.createElement('span');
                const diameter = Math.max(rect.width, rect.height);
                const radius = diameter / 2;

                ripple.style.width = ripple.style.height = `${diameter}px`;
                ripple.style.left = `${x - radius}px`;
                ripple.style.top = `${y - radius}px`;
                ripple.className = 'absolute rounded-full bg-white/30 animate-ripple pointer-events-none';

                const existingRipple = button.getElementsByClassName('animate-ripple');
                if (existingRipple[0]) {
                    existingRipple[0].remove();
                }

                button.appendChild(ripple);

                // Remove o ripple após a animação
                setTimeout(() => {
                    if (ripple.parentNode === button) {
                        button.removeChild(ripple);
                    }
                }, 600);

                // Chama o onClick original se existir
                onClick?.(e);
            },
            [hasRipple, isDisabled, onClick]
        );

        return (
            <button
                className={cn(buttonVariants({ variant, size, rounded, fullWidth, loading }), className)}
                ref={ref}
                disabled={isDisabled}
                onClick={handleRipple}
                {...props}
            >
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent opacity-80" />
                    </div>
                )}

                {leftIcon && <span className="mr-2 group-hover:transform group-hover:translate-x-[-2px] transition-transform">{leftIcon}</span>}
                {children}
                {rightIcon && <span className="ml-2 group-hover:transform group-hover:translate-x-[2px] transition-transform">{rightIcon}</span>}
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
