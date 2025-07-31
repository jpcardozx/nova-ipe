"use client";

import React, { FC, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn, formatarMoeda, formatarArea, formatarImovelInfo } from '@/lib/utils';
import { MapPin, BedDouble, Bath, Car } from 'lucide-react';

// Badge component from PropertyCardUnified
const Badge = ({
    variant = 'primary',
    size = 'md',
    children,
    className,
}: {
    variant?: 'primary' | 'secondary' | 'highlight' | 'new' | 'premium';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    className?: string;
}) => {
    const variantStyles = {
        primary: 'bg-blue-500 text-white',
        secondary: 'bg-emerald-500 text-white',
        highlight: 'bg-amber-500 text-white',
        new: 'bg-teal-500 text-white',
        premium: 'bg-purple-500 text-white',
    };

    const sizeStyles = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
    };

    return (
        <span
            className={cn(
                'rounded-md font-medium flex items-center gap-1.5 shadow-sm',
                variantStyles[variant],
                sizeStyles[size],
                className
            )}
        >
            {children}
        </span>
    );
};

// Feature component from PropertyCardUnified
const Feature = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number | undefined;
}) => {
    if (!value) return null;

    return (
        <div className="flex items-center gap-2 group">
            <div className="p-1.5 bg-stone-100 rounded-md text-stone-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                {icon}
            </div>
            <div>
                <p className="text-xs text-stone-500 group-hover:text-stone-700 transition-colors">{label}</p>
                <p className="text-sm font-medium text-stone-700">{value}</p>
            </div>
        </div>
    );
};

// Simple context hook implementation
const useImoveisDestaque = () => {
    return {
        state: {
            imoveis: [],
            activeImovel: null
        },
        setActiveImovel: (id: any) => { }
    };
};

// Tipo normalizado a partir do utilitário
type NormalizedImovel = ReturnType<typeof formatarImovelInfo>;

interface ImovelHeroProps {
    finalidade?: string;
}

export default ImovelHero;