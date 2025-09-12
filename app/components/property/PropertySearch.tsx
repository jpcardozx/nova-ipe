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

export function PropertySearch({
  value,
  onChange,
  placeholder = "Buscar imóveis...",
  className,
  suggestions = [],
  recentSearches = []
}: PropertySearchProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // TODO: Conectar com API real para sugestões
  const mockSuggestions: string[] = []
  const mockRecentSearches: string[] = []

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    setShowSuggestions(newValue.length > 0 || mockRecentSearches.length > 0)
  }

  const handleInputFocus = () => {
    setIsFocused(true)
    setShowSuggestions(value.length > 0 || mockRecentSearches.length > 0)
  }

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    setShowSuggestions(false)
    setIsFocused(false)
    inputRef.current?.blur()
  }

  const clearSearch = () => {
    onChange('')
    inputRef.current?.focus()
  }

  const displaySuggestions = value.length > 0 ? mockSuggestions : []
  const displayRecentSearches = value.length === 0 ? mockRecentSearches : []

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Search Input */}
      <div className={cn(
        "relative flex items-center transition-all duration-200",
        isFocused ? "ring-2 ring-amber-500/20" : "",
        "bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
      )}>
        <Search className="absolute left-3 w-4 h-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-transparent border-0 outline-none text-gray-900 placeholder-gray-500"
        />
        {value && (
          <button
            onClick={clearSearch}
            className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (displaySuggestions.length > 0 || displayRecentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
          >
            {/* Recent Searches */}
            {displayRecentSearches.length > 0 && (
              <div className="border-b border-gray-100">
                <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Buscas Recentes
                </div>
                {displayRecentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                  >
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700">{search}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Suggestions */}
            {displaySuggestions.length > 0 && (
              <div>
                {displayRecentSearches.length > 0 && (
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    Sugestões
                  </div>
                )}
                {displaySuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span className="text-gray-700">
                      {suggestion.split('').map((char, charIndex) => {
                        const isMatch = value.toLowerCase().includes(char.toLowerCase())
                        return (
                          <span
                            key={charIndex}
                            className={isMatch ? 'font-medium text-amber-600' : ''}
                          >
                            {char}
                          </span>
                        )
                      })}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Quick Actions */}
            <div className="border-t border-gray-100 p-2">
              <div className="text-xs text-gray-500 text-center">
                Pressione Enter para buscar "{value}"
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
