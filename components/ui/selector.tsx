'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import Button from './button'

interface SelectorProps {
  options: { label: string; value: string }[]
  value: string
  onChange: (value: string) => void
}

const Selector = React.forwardRef<HTMLDivElement, SelectorProps>(
  ({ options, value, onChange, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className="inline-flex rounded-md shadow-sm"
        {...props}
      >
        {options.map((option, index) => (
          <Button
            key={option.value}
            onClick={() => onChange(option.value)}
            variant={value === option.value ? 'default' : 'outline'}
            className={cn(
              'px-4 py-2 text-sm font-medium',
              index === 0 ? 'rounded-l-md' : '',
              index === options.length - 1 ? 'rounded-r-md' : '',
              index > 0 ? '-ml-px' : ''
            )}
          >
            {option.label}
          </Button>
        ))}
      </div>
    )
  }
)

Selector.displayName = 'Selector'

export { Selector }
