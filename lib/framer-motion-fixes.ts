// Framer Motion v12 - Correções de tipos
export const motionFixes = {
  // Correção para ease arrays
  easeValues: {
    smooth: "easeInOut" as const,
    bounce: "easeOut" as const,
    spring: "easeInOut" as const,
  },
  
  // Correção para tipos de animação
  animationTypes: {
    spring: "spring" as const,
    tween: "tween" as const,
  },
  
  // Transitions padrão corrigidas
  transitions: {
    smooth: {
      type: "tween" as const,
      duration: 0.6,
      ease: "easeInOut" as const,
    },
    spring: {
      type: "spring" as const,
      damping: 25,
      stiffness: 300,
    },
    bounce: {
      type: "spring" as const,
      damping: 20,
      stiffness: 100,
    },
  },
} as const;
