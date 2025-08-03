import { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PropertySectionLayoutProps extends PropsWithChildren {
    id: string;
    title: string;
    description: string;
    className?: string;
    headerClassName?: string;
    contentClassName?: string;
    badge?: string;
    titleHighlight?: string;
    viewAllLink?: string;
    viewAllLabel?: string;
}

function PropertySectionLayout({
    children,
    title,
    description,
    className,
    headerClassName,
    contentClassName,
    badge,
    titleHighlight,
    viewAllLink,
    viewAllLabel = "Ver todos"
}: PropertySectionLayoutProps) {
    return (
        <section className={cn("py-16", className)}>
            <div className="container mx-auto px-4">
                <div className={cn("text-center mb-12", headerClassName)}>
                    {badge && (
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
                            {badge}
                        </span>
                    )}

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {title} {titleHighlight && (
                            <span className="text-blue-600">{titleHighlight}</span>
                        )}
                    </h2>

                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {description}
                    </p>

                    {viewAllLink && (
                        <div className="mt-6">
                            <a
                                href={viewAllLink}
                                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                            >
                                {viewAllLabel}
                                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>
                    )}
                </div>

                <div className={cn("", contentClassName)}>
                    {children}
                </div>
            </div>
        </section>
    )
}

export default PropertySectionLayout;