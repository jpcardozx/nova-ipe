/**
 * fallbacks/lucide-react-fallback.js
 * 
 * Arquivo fallback para usar se houver problemas com lucide-react
 * Implementa um sistema simplificado para segurar se houver falha na importação normal
 */

// Implementação de fallback simplificada dos ícones mais usados
const createFallbackIcon = (name) => {
    return function FallbackIcon(props) {
        const { color = 'currentColor', size = 24, ...restProps } = props;

        return {
            $$typeof: Symbol.for('react.element'),
            type: 'svg',
            key: null,
            ref: null,
            props: {
                xmlns: 'http://www.w3.org/2000/svg',
                width: size,
                height: size,
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: color,
                strokeWidth: 2,
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                children: `<!-- Fallback for ${name} -->`,
                ...restProps
            },
            _owner: null
        };
    };
};

// Exporta ícones padrão como fallback
module.exports = {
    Home: createFallbackIcon('Home'),
    Settings: createFallbackIcon('Settings'),
    User: createFallbackIcon('User'),
    Mail: createFallbackIcon('Mail'),
    Search: createFallbackIcon('Search'),
    ArrowRight: createFallbackIcon('ArrowRight'),
    ArrowLeft: createFallbackIcon('ArrowLeft'),
    Menu: createFallbackIcon('Menu'),
    X: createFallbackIcon('X'),
    Check: createFallbackIcon('Check'),
    AlertCircle: createFallbackIcon('AlertCircle'),
    Calendar: createFallbackIcon('Calendar'),
    // Add other icons as needed
};
