// Design System - Nova Ipê Premium
// Definições de cores, tipografia, espaçamentos e breakpoints para uso consistente em toda a aplicação

export const colors = {
    // Paleta principal - tons premium refinados
    primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9', // Cor principal - azul professional
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
        950: '#082f49',
    },

    // Tons neutros sofisticados e modernos
    neutral: {
        50: '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        300: '#d4d4d8',
        400: '#a1a1aa',
        500: '#71717a',
        600: '#52525b',
        700: '#3f3f46',
        800: '#27272a',
        900: '#18181b',
        950: '#09090b',
    },

    // Paleta secundária - tons de terra premium
    secondary: {
        50: '#fefdf8',
        100: '#fefbf0',
        200: '#fdf4d9',
        300: '#fce7a6',
        400: '#f9d86d',
        500: '#f5c842', // Dourado elegante
        600: '#e9b308',
        700: '#c4940a',
        800: '#a17c0a',
        900: '#86650a',
        950: '#4d3a04',
    },

    // Verde Ipê - cor de marca
    brand: {
        50: '#f0fdfa',
        100: '#ccfbf1',
        200: '#99f6e4',
        300: '#5eead4',
        400: '#2dd4bf',
        500: '#14b8a6', // Verde Ipê principal
        600: '#0d9488',
        700: '#0f766e',
        800: '#115e59',
        900: '#134e4a',
        950: '#042f2e',
    },

    // Cores de estado modernas
    success: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
    },

    warning: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
    },

    error: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
    },

    info: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
    },

    // Tons especiais para imóveis
    property: {
        sale: {
            50: '#fff7ed',
            500: '#f97316',
            600: '#ea580c',
        },
        rent: {
            50: '#eff6ff',
            500: '#3b82f6',
            600: '#2563eb',
        },
        featured: {
            50: '#fefce8',
            500: '#eab308',
            600: '#ca8a04',
        },
        luxury: {
            50: '#fdf4ff',
            500: '#a855f7',
            600: '#9333ea',
        },
    },

    // Gradientes predefinidos
    gradients: {
        primary: 'linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%)',
        secondary: 'linear-gradient(135deg, #f5c842 0%, #eab308 100%)',
        hero: 'linear-gradient(135deg, #0c4a6e 0%, #134e4a 50%, #14532d 100%)',
        premium: 'linear-gradient(135deg, #9333ea 0%, #a855f7 50%, #c084fc 100%)',
        sunset: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)',
    },
};

// Tipografia Premium
export const typography = {
    fontFamily: {
        sans: 'var(--font-body), "Inter", "Segoe UI", ui-sans-serif, system-ui, sans-serif',
        serif: '"Playfair Display", "Georgia", ui-serif, serif',
        mono: '"Fira Code", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        heading: 'var(--font-heading), "Inter", "Segoe UI", ui-sans-serif, system-ui, sans-serif',
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
        '7xl': '4.5rem',  // 72px
        '8xl': '6rem',    // 96px
        '9xl': '8rem',    // 128px
    },
    fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
    },
    lineHeight: {
        none: '1',
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2',
    },
    letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
    },
    // Hierarquia tipográfica premium
    hierarchy: {
        hero: {
            fontSize: '4.5rem', // 72px
            fontWeight: '800',
            lineHeight: '1.1',
            letterSpacing: '-0.025em',
        },
        h1: {
            fontSize: '3rem', // 48px
            fontWeight: '700',
            lineHeight: '1.2',
            letterSpacing: '-0.025em',
        },
        h2: {
            fontSize: '2.25rem', // 36px
            fontWeight: '600',
            lineHeight: '1.3',
            letterSpacing: '-0.025em',
        },
        h3: {
            fontSize: '1.875rem', // 30px
            fontWeight: '600',
            lineHeight: '1.4',
        },
        h4: {
            fontSize: '1.5rem', // 24px
            fontWeight: '600',
            lineHeight: '1.4',
        },
        h5: {
            fontSize: '1.25rem', // 20px
            fontWeight: '500',
            lineHeight: '1.5',
        },
        body: {
            fontSize: '1rem', // 16px
            fontWeight: '400',
            lineHeight: '1.6',
        },
        bodyLarge: {
            fontSize: '1.125rem', // 18px
            fontWeight: '400',
            lineHeight: '1.6',
        },
        caption: {
            fontSize: '0.875rem', // 14px
            fontWeight: '400',
            lineHeight: '1.5',
        },
        small: {
            fontSize: '0.75rem', // 12px
            fontWeight: '400',
            lineHeight: '1.5',
        },
    },
};

// Espaçamentos premium com maior granularidade
export const spacing = {
    px: '1px',
    0: '0',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    11: '2.75rem',    // 44px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    18: '4.5rem',     // 72px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    28: '7rem',       // 112px
    32: '8rem',       // 128px
    36: '9rem',       // 144px
    40: '10rem',      // 160px
    44: '11rem',      // 176px
    48: '12rem',      // 192px
    52: '13rem',      // 208px
    56: '14rem',      // 224px
    60: '15rem',      // 240px
    64: '16rem',      // 256px
    72: '18rem',      // 288px
    80: '20rem',      // 320px
    96: '24rem',      // 384px
    
    // Espaçamentos semânticos
    section: {
        xs: '2rem',     // 32px
        sm: '3rem',     // 48px
        md: '4rem',     // 64px
        lg: '6rem',     // 96px
        xl: '8rem',     // 128px
        xxl: '12rem',   // 192px
    },
    
    container: {
        xs: '1rem',     // 16px
        sm: '1.5rem',   // 24px
        md: '2rem',     // 32px
        lg: '3rem',     // 48px
        xl: '4rem',     // 64px
    },
    
    component: {
        xs: '0.5rem',   // 8px
        sm: '0.75rem',  // 12px
        md: '1rem',     // 16px
        lg: '1.5rem',   // 24px
        xl: '2rem',     // 32px
    },
};

// Utilidades para uso fácil
export const utils = {
    // Função para criar classes condicionais
    cn: (...classes: (string | undefined | false | null)[]) => {
        return classes.filter(Boolean).join(' ');
    },
    
    // Função para aplicar padrões de componentes
    applyPattern: (pattern: keyof typeof componentPatterns, variant: string) => {
        return componentPatterns[pattern]?.[variant as keyof typeof componentPatterns[typeof pattern]] || '';
    },
    
    // Função para responsive design
    responsive: {
        mobile: (classes: string) => classes.split(' ').map(c => `sm:${c}`).join(' '),
        tablet: (classes: string) => classes.split(' ').map(c => `md:${c}`).join(' '),
        desktop: (classes: string) => classes.split(' ').map(c => `lg:${c}`).join(' '),
        wide: (classes: string) => classes.split(' ').map(c => `xl:${c}`).join(' '),
    },
};

export default designSystem;

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

// Animações premium e micro-interações
export const animations = {
    // Animações básicas
    fadeIn: 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    fadeInUp: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    fadeInDown: 'fadeInDown 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    slideUp: 'slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    slideDown: 'slideDown 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    slideInLeft: 'slideInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    slideInRight: 'slideInRight 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Animações de escala
    scaleIn: 'scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    scaleOut: 'scaleOut 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Pulso e respiração
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    breathe: 'breathe 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    
    // Efeitos premium
    float: 'float 6s ease-in-out infinite',
    glow: 'glow 2s ease-in-out infinite alternate',
    shimmer: 'shimmer 2.5s linear infinite',
    ripple: 'ripple 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Rotações suaves
    rotate: 'rotate 20s linear infinite',
    spin: 'spin 1s linear infinite',
    
    // Bounces elegantes
    bounceIn: 'bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    bounceOut: 'bounceOut 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    
    // Animações específicas de componentes
    cardHover: 'cardHover 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    buttonPress: 'buttonPress 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    modalEnter: 'modalEnter 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    modalExit: 'modalExit 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Durações padronizadas
    durations: {
        instant: '0.1s',
        fast: '0.2s',
        normal: '0.3s',
        slow: '0.5s',
        slower: '0.8s',
        slowest: '1.2s',
    },
    
    // Timing functions
    ease: {
        default: 'cubic-bezier(0.4, 0, 0.2, 1)',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
};

// Transições premium
export const transitions = {
    default: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    color: 'color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    background: 'background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    border: 'border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    shadow: 'box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Transições específicas de componentes
    button: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    card: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    modal: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    dropdown: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    tooltip: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
};

// Efeitos de hover premium
export const hoverEffects = {
    // Elevação e crescimento
    lift: 'transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
    liftHeavy: 'transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl',
    grow: 'transform transition-all duration-300 hover:scale-105',
    growLight: 'transform transition-all duration-300 hover:scale-102',
    
    // Brilho e shimmer
    shine: 'relative overflow-hidden after:absolute after:inset-0 after:z-10 after:opacity-0 after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent hover:after:opacity-100 hover:after:translate-x-full after:transition-all after:duration-700',
    glow: 'transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/25',
    glowStrong: 'transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/40',
    
    // Rotação e inclinação
    tilt: 'transform transition-all duration-300 hover:rotate-1',
    tiltReverse: 'transform transition-all duration-300 hover:-rotate-1',
    skew: 'transform transition-all duration-300 hover:skew-y-1',
    
    // Efeitos de cor
    brighten: 'transition-all duration-300 hover:brightness-110',
    darken: 'transition-all duration-300 hover:brightness-90',
    saturate: 'transition-all duration-300 hover:saturate-150',
    
    // Efeitos combinados
    premium: 'transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-primary-500/25',
    elegant: 'transform transition-all duration-500 hover:-translate-y-0.5 hover:shadow-lg hover:brightness-105',
    subtle: 'transform transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md',
    
    // Efeitos específicos para propriedades
    propertyCard: 'transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/15',
    propertyImage: 'transform transition-all duration-500 hover:scale-105',
    button: 'transform transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0',
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

// Zindex layers organizados
export const zIndex = {
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50, // Default
    backdrop: 100,
    navbar: 200,
    sidebar: 300,
    dropdown: 400,
    overlay: 500,
    modal: 600,
    popover: 700,
    tooltip: 800,
    toast: 900,
    loading: 1000,
};

// Padrões de componentes premium
export const componentPatterns = {
    // Cards premium
    card: {
        base: 'bg-white rounded-xl border border-neutral-200 shadow-sm transition-all duration-300',
        hover: 'hover:shadow-lg hover:-translate-y-1',
        interactive: 'cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-primary-300',
        elevated: 'shadow-lg border-neutral-100',
        premium: 'bg-gradient-to-br from-white to-neutral-50 shadow-xl border border-neutral-200/50',
    },
    
    // Botões premium
    button: {
        primary: 'bg-primary-500 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 hover:bg-primary-600 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0',
        secondary: 'bg-neutral-100 text-neutral-700 font-medium px-6 py-3 rounded-lg transition-all duration-200 hover:bg-neutral-200 hover:-translate-y-0.5',
        outline: 'border-2 border-primary-500 text-primary-500 font-medium px-6 py-3 rounded-lg transition-all duration-200 hover:bg-primary-500 hover:text-white hover:-translate-y-0.5',
        ghost: 'text-neutral-600 font-medium px-6 py-3 rounded-lg transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-900',
        premium: 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-105',
    },
    
    // Inputs premium
    input: {
        base: 'w-full px-4 py-3 border border-neutral-200 rounded-lg transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none',
        error: 'border-error-500 focus:border-error-500 focus:ring-error-500/20',
        success: 'border-success-500 focus:border-success-500 focus:ring-success-500/20',
        large: 'px-5 py-4 text-lg',
        premium: 'bg-neutral-50 border-neutral-200 rounded-xl px-5 py-4 transition-all duration-200 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
    },
    
    // Containers e layouts
    container: {
        base: 'mx-auto px-4 sm:px-6 lg:px-8',
        narrow: 'max-w-4xl',
        wide: 'max-w-7xl',
        full: 'max-w-full',
        section: 'py-16 sm:py-20 lg:py-24',
    },
    
    // Grids responsivos
    grid: {
        properties: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
        features: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
        testimonials: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
        blog: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
    },
    
    // Texto e tipografia
    text: {
        hero: 'text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight',
        heading: 'text-3xl sm:text-4xl font-bold',
        subheading: 'text-xl sm:text-2xl font-semibold',
        body: 'text-base leading-relaxed',
        caption: 'text-sm text-neutral-600',
        muted: 'text-neutral-500',
    },
    
    // Estados visuais
    state: {
        loading: 'animate-pulse bg-neutral-200 rounded',
        empty: 'text-center py-12 text-neutral-500',
        error: 'text-center py-12 text-error-500',
        success: 'text-center py-12 text-success-500',
    },
    
    // Overlays e modais
    overlay: {
        backdrop: 'fixed inset-0 bg-black/50 backdrop-blur-sm z-backdrop',
        modal: 'fixed inset-0 flex items-center justify-center p-4 z-modal',
        drawer: 'fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-modal',
    },
};

// Breakpoints premium com mais granularidade
export const breakpoints = {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    '3xl': '1920px',
    
    // Breakpoints específicos
    mobile: '640px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
    ultrawide: '1536px',
};

// Sistema de design completo exportado
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
    componentPatterns,
};