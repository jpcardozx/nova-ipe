/**
 * Constantes e Assets do Login
 * Extraídos para reduzir parsing no componente principal
 */

// SVG patterns pré-otimizados
export const NOISE_TEXTURE_SVG = 
  "data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"

export const PATTERN_SVG = 
  "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"

// Mensagens de erro
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: {
    title: 'Credenciais Inválidas',
    message: 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.',
  },
  NETWORK_ERROR: {
    title: 'Erro de Conexão',
    message: 'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.',
  },
  SERVER_ERROR: {
    title: 'Erro do Servidor',
    message: 'Ocorreu um erro no servidor. Nossa equipe foi notificada.',
  },
  UNKNOWN_ERROR: {
    title: 'Erro Desconhecido',
    message: 'Algo inesperado aconteceu. Por favor, tente novamente.',
  },
} as const

// Animações otimizadas
export const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.05
      }
    }
  },
  item: {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  }
} as const
