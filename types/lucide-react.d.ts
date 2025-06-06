import * as React from 'react';

export interface LucideProps {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    absoluteStrokeWidth?: boolean;
    className?: string;
    onClick?: React.MouseEventHandler<SVGElement>;
    style?: React.CSSProperties;
    [key: string]: any;
}

declare module 'lucide-react' {
    export const Menu: React.ComponentType<LucideProps>;
    export const X: React.ComponentType<LucideProps>;

    // Allow accessing any icon as an indexable property
    export interface LucideIcons {
        [key: string]: React.ComponentType<LucideProps>;
    }

    // Common exports
    export const icons: LucideIcons;
}
