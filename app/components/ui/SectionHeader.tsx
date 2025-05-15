'use client';

import React from 'react';

interface SectionHeaderProps {
    badge?: string;
    badgeColor?: 'amber' | 'blue' | 'green';
    title: string;
    description: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    badge,
    badgeColor = 'amber',
    title,
    description
}) => {
    const colorClasses = {
        amber: 'bg-amber-50 text-amber-700',
        blue: 'bg-blue-50 text-blue-700',
        green: 'bg-green-50 text-green-700',
    };

    return (
        <div className="max-w-3xl mx-auto text-center mb-16">
            {badge && (
                <span className={`inline-block px-4 py-1.5 ${colorClasses[badgeColor]} rounded-full text-sm font-semibold mb-4 animate-fade-in`}>
                    {badge}
                </span>
            )}
            <h2 className="text-3xl md:text-5xl font-bold text-[#0D1F2D] mb-6 tracking-tight">
                {title}
            </h2>
            <p className="text-lg md:text-xl text-[#0D1F2D]/70 leading-relaxed max-w-2xl mx-auto">
                {description}
            </p>
        </div>
    );
};

export default SectionHeader;
