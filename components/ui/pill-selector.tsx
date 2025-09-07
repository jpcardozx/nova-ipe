'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PillSelectorProps {
  options: { label: string; value: string }[]
  value: string
  onChange: (value: string) => void
}

const PillSelector = ({ options, value, onChange }: PillSelectorProps) => {
  return (
    <div className="relative flex w-full max-w-xs items-center rounded-full bg-white/20 p-1 border border-white/30">
      {options.map((option) => (
        <div key={option.value} className="relative flex-1">
          <button
            onClick={() => onChange(option.value)}
            className={cn(
              'relative z-10 w-full rounded-full py-2 text-sm font-medium transition-colors duration-300',
              value === option.value ? 'text-white' : 'text-gray-300 hover:text-white'
            )}
          >
            {option.label}
          </button>
          {value === option.value && (
            <motion.div
              layoutId="pill"
              className="absolute inset-0 z-0 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 shadow-lg"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export { PillSelector }
