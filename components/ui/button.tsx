'use client';

import React from 'react';
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground hover:bg-primary/90',
                primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
                secondary: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 active:bg-neutral-400',
                destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
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
                icon: 'h-10 w-10',
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
            variant: 'default',
            size: 'default',
            radius: 'default',
            width: 'auto',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    loading?: boolean;
    loadingText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    animate?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        className,
        variant,
        size,
        radius,
        width,
        asChild = false,
        loading = false,
        loadingText,
        leftIcon,
        rightIcon,
        animate = true,
        children,
        disabled,
        ...props
    }, ref) => {
        const Comp = asChild ? Slot : "button";

        const isDisabled = disabled || loading;

        const buttonContent = (
            <>
                {loading && (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                )}
                {!loading && leftIcon && (
                    <span className="mr-2">{leftIcon}</span>
                )}
                {loading && loadingText ? loadingText : children}
                {!loading && rightIcon && (
                    <span className="ml-2">{rightIcon}</span>
                )}
            </>
        );

        const buttonElement = (
            <Comp
                className={cn(buttonVariants({ variant, size, radius, width }), className)}
                ref={ref}
                disabled={isDisabled}
                {...props}
            >
                {buttonContent}
            </Comp>
        );

        // Retorna com animação se solicitado
        if (animate && !asChild) {
            return (
                <motion.div
                    whileHover={{ scale: isDisabled ? 1 : 1.02 }}
                    whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    {buttonElement}
                </motion.div>
            );
        }

        return buttonElement;
    }
);

Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
