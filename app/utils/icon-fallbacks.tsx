/**
 * app/utils/icon-fallbacks.tsx
 * 
 * Sistema de fallback para ícones do lucide-react
 * Usado quando o pacote original falha no carregamento
 * 
 * @version 1.0.0
 * @date 19/05/2025
 */

import React from 'react';

/**
 * Tipo para as propriedades do ícone, compatível com LucideProps
 */
interface IconProps {
    size?: number | string;
    color?: string;
    strokeWidth?: string | number;
    className?: string;
    style?: React.CSSProperties;
    absoluteStrokeWidth?: boolean;
    [key: string]: any;
}

/**
 * Cria um componente de ícone de fallback
 */
const createFallbackIcon = (svgContent: string) => {
    return function FallbackIcon({
        size = 24,
        color = 'currentColor',
        strokeWidth = 2,
        className = '',
        style,
        ...props
    }: IconProps) {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
                style={style}
                dangerouslySetInnerHTML={{ __html: svgContent }}
                {...props}
            />
        );
    };
};

// Home icon fallback
export const Home = createFallbackIcon(
    '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>' +
    '<polyline points="9 22 9 12 15 12 15 22"></polyline>'
);

// User icon fallback
export const User = createFallbackIcon(
    '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>' +
    '<circle cx="12" cy="7" r="4"></circle>'
);

// Menu icon fallback
export const Menu = createFallbackIcon(
    '<line x1="4" x2="20" y1="12" y2="12"></line>' +
    '<line x1="4" x2="20" y1="6" y2="6"></line>' +
    '<line x1="4" x2="20" y1="18" y2="18"></line>'
);

// X icon fallback
export const X = createFallbackIcon(
    '<path d="M18 6 6 18"></path>' +
    '<path d="m6 6 12 12"></path>'
);

// Check icon fallback
export const Check = createFallbackIcon(
    '<path d="M20 6 9 17l-5-5"></path>'
);

// Settings icon fallback
export const Settings = createFallbackIcon(
    '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>' +
    '<circle cx="12" cy="12" r="3"></circle>'
);

// Search icon fallback
export const Search = createFallbackIcon(
    '<circle cx="11" cy="11" r="8"></circle>' +
    '<path d="m21 21-4.3-4.3"></path>'
);

// Email/Mail icon fallback
export const Mail = createFallbackIcon(
    '<rect width="20" height="16" x="2" y="4" rx="2"></rect>' +
    '<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>'
);
