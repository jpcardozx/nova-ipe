import React, { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ---- Advanced Badge Component ----
export const Badge: FC<{
    variant?: 'primary' | 'secondary' | 'accent';
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
}> = ({ variant = 'primary', size = 'md', children }) => {
    const base = 'inline-flex items-center font-semibold rounded-full transition-shadow duration-300';
    const sizes = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-1.5',
    } as const;
    const variants: Record<typeof variant, string> = {
        primary: 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg hover:shadow-xl',
        secondary: 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white shadow-lg hover:shadow-xl',
        accent: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg',
    };

    return (
        <motion.span
            whileHover={{ scale: 1.05 }}
            className={cn(base, sizes[size], variants[variant])}
        >
            {children}
        </motion.span>
    );
};

// ---- Advanced Feature Component ----
export const Feature: FC<{
    icon: ReactNode;
    label: string;
    value: string | number;
}> = ({ icon, label, value }) => (
    <motion.div
        whileHover={{ x: 5 }}
        className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all"
    >
        <div className="w-10 h-10 flex items-center justify-center bg-amber-100 rounded-lg">
            {icon}
        </div>
        <div>
            <div className="text-xs uppercase text-stone-400 mb-0.5">
                {label}
            </div>
            <div className="text-sm font-medium text-stone-800">
                {value}
            </div>
        </div>
    </motion.div>
);

// Exports for easy imports
export default { Badge, Feature };
