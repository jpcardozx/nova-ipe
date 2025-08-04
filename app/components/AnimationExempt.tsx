'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import React from 'react';

type AnimationExemptProps = HTMLMotionProps<'div'> & {
    children: React.ReactNode;
    as?: React.ElementType;
};

/**
 * Componente que envolve elementos com animações do Framer Motion
 * e os isenta das animações globais do ScrollAnimations
 */
export default function AnimationExempt({
    children,
    as = 'div',
    className = '',
    ...props
}: AnimationExemptProps) {
    const Component = motion[as as keyof typeof motion] as any || motion.div;

    return (
        <Component
            className={`animation-exempt gpu-animated ${className}`}
            {...props}
        >
            {children}
        </Component>
    );
}
