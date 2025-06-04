import React from 'react';
interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    align?: 'left' | 'center' | 'right';
    className?: string;
    badge?: string;
    badgeColor?: string;
    description?: string;
}

export default function SectionHeader({
    title,
    subtitle,
    align = 'left',
    className = '',
    badge,
    badgeColor = 'bg-primary-100 text-primary-800',
    description
}: SectionHeaderProps) {
    const alignClass = {
        'left': 'text-left',
        'center': 'text-center',
        'right': 'text-right'
    }[align];

    return (
        <div className={`mb-8 ${alignClass} ${className}`}>
            {badge && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${badgeColor}`}>
                    {badge}
                </span>
            )}
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
            {description && (
                <p className="text-lg text-gray-600">{description}</p>
            )}
            {subtitle && !description && (
                <p className="text-lg text-gray-600">{subtitle}</p>
            )}
        </div>
    );
}
