/**
 * SafeIcon.tsx
 * 
 * Componente de isolamento para ícones do lucide-react
 * Evita erros de renderização caso haja problemas com o pacote lucide-react
 * 
 * @date 19/05/2025
 */

import React from 'react';
import dynamic from 'next/dynamic';
import type { LucideProps } from 'lucide-react';

/**
 * Tipo para nome de ícone do lucide-react
 */
type IconName = string;

/**
 * Interface para as propriedades do SafeIcon
 */
interface SafeIconProps extends Omit<LucideProps, 'ref'> {
    name: IconName;
    size?: number | string;
    color?: string;
    style?: React.CSSProperties;
    className?: string;
}

/**
 * SafeIcon - Componente que carrega ícones do lucide-react com fallback
 * 
 * @param {SafeIconProps} props - Propriedades do componente
 * @returns {JSX.Element} - Componente de ícone seguro
 */
export const SafeIcon: React.FC<SafeIconProps> = ({
    name,
    size = 24,
    color = 'currentColor',
    style = {},
    className = '',
    ...props
}: SafeIconProps) => {    // Usando uma abordagem de componente dinâmico direto para evitar problemas de tipagem
    const DynamicIcon = dynamic(
        async () => {
            const mod = await import('lucide-react');
            const Icon = mod[name as keyof typeof mod];
            if (Icon) {
                return Icon as React.ComponentType<Omit<LucideProps, "ref">>;
            } else {
                console.warn(`Failed to load icon: ${name}, using fallback`);
                return () => (
                    <svg
                        width={size}
                        height={size}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={className}
                        style={style}
                        {...props}
                    >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <path d="M12 8v8" />
                        <path d="M8 12h8" />
                    </svg>
                );
            }
        },
        {
            loading: () => (
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={color}
                    className={className}
                    style={style}
                />
            ),
            ssr: false
        }
    );

    return <DynamicIcon size={size} color={color} className={className} style={style} {...props} />;
};

/**
 * Cria um componente de ícone específico com fallback de segurança
 * 
 * @param {IconName} iconName - Nome do ícone lucide-react
 * @returns {React.FC<Omit<SafeIconProps, 'name'>>} - Componente de ícone específico
 */
export const createSafeIcon = (iconName: IconName) => {
    return (props: Omit<SafeIconProps, 'name'>) => <SafeIcon name={iconName} {...props} />;
};

// Ícones comumente usados na aplicação
export const SafeHomeIcon = createSafeIcon('Home');
export const SafeSettingsIcon = createSafeIcon('Settings');
export const SafeUserIcon = createSafeIcon('User');
export const SafeMenuIcon = createSafeIcon('Menu');
export const SafeXIcon = createSafeIcon('X');
export const SafeCheckIcon = createSafeIcon('Check');

export default SafeIcon;
