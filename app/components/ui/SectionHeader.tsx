'use client';

import React from 'react';

interface SectionHeaderProps {
    badge?: string;
    badgeColor?: 'amber' | 'blue' | 'green';
    title: React.ReactNode;
    description?: string;
    subtitle?: string;
    align?: 'left' | 'center' | 'right';
    className?: string;
    titleClassName?: string;
    subtitleClassName?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    badge,
    badgeColor = 'amber',
    title,
    description,
    subtitle,
    align = 'center',
    className = '',
    titleClassName = '',
    subtitleClassName = ''
}) => {
    const colorClasses = {
        amber: 'bg-amber-50 text-amber-700',
        blue: 'bg-blue-50 text-blue-700',
        green: 'bg-green-50 text-green-700',
    };

    const alignmentClasses = {
        left: 'text-left',
        center: 'text-center mx-auto',
        right: 'text-right ml-auto',
    };

    return (
        <div className={`${alignmentClasses[align]} mb-16 ${className}`}>
            {badge && (
                <span className={`inline-block px-4 py-1.5 ${colorClasses[badgeColor]} rounded-full text-sm font-semibold mb-4 animate-fade-in`}>
                    {badge}
                </span>
            )}
            <h2 className={`text-3xl md:text-5xl font-bold text-[#0D1F2D] mb-4 tracking-tight ${titleClassName}`}>
                {title}
            </h2>
            {subtitle && (
                <p className={`text-lg text-[#0D1F2D]/70 leading-relaxed ${align === 'center' ? 'max-w-2xl mx-auto' : ''} ${subtitleClassName}`}>
                    {subtitle}
                </p>
            )}
            {description && (
                <p className={`text-lg md:text-xl text-[#0D1F2D]/70 leading-relaxed ${align === 'center' ? 'max-w-2xl mx-auto' : ''}`}>
                    {description}
                </p>
            )}
        </div>
    );
};

export default SectionHeader;
