'use client';

import Link from 'next/link';
import Image from 'next/image';
import { memo } from 'react';
import { LucideIcon } from 'lucide-react';

interface PropertyCategoryCardProps {
    href: string;
    title: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    icon: LucideIcon;
    colorScheme: 'blue' | 'green' | 'amber';
}

const colorSchemes = {
    blue: {
        border: 'hover:border-blue-400/50',
        ring: 'focus:ring-blue-500',
        overlay: 'bg-blue-600/20',
        iconBg: 'bg-blue-500/20',
        iconColor: 'text-blue-400',
        titleHover: 'group-hover:text-blue-100',
        descHover: 'group-hover:text-blue-200',
    },
    green: {
        border: 'hover:border-green-400/50',
        ring: 'focus:ring-green-500',
        overlay: 'bg-green-600/20',
        iconBg: 'bg-green-500/20',
        iconColor: 'text-green-400',
        titleHover: 'group-hover:text-green-100',
        descHover: 'group-hover:text-green-200',
    },
    amber: {
        border: 'hover:border-amber-400/50',
        ring: 'focus:ring-amber-500',
        overlay: 'bg-amber-600/20',
        iconBg: 'bg-amber-500/20',
        iconColor: 'text-amber-400',
        titleHover: 'group-hover:text-amber-100',
        descHover: 'group-hover:text-amber-200',
    },
};

const PropertyCategoryCard = memo(function PropertyCategoryCard({
    href,
    title,
    description,
    imageSrc,
    imageAlt,
    icon: Icon,
    colorScheme,
}: PropertyCategoryCardProps) {
    const colors = colorSchemes[colorScheme];

    return (
        <Link
            href={href}
            className={`group relative overflow-hidden rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-600/30 ${colors.border} transition-all duration-500 focus:outline-none focus:ring-2 ${colors.ring} focus:ring-offset-2 focus:ring-offset-slate-900`}
            aria-label={`Ver ${title.toLowerCase()} disponíveis`}
            prefetch={false}
        >
            {/* Image Container */}
            <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    quality={75}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-800/40 to-transparent" />

                {/* Hover Overlay */}
                <div className={`absolute inset-0 ${colors.overlay} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 ${colors.iconBg} rounded-lg backdrop-blur-sm`}>
                        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.iconColor}`} aria-hidden="true" />
                    </div>
                    <div>
                        <h4 className={`text-white font-bold text-base sm:text-lg ${colors.titleHover} transition-colors`}>
                            {title}
                        </h4>
                        <p className={`text-slate-300 text-sm ${colors.descHover} transition-colors`}>
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
});

export default PropertyCategoryCard;
