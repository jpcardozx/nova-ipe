'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SectionHeaderProps {
    badge?: string;
    badgeColor?: 'amber' | 'blue' | 'green' | 'purple' | 'emerald';
    title: React.ReactNode;
    description?: string;
    subtitle?: string;
    align?: 'left' | 'center' | 'right';
    className?: string;
    titleClassName?: string;
    subtitleClassName?: string;
    animated?: boolean;
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
    subtitleClassName = '',
    animated = true
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const colorClasses = {
        amber: 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200/50',
        blue: 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border border-blue-200/50',
        green: 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200/50',
        purple: 'bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 border border-purple-200/50',
        emerald: 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200/50'
    };

    const alignmentClasses = {
        left: 'text-left',
        center: 'text-center mx-auto',
        right: 'text-right ml-auto',
    };

    const MotionWrapper = animated ? motion.div : 'div';
    const motionProps = animated ? {
        ref,
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: "easeOut" }
    } : { ref };

    return (
        <MotionWrapper
            {...motionProps}
            className={`${alignmentClasses[align]} mb-16 ${className}`}
        >
            {badge && (
                <motion.span
                    initial={animated ? { opacity: 0, scale: 0.8 } : false}
                    animate={animated && isInView ? { opacity: 1, scale: 1 } : false}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className={`inline-flex items-center px-4 py-2 ${colorClasses[badgeColor]} rounded-full text-sm font-semibold mb-6 shadow-sm backdrop-blur-sm`}
                >
                    <span className="relative">
                        {badge}
                        {/* Subtle glow effect */}
                        <span className="absolute inset-0 blur-sm opacity-30">{badge}</span>
                    </span>
                </motion.span>
            )}
            
            <motion.h2
                initial={animated ? { opacity: 0, y: 20 } : false}
                animate={animated && isInView ? { opacity: 1, y: 0 } : false}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight tracking-tight ${titleClassName}`}
            >
                {title}
            </motion.h2>
            
            {subtitle && (
                <motion.p
                    initial={animated ? { opacity: 0, y: 15 } : false}
                    animate={animated && isInView ? { opacity: 1, y: 0 } : false}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className={`text-lg text-gray-600 leading-relaxed font-medium ${align === 'center' ? 'max-w-2xl mx-auto' : ''} ${subtitleClassName}`}
                >
                    {subtitle}
                </motion.p>
            )}
            
            {description && (
                <motion.p
                    initial={animated ? { opacity: 0, y: 15 } : false}
                    animate={animated && isInView ? { opacity: 1, y: 0 } : false}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className={`text-lg text-gray-600 leading-relaxed ${align === 'center' ? 'max-w-3xl mx-auto' : ''} mt-4`}
                >
                    {description}
                </motion.p>
            )}
        </MotionWrapper>
    );
};

export default SectionHeader;
