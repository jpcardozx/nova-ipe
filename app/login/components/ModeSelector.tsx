/**
 * Mode Selector Component
 * Seletor de modo de login (Dashboard/Studio)
 */

'use client'

import { LayoutDashboard, Building2 } from '../lib/icons'
import type { LoginMode } from '@/lib/hooks/useAuth'

interface ModeSelectorProps {
  value: LoginMode
  onChange: (mode: LoginMode) => void
}

const MODES = [
  {
    value: 'dashboard' as const,
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Gestão completa'
  },
  {
    value: 'studio' as const,
    label: 'Studio',
    icon: Building2,
    description: 'Editor de conteúdo'
  }
]

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {MODES.map((mode) => {
        const Icon = mode.icon
        const isSelected = value === mode.value

        return (
          <button
            key={mode.value}
            type="button"
            onClick={() => onChange(mode.value)}
            className={`
              relative p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300
              ${isSelected
                ? 'border-amber-500 bg-amber-500/15 shadow-lg shadow-amber-500/30 scale-[1.02]'
                : 'border-amber-500/20 bg-[#0D1F2D]/30 hover:border-amber-400/40 hover:bg-[#0D1F2D]/50 hover:scale-[1.01]'
              }
            `}
          >
            {/* AMBER indicator - Enhanced */}
            {isSelected && (
              <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-lg shadow-amber-400/60" />
            )}

            <div className="flex items-center gap-3 sm:gap-3.5 md:gap-4">
              {/* Icon with AMBER colors - Enhanced */}
              <div className={`
                p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300
                ${isSelected
                  ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-[#0D1F2D] shadow-md shadow-amber-500/40'
                  : 'bg-amber-500/10 text-amber-400/60'
                }
              `}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              {/* Text - Enhanced Responsive Typography */}
              <div className="flex-1 text-left">
                <p className={`
                  font-semibold text-sm sm:text-base md:text-lg transition-colors duration-200
                  ${isSelected ? 'text-[#F7D7A3]' : 'text-[#F7D7A3]/70'}
                `}>
                  {mode.label}
                </p>
                <p className={`text-xs sm:text-sm transition-colors duration-200 ${
                  isSelected ? 'text-amber-400/80' : 'text-gray-500'
                }`}>
                  {mode.description}
                </p>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
