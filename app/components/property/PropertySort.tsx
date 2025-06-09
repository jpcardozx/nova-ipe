"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpDown, TrendingUp, DollarSign, Calendar, Ruler } from 'lucide-react'
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

export function PropertySort({ value, onChange, className }: PropertySortProps) {
  const currentOption = sortOptions.find(option => option.value === value) || sortOptions[0]

  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 text-gray-700 font-medium hover:bg-gray-50 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all cursor-pointer"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <ArrowUpDown className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  )
}
