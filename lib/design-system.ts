// Design System - Nova Ipê Premium
// Definições de cores, tipografia, espaçamentos e breakpoints para uso consistente em toda a aplicação

export const colors = {
    // Paleta principal - tons premium
    primary: {
        50: '#fff8e6',
        100: '#ffedc4',
        200: '#ffe29d',
        300: '#ffd16d',
        400: '#ffbe3c',
        500: '#FFAD43', // Cor principal da marca
        600: '#e6983c',
        700: '#cc8534',
        800: '#a66b2a',
        900: '#805221',
    },

    // Tons neutros sofisticados
    neutral: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#0D1F2D', // Base para textos
    },

    // Tons de acentuação
    accent: {
        emerald: {
            50: '#ecfdf5',
            500: '#10b981',
            600: '#059669',
        },
        blue: {
            50: '#eff6ff',
            500: '#3b82f6',
            600: '#2563eb',
        },
        red: {
            50: '#fef2f2',
            500: '#ef4444',
            600: '#dc2626',
        },
    },

    // Estado
    state: {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
    }
};

// Tipografia
export const typography = {
    fontFamily: {
        sans: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', // Updated to --font-body
        serif: 'ui-serif, Georgia, Cambria, serif',
        mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
    fontSizes: {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        base: '1rem',     // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem', // 36px
        '5xl': '3rem',    // 48px
        '6xl': '3.75rem', // 60px
    },
    fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },
    lineHeight: {
        none: '1',
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2',
    },
};

// Espaçamentos
export const spacing = {
    px: '1px',
    0: '0',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
};

// Breakpoints para responsividade
export const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
};

// Sombras
export const shadows = {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none',
};

// Animações
export const animations = {
    fadeIn: 'fadeIn 0.5s ease-in-out',
    slideUp: 'slideUp 0.5s ease-in-out',
    slideDown: 'slideDown 0.5s ease-in-out',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
};

// Transições
export const transitions = {
    default: 'all 0.3s ease',
    fast: 'all 0.15s ease',
    slow: 'all 0.5s ease',
};

// Efeitos de hover
export const hoverEffects = {
    grow: 'transform transition duration-300 hover:scale-105',
    lift: 'transform transition duration-300 hover:-translate-y-1 hover:shadow-lg',
    shine: 'relative overflow-hidden after:absolute after:inset-0 after:z-10 after:opacity-0 after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent hover:after:opacity-100 hover:after:translate-x-full after:transition-all after:duration-700',
};

// Formato para radius
export const borderRadius = {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
};

// Zindex layers
export const zIndex = {
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50, // Default
    navbar: 100,
    modal: 200,
    popover: 300,
    tooltip: 400,
};

export const designSystem = {
    colors,
    typography,
    spacing,
    breakpoints,
    shadows,
    animations,
    transitions,
    hoverEffects,
    borderRadius,
    zIndex,
};

export default designSystem;