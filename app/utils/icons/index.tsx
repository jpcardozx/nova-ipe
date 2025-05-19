/**
 * app/utils/icons/index.tsx
 * 
 * Sistema resiliente para importação de ícones com fallback
 * Tenta carregar do lucide-react primeiro, com fallback para nossas próprias implementações
 * 
 * @version 1.0.0
 * @date 19/05/2025
 */

import React from 'react';
import dynamic from 'next/dynamic';
import * as Fallbacks from '../icon-fallbacks';
import type { LucideProps } from 'lucide-react';

/**
 * Tipo para nomes de ícones do lucide-react
 */
type IconName = string;

/**
 * Define o tipo LucideIcon como um componente React que aceita LucideProps
 */
type LucideIcon = React.ComponentType<Omit<LucideProps, 'ref'>>;

/**
 * Cria um carregador dinâmico seguro para um ícone do lucide-react
 * com fallback para nossa implementação local
 */
const createSafeIconLoader = (iconName: IconName): JSX.Element => {
    // Usamos 'any' aqui para evitar problemas de tipagem com o dynamic import
    // O retorno final será tipado corretamente através do uso
    const DynamicIcon = dynamic(
        async () => {
            try {
                const mod = await import('lucide-react');
                const Icon = mod[iconName as keyof typeof mod] as LucideIcon | undefined;
                if (!Icon) {
                    return (Fallbacks[iconName as keyof typeof Fallbacks] || Fallbacks.Settings) as LucideIcon;
                }
                return Icon;
            } catch (e) {
                return (Fallbacks[iconName as keyof typeof Fallbacks] || Fallbacks.Settings) as LucideIcon;
            }
        },
        {
            loading: () => (
                <span
                    style={{
                        display: 'inline-block',
                        width: '24px',
                        height: '24px'
                    }}
                />
            ),
            ssr: false
        }
    );

    return <DynamicIcon />;
};

/**
 * Helper function to create icon component
 */
const createIconComponent = (iconName: string): React.FC<Omit<LucideProps, 'ref'>> => {
    return (props) => {
        const DynamicIcon = dynamic(
            async () => {
                try {
                    const mod = await import('lucide-react');
                    const IconComponent = mod[iconName as keyof typeof mod];
                    if (!IconComponent) {
                        return (Fallbacks[iconName as keyof typeof Fallbacks] || Fallbacks.Settings) as React.ComponentType<Omit<LucideProps, 'ref'>>;
                    }
                    return IconComponent as React.ComponentType<Omit<LucideProps, 'ref'>>;
                } catch (e) {
                    return (Fallbacks[iconName as keyof typeof Fallbacks] || Fallbacks.Settings) as React.ComponentType<Omit<LucideProps, 'ref'>>;
                }
            },
            {
                loading: () => (
                    <span
                        style={{
                            display: 'inline-block',
                            width: props.size || '24px',
                            height: props.size || '24px'
                        }}
                    />
                ),
                ssr: false
            }
        );

        return <DynamicIcon {...props} />;
    };
};

// Exporta os ícones mais usados com carregamento seguro
export const Home: React.FC<Omit<LucideProps, 'ref'>> = createIconComponent('Home');
export const User: React.FC<Omit<LucideProps, 'ref'>> = createIconComponent('User');
export const Menu: React.FC<Omit<LucideProps, 'ref'>> = createIconComponent('Menu');
export const X: React.FC<Omit<LucideProps, 'ref'>> = createIconComponent('X');
export const Check: React.FC<Omit<LucideProps, 'ref'>> = createIconComponent('Check');
export const Settings: React.FC<Omit<LucideProps, 'ref'>> = createIconComponent('Settings');
export const Search: React.FC<Omit<LucideProps, 'ref'>> = createIconComponent('Search');
export const Mail: React.FC<Omit<LucideProps, 'ref'>> = createIconComponent('Mail');

/**
 * Interface para as propriedades do componente Icon
 */
interface IconProps extends Omit<LucideProps, 'ref'> {
    name: IconName;
}

/**
 * Exporta um componente genérico que pode carregar qualquer ícone pelo nome
 */
export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
    const DynamicIcon = dynamic(
        async () => {
            try {
                const mod = await import('lucide-react');
                const IconComponent = mod[name as keyof typeof mod];
                if (!IconComponent) {
                    // Fallback para nossa implementação ou Settings como último recurso
                    return (Fallbacks[name as keyof typeof Fallbacks] || Fallbacks.Settings) as React.ComponentType<Omit<LucideProps, 'ref'>>;
                }
                return IconComponent as React.ComponentType<Omit<LucideProps, 'ref'>>;
            } catch (e) {
                return (Fallbacks[name as keyof typeof Fallbacks] || Fallbacks.Settings) as React.ComponentType<Omit<LucideProps, 'ref'>>;
            }
        },
        {
            loading: () => (
                <span
                    style={{
                        display: 'inline-block',
                        width: props.size || '24px',
                        height: props.size || '24px'
                    }}
                />
            ),
            ssr: false
        }
    );

    return <DynamicIcon {...props} />;
};

export default {
    Home,
    User,
    Menu,
    X,
    Check,
    Settings,
    Search,
    Mail,
    Icon,
};
