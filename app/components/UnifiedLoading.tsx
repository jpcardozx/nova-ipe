import React from 'react';
import { cn } from '@/lib/utils';

interface UnifiedLoadingProps {
    height?: string;
    title?: string;
    className?: string;
}

export default function UnifiedLoading({
    height = '400px',
    title = 'Carregando...',
    className = ''
}: UnifiedLoadingProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center w-full',
                className
            )}
            style={{ height }}
        >
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">{title}</p>
        </div>
    );
}
