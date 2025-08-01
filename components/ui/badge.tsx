'use client';

import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

function Badge({
    className = '',
    variant = 'default',
    ...props
}: BadgeProps) {
    const variantClasses = {
        default: 'bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground border border-input hover:bg-accent hover:text-accent-foreground'
    };

    const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none';
    const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

    return (
        <div className={classes} {...props} />
    );
}

export default Badge;