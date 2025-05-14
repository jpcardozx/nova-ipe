/**
 * Design tokens para o projeto Ipê Imóveis
 * Este arquivo centraliza as constantes de design para manter consistência em todo o projeto
 */

export const AppTheme = {
    colors: {
        // Cores primárias da marca
        brand: {
            primary: '#1a6f5c',
            secondary: '#d4af37',
            accent: '#f8f4e3',
            dark: '#0D1F2D',
            light: '#f8f4e3',
        },

        // Esquema neutro
        neutral: {
            50: '#f8f8f8',
            100: '#e8e8e8',
            200: '#d1d1d1',
            300: '#b0b0b0',
            400: '#888888',
            500: '#6d6d6d',
            600: '#5d5d5d',
            700: '#4f4f4f',
            800: '#393939',
            900: '#212121',
        },

        // Estados funcionais
        state: {
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6',
        },
    },

    // Tipografia
    typography: {
        fontFamily: {
            base: 'var(--font-montserrat), system-ui, sans-serif',
            display: 'var(--font-italiana), serif',
            accent: 'var(--font-libre), serif',
        },
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
            '5xl': '3rem',
            '6xl': '4rem',
        },
    },

    // Espaçamentos
    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
        '4xl': '6rem',
    },

    // Bordas e sombras
    borders: {
        radius: {
            sm: '0.125rem',
            md: '0.25rem',
            lg: '0.5rem',
            xl: '1rem',
            full: '9999px',
        },
        width: {
            thin: '1px',
            medium: '2px',
            thick: '4px',
        },
    },

    // Sombras
    shadows: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
        inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
    },

    // Transições
    transitions: {
        default: '200ms ease-in-out',
        fast: '100ms ease-in-out',
        slow: '300ms ease-in-out',
    },

    // Breakpoints
    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
    },
};

export const DynamicClassNames = {
    // Classes para estados
    states: {
        active: 'is-active',
        disabled: 'is-disabled',
        loading: 'is-loading',
        opened: 'is-opened',
        error: 'has-error',
        success: 'has-success',
    },

    // Classes para layout
    layout: {
        container: 'container mx-auto px-4 sm:px-6 lg:px-8',
        section: 'py-12 sm:py-16 lg:py-24',
        grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
        flexRow: 'flex flex-row items-center',
        flexCol: 'flex flex-col',
    },

    // Classes para componentes específicos
    components: {
        card: 'bg-white rounded-lg shadow-md overflow-hidden',
        button: {
            primary: 'bg-brand-green text-white hover:bg-brand-green/90 transition-colors',
            secondary: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors',
            outline: 'border border-brand-green text-brand-green hover:bg-brand-green/10 transition-colors',
        },
    },
};

export default AppTheme;
