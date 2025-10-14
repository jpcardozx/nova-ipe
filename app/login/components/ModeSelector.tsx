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
    <div className="grid grid-cols-2 gap-3">
      {MODES.map((mode) => {
        const Icon = mode.icon
        const isSelected = value === mode.value

        return (
          <button
            key={mode.value}
            type="button"
            onClick={() => onChange(mode.value)}
            className={`
              relative p-3 rounded-lg border-2 transition-all duration-150
              ${isSelected
                ? 'border-green-600 bg-green-600/10'
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-700/50'
              }
            `}
          >
            {/* Green indicator */}
            {isSelected && (
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500" />
            )}

            <div className="flex items-center gap-2.5">
              {/* Icon */}
              <div className={`
                p-1.5 rounded transition-colors duration-150
                ${isSelected
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-400'
                }
              `}>
                <Icon className="w-4 h-4" />
              </div>

              {/* Text */}
              <div className="flex-1 text-left">
                <p className={`
                  font-semibold text-sm transition-colors duration-150
                  ${isSelected ? 'text-white' : 'text-gray-400'}
                `}>
                  {mode.label}
                </p>
                <p className={`text-xs transition-colors duration-150 ${
                  isSelected ? 'text-gray-300' : 'text-gray-500'
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
