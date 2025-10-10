// ========================================
// PROFESSIONAL HELP TOOLTIP
// Melhoria do tooltip do /wordpress-catalog
// Design profissional, limpo e responsivo
// ========================================

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, X, Sparkles } from 'lucide-react'

interface HelpTooltipProps {
  title: string
  description: string
  actionText?: string
  onActionClick?: () => void
  placement?: 'top' | 'bottom' | 'left' | 'right'
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'info' | 'success' | 'warning'
}

const sizeClasses = {
  sm: {
    button: 'p-1.5',
    icon: 'w-4 h-4',
    tooltip: 'w-56 text-xs',
    title: 'text-xs',
    description: 'text-[10px]',
    action: 'text-[10px]'
  },
  md: {
    button: 'p-2',
    icon: 'w-5 h-5',
    tooltip: 'w-72 text-sm',
    title: 'text-sm',
    description: 'text-xs',
    action: 'text-xs'
  },
  lg: {
    button: 'p-2.5',
    icon: 'w-6 h-6',
    tooltip: 'w-80 text-base',
    title: 'text-base',
    description: 'text-sm',
    action: 'text-sm'
  }
}

const variantColors = {
  default: {
    button: 'text-slate-400 hover:text-amber-500',
    bg: 'bg-slate-900',
    text: 'text-white',
    description: 'text-slate-300',
    action: 'text-amber-400 hover:text-amber-300',
    arrow: 'bg-slate-900'
  },
  info: {
    button: 'text-blue-400 hover:text-blue-600',
    bg: 'bg-blue-900',
    text: 'text-white',
    description: 'text-blue-200',
    action: 'text-blue-300 hover:text-blue-100',
    arrow: 'bg-blue-900'
  },
  success: {
    button: 'text-green-400 hover:text-green-600',
    bg: 'bg-green-900',
    text: 'text-white',
    description: 'text-green-200',
    action: 'text-green-300 hover:text-green-100',
    arrow: 'bg-green-900'
  },
  warning: {
    button: 'text-amber-400 hover:text-amber-600',
    bg: 'bg-amber-900',
    text: 'text-white',
    description: 'text-amber-200',
    action: 'text-amber-300 hover:text-amber-100',
    arrow: 'bg-amber-900'
  }
}

const placementClasses = {
  top: {
    tooltip: 'bottom-full mb-2',
    arrow: '-bottom-1 left-1/2 -translate-x-1/2 rotate-45'
  },
  bottom: {
    tooltip: 'top-full mt-2',
    arrow: '-top-1 left-1/2 -translate-x-1/2 rotate-45'
  },
  left: {
    tooltip: 'right-full mr-2',
    arrow: '-right-1 top-1/2 -translate-y-1/2 rotate-45'
  },
  right: {
    tooltip: 'left-full ml-2',
    arrow: '-left-1 top-1/2 -translate-y-1/2 rotate-45'
  }
}

export function HelpTooltip({
  title,
  description,
  actionText,
  onActionClick,
  placement = 'bottom',
  size = 'md',
  variant = 'default'
}: HelpTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const sizes = sizeClasses[size]
  const colors = variantColors[variant]
  const positions = placementClasses[placement]

  // Auto-close after hovering out (with delay)
  const handleMouseLeave = () => {
    setIsHovering(false)
    setTimeout(() => {
      if (!isOpen) {
        setIsOpen(false)
      }
    }, 300)
  }

  return (
    <div className="relative inline-block">
      {/* Help Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => {
          setIsHovering(true)
          setIsOpen(true)
        }}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          ${sizes.button} 
          ${colors.button}
          hover:bg-slate-50/50 dark:hover:bg-slate-800/50
          rounded-full transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2
          group relative
        `}
        aria-label="Ajuda"
      >
        <HelpCircle className={`${sizes.icon} transition-transform`} />
        
        {/* Ping animation when not hovering */}
        {!isHovering && (
          <span className="absolute inset-0 rounded-full bg-amber-400 opacity-0 group-hover:opacity-20 group-hover:animate-ping" />
        )}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: placement === 'top' ? 5 : -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: placement === 'top' ? 5 : -5 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onMouseEnter={() => {
              setIsHovering(true)
              setIsOpen(true)
            }}
            onMouseLeave={handleMouseLeave}
            className={`
              absolute z-50
              ${positions.tooltip}
              ${sizes.tooltip}
            `}
          >
            <div className={`
              ${colors.bg}
              ${colors.text}
              rounded-2xl shadow-2xl 
              border border-white/10
              overflow-hidden
              backdrop-blur-sm
            `}>
              {/* Content */}
              <div className="p-4">
                {/* Header with close button */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <p className={`${sizes.title} font-bold leading-tight`}>
                      {title}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                    aria-label="Fechar"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Description */}
                <p className={`
                  ${sizes.description} 
                  ${colors.description}
                  leading-relaxed mb-3
                `}>
                  {description}
                </p>

                {/* Action Button */}
                {actionText && onActionClick && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onActionClick()
                      setIsOpen(false)
                    }}
                    className={`
                      ${sizes.action}
                      ${colors.action}
                      font-semibold
                      flex items-center gap-1.5
                      transition-all duration-200
                      hover:gap-2
                    `}
                  >
                    {actionText}
                    <motion.span
                      initial={{ x: 0 }}
                      animate={{ x: [0, 3, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      →
                    </motion.span>
                  </button>
                )}
              </div>

              {/* Arrow */}
              <div className={`
                absolute w-2 h-2 
                ${positions.arrow}
                ${colors.arrow}
                border-white/10
              `} style={{
                borderTopWidth: placement === 'bottom' ? '1px' : 0,
                borderLeftWidth: placement === 'right' ? '1px' : 0,
                borderBottomWidth: placement === 'top' ? '1px' : 0,
                borderRightWidth: placement === 'left' ? '1px' : 0,
              }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ========================================
// INLINE HELPER TEXT (Alternative)
// Para quando precisar de texto inline ao invés de tooltip
// ========================================

interface InlineHelperProps {
  text: string
  variant?: 'info' | 'warning' | 'success'
}

export function InlineHelper({ text, variant = 'info' }: InlineHelperProps) {
  const colors = {
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    success: 'bg-green-50 text-green-700 border-green-200'
  }

  return (
    <div className={`
      ${colors[variant]}
      text-xs
      px-3 py-2
      rounded-lg
      border
      flex items-start gap-2
    `}>
      <HelpCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
      <p className="leading-relaxed">{text}</p>
    </div>
  )
}
