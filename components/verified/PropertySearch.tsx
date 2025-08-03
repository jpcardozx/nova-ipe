"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Search, MapPin, X, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PropertySearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  suggestions?: string[]
  recentSearches?: string[]
}

function PropertySearch({
  value,
  onChange,
  placeholder = "Buscar imóveis...",
  className,
  suggestions = [],
  recentSearches = []
}: PropertySearchProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
      </div>

      {isOpen && (suggestions.length > 0 || recentSearches.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {suggestions.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 mb-2">Sugestões</div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onChange(suggestion)}
                  className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {recentSearches.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <div className="text-xs font-medium text-gray-500 mb-2">Pesquisas recentes</div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => onChange(search)}
                  className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                >
                  {search}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PropertySearch;