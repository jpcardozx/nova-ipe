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

    const badgeColorStyles = {
        amber: 'bg-primary-lightest text-primary-dark border border-primary-light shadow-sm-primary',
        blue: 'bg-secondary-lightest text-secondary-dark border border-secondary-light shadow-sm-secondary',
        green: 'bg-accent-success-lightest text-accent-success-dark border border-accent-success-light shadow-sm-accent-success',
        purple: 'bg-accent-highlight-lightest text-accent-highlight-dark border border-accent-highlight-light shadow-sm-accent-highlight',
        emerald: 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200/50' // Retain if specific, or map to a new design system token if available
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
            className={`${alignmentClasses[align]} mb-spacing-xl ${className}`}
        >
            {badge && (
                <motion.span
                    initial={animated ? { opacity: 0, scale: 0.8 } : false}
                    animate={animated && isInView ? { opacity: 1, scale: 1 } : false}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className={`inline-flex items-center px-spacing-sm py-spacing-xs ${badgeColorStyles[badgeColor]} rounded-full text-typography-body-strong-sm font-family-primary mb-spacing-md backdrop-blur-sm`}
                >
                    <span className="relative">
                        {badge}
                        {/* Subtle glow effect - consider if this aligns with new design system or remove/restyle */}
                        <span className="absolute inset-0 blur-sm opacity-30">{badge}</span>
                    </span>
                </motion.span>
            )}

            <motion.h2
                initial={animated ? { opacity: 0, y: 20 } : false}
                animate={animated && isInView ? { opacity: 1, y: 0 } : false}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`font-family-headings text-typography-display-md md:text-typography-display-lg lg:text-typography-display-xl text-neutral-darkest mb-spacing-md leading-tight tracking-tight ${titleClassName}`}
            >
                {title}
            </motion.h2>

            {subtitle && (
                <motion.p
                    initial={animated ? { opacity: 0, y: 15 } : false}
                    animate={animated && isInView ? { opacity: 1, y: 0 } : false}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className={`font-family-body text-typography-body-lg text-neutral-medium leading-relaxed ${align === 'center' ? 'max-w-2xl mx-auto' : ''} ${subtitleClassName}`}
                >
                    {subtitle}
                </motion.p>
            )}

            {description && (
                <motion.p
                    initial={animated ? { opacity: 0, y: 15 } : false}
                    animate={animated && isInView ? { opacity: 1, y: 0 } : false}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className={`font-family-body text-typography-body-md text-neutral-default leading-relaxed ${align === 'center' ? 'max-w-3xl mx-auto' : ''} mt-spacing-sm`}
                >
                    {description}
                </motion.p>
            )}
        </MotionWrapper>
    );
};

export default SectionHeader;
