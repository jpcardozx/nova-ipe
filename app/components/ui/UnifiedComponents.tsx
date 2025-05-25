'use client';

import React from 'react';

// === UNIFIED LOADING COMPONENT ===
interface UnifiedLoadingProps {
    height?: string;
    title?: string;
    variant?: 'default' | 'minimal' | 'detailed';
}

export const UnifiedLoading: React.FC<UnifiedLoadingProps> = ({
    height = "400px",
    title = "Carregando...",
    variant = 'default'
}) => {
    if (variant === 'minimal') {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="w-8 h-8 border-2 border-slate-300 border-t-amber-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (variant === 'detailed') {
        return (
            <div
                className="bg-gradient-to-br from-slate-50 to-white animate-pulse rounded-3xl flex flex-col items-center justify-center shadow-xl border border-slate-200"
                style={{ height }}
            >
                <div className="flex flex-col items-center space-y-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-blue-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    </div>
                    <div className="text-slate-600 font-medium text-lg">{title}</div>
                    <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <div className="text-slate-500 text-sm">Preparando o melhor conteúdo para você...</div>
                </div>
            </div>
        );
    }

    // Default variant
    return (
        <div
            className="bg-gradient-to-br from-slate-50 to-white animate-pulse rounded-3xl flex flex-col items-center justify-center shadow-lg border border-slate-200"
            style={{ height }}
        >
            <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-blue-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
                <div className="text-slate-600 font-medium text-lg">{title}</div>
                <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
            </div>
        </div>
    );
};

// === UNIFIED SECTION WRAPPER ===
interface SectionWrapperProps {
    id?: string;
    className?: string;
    bgVariant?: 'white' | 'slate-light' | 'slate-dark' | 'gradient-light' | 'gradient-dark';
    padding?: 'sm' | 'md' | 'lg' | 'xl';
    children: React.ReactNode;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
    id,
    className = '',
    bgVariant = 'white',
    padding = 'lg',
    children
}) => {
    const bgClasses = {
        'white': 'bg-white',
        'slate-light': 'bg-slate-50',
        'slate-dark': 'bg-slate-100',
        'gradient-light': 'bg-gradient-to-b from-white to-slate-50',
        'gradient-dark': 'bg-gradient-to-b from-slate-50 to-slate-100'
    };

    const paddingClasses = {
        'sm': 'py-12',
        'md': 'py-16',
        'lg': 'py-24',
        'xl': 'py-32'
    };

    return (
        <section
            id={id}
            className={`${bgClasses[bgVariant]} ${paddingClasses[padding]} ${className}`}
        >
            <div className="container mx-auto px-6 lg:px-8">
                {children}
            </div>
        </section>
    );
};

// === UNIFIED CARD WRAPPER ===
interface CardWrapperProps {
    variant?: 'default' | 'elevated' | 'glass' | 'bordered';
    padding?: 'sm' | 'md' | 'lg' | 'xl';
    rounded?: 'md' | 'lg' | 'xl' | '2xl' | '3xl';
    className?: string;
    children: React.ReactNode;
}

export const CardWrapper: React.FC<CardWrapperProps> = ({
    variant = 'default',
    padding = 'lg',
    rounded = '3xl',
    className = '',
    children
}) => {
    const variantClasses = {
        'default': 'bg-white shadow-lg border border-slate-100',
        'elevated': 'bg-white shadow-2xl border border-slate-100 hover:shadow-3xl transition-shadow duration-300',
        'glass': 'bg-white/80 backdrop-blur-sm shadow-xl border border-white/20',
        'bordered': 'bg-white border-2 border-slate-200'
    };

    const paddingClasses = {
        'sm': 'p-4',
        'md': 'p-6',
        'lg': 'p-8 lg:p-12',
        'xl': 'p-12 lg:p-16'
    };

    const roundedClasses = {
        'md': 'rounded-md',
        'lg': 'rounded-lg',
        'xl': 'rounded-xl',
        '2xl': 'rounded-2xl',
        '3xl': 'rounded-3xl'
    };

    return (
        <div className={`${variantClasses[variant]} ${paddingClasses[padding]} ${roundedClasses[rounded]} ${className}`}>
            {children}
        </div>
    );
};

// === UNIFIED GRID WRAPPER ===
interface GridWrapperProps {
    cols?: 1 | 2 | 3 | 4 | 6;
    gap?: 'sm' | 'md' | 'lg' | 'xl';
    responsive?: boolean;
    className?: string;
    children: React.ReactNode;
}

export const GridWrapper: React.FC<GridWrapperProps> = ({
    cols = 3,
    gap = 'lg',
    responsive = true,
    className = '',
    children
}) => {
    const gapClasses = {
        'sm': 'gap-4',
        'md': 'gap-6',
        'lg': 'gap-8',
        'xl': 'gap-12'
    };

    const colsClasses = responsive ? {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
    } : {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        6: 'grid-cols-6'
    };

    return (
        <div className={`grid ${colsClasses[cols]} ${gapClasses[gap]} ${className}`}>
            {children}
        </div>
    );
};

// === UNIFIED BUTTON COMPONENT ===
interface UnifiedButtonProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
    loading?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
    href?: string;
    target?: string;
    className?: string;
}

export const UnifiedButton: React.FC<UnifiedButtonProps> = ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled = false,
    children,
    onClick,
    href,
    target,
    className = ''
}) => {
    const variantClasses = {
        'primary': 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl',
        'secondary': 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl',
        'outline': 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white backdrop-blur-sm',
        'ghost': 'text-slate-600 hover:bg-slate-100 hover:text-slate-800',
        'danger': 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl'
    };

    const sizeClasses = {
        'sm': 'px-4 py-2 text-sm',
        'md': 'px-6 py-3 text-base',
        'lg': 'px-8 py-4 text-lg font-semibold',
        'xl': 'px-10 py-5 text-xl font-bold'
    };

    const baseClasses = `
        inline-flex items-center justify-center relative overflow-hidden group
        rounded-xl font-semibold
        transition-all duration-300 ease-out
        hover:scale-105 transform opacity-100
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${fullWidth ? 'w-full' : ''}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
    `;

    const content = (
        <>
            <span className="relative z-10 flex items-center gap-2 opacity-100">
                {loading && (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                )}
                {children}
            </span>
        </>
    );

    if (href) {
        return (
            <a
                href={href}
                target={target}
                className={baseClasses}
                onClick={onClick}
            >
                {content}
            </a>
        );
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={baseClasses}
        >
            {content}
        </button>
    );
};