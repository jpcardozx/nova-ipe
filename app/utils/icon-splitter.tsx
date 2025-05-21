'use client';

/**
 * Icon Splitter
 * 
 * Este módulo otimiza o carregamento de ícones Lucide com code-splitting avançado,
 * reduzindo significativamente o impacto de performance da biblioteca Lucide-React.
 * 
 * O problema principal identificado foi o carregamento excessivo (~6860ms) que afeta
 * o LCP e bloqueia a thread principal.
 */

import React, { lazy, Suspense } from 'react';
import type { LucideProps } from '../../types/lucide-react';

// Objeto para armazenar ícones em cache
const iconCache = new Map();

// Lista de ícones frequentemente usados
const COMMON_ICONS = [
    'Home', 'Search', 'MapPin', 'Building2', 'Bath', 'BedDouble', 'Car',
    'ArrowRight', 'ChevronRight', 'ChevronLeft', 'Heart', 'Star', 'Phone',
    'Menu', 'X', 'Info'
];

// Pré-carregamento de ícones comuns
COMMON_ICONS.forEach(iconName => {
    import('lucide-react').then(mod => {
        if (!mod[iconName]) throw new Error(`Icon ${iconName} not found in lucide-react`);
        iconCache.set(iconName, mod[iconName]);
    }).catch(err => {
        console.error(`Erro ao pré-carregar ícone: ${iconName}`, err);
    });
});

// Fallback component
const IconFallback = () => (
    <div className="w-5 h-5 rounded bg-slate-100 animate-pulse" />
);

/**
 * Componente LazyIcon que carrega ícones sob demanda
 */
export function LazyIcon({ name, ...props }: { name: string } & LucideProps) {
    const [IconComponent, setIconComponent] = React.useState<React.ComponentType<LucideProps> | null>(null);
    React.useEffect(() => {
        let mounted = true;
        import('lucide-react').then(mod => {
            if (mounted) {
                const Icon = mod[name as keyof typeof mod] as React.ComponentType<LucideProps> | undefined;
                setIconComponent(() => Icon || null);
            }
        });
        return () => { mounted = false; };
    }, [name]);
    if (!IconComponent) return <IconFallback />;
    return <IconComponent {...props} />;
}

/**
 * Objeto de ícones otimizados para uso direto
 * Exemplo: <OptimizedIcons.Home size={24} />
 */
export const OptimizedIcons = COMMON_ICONS.reduce((acc, name) => {
    acc[name] = (props: LucideProps) => <LazyIcon name={name} {...props} />;
    return acc;
}, {} as Record<string, (props: LucideProps) => React.ReactElement>);

/**
 * Função para carregar ícones dinamicamente
 */
export function loadIcon(name: string): Promise<React.ComponentType<LucideProps>> {
    if (iconCache.has(name)) {
        return Promise.resolve(iconCache.get(name));
    }

    return import(`lucide-react/dist/esm/icons/${name.toLowerCase()}`)
        .then(module => {
            iconCache.set(name, module.default);
            return module.default;
        });
}
