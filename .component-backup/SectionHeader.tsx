'use client';

import React from 'react';

interface SectionHeaderProps {
    title: string | React.ReactNode;
    subtitle?: string;
    align?: 'left' | 'center' | 'right';
    className?: string;
    titleClassName?: string;
    subtitleClassName?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    subtitle,
    align = 'left',
    className = '',
    titleClassName = '',
    subtitleClassName = ''
}) => {
    const alignmentClass = align === 'center'
        ? 'text-center'
        : align === 'right'
            ? 'text-right'
            : '';

    return (
        <div className={`mb-8 ${alignmentClass} ${className}`}>
            <h2 className={`text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl ${titleClassName}`}>
                {title}
            </h2>
            {subtitle && (
                <p className={`mt-4 text-lg text-gray-600 max-w-3xl ${subtitleClassName}`}>
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export default SectionHeader;
