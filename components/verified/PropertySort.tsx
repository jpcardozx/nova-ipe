"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpDown, TrendingUp, DollarSign, Calendar, Ruler, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PropertySortProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

const sortOptions = [
  { value: 'relevance', label: 'Relevância', icon: TrendingUp },
  { value: 'price-asc', label: 'Menor preço', icon: DollarSign },
  { value: 'price-desc', label: 'Maior preço', icon: DollarSign },
  { value: 'area', label: 'Maior área', icon: Ruler },
  { value: 'newest', label: 'Mais recentes', icon: Calendar },
]

function PropertySort({ value, onChange, className }: PropertySortProps) {
  const [isOpen, setIsOpen] = useState(false)
  const currentSort = sortOptions.find(option => option.value === value) || sortOptions[0]

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
      >
        <currentSort.icon className="h-4 w-4" />
        <span>{currentSort.label}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={cn(
                "w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50",
                value === option.value && "bg-blue-50 text-blue-600"
              )}
            >
              <option.icon className="h-4 w-4" />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default PropertySort;