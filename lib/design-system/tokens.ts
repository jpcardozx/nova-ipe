// Design System Tokens - IPÊ Imóveis Dashboard
// Versão: 1.0.0

export const designTokens = {
  // Paleta de cores unificada
  colors: {
    // Cores primárias - Identidade da marca
    primary: {
      50: '#fef7ee',
      100: '#fdead6', 
      200: '#fad2ac',
      300: '#f6b177',
      400: '#f18d40',
      500: '#ed7014', // Cor principal IPÊ (laranja amadeirado)
      600: '#de5a0a',
      700: '#b8450b',
      800: '#93380f',
      900: '#762f10',
      950: '#401506',
    },

    // Cores secundárias - Madeira/Natureza
    secondary: {
      50: '#f4f3f1',
      100: '#e6e3df',
      200: '#cec7c0',
      300: '#b0a59a',
      400: '#94857b',
      500: '#7d6f66', // Madeira média
      600: '#695c56',
      700: '#554a47',
      800: '#473e3c',
      900: '#3d3533',
      950: '#211c1b',
    },

    // Cinzas neutros - Interface
    neutral: {
      50: '#fafaf9',
      100: '#f4f4f3',
      200: '#e7e5e4',
      300: '#d6d3d1',
      400: '#a8a29e',
      500: '#78716c',
      600: '#57534e',
      700: '#44403c',
      800: '#292524',
      900: '#1c1917',
      950: '#0c0a09',
    },

    // Estados semânticos
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
    },

    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
    },

    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
    },

    info: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
    },
  },

  // Sistema tipográfico
  typography: {
    fontFamily: {
      sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
    },

    fontSize: {
      // Hierarquia clara para dashboard
      'xs': ['0.75rem', { lineHeight: '1rem' }],     // 12px - metadata
      'sm': ['0.875rem', { lineHeight: '1.25rem' }], // 14px - body small
      'base': ['1rem', { lineHeight: '1.5rem' }],    // 16px - body default
      'lg': ['1.125rem', { lineHeight: '1.75rem' }], // 18px - emphasized text
      'xl': ['1.25rem', { lineHeight: '1.75rem' }],  // 20px - card titles
      '2xl': ['1.5rem', { lineHeight: '2rem' }],     // 24px - section headers
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px - page titles
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],  // 36px - hero numbers
    },

    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },

  // Sistema de espaçamento
  spacing: {
    // Baseado em múltiplos de 4px para consistência
    '0.5': '0.125rem', // 2px
    '1': '0.25rem',    // 4px
    '1.5': '0.375rem', // 6px
    '2': '0.5rem',     // 8px
    '3': '0.75rem',    // 12px
    '4': '1rem',       // 16px
    '5': '1.25rem',    // 20px
    '6': '1.5rem',     // 24px
    '8': '2rem',       // 32px
    '10': '2.5rem',    // 40px
    '12': '3rem',      // 48px
    '16': '4rem',      // 64px
    '20': '5rem',      // 80px
    '24': '6rem',      // 96px
  },

  // Breakpoints responsivos
  breakpoints: {
    sm: '640px',   // Mobile landscape
    md: '768px',   // Tablet
    lg: '1024px',  // Desktop
    xl: '1280px',  // Large desktop
    '2xl': '1536px', // Extra large
  },

  // Sistema de elevação/sombras
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },

  // Raios de borda padronizados
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    md: '0.375rem',   // 6px - padrão cards
    lg: '0.5rem',     // 8px - modals
    xl: '0.75rem',    // 12px - hero cards
    '2xl': '1rem',    // 16px - seções especiais
    full: '9999px',   // botões arredondados
  },

  // Transições padronizadas
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Z-index layers
  zIndex: {
    base: 0,
    tooltip: 10,
    dropdown: 20,
    sticky: 30,
    overlay: 40,
    modal: 50,
    notification: 60,
  },
} as const

// Utilitários para uso mais fácil
export const colors = designTokens.colors
export const spacing = designTokens.spacing
export const typography = designTokens.typography
export const shadows = designTokens.shadows

// Paletas semânticas para componentes
export const semanticColors = {
  background: {
    primary: colors.neutral[50],
    secondary: colors.neutral[100],
    elevated: '#ffffff',
    overlay: 'rgb(0 0 0 / 0.5)',
  },
  
  text: {
    primary: colors.neutral[900],
    secondary: colors.neutral[700],
    muted: colors.neutral[500],
    inverse: colors.neutral[50],
  },

  border: {
    default: colors.neutral[200],
    subtle: colors.neutral[100],
    strong: colors.neutral[300],
  },

  state: {
    hover: colors.neutral[100],
    pressed: colors.neutral[200],
    selected: colors.primary[50],
    disabled: colors.neutral[100],
  },
} as const