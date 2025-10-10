/**
 * Design Tokens - Dashboard Nova Ipê
 * Centralizaço de padrões de design para consistência
 * 
 * @version 2.0.0
 * @date 2025-10-09
 */

export const designTokens = {
  /**
   * CORES E TEMAS
   */
  colors: {
    // Focus States - WCAG AAA compliant
    focus: {
      ring: 'focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400',
      outline: 'focus:outline-none',
      border: 'focus:border-transparent',
      full: 'focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent'
    },

    // Borders
    border: {
      primary: 'border-gray-200 dark:border-gray-800',
      secondary: 'border-gray-300 dark:border-gray-700',
      subtle: 'border-gray-100 dark:border-gray-800/50',
      hover: 'hover:border-gray-300 dark:hover:border-gray-700'
    },

    // Text
    text: {
      primary: 'text-gray-900 dark:text-gray-100',
      secondary: 'text-gray-600 dark:text-gray-400',
      tertiary: 'text-gray-500 dark:text-gray-500',
      placeholder: 'placeholder:text-gray-400 dark:placeholder:text-gray-500'
    },

    // Backgrounds
    background: {
      primary: 'bg-white dark:bg-gray-900',
      secondary: 'bg-gray-50 dark:bg-gray-800',
      tertiary: 'bg-gray-100 dark:bg-gray-950',
      hover: 'hover:bg-gray-50 dark:hover:bg-gray-800',
      active: 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30'
    },

    // Link & Interactive
    interactive: {
      primary: 'text-blue-600 dark:text-blue-400',
      hover: 'hover:text-blue-700 dark:hover:text-blue-300',
      active: 'active:text-blue-800 dark:active:text-blue-200'
    },

    // Status Colors
    status: {
      success: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30',
      warning: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30',
      error: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30',
      info: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
    }
  },

  /**
   * ESPAÇAMENTO
   */
  spacing: {
    // Card Padding
    card: {
      primary: 'p-6',
      secondary: 'p-4',
      compact: 'p-3',
      minimal: 'p-2'
    },

    // Gap Spacing
    gap: {
      compact: 'gap-2',
      regular: 'gap-4',
      spacious: 'gap-6',
      wide: 'gap-8'
    },

    // Section Spacing
    section: {
      top: 'mt-6',
      bottom: 'mb-6',
      vertical: 'my-6'
    }
  },

  /**
   * BORDAS E RAIOS
   */
  radius: {
    button: 'rounded-lg',
    input: 'rounded-lg',
    card: 'rounded-xl',
    modal: 'rounded-2xl',
    circle: 'rounded-full'
  },

  /**
   * SOMBRAS E ELEVAÇÃO
   */
  shadow: {
    card: 'shadow-sm dark:shadow-gray-900/10',
    elevated: 'shadow-md dark:shadow-gray-900/30',
    dropdown: 'shadow-lg dark:shadow-gray-900/50',
    modal: 'shadow-2xl dark:shadow-gray-950/80',
    hover: 'hover:shadow-md dark:hover:shadow-gray-900/50'
  },

  /**
   * TRANSIÇÕES E ANIMAÇÕES
   */
  transition: {
    fast: 'duration-150',
    normal: 'duration-200',
    slow: 'duration-300',
    ease: 'ease-in-out',
    
    // Presets completos
    all: 'transition-all duration-200 ease-in-out',
    colors: 'transition-colors duration-200',
    transform: 'transition-transform duration-200',
    opacity: 'transition-opacity duration-200'
  },

  /**
   * TIPOGRAFIA
   */
  typography: {
    // Headings
    h1: 'text-2xl font-bold',
    h2: 'text-xl font-semibold',
    h3: 'text-lg font-medium',
    h4: 'text-base font-medium',

    // Body
    body: {
      large: 'text-base',
      regular: 'text-sm',
      small: 'text-xs'
    },

    // Weights
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold'
    }
  },

  /**
   * ÍCONES
   */
  icons: {
    mini: 'h-3 w-3',
    small: 'h-4 w-4',
    regular: 'h-5 w-5',
    large: 'h-6 w-6',
    xlarge: 'h-8 w-8',
    empty: 'h-12 w-12'
  },

  /**
   * COMPONENTES ESPECÍFICOS
   */
  components: {
    // Inputs
    input: {
      base: 'w-full px-4 py-2 border rounded-lg text-sm transition-all duration-200',
      withIcon: 'pl-10 pr-4 py-2',
      focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent',
      error: 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
    },

    // Buttons
    button: {
      base: 'px-4 py-2 rounded-lg font-medium transition-all duration-200',
      primary: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white',
      secondary: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100',
      ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
    },

    // Cards
    card: {
      base: 'bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-gray-900/10',
      hover: 'hover:shadow-md dark:hover:shadow-gray-900/50 hover:border-gray-300 dark:hover:border-gray-700',
      interactive: 'cursor-pointer transition-all duration-200'
    },

    // Dropdowns
    dropdown: {
      container: 'absolute z-50 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50',
      item: 'px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300',
      divider: 'border-t border-gray-100 dark:border-gray-800'
    },

    // Badges
    badge: {
      success: 'px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      warning: 'px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      error: 'px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      info: 'px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      neutral: 'px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
    },

    // Empty States
    empty: {
      container: 'text-center py-8',
      icon: 'h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-700',
      title: 'font-medium text-gray-900 dark:text-gray-100',
      description: 'text-sm text-gray-500 dark:text-gray-400 mt-1'
    }
  },

  /**
   * LAYOUTS
   */
  layout: {
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    section: 'py-8 md:py-12',
    
    // Grid Systems
    grid: {
      cols1: 'grid grid-cols-1',
      cols2: 'grid grid-cols-1 md:grid-cols-2',
      cols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      cols4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    }
  },

  /**
   * SCROLLBAR
   */
  scrollbar: {
    thin: 'scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent',
    custom: 'scrollbar-w-2 scrollbar-thumb-rounded-full'
  }
}

/**
 * UTILITY FUNCTIONS
 */
export const combineTokens = (...tokens: string[]) => tokens.join(' ')

export const getInputClasses = (error?: boolean) => {
  const base = combineTokens(
    designTokens.components.input.base,
    designTokens.components.input.focus,
    designTokens.colors.border.primary,
    designTokens.colors.text.primary,
    designTokens.colors.text.placeholder,
    designTokens.colors.background.primary
  )
  
  return error 
    ? combineTokens(base, designTokens.components.input.error)
    : base
}

export const getButtonClasses = (variant: 'primary' | 'secondary' | 'ghost' = 'primary') => {
  return combineTokens(
    designTokens.components.button.base,
    designTokens.components.button[variant]
  )
}

export const getCardClasses = (interactive = false) => {
  const base = combineTokens(
    designTokens.components.card.base,
    designTokens.spacing.card.primary
  )
  
  return interactive
    ? combineTokens(base, designTokens.components.card.hover, designTokens.components.card.interactive)
    : base
}

/**
 * EXPORT DEFAULT
 */
export default designTokens
