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
import { LucideProps } from 'lucide-react';

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
    import(`lucide-react/dist/esm/icons/${iconName.toLowerCase()}`).then(module => {
        iconCache.set(iconName, module.default);
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
    // Verifica se o ícone já está em cache
    if (iconCache.has(name)) {
        const IconComponent = iconCache.get(name);
        return <IconComponent {...props} />;
    }

    // Lazy load do ícone
    const IconComponent = lazy(() =>
        import(`lucide-react/dist/esm/icons/${name.toLowerCase()}`)
            .then(module => {
                // Armazena em cache para uso futuro
                iconCache.set(name, module.default);
                return module;
            })
            .catch(err => {
                console.error(`Erro ao carregar ícone: ${name}`, err);
                return { default: () => <IconFallback /> };
            })
    );

    return (
        <Suspense fallback={<IconFallback />}>
            <IconComponent {...props} />
        </Suspense>
    );
}

/**
 * Objeto de ícones otimizados para uso direto
 * Exemplo: <OptimizedIcons.Home size={24} />
 */
export const OptimizedIcons = COMMON_ICONS.reduce((acc, name) => {
    acc[name] = (props: LucideProps) => <LazyIcon name={name} {...props} />;
    return acc;
}, {} as Record<string, (props: LucideProps) => JSX.Element>);

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
