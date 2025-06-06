// Nova Ipê Premium Gradient System
// Reusable gradient utilities for consistent brand styling

export const novaIpeColors = {
    primary: {
        ipe: '#E6AA2C',           // Amarelo Ipê dourado vibrante
        ipeLight: '#F7D660',      // Variação clara
        ipeDark: '#B8841C',       // Variação escura
        ipeGlow: '#FFCC00'        // Brilho premium
    },
    earth: {
        brown: '#8B4513',         // Marrom terroso
        brownLight: '#A0522D',    // Marrom claro
        brownDark: '#654321',     // Marrom escuro
        warmBrown: '#9B6B47'      // Tom mais acolhedor
    },
    neutral: {
        black: '#1A1A1A',         // Preto suave
        charcoal: '#2D2D2D',      // Carvão
        white: '#FFFFFF',         // Branco puro
        cream: '#F8F4E3',         // Creme ipê
        softWhite: '#FEFEFE',     // Branco suave
        warmGray: '#6B7280'       // Cinza quente
    }
};

export const novaIpeGradients = {
    // Gradientes primários
    primary: `linear-gradient(135deg, ${novaIpeColors.primary.ipe} 0%, ${novaIpeColors.primary.ipeLight} 50%, ${novaIpeColors.primary.ipeGlow} 100%)`,
    primarySoft: `linear-gradient(135deg, ${novaIpeColors.primary.ipe}20 0%, ${novaIpeColors.primary.ipeLight}10 100%)`,
    
    // Gradientes terrosos
    earth: `linear-gradient(135deg, ${novaIpeColors.earth.brown} 0%, ${novaIpeColors.earth.brownLight} 50%, ${novaIpeColors.earth.warmBrown} 100%)`,
    earthSoft: `linear-gradient(135deg, ${novaIpeColors.earth.brown}20 0%, ${novaIpeColors.earth.warmBrown}10 100%)`,
    
    // Gradientes premium
    premium: `linear-gradient(135deg, ${novaIpeColors.neutral.black} 0%, ${novaIpeColors.neutral.charcoal} 50%, ${novaIpeColors.primary.ipe} 100%)`,
    luxurious: `linear-gradient(135deg, ${novaIpeColors.neutral.cream} 0%, ${novaIpeColors.neutral.white} 50%, ${novaIpeColors.neutral.cream} 100%)`,
    
    // Gradientes para fundos
    heroBackground: `linear-gradient(135deg, ${novaIpeColors.neutral.cream}90 0%, ${novaIpeColors.neutral.white}85 30%, ${novaIpeColors.primary.ipe}05 70%, ${novaIpeColors.neutral.cream}95 100%)`,
    navbarScrolled: `${novaIpeColors.neutral.softWhite}FA`,
    navbarDefault: `${novaIpeColors.neutral.cream}E6`,
    
    // Gradientes para botões
    buttonPrimary: `linear-gradient(135deg, ${novaIpeColors.primary.ipe} 0%, ${novaIpeColors.primary.ipeLight} 100%)`,
    buttonSecondary: `linear-gradient(135deg, ${novaIpeColors.earth.brown} 0%, ${novaIpeColors.earth.warmBrown} 100%)`,
    buttonHover: `linear-gradient(135deg, ${novaIpeColors.primary.ipeDark} 0%, ${novaIpeColors.primary.ipe} 100%)`,
    
    // Gradientes para cards
    cardBackground: `linear-gradient(135deg, ${novaIpeColors.neutral.white} 0%, ${novaIpeColors.neutral.cream}30 100%)`,
    cardHover: `linear-gradient(135deg, ${novaIpeColors.neutral.cream}50 0%, ${novaIpeColors.primary.ipe}10 100%)`,
    
    // Gradientes para texto
    textPrimary: `linear-gradient(135deg, ${novaIpeColors.primary.ipe} 0%, ${novaIpeColors.primary.ipeGlow} 50%, ${novaIpeColors.earth.warmBrown} 100%)`,
    textSecondary: `linear-gradient(135deg, ${novaIpeColors.earth.brown} 0%, ${novaIpeColors.earth.warmBrown} 100%)`,
    
    // Gradientes para overlays
    overlayLight: `linear-gradient(135deg, ${novaIpeColors.neutral.white}95 0%, ${novaIpeColors.neutral.white}50 50%, ${novaIpeColors.neutral.white}95 100%)`,
    overlayDark: `linear-gradient(135deg, ${novaIpeColors.neutral.black}90 0%, ${novaIpeColors.neutral.charcoal}60 50%, ${novaIpeColors.neutral.black}90 100%)`,
    
    // Gradientes para shadows
    shadowPrimary: `0 8px 32px -4px ${novaIpeColors.primary.ipe}20, 0 4px 16px -2px ${novaIpeColors.primary.ipe}10`,
    shadowEarth: `0 8px 32px -4px ${novaIpeColors.earth.brown}20, 0 4px 16px -2px ${novaIpeColors.earth.brown}10`,
    shadowNeutral: `0 8px 32px -4px ${novaIpeColors.neutral.charcoal}15, 0 4px 16px -2px ${novaIpeColors.neutral.charcoal}08`
};

// Utility functions for dynamic gradient generation
export const createNovaIpeGradient = (
    colors: string[], 
    direction: string = '135deg',
    opacity?: number
): string => {
    const processedColors = colors.map(color => 
        opacity !== undefined ? `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}` : color
    );
    return `linear-gradient(${direction}, ${processedColors.join(', ')})`;
};

export const createNovaIpeShadow = (
    color: string,
    intensity: 'light' | 'medium' | 'strong' = 'medium'
): string => {
    const intensityMap = {
        light: { blur: 20, spread: -4, opacity: '15' },
        medium: { blur: 32, spread: -8, opacity: '20' },
        strong: { blur: 40, spread: -10, opacity: '30' }
    };
    
    const { blur, spread, opacity } = intensityMap[intensity];
    return `0 8px ${blur}px ${spread}px ${color}${opacity}, 0 4px 16px -2px ${color}${Math.round(parseInt(opacity) * 0.6).toString(16)}`;
};

// Theme variants for different components
export const novaIpeThemes = {
    navbar: {
        default: {
            background: novaIpeGradients.navbarDefault,
            borderColor: `${novaIpeColors.primary.ipe}20`,
            shadow: novaIpeGradients.shadowNeutral
        },
        scrolled: {
            background: novaIpeGradients.navbarScrolled,
            borderColor: `${novaIpeColors.primary.ipe}40`,
            shadow: novaIpeGradients.shadowPrimary
        }
    },
    hero: {
        background: novaIpeGradients.heroBackground,
        titleGradient: novaIpeGradients.textPrimary,
        overlayGradient: novaIpeGradients.overlayLight
    },
    buttons: {
        primary: {
            background: novaIpeGradients.buttonPrimary,
            hover: novaIpeGradients.buttonHover,
            shadow: novaIpeGradients.shadowPrimary
        },
        secondary: {
            background: novaIpeGradients.buttonSecondary,
            hover: novaIpeGradients.buttonHover,
            shadow: novaIpeGradients.shadowEarth
        }
    },
    cards: {
        default: {
            background: novaIpeGradients.cardBackground,
            hover: novaIpeGradients.cardHover,
            shadow: novaIpeGradients.shadowNeutral
        }
    }
};

export default {
    colors: novaIpeColors,
    gradients: novaIpeGradients,
    themes: novaIpeThemes,
    utils: {
        createGradient: createNovaIpeGradient,
        createShadow: createNovaIpeShadow
    }
};
